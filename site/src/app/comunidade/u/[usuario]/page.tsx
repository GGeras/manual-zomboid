import type { Metadata } from 'next'
import { Avatar } from '@/componentes/avatar'
import { CartaoTopico } from '@/componentes/comunidade/cartao-topico'
import { PerfilLocal } from '@/componentes/comunidade/perfil-local'
import { comunidade } from '@/lib/comunidade/dados'
import { dataCurta } from '@/lib/util'

export async function generateMetadata({ params }: { params: Promise<{ usuario: string }> }): Promise<Metadata> {
  const { usuario } = await params
  return { title: `${usuario} · Comunidade`, robots: { index: false } }
}

export default async function PerfilPagina({ params }: { params: Promise<{ usuario: string }> }) {
  const { usuario } = await params
  const p = await comunidade.perfil(usuario)
  if (!p) return <PerfilLocal usuario={usuario} /> // modo prévia: a conta de teste existe só no navegador
  const topicos = await comunidade.topicos({ autor: usuario, ordem: 'novos' })
  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-8 sm:px-6">
      <header className="flex items-center gap-4 rounded-2xl border border-borda bg-chao p-5">
        <Avatar perfil={p} tamanho={72} />
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black tracking-tight">{p.usuario}</h1>
          {p.bio && <p className="mt-1 text-osso-2">{p.bio}</p>}
          <p className="mt-2 text-xs text-apagado">
            {p.papel !== 'usuario' && <span className="mr-2 rounded bg-vivo/15 px-1.5 py-0.5 font-mono text-[.6rem] font-extrabold uppercase text-vivo">{p.papel === 'admin' ? 'canal' : 'moderador'}</span>}
            Sobrevivendo desde {dataCurta(p.criadoEm)}
          </p>
        </div>
      </header>
      <h2 className="mt-8 px-1 text-lg font-extrabold">Tópicos</h2>
      <div className="mt-3 grid gap-2.5">
        {topicos.length ? topicos.map((t) => <CartaoTopico key={t.id} t={t} />) : <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-osso-2">Nenhum tópico ainda.</p>}
      </div>
    </div>
  )
}
