'use client'
import Link from 'next/link'
import { useLocal } from '@/lib/comunidade/local'
import type { Topico } from '@/lib/comunidade/tipos'
import { Avatar } from '../avatar'
import { CartaoTopico } from './cartao-topico'

const VAZIA: Topico[] = []
export function PerfilLocal({ usuario }: { usuario: string }) {
  const conta = useLocal((e) => (e.conta?.usuario === usuario ? e.conta : null), null)
  const topicos = useLocal((e) => e.topicos, VAZIA).filter((t) => t.autor.usuario === usuario)
  if (!conta) return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="titulo text-4xl">Sobrevivente não encontrado.</p>
      <p className="mt-3 text-osso-2">Talvez tenha virado zumbi. Ou o nome está errado.</p>
      <Link href="/comunidade" className="botao botao-contorno mt-6">Voltar para a Comunidade</Link>
    </div>
  )
  return (
    <div className="mx-auto max-w-3xl px-3 pb-24 pt-8 sm:px-6">
      <header className="flex items-center gap-4 rounded-2xl border border-borda bg-chao p-5">
        <Avatar perfil={conta} tamanho={72} />
        <div><h1 className="text-2xl font-black tracking-tight">{conta.usuario}</h1><p className="mt-1 text-sm text-apagado">Conta de teste (modo prévia), só neste navegador.</p></div>
      </header>
      <h2 className="mt-8 px-1 text-lg font-extrabold">Tópicos</h2>
      <div className="mt-3 grid gap-2.5">
        {topicos.length ? topicos.map((t) => <CartaoTopico key={t.id} t={t} />) : <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-osso-2">Nenhum tópico ainda. <Link href="/comunidade/novo" className="font-semibold text-alerta hover:underline">Criar o primeiro</Link></p>}
      </div>
    </div>
  )
}
