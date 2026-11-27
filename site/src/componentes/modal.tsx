'use client'
// Modal acessível (<dialog> nativo): foco preso, Esc fecha, clique fora fecha, rolagem da página travada.
import { useEffect, useRef } from 'react'
import { cx } from '@/lib/util'
import { Fechar } from './icones'

export function Modal({ aberto, fechar, titulo, children, largura = 'max-w-3xl' }: { aberto: boolean; fechar: () => void; titulo: string; children: React.ReactNode; largura?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current; if (!d) return
    if (aberto && !d.open) { d.showModal(); document.documentElement.style.overflow = 'hidden' }
    if (!aberto && d.open) d.close()
    return () => { document.documentElement.style.overflow = '' }
  }, [aberto])
  return (
    <dialog ref={ref} aria-label={titulo} onClose={() => { document.documentElement.style.overflow = ''; fechar() }}
      onClick={(e) => { if (e.target === ref.current) fechar() }}
      className={cx('modal m-auto w-[calc(100%-1.5rem)] overflow-visible bg-transparent p-0 text-osso backdrop:bg-black/75 backdrop:backdrop-blur-sm', largura)}>
      {aberto && (
        <div className="relative max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-2xl border border-borda bg-[#121214] shadow-[0_40px_120px_-20px_rgba(0,0,0,.95)]">
          <button type="button" onClick={fechar} aria-label="Fechar" className="absolute right-2.5 top-2.5 z-10 grid size-10 place-items-center rounded-full bg-black/40 text-osso-2 hover:bg-white/10 hover:text-osso"><Fechar className="size-5" /></button>
          {children}
        </div>
      )}
    </dialog>
  )
}
