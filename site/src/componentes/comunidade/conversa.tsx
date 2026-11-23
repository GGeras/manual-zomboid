'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { comunidadeAtiva } from '@/config/publico'
import { mudar, useConta, useLocal } from '@/lib/comunidade/local'
import { arvore } from '@/lib/comunidade/quente'
import type { Comentario, Topico } from '@/lib/comunidade/tipos'
import { cx } from '@/lib/util'
import { Avatar } from '../avatar'
import { Check, Jogo } from '../icones'
import { Markdown } from '../markdown'
import { Galeria } from './galeria'
import { Brabo, Denunciar, Tempo } from './pecas'

const FormResposta = dynamic(() => import('./form-resposta').then((m) => m.FormResposta), { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-white/[.04]" /> })
const EntrarModal = dynamic(() => import('../entrar-modal').then((m) => m.EntrarModal), { ssr: false })
type No = ReturnType<typeof arvore>[number]
const VAZIO: Comentario[] = []

/** Respostas do tópico: 2 níveis no máximo, melhor resposta no topo (selo verde). */
export function Conversa({ topico, servidor }: { topico: Topico; servidor: No[] }) {
  const conta = useConta()
  const locais = useLocal((e) => e.comentarios, VAZIO)
  const melhorLocal = useLocal((e) => e.melhores[topico.id] ?? null, null)
  const lista = useMemo(() => {
    const todos = [...servidor.flatMap((c) => [c, ...c.respostas]), ...locais.filter((c) => c.topico === topico.id)]
    return arvore(melhorLocal ? todos.map((c) => ({ ...c, melhor: c.id === melhorLocal })) : todos)
  }, [servidor, locais, melhorLocal, topico.id])
  const total = lista.reduce((n, c) => n + 1 + c.respostas.length, 0)
  const souAutor = conta?.usuario === topico.autor.usuario
  const podeMarcar = souAutor && topico.categoria === 'duvida'

  async function marcar(id: string) {
    mudar((e) => ({ ...e, melhores: { ...e.melhores, [topico.id]: id } }))
    if (comunidadeAtiva) (await import('@/lib/comunidade/cliente-real')).marcarMelhor(id).catch(() => {})
  }

  return (
    <section id="respostas" aria-labelledby="respostas-titulo" className="mt-6 scroll-mt-20">
      <h2 id="respostas-titulo" className="px-1 text-lg font-extrabold">{total} {total === 1 ? 'resposta' : 'respostas'}</h2>
      <div id="responder" className="mt-3 scroll-mt-24">
        {topico.travado ? <p className="rounded-xl border border-borda p-4 text-sm text-apagado">Tópico travado por um moderador.</p> : <Resposta topico={topico.id} pai={null} />}
      </div>
      {lista.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center">
          <Jogo nome="moodles/Mood_Bored" tamanho={48} className="mx-auto size-12 opacity-80" />
          <p className="mt-3 font-semibold">Ninguém respondeu ainda. Seja o primeiro sobrevivente a ajudar.</p>
        </div>
      ) : (
        <ol className="mt-6 grid gap-3">
          {lista.map((c) => (
            <li key={c.id}>
              <CartaoComentario c={c} topico={topico} podeMarcar={podeMarcar} marcar={marcar} />
              {c.respostas.length > 0 && (
                <ol className="ml-4 mt-2 grid gap-2 border-l-2 border-white/[.07] pl-3 sm:ml-6 sm:pl-4">
                  {c.respostas.map((r) => <li key={r.id}><CartaoComentario c={r} topico={topico} nivel2 /></li>)}
                </ol>
              )}
            </li>
          ))}
        </ol>
      )}
      {!conta && lista.length > 0 && <p className="mt-6 text-center text-sm text-apagado">Leu tudo? <Link href="/comunidade" className="font-semibold text-alerta hover:underline">Veja mais tópicos</Link></p>}
    </section>
  )
}

function CartaoComentario({ c, topico, nivel2 = false, podeMarcar = false, marcar }: { c: Comentario; topico: Topico; nivel2?: boolean; podeMarcar?: boolean; marcar?: (id: string) => void }) {
  const [respondendo, setRespondendo] = useState(false)
  return (
    <article className={cx('rounded-xl border p-3.5 sm:p-4', c.melhor ? 'border-vivo/40 bg-vivo/[.04] shadow-[inset_3px_0_0_var(--color-vivo)]' : 'border-borda bg-chao')} aria-label={`Resposta de ${c.autor.usuario}`}>
      {c.melhor && <p className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-vivo px-2 py-0.5 font-mono text-[.66rem] font-extrabold uppercase text-noite"><Check className="size-3.5" />Melhor resposta</p>}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[.8rem] text-apagado">
        <Link href={`/comunidade/u/${c.autor.usuario}`} className="inline-flex items-center gap-2 font-semibold text-osso-2 hover:text-osso"><Avatar perfil={c.autor} tamanho={22} />{c.autor.usuario}</Link>
        {c.autor.usuario === topico.autor.usuario && <span className="rounded bg-alerta/15 px-1 font-mono text-[.6rem] font-extrabold uppercase text-alerta">autor</span>}
        {c.autor.papel !== 'usuario' && <span className="rounded bg-vivo/15 px-1 font-mono text-[.6rem] font-extrabold uppercase text-vivo">{c.autor.papel === 'admin' ? 'canal' : 'mod'}</span>}
        <span aria-hidden>·</span><Tempo iso={c.criadoEm} />{c.editadoEm && <span className="italic">(editado)</span>}
      </div>
      <Markdown texto={c.corpo} className="mt-2" />
      {c.imagens.length > 0 && <Galeria imagens={c.imagens} />}
      <div className="mt-2 flex flex-wrap items-center gap-0.5">
        <Brabo alvo={`c:${c.id}`} votos={c.votos} tamanho="sm" />
        {!nivel2 && !topico.travado && <button type="button" onClick={() => setRespondendo((r) => !r)} aria-expanded={respondendo} className="inline-flex h-8 items-center rounded-full px-2.5 text-xs font-bold text-osso-2 hover:bg-white/[.06] hover:text-osso">Responder</button>}
        {podeMarcar && !c.melhor && marcar && <button type="button" onClick={() => marcar(c.id)} className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-bold text-vivo hover:bg-vivo/10"><Check className="size-4" />Resolveu</button>}
        <span className="ml-auto"><Denunciar alvo={`c:${c.id}`} /></span>
      </div>
      {respondendo && <div className="mt-3"><Resposta topico={topico.id} pai={c.id} aoEnviar={() => setRespondendo(false)} autoFoco /></div>}
    </article>
  )
}

function Resposta({ topico, pai, aoEnviar, autoFoco }: { topico: string; pai: string | null; aoEnviar?: () => void; autoFoco?: boolean }) {
  const conta = useConta()
  const [entrar, setEntrar] = useState(false)
  const [aberto, setAberto] = useState(Boolean(autoFoco))
  if (aberto) return <FormResposta topico={topico} pai={pai} fechar={() => { setAberto(false); aoEnviar?.() }} />
  return (
    <>
      <button type="button" onClick={() => (conta ? setAberto(true) : setEntrar(true))} className="flex w-full items-center gap-3 rounded-xl border border-borda bg-[#0f0f11] px-4 py-3.5 text-left text-[.95rem] text-apagado transition-colors hover:border-white/25">
        {conta && <Avatar perfil={conta} tamanho={26} />}{conta ? 'Escreva uma resposta…' : 'Entre para responder (1 clique, sem senha)'}
      </button>
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Para responder, entre em 1 clique. Sem senha." />}
    </>
  )
}
