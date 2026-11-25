import Link from 'next/link'
import { discord, youtube } from '@/config/publico'
import { CATEGORIAS } from '@/lib/comunidade/categorias'
import type { Topico } from '@/lib/comunidade/tipos'
import type { Guia } from '@/lib/conteudo'
import type { DiscordWidget, Noticia } from '@/lib/externos'
import { dataCurta } from '@/lib/util'
import { CartaoTopico } from '../comunidade/cartao-topico'
import { Discord, Jogo, Mais, Relogio, Seta } from '../icones'
import { ShortsTrilho, TemasGrade, type ShortCartao, type TemaCartao } from './shorts-temas'

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

// ---------- 2. Shorts recentes: capa do vídeo -> modal com o resumo conferido ----------
export function Shorts({ lista, fonte }: { lista: ShortCartao[]; fonte: 'youtube' | 'repo' }) {
  return (
    <section id="shorts" aria-labelledby="shorts-titulo" className="relative scroll-mt-16 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CabecalhoSecao id="shorts-titulo" n="02" rotulo="Shorts recentes" titulo="60 segundos." destaque="Uma lição.">
          {youtube.canalUrl && <Link href={youtube.canalUrl} className="botao botao-contorno">Ver o canal <Seta /></Link>}
        </CabecalhoSecao>
        <p data-revelar className="mt-4 max-w-xl text-osso-2">Toque num vídeo para ver o resumo: cada dica com o selo de conferida e a fonte (arquivo do jogo ou wiki com a build).</p>
      </div>
      <ShortsTrilho lista={lista} canalUrl={youtube.canalUrl} />
      {fonte === 'repo' && <p className="mx-auto mt-4 max-w-7xl px-4 text-xs text-apagado sm:px-6">Os players entram assim que o canal for ligado ao site.</p>}
    </section>
  )
}

// ---------- 3. O que você aprende: cada tema abre dicas diretas + os vídeos do tema ----------
export function Temas({ temas }: { temas: TemaCartao[] }) {
  return (
    <section aria-labelledby="temas-titulo" className="relative border-y border-white/[.05] bg-[#0d0d0f] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <CabecalhoSecao id="temas-titulo" n="03" rotulo="O que você aprende" titulo="Tudo que" destaque="te mata." />
        <TemasGrade temas={temas} />
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
          <CabecalhoSecao id="alta-titulo" n="04" rotulo="Em alta na Comunidade" titulo="Conta" destaque="como foi." />
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
        <CabecalhoSecao id="guias-titulo" n="05" rotulo="Guias" titulo="O vídeo," destaque="por inteiro.">
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
const ATALHOS = [{ c: 'jogarJunto', nome: 'jogar-junto' }, { c: 'dicas', nome: 'dicas-e-truques' }, { c: 'bases', nome: 'bases' }, { c: 'regras', nome: 'regras' }] as const
export function DiscordSecao({ widget }: { widget: DiscordWidget | null }) {
  return (
    <section id="discord" aria-labelledby="discord-titulo" className="relative scroll-mt-16 overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div data-revelar className="relative overflow-hidden rounded-3xl border border-[#5865F2]/25 bg-[linear-gradient(135deg,#141733_0%,#0e0f1a_55%,#0b0b0e_100%)] p-7 sm:p-12">
          <div aria-hidden className="absolute -right-24 -top-24 size-96 rounded-full bg-[#5865F2]/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="hud flex items-center gap-3 text-[#9aa3ff]"><span className="text-sangue">06</span><span className="h-px w-8 bg-white/15" />Discord</p>
              <h2 id="discord-titulo" className="titulo mt-3 text-[clamp(2.1rem,5.5vw,3.6rem)]">Ninguém sobrevive <span className="text-[#8b95ff]">sozinho.</span></h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-osso-2">Ache grupo para o multiplayer, mostre sua base, troque dicas e receba os vídeos novos primeiro.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {discord.convite
                  ? <a href={discord.convite} className="botao !min-h-[3.2rem] bg-[#5865F2] !px-6 text-base text-white hover:bg-[#6a76f6]"><Discord /> Entrar no Discord</a>
                  : <span className="botao !min-h-[3.2rem] cursor-default border border-dashed border-[#5865F2]/50 !px-6 text-base text-[#aab1ff]"><Discord /> Convite chegando</span>}
                {widget && <span className="inline-flex items-center gap-2 text-sm font-semibold text-osso-2"><span className="size-2.5 rounded-full bg-vivo shadow-[0_0_12px] shadow-vivo" />{widget.online.toLocaleString('pt-BR')} online agora</span>}
              </div>
              {ATALHOS.some((x) => discord.canal(x.c)) && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ir direto para um canal">
                  {ATALHOS.map((x) => { const url = discord.canal(x.c); return url && (
                    <li key={x.c}><a href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full border border-[#5865F2]/35 bg-black/25 px-3 py-1.5 text-sm font-semibold text-[#c3c8ff] transition-colors hover:border-[#8b95ff] hover:text-white"><span className="font-mono text-[#8b95ff]">#</span>{x.nome}</a></li>
                  ) })}
                </ul>
              )}
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
        <CabecalhoSecao id="atual-titulo" n="07" rotulo="Atualizações do Zomboid" titulo="O que mudou" destaque="no jogo." />
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
