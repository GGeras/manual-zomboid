import Link from 'next/link'
import { categoria as cat } from '@/lib/comunidade/categorias'
import type { Topico } from '@/lib/comunidade/tipos'
import { textoPuro } from '@/lib/markdown'
import { cx } from '@/lib/util'
import { Avatar } from '../avatar'
import { Balao, Check, Jogo, Pino } from '../icones'
import { Brabo, Tempo } from './pecas'

export function ChipCategoria({ slug, link = true, className }: { slug: string; link?: boolean; className?: string }) {
  const c = cat(slug)
  if (!c) return null
  const corpo = (
    <span className={cx('inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-[.7rem] font-extrabold uppercase tracking-wide', className)} style={{ color: c.cor, background: `${c.cor}14`, boxShadow: `inset 0 0 0 1px ${c.cor}33` }}>
      <Jogo nome={c.icone} tamanho={14} className="size-3.5" /> {c.curto}
    </span>
  )
  return link ? <Link href={`/comunidade/c/${c.slug}`} className="relative z-10 rounded-md hover:brightness-125">{corpo}</Link> : corpo
}

export function Etiquetas({ t }: { t: Pick<Topico, 'build' | 'dia' | 'episodio'> }) {
  if (!t.build && t.dia == null && !t.episodio) return null
  return (
    <span className="flex flex-wrap gap-1.5">
      {t.build && <span className="chip h-5 border-white/15 text-[.62rem] text-osso-2">{t.build}</span>}
      {t.dia != null && <span className="chip h-5 border-white/15 text-[.62rem] text-osso-2">Dia {t.dia}</span>}
      {t.episodio && <span className="chip h-5 border-sangue/40 text-[.62rem] text-sangue">EP {t.episodio}</span>}
    </span>
  )
}

/** Cartão do feed. Inteiro clicável (link esticado), com os botões por cima. */
export function CartaoTopico({ t, compacto = false }: { t: Topico; compacto?: boolean }) {
  const href = `/comunidade/t/${t.id}`
  const img = t.imagens[0]
  return (
    <article className={cx('group relative flex gap-2 rounded-xl border border-borda bg-chao transition-colors hover:border-white/20 hover:bg-chao-2 sm:gap-3', compacto ? 'p-3' : 'p-3 sm:p-4', t.fixado && 'border-alerta/30')}>
      {!compacto && <div className="relative z-10 hidden sm:block"><Brabo alvo={`t:${t.id}`} votos={t.votos} vertical /></div>}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-apagado">
          <ChipCategoria slug={t.categoria} />
          <Link href={`/comunidade/u/${t.autor.usuario}`} className="relative z-10 inline-flex items-center gap-1.5 font-semibold text-osso-2 hover:text-osso">
            <Avatar perfil={t.autor} tamanho={18} /> {t.autor.usuario}
            {t.autor.papel !== 'usuario' && <span className="rounded bg-vivo/15 px-1 font-mono text-[.6rem] font-extrabold uppercase text-vivo">{t.autor.papel === 'admin' ? 'canal' : 'mod'}</span>}
          </Link>
          <span aria-hidden>·</span><Tempo iso={t.criadoEm} />
          {t.fixado && <span className="inline-flex items-center gap-1 font-mono text-[.66rem] font-extrabold uppercase text-alerta"><Pino className="size-3.5" />Fixado</span>}
          {t.resolvido && <span className="inline-flex items-center gap-1 font-mono text-[.66rem] font-extrabold uppercase text-vivo"><Check className="size-3.5" />Resolvido</span>}
        </div>
        <h3 className={cx('mt-1.5 font-bold leading-snug text-osso text-pretty', compacto ? 'text-[.98rem]' : 'text-[1.06rem] sm:text-lg')}>
          <Link href={href} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-alerta">{t.titulo}</Link>
        </h3>
        {!compacto && <p className="mt-1 line-clamp-2 text-[.93rem] leading-relaxed text-osso-2">{textoPuro(t.corpo, 220)}</p>}
        {!compacto && img && (
          <div className="relative mt-3 overflow-hidden rounded-lg border border-white/5 bg-black" style={{ aspectRatio: '16 / 9', maxHeight: 360 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-xl" loading="lazy" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} width={img.w} height={img.h} loading="lazy" decoding="async" className="relative mx-auto h-full w-auto object-contain" />
            {t.imagens.length > 1 && <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs font-bold">+{t.imagens.length - 1}</span>}
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-2">
          <span className={cx('relative z-10', !compacto && 'sm:hidden')}><Brabo alvo={`t:${t.id}`} votos={t.votos} tamanho="sm" /></span>
          <Link href={`${href}#respostas`} className="relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold text-osso-2 hover:bg-white/[.06] hover:text-osso">
            <Balao className="size-4" /> {t.comentarios} <span className="hidden sm:inline">{t.comentarios === 1 ? 'resposta' : 'respostas'}</span>
          </Link>
          <span className="ml-auto"><Etiquetas t={t} /></span>
        </div>
      </div>
    </article>
  )
}
