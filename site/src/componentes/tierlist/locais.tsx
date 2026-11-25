'use client'
// Modo prévia: sugestões de tierlist criadas neste navegador (no modo real elas vêm do banco e estas peças não mostram nada).
import Link from 'next/link'
import { useConta, useLocal } from '@/lib/comunidade/local'
import { comVotoLocal, placar } from '@/lib/tierlist/placar'
import type { Tierlist } from '@/lib/tierlist/tipos'
import { CartaoTierlist } from './cartao'
import { ConversaTierlist } from './conversa'
import { QuadroTierlist } from './quadro'

const VAZIA: Tierlist[] = []
const SEM_VOTOS = {}

export function SugestoesLocais() {
  const minhas = useLocal((e) => e.tlSugestoes, VAZIA)
  const votos = useLocal((e) => e.tlVotos, SEM_VOTOS)
  const conta = useConta()
  if (!minhas.length) return null
  return (
    <ul className="mt-3 grid gap-4 md:grid-cols-3">
      {minhas.map((t) => <li key={t.slug}><CartaoTierlist t={t} linhas={placar(t.itens, comVotoLocal([], votos, conta?.usuario ?? null, t.slug))} /></li>)}
    </ul>
  )
}

export function TierlistLocal({ slug }: { slug: string }) {
  const t = useLocal((e) => e.tlSugestoes.find((x) => x.slug === slug) ?? null, null)
  if (!t) return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="titulo text-4xl">Tierlist não encontrada.</p>
      <p className="mt-3 text-osso-2">Pode ter sido removida. Ou o link está errado.</p>
      <Link href="/comunidade/tierlists" className="botao botao-contorno mt-6">Ver as tierlists</Link>
    </div>
  )
  return (
    <div className="mx-auto max-w-4xl px-3 pb-24 pt-6 sm:px-6">
      <nav aria-label="Caminho" className="text-sm text-apagado"><Link href="/comunidade/tierlists" className="hover:text-osso">← Tierlists</Link></nav>
      <header className="mt-4">
        <span className="chip border-white/20 text-osso-2">Sugestão da comunidade · não verificada pelo canal</span>
        <h1 className="titulo mt-3 text-[clamp(2rem,5.5vw,3.2rem)]">{t.titulo}</h1>
        {t.descricao && <p className="mt-2 text-lg text-osso-2">{t.descricao}</p>}
        <p className="mt-3 text-xs text-apagado">Modo prévia: esta sugestão existe só neste navegador.</p>
      </header>
      <div className="mt-6"><QuadroTierlist t={t} votosServidor={[]} /></div>
      <ConversaTierlist slug={t.slug} servidor={[]} />
    </div>
  )
}
