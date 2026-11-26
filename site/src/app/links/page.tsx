import type { Metadata } from 'next'
import Link from 'next/link'
import { discord, redes, youtube } from '@/config/publico'
import { Discord, Globo, Rede, Seta, Video } from '@/componentes/icones'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Todos os links do Manual Zomboid: site, YouTube, Discord e redes sociais.',
  alternates: { canonical: '/links' },
}

type Item = { href: string; rotulo: string; sub: string; icone: React.ReactNode; destaque?: boolean; externo?: boolean }

export default function Links() {
  const itens = [
    { href: '/', rotulo: 'Site', sub: 'Guias, vídeos e Comunidade', icone: <Globo />, destaque: true },
    youtube.canalUrl && { href: youtube.canalUrl, rotulo: 'YouTube', sub: 'Dicas de Project Zomboid em 60 segundos', icone: <Video />, externo: true },
    discord.convite && { href: discord.convite, rotulo: 'Discord', sub: 'Entre no servidor e jogue junto', icone: <Discord />, externo: true },
    redes.instagram && { href: redes.instagram, rotulo: 'Instagram', sub: 'Reels do canal', icone: <Rede />, externo: true },
    redes.tiktok && { href: redes.tiktok, rotulo: 'TikTok', sub: 'Os Shorts também aqui', icone: <Rede />, externo: true },
    redes.threads && { href: redes.threads, rotulo: 'Threads', sub: 'Conversa e novidades', icone: <Rede />, externo: true },
    redes.facebook && { href: redes.facebook, rotulo: 'Facebook', sub: 'Reels e novidades', icone: <Rede />, externo: true },
  ].filter(Boolean) as Item[]
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 pb-24 pt-12 text-center sm:pt-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/jogo/logo-icone-192.webp" alt="" width={96} height={96} className="size-24 rounded-2xl" />
      <h1 className="titulo mt-5 text-[clamp(2rem,8vw,2.8rem)]">Manual <span className="text-sangue">Zomboid</span></h1>
      <p className="mt-2 text-sm text-osso-2">Dicas de Project Zomboid (Build 42) em 60 segundos.</p>
      <ul className="mt-8 w-full space-y-3">
        {itens.map((i) => (
          <li key={i.rotulo}>
            <Link
              href={i.href}
              {...(i.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`botao ${i.destaque ? 'botao-sangue' : 'botao-contorno'} !flex w-full !justify-start gap-3 !px-4 !py-3.5 text-left`}
            >
              {i.icone}
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-tight">{i.rotulo}</span>
                <span className="block text-xs font-medium opacity-75">{i.sub}</span>
              </span>
              <Seta className="size-4 opacity-70" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
