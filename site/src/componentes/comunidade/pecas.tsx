'use client'
// Peças interativas pequenas da Comunidade (ilhas de JS): voto "Brabo", tempo relativo, denúncia, compartilhar.
import { useEffect, useState } from 'react'
import { comunidadeAtiva } from '@/config/publico'
import { mudar, useConta, useLocal } from '@/lib/comunidade/local'
import { cx, tempoRelativo } from '@/lib/util'
import { Bandeira, Compartilhar, Soco } from '../icones'
import dynamic from 'next/dynamic'

const EntrarModal = dynamic(() => import('../entrar-modal').then((m) => m.EntrarModal), { ssr: false })

/** Voto só positivo ("Brabo" 👊). Sem conta: abre o Entrar. */
export function Brabo({ alvo, votos, vertical = false, tamanho = 'md' }: { alvo: string; votos: number; vertical?: boolean; tamanho?: 'sm' | 'md' }) {
  const conta = useConta()
  const votei = useLocal((e) => Boolean(e.votos[alvo]), false)
  const [entrar, setEntrar] = useState(false)
  const [pulso, setPulso] = useState(0)
  const total = votos + (votei ? 1 : 0)
  async function clicar() {
    if (!conta) return setEntrar(true)
    const ligar = !votei
    mudar((e) => { const v = { ...e.votos }; if (ligar) v[alvo] = true; else delete v[alvo]; return { ...e, votos: v } })
    if (ligar) setPulso((p) => p + 1)
    if (comunidadeAtiva) {
      const { votar } = await import('@/lib/comunidade/cliente-real')
      const [tipo, id] = alvo.split(':')
      votar(tipo === 't' ? { topico: id } : { comentario: id }, ligar).catch(() => mudar((e) => { const v = { ...e.votos }; if (ligar) delete v[alvo]; else v[alvo] = true; return { ...e, votos: v } }))
    }
  }
  return (
    <>
      <button type="button" onClick={clicar} aria-pressed={votei} aria-label={`Brabo, ${total} ${total === 1 ? 'voto' : 'votos'}`}
        className={cx('group/brabo inline-flex items-center justify-center rounded-full font-mono font-extrabold transition-colors',
          vertical ? 'flex-col gap-0.5 px-1.5 py-2' : 'gap-1.5 px-2.5', tamanho === 'sm' ? 'h-8 text-xs' : !vertical && 'h-9 text-sm',
          votei ? 'bg-sangue/15 text-sangue' : 'text-osso-2 hover:bg-white/[.06] hover:text-osso')}>
        <Soco key={pulso} className={cx(tamanho === 'sm' ? 'size-4' : 'size-5', 'transition-transform group-hover/brabo:-rotate-12', pulso > 0 && 'animate-[soco_.35s_var(--ease-snap)]')} />
        <span className="tabular-nums">{total}</span>
      </button>
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Para dar Brabo, entre em 1 clique. Sem senha." />}
    </>
  )
}

/** "há 3 horas" calculado no navegador (a página pode vir do cache). */
export function Tempo({ iso, className }: { iso: string; className?: string }) {
  const [txt, setTxt] = useState<string | null>(null)
  useEffect(() => { setTxt(tempoRelativo(iso)); const t = setInterval(() => setTxt(tempoRelativo(iso)), 60_000); return () => clearInterval(t) }, [iso])
  return <time dateTime={iso} className={className} title={new Date(iso).toLocaleString('pt-BR')}>{txt ?? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</time>
}

const MOTIVOS = ['Spam ou propaganda', 'Ofensa ou assédio', 'Conteúdo impróprio ou ilegal', 'Informação errada de propósito', 'Outro']
export function Denunciar({ alvo }: { alvo: string }) {
  const ja = useLocal((e) => Boolean(e.denuncias[alvo]), false)
  const [aberto, setAberto] = useState(false)
  async function enviar(motivo: string) {
    mudar((e) => ({ ...e, denuncias: { ...e.denuncias, [alvo]: true } }))
    setAberto(false)
    if (comunidadeAtiva) {
      const { denunciar } = await import('@/lib/comunidade/cliente-real')
      const [tipo, id] = alvo.split(':')
      await denunciar(tipo === 't' ? { topico: id } : { comentario: id }, motivo).catch(() => {})
    }
  }
  if (ja) return <span className="inline-flex h-8 items-center gap-1.5 px-2 text-xs font-semibold text-apagado"><Bandeira className="size-4" /> Denunciado</span>
  return (
    <div className="relative">
      <button type="button" onClick={() => setAberto((a) => !a)} aria-expanded={aberto} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-apagado hover:bg-white/[.06] hover:text-osso">
        <Bandeira className="size-4" /> <span className="hidden sm:inline">Denunciar</span>
      </button>
      {aberto && (
        <div role="menu" className="absolute bottom-10 right-0 z-20 w-64 rounded-xl border border-borda bg-[#141416] p-1.5 shadow-2xl shadow-black/60">
          <p className="px-3 pb-1 pt-2 text-xs text-apagado">Qual o problema? Um moderador vai ver.</p>
          {MOTIVOS.map((m) => <button key={m} role="menuitem" type="button" onClick={() => enviar(m)} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/5">{m}</button>)}
        </div>
      )}
    </div>
  )
}

export function CompartilharBotao({ caminho, titulo }: { caminho: string; titulo: string }) {
  const [ok, setOk] = useState(false)
  async function clicar() {
    const url = location.origin + caminho
    if (navigator.share) { try { await navigator.share({ url, title: titulo }); return } catch { return } }
    await navigator.clipboard.writeText(url).catch(() => {})
    setOk(true); setTimeout(() => setOk(false), 1800)
  }
  return (
    <button type="button" onClick={clicar} className="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-apagado hover:bg-white/[.06] hover:text-osso">
      <Compartilhar className="size-4" /> <span className="hidden sm:inline" aria-live="polite">{ok ? 'Link copiado' : 'Compartilhar'}</span>
    </button>
  )
}
