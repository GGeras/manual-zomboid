import Link from 'next/link'
import { discord } from '@/config/publico'
import { Menu } from './icones'
import { ContaBotao } from './conta-botao'

const NAV = [
  { href: '/#shorts', rotulo: 'Vídeos' },
  { href: '/guias', rotulo: 'Guias' },
  { href: '/comunidade', rotulo: 'Comunidade' },
  { href: discord.convite ?? '/#discord', rotulo: 'Discord' },
]

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[.06] bg-[#0c0c0e]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0c0c0e]/65">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="Manual Zomboid, página inicial">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jogo/logo-horizontal-480.webp" alt="" width={120} height={40} className="h-9 w-auto" />
        </Link>
        <nav aria-label="Principal" className="ml-4 hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.rotulo}><Link href={n.href} className="rounded-md px-3 py-2 text-[.93rem] font-semibold text-osso-2 transition-colors hover:bg-white/[.05] hover:text-osso">{n.rotulo}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/comunidade/novo" className="botao botao-contorno hidden !min-h-10 !px-3.5 text-sm sm:inline-flex">Criar tópico</Link>
          <ContaBotao />
          <details className="group relative md:hidden">
            <summary className="botao botao-fantasma !min-h-10 !px-2.5 list-none [&::-webkit-details-marker]:hidden" aria-label="Abrir menu"><Menu /></summary>
            <nav aria-label="Menu" className="absolute right-0 top-12 w-60 rounded-xl border border-borda bg-[#141416] p-2 shadow-2xl shadow-black/60">
              {NAV.map((n) => <Link key={n.rotulo} href={n.href} className="block rounded-lg px-3 py-3 font-semibold text-osso-2 hover:bg-white/5 hover:text-osso">{n.rotulo}</Link>)}
              <Link href="/comunidade/novo" className="botao botao-sangue mt-2 w-full">Criar tópico</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
