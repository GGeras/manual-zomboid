import Link from 'next/link'
import { discord, youtube } from '@/config/publico'
import { CATEGORIAS } from '@/lib/comunidade/categorias'
import type { Topico } from '@/lib/comunidade/tipos'
import type { Guia } from '@/lib/conteudo'
import { EPISODIOS, TEMAS } from '@/lib/repo'
import type { DiscordWidget, Noticia, Short } from '@/lib/externos'
import { cx, dataCurta } from '@/lib/util'
import { CartaoTopico } from '../comunidade/cartao-topico'
import { Discord, Jogo, Mais, Relogio, Seta } from '../icones'
import { LiteYoutube } from '../lite-youtube'

export function CabecalhoSecao({ n, rotulo, titulo, destaque, children, id }: { n: string; rotulo: string; titulo: string; destaque?: string; children?: React.ReactNode; id: string }) {
  return (
    <div data-revelar className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <div>
        <p className="hud flex items-center gap-3 text-apagado"><span className="text-sangue">{n}</span><span className="h-px w-8 bg-white/15" />{rotulo}</p>
        <h2 id={id} className="titulo mt-3 text-[clamp(2.1rem,5.5vw,3.6rem)]">{titulo}{destaque && <> <span className="text-sangue">{destaque}</span></>}</h2>
      </div>
      {children}
    </div>
  )
}

// ---------- 2. Shorts recentes ----------
const COR_TEMA = ['#ff3d55', '#8fe04a', '#ffb020', '#6fb7ff']
export function Shorts({ fonte, lista }: { fonte: 'youtube' | 'repo'; lista: Short[] }) {
  return (
    <section id="shorts" aria-labelledby="shorts-titulo" className="relative scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CabecalhoSecao id="shorts-titulo" n="01" rotulo="Shorts recentes" titulo="60 segundos." destaque="Uma lição.">
          {youtube.canalUrl && <Link href={youtube.canalUrl} className="botao botao-contorno">Ver o canal <Seta /></Link>}
        </CabecalhoSecao>
      </div>
      <ul className="trilho mt-10 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw_-_80rem)/2_+_1.5rem))]">
        {lista.map((s, i) => {
          const tema = TEMAS.find((t) => s.nn && t.eps.includes(s.nn))
          return (
            <li key={s.id ?? s.nn ?? i} data-revelar style={{ ['--atraso' as string]: `${Math.min(i, 5) * 70}ms` }} className="w-[13.5rem] shrink-0 sm:w-[15rem]">
              {fonte === 'youtube' && s.id ? (
                <>
                  <LiteYoutube id={s.id} titulo={s.titulo} vertical />
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-osso-2">{s.titulo}</p>
                </>
              ) : (
                <CapaShort nn={s.nn} titulo={s.titulo} moodle={tema?.moodle} cor={COR_TEMA[i % COR_TEMA.length]} guia={tema?.guia} />
              )}
            </li>
          )
        })}
      </ul>
      {fonte === 'repo' && <p className="mx-auto mt-4 max-w-7xl px-4 text-xs text-apagado sm:px-6">Os players entram assim que o canal for ligado ao site.</p>}
    </section>
  )
}

