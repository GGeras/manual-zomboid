import type { Metadata } from 'next'
import Link from 'next/link'
import { EditorTopico } from '@/componentes/comunidade/editor-topico'
import { EPISODIOS } from '@/lib/conteudo'

export const metadata: Metadata = { title: 'Criar tópico · Comunidade', robots: { index: false } }

export default async function NovoTopico({ searchParams }: { searchParams: Promise<{ categoria?: string; episodio?: string }> }) {
  const sp = await searchParams
  const eps = EPISODIOS.filter((e) => e.status === 'publicado').map((e) => ({ nn: e.nn, titulo: e.titulo ?? e.tema }))
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
      <nav aria-label="Trilha" className="text-sm text-apagado"><Link href="/comunidade" className="hover:text-osso">Comunidade</Link> <span aria-hidden>/</span></nav>
      <h1 className="titulo mt-4 text-[clamp(2.2rem,6vw,3.4rem)]">Criar <span className="text-sangue">tópico</span></h1>
      <p className="mt-2 text-osso-2">Tão fácil quanto mandar print no Discord.</p>
      <div className="mt-8"><EditorTopico categoriaInicial={sp.categoria} episodioInicial={sp.episodio} episodios={eps} /></div>
    </div>
  )
}
