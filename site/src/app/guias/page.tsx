import type { Metadata } from 'next'
import { CartaoGuia } from '@/componentes/landing/secoes'
import { Revelar } from '@/componentes/revelar'
import { guias } from '@/lib/conteudo'

export const metadata: Metadata = {
  title: 'Guias',
  description: 'Guias de Project Zomboid (Build 42) que aprofundam os vídeos do canal. Cada fato conferido no arquivo do jogo, com build e fonte.',
  alternates: { canonical: '/guias' },
}

export default function GuiasPagina() {
  const lista = guias()
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,#1a2230,transparent)]" />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
        <p className="hud flex items-center gap-3 text-apagado"><span className="text-sangue">Guias</span><span className="h-px w-8 bg-white/15" />Blog oficial</p>
        <h1 className="titulo mt-4 text-[clamp(2.6rem,8vw,5.2rem)]">O vídeo, <span className="text-sangue">por inteiro.</span></h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-osso-2">
          Cada guia junta o que o canal já conferiu sobre um tema. Todo fato vem com o build e a fonte: se não está conferido, não está aqui.
        </p>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lista.map((g, i) => <li key={g.slug} data-revelar style={{ ['--atraso' as string]: `${i * 70}ms` }}><CartaoGuia g={g} /></li>)}
        </ul>
      </div>
      <Revelar />
    </div>
  )
}
