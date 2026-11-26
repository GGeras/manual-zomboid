import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { Lanterna } from '@/componentes/links/lanterna'
import { discord, redes, youtube } from '@/config/publico'
import { Discord, Facebook, Globo, Instagram, Seta, Threads, TikTok, YouTube } from '@/componentes/icones'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Todos os links do Manual Zomboid: site, YouTube, Discord e redes sociais.',
  alternates: { canonical: '/links' },
}

type Item = { href: string; rotulo: string; sub: string; icone: React.ReactNode; cor: string; principal?: boolean; externo?: boolean }

export default function Links() {
  const itens = [
    { href: '/', rotulo: 'Site', sub: 'Guias, vídeos e Comunidade', icone: <Globo className="size-6" />, cor: '#ff3d55', principal: true },
    youtube.canalUrl && { href: youtube.canalUrl, rotulo: 'YouTube', sub: 'Shorts de 60 segundos', icone: <YouTube className="size-6" />, cor: '#ff3030', externo: true },
    discord.convite && { href: discord.convite, rotulo: 'Discord', sub: 'Entre e jogue junto', icone: <Discord className="size-6" />, cor: '#7b8cff', externo: true },
    redes.instagram && { href: redes.instagram, rotulo: 'Instagram', sub: '@manualzomboid', icone: <Instagram className="size-6" />, cor: '#ff5fa2', externo: true },
    redes.tiktok && { href: redes.tiktok, rotulo: 'TikTok', sub: '@manualzomboid', icone: <TikTok className="size-6" />, cor: '#3be8e0', externo: true },
    redes.threads && { href: redes.threads, rotulo: 'Threads', sub: '@manualzomboid', icone: <Threads className="size-6" />, cor: '#efe5cf', externo: true },
    redes.facebook && { href: redes.facebook, rotulo: 'Facebook', sub: 'Página do canal', icone: <Facebook className="size-6" />, cor: '#4c8dff', externo: true },
  ].filter(Boolean) as Item[]

  return (
    <div className="relative isolate overflow-hidden bg-breu">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,61,85,.18),transparent_70%),linear-gradient(180deg,#0b0d12,#06070a)]" aria-hidden />
      <div className="neblina -z-10" aria-hidden />
      <div className="neblina b -z-10" aria-hidden />
      <Lanterna />
      <div className="vinheta" style={{ opacity: 1 }} aria-hidden />
      <div className="grao absolute inset-0 overflow-hidden" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md flex-col items-center px-4 pb-20 pt-12 text-center sm:pt-16">
        <div className="logo-pulso relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jogo/logo-icone-192.webp" alt="" width={104} height={104} className="relative size-26 rounded-3xl ring-1 ring-white/10" />
        </div>
        <p className="hud mt-6 text-sangue cursor">Sobrevivente, escolha um caminho</p>
        <h1 className="titulo mt-3 text-[clamp(2.2rem,9vw,3.1rem)]">Manual <span className="text-sangue">Zomboid</span></h1>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-osso-2">Dicas de Project Zomboid (Build 42) em 60 segundos. Cada dado conferido antes de virar vídeo.</p>

        <ul className="mt-9 w-full space-y-3">
          {itens.map((i, n) => (
            <li key={i.rotulo} className="link-entra" style={{ '--n': n } as CSSProperties}>
              <a
                href={i.href}
                {...(i.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`link-cartao ${i.principal ? 'link-principal' : ''}`}
                style={{ '--cor': i.cor } as CSSProperties}
              >
                <span className="link-icone">{i.icone}</span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-[1.02rem] font-extrabold leading-tight">{i.rotulo}</span>
                  <span className="mt-0.5 block text-xs font-medium text-osso-2">{i.sub}</span>
                </span>
                <Seta className="link-seta size-4" />
              </a>
            </li>
          ))}
        </ul>
        <p className="hud mt-10 text-[.62rem] text-apagado">manualzomboid.site</p>
      </div>
    </div>
  )
}
