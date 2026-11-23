import Link from 'next/link'
import { discord, REPO_URL, youtube } from '@/config/publico'

export function Rodape() {
  const redes = [
    youtube.canalUrl && { href: youtube.canalUrl, rotulo: 'YouTube' },
    discord.convite && { href: discord.convite, rotulo: 'Discord' },
    { href: '/rss.xml', rotulo: 'RSS dos guias' },
  ].filter(Boolean) as { href: string; rotulo: string }[]
  return (
    <footer className="relative border-t border-white/[.06] bg-breu">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jogo/logo-horizontal-480.webp" alt="Manual Zomboid" width={168} height={56} className="h-14 w-auto" loading="lazy" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-apagado">Dicas de Project Zomboid em 60 segundos. Cada dado conferido (arquivo do jogo ou fonte da Build 42) antes de virar vídeo.</p>
        </div>
        <Coluna titulo="Site" links={[{ href: '/#shorts', rotulo: 'Vídeos' }, { href: '/guias', rotulo: 'Guias' }, { href: '/comunidade', rotulo: 'Comunidade' }, { href: '/comunidade/regras', rotulo: 'Regras da Comunidade' }]} />
        <Coluna titulo="Redes" links={redes} />
        <Coluna titulo="Legal" links={[{ href: '/termos', rotulo: 'Termos de uso' }, { href: '/privacidade', rotulo: 'Privacidade' }, { href: REPO_URL, rotulo: 'Código do site' }]} />
      </div>
      <div className="border-t border-white/[.05]">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs leading-relaxed text-apagado sm:px-6">
          Canal de fã, sem ligação com a The Indie Stone. Project Zomboid é marca da The Indie Stone. Imagens e modelos do jogo usados com fim informativo.
        </p>
      </div>
    </footer>
  )
}

function Coluna({ titulo, links }: { titulo: string; links: { href: string; rotulo: string }[] }) {
  return (
    <div>
      <p className="hud text-osso-2">{titulo}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => <li key={l.rotulo}><Link href={l.href} className="text-sm text-apagado transition-colors hover:text-osso">{l.rotulo}</Link></li>)}
      </ul>
    </div>
  )
}
