export function PaginaTexto({ rotulo, titulo, destaque, rascunho, children }: { rotulo: string; titulo: string; destaque?: string; rascunho?: boolean; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <p className="hud text-sangue">{rotulo}</p>
      <h1 className="titulo mt-3 text-[clamp(2.4rem,7vw,4rem)]">{titulo}{destaque && <> <span className="text-sangue">{destaque}</span></>}</h1>
      {rascunho && (
        <p role="note" className="mt-6 rounded-xl border border-alerta/30 bg-alerta/[.06] p-4 text-sm text-osso-2">
          <strong className="text-alerta">Rascunho.</strong> Este texto ainda passa por revisão (incluindo jurídica: LGPD, Marco Civil e ECA Digital) antes da Comunidade abrir ao público.
        </p>
      )}
      <div className="prosa mt-8">{children}</div>
    </div>
  )
}
