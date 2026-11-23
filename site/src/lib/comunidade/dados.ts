// Leitura da Comunidade no servidor. Uma interface, duas fontes:
//  - modo prévia (sem chaves): dados de exemplo (demo.ts);
//  - modo real: Supabase `manual-zomboid-comunidade` (migração em site/supabase/migrations), lendo com a chave pública + RLS.
import { CONFIG, comunidadeAtiva } from '@/config/publico'
import { dadosDemo, PERFIS } from './demo'
import { arvore, buscar, ordenar } from './quente'
import type { Comentario, Filtro, Perfil, Topico } from './tipos'

export interface FonteComunidade {
  topicos(f?: Filtro): Promise<Topico[]>
  topico(id: string): Promise<Topico | null>
  comentarios(topico: string): Promise<ReturnType<typeof arvore>>
  perfil(usuario: string): Promise<Perfil | null>
  contagem(): Promise<{ topicos: number; comentarios: number; pessoas: number }>
}

const demo: FonteComunidade = {
  async topicos(f = {}) {
    const { topicos } = dadosDemo()
    const lista = buscar(topicos, f.q, f.categoria, f.build).filter((t) => !f.autor || t.autor.usuario === f.autor)
    return ordenar(lista, f.ordem).slice(0, f.limite ?? 50)
  },
  async topico(id) { return dadosDemo().topicos.find((t) => t.id === id) ?? null },
  async comentarios(topico) { return arvore(dadosDemo().comentarios.filter((c) => c.topico === topico)) },
  async perfil(usuario) { return PERFIS[usuario] ?? null },
  async contagem() {
    const { topicos, comentarios } = dadosDemo()
    return { topicos: topicos.length, comentarios: comentarios.length, pessoas: Object.keys(PERFIS).length }
  },
}

// ---------- modo real (ativa sozinho quando config.publico.json tiver comunidade.supabaseUrl + chave pública) ----------
type Linha = Record<string, unknown>
const SELECT_TOPICO = 'id,categoria,titulo,corpo,imagens,build,dia,episodio,votos,comentarios,fixado,travado,resolvido,criado_em,editado_em,autor:perfis(usuario,nome,avatar_url,bio,papel,criado_em)'
const perfilDe = (p: Linha): Perfil => ({ usuario: String(p.usuario), nome: String(p.nome ?? p.usuario), avatar: (p.avatar_url as string) ?? null, bio: String(p.bio ?? ''), papel: p.papel as Perfil['papel'], criadoEm: String(p.criado_em) })
const autorOu = (p: unknown): Perfil => (p ? perfilDe(p as Linha) : { usuario: 'conta-apagada', nome: '[conta apagada]', avatar: null, bio: '', papel: 'usuario', criadoEm: '' })
const topicoDe = (r: Linha): Topico => ({
  id: String(r.id), autor: autorOu(r.autor), categoria: String(r.categoria), titulo: String(r.titulo), corpo: String(r.corpo),
  imagens: (r.imagens as Topico['imagens']) ?? [], build: (r.build as string) ?? null, dia: (r.dia as number) ?? null, episodio: (r.episodio as string) ?? null,
  votos: Number(r.votos), comentarios: Number(r.comentarios), fixado: Boolean(r.fixado), travado: Boolean(r.travado), resolvido: Boolean(r.resolvido),
  criadoEm: String(r.criado_em), editadoEm: (r.editado_em as string) ?? null,
})

async function cliente() {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(CONFIG.comunidade.supabaseUrl!, CONFIG.comunidade.supabaseChavePublica!, { auth: { persistSession: false } })
}

const real: FonteComunidade = {
  async topicos(f = {}) {
    const sb = await cliente()
    let q = sb.from('topicos').select(SELECT_TOPICO).eq('estado', 'publicado').limit(f.limite ?? 50)
    if (f.categoria) q = q.eq('categoria', f.categoria)
    if (f.build) q = q.eq('build', f.build)
    if (f.q) q = q.textSearch('busca', f.q, { type: 'websearch', config: 'portuguese_unaccent' })
    if (f.ordem === 'novos') q = q.order('criado_em', { ascending: false })
    else if (f.ordem === 'semana') q = q.gte('criado_em', new Date(Date.now() - 7 * 864e5).toISOString()).order('votos', { ascending: false })
    else if (f.ordem === 'sem-resposta') q = q.eq('comentarios', 0).order('criado_em', { ascending: false })
    else q = q.order('fixado', { ascending: false }).order('quente', { ascending: false })
    const { data, error } = await q
    if (error) throw error
    const lista = (data as Linha[]).map(topicoDe)
    return f.autor ? lista.filter((t) => t.autor.usuario === f.autor) : lista
  },
  async topico(id) {
    const sb = await cliente()
    const { data } = await sb.from('topicos').select(SELECT_TOPICO).eq('id', id).maybeSingle()
    return data ? topicoDe(data as Linha) : null
  },
  async comentarios(topico) {
    const sb = await cliente()
    const { data, error } = await sb.from('comentarios').select('id,topico,pai,corpo,imagens,votos,melhor,criado_em,editado_em,autor:perfis(usuario,nome,avatar_url,bio,papel,criado_em)').eq('topico', topico).eq('estado', 'publicado')
    if (error) throw error
    return arvore((data as Linha[]).map((r): Comentario => ({
      id: String(r.id), topico: String(r.topico), pai: (r.pai as string) ?? null, autor: autorOu(r.autor), corpo: String(r.corpo),
      imagens: (r.imagens as Comentario['imagens']) ?? [], votos: Number(r.votos), melhor: Boolean(r.melhor), criadoEm: String(r.criado_em), editadoEm: (r.editado_em as string) ?? null,
    })))
  },
  async perfil(usuario) {
    const sb = await cliente()
    const { data } = await sb.from('perfis').select('usuario,nome,avatar_url,bio,papel,criado_em').eq('usuario', usuario).maybeSingle()
    return data ? perfilDe(data as Linha) : null
  },
  async contagem() {
    const sb = await cliente()
    const { data } = await sb.from('comunidade_numeros').select('*').maybeSingle()
    const d = (data ?? {}) as Linha
    return { topicos: Number(d.topicos ?? 0), comentarios: Number(d.comentarios ?? 0), pessoas: Number(d.pessoas ?? 0) }
  },
}

export const comunidade: FonteComunidade = comunidadeAtiva ? real : demo
export const modoPrevia = !comunidadeAtiva
