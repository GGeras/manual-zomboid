export function PaginaTexto({ rotulo, titulo, destaque, children }: { rotulo: string; titulo: string; destaque?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
      <p className="hud text-sangue">{rotulo}</p>
      <h1 className="titulo mt-3 text-[clamp(2.4rem,7vw,4rem)]">{titulo}{destaque && <> <span className="text-sangue">{destaque}</span></>}</h1>
      <div className="prosa mt-8">{children}</div>
    </div>
  )
}
