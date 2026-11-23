import Link from 'next/link'
import { discord, youtube } from '@/config/publico'
import { Discord, Jogo, Play } from '../icones'
import { Lanterna } from '../revelar'

/** 1. Abertura imersiva (S1: sem 3D). Render real do canal (modelos do jogo) graduado para noite: luar frio, fogueira quente,
 *  neblina, grão e a lanterna que segue o ponteiro. O 3D sob demanda entra na S2 por cima desta mesma cena (que vira o fallback). */
export function Abertura({ shortsNoAr, fatos, guias }: { shortsNoAr: number; fatos: number; guias: number }) {
  return (
    <section id="abertura" aria-labelledby="abertura-titulo" className="grao relative isolate overflow-hidden bg-breu">
      <Lanterna alvo="abertura" />
      {/* céu: noite fria */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_0%,#1a2533_0%,#0d1117_45%,#08090b_80%)]" />
      {/* celular: a cena vira fundo da abertura (imersão sem empurrar o título para baixo) */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[78svh] overflow-hidden md:hidden [mask-image:linear-gradient(#000_30%,transparent)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/jogo/cena-fogueira-540.webp" alt="" width={540} height={960} decoding="async" className="cena-noite absolute right-[-30%] top-[-8%] w-[95%] opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08090b_25%,transparent)]" />
      </div>
      <div aria-hidden className="neblina -z-10" />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-[1.15fr_.85fr] md:gap-6 md:py-16 lg:gap-16">
        {/* texto */}
        <div className="relative z-10">
          <p className="hud flex flex-wrap items-center gap-x-3 gap-y-1 text-osso-2">
            <span className="text-sangue">Project Zomboid</span><span aria-hidden className="text-white/20">/</span><span>Build 42</span><span aria-hidden className="text-white/20">/</span><span className="cursor">Dicas em 60 s</span>
          </p>
          <h1 id="abertura-titulo" className="titulo mt-5 text-[clamp(2.75rem,10.5vw,4.2rem)] md:text-[clamp(3.4rem,6.2vw,6.2rem)]">
            <span className="block text-osso">Você vai</span>
            <span className="block text-osso">morrer.</span>
            <span className="mt-1 block text-sangue [text-shadow:0_0_40px_rgba(255,61,85,.35)]">Só que mais tarde.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[1.06rem] leading-relaxed text-osso-2 sm:text-lg">
            Shorts de 60 segundos com o que mata (e o que salva) no Project Zomboid. Cada dado conferido antes de virar vídeo. Guias que aprofundam cada um e uma comunidade pra contar como foi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={youtube.shortsUrl ?? '#shorts'} className="botao botao-sangue !min-h-[3.2rem] !px-6 text-base"><Play className="size-[1.1rem]" /> Assistir os Shorts</Link>
            <Link href={discord.convite ?? '#discord'} className="botao botao-contorno !min-h-[3.2rem] !px-6 text-base"><Discord /> Entrar no Discord</Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/[.08] pt-6">
            {[[shortsNoAr, 'Shorts no ar'], [fatos, 'fatos conferidos'], [guias, 'guias']].map(([n, r]) => (
              <div key={r}><dt className="sr-only">{r}</dt><dd><span className="block font-mono text-2xl font-extrabold tabular-nums text-osso sm:text-3xl">{n}</span><span className="mt-1 block text-xs font-semibold text-apagado">{r}</span></dd></div>
            ))}
          </dl>
        </div>

        {/* a cena: um Short vertical, à noite */}
        <div className="relative mx-auto w-full max-w-[22rem] max-md:max-w-[14rem] md:max-w-[24rem]">
          <div aria-hidden className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(255,140,60,.28),transparent)] blur-2xl" />
          <figure className="relative aspect-[9/16] overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,.95),0_0_0_1px_rgba(255,255,255,.03)] rotate-[1.5deg] transition-transform duration-700 hover:rotate-0">
            <picture>
              <source srcSet="/jogo/cena-fogueira-540.webp 540w, /jogo/cena-fogueira-1080.webp 1080w" sizes="(max-width: 768px) 250px, 384px" type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jogo/cena-fogueira-540.webp" alt="Render do canal com os modelos do jogo: o sobrevivente de jaqueta verde agachado, cozinhando numa fogueira de pedras ao lado de uma casa, à noite" width={540} height={960} fetchPriority="high" decoding="async" className="cena-noite absolute inset-0 size-full object-cover" />
            </picture>
            <div aria-hidden className="luar" />
            <div aria-hidden className="fogo" style={{ left: '38%', top: '72%', width: '64%', aspectRatio: '1', marginLeft: '-12%' }} />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_60%_at_58%_86%,transparent_20%,rgba(6,10,18,.35)_70%,rgba(6,10,18,.7))]" />
            <div aria-hidden className="neblina b" />
            <div aria-hidden className="lanterna" />
            {/* HUD do Short */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jogo/logo-icone-64.webp" alt="" width={36} height={36} className="absolute left-3 top-3 size-9 rounded-full ring-1 ring-black/50" />
            <span className="chip absolute right-3 top-3.5 border-osso/70 bg-black/50 text-osso">Noite 1</span>
            <div className="absolute right-2.5 top-[42%] flex flex-col gap-1.5">
              {['moodles/Mood_Scared', 'moodles/Status_Hunger', 'moodles/Mood_Sleepy'].map((m, i) => (
                <span key={m} className="moodle size-9 animate-[surgir_.5s_var(--ease-snap)_both]" style={{ animationDelay: `${600 + i * 180}ms` }}><Jogo nome={m} tamanho={30} className="size-7" /></span>
              ))}
            </div>
            <figcaption className="absolute inset-x-0 top-0 px-4 pb-16 pt-16 [background:linear-gradient(rgba(0,0,0,.6),transparent)]">
              <p className="titulo text-[1.6rem] leading-[.92] text-osso">Sobreviva</p>
              <p className="titulo text-[1.6rem] leading-[.92] text-vivo">até amanhecer</p>
            </figcaption>
            <div aria-hidden className="vinheta" />
          </figure>
        </div>
      </div>

      {/* rolar */}
      <a href="#shorts" aria-label="Rolar para os Shorts" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-apagado hover:text-osso md:flex">
        <span className="hud text-[.62rem]">Role</span>
        <span className="h-9 w-px bg-gradient-to-b from-current to-transparent" />
      </a>
    </section>
  )
}
