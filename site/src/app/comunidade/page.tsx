import type { Metadata } from 'next'
import { Feed, lerOrdem } from '@/componentes/comunidade/feed'

export const metadata: Metadata = {
  title: 'Comunidade',
  description: 'A rede social do Project Zomboid em português: dúvidas, bases, histórias de morte, builds, mods e grupo para multiplayer.',
  alternates: { canonical: '/comunidade' },
}

export default async function ComunidadePagina({ searchParams }: { searchParams: Promise<{ ordem?: string; q?: string; build?: string }> }) {
  const sp = await searchParams
  return <Feed base="/comunidade" ordem={lerOrdem(sp.ordem)} q={sp.q?.slice(0, 80)} build={sp.build} />
}
