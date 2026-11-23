import { Link } from 'react-router'
import { Fita } from '../componentes/fita'
import { Carregando, Erro, Secao, Selo } from '../componentes/ui'
import { useEpisodios } from '../dados'
import { STATUS_INFO, contarPorStatus, dataCurta, filaDePostagem, ordenar, proximasPostagens, rotulo } from '../dominio'
import { STATUS, type Episodio } from '../tipos'

const RESERVA_MINIMA = 3 // canal/calendario-postagem.md

function Legenda() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {STATUS.map((s) => <li key={s}><Selo status={s} /></li>)}
    </ul>
  )
}

function Chip({ e }: { e: Episodio }) {
  return (
    <Link to={`/episodios/${e.slug}`} className="inline-flex items-baseline gap-1.5 rounded border border-borda bg-chao px-2 py-1 text-sm hover:border-osso-2">
      <span className="font-mono font-bold">{rotulo(e)}</span>
      <span className="text-osso-2">{e.tema}</span>
    </Link>
  )
}

function Esteira({ eps }: { eps: Episodio[] }) {
  const n = contarPorStatus(eps)
  return (
    <ol className="divide-y divide-borda">
      {STATUS.map((s) => (
        <li key={s} className="grid gap-2 py-4 sm:grid-cols-[150px_1fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold" style={{ color: STATUS_INFO[s].cor }}>{n[s]}</span>
              <span className="font-semibold">{STATUS_INFO[s].nome}</span>
            </div>
            <p className="text-sm text-osso-2">{STATUS_INFO[s].diz}</p>
          </div>
          <div className="flex flex-wrap content-start gap-1.5">
            {ordenar(eps.filter((e) => e.status === s)).map((e) => <Chip key={e.slug} e={e} />)}
          </div>
        </li>
      ))}
    </ol>
  )
}

function Postagens({ eps }: { eps: Episodio[] }) {
  const fila = filaDePostagem(eps)
  const dias = proximasPostagens(new Date(), 6)
  return (
    <>
      <p className={`mb-4 text-sm ${fila.length < RESERVA_MINIMA ? 'text-alerta' : 'text-osso-2'}`}>
        {fila.length} {fila.length === 1 ? 'vídeo final pronto' : 'vídeos finais prontos'}. A regra é ter pelo menos {RESERVA_MINIMA} de reserva.
      </p>
      <ol className="space-y-2">
        {dias.map((d, i) => {
          const e = fila[i]
          return (
            <li key={d.toISOString()} className="grid grid-cols-[92px_1fr] items-baseline gap-3">
              <span className="font-mono text-sm font-bold">{dataCurta(d)}</span>
              {e ? <Chip e={e} /> : <span className="text-sm text-apagado">sem final pronto</span>}
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-xs text-apagado">Sugestão pela ordem dos episódios. Seg, qua e sex, 18h–20h.</p>
    </>
  )
}

export function Painel() {
  const { data, isLoading, error } = useEpisodios()
  if (isLoading) return <Carregando />
  if (error) return <Erro erro={error} />
  const eps = ordenar(data ?? [])
  const ultimo = eps.reduce((m, e) => (e.sincronizado_em > m ? e.sincronizado_em : m), '')
  return (
    <>
      <header className="mb-8">
        <h1 className="titulo text-5xl sm:text-6xl">Painel</h1>
        {ultimo && (
          <p className="mt-2 text-sm text-osso-2">
            Repo lido em {new Date(ultimo).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}.
          </p>
        )}
      </header>
      <div className="space-y-10">
        <Secao titulo={`${eps.length} episódios`} extra={<Legenda />}>
          <Fita eps={eps} />
        </Secao>
        <div className="space-y-10 lg:grid lg:grid-cols-[1fr_320px] lg:gap-10 lg:space-y-0">
          <Secao titulo="Esteira"><Esteira eps={eps} /></Secao>
          <Secao titulo="Próximas postagens"><Postagens eps={eps} /></Secao>
        </div>
      </div>
    </>
  )
}
