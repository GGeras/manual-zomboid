// Ícones de interface (traço simples, 24px). Os ícones do JOGO são os PNG reais em /jogo (componente Jogo abaixo).
import { cx } from '@/lib/util'

type P = { className?: string; titulo?: string }
const S = ({ className, titulo, children }: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cx('size-5 shrink-0', className)} aria-hidden={titulo ? undefined : true} role={titulo ? 'img' : undefined}>
    {titulo && <title>{titulo}</title>}{children}
  </svg>
)
export const Play = (p: P) => <S {...p}><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" /></S>
export const Discord = (p: P) => <S {...p}><path d="M8.5 7.5a13 13 0 0 1 7 0M7 16.5c3 1.5 7 1.5 10 0M8.6 4.8 7.9 3.6A15 15 0 0 0 4 5c-2 3-2.8 6.6-2.4 10.6a15 15 0 0 0 4.7 2.4l1-1.6M15.4 4.8l.7-1.2A15 15 0 0 1 20 5c2 3 2.8 6.6 2.4 10.6a15 15 0 0 1-4.7 2.4l-1-1.6" /><circle cx="9" cy="12" r="1.3" fill="currentColor" /><circle cx="15" cy="12" r="1.3" fill="currentColor" /></S>
export const Seta = (p: P) => <S {...p}><path d="M5 12h14M13 6l6 6-6 6" /></S>
export const Balao = (p: P) => <S {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></S>
export const Busca = (p: P) => <S {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></S>
export const Mais = (p: P) => <S {...p}><path d="M12 5v14M5 12h14" /></S>
export const Bandeira = (p: P) => <S {...p}><path d="M5 21V4m0 0h11l-2 4 2 4H5" /></S>
export const Compartilhar = (p: P) => <S {...p}><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></S>
export const Pino = (p: P) => <S {...p}><path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v8" /></S>
export const Check = (p: P) => <S {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></S>
export const Imagem = (p: P) => <S {...p}><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-9 9" /></S>
export const Camera = (p: P) => <S {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></S>
export const Fechar = (p: P) => <S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>
export const Menu = (p: P) => <S {...p}><path d="M4 7h16M4 12h16M4 17h16" /></S>
export const Sino = (p: P) => <S {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" /></S>
export const Email = (p: P) => <S {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></S>
export const Google = (p: P) => <S {...p}><path d="M20.5 12.2c0-.6 0-1.1-.1-1.7H12v3.3h4.8a4.2 4.2 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.5z" /><path d="M12 21c2.4 0 4.4-.8 5.9-2.2L15 16.5c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.3A9 9 0 0 0 12 21z" /><path d="M7 13.7a5.4 5.4 0 0 1 0-3.4V8H4a9 9 0 0 0 0 8z" /><path d="M12 6.6c1.3 0 2.5.5 3.4 1.3L18 5.4A9 9 0 0 0 4 8l3 2.3c.7-2.1 2.7-3.7 5-3.7z" /></S>
export const Negrito = (p: P) => <S {...p} ><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zm0 7h7a3.5 3.5 0 0 1 0 7H7z" /></S>
export const Italico = (p: P) => <S {...p}><path d="M10 5h8M6 19h8M14 5l-4 14" /></S>
export const Link = (p: P) => <S {...p}><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" /></S>
export const Lista = (p: P) => <S {...p}><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" fill="currentColor" /><circle cx="4.5" cy="12" r="1" fill="currentColor" /><circle cx="4.5" cy="18" r="1" fill="currentColor" /></S>
export const Citacao = (p: P) => <S {...p}><path d="M5 18V11a5 5 0 0 1 5-5M14 18v-7a5 5 0 0 1 5-5" /></S>
export const Relogio = (p: P) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></S>

/** Soco do "Brabo" (voto positivo). */
export function Soco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx('size-5 shrink-0', className)} aria-hidden fill="currentColor">
      <path d="M8.2 4.5c.9 0 1.6.6 1.8 1.4.4-.5 1-.8 1.7-.8.9 0 1.6.6 1.8 1.4.4-.4.9-.6 1.5-.6 1.1 0 2 .9 2 2v.6c.3-.2.7-.3 1.1-.3 1.1 0 1.9.9 1.9 2v3.3c0 3.8-2.8 6.9-6.6 6.9h-1.5c-2.5 0-4.6-1.4-5.6-3.5L4.4 13c-.5-1-.1-2.2.9-2.7.7-.3 1.5-.2 2 .3V6.5c0-1.1.4-2 .9-2z" />
    </svg>
  )
}

/** Ícone real do jogo (item ou moodle), em pixel art. */
export function Jogo({ nome, tamanho = 32, alt = '', className }: { nome: string; tamanho?: number; alt?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/jogo/${nome}.png`} width={tamanho} height={tamanho} alt={alt} loading="lazy" decoding="async" className={cx(nome.startsWith('itens/') && 'pixel', 'select-none', className)} />
}
export const Globo = (p: P) => <S {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></S>
export const Video = (p: P) => <S {...p}><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="m16 10.5 5-3v9l-5-3z" /></S>
export const Rede = (p: P) => <S {...p}><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></S>
