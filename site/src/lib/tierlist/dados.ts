// Leitura das tierlists no servidor. Uma interface, duas fontes (igual à Comunidade):
//  - modo prévia: oficiais + sugestões e votos de exemplo (demo.ts);
//  - modo real: Supabase `manual-zomboid-comunidade` (migração 20261125000000_tierlists.sql), com a chave pública + RLS.
//    No servidor o placar vem SEM nomes (view tierlist_placar); quem votou é buscado no navegador, só com login (tierlist_votantes).
import { CONFIG, comunidadeAtiva } from '@/config/publico'
import type { Perfil } from '../comunidade/tipos'
import { dadosDemo } from './demo'
import { OFICIAIS } from './oficiais'
import type { ComentarioTier, Tier, Tierlist, VotoTier } from './tipos'

export interface FonteTierlist {
  oficiais(): Promise<Tierlist[]>
  sugestoes(): Promise<Tierlist[]>
  uma(slug: string): Promise<Tierlist | null>
  votos(slug: string): Promise<VotoTier[]>
  comentarios(slug: string): Promise<ComentarioTier[]>
}

const demo: FonteTierlist = {
  async oficiais() { return dadosDemo().listas.filter((t) => t.tipo === 'oficial') },
  async sugestoes() { return dadosDemo().listas.filter((t) => t.tipo === 'sugestao').sort((a, b) => b.apoios - a.apoios) },
  async uma(slug) { return dadosDemo().listas.find((t) => t.slug === slug) ?? null },
  async votos(slug) { return dadosDemo().votos[slug] ?? [] },
  async comentarios(slug) { return dadosDemo().comentarios.filter((c) => c.tierlist === slug) },
}

// ---------- modo real ----------
type Linha = Record<string, unknown>
async function cliente() {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(CONFIG.comunidade.supabaseUrl!, CONFIG.comunidade.supabaseChavePublica!, { auth: { persistSession: false } })
}
const perfilDe = (p: Linha | null): Perfil | null => (p ? { usuario: String(p.usuario), nome: String(p.nome ?? p.usuario), avatar: (p.avatar_url as string) ?? null, bio: String(p.bio ?? ''), papel: p.papel as Perfil['papel'], criadoEm: String(p.criado_em) } : null)
const SELECT = 'slug,titulo,descricao,tipo,apoios,comentarios,votos,criado_em,autor:perfis(usuario,nome,avatar_url,bio,papel,criado_em),itens:tierlist_itens(id,nome,icone,ordem)'
const tierlistDe = (r: Linha): Tierlist => ({
  slug: String(r.slug), titulo: String(r.titulo), descricao: String(r.descricao ?? ''), tipo: r.tipo as Tierlist['tipo'], autor: perfilDe(r.autor as Linha | null),
  itens: ((r.itens as Linha[]) ?? []).sort((a, b) => Number(a.ordem) - Number(b.ordem)).map((i) => ({ id: String(i.id), nome: String(i.nome), icone: (i.icone as string) ?? null })),
  apoios: Number(r.apoios), comentarios: Number(r.comentarios), votos: Number(r.votos), criadoEm: String(r.criado_em),
})
const real: FonteTierlist = {
  async oficiais() {
    const { data } = await (await cliente()).from('tierlists').select(SELECT).eq('tipo', 'oficial').eq('estado', 'publicado').order('criado_em')
    return data?.length ? (data as Linha[]).map(tierlistDe) : OFICIAIS
  },
  async sugestoes() {
    const { data } = await (await cliente()).from('tierlists').select(SELECT).eq('tipo', 'sugestao').eq('estado', 'publicado').order('apoios', { ascending: false }).limit(50)
    return ((data as Linha[]) ?? []).map(tierlistDe)
  },
  async uma(slug) {
    const { data } = await (await cliente()).from('tierlists').select(SELECT).eq('slug', slug).maybeSingle()
    return data ? tierlistDe(data as Linha) : null
  },
  async votos(slug) {
    // placar agregado -> um "voto" sem nome por unidade (o quadro só precisa da contagem; nomes vêm do navegador com login)
    const { data } = await (await cliente()).from('tierlist_placar').select('item,tier,votos').eq('tierlist', slug)
    return ((data as Linha[]) ?? []).flatMap((l) => Array.from({ length: Number(l.votos) }, () => ({ item: String(l.item), tier: l.tier as Tier, usuario: null, criadoEm: '' })))
  },
  async comentarios(slug) {
    const { data } = await (await cliente()).from('tierlist_comentarios').select('id,tierlist,pai,corpo,apoios,criado_em,autor:perfis(usuario,nome,avatar_url,bio,papel,criado_em)').eq('tierlist', slug).eq('estado', 'publicado').order('criado_em')
    return ((data as Linha[]) ?? []).map((r) => ({ id: String(r.id), tierlist: String(r.tierlist), pai: (r.pai as string) ?? null, autor: perfilDe(r.autor as Linha) ?? { usuario: 'conta-apagada', nome: '[conta apagada]', avatar: null, bio: '', papel: 'usuario', criadoEm: '' }, corpo: String(r.corpo), apoios: Number(r.apoios), criadoEm: String(r.criado_em) }))
  },
}

export const tierlists: FonteTierlist = comunidadeAtiva ? real : demo
