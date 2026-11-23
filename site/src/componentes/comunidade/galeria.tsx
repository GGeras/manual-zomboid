'use client'
import { useEffect, useRef, useState } from 'react'
import type { Imagem } from '@/lib/comunidade/tipos'
import { cx } from '@/lib/util'
import { Fechar } from '../icones'

/** Imagens do post: 1 grande, ou grade. Toque abre em tela cheia (setas e Esc). */
export function Galeria({ imagens }: { imagens: Imagem[] }) {
  const [aberta, setAberta] = useState<number | null>(null)
  const dlg = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (aberta != null) dlg.current?.showModal() }, [aberta])
  const tecla = (e: React.KeyboardEvent) => {
    if (aberta == null) return
    if (e.key === 'ArrowRight') setAberta((aberta + 1) % imagens.length)
    if (e.key === 'ArrowLeft') setAberta((aberta - 1 + imagens.length) % imagens.length)
  }
  return (
    <>
      <ul className={cx('mt-4 grid gap-1.5 overflow-hidden rounded-xl', imagens.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
        {imagens.map((img, i) => (
          <li key={img.url + i} className={cx(imagens.length === 3 && i === 0 && 'row-span-2')}>
            <button type="button" onClick={() => setAberta(i)} className="group relative block size-full overflow-hidden bg-black" aria-label={`Ampliar imagem ${i + 1}: ${img.alt}`}>
              {imagens.length === 1 && img.h > img.w && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-35 blur-2xl" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} width={img.w} height={img.h} loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
                className={cx('relative w-full transition-transform duration-500 group-hover:scale-[1.02]', imagens.length === 1 ? 'max-h-[70vh] object-contain' : 'aspect-square object-cover')} />
            </button>
          </li>
        ))}
      </ul>
      {aberta != null && (
        <dialog ref={dlg} onClose={() => setAberta(null)} onKeyDown={tecla} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close() }}
          className="m-0 size-full max-h-none max-w-none bg-black/95 p-0 backdrop:bg-black/90">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagens[aberta].url} alt={imagens[aberta].alt} className="absolute inset-0 m-auto max-h-[92vh] max-w-[96vw] object-contain" />
          <button type="button" onClick={() => dlg.current?.close()} className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-osso hover:bg-white/20" aria-label="Fechar"><Fechar /></button>
          {imagens.length > 1 && <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 font-mono text-sm">{aberta + 1}/{imagens.length}</p>}
          <p className="sr-only">{imagens[aberta].alt}</p>
        </dialog>
      )}
    </>
  )
}
