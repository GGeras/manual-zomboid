// Guias (content/guias/*.mdx, embutidos no build em src/gerado/guias.json) e fatos validados. Só servidor.
import fatosJson from '@/gerado/fatos.json'
import guiasJson from '@/gerado/guias.json'

export interface Fato { texto: string; build: string; fonte: string; eps: string[] }
export const FATOS = fatosJson as Record<string, Fato>

/** Dica = fato validado (texto exato de info-validada/), pronto para a tela: o site nunca escreve dado do jogo por conta própria. */
export interface Dica { id: string; texto: string; build: string; fonte: string }
const dica = ([id, f]: [string, Fato]): Dica => ({ id, texto: f.texto, build: f.build, fonte: f.fonte })
/** dicas dos episódios, na ordem dos episódios pedidos (o 1º episódio do tema vem primeiro) */
export function dicasDosEpisodios(eps: string[], limite = 99) {
  const pos = (f: Fato) => Math.min(...f.eps.map((e) => eps.indexOf(e)).filter((i) => i >= 0))
  return Object.entries(FATOS).filter(([, f]) => f.eps.some((e) => eps.includes(e))).sort(([, a], [, b]) => pos(a) - pos(b)).map(dica).slice(0, limite)
}

export * from './repo'

export interface Guia {
  slug: string
  titulo: string
  resumo: string
  data: string
  build: string
  episodio: string | null
  icone: string | null
  moodle: string | null
  fatos: string[]
  corpo: string
  minutos: number
}

type Bruto = Omit<Guia, 'minutos' | 'icone' | 'moodle'> & { icone?: string; moodle?: string }
const LISTA: Guia[] = (guiasJson as Bruto[]).map((g) => {
  const palavras = g.corpo.replace(/<Fato id="([^"]+)" \/>/g, (_, id) => FATOS[id]?.texto ?? '').split(/\s+/).length
  return { ...g, icone: g.icone ?? null, moodle: g.moodle ?? null, fatos: g.fatos ?? [], minutos: Math.max(1, Math.round(palavras / 200)) }
}).sort((a, b) => b.data.localeCompare(a.data))

export const guias = () => LISTA
export const guia = (slug: string) => LISTA.find((g) => g.slug === slug) ?? null

/** Corpo do guia em blocos: "## título", <Fato id="..." /> e parágrafos (Markdown simples). Sem eval: roda no Worker. */
export type BlocoGuia = { tipo: 'titulo'; texto: string } | { tipo: 'fato'; id: string } | { tipo: 'texto'; md: string }
export function blocosDoGuia(corpo: string): BlocoGuia[] {
  return corpo.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b): BlocoGuia => {
    const f = b.match(/^<Fato\s+id=["']([^"']+)["']\s*\/>$/)
    if (f) return { tipo: 'fato', id: f[1] }
    if (b.startsWith('## ')) return { tipo: 'titulo', texto: b.slice(3).trim() }
    return { tipo: 'texto', md: b }
  })
}
