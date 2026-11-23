'use client'
import { useRef, useState } from 'react'
import { comprimir, type ImagemPronta, TIPOS_OK } from '@/lib/comunidade/imagens'
import { cx } from '@/lib/util'
import { Camera, Fechar, Imagem } from '../icones'

/** Arrastar, escolher, abrir a câmera (celular) ou colar (o colar é ligado no campo de texto pelo pai). Pede o texto alternativo. */
export type Ponte = React.MutableRefObject<((a: File[]) => void) | null>
export function SeletorImagens({ imagens, setImagens, max, ponte, compacto = false }: { imagens: ImagemPronta[]; setImagens: (f: (a: ImagemPronta[]) => ImagemPronta[]) => void; max: number; ponte?: Ponte; compacto?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const camera = useRef<HTMLInputElement>(null)
  const [arrastando, setArrastando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [processando, setProcessando] = useState(0)

  async function adicionar(arquivos: File[]) {
    setErro(null)
    const vagas = max - imagens.length
    if (vagas <= 0) return setErro(`Até ${max} imagens.`)
    if (arquivos.length > vagas) setErro(`Só cabem mais ${vagas}. As outras ficaram de fora.`)
    setProcessando((n) => n + Math.min(vagas, arquivos.length))
    for (const a of arquivos.slice(0, vagas)) {
      try { const img = await comprimir(a); setImagens((x) => (x.length < max ? [...x, img] : x)) } catch (e) { setErro((e as Error).message) } finally { setProcessando((n) => n - 1) }
    }
  }
  if (ponte) ponte.current = adicionar // o campo de texto manda as imagens coladas por aqui

  return (
    <div>
      {imagens.length > 0 && (
        <ul className={cx('mb-3 grid gap-2.5', compacto ? 'grid-cols-4' : 'grid-cols-2 sm:grid-cols-3')}>
          {imagens.map((img, i) => (
            <li key={img.previa.slice(-40) + i} className="overflow-hidden rounded-xl border border-borda bg-black">
              <div className="relative aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.previa} alt="" className="absolute inset-0 size-full object-cover" />
                <button type="button" onClick={() => setImagens((x) => x.filter((_, j) => j !== i))} className="absolute right-1.5 top-1.5 rounded-full bg-black/75 p-1.5 text-osso hover:bg-sangue hover:text-noite" aria-label={`Remover imagem ${i + 1}`}><Fechar className="size-4" /></button>
              </div>
              {!compacto && (
                <label className="block p-2">
                  <span className="sr-only">Descreva a imagem {i + 1}</span>
                  <input value={img.alt} maxLength={200} onChange={(e) => setImagens((x) => x.map((y, j) => (j === i ? { ...y, alt: e.target.value } : y)))} placeholder="Descreva a imagem (quem não vê agradece)" className="w-full bg-transparent text-xs text-osso placeholder:text-apagado focus:outline-none" />
                </label>
              )}
            </li>
          ))}
          {Array.from({ length: processando }, (_, i) => <li key={`p${i}`} className="aspect-[4/3] animate-pulse rounded-xl bg-white/[.06]" />)}
        </ul>
      )}
      {imagens.length < max && (
        <div onDragOver={(e) => { e.preventDefault(); setArrastando(true) }} onDragLeave={() => setArrastando(false)}
          onDrop={(e) => { e.preventDefault(); setArrastando(false); adicionar([...e.dataTransfer.files]) }}
          className={cx('flex flex-wrap items-center gap-2 rounded-xl border border-dashed transition-colors', compacto ? 'border-transparent' : 'border-white/15 p-3 sm:p-4', arrastando && '!border-vivo bg-vivo/[.06]')}>
          <button type="button" onClick={() => input.current?.click()} className="botao botao-contorno !min-h-9 !px-3 text-sm"><Imagem className="size-4" /> Imagem</button>
          <button type="button" onClick={() => camera.current?.click()} className="botao botao-contorno !min-h-9 !px-3 text-sm sm:hidden"><Camera className="size-4" /> Câmera</button>
          {!compacto && <span className="text-xs text-apagado">ou arraste, ou cole o print (Ctrl+V) no texto · até {max}</span>}
          <input ref={input} type="file" accept={TIPOS_OK.join(',')} multiple hidden onChange={(e) => { adicionar([...(e.target.files ?? [])]); e.target.value = '' }} />
          <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { adicionar([...(e.target.files ?? [])]); e.target.value = '' }} />
        </div>
      )}
      {erro && <p role="alert" className="mt-2 text-sm text-sangue">{erro}</p>}
    </div>
  )
}
