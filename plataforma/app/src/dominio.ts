import { STATUS, type Episodio, type Status } from './tipos'

/** O que cada status significa para quem produz. */
export const STATUS_INFO: Record<Status, { nome: string; diz: string; cor: string }> = {
  rascunho: { nome: 'Rascunho', diz: 'roteiro em pesquisa', cor: 'var(--color-apagado)' },
  validado: { nome: 'Validado', diz: 'fatos ok, falta a prévia', cor: 'var(--color-alerta)' },
  aprovado: { nome: 'Aprovado', diz: 'prévia aprovada, falta o final', cor: 'var(--color-alerta)' },
  final: { nome: 'Final', diz: 'renderizado, esperando postar', cor: 'var(--color-vivo)' },
  publicado: { nome: 'Publicado', diz: 'no ar', cor: 'var(--color-osso)' },
}

export const etapa = (s: Status) => STATUS.indexOf(s)

/** Ordem de exibição: série principal pelo número, depois as séries gravadas. */
export function ordenar(eps: Episodio[]): Episodio[] {
  return [...eps].sort((a, b) => {
    if (a.serie !== b.serie) return a.serie === 'shorts' ? -1 : 1
    return (a.numero ?? 0) - (b.numero ?? 0) || a.slug.localeCompare(b.slug)
  })
}

export const rotulo = (e: Pick<Episodio, 'ep' | 'serie'>) =>
  e.serie === 'bases' ? e.ep.replace('bases-', 'B') : e.ep

export function contarPorStatus(eps: Episodio[]): Record<Status, number> {
  const c = Object.fromEntries(STATUS.map((s) => [s, 0])) as Record<Status, number>
  for (const e of eps) c[e.status]++
  return c
}

/** Dias de postagem do canal (canal/calendario-postagem.md): segunda, quarta e sexta, a partir das 18h. */
export const DIAS_POSTAGEM = [1, 3, 5]
export const HORA_POSTAGEM = 18

export function proximasPostagens(agora: Date, n: number): Date[] {
  const out: Date[] = []
  const d = new Date(agora)
  d.setHours(HORA_POSTAGEM, 0, 0, 0)
  if (d <= agora) d.setDate(d.getDate() + 1)
  while (out.length < n) {
    if (DIAS_POSTAGEM.includes(d.getDay())) out.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

/** Sugestão de fila: finais ainda não publicados, na ordem dos episódios. */
export const filaDePostagem = (eps: Episodio[]) => ordenar(eps).filter((e) => e.status === 'final')

export const dataCurta = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '')
