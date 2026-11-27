import type { Metadata } from 'next'
import Link from 'next/link'
import { FormSugerir } from '@/componentes/tierlist/sugerir'

export const metadata: Metadata = { title: 'Sugerir tierlist', robots: { index: false } }

export default function SugerirPagina() {
  return (
    <div className="mx-auto max-w-2xl px-3 pb-24 pt-6 sm:px-6">
      <nav aria-label="Caminho" className="text-sm text-apagado"><Link href="/comunidade/tierlists" className="hover:text-osso">← Tierlists</Link></nav>
      <h1 className="titulo mt-4 text-[clamp(2rem,5.5vw,3rem)]">Sugerir tierlist</h1>
      <p className="mt-2 text-osso-2">Deu ideia? Monte a lista de itens e a comunidade vota. As sugestões com mais Brabo viram oficiais do canal (aí os nomes são conferidos com o jogo).</p>
      <FormSugerir />
    </div>
  )
}
