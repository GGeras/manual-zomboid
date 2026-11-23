import { Link } from 'react-router'
import { STATUS_INFO, rotulo } from '../dominio'
import type { Episodio } from '../tipos'
import { Medidor } from './ui'

/** A fita: um Short em pé (9:16) por episódio, na ordem. Mostra o canal inteiro de uma vez. */
export function Fita({ eps }: { eps: Episodio[] }) {
  return (
    <ol className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(70px,1fr))] sm:overflow-visible sm:px-0 sm:pb-0">
      {eps.map((e) => {
        const noAr = e.status === 'publicado'
        return (
          <li key={e.slug} className="w-[68px] shrink-0 snap-start sm:w-auto">
            <Link
              to={`/episodios/${e.slug}`}
              title={`${e.tema} — ${STATUS_INFO[e.status].nome}: ${STATUS_INFO[e.status].diz}`}
              className={`group relative flex aspect-[9/16] flex-col justify-between overflow-hidden rounded-[5px] border p-1.5 transition-colors ${
                noAr ? 'border-osso bg-osso text-noite' : 'border-borda bg-chao hover:border-osso-2'
              }`}
            >
              <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: STATUS_INFO[e.status].cor }} />
              <span className={`titulo mt-1 text-[26px] ${e.status === 'rascunho' ? 'text-apagado' : ''}`}>{rotulo(e)}</span>
              <span className="flex flex-col gap-1.5">
                <span className={`line-clamp-3 text-[10px] font-semibold leading-tight [overflow-wrap:anywhere] hyphens-auto ${noAr ? 'text-noite/80' : 'text-osso-2'}`}>{e.tema}</span>
                {!noAr && <Medidor status={e.status} />}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
