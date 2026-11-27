import type { Metadata } from 'next'
import Link from 'next/link'
import { Avatar } from '@/componentes/avatar'
import { Apoio, ConversaTierlist } from '@/componentes/tierlist/conversa'
import { TierlistLocal } from '@/componentes/tierlist/locais'
import { QuadroTierlist } from '@/componentes/tierlist/quadro'
import { CompartilharBotao } from '@/componentes/comunidade/pecas'
import { tierlists } from '@/lib/tierlist/dados'

export const revalidate = 120

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = await tierlists.uma((await params).slug)
  if (!t) return { title: 'Tierlist', robots: { index: false } }
  return { title: `${t.titulo} · Tierlist`, description: `${t.descricao} Vote de S+ a D.`, alternates: { canonical: `/comunidade/tierlists/${t.slug}` } }
}

export default async function TierlistPagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = await tierlists.uma(slug)
  if (!t) return <TierlistLocal slug={slug} /> // modo prévia: sugestão criada neste navegador
  const [votos, comentarios] = await Promise.all([tierlists.votos(slug), tierlists.comentarios(slug)])
  return (
    <div className="mx-auto max-w-4xl px-3 pb-24 pt-6 sm:px-6">
      <nav aria-label="Caminho" className="text-sm text-apagado"><Link href="/comunidade/tierlists" className="hover:text-osso">← Tierlists</Link></nav>
      <header className="mt-4">
        <span className={t.tipo === 'oficial' ? 'chip border-alerta/50 text-alerta' : 'chip border-white/20 text-osso-2'}>{t.tipo === 'oficial' ? 'Oficial do canal' : 'Sugestão da comunidade · não verificada pelo canal'}</span>
        <h1 className="titulo mt-3 text-[clamp(2rem,5.5vw,3.2rem)] text-pretty">{t.titulo}</h1>
        {t.descricao && <p className="mt-2 text-lg text-osso-2">{t.descricao}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {t.autor && <Link href={`/comunidade/u/${t.autor.usuario}`} className="mr-2 inline-flex items-center gap-2 text-sm font-semibold text-osso-2 hover:text-osso"><Avatar perfil={t.autor} tamanho={24} />sugerida por {t.autor.usuario}</Link>}
          {t.tipo === 'sugestao' && <Apoio alvo={`tl:${t.slug}`} apoios={t.apoios} grande />}
          <CompartilharBotao caminho={`/comunidade/tierlists/${t.slug}`} titulo={t.titulo} />
        </div>
      </header>
      <div className="mt-6"><QuadroTierlist t={t} votosServidor={votos} /></div>
      <ConversaTierlist slug={t.slug} servidor={comentarios} />
    </div>
  )
}
