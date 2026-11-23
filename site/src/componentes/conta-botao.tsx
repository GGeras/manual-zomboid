'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { comunidadeAtiva } from '@/config/publico'
import { mudar, sairLocal, useConta } from '@/lib/comunidade/local'
import { Avatar } from './avatar'
import dynamic from 'next/dynamic'

const EntrarModal = dynamic(() => import('./entrar-modal').then((m) => m.EntrarModal), { ssr: false })

export function ContaBotao() {
  const conta = useConta()
  const [aberto, setAberto] = useState(false)
  // modo real: a conta vem da sessão do Supabase
  useEffect(() => {
    if (!comunidadeAtiva) return
    import('@/lib/comunidade/cliente-real').then(async (r) => { const p = await r.sincronizarConta(); mudar((e) => ({ ...e, conta: p })) })
  }, [])
  async function sair() {
    if (comunidadeAtiva) await (await import('@/lib/comunidade/cliente-real')).sair()
    sairLocal()
  }
  if (!conta) return (
    <>
      <button type="button" className="botao botao-sangue !min-h-10 !px-4 text-sm" onClick={() => setAberto(true)}>Entrar</button>
      {aberto && <EntrarModal fechar={() => setAberto(false)} />}
    </>
  )
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full p-1 pr-2 hover:bg-white/5 [&::-webkit-details-marker]:hidden" aria-label={`Conta de ${conta.usuario}`}>
        <Avatar perfil={conta} tamanho={32} />
        <span className="hidden text-sm font-semibold sm:inline">{conta.usuario || 'sobrevivente'}</span>
      </summary>
      <div className="absolute right-0 top-12 w-56 rounded-xl border border-borda bg-[#141416] p-2 shadow-2xl shadow-black/60">
        <Link href={`/comunidade/u/${conta.usuario}`} className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5">Meu perfil</Link>
        <Link href="/comunidade/novo" className="block rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5">Criar tópico</Link>
        <button type="button" onClick={sair} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-osso-2 hover:bg-white/5">Sair</button>
      </div>
    </details>
  )
}
