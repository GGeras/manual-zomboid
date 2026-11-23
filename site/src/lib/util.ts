export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

const RTF = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
/** "há 3 horas", "ontem"... (curto e humano) */
export function tempoRelativo(iso: string, agora = Date.now()): string {
  const s = Math.round((new Date(iso).getTime() - agora) / 1000)
  const a = Math.abs(s)
  if (a < 60) return 'agora'
  if (a < 3600) return RTF.format(Math.round(s / 60), 'minute')
  if (a < 86400) return RTF.format(Math.round(s / 3600), 'hour')
  if (a < 86400 * 30) return RTF.format(Math.round(s / 86400), 'day')
  if (a < 86400 * 365) return RTF.format(Math.round(s / (86400 * 30)), 'month')
  return RTF.format(Math.round(s / (86400 * 365)), 'year')
}
export const dataCurta = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' })

/** busca sem acento e sem caixa (igual ao unaccent do Postgres) */
export const semAcento = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export const plural = (n: number, um: string, varios: string) => `${n.toLocaleString('pt-BR')} ${n === 1 ? um : varios}`
