// Preloader da abertura: aparece já no primeiro quadro (vem no HTML do servidor, sem piscar) e cobre a tela enquanto a rua 3D,
// os zumbis e os sprites do jogo carregam. Quem move a barra é a horda (horda.tsx -> preloader*): progresso de verdade do
// download do pacote, das texturas dos zumbis, dos sprites da rua e do primeiro quadro.
// Segurança: sem JavaScript ele nem aparece (CSS); se algo travar, some sozinho depois de alguns segundos (CSS) e tem "Pular".
// Textos: só clima, nenhuma regra do jogo (regra nº 1 do repo).

const SEGMENTOS = 24
// olhos no escuro ao fundo: posição (%), tamanho e atraso, fixos (o HTML do servidor e o do navegador ficam iguais)
const OLHOS: [number, number, number, number][] = [[12, 22, 6, 0.4], [84, 30, 5, 1.9], [20, 74, 4, 3.1], [76, 68, 7, 0.9], [48, 14, 4, 2.6], [90, 84, 5, 4.2]]

export function Preloader() {
  return (
    <div id="preloader" data-estado="carregando" role="status" aria-live="polite" aria-label="Carregando Knox County">
      <div aria-hidden className="pl-fundo">
        <span className="pl-feixe" />
        <span className="pl-chuva" />
        {OLHOS.map(([x, y, t, d], k) => (
          <span key={k} className="pl-olhos" style={{ left: `${x}%`, top: `${y}%`, ['--olho' as string]: `${t}px`, animationDelay: `${d}s` }}><i /><i /></span>
        ))}
      </div>
      <div className="pl-centro">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/jogo/logo-emblema-256.webp" alt="" width={256} height={256} className="pl-logo" decoding="async" fetchPriority="high" />
        <p className="pl-hud" aria-hidden>Knox County <span className="text-white/25">/</span> noite <span className="text-white/25">/</span> chuva fina</p>
        <div className="pl-barra" aria-hidden>
          {Array.from({ length: SEGMENTOS }, (_, k) => <i key={k} />)}
        </div>
        <p className="pl-linha">
          <span className="pl-etapa">Abrindo o mapa</span>
          <span className="pl-pct" aria-hidden>0%</span>
        </p>
      </div>
      <button type="button" className="pl-pular" data-pular>Pular <span aria-hidden>›</span></button>
    </div>
  )
}

/** Fala com o preloader do HTML (se ele existir nesta página). Usado pela horda. */
const ETAPAS = { baixando: 'Trazendo a horda', vestindo: 'Vestindo os zumbis', montando: 'Montando a rua', acendendo: 'Acendendo os postes' } as const
export type EtapaCarga = keyof typeof ETAPAS
export function preloaderProgresso(p: number, etapa: EtapaCarga) {
  const el = document.getElementById('preloader'); if (!el || el.dataset.estado !== 'carregando') return
  const pct = Math.round(Math.max(0, Math.min(1, p)) * 100), segs = el.querySelectorAll<HTMLElement>('.pl-barra i'), acesos = Math.round((pct / 100) * segs.length)
  segs.forEach((s, k) => s.toggleAttribute('data-on', k < acesos))
  const e = el.querySelector('.pl-etapa'), n = el.querySelector('.pl-pct')
  if (e && e.textContent !== ETAPAS[etapa]) e.textContent = ETAPAS[etapa]
  if (n) n.textContent = `${pct}%`
}
/** Fecha o preloader (com a saída animada). minimo: tempo mínimo na tela desde a entrada, para não piscar. */
export function preloaderFechar(minimo = 700) {
  const el = document.getElementById('preloader'); if (!el || el.dataset.estado !== 'carregando') return
  const falta = Math.max(0, minimo - performance.now())
  window.setTimeout(() => {
    preloaderProgresso(1, 'acendendo')
    el.dataset.estado = 'pronto'
    window.setTimeout(() => { el.dataset.estado = 'fim' }, 1100)
  }, falta)
}
/** botão "Pular": fecha na hora (a rua continua carregando por trás) */
export function preloaderLigarPular() {
  const b = document.querySelector<HTMLButtonElement>('#preloader [data-pular]'); if (!b) return () => {}
  const f = () => preloaderFechar(0); b.addEventListener('click', f); return () => b.removeEventListener('click', f)
}
