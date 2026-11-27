import Link from 'next/link'
import { placar } from '@/lib/tierlist/placar'
import { tierlists } from '@/lib/tierlist/dados'
import type { Tierlist } from '@/lib/tierlist/tipos'
import { CabecalhoSecao } from '../landing/secoes'
import { Mais, Seta } from '../icones'
import { CartaoTierlist } from './cartao'

/** Landing: as tierlists oficiais com o placar ao vivo, logo depois da abertura. É o "motivo pra ficar" de quem veio das redes. */
export async function TierlistsVitrine({ listas }: { listas: Tierlist[] }) {
  const votos = await Promise.all(listas.map((t) => tierlists.votos(t.slug)))
  return (
    <section id="tierlists" aria-labelledby="tierlists-titulo" className="relative scroll-mt-16 overflow-hidden py-20 sm:py-24">
      <div aria-hidden className="absolute -left-40 top-0 -z-10 size-[34rem] rounded-full bg-alerta/[.05] blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CabecalhoSecao id="tierlists-titulo" n="01" rotulo="Tierlists da comunidade" titulo="Qual é" destaque="S+?">
          <Link href="/comunidade/tierlists" className="botao botao-contorno">Todas as tierlists <Seta /></Link>
        </CabecalhoSecao>
        <p data-revelar className="mt-4 max-w-2xl text-lg leading-relaxed text-osso-2">Sem data pra acabar: cada voto muda o placar na hora. Vote anônimo ou com seu nome, veja quem votou em quê e brigue nos comentários.</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {listas.map((t, i) => <li key={t.slug} data-revelar style={{ ['--atraso' as string]: `${i * 80}ms` }}><CartaoTierlist t={t} linhas={placar(t.itens, votos[i])} destaque={i === 0} /></li>)}
        </ul>
        <p data-revelar className="mt-6 flex flex-wrap items-center gap-3 text-sm text-osso-2">
          <Link href="/comunidade/tierlists/sugerir" className="botao botao-fantasma !min-h-10 text-sm"><Mais /> Sugerir uma tierlist</Link>
          <span className="text-apagado">As mais apoiadas viram oficiais.</span>
        </p>
      </div>
    </section>
  )
}
