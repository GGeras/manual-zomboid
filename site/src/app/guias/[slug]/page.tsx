import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CartaoGuia } from '@/componentes/landing/secoes'
import { Jogo, Relogio, Seta } from '@/componentes/icones'
import { LiteYoutube } from '@/componentes/lite-youtube'
import { capaDe } from '@/lib/externos'
import { SITE_URL } from '@/config/publico'
import { Markdown } from '@/componentes/markdown'
import { blocosDoGuia, episodio, FATOS, guia, guias } from '@/lib/conteudo'
import { dataCurta } from '@/lib/util'

export const dynamicParams = false
export const generateStaticParams = () => guias().map((g) => ({ slug: g.slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = guia((await params).slug)
  if (!g) return {}
  return { title: g.titulo, description: g.resumo, alternates: { canonical: `/guias/${g.slug}` }, openGraph: { type: 'article', title: g.titulo, description: g.resumo, publishedTime: g.data } }
}

/** Um fato validado, com o texto exato de info-validada/ + build + fonte. O guia não escreve fato por conta própria. */
function Fato({ id }: { id: string }) {
  const f = FATOS[id]
  if (!f) throw new Error(`fato "${id}" fora de info-validada/`) // o checar-guias já barra antes; isto é o cinto de segurança
  return (
    <aside className="not-prose my-5 rounded-xl border border-white/[.08] border-l-[3px] border-l-vivo bg-[#141416] p-4 sm:p-5">
      <p className="text-[1.02rem] leading-relaxed text-osso">{f.texto}</p>
      <details className="group mt-3">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 [&::-webkit-details-marker]:hidden">
          <span className="chip h-5 border-vivo/40 text-[.6rem] text-vivo">✓ Conferido · {f.build}</span>
          <span className="text-xs font-semibold text-apagado underline-offset-2 group-open:hidden hover:text-osso-2 hover:underline">ver fonte</span>
        </summary>
        <p className="mt-2 font-mono text-[.72rem] leading-relaxed text-apagado">{f.fonte}</p>
      </details>
    </aside>
  )
}

export default async function GuiaPagina({ params }: { params: Promise<{ slug: string }> }) {
  const g = guia((await params).slug)
  if (!g) notFound()
  const ep = episodio(g.episodio)
  const outros = guias().filter((x) => x.slug !== g.slug).slice(0, 2)
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: g.titulo, description: g.resumo, datePublished: g.data, inLanguage: 'pt-BR',
    url: `${SITE_URL}/guias/${g.slug}`, author: { '@type': 'Organization', name: 'Manual Zomboid' }, publisher: { '@type': 'Organization', name: 'Manual Zomboid' },
  }
  return (
    <article className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(60%_100%_at_50%_0%,#1b2431,transparent)]" />
      <header className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-16">
        <nav aria-label="Trilha" className="text-sm text-apagado"><Link href="/guias" className="hover:text-osso">Guias</Link> <span aria-hidden>/</span></nav>
        <div className="mt-6 flex items-center gap-3">
          {g.moodle && <span className="moodle size-14"><Jogo nome={`moodles/${g.moodle}`} tamanho={48} className="size-11" /></span>}
          {g.icone && <span className="moodle size-14"><Jogo nome={`itens/${g.icone}`} tamanho={32} className="size-9" /></span>}
        </div>
        <h1 className="titulo mt-6 text-[clamp(2.3rem,7vw,4.4rem)]">{g.titulo}</h1>
        <p className="mt-5 text-lg leading-relaxed text-osso-2 sm:text-xl">{g.resumo}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-white/[.07] py-4 text-sm text-apagado">
          <span className="chip border-vivo/40 text-vivo">{g.build}</span>
          <span>{g.fatos.length} fatos conferidos</span>
          <span className="inline-flex items-center gap-1.5"><Relogio className="size-4" />{g.minutos} min de leitura</span>
          <time dateTime={g.data}>{dataCurta(g.data)}</time>
        </div>
        {ep?.youtube && <LiteYoutube id={ep.youtube} titulo={ep.titulo ?? ep.tema} vertical capa={capaDe(ep.nn, ep.youtube)} className="mx-auto mt-8 max-w-[18rem]" />}
      </header>

      <div className="prosa mx-auto max-w-3xl px-4 pb-6 pt-8 sm:px-6">
        {blocosDoGuia(g.corpo).map((b, i) =>
          b.tipo === 'fato' ? <Fato key={i} id={b.id} /> : b.tipo === 'titulo' ? <h2 key={i}>{b.texto}</h2> : <Markdown key={i} texto={b.md} className="!text-[1.0625rem] !leading-[1.7]" />)}
      </div>

      <footer className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="mt-8 rounded-2xl border border-borda bg-chao p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-extrabold">Ficou dúvida? Viu diferente no seu jogo?</p>
            <p className="mt-1 text-sm text-osso-2">Pergunte na Comunidade. Quem resolver ganha a melhor resposta.</p>
          </div>
          <Link href={`/comunidade/novo?categoria=duvida${g.episodio ? `&episodio=${g.episodio}` : ''}`} className="botao botao-sangue mt-4 shrink-0 sm:mt-0">Perguntar <Seta /></Link>
        </div>
        {outros.length > 0 && (
          <>
            <p className="hud mt-16 text-apagado">Leia também</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">{outros.map((o) => <li key={o.slug}><CartaoGuia g={o} /></li>)}</ul>
          </>
        )}
      </footer>
    </article>
  )
}
