'use client'
import { useEffect } from 'react'

/** Liga a entrada suave dos blocos [data-revelar] quando aparecem na tela (uma vez). Sem JS ou com movimento reduzido: tudo já visível. */
export function Revelar() {
  useEffect(() => {
    const pendentes = () => [...document.querySelectorAll<HTMLElement>('[data-revelar]:not(.visivel)')]
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { pendentes().forEach((e) => e.classList.add('visivel')); return }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
    pendentes().forEach((e) => io.observe(e))
    // blocos que aparecem depois (listas que carregam no navegador, filtros): também entram, em vez de ficarem invisíveis
    const mo = new MutationObserver(() => pendentes().forEach((e) => io.observe(e)))
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])
  return null
}

/** A lanterna da abertura segue o ponteiro (ou o dedo). Atualiza só 2 variáveis CSS, uma vez por quadro. */
export function Lanterna({ alvo }: { alvo: string }) {
  useEffect(() => {
    const el = document.getElementById(alvo)
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, x = 0, y = 0
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect(); x = ((e.clientX - r.left) / r.width) * 100; y = ((e.clientY - r.top) / r.height) * 100
      if (!raf) raf = requestAnimationFrame(() => { el.style.setProperty('--lx', `${x}%`); el.style.setProperty('--ly', `${y}%`); raf = 0 })
    }
    el.addEventListener('pointermove', mover, { passive: true })
    return () => { el.removeEventListener('pointermove', mover); cancelAnimationFrame(raf) }
  }, [alvo])
  return null
}
