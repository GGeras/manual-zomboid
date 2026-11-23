// Guias (content/guias/*.mdx, embutidos no build em src/gerado/guias.json) e fatos validados. Só servidor.
import fatosJson from '@/gerado/fatos.json'
import guiasJson from '@/gerado/guias.json'

export interface Fato { texto: string; build: string; fonte: string }
export const FATOS = fatosJson as Record<string, Fato>

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
