import type { Metadata } from 'next'
import Link from 'next/link'
import { CartaoTierlist } from '@/componentes/tierlist/cartao'
import { SugestoesLocais } from '@/componentes/tierlist/locais'
import { Mais } from '@/componentes/icones'
import { tierlists } from '@/lib/tierlist/dados'
import { placar } from '@/lib/tierlist/placar'

export const metadata: Metadata = {
  title: 'Tierlists',
  description: 'Tierlists de Project Zomboid votadas pela comunidade: melhor arma, mochila, traço e o que mais a galera sugerir. Vote no que é S+.',
  alternates: { canonical: '/comunidade/tierlists' },
}
export const revalidate = 300

export default async function TierlistsPagina() {
  const [oficiais, sugestoes] = await Promise.all([tierlists.oficiais(), tierlists.sugestoes()])
  const votos = await Promise.all([...oficiais, ...sugestoes].map((t) => tierlists.votos(t.slug)))
  const linhas = (i: number, t: (typeof oficiais)[number]) => placar(t.itens, votos[i])
  return (
    <div className="mx-auto max-w-7xl px-3 pb-24 pt-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="hud text-[.7rem] text-alerta">Comunidade</p>
          <h1 className="titulo mt-2 text-[clamp(2.2rem,6vw,3.6rem)]">Tierlists</h1>
          <p className="mt-2 max-w-2xl text-osso-2">Vote em cada item de S+ a D. A média decide a linha, a votação não acaba e você escolhe se o seu voto aparece com nome ou anônimo.</p>
        </div>
        <Link href="/comunidade/tierlists/sugerir" className="botao botao-sangue"><Mais /> Sugerir tierlist</Link>
      </header>

      <h2 className="hud mt-10 text-[.72rem] text-osso-2">Oficiais do canal</h2>
      <ul className="mt-3 grid gap-4 md:grid-cols-3">
        {oficiais.map((t, i) => <li key={t.slug}><CartaoTierlist t={t} linhas={linhas(i, t)} destaque /></li>)}
      </ul>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="hud text-[.72rem] text-osso-2">Sugestões da comunidade</h2>
          <p className="mt-1 text-sm text-apagado">Criadas por quem joga, não verificadas pelo canal. Dê Brabo nas que você quer ver virar oficial.</p>
        </div>
      </div>
      <SugestoesLocais />
      <ul className="mt-3 grid gap-4 md:grid-cols-3">
        {sugestoes.map((t, i) => <li key={t.slug}><CartaoTierlist t={t} linhas={linhas(oficiais.length + i, t)} /></li>)}
      </ul>
      {sugestoes.length === 0 && <p className="mt-3 rounded-2xl border border-dashed border-white/10 p-8 text-center text-osso-2">Nenhuma sugestão ainda. <Link href="/comunidade/tierlists/sugerir" className="font-semibold text-alerta hover:underline">Seja o primeiro</Link>.</p>}
    </div>
  )
}
