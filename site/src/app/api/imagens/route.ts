// Upload das imagens da Comunidade para o Cloudflare R2 (etapa S4).
// O navegador já manda WebP comprimido (≤ 2048 px, sem EXIF). Aqui: confere o login (JWT do Supabase da Comunidade),
// o tipo, o tamanho, e grava em img.<dominio>/<usuario>/<id>.webp.
// Até o R2 e o projeto Supabase existirem (configuracao.md §8), responde 503: no modo prévia as imagens ficam no navegador.
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { CONFIG } from '@/config/publico'

const MAX = 4 * 1024 * 1024 // WebP já comprimido; o limite de 8 MB vale ANTES da compressão
interface R2 { put(k: string, v: ArrayBuffer, o?: unknown): Promise<unknown> }

export async function POST(req: Request) {
  const { env } = await getCloudflareContext({ async: true })
  const bucket = (env as unknown as { IMAGENS?: R2 }).IMAGENS
  const { supabaseUrl, supabaseChavePublica } = CONFIG.comunidade
  if (!bucket || !supabaseUrl || !supabaseChavePublica || !CONFIG.site.dominioImagens) return Response.json({ erro: 'imagens ainda não configuradas' }, { status: 503 })

  const token = req.headers.get('authorization')?.replace(/^Bearer /, '')
  if (!token) return Response.json({ erro: 'entre para enviar' }, { status: 401 })
  const u = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: supabaseChavePublica, authorization: `Bearer ${token}` } })
  if (!u.ok) return Response.json({ erro: 'sessão inválida' }, { status: 401 })
  const { id: usuario } = (await u.json()) as { id: string }

  if (req.headers.get('content-type') !== 'image/webp') return Response.json({ erro: 'só WebP' }, { status: 415 })
  const corpo = await req.arrayBuffer()
  if (corpo.byteLength > MAX) return Response.json({ erro: 'grande demais' }, { status: 413 })
  const b = new Uint8Array(corpo.slice(0, 12))
  const ehWebp = String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP'
  if (!ehWebp) return Response.json({ erro: 'arquivo não é imagem' }, { status: 415 })

  const chave = `${usuario}/${crypto.randomUUID()}.webp`
  await bucket.put(chave, corpo, { httpMetadata: { contentType: 'image/webp', cacheControl: 'public, max-age=31536000, immutable' } })
  return Response.json({ url: `https://${CONFIG.site.dominioImagens}/${chave}` })
}
