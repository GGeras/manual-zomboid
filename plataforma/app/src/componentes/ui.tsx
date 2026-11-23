import type { ReactNode } from 'react'
import { STATUS_INFO, etapa } from '../dominio'
import type { Status } from '../tipos'

/** 5 marcas, uma por etapa (rascunho → publicado), como os níveis de um moodle. */
export function Medidor({ status, className = '' }: { status: Status; className?: string }) {
  const n = etapa(status)
  return (
    <span className={`flex gap-[3px] ${className}`} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="h-[3px] flex-1 rounded-full" style={{ background: i <= n ? STATUS_INFO[status].cor : 'var(--color-borda)' }} />
      ))}
    </span>
  )
}

export function Selo({ status }: { status: Status }) {
  return (
    <span className="hud inline-flex items-center gap-1.5 whitespace-nowrap text-osso-2">
      <span className="size-2 rounded-full" style={{ background: STATUS_INFO[status].cor }} />
      {STATUS_INFO[status].nome}
    </span>
  )
}

export function Secao({ titulo, extra, children }: { titulo: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-borda pb-2">
        <h2 className="titulo text-lg">{titulo}</h2>
        {extra && <div className="text-sm text-osso-2">{extra}</div>}
      </div>
      {children}
    </section>
  )
}

export function Vazio({ children }: { children: ReactNode }) {
  return <p className="rounded-md border border-dashed border-borda px-4 py-5 text-sm text-osso-2">{children}</p>
}

export function Carregando() {
  return <p className="hud animate-pulse text-apagado" role="status">carregando…</p>
}

export function Erro({ erro }: { erro: unknown }) {
  return (
    <p className="rounded-md border border-sangue/50 bg-sangue/10 px-4 py-3 text-sm" role="alert">
      Não deu para ler o banco: {erro instanceof Error ? erro.message : String(erro)}. Recarregue a página; se continuar, avise no Slack.
    </p>
  )
}
