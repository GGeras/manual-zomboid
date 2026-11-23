import { Link, useParams } from 'react-router'
import { Carregando, Erro, Secao, Vazio } from '../componentes/ui'
import { useEntregas, useEpisodios, useFatos, useTotalFatos } from '../dados'
import { STATUS_INFO, etapa, rotulo } from '../dominio'
import { REPO_URL } from '../config'
import { STATUS, type Episodio } from '../tipos'

function Etapas({ e }: { e: Episodio }) {
  const atual = etapa(e.status)
  return (
    <ol className="grid grid-cols-5 gap-1.5" aria-label="Etapas do episódio">
      {STATUS.map((s, i) => (
        <li key={s} aria-current={i === atual ? 'step' : undefined}>
          <span className="block h-1.5 rounded-full" style={{ background: i <= atual ? STATUS_INFO[e.status].cor : 'var(--color-borda)' }} />
          <span className={`mt-1.5 block text-xs ${i === atual ? 'font-bold text-osso' : 'text-apagado'}`}>{STATUS_INFO[s].nome}</span>
        </li>
      ))}
    </ol>
  )
}

function Fatos({ e }: { e: Episodio }) {
  const total = useTotalFatos()
  const fatos = useFatos(e.fatos)
  if (e.fatos.length === 0) return <Vazio>Este roteiro não lista fatos no cabeçalho.</Vazio>
  if (total.isLoading || fatos.isLoading) return <Carregando />
  if (fatos.error) return <Erro erro={fatos.error} />
  const porId = new Map((fatos.data ?? []).map((f) => [f.id, f]))
  const semTexto = (total.data ?? 0) === 0
  return (
    <>
      {semTexto && (
        <p className="mb-3 text-sm text-osso-2">Os textos dos fatos chegam com o sync automático do repo. Por enquanto, só os ids.</p>
      )}
      <ul className="divide-y divide-borda">
        {e.fatos.map((id) => {
          const f = porId.get(id)
          return (
            <li key={id} className="py-3">
              <span className="font-mono text-xs font-bold text-osso-2">{id}</span>
              {f ? (
                <>
                  <p className="mt-1 max-w-[72ch]">{f.texto}</p>
                  <p className="mt-1 text-xs text-apagado">{f.build} · {f.fonte}</p>
                </>
              ) : (
                !semTexto && <p className="mt-1 text-sm text-sangue">Fora de info-validada: revalide antes de reusar.</p>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

function Entregas({ slug }: { slug: string }) {
  const { data, isLoading, error } = useEntregas(slug)
  if (isLoading) return <Carregando />
  if (error) return <Erro erro={error} />
  if (!data?.length) return <Vazio>Nenhuma prévia ou final registrado ainda. Eles aparecem aqui quando o aviso sai no Slack.</Vazio>
  return (
    <ul className="divide-y divide-borda">
      {data.map((x) => (
        <li key={x.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
          <span className="font-semibold">{x.tipo === 'final' ? 'Final' : 'Prévia'} v{x.versao ?? '?'}</span>
          {x.link_video && <a className="underline underline-offset-4" href={x.link_video} target="_blank" rel="noreferrer">Assistir</a>}
          {x.link_capa && <a className="underline underline-offset-4" href={x.link_capa} target="_blank" rel="noreferrer">Capa</a>}
          <span className="text-sm text-osso-2">{x.autor} em {new Date(x.criado_em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
          {x.resumo && <p className="w-full text-sm text-osso-2">{x.resumo}</p>}
        </li>
      ))}
    </ul>
  )
}

export function Ficha() {
  const { slug = '' } = useParams()
  const { data, isLoading, error } = useEpisodios()
  if (isLoading) return <Carregando />
  if (error) return <Erro erro={error} />
  const e = data?.find((x) => x.slug === slug)
  if (!e) return <Vazio>Episódio “{slug}” não existe no repo. <Link to="/episodios" className="underline">Ver todos</Link>.</Vazio>

  return (
    <>
      <Link to="/episodios" className="text-sm text-osso-2 underline-offset-4 hover:underline">Episódios</Link>
      <header className="mt-4 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-end">
        <p className="titulo text-[96px] sm:text-[140px]" style={{ color: e.status === 'rascunho' ? 'var(--color-apagado)' : undefined }}>
          {rotulo(e)}
        </p>
        <div className="pb-2">
          <h1 className="titulo text-3xl sm:text-4xl">{e.tema}</h1>
          {e.titulo && <p className="mt-2 max-w-[60ch] text-osso-2">{e.titulo}</p>}
        </div>
      </header>

      <div className="mt-8 max-w-2xl"><Etapas e={e} /></div>
      <p className="mt-3 text-sm text-osso-2">{STATUS_INFO[e.status].nome}: {STATUS_INFO[e.status].diz}.</p>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
        <div><dt className="text-apagado">Build</dt><dd className="font-mono font-bold">{e.build ?? '—'}</dd></div>
        <div><dt className="text-apagado">Responsável</dt><dd className="font-semibold">{e.responsavel ?? '—'}</dd></div>
        <div>
          <dt className="text-apagado">Roteiro</dt>
          <dd><a className="underline underline-offset-4" href={`${REPO_URL}/blob/main/${e.arquivo}`} target="_blank" rel="noreferrer">abrir no GitHub</a></dd>
        </div>
        <div>
          <dt className="text-apagado">Lido do repo</dt>
          <dd className="font-mono">{new Date(e.sincronizado_em).toLocaleDateString('pt-BR')}{e.commit_sha && ` @${e.commit_sha.slice(0, 7)}`}</dd>
        </div>
      </dl>

      <div className="mt-10 space-y-10">
        <Secao titulo={`Fatos usados (${e.fatos.length})`}><Fatos e={e} /></Secao>
        <Secao titulo="Prévias e finais"><Entregas slug={e.slug} /></Secao>
      </div>
    </>
  )
}
