import Link from 'next/link'
import { discord } from '@/config/publico'
import { Discord, Seta } from '../icones'
import { Horda, type TopicoHorda } from './horda/horda'

/** Caminhos da abertura: cada zumbi do jogo carrega a placa de um tópico (o visitante já veio das redes, então o site
 *  mostra o que só existe aqui: tierlists, Comunidade, Discord, guias). casa = ladrilho (x, z) da rua onde o zumbi fica:
 *  a rua corre ao longo de x (z 0 a 1), casas ao fundo (z < -4), acampamento na frente (z 4 a 7). Ver horda/cena.ts. */
function caminhos(): TopicoHorda[] {
  return [
    { id: 'tierlists', titulo: 'Tierlists', linha: 'Vote no que é S+', href: '/comunidade/tierlists', icone: 'itens/Item_Axe', cor: '#ffb020', modelo: 2, casa: [-6, 1.5], casaRetrato: [-3, 0.8] },
    { id: 'comunidade', titulo: 'Comunidade', linha: 'Conte como você morreu', href: '/comunidade', icone: 'moodles/Mood_Dead', cor: '#ff3d55', modelo: 1, casa: [-3.5, -2.6], casaRetrato: [-2.5, -3] },
    { id: 'discord', titulo: 'Discord', linha: 'Ache grupo pro multiplayer', href: discord.convite ?? '#discord', externo: Boolean(discord.convite), icone: null, cor: '#8b95ff', modelo: 4, casa: [2, 0.8], casaRetrato: [1.5, -0.3] },
    { id: 'guias', titulo: 'Guias', linha: 'Cada dica, por inteiro', href: '/guias', icone: 'itens/Item_Book', cor: '#8fe04a', modelo: 3, casa: [4.5, -2.4], casaRetrato: [-1, -4] },
    { id: 'shorts', titulo: 'Shorts', linha: '60 segundos, uma lição', href: '#shorts', icone: null, cor: '#efe5cf', modelo: 5, casa: [0.5, 4], casaRetrato: [1.2, 3.2] },
  ]
}

/** 1. Abertura: a rua de Knox County com a horda do jogo, sozinha na tela (sem texto por cima: espaço para os zumbis e o lugar).
 *  Logo abaixo, o recado do site (título, botões, números). Fallback sem 3D: a noite estática e os cartões dos caminhos. */
export function Abertura({ fatos, guias, votos }: { fatos: number; guias: number; votos: number }) {
  return (
    <>
      <section id="abertura" aria-label="Knox County, à noite: escolha seu caminho" className="grao relative isolate overflow-hidden bg-breu">
        {/* sem 3D: a noite fria e a cena do canal ao fundo (somem quando a rua 3D aparece por cima) */}
        <div aria-hidden className="cena-fundo absolute inset-0 -z-10 transition-opacity duration-1000">
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1a2533_0%,#0d1117_45%,#08090b_80%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/jogo/cena-fogueira-540.webp" srcSet="/jogo/cena-fogueira-540.webp 540w, /jogo/cena-fogueira-1080.webp 1080w" sizes="100vw" alt="" width={1080} height={1920} decoding="async" className="cena-noite absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl opacity-25" />
          <div className="neblina" />
        </div>
        <div className="relative h-[calc(100svh-4rem)] min-h-[34rem] max-h-[64rem]">
          <Horda topicos={caminhos()} />
        </div>
        {/* convite para rolar: só um ícone, nada de texto em cima da rua */}
        <a href="#recado" aria-label="Rolar para baixo" className="seta-rolar absolute bottom-5 left-1/2 z-20 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-black/40 text-osso-2 backdrop-blur transition-colors hover:text-osso">
          <Seta className="size-4 rotate-90" />
        </a>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-noite to-transparent" />
      </section>

      <section id="recado" aria-labelledby="abertura-titulo" className="relative bg-noite">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:py-20">
          <div className="max-w-[40rem]">
            <p className="hud flex flex-wrap items-center gap-x-3 gap-y-1 text-osso-2">
              <span className="text-sangue">Project Zomboid</span><span aria-hidden className="text-white/20">/</span><span>Build 42</span><span aria-hidden className="text-white/20">/</span><span className="cursor">Knox County</span>
            </p>
            <h1 id="abertura-titulo" className="titulo mt-5 text-[clamp(2.6rem,9vw,5.2rem)]">
              <span className="text-osso">Você vai morrer. </span>
              <span className="text-sangue [text-shadow:0_0_40px_rgba(255,61,85,.35)]">Só que mais tarde.</span>
            </h1>
            <p className="mt-5 max-w-[34rem] text-[1.02rem] leading-relaxed text-osso-2 sm:text-lg">
              Vote nas tierlists da comunidade, ache grupo no Discord e aprenda com dicas conferidas no arquivo do jogo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/comunidade/tierlists" className="botao botao-sangue !min-h-[3.2rem] !px-6 text-base">Votar nas tierlists <Seta /></Link>
              {discord.convite && <a href={discord.convite} target="_blank" rel="noopener" className="botao botao-contorno !min-h-[3.2rem] !px-6 text-base"><Discord /> Entrar no Discord</a>}
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-6 border-t border-white/[.08] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            {[[votos, 'votos nas tierlists'], [fatos, 'fatos conferidos'], [guias, 'guias']].map(([n, r]) => (
              <div key={r}><dt className="sr-only">{r}</dt><dd><span className="block font-mono text-3xl font-extrabold tabular-nums text-osso">{n}</span><span className="mt-1 block text-xs font-semibold text-apagado">{r}</span></dd></div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
