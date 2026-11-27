'use client'
// Olhos no escuro: de vez em quando um par de olhos aparece numa margem da página, pisca e some — como um zumbi olhando
// do mato. Discreto de propósito (para quem repara em detalhe): nunca por cima do texto, some quando o ponteiro chega perto.
import { useEffect, useRef } from 'react'

export function Olhos() {
  const camada = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const raiz = camada.current; if (!raiz) return
    const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches
    let vivo = true, px = -999, py = -999
    const timers = new Set<number>()
    const depois = (ms: number, f: () => void) => { const t = window.setTimeout(() => { timers.delete(t); if (vivo) f() }, ms); timers.add(t) }
    const mover = (e: PointerEvent) => { px = e.clientX; py = e.clientY }
    addEventListener('pointermove', mover, { passive: true })

    function par() {
      if (document.hidden || scrollY < innerHeight * 0.6) return depois(4000, par) // na abertura já tem zumbi demais
      const w = innerWidth, h = innerHeight
      // só nas margens: fora da coluna de conteúdo (max-w-7xl = 1280 px) ou, em tela estreita, colado na borda
      const margem = Math.max(18, (w - 1280) / 2)
      const lado = Math.random() < 0.5 ? 0 : 1
      const folga = Math.max(0, margem - 26), x = lado ? w - margem + Math.random() * folga : 6 + Math.random() * folga
      const y = h * (0.15 + Math.random() * 0.7)
      const pequeno = margem < 60
      const el = document.createElement('div'); el.className = 'olhos'
      const tam = pequeno ? 4 + Math.random() * 2 : 6 + Math.random() * 4
      el.style.cssText = `left:${x}px;top:${y}px;--olho:${tam}px;--vao:${tam * (1.1 + Math.random() * 0.6)}px;--forca:${pequeno ? 0.35 : 0.45 + Math.random() * 0.3};--pisca:${3 + Math.random() * 3}s;--inclina:${(Math.random() - 0.5) * 12}deg`
      el.innerHTML = '<i></i><i></i>'
      raiz!.appendChild(el)
      requestAnimationFrame(() => el.setAttribute('data-vivo', ''))
      const fica = 3500 + Math.random() * 4500
      // viu o ponteiro chegando: some rápido
      const vigiar = window.setInterval(() => { if (Math.hypot(px - x, py - y) < 140) { el.setAttribute('data-fugindo', ''); clearInterval(vigiar) } }, 120)
      timers.add(vigiar) // clearTimeout também limpa intervalo (mesma fila de ids)
      depois(fica, () => { el.removeAttribute('data-vivo'); clearInterval(vigiar) })
      depois(fica + 1600, () => el.remove())
      depois(fica + 5000 + Math.random() * 9000, par)
    }
    depois(calmo ? 15000 : 6000, par)
    return () => { vivo = false; timers.forEach(clearTimeout); removeEventListener('pointermove', mover); raiz.replaceChildren() }
  }, [])
  return <div ref={camada} aria-hidden />
}
