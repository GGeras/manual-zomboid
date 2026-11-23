import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Feed, lerOrdem } from '@/componentes/comunidade/feed'
import { categoria } from '@/lib/comunidade/categorias'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = categoria((await params).slug)
  return c ? { title: `${c.nome} · Comunidade`, description: c.descricao, alternates: { canonical: `/comunidade/c/${c.slug}` } } : {}
}

export default async function CategoriaPagina({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ ordem?: string; q?: string; build?: string }> }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const c = categoria(slug)
  if (!c) notFound()
  return <Feed base={`/comunidade/c/${c.slug}`} cat={c} ordem={lerOrdem(sp.ordem)} q={sp.q?.slice(0, 80)} build={sp.build} />
}
