'use client'
import { useState } from 'react'
import { cx } from '@/lib/util'
import { Play } from './icones'

/** Player leve: só a miniatura até o clique (o iframe do YouTube pesa ~1 MB). Vertical para Shorts (a hqdefault 4:3 cortada em 9:16 = a capa). */
export function LiteYoutube({ id, titulo, vertical = false, className }: { id: string; titulo: string; vertical?: boolean; className?: string }) {
  const [tocar, setTocar] = useState(false)
  return (
    <div className={cx('relative overflow-hidden rounded-xl bg-black', vertical ? 'aspect-[9/16]' : 'aspect-video', className)}>
      {tocar ? (
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`} title={titulo} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="absolute inset-0 size-full" />
      ) : (
        <button type="button" onClick={() => setTocar(true)} className="group absolute inset-0 size-full" aria-label={`Assistir: ${titulo}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sangue text-noite shadow-xl transition-transform group-hover:scale-110"><Play className="size-6 translate-x-0.5" /></span>
        </button>
      )}
    </div>
  )
}
