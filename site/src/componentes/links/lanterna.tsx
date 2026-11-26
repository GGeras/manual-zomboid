'use client'
import { useEffect, useRef } from 'react'

/** Luz quente que segue o ponteiro (ou o dedo) sobre a página de links. Só CSS vars: sem re-render. */
export function Lanterna() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current?.parentElement
    if (!el) return
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--lx', `${((e.clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty('--ly', `${((e.clientY - r.top) / r.height) * 100}%`)
    }
    el.addEventListener('pointermove', mover, { passive: true })
    return () => el.removeEventListener('pointermove', mover)
  }, [])
  return <div ref={ref} className="lanterna" aria-hidden />
}
