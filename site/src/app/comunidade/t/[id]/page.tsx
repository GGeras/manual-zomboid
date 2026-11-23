import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TopicoLocal } from '@/componentes/comunidade/topico-local'
import { VistaTopico } from '@/componentes/comunidade/vista-topico'
import { SITE_URL } from '@/config/publico'
import { comunidade } from '@/lib/comunidade/dados'
import { textoPuro } from '@/lib/markdown'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const t = await comunidade.topico((await params).id)
  if (!t) return { title: 'Tópico', robots: { index: false } }
  const img = t.imagens[0]
  return {
    title: t.titulo, description: textoPuro(t.corpo, 160) || t.titulo, alternates: { canonical: `/comunidade/t/${t.id}` },
    openGraph: { type: 'article', title: t.titulo, description: textoPuro(t.corpo, 160), ...(img && { images: [{ url: img.url, width: img.w, height: img.h, alt: img.alt }] }) },
  }
}

export default async function TopicoPagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (id.startsWith('local-')) return <TopicoLocal id={id} /> // modo prévia: tópico criado neste navegador
  const t = await comunidade.topico(id)
  if (!t) notFound()
  const comentarios = await comunidade.comentarios(id)
  // SEO: fórum com resposta aceita aparece melhor no Google
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'DiscussionForumPosting', headline: t.titulo, text: textoPuro(t.corpo, 500), url: `${SITE_URL}/comunidade/t/${t.id}`,
    datePublished: t.criadoEm, author: { '@type': 'Person', name: t.autor.usuario, url: `${SITE_URL}/comunidade/u/${t.autor.usuario}` },
    interactionStatistic: [{ '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: t.votos }, { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: t.comentarios }],
    comment: comentarios.slice(0, 10).map((c) => ({ '@type': 'Comment', text: textoPuro(c.corpo, 300), datePublished: c.criadoEm, author: { '@type': 'Person', name: c.autor.usuario } })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VistaTopico t={t} comentarios={comentarios} />
    </>
  )
}
