'use client'
// Conversa da tierlist, estilo comentário de rede social: comentar, responder (2 níveis), dar Brabo.
// Também é onde a pessoa dá ideia de tierlist nova (botão "Sugerir tierlist" ao lado).
import { useMemo, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { comunidadeAtiva } from '@/config/publico'
import { mudar, novoId, useConta, useLocal } from '@/lib/comunidade/local'
import type { ComentarioTier } from '@/lib/tierlist/tipos'
import { cx } from '@/lib/util'
import { Avatar } from '../avatar'
import { Soco } from '../icones'
import { Tempo } from '../comunidade/pecas'

const EntrarModal = dynamic(() => import('../entrar-modal').then((m) => m.EntrarModal), { ssr: false })
const VAZIO: ComentarioTier[] = []

/** Brabo 👊 numa sugestão (alvo "tl:slug") ou num comentário ("tc:id") */
export function Apoio({ alvo, apoios, grande = false }: { alvo: string; apoios: number; grande?: boolean }) {
  const conta = useConta()
  const dei = useLocal((e) => Boolean(e.votos[alvo]), false)
  const [entrar, setEntrar] = useState(false)
  async function clicar() {
    if (!conta) return setEntrar(true)
    const ligar = !dei
    mudar((e) => { const v = { ...e.votos }; if (ligar) v[alvo] = true; else delete v[alvo]; return { ...e, votos: v } })
    if (comunidadeAtiva) (await import('@/lib/comunidade/cliente-real')).apoiarTierlist(alvo, ligar).catch(() => mudar((e) => { const v = { ...e.votos }; if (ligar) delete v[alvo]; else v[alvo] = true; return { ...e, votos: v } }))
  }
  const total = apoios + (dei ? 1 : 0)
  return (
    <>
      <button type="button" onClick={clicar} aria-pressed={dei} aria-label={`Brabo, ${total}`}
        className={cx('inline-flex items-center gap-1.5 rounded-full font-mono font-extrabold transition-colors', grande ? 'h-10 px-3.5 text-sm' : 'h-8 px-2.5 text-xs', dei ? 'bg-sangue/15 text-sangue' : 'text-osso-2 hover:bg-white/[.06] hover:text-osso')}>
        <Soco className={grande ? 'size-5' : 'size-4'} /><span className="tabular-nums">{total}</span>
      </button>
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Para dar Brabo, entre em 1 clique. Sem senha." />}
    </>
  )
}

export function ConversaTierlist({ slug, servidor }: { slug: string; servidor: ComentarioTier[] }) {
  const locais = useLocal((e) => e.tlComentarios, VAZIO)
  const lista = useMemo(() => {
    const todos = [...servidor, ...locais.filter((c) => c.tierlist === slug)]
    const raiz = todos.filter((c) => !c.pai).sort((a, b) => b.apoios - a.apoios || b.criadoEm.localeCompare(a.criadoEm))
    return raiz.map((c) => ({ ...c, respostas: todos.filter((r) => r.pai === c.id).sort((a, b) => a.criadoEm.localeCompare(b.criadoEm)) }))
  }, [servidor, locais, slug])
  const total = lista.reduce((n, c) => n + 1 + c.respostas.length, 0)
  return (
    <section aria-labelledby="conversa-titulo" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="conversa-titulo" className="text-xl font-black tracking-tight">{total} {total === 1 ? 'comentário' : 'comentários'}</h2>
        <Link href="/comunidade/tierlists/sugerir" className="text-sm font-bold text-alerta hover:underline">Tem ideia de tierlist nova? Sugira →</Link>
      </div>
      <div className="mt-4"><Escrever slug={slug} pai={null} /></div>
      <ol className="mt-6 grid gap-4">
        {lista.map((c) => (
          <li key={c.id}>
            <Comentario c={c} slug={slug} />
            {c.respostas.length > 0 && (
              <ol className="ml-5 mt-2 grid gap-2 border-l-2 border-white/[.07] pl-3 sm:ml-12 sm:pl-4">
                {c.respostas.map((r) => <li key={r.id}><Comentario c={r} slug={slug} nivel2 /></li>)}
              </ol>
            )}
          </li>
        ))}
      </ol>
      {lista.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center text-osso-2">Ninguém comentou ainda. Discorda do placar? Fala aí.</p>}
    </section>
  )
}

function Comentario({ c, slug, nivel2 = false }: { c: ComentarioTier; slug: string; nivel2?: boolean }) {
  const [respondendo, setRespondendo] = useState(false)
  return (
    <article className="flex gap-3" aria-label={`Comentário de ${c.autor.usuario}`}>
      <Link href={`/comunidade/u/${c.autor.usuario}`} className="shrink-0"><Avatar perfil={c.autor} tamanho={nivel2 ? 30 : 38} /></Link>
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-md bg-chao px-3.5 py-2.5">
          <p className="flex flex-wrap items-center gap-x-2 text-[.8rem]">
            <Link href={`/comunidade/u/${c.autor.usuario}`} className="font-bold text-osso hover:underline">{c.autor.usuario}</Link>
            {c.autor.papel !== 'usuario' && <span className="rounded bg-vivo/15 px-1 font-mono text-[.58rem] font-extrabold uppercase text-vivo">{c.autor.papel === 'admin' ? 'canal' : 'mod'}</span>}
          </p>
          <p className="mt-0.5 whitespace-pre-line break-words text-[.95rem] leading-relaxed text-osso-2">{c.corpo}</p>
        </div>
        <div className="mt-1 flex items-center gap-1 pl-1 text-xs text-apagado">
          <Tempo iso={c.criadoEm} className="mr-1" />
          <Apoio alvo={`tc:${c.id}`} apoios={c.apoios} />
          {!nivel2 && <button type="button" onClick={() => setRespondendo((r) => !r)} aria-expanded={respondendo} className="inline-flex h-8 items-center rounded-full px-2.5 font-bold text-osso-2 hover:bg-white/[.06] hover:text-osso">Responder</button>}
        </div>
        {respondendo && <div className="mt-2"><Escrever slug={slug} pai={c.id} aoEnviar={() => setRespondendo(false)} autoFoco /></div>}
      </div>
    </article>
  )
}

function Escrever({ slug, pai, aoEnviar, autoFoco }: { slug: string; pai: string | null; aoEnviar?: () => void; autoFoco?: boolean }) {
  const conta = useConta()
  const [texto, setTexto] = useState('')
  const [entrar, setEntrar] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const corpo = texto.trim(); if (!corpo) return
    if (!conta) return setEntrar(true)
    setEnviando(true); setErro(null)
    try {
      if (comunidadeAtiva) { await (await import('@/lib/comunidade/cliente-real')).comentarTierlist(slug, corpo, pai); location.reload() }
      else mudar((s) => ({ ...s, tlComentarios: [...s.tlComentarios, { id: novoId(), tierlist: slug, pai, autor: conta, corpo, apoios: 0, criadoEm: new Date().toISOString() }] }))
      setTexto(''); aoEnviar?.()
    } catch (x) { setErro((x as Error).message) } finally { setEnviando(false) }
  }
  return (
    <form onSubmit={enviar} className="flex items-start gap-2.5">
      {conta ? <Avatar perfil={conta} tamanho={pai ? 30 : 38} /> : <span className="size-[38px] shrink-0 rounded-full bg-white/[.06]" />}
      <div className="flex-1">
        <label htmlFor={`tl-${pai ?? 'raiz'}`} className="sr-only">{pai ? 'Sua resposta' : 'Seu comentário'}</label>
        <textarea id={`tl-${pai ?? 'raiz'}`} autoFocus={autoFoco} value={texto} onChange={(e) => setTexto(e.target.value)} readOnly={!conta} onClick={() => !conta && setEntrar(true)} onKeyDown={(e) => { if (!conta && e.key === 'Enter') setEntrar(true) }} maxLength={3000} rows={texto ? 3 : 1}
          placeholder={conta ? (pai ? 'Responda…' : 'O que você acha do placar?') : 'Entre para comentar (1 clique, sem senha)'} className="campo resize-none !rounded-2xl" />
        {texto.trim() && (
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => { setTexto(''); aoEnviar?.() }} className="botao botao-fantasma !min-h-9 text-sm">Cancelar</button>
            <button className="botao botao-sangue !min-h-9 text-sm" disabled={enviando}>{enviando ? 'Enviando…' : pai ? 'Responder' : 'Comentar'}</button>
          </div>
        )}
        {erro && <p role="alert" className="mt-1 text-sm text-sangue">{erro}</p>}
      </div>
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Para comentar, entre em 1 clique. Sem senha." />}
    </form>
  )
}
