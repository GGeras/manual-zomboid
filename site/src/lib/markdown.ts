// Markdown simples e SEGURO para posts da Comunidade: tudo é escapado primeiro; só sobram negrito, itálico, código,
// links http(s)/relativos, listas, citações e parágrafos. YouTube vira player leve; Steam/Workshop vira cartão.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const URL_OK = /^(https?:\/\/[^\s"'<>]+|\/[^\s"'<>]*)$/

export function youtubeId(url: string): string | null {
  const m = url.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)
  return m?.[1] ?? null
}
export const ehSteam = (url: string) => /^https?:\/\/(store\.steampowered\.com|steamcommunity\.com)\//.test(url)

function inline(t: string): string {
  return t
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, txt, href) => {
      const h = href.replace(/&amp;/g, '&')
      if (!URL_OK.test(h)) return m
      const ext = h.startsWith('http')
      return `<a href="${esc(h)}"${ext ? ' rel="nofollow ugc noopener" target="_blank"' : ''}>${txt}</a>`
    })
    .replace(/(^|\s)(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, (m, pre, href) => {
      const h = href.replace(/&amp;/g, '&')
      return URL_OK.test(h) ? `${pre}<a href="${esc(h)}" rel="nofollow ugc noopener" target="_blank">${href}</a>` : m
    })
}

export interface Bloco { tipo: 'html' | 'youtube' | 'steam'; valor: string }

/** Converte em blocos: HTML seguro + embeds (para o componente renderizar o player leve / cartão). */
export function markdown(fonte: string): Bloco[] {
  const blocos: Bloco[] = []
  const linhas = esc(fonte.replace(/\r\n?/g, '\n')).split('\n')
  let i = 0
  const html = (h: string) => blocos.push({ tipo: 'html', valor: h })
  while (i < linhas.length) {
    const l = linhas[i]
    const so = l.trim().replace(/&amp;/g, '&')
    if (!l.trim()) { i++; continue }
    if (youtubeId(so)) { blocos.push({ tipo: 'youtube', valor: youtubeId(so)! }); i++; continue }
    if (ehSteam(so) && URL_OK.test(so)) { blocos.push({ tipo: 'steam', valor: so }); i++; continue }
    if (/^\s*[-*] /.test(l)) {
      const itens: string[] = []
      while (i < linhas.length && /^\s*[-*] /.test(linhas[i])) itens.push(`<li>${inline(linhas[i++].replace(/^\s*[-*] /, ''))}</li>`)
      html(`<ul>${itens.join('')}</ul>`); continue
    }
    if (/^\s*\d+[.)] /.test(l)) {
      const itens: string[] = []
      while (i < linhas.length && /^\s*\d+[.)] /.test(linhas[i])) itens.push(`<li>${inline(linhas[i++].replace(/^\s*\d+[.)] /, ''))}</li>`)
      html(`<ol>${itens.join('')}</ol>`); continue
    }
    if (/^&gt; ?/.test(l)) {
      const q: string[] = []
      while (i < linhas.length && /^&gt; ?/.test(linhas[i])) q.push(inline(linhas[i++].replace(/^&gt; ?/, '')))
      html(`<blockquote>${q.join('<br>')}</blockquote>`); continue
    }
    const p: string[] = []
    while (i < linhas.length && linhas[i].trim() && !/^\s*([-*]|\d+[.)]) /.test(linhas[i]) && !/^&gt;/.test(linhas[i]) && !youtubeId(linhas[i].trim())) p.push(inline(linhas[i++]))
    html(`<p>${p.join('<br>')}</p>`)
  }
  return blocos
}

/** Texto puro para resumo e meta description. */
export const textoPuro = (md: string, max = 180) => {
  const t = md.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*`>#]/g, '').replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t
}
