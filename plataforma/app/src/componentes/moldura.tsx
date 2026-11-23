import type { ReactNode } from 'react'
import { NavLink } from 'react-router'
import { useAuth } from '../auth'

const MENU: { para?: string; nome: string; etapa?: string }[] = [
  { para: '/', nome: 'Painel' },
  { para: '/episodios', nome: 'Episódios' },
  { nome: 'Prévias e finais', etapa: 'C3' },
  { nome: 'Ao vivo', etapa: 'C3' },
  { nome: 'Tarefas', etapa: 'C4' },
  { nome: 'Métricas', etapa: 'C5' },
  { nome: 'Notícias PZ', etapa: 'C6' },
]

export function Marca() {
  return (
    <span className="titulo block text-[22px]">
      Manual
      <br />
      Zomboid
    </span>
  )
}

export function Moldura({ children }: { children: ReactNode }) {
  const { membro, sair } = useAuth()
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[220px_1fr]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-osso focus:px-3 focus:py-2 focus:text-noite">
        Pular para o conteúdo
      </a>
      <aside className="border-b border-borda lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-end justify-between gap-4 px-4 pt-4 lg:block lg:px-5 lg:pt-6">
          <div>
            <Marca />
            <span className="hud mt-1 block text-sangue">central</span>
          </div>
          {membro && (
            <button onClick={sair} className="text-sm text-osso-2 underline-offset-4 hover:underline lg:hidden">
              Sair
            </button>
          )}
        </div>
        <nav aria-label="Seções" className="mt-3 overflow-x-auto px-2 pb-2 lg:mt-8 lg:flex-1 lg:px-3">
          <ul className="flex gap-1 lg:flex-col">
            {MENU.map((m) => (
              <li key={m.nome} className="shrink-0">
                {m.para ? (
                  <NavLink
                    to={m.para}
                    end={m.para === '/'}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-osso text-noite' : 'text-osso hover:bg-chao'}`
                    }
                  >
                    {m.nome}
                  </NavLink>
                ) : (
                  <span className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-apagado" title={`Chega na etapa ${m.etapa}`}>
                    {m.nome}
                    <span className="hud rounded border border-borda px-1 py-px text-[10px]">{m.etapa}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {membro && (
          <div className="hidden border-t border-borda px-5 py-4 lg:block">
            <p className="text-sm font-semibold">{membro.nome}</p>
            <p className="hud text-apagado">@{membro.github}</p>
            <button onClick={sair} className="mt-2 text-sm text-osso-2 underline-offset-4 hover:underline">
              Sair
            </button>
          </div>
        )}
      </aside>
      <main id="conteudo" className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  )
}
