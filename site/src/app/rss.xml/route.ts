import { SITE_URL } from '@/config/publico'
import { guias } from '@/lib/conteudo'

export const dynamic = 'force-static'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function GET() {
  const itens = guias().map((g) => `<item><title>${esc(g.titulo)}</title><link>${SITE_URL}/guias/${g.slug}</link><guid>${SITE_URL}/guias/${g.slug}</guid><pubDate>${new Date(g.data).toUTCString()}</pubDate><description>${esc(g.resumo)}</description></item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Manual Zomboid: Guias</title><link>${SITE_URL}/guias</link><description>Guias de Project Zomboid conferidos no arquivo do jogo.</description><language>pt-BR</language>${itens}</channel></rss>`
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } })
}
