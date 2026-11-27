import Link from 'next/link'
import type { LinhaPlacar } from '@/lib/tierlist/placar'
import { quadro } from '@/lib/tierlist/placar'
import type { Tierlist } from '@/lib/tierlist/tipos'
import { cx } from '@/lib/util'
import { Balao, Seta, Soco } from '../icones'
import { IconeItem } from './quadro'

/** Cartão de uma tierlist com o topo do placar ao vivo (S+, S, A): o que chama a pessoa para votar. */
export function CartaoTierlist({ t, linhas, destaque = false }: { t: Tierlist; linhas: LinhaPlacar[]; destaque?: boolean }) {
  const q = quadro(linhas)
  const topo = q.tiers.filter((x) => x.itens.length).slice(0, 3)
  return (
    <Link href={`/comunidade/tierlists/${t.slug}`} className={cx('group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-chao p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]', destaque ? 'border-alerta/30 hover:border-alerta/60' : 'border-borda hover:border-white/25')}>
      <div className="flex items-center gap-2">
        <span className={cx('chip h-5 text-[.58rem]', t.tipo === 'oficial' ? 'border-alerta/50 text-alerta' : 'border-white/20 text-osso-2')}>{t.tipo === 'oficial' ? 'Oficial do canal' : 'Sugestão da comunidade'}</span>
      </div>
      <h3 className="mt-3 text-lg font-extrabold leading-tight tracking-tight text-pretty">{t.titulo}</h3>
      <ol className="mt-4 grid gap-1.5" aria-label="Topo do placar">
        {topo.map((x) => (
          <li key={x.id} className="flex items-center gap-2 rounded-lg bg-black/25 p-1.5">
            <span className="titulo grid w-9 shrink-0 place-items-center text-xl" style={{ color: x.cor }}>{x.id}</span>
            <span className="flex flex-1 flex-wrap gap-1">
              {x.itens.slice(0, 4).map((l) => <span key={l.item.id} title={l.item.nome} className="grid size-9 place-items-center rounded-md bg-chao-2"><IconeItem item={l.item} tamanho={34} /></span>)}
              {x.itens.length > 4 && <span className="grid size-9 place-items-center font-mono text-xs font-bold text-apagado">+{x.itens.length - 4}</span>}
            </span>
          </li>
        ))}
        {topo.length === 0 && <li className="rounded-lg bg-black/25 p-4 text-center text-sm text-apagado">Ninguém votou ainda. Abra a votação.</li>}
      </ol>
      <div className="mt-auto flex items-center gap-3 pt-5 text-xs font-semibold text-apagado">
        <span className="tabular-nums">{t.votos.toLocaleString('pt-BR')} votos</span>
        <span className="inline-flex items-center gap-1"><Balao className="size-3.5" />{t.comentarios}</span>
        {t.tipo === 'sugestao' && <span className="inline-flex items-center gap-1"><Soco className="size-3.5" />{t.apoios}</span>}
        <span className="ml-auto inline-flex items-center gap-1 font-bold text-alerta">Votar <Seta className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  )
}
