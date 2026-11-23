import { modoPrevia } from '@/lib/comunidade/dados'

export default function ComunidadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-[#0e0e10]">
      {modoPrevia && (
        <div role="note" className="border-b border-alerta/20 bg-alerta/[.06]">
          <p className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-[.8rem] text-osso-2 sm:px-6">
            <span className="hud text-[.66rem] text-alerta">Modo prévia</span>
            <span>Tópicos de exemplo. Pode testar tudo: o que você postar fica só no seu navegador.</span>
          </p>
        </div>
      )}
      {children}
    </div>
  )
}
