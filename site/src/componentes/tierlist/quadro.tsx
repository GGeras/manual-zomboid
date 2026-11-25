'use client'
// Quadro da tierlist: a média dos votos de cada item decide a linha (S+ ... D). Clique num item -> painel de voto:
// escolher o tier, votar anônimo ou com nome, e ver quem votou (só logado; voto anônimo aparece só na contagem).
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { comunidadeAtiva } from '@/config/publico'
import { mudar, useConta, useLocal } from '@/lib/comunidade/local'
import { comVotoLocal, placar, quadro as montarQuadro, type LinhaPlacar } from '@/lib/tierlist/placar'
import { TIERS, type ItemTier, type Tier, type Tierlist, type Visibilidade, type VotoTier } from '@/lib/tierlist/tipos'
import { cx } from '@/lib/util'
import { Jogo } from '../icones'
import { Modal } from '../modal'

const EntrarModal = dynamic(() => import('../entrar-modal').then((m) => m.EntrarModal), { ssr: false })
const VAZIO = {} as Record<string, { tier: Tier; anonimo: boolean }>

export function IconeItem({ item, tamanho = 40 }: { item: ItemTier; tamanho?: number }) {
  if (item.icone) return <Jogo nome={`itens/${item.icone}`} tamanho={32} className="pixel" alt="" />
  const ini = item.nome.split(/\s+/).filter((p) => p.length > 2 || /^[A-ZÁ-Ú]/.test(p)).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return <span aria-hidden className="grid place-items-center rounded-md bg-white/[.06] font-mono text-[.8rem] font-extrabold text-osso-2" style={{ width: tamanho * 0.8, height: tamanho * 0.8 }}>{ini}</span>
}

