import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/jetbrains-mono/800.css'
import './globals.css'
import { Cabecalho } from '@/componentes/cabecalho'
import { Rodape } from '@/componentes/rodape'
import { SITE_URL } from '@/config/publico'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Manual Zomboid: dicas de Project Zomboid em 60 segundos', template: '%s · Manual Zomboid' },
  description: 'Dicas de Project Zomboid (Build 42) em Shorts de 60 segundos, cada dado conferido antes de virar vídeo. Guias que aprofundam cada vídeo e uma comunidade em português.',
  applicationName: 'Manual Zomboid',
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Manual Zomboid', images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Manual Zomboid' }] },
  twitter: { card: 'summary_large_image' },
  icons: { icon: [{ url: '/favicon.png', type: 'image/png' }], apple: '/jogo/logo-icone-192.webp' },
  alternates: { types: { 'application/rss+xml': '/rss.xml' } },
}
export const viewport: Viewport = { themeColor: '#111111', colorScheme: 'dark' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh flex flex-col">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] botao botao-vivo">Pular para o conteúdo</a>
        <Cabecalho />
        <main id="conteudo" className="flex-1">{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
