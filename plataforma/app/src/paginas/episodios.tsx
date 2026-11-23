import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Carregando, Erro, Selo, Vazio } from '../componentes/ui'
import { useEpisodios } from '../dados'
import { STATUS_INFO, contarPorStatus, ordenar, rotulo } from '../dominio'
import { STATUS, type Status } from '../tipos'

const sem = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function Episodios() {
  const { data, isLoading, error } = useEpisodios()
  const [filtro, setFiltro] = useState<Status | null>(null)
  const [busca, setBusca] = useState('')
  const eps = useMemo(() => ordenar(data ?? []), [data])
  const n = contarPorStatus(eps)
  const lista = eps.filter((e) => (!filtro || e.status === filtro) && (!busca || sem(`${e.ep} ${e.tema} ${e.titulo ?? ''}`).includes(sem(busca))))

  if (isLoading) return <Carregando />
  if (error) return <Erro erro={error} />
  const botao = (ativo: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm font-semibold ${ativo ? 'border-osso bg-osso text-noite' : 'border-borda hover:border-osso-2'}`

  return (
    <>
      <h1 className="titulo mb-6 text-5xl sm:text-6xl">Episódios</h1>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por status">
          <button className={botao(!filtro)} aria-pressed={!filtro} onClick={() => setFiltro(null)}>
            Todos <span className="font-mono">{eps.length}</span>
          </button>
          {STATUS.map((s) => (
            <button key={s} className={botao(filtro === s)} aria-pressed={filtro === s} onClick={() => setFiltro(filtro === s ? null : s)}>
              {STATUS_INFO[s].nome} <span className="font-mono">{n[s]}</span>
            </button>
          ))}
        </div>
        <label className="block lg:w-72">
          <span className="sr-only">Buscar por número, tema ou título</span>
          <input
            type="search"
            value={busca}
            onChange={(ev) => setBusca(ev.target.value)}
            placeholder="Buscar número, tema ou título"
            className="w-full rounded-md border border-borda bg-chao px-3 py-2 text-sm placeholder:text-apagado focus:border-osso-2 focus:outline-none"
          />
        </label>
      </div>

      {lista.length === 0 ? (
        <Vazio>Nenhum episódio com esse filtro. Limpe a busca ou escolha outro status.</Vazio>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-borda text-osso-2">
              <tr>
                <th className="py-2 pr-3 font-semibold">Ep.</th>
                <th className="py-2 pr-3 font-semibold">Tema</th>
                <th className="py-2 pr-3 font-semibold">Status</th>
                <th className="hidden py-2 pr-3 font-semibold sm:table-cell">Build</th>
                <th className="hidden py-2 pr-3 text-right font-semibold sm:table-cell">Fatos</th>
                <th className="hidden py-2 font-semibold md:table-cell">Responsável</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borda">
              {lista.map((e) => (
                <tr key={e.slug} className="hover:bg-chao">
                  <td className="py-2.5 pr-3 font-mono font-bold">{rotulo(e)}</td>
                  <td className="py-2.5 pr-3">
                    <Link to={`/episodios/${e.slug}`} className="font-semibold underline-offset-4 hover:underline">{e.tema}</Link>
                    {e.titulo && <span className="mt-0.5 block max-w-[60ch] truncate text-xs text-osso-2">{e.titulo}</span>}
                  </td>
                  <td className="py-2.5 pr-3"><Selo status={e.status} /></td>
                  <td className="hidden py-2.5 pr-3 font-mono text-osso-2 sm:table-cell">{e.build ?? '—'}</td>
                  <td className="hidden py-2.5 pr-3 text-right font-mono text-osso-2 sm:table-cell">{e.fatos.length}</td>
                  <td className="hidden py-2.5 text-osso-2 md:table-cell">{e.responsavel ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