export function QuadroTierlist({ t, votosServidor }: { t: Tierlist; votosServidor: VotoTier[] }) {
  const conta = useConta()
  const meus = useLocal((e) => e.tlVotos, VAZIO)
  const [aberto, setAberto] = useState<string | null>(null)
  const [nomesReais, setNomesReais] = useState<VotoTier[] | null>(null)

  // modo real + logado: busca quem votou (view tierlist_votantes) e os próprios votos (para marcar "seu voto")
  useEffect(() => {
    if (!comunidadeAtiva || !conta) return
    let vivo = true
    import('@/lib/comunidade/cliente-real').then(async (r) => {
      const [vs, mv] = await Promise.all([r.votantes(t.slug), r.meusVotos(t.slug)])
      if (!vivo) return
      setNomesReais(vs.map((v) => ({ item: v.item, tier: v.tier, usuario: v.usuario, criadoEm: v.criado_em })))
      mudar((e) => { const tl = { ...e.tlVotos }; mv.forEach((v) => (tl[`${t.slug}::${v.item}`] = { tier: v.tier, anonimo: v.anonimo })); return { ...e, tlVotos: tl } })
    }).catch(() => {})
    return () => { vivo = false }
  }, [conta, t.slug])

  const votos = useMemo(() => {
    // modo real: o servidor já contou o voto da pessoa; o local só substitui quando ela muda o voto nesta visita
    if (comunidadeAtiva) return votosServidor
    return comVotoLocal(votosServidor, meus, conta?.usuario ?? null, t.slug)
  }, [votosServidor, meus, conta, t.slug])
  const linhas = useMemo(() => placar(t.itens, votos), [t.itens, votos])
  const q = useMemo(() => montarQuadro(linhas), [linhas])
  const quem = comunidadeAtiva ? nomesReais : votos
  const linhaAberta = linhas.find((l) => l.item.id === aberto) ?? null
  const total = linhas.reduce((n, l) => n + l.votos, 0)

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-borda bg-[#0f0f11]">
        {q.tiers.map((linha) => (
          <div key={linha.id} className="flex min-h-[5.2rem] border-b border-white/[.06] last:border-b-0">
            <div className="flex w-16 shrink-0 flex-col items-center justify-center sm:w-24" style={{ background: `color-mix(in srgb, ${linha.cor} 16%, #0f0f11)`, boxShadow: `inset -3px 0 0 ${linha.cor}` }}>
              <span className="titulo text-3xl sm:text-4xl" style={{ color: linha.cor }}>{linha.id}</span>
              <span className="mt-0.5 hidden px-1 text-center text-[.62rem] font-semibold leading-tight text-osso-2 sm:block">{linha.frase}</span>
            </div>
            <ul className="flex flex-1 flex-wrap content-center gap-2 p-2.5">
              {linha.itens.map((l) => <li key={l.item.id}><Peca l={l} meu={meus[`${t.slug}::${l.item.id}`]?.tier} cor={linha.cor} abrir={() => setAberto(l.item.id)} /></li>)}
              {linha.itens.length === 0 && <li className="self-center px-2 text-xs text-apagado/70">ninguém aqui (ainda)</li>}
            </ul>
          </div>
        ))}
        {q.semVotos.length > 0 && (
          <div className="flex min-h-[4.5rem] border-t border-dashed border-white/10 bg-black/20">
            <div className="flex w-16 shrink-0 items-center justify-center text-center font-mono text-[.6rem] font-extrabold uppercase leading-tight text-apagado sm:w-24">sem<br />votos</div>
            <ul className="flex flex-1 flex-wrap content-center gap-2 p-2.5">
              {q.semVotos.map((l) => <li key={l.item.id}><Peca l={l} meu={meus[`${t.slug}::${l.item.id}`]?.tier} cor="#8f8875" abrir={() => setAberto(l.item.id)} /></li>)}
            </ul>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-apagado">{total.toLocaleString('pt-BR')} votos · a média decide a linha · votação aberta, sem data pra acabar. <span className="text-osso-2">Toque num item para votar.</span></p>

      <Modal aberto={Boolean(linhaAberta)} fechar={() => setAberto(null)} titulo={linhaAberta?.item.nome ?? ''} largura="max-w-xl">
        {linhaAberta && <PainelVoto t={t} l={linhaAberta} quem={quem} fechar={() => setAberto(null)} />}
      </Modal>
    </>
  )
}

function Peca({ l, meu, cor, abrir }: { l: LinhaPlacar; meu?: Tier; cor: string; abrir: () => void }) {
  return (
    <button type="button" onClick={abrir} aria-haspopup="dialog" aria-label={`${l.item.nome}: ${l.votos} votos${l.tier ? `, tier ${l.tier}` : ''}${meu ? `, seu voto ${meu}` : ''}. Votar`}
      className="group relative flex w-[5.6rem] flex-col items-center gap-1.5 rounded-xl border border-white/[.08] bg-chao px-1.5 pb-2 pt-2.5 text-center transition-all hover:-translate-y-0.5 hover:border-white/25 sm:w-[6.4rem]"
      style={{ boxShadow: meu ? `0 0 0 1.5px ${cor}` : undefined }}>
      <span className="grid size-10 place-items-center"><IconeItem item={l.item} /></span>
      <span className="line-clamp-2 text-[.72rem] font-bold leading-tight text-osso">{l.item.nome}</span>
      <span className="font-mono text-[.6rem] font-extrabold tabular-nums text-apagado">{l.votos} {l.votos === 1 ? 'voto' : 'votos'}</span>
      {meu && <span className="absolute -right-1.5 -top-1.5 rounded-md px-1 font-mono text-[.58rem] font-extrabold text-noite" style={{ background: TIERS.find((x) => x.id === meu)!.cor }}>você: {meu}</span>}
    </button>
  )
}

function PainelVoto({ t, l, quem, fechar }: { t: Tierlist; l: LinhaPlacar; quem: VotoTier[] | null; fechar: () => void }) {
  const conta = useConta()
  const chave = `${t.slug}::${l.item.id}`
  const meu = useLocal((e) => e.tlVotos[chave], undefined)
  const pref = useLocal((e) => e.visibilidade, 'perguntar' as Visibilidade)
  const [anonimo, setAnonimo] = useState(meu ? meu.anonimo : pref !== 'visivel')
  const [lembrar, setLembrar] = useState(true)
  const [entrar, setEntrar] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const maior = Math.max(1, ...TIERS.map((x) => l.porTier[x.id]))

  async function votar(tier: Tier | null) {
    if (!conta) return setEntrar(true)
    setErro(null)
    const antes = meu
    const primeiraEscolha = pref === 'perguntar' && lembrar && tier
    mudar((e) => {
      const tl = { ...e.tlVotos }; if (tier) tl[chave] = { tier, anonimo }; else delete tl[chave]
      return { ...e, tlVotos: tl, visibilidade: primeiraEscolha ? (anonimo ? 'anonimo' : 'visivel') : e.visibilidade }
    })
    if (comunidadeAtiva) {
      try {
        const r = await import('@/lib/comunidade/cliente-real')
        await r.votarTier(t.slug, l.item.id, tier, anonimo)
        if (primeiraEscolha) await r.definirVisibilidade(anonimo ? 'anonimo' : 'visivel', false)
      } catch (x) {
        mudar((e) => { const tl = { ...e.tlVotos }; if (antes) tl[chave] = antes; else delete tl[chave]; return { ...e, tlVotos: tl } })
        return setErro((x as Error).message)
      }
    }
    if (tier) setTimeout(fechar, 350)
  }

  const visiveis = (quem ?? []).filter((v) => v.item === l.item.id && v.usuario)
  const porTier = TIERS.map((x) => ({ ...x, nomes: [...new Set(visiveis.filter((v) => v.tier === x.id).map((v) => v.usuario!))] })).filter((x) => x.nomes.length)
  const anonimos = Math.max(0, l.votos - visiveis.length)

  return (
    <div className="p-5 pr-14 sm:p-7 sm:pr-14">
      <div className="flex items-center gap-3.5">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-chao"><IconeItem item={l.item} tamanho={52} /></span>
        <div className="min-w-0">
          <p className="hud text-[.62rem] text-apagado">{t.titulo}</p>
          <h2 className="truncate text-xl font-black tracking-tight">{l.item.nome}</h2>
          <p className="text-sm text-osso-2">{l.tier ? <>A comunidade diz <b style={{ color: TIERS.find((x) => x.id === l.tier)!.cor }}>{l.tier}</b> · {l.votos} votos</> : 'Ninguém votou ainda. Seja o primeiro.'}</p>
        </div>
      </div>

      {/* distribuição dos votos */}
      <div className="mt-5 grid grid-cols-6 items-end gap-1.5" aria-label="Votos por tier">
        {TIERS.map((x) => (
          <div key={x.id} className="flex flex-col items-center gap-1">
            <span className="font-mono text-[.62rem] font-bold tabular-nums text-apagado">{l.porTier[x.id]}</span>
            <span className="w-full rounded-t-sm" style={{ height: `${6 + (l.porTier[x.id] / maior) * 46}px`, background: x.cor, opacity: l.tier === x.id ? 1 : 0.45 }} />
          </div>
        ))}
      </div>

      <h3 className="hud mt-6 text-[.68rem] text-osso-2">{meu ? 'Seu voto (pode mudar quando quiser)' : 'Seu voto'}</h3>
      <div className="mt-2.5 grid grid-cols-6 gap-1.5">
        {TIERS.map((x) => (
          <button key={x.id} type="button" onClick={() => votar(x.id)} aria-pressed={meu?.tier === x.id}
            className={cx('titulo grid h-14 place-items-center rounded-xl border-2 text-2xl transition-transform hover:-translate-y-0.5', meu?.tier === x.id ? 'text-noite' : 'bg-transparent')}
            style={{ borderColor: x.cor, color: meu?.tier === x.id ? undefined : x.cor, background: meu?.tier === x.id ? x.cor : undefined }}>{x.id}</button>
        ))}
      </div>

      <fieldset className="mt-4">
        <legend className="sr-only">Como seu voto aparece</legend>
        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-white/[.04] p-1">
          {[[true, 'Votar anônimo', 'só conta no placar'], [false, 'Mostrar meu nome', 'aparece em "quem votou"']].map(([v, r, d]) => (
            <label key={String(v)} className={cx('cursor-pointer rounded-lg px-3 py-2 text-center transition-colors', anonimo === v ? 'bg-chao-2 text-osso shadow' : 'text-osso-2 hover:text-osso')}>
              <input type="radio" name="visibilidade" className="sr-only" checked={anonimo === v} onChange={() => setAnonimo(v as boolean)} />
              <span className="block text-sm font-bold">{r as string}</span><span className="block text-[.7rem] text-apagado">{d as string}</span>
            </label>
          ))}
        </div>
        {pref === 'perguntar' ? (
          <label className="mt-2.5 flex items-center gap-2 text-sm text-osso-2"><input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} className="size-4 accent-[var(--color-alerta)]" />Usar essa escolha nos próximos votos (muda no seu perfil)</label>
        ) : (
          <p className="mt-2.5 text-xs text-apagado">Padrão: {pref === 'anonimo' ? 'sempre anônimo' : 'sempre com nome'}. {conta && <Link href={`/comunidade/u/${conta.usuario}#votos`} className="font-semibold text-alerta hover:underline">Mudar no perfil</Link>}</p>
        )}
      </fieldset>
      {meu && <button type="button" onClick={() => votar(null)} className="mt-3 text-xs font-semibold text-apagado hover:text-sangue">Tirar meu voto</button>}
      {erro && <p role="alert" className="mt-2 text-sm text-sangue">{erro}</p>}

      <h3 className="hud mt-7 text-[.68rem] text-osso-2">Quem votou</h3>
      {!conta ? (
        <button type="button" onClick={() => setEntrar(true)} className="mt-2.5 w-full rounded-xl border border-dashed border-white/15 p-4 text-sm text-osso-2 hover:border-white/30">Entre para ver quem votou em cada tier (1 clique, sem senha).</button>
      ) : quem == null ? (
        <p className="mt-2.5 text-sm text-apagado">Carregando…</p>
      ) : (
        <div className="mt-2.5 grid gap-2">
          {porTier.map((x) => (
            <div key={x.id} className="flex items-start gap-2.5">
              <span className="titulo w-8 shrink-0 text-center text-lg" style={{ color: x.cor }}>{x.id}</span>
              <p className="flex flex-wrap gap-1.5">{x.nomes.map((n) => <Link key={n} href={`/comunidade/u/${n}`} className="rounded-full bg-white/[.06] px-2.5 py-1 text-xs font-semibold text-osso-2 hover:bg-white/10 hover:text-osso">{n}</Link>)}</p>
            </div>
          ))}
          {anonimos > 0 && <p className="text-xs text-apagado">+ {anonimos} {anonimos === 1 ? 'voto anônimo' : 'votos anônimos'}</p>}
          {porTier.length === 0 && anonimos === 0 && <p className="text-sm text-apagado">Ninguém votou ainda.</p>}
        </div>
      )}
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Para votar e ver quem votou, entre em 1 clique. Sem senha." />}
    </div>
  )
}
