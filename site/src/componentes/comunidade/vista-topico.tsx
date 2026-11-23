import Link from 'next/link'
import { categoria as cat } from '@/lib/comunidade/categorias'
import type { arvore } from '@/lib/comunidade/quente'
import type { Topico } from '@/lib/comunidade/tipos'
import { episodio } from '@/lib/repo'
import { Avatar } from '../avatar'
import { Check, Pino } from '../icones'
import { Markdown } from '../markdown'
import { ChipCategoria, Etiquetas } from './cartao-topico'
import { Conversa } from './conversa'
import { Galeria } from './galeria'
import { Brabo, CompartilharBotao, Denunciar, Tempo } from './pecas'

/** Página do tópico (pura: serve para o servidor e para os tópicos locais do modo prévia). */
export function VistaTopico({ t, comentarios }: { t: Topico; comentarios: ReturnType<typeof arvore> }) {
  const c = cat(t.categoria)
  const ep = episodio(t.episodio)?.status === 'publicado' ? episodio(t.episodio) : undefined // só liga a vídeo que está no ar
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-3 pb-24 pt-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:pt-8">
      <div className="min-w-0">
        <nav aria-label="Trilha" className="mb-4 flex items-center gap-2 text-sm text-apagado">
          <Link href="/comunidade" className="hover:text-osso">Comunidade</Link><span aria-hidden>/</span>
          {c && <Link href={`/comunidade/c/${c.slug}`} className="hover:text-osso">{c.nome}</Link>}
        </nav>
        <article className="rounded-2xl border border-borda bg-chao p-4 sm:p-6" aria-labelledby="titulo-topico">
          <header>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[.82rem] text-apagado">
              <ChipCategoria slug={t.categoria} />
              <Link href={`/comunidade/u/${t.autor.usuario}`} className="inline-flex items-center gap-2 font-semibold text-osso-2 hover:text-osso"><Avatar perfil={t.autor} tamanho={22} />{t.autor.usuario}</Link>
              {t.autor.papel !== 'usuario' && <span className="rounded bg-vivo/15 px-1 font-mono text-[.6rem] font-extrabold uppercase text-vivo">{t.autor.papel === 'admin' ? 'canal' : 'mod'}</span>}
              <span aria-hidden>·</span><Tempo iso={t.criadoEm} />{t.editadoEm && <span className="italic">(editado)</span>}
              {t.fixado && <span className="inline-flex items-center gap-1 font-mono text-[.66rem] font-extrabold uppercase text-alerta"><Pino className="size-3.5" />Fixado</span>}
            </div>
            <h1 id="titulo-topico" className="mt-3 text-[1.55rem] font-extrabold leading-tight tracking-tight text-pretty sm:text-[1.9rem]">{t.titulo}</h1>
            <div className="mt-3"><Etiquetas t={t} /></div>
          </header>
          {t.corpo && <Markdown texto={t.corpo} className="mt-4" />}
          {t.imagens.length > 0 && <Galeria imagens={t.imagens} />}
          {ep && (
            <Link href={ep.youtube ? `https://www.youtube.com/shorts/${ep.youtube}` : '/#shorts'} className="mt-5 flex items-center gap-3 rounded-xl border border-sangue/25 bg-sangue/[.05] p-3 hover:border-sangue/50">
              <span className="chip border-sangue text-sangue">EP {ep.nn}</span><span className="text-sm font-semibold">{ep.titulo ?? ep.tema}</span>
            </Link>
          )}
          <footer className="mt-5 flex flex-wrap items-center gap-1 border-t border-white/[.06] pt-3">
            <Brabo alvo={`t:${t.id}`} votos={t.votos} />
            <a href="#responder" className="inline-flex h-8 items-center rounded-full px-3 text-xs font-bold text-osso-2 hover:bg-white/[.06] hover:text-osso">Responder</a>
            <CompartilharBotao caminho={`/comunidade/t/${t.id}`} titulo={t.titulo} />
            <span className="ml-auto"><Denunciar alvo={`t:${t.id}`} /></span>
          </footer>
        </article>
        <p className="mt-2 px-1 text-xs text-apagado">Conteúdo da comunidade, não verificado pelo canal. Fatos conferidos: <Link href="/guias" className="underline hover:text-osso-2">Guias</Link>.</p>
        <Conversa topico={t} servidor={comentarios} />
      </div>
      <aside className="hidden lg:block">
        <div className="cartao sticky top-24 p-4">
          <p className="hud text-osso-2">Sobre {c?.nome ?? 'a categoria'}</p>
          <p className="mt-2 text-sm text-osso-2">{c?.descricao}</p>
          <Link href={`/comunidade/novo?categoria=${t.categoria}`} className="botao botao-sangue mt-4 w-full">Criar tópico</Link>
          {t.categoria === 'duvida' && <p className="mt-4 flex gap-2 text-xs text-apagado"><Check className="size-4 shrink-0 text-vivo" />Em Dúvida, quem perguntou marca a melhor resposta. Ela sobe para o topo.</p>}
        </div>
      </aside>
    </div>
  )
}