/** Capa no padrão do canal (EP no canto, título grande, ícone real) enquanto o player não está ligado. */
function CapaShort({ nn, titulo, moodle, cor, guia }: { nn: string | null; titulo: string; moodle?: string; cor: string; guia?: string }) {
  const corpo = (
    <div className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-white/10 bg-[#0c0d10] transition-transform duration-300 hover:-translate-y-1">
      <div aria-hidden className="absolute inset-0 opacity-80" style={{ background: `radial-gradient(120% 70% at 50% 100%, ${cor}38, transparent 65%), radial-gradient(90% 50% at 50% 0%, #1b2430, transparent)` }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/jogo/logo-icone-64.webp" alt="" width={28} height={28} className="absolute left-3 top-3 size-7 rounded-full" loading="lazy" />
      {nn && <span className="chip absolute right-3 top-3.5 border-osso/70 text-osso">EP {nn}</span>}
      <p className="titulo absolute inset-x-3 top-16 text-[1.5rem] leading-[.95] text-osso [overflow-wrap:anywhere]">{titulo}</p>
      {moodle && <span className="moodle absolute bottom-16 left-1/2 size-20 -translate-x-1/2 transition-transform duration-500 group-hover:scale-110"><Jogo nome={moodle} tamanho={64} className="size-16" /></span>}
      <span className="absolute inset-x-0 bottom-4 text-center font-mono text-[.66rem] font-extrabold uppercase tracking-widest" style={{ color: cor }}>{guia ? 'Ler o guia →' : 'No canal'}</span>
    </div>
  )
  return guia ? <Link href={`/guias/${guia}`} aria-label={`${titulo}: ler o guia`}>{corpo}</Link> : corpo
}

// ---------- 3. O que você aprende ----------
export function Temas() {
  const status = new Map(EPISODIOS.map((e) => [e.nn, e.status]))
  return (
    <section aria-labelledby="temas-titulo" className="relative border-y border-white/[.05] bg-[#0d0d0f] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CabecalhoSecao id="temas-titulo" n="02" rotulo="O que você aprende" titulo="Tudo que" destaque="te mata." />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TEMAS.map((t, i) => {
            const noAr = t.eps.filter((e) => status.get(e) === 'publicado').length
            const conteudo = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="moodle size-14 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"><Jogo nome={t.moodle} tamanho={48} className="size-11" /></span>
                  <span className="font-mono text-[.68rem] font-extrabold tabular-nums text-apagado">{String(i + 1).padStart(2, '0')}/{String(TEMAS.length).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-tight tracking-tight">{t.nome}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-osso-2">{t.texto}</p>
                <div className="mt-auto flex items-center gap-2 pt-5">
                  <span className="chip h-5 border-white/15 text-[.6rem] text-osso-2">{t.eps.length} {t.eps.length === 1 ? 'vídeo' : 'vídeos'}</span>
                  {noAr > 0 && <span className="chip h-5 border-vivo/40 text-[.6rem] text-vivo">{noAr} no ar</span>}
                  {t.guia && <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-alerta">Guia <Seta className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>}
                </div>
              </>
            )
            const cls = 'group flex h-full flex-col rounded-xl border border-borda bg-chao p-5 transition-colors'
            return (
              <li key={t.nome} data-revelar style={{ ['--atraso' as string]: `${(i % 4) * 60}ms` }}>
                {t.guia ? <Link href={`/guias/${t.guia}`} className={cx(cls, 'hover:border-alerta/40 hover:bg-chao-2')}>{conteudo}</Link> : <div className={cls}>{conteudo}</div>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// ---------- 4. Em alta na Comunidade ----------
export function EmAlta({ topicos, numeros }: { topicos: Topico[]; numeros: { topicos: number; comentarios: number; pessoas: number } }) {
  return (
    <section aria-labelledby="alta-titulo" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute -right-40 top-10 -z-10 size-[36rem] rounded-full bg-sangue/[.06] blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <CabecalhoSecao id="alta-titulo" n="03" rotulo="Em alta na Comunidade" titulo="Conta" destaque="como foi." />
          <p data-revelar className="mt-6 max-w-md text-lg leading-relaxed text-osso-2">A rede social do Zomboid em português. Tire dúvida, mostre sua base, conte como morreu. Ler não precisa de conta; postar é colar o print e pronto.</p>
          <dl data-revelar className="mt-8 flex gap-8">
            {[[numeros.topicos, 'tópicos'], [numeros.comentarios, 'respostas'], [numeros.pessoas, 'sobreviventes']].map(([n, r]) => (
              <div key={r}><dt className="sr-only">{r}</dt><dd><span className="block font-mono text-3xl font-extrabold tabular-nums">{n}</span><span className="text-xs font-semibold text-apagado">{r}</span></dd></div>
            ))}
          </dl>
          <div data-revelar className="mt-8 flex flex-wrap gap-3">
            <Link href="/comunidade" className="botao botao-sangue">Abrir a Comunidade <Seta /></Link>
            <Link href="/comunidade/novo" className="botao botao-contorno"><Mais /> Criar tópico</Link>
          </div>
          <ul data-revelar className="mt-10 flex flex-wrap gap-1.5" aria-label="Categorias">
            {CATEGORIAS.map((c) => (
              <li key={c.slug}><Link href={`/comunidade/c/${c.slug}`} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-white/5" style={{ borderColor: `${c.cor}40`, color: c.cor }}><Jogo nome={c.icone} tamanho={14} className="size-3.5" />{c.curto}</Link></li>
            ))}
          </ul>
        </div>
        <ol className="grid content-start gap-2.5">
          {topicos.map((t, i) => <li key={t.id} data-revelar style={{ ['--atraso' as string]: `${i * 70}ms` }}><CartaoTopico t={t} compacto /></li>)}
        </ol>
      </div>
    </section>
  )
}

// ---------- 5. Guias ----------
export function Guias({ guias }: { guias: Guia[] }) {
  return (
    <section aria-labelledby="guias-titulo" className="border-t border-white/[.05] bg-[#0d0d0f] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CabecalhoSecao id="guias-titulo" n="04" rotulo="Guias" titulo="O vídeo," destaque="por inteiro.">
          <Link href="/guias" className="botao botao-contorno">Todos os guias <Seta /></Link>
        </CabecalhoSecao>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {guias.slice(0, 3).map((g, i) => <li key={g.slug} data-revelar style={{ ['--atraso' as string]: `${i * 80}ms` }}><CartaoGuia g={g} /></li>)}
        </ul>
      </div>
    </section>
  )
}

export function CartaoGuia({ g }: { g: Guia }) {
  return (
    <Link href={`/guias/${g.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-borda bg-chao p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]">
      <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-alerta/[.07] blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-center gap-3">
        {g.moodle && <span className="moodle size-12"><Jogo nome={`moodles/${g.moodle}`} tamanho={40} className="size-9" /></span>}
        {g.icone && <span className="moodle size-12"><Jogo nome={`itens/${g.icone}`} tamanho={32} className="size-8" /></span>}
      </div>
      <h3 className="mt-6 text-xl font-extrabold leading-tight tracking-tight text-pretty">{g.titulo}</h3>
      <p className="mt-2 text-sm leading-relaxed text-osso-2">{g.resumo}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6 text-xs text-apagado">
        <span className="chip h-5 border-vivo/40 text-[.6rem] text-vivo">{g.build}</span>
        <span className="chip h-5 border-white/15 text-[.6rem] text-osso-2">{g.fatos.length} fatos</span>
        <span className="ml-auto inline-flex items-center gap-1"><Relogio className="size-3.5" />{g.minutos} min</span>
      </div>
    </Link>
  )
}

// ---------- 6. Discord ----------
// Rascunho até o Jose escrever o #regras do servidor (configuracao.md §6.1); depois, copiar o resumo de lá.
const REGRAS_RESUMO = ['Respeito acima de tudo: zoeira sim, ofensa não.', 'Nada de spam. Divulgação só no canal certo.', 'Conteúdo adulto ou ilegal: banimento direto.', 'Dúvida do jogo? Pergunte sem medo. Todo mundo morreu no dia 1.']
export function DiscordSecao({ widget }: { widget: DiscordWidget | null }) {
  return (
    <section id="discord" aria-labelledby="discord-titulo" className="relative scroll-mt-16 overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div data-revelar className="relative overflow-hidden rounded-3xl border border-[#5865F2]/25 bg-[linear-gradient(135deg,#141733_0%,#0e0f1a_55%,#0b0b0e_100%)] p-7 sm:p-12">
          <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-[#5865F2]/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="hud flex items-center gap-3 text-[#9aa3ff]"><span className="text-sangue">05</span><span className="h-px w-8 bg-white/15" />Discord</p>
              <h2 id="discord-titulo" className="titulo mt-3 text-[clamp(2.1rem,5.5vw,3.6rem)]">Ninguém sobrevive <span className="text-[#8b95ff]">sozinho.</span></h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-osso-2">Ache grupo para o multiplayer, mostre a run ao vivo e receba os vídeos novos primeiro.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {discord.convite
                  ? <a href={discord.convite} className="botao !min-h-[3.2rem] bg-[#5865F2] !px-6 text-base text-white hover:bg-[#6a76f6]"><Discord /> Entrar no Discord</a>
                  : <span className="botao !min-h-[3.2rem] cursor-default border border-dashed border-[#5865F2]/50 !px-6 text-base text-[#aab1ff]"><Discord /> Convite chegando</span>}
                {widget && <span className="inline-flex items-center gap-2 text-sm font-semibold text-osso-2"><span className="size-2.5 rounded-full bg-vivo shadow-[0_0_12px] shadow-vivo" />{widget.online.toLocaleString('pt-BR')} online agora</span>}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[.08] bg-black/30 p-6 backdrop-blur">
              <p className="hud text-osso-2">#regras, em resumo</p>
              <ol className="mt-4 space-y-3">
                {REGRAS_RESUMO.map((r, i) => (
                  <li key={r} className="flex gap-3 text-[.95rem] leading-snug text-osso-2"><span className="font-mono text-sm font-extrabold text-[#8b95ff]">{String(i + 1).padStart(2, '0')}</span>{r}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- 7. Atualizações do Zomboid ----------
export function Atualizacoes({ noticias }: { noticias: Noticia[] }) {
  return (
    <section aria-labelledby="atual-titulo" className="border-t border-white/[.05] pb-24 pt-16 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CabecalhoSecao id="atual-titulo" n="06" rotulo="Atualizações do Zomboid" titulo="O que mudou" destaque="no jogo." />
        {noticias.length ? (
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {noticias.map((n) => (
              <li key={n.url} data-revelar className="cartao flex flex-col p-6">
                <div className="flex items-center gap-2">{n.build && <span className="chip h-5 border-vivo/40 text-[.6rem] text-vivo">{n.build}</span>}<span className="text-xs text-apagado">{dataCurta(n.data)}</span></div>
                <h3 className="mt-4 text-lg font-extrabold leading-tight">{n.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-osso-2">{n.resumo}</p>
                <a href={n.url} rel="noopener" target="_blank" className="mt-auto pt-5 text-sm font-bold text-alerta hover:underline">Fonte oficial →</a>
              </li>
            ))}
          </ul>
        ) : (
          <div data-revelar className="mt-12 flex flex-col items-start gap-5 rounded-2xl border border-dashed border-white/10 p-7 sm:flex-row sm:items-center">
            <span className="moodle size-16 shrink-0"><Jogo nome="itens/Item_Radio" tamanho={32} className="size-10" /></span>
            <div>
              <p className="font-extrabold">Rádio em silêncio.</p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-osso-2">Quando sair atualização do Project Zomboid, a gente resume aqui em português, sempre com o build e o link da fonte oficial.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
