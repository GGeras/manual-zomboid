'use client'
// Shorts recentes (capa -> modal com o resumo conferido) e "O que você aprende" (tema -> modal com dicas diretas + vídeos).
// Tudo que é dado do jogo aqui vem pronto do servidor como Dica (texto exato de info-validada/ + build + fonte).
import { useState } from 'react'
import Link from 'next/link'
import type { Dica } from '@/lib/conteudo'
import { cx } from '@/lib/util'
import { FatoConferido } from '../fato'
import { Balao, Jogo, Play, Seta } from '../icones'
import { LiteYoutube } from '../lite-youtube'
import { Modal } from '../modal'

export interface ShortCartao { chave: string; id: string | null; titulo: string; capa: string | null; nn: string | null; tema: { nome: string; moodle: string; guia?: string } | null; dicas: Dica[] }
export interface TemaCartao { nome: string; texto: string; moodle: string; guia?: string; videos: number; noAr: number; dicas: Dica[]; shorts: { id: string; titulo: string; capa: string }[] }

const COR = ['#ff3d55', '#8fe04a', '#ffb020', '#6fb7ff']

export function ShortsTrilho({ lista, canalUrl }: { lista: ShortCartao[]; canalUrl: string | null }) {
  const [aberto, setAberto] = useState<ShortCartao | null>(null)
  return (
    <>
      <ul className="trilho mt-10 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw_-_80rem)/2_+_1.5rem))]">
        {lista.map((s, i) => (
          <li key={s.chave} data-revelar style={{ ['--atraso' as string]: `${Math.min(i, 5) * 70}ms` }} className="w-[13.5rem] shrink-0 sm:w-[15rem]">
            <button type="button" onClick={() => setAberto(s)} className="group block w-full text-left" aria-haspopup="dialog" aria-label={`${s.titulo}: ver resumo`}>
              <span className="relative block aspect-[9/16] overflow-hidden rounded-xl border border-white/10 bg-[#0c0d10] transition-transform duration-300 group-hover:-translate-y-1">
                {s.capa ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.capa} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full scale-[1.02] object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <span aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(120% 70% at 50% 100%, ${COR[i % 4]}38, transparent 65%), radial-gradient(90% 50% at 50% 0%, #1b2430, transparent)` }}>
                    <span className="titulo absolute inset-x-3 top-14 text-[1.45rem] leading-[.95] text-osso">{s.titulo}</span>
                    {s.tema && <span className="moodle absolute bottom-16 left-1/2 size-20 -translate-x-1/2"><Jogo nome={s.tema.moodle} tamanho={64} className="size-16" /></span>}
                  </span>
                )}
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                {s.nn && <span className="chip absolute left-2.5 top-2.5 border-osso/60 bg-black/50 text-osso">EP {s.nn}</span>}
                {s.dicas.length > 0 && <span className="chip absolute right-2.5 top-2.5 border-vivo/50 bg-black/60 text-vivo">✓ {s.dicas.length}</span>}
                <span className="absolute inset-x-3 bottom-3 flex items-center justify-between font-mono text-[.66rem] font-extrabold uppercase tracking-widest text-osso">
                  Ver resumo <Seta className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
              <span className="mt-3 line-clamp-2 block text-sm font-semibold leading-snug text-osso-2 group-hover:text-osso">{s.titulo}</span>
            </button>
          </li>
        ))}
      </ul>
      <Modal aberto={Boolean(aberto)} fechar={() => setAberto(null)} titulo={aberto?.titulo ?? ''} largura="max-w-4xl">
        {aberto && (
          <div className="grid gap-0 md:grid-cols-[minmax(0,17rem)_1fr]">
            <div className="border-b border-borda bg-black p-4 md:border-b-0 md:border-r md:p-5">
              {aberto.id ? <LiteYoutube id={aberto.id} titulo={aberto.titulo} vertical className="mx-auto max-w-[15rem]" /> : <div className="aspect-[9/16] rounded-xl bg-chao" />}
              {aberto.id && <a href={`https://www.youtube.com/shorts/${aberto.id}`} target="_blank" rel="noopener" className="mt-3 block text-center text-xs font-bold text-apagado hover:text-osso">Abrir no YouTube ↗</a>}
            </div>
            <div className="p-5 pr-14 sm:p-7 sm:pr-14">
              <p className="hud flex flex-wrap items-center gap-2 text-[.66rem] text-apagado">{aberto.nn && <span className="text-sangue">EP {aberto.nn}</span>}{aberto.tema && <span>{aberto.tema.nome}</span>}</p>
              <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-pretty">{aberto.titulo}</h2>
              <h3 className="hud mt-6 text-[.7rem] text-osso-2">Resumo do guia</h3>
              {aberto.dicas.length ? (
                <ul className="mt-3 grid gap-2.5">{aberto.dicas.map((d) => <li key={d.id}><FatoConferido f={d} compacto /></li>)}</ul>
              ) : (
                <p className="mt-3 rounded-xl border border-dashed border-white/10 p-4 text-sm text-osso-2">O resumo conferido deste vídeo ainda está sendo escrito. Enquanto isso, a dúvida pode ir para a Comunidade.</p>
              )}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {aberto.tema?.guia && <Link href={`/guias/${aberto.tema.guia}`} className="botao botao-sangue">Ler o guia completo <Seta /></Link>}
                <Link href={`/comunidade?q=${encodeURIComponent(aberto.tema?.nome ?? aberto.titulo)}`} className="botao botao-contorno"><Balao /> Discutir na Comunidade</Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {canalUrl && <p className="sr-only"><a href={canalUrl}>Ver o canal no YouTube</a></p>}
    </>
  )
}

export function TemasGrade({ temas }: { temas: TemaCartao[] }) {
  const [aberto, setAberto] = useState<TemaCartao | null>(null)
  return (
    <>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {temas.map((t, i) => (
          <li key={t.nome} data-revelar style={{ ['--atraso' as string]: `${(i % 4) * 60}ms` }}>
            <button type="button" onClick={() => setAberto(t)} aria-haspopup="dialog" className="group flex h-full w-full flex-col rounded-xl border border-borda bg-chao p-5 text-left transition-colors hover:border-alerta/40 hover:bg-chao-2">
              <span className="flex w-full items-start justify-between gap-3">
                <span className="moodle size-14 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"><Jogo nome={t.moodle} tamanho={48} className="size-11" /></span>
                <span className="font-mono text-[.68rem] font-extrabold tabular-nums text-apagado">{String(i + 1).padStart(2, '0')}/{String(temas.length).padStart(2, '0')}</span>
              </span>
              <span className="mt-5 block text-lg font-extrabold leading-tight tracking-tight">{t.nome}</span>
              <span className="mt-1.5 block text-sm leading-relaxed text-osso-2">{t.texto}</span>
              <span className="mt-auto flex w-full items-center gap-2 pt-5">
                {t.dicas.length > 0 && <span className="chip h-5 border-vivo/40 text-[.6rem] text-vivo">✓ {t.dicas.length} dicas</span>}
                <span className="chip h-5 border-white/15 text-[.6rem] text-osso-2">{t.videos} {t.videos === 1 ? 'vídeo' : 'vídeos'}</span>
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-alerta">Abrir <Seta className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Modal aberto={Boolean(aberto)} fechar={() => setAberto(null)} titulo={aberto?.nome ?? ''}>
        {aberto && (
          <div className="p-5 pr-14 sm:p-7 sm:pr-14">
            <div className="flex items-center gap-4">
              <span className="moodle size-14 shrink-0"><Jogo nome={aberto.moodle} tamanho={48} className="size-11" /></span>
              <div><p className="hud text-[.66rem] text-apagado">O que você aprende</p><h2 className="text-2xl font-black leading-tight tracking-tight">{aberto.nome}</h2></div>
            </div>
            <h3 className="hud mt-7 text-[.7rem] text-osso-2">Dicas diretas</h3>
            {aberto.dicas.length ? (
              <ul className="mt-3 grid gap-2.5">{aberto.dicas.map((d) => <li key={d.id}><FatoConferido f={d} compacto /></li>)}</ul>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-white/10 p-4 text-sm text-osso-2">As dicas conferidas deste tema entram junto com os próximos vídeos.</p>
            )}
            {aberto.shorts.length > 0 && (
              <>
                <h3 className="hud mt-7 text-[.7rem] text-osso-2">Vídeos do tema</h3>
                <ul className={cx('trilho mt-3 flex gap-3 overflow-x-auto pb-2')}>
                  {aberto.shorts.map((v) => (
                    <li key={v.id} className="w-36 shrink-0">
                      <a href={`https://www.youtube.com/shorts/${v.id}`} target="_blank" rel="noopener" className="group block">
                        <span className="relative block aspect-[9/16] overflow-hidden rounded-lg border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.capa} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform group-hover:scale-105" />
                          <span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid size-10 place-items-center rounded-full bg-sangue text-noite"><Play className="size-4 translate-x-0.5" /></span></span>
                        </span>
                        <span className="mt-2 line-clamp-2 block text-xs font-semibold text-osso-2 group-hover:text-osso">{v.titulo}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {aberto.guia && <Link href={`/guias/${aberto.guia}`} className="botao botao-sangue">Ler o guia <Seta /></Link>}
              <Link href={`/comunidade?q=${encodeURIComponent(aberto.nome)}`} className="botao botao-contorno"><Balao /> Perguntar na Comunidade</Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
