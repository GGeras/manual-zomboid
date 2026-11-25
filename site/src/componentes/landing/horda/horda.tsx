'use client'
// Ilha da abertura 3D. Sem 3D (movimento reduzido, sem WebGL, economia de dados, antes de carregar): as placas viram cartões
// normais logo abaixo do título, então todo caminho (Tierlists, Comunidade, Discord, Guias, Shorts) funciona sem JS pesado.
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cx } from '@/lib/util'
import { Discord, Jogo, Play, Seta } from '../../icones'

export interface TopicoHorda { id: string; titulo: string; linha: string; href: string; icone: string | null; cor: string; externo?: boolean; modelo: number; casa: [number, number]; casaRetrato: [number, number] }

const ICONE_SVG: Record<string, React.ReactNode> = { discord: <Discord className="size-[1.15rem]" />, shorts: <Play className="size-4" /> }

export function Horda({ topicos }: { topicos: TopicoHorda[] }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const placas = useRef<(HTMLAnchorElement | null)[]>([])
  const [modo, setModo] = useState<'estatico' | 'carregando' | '3d'>('estatico')
  const [mirado, setMirado] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || nav.connection?.saveData) return
    if (!document.createElement('canvas').getContext('webgl2')) return
    let ctrl: { destruir(): void } | null = null, vivo = true
    const leve = innerWidth < 768 || (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4
    const r0 = c.getBoundingClientRect(), retrato = r0.width < r0.height // mesmo critério da cena (vista pela largura)
    const iniciar = async () => {
      if (!vivo) return
      setModo('carregando')
      try {
        const { iniciarHorda } = await import('./cena')
        if (!vivo) return
        ctrl = await iniciarHorda({
          canvas: c, placas: placas.current, horda: leve ? 2 : 4, leve,
          topicos: topicos.map((t) => ({ modelo: t.modelo, casa: retrato ? t.casaRetrato : t.casa })),
          aoPronto: () => { if (!vivo) return; setModo('3d'); document.getElementById('abertura')?.setAttribute('data-horda', '') },
          aoMirar: (i) => setMirado(i),
          aoAbrir: (i) => { const t = topicos[i]; if (t.externo) window.open(t.href, '_blank', 'noopener'); else router.push(t.href) },
        })
        if (!vivo) ctrl.destruir()
      } catch { if (vivo) setModo('estatico') }
    }
    // só depois que a página já apareceu (não disputa com o LCP)
    const ric = (window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const id = ric ? ric(iniciar, { timeout: 2500 }) : window.setTimeout(iniciar, 1200)
    return () => { vivo = false; if (!ric) clearTimeout(id); ctrl?.destruir() }
  }, [topicos, router])

  const tres = modo === '3d'
  return (
    <>
      <canvas ref={canvas} aria-hidden className={cx('absolute inset-0 z-0 size-full touch-pan-y transition-opacity duration-[1400ms]', tres ? 'opacity-100' : 'opacity-0')} />
      <div aria-hidden className="vinheta z-[5]" />
      <nav aria-label="Escolha seu caminho" className={cx(tres ? 'pointer-events-none absolute inset-0 z-20' : 'absolute inset-x-0 bottom-0 z-20 mx-auto max-w-7xl px-4 pb-20 sm:px-6')}>
        {!tres && <p className="hud mb-3 text-[.66rem] text-apagado">Escolha seu caminho</p>}
        <ul className={cx(tres ? 'contents' : 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5')}>
          {topicos.map((t, i) => (
            <li key={t.id} className={cx(tres && 'contents')}>
              <a ref={(el) => { placas.current[i] = el }} href={t.href} {...(t.externo ? { target: '_blank', rel: 'noopener' } : {})}
                onClick={(e) => { if (!t.externo && t.href.startsWith('/')) { e.preventDefault(); router.push(t.href) } }}
                data-mirado={mirado === i ? '' : undefined}
                style={{ ['--cor' as string]: t.cor }}
                className={cx('placa group', tres ? 'placa-3d pointer-events-auto' : 'placa-cartao')}>
                <span className="placa-icone">{t.icone ? <Jogo nome={t.icone} tamanho={24} className="size-6" /> : ICONE_SVG[t.id]}</span>
                <span className="min-w-0">
                  <span className="placa-titulo">{t.titulo}</span>
                  <span className="placa-linha">{t.linha}</span>
                </span>
                <Seta className="placa-seta size-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
