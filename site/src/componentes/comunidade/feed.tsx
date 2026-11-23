import Link from 'next/link'
import { CATEGORIAS, type Categoria } from '@/lib/comunidade/categorias'
import { comunidade, modoPrevia } from '@/lib/comunidade/dados'
import type { Ordem } from '@/lib/comunidade/tipos'
import { cx } from '@/lib/util'
import { Busca, Jogo, Mais } from '../icones'
import { CartaoTopico } from './cartao-topico'
import { TopicosLocais } from './topicos-locais'

const ORDENS: { id: Ordem; rotulo: string }[] = [
  { id: 'quente', rotulo: 'Em alta' }, { id: 'novos', rotulo: 'Novos' }, { id: 'semana', rotulo: 'Top da semana' }, { id: 'sem-resposta', rotulo: 'Sem resposta' },
]
export const lerOrdem = (o?: string): Ordem => (ORDENS.some((x) => x.id === o) ? (o as Ordem) : 'quente')

export async function Feed({ base, cat, ordem, q, build }: { base: string; cat?: Categoria; ordem: Ordem; q?: string; build?: string }) {
  const [topicos, numeros] = await Promise.all([comunidade.topicos({ ordem, categoria: cat?.slug, q, build }), comunidade.contagem()])
  const url = (o: Ordem) => `${base}?${new URLSearchParams({ ...(o !== 'quente' && { ordem: o }), ...(q && { q }), ...(build && { build }) })}`.replace(/\?$/, '')
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-3 py-6 sm:px-6 lg:grid-cols-[13.5rem_minmax(0,1fr)_18rem] lg:py-8">
      {/* categorias: lateral no desktop, trilho no celular */}
      <nav aria-label="Categorias" className="lg:sticky lg:top-24 lg:self-start">
        <p className="hud mb-3 hidden px-3 text-apagado lg:block">Categorias</p>
        <ul className="trilho -mx-3 flex gap-1.5 overflow-x-auto px-3 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
          <li><ItemCat href="/comunidade" ativo={!cat} rotulo="Tudo" icone="moodles/Mood_Happy" cor="#efe5cf" /></li>
          {CATEGORIAS.map((c) => <li key={c.slug}><ItemCat href={`/comunidade/c/${c.slug}`} ativo={cat?.slug === c.slug} rotulo={c.nome} curto={c.curto} icone={c.icone} cor={c.cor} /></li>)}
        </ul>
      </nav>

      <div className="min-w-0">
        {cat ? (
          <header className="mb-5 flex items-center gap-4 rounded-2xl border border-borda bg-chao p-4 sm:p-5" style={{ boxShadow: `inset 3px 0 0 ${cat.cor}` }}>
            <span className="moodle size-14 shrink-0"><Jogo nome={cat.icone} tamanho={40} className="size-9" /></span>
            <div><h1 className="text-2xl font-black tracking-tight" style={{ color: cat.cor }}>{cat.nome}</h1><p className="mt-0.5 text-sm text-osso-2">{cat.descricao}</p></div>
          </header>
        ) : (
          <header className="mb-5">
            <h1 className="titulo text-[clamp(2.2rem,6vw,3.4rem)]">Comunidade</h1>
            <p className="mt-2 text-osso-2">A rede social do Zomboid. Pergunte, mostre, conte como morreu.</p>
          </header>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form role="search" action={base} className="relative flex-1">
            <label htmlFor="busca" className="sr-only">Buscar tópicos</label>
            <Busca className="pointer-events-none absolute left-3.5 top-1/2 size-[1.1rem] -translate-y-1/2 text-apagado" />
            <input id="busca" name="q" type="search" defaultValue={q} placeholder={cat ? `Buscar em ${cat.curto}` : 'Buscar (sem acento também vale)'} className="campo !rounded-full !py-2.5 !pl-10" />
            {ordem !== 'quente' && <input type="hidden" name="ordem" value={ordem} />}
          </form>
          <Link href={`/comunidade/novo${cat ? `?categoria=${cat.slug}` : ''}`} className="botao botao-sangue shrink-0"><Mais /> Criar tópico</Link>
        </div>

        <nav aria-label="Ordenar" className="trilho -mx-3 mt-4 flex gap-1 overflow-x-auto border-b border-white/[.07] px-3 sm:mx-0 sm:px-0">
          {ORDENS.map((o) => (
            <Link key={o.id} href={url(o.id)} aria-current={ordem === o.id ? 'page' : undefined} scroll={false}
              className={cx('relative shrink-0 px-3.5 pb-3 pt-2 text-sm font-bold transition-colors', ordem === o.id ? 'text-osso after:absolute after:inset-x-2 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-sangue' : 'text-apagado hover:text-osso-2')}>
              {o.rotulo}
            </Link>
          ))}
        </nav>

        {q && <p className="mt-4 text-sm text-osso-2">{topicos.length} {topicos.length === 1 ? 'resultado' : 'resultados'} para <strong className="text-osso">“{q}”</strong> · <Link href={base} className="text-alerta hover:underline">limpar</Link></p>}

        <div className="mt-4 grid gap-2.5">
          {modoPrevia && !q && <TopicosLocais categoria={cat?.slug} ordem={ordem} />}
          {topicos.map((t) => <CartaoTopico key={t.id} t={t} />)}
          {!topicos.length && (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
              <Jogo nome="moodles/Mood_Bored" tamanho={56} className="mx-auto size-14 opacity-80" />
              <p className="mt-4 font-bold">{q ? 'Nada encontrado. Tente outra palavra.' : 'Nenhum sobrevivente postou aqui ainda. Seja o primeiro.'}</p>
              <Link href={`/comunidade/novo${cat ? `?categoria=${cat.slug}` : ''}`} className="botao botao-contorno mt-5">Criar tópico</Link>
            </div>
          )}
        </div>
      </div>

      <aside className="hidden space-y-4 lg:block lg:sticky lg:top-24 lg:self-start">
        <div className="cartao overflow-hidden">
          <div className="relative h-20 bg-[linear-gradient(135deg,#2a0f15,#111)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jogo/logo-emblema-256.webp" alt="" width={64} height={64} className="absolute -bottom-6 left-4 size-16 rounded-full ring-4 ring-chao" loading="lazy" />
          </div>
          <div className="p-4 pt-8">
            <p className="font-extrabold">Comunidade Manual Zomboid</p>
            <p className="mt-1 text-sm leading-relaxed text-osso-2">Conteúdo dos usuários: <span className="text-alerta">não verificado pelo canal</span>. Os fatos conferidos estão nos <Link href="/guias" className="underline hover:text-osso">Guias</Link>.</p>
            <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[.07] pt-4 text-center">
              {[[numeros.topicos, 'tópicos'], [numeros.comentarios, 'respostas'], [numeros.pessoas, 'pessoas']].map(([n, r]) => (
                <div key={r}><dt className="sr-only">{r}</dt><dd><span className="block font-mono text-lg font-extrabold">{n}</span><span className="text-[.7rem] text-apagado">{r}</span></dd></div>
              ))}
            </dl>
            <Link href="/comunidade/novo" className="botao botao-sangue mt-4 w-full">Criar tópico</Link>
          </div>
        </div>
        <div className="cartao p-4">
          <p className="hud text-osso-2">Regras em 4 linhas</p>
          <ol className="mt-3 space-y-2 text-sm text-osso-2">
            {['Respeito. Zoeira sim, ofensa não.', 'Escolha a categoria certa.', 'Print vale mais que mil palavras.', 'Resolveu? Marque a melhor resposta.'].map((r, i) => <li key={r} className="flex gap-2"><span className="font-mono font-extrabold text-sangue">{i + 1}.</span>{r}</li>)}
          </ol>
          <Link href="/comunidade/regras" className="mt-3 inline-block text-sm font-bold text-alerta hover:underline">Regras completas →</Link>
        </div>
      </aside>
    </div>
  )
}

function ItemCat({ href, ativo, rotulo, curto, icone, cor }: { href: string; ativo: boolean; rotulo: string; curto?: string; icone: string; cor: string }) {
  return (
    <Link href={href} aria-current={ativo ? 'page' : undefined}
      className={cx('flex shrink-0 items-center gap-2.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors lg:rounded-lg lg:border-transparent lg:py-2',
        ativo ? 'border-transparent bg-white/[.08] text-osso' : 'border-white/10 text-osso-2 hover:bg-white/[.04] hover:text-osso')}>
      <span className="grid size-6 place-items-center rounded-md" style={{ background: `${cor}1f` }}><Jogo nome={icone} tamanho={16} className="size-4" /></span>
      <span className="lg:hidden">{curto ?? rotulo}</span><span className="hidden lg:inline">{rotulo}</span>
    </Link>
  )
}
