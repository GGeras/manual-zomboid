import Link from 'next/link'
import { discord } from '@/config/publico'
import { Discord, Seta } from '../icones'
import { Horda, type TopicoHorda } from './horda/horda'

/** Caminhos da abertura: cada zumbi do jogo carrega a placa de um tópico (o visitante já veio das redes, então o site
 *  mostra o que só existe aqui: tierlists, Comunidade, Discord, guias). casa = lugar do zumbi no chão (x, z). */
function caminhos(): TopicoHorda[] {
  return [
    { id: 'tierlists', titulo: 'Tierlists', linha: 'Vote no que é S+', href: '/comunidade/tierlists', icone: 'itens/Item_Axe', cor: '#ffb020', modelo: 2, casa: [0.9, 1.2], casaRetrato: [-1.2, 1.5] },
    { id: 'comunidade', titulo: 'Comunidade', linha: 'Conte como você morreu', href: '/comunidade', icone: 'moodles/Mood_Dead', cor: '#ff3d55', modelo: 1, casa: [2.5, 0.3], casaRetrato: [1.2, 1.4] },
    { id: 'discord', titulo: 'Discord', linha: 'Ache grupo pro multiplayer', href: discord.convite ?? '#discord', externo: Boolean(discord.convite), icone: null, cor: '#8b95ff', modelo: 4, casa: [3.7, 1.5], casaRetrato: [0, -0.2] },
    { id: 'guias', titulo: 'Guias', linha: 'Cada dica, por inteiro', href: '/guias', icone: 'itens/Item_Book', cor: '#8fe04a', modelo: 3, casa: [1.4, -1.6], casaRetrato: [-0.75, -2.0] },
    { id: 'shorts', titulo: 'Shorts', linha: '60 segundos, uma lição', href: '#shorts', icone: null, cor: '#efe5cf', modelo: 5, casa: [4.0, -1.6], casaRetrato: [0.85, -2.3] },
  ]
}

/** 1. Abertura: a horda do jogo (3D, sob demanda) + o caminho para o que só existe aqui. Fallback: a noite estática e os cartões. */
export function Abertura({ fatos, guias, votos }: { fatos: number; guias: number; votos: number }) {
  return (
    <section id="abertura" aria-labelledby="abertura-titulo" className="grao relative isolate overflow-hidden bg-breu">
      {/* noite fria + a cena do canal ao fundo (some quando a horda 3D aparece por cima) */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_0%,#1a2533_0%,#0d1117_45%,#08090b_80%)]" />
      <div aria-hidden className="cena-fundo absolute inset-y-0 right-0 -z-10 w-full overflow-hidden transition-opacity duration-1000 md:w-[62%] [mask-image:linear-gradient(90deg,transparent,#000_35%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/jogo/cena-fogueira-540.webp" srcSet="/jogo/cena-fogueira-540.webp 540w, /jogo/cena-fogueira-1080.webp 1080w" sizes="(max-width: 768px) 100vw, 62vw" alt="" width={1080} height={1920} decoding="async" className="cena-noite absolute inset-x-0 bottom-0 w-full opacity-25 md:-bottom-[30%]" />
      </div>
      <div aria-hidden className="neblina -z-10" />

      <div className="relative md:min-h-[calc(100svh-4rem)]">
        {/* texto: por cima da cena, sem bloquear o ponteiro (os zumbis seguem o mouse por baixo) */}
        <div className="pointer-events-none relative z-10 mx-auto max-w-7xl px-4 pb-2 pt-10 sm:px-6 md:pb-10 md:pt-[12vh]">
          <div className="max-w-[34rem]">
            <p className="hud flex flex-wrap items-center gap-x-3 gap-y-1 text-osso-2">
              <span className="text-sangue">Project Zomboid</span><span aria-hidden className="text-white/20">/</span><span>Build 42</span><span aria-hidden className="text-white/20">/</span><span className="cursor">Knox County</span>
            </p>
            <h1 id="abertura-titulo" className="titulo mt-5 text-[clamp(2.6rem,10vw,4rem)] md:text-[clamp(3.4rem,5.8vw,5.6rem)] [text-shadow:0_4px_40px_rgba(0,0,0,.8)]">
              <span className="block text-osso">Você vai</span>
              <span className="block text-osso">morrer.</span>
              <span className="mt-1 block text-sangue [text-shadow:0_0_40px_rgba(255,61,85,.35)]">Só que mais tarde.</span>
            </h1>
            <p className="mt-5 max-w-[30rem] text-[1.02rem] leading-relaxed text-osso-2 [text-shadow:0_2px_12px_#000] sm:text-lg">
              Vote nas tierlists da comunidade, ache grupo no Discord e aprenda com dicas conferidas no arquivo do jogo.
              <span className="hidden md:inline"> Os zumbis estão de olho no seu mouse.</span>
            </p>
            <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
              <Link href="/comunidade/tierlists" className="botao botao-sangue !min-h-[3.2rem] !px-6 text-base">Votar nas tierlists <Seta /></Link>
              {discord.convite && <a href={discord.convite} target="_blank" rel="noopener" className="botao botao-contorno !min-h-[3.2rem] bg-black/30 !px-6 text-base backdrop-blur"><Discord /> Entrar no Discord</a>}
            </div>
            <dl className="mt-8 hidden max-w-sm grid-cols-3 gap-4 border-t border-white/[.08] pt-5 sm:grid">
              {[[votos, 'votos nas tierlists'], [fatos, 'fatos conferidos'], [guias, 'guias']].map(([n, r]) => (
                <div key={r}><dt className="sr-only">{r}</dt><dd><span className="block font-mono text-2xl font-extrabold tabular-nums text-osso">{n}</span><span className="mt-1 block text-xs font-semibold text-apagado">{r}</span></dd></div>
              ))}
            </dl>
          </div>
        </div>
        {/* palco da horda: no celular fica embaixo do texto; no desktop ocupa a abertura inteira, por trás do texto */}
        <div className="relative min-h-[30rem] md:absolute md:inset-0 md:min-h-0">
          <Horda topicos={caminhos()} />
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-noite to-transparent" />
    </section>
  )
}
