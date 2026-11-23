'use client'
// Imagens dos posts: o navegador comprime ANTES de enviar (site.md §4): WebP, no máx. 2048 px. Recodificar no canvas apaga o EXIF
// (inclusive localização). Só jpeg/png/webp/gif, até 8 MB antes de comprimir.
export const TIPOS_OK = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_BYTES = 8 * 1024 * 1024

export interface ImagemPronta { blob: Blob; previa: string; w: number; h: number; alt: string; nome: string }

/** "Screenshot_2026-11-20 base-na-escola.png" -> "base na escola" (sugestão de texto alternativo; a pessoa corrige). */
export function altDoNome(nome: string) {
  const base = nome.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').replace(/\b(screenshot|captura de tela|img|image|imagem|ss|steam|\d{4,}[\d\s.:]*)\b/gi, ' ').replace(/\s+/g, ' ').trim()
  return base.length >= 3 ? base.charAt(0).toUpperCase() + base.slice(1) : ''
}

export async function comprimir(arquivo: File, max = 2048, qualidade = 0.82): Promise<ImagemPronta> {
  if (!TIPOS_OK.includes(arquivo.type)) throw new Error('Só imagem: JPG, PNG, WebP ou GIF.')
  if (arquivo.size > MAX_BYTES) throw new Error('Imagem acima de 8 MB. Tente um print menor.')
  const bmp = await createImageBitmap(arquivo)
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * k), h = Math.round(bmp.height * k)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
  bmp.close()
  const blob = await new Promise<Blob>((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error('Não deu para ler essa imagem.'))), 'image/webp', qualidade))
  const previa = await new Promise<string>((ok) => { const r = new FileReader(); r.onload = () => ok(String(r.result)); r.readAsDataURL(blob) })
  return { blob, previa, w, h, alt: altDoNome(arquivo.name), nome: arquivo.name }
}

/** Pega imagens de um evento de colar (Ctrl+V de print). */
export const imagensDoColar = (e: ClipboardEvent | React.ClipboardEvent) =>
  [...(e.clipboardData?.items ?? [])].filter((i) => i.kind === 'file' && i.type.startsWith('image/')).map((i) => i.getAsFile()).filter(Boolean) as File[]
