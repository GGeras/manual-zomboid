// Dados externos públicos, todos opcionais: se a chave pública não existir ou a fonte cair, a seção mostra o estado "em breve".
import { CONFIG, discord, youtube } from '@/config/publico'
import { EPISODIOS } from './repo'

export interface Short { id: string | null; titulo: string; nn: string | null; publicado: string | null }

/** Shorts recentes: RSS público do canal (sem chave). Sem o ID do canal: os episódios publicados do repo, sem player. */
export async function shortsRecentes(limite = 8): Promise<{ fonte: 'youtube' | 'repo'; lista: Short[] }> {
  if (youtube.rss) {
    try {
      const xml = await (await fetch(youtube.rss, { next: { revalidate: 3600 } })).text()
      const lista = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, limite).map(([, e]) => ({
        id: e.match(/<yt:videoId>([^<]+)/)?.[1] ?? null,
        titulo: decode(e.match(/<title>([^<]+)/)?.[1] ?? ''),
        nn: null,
        publicado: e.match(/<published>([^<]+)/)?.[1] ?? null,
      }))
      if (lista.length) return { fonte: 'youtube', lista }
    } catch { /* cai para o repo */ }
  }
  const lista = EPISODIOS.filter((e) => e.status === 'publicado').reverse().slice(0, limite)
    .map((e) => ({ id: e.youtube, titulo: e.titulo ?? e.tema, nn: e.nn, publicado: null }))
  return { fonte: 'repo', lista }
}
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

export interface DiscordWidget { nome: string; online: number; convite: string | null }
export async function discordWidget(): Promise<DiscordWidget | null> {
  if (!discord.widget) return null
  try {
    const r = await fetch(discord.widget, { next: { revalidate: 600 } })
    if (!r.ok) return null
    const j = (await r.json()) as { name: string; presence_count: number; instant_invite: string | null }
    return { nome: j.name, online: j.presence_count, convite: discord.convite ?? j.instant_invite }
  } catch { return null }
}

export interface Noticia { url: string; titulo: string; resumo: string; build: string | null; data: string }
/** Atualizações do Zomboid: só as aprovadas na Central (view pública `pub_noticias`, etapa C6). Sem a view ainda: lista vazia. */
export async function noticiasAprovadas(limite = 3): Promise<Noticia[]> {
  const { supabaseUrl, supabaseChavePublica } = CONFIG.central
  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/pub_noticias?select=url,titulo,resumo_ptbr,build,data&order=data.desc&limit=${limite}`, {
      headers: { apikey: supabaseChavePublica, Authorization: `Bearer ${supabaseChavePublica}` },
      next: { revalidate: 3600 },
    })
    if (!r.ok) return []
    const j = (await r.json()) as { url: string; titulo: string; resumo_ptbr: string; build: string | null; data: string }[]
    return j.map((n) => ({ url: n.url, titulo: n.titulo, resumo: n.resumo_ptbr, build: n.build, data: n.data }))
  } catch { return [] }
}
