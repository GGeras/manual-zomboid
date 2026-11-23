import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono/700.css'
import './estilo.css'
import { AuthProvider, useAuth } from './auth'
import { useAoVivo } from './dados'
import { Moldura } from './componentes/moldura'
import { Carregando, Vazio } from './componentes/ui'
import { Entrar, SemAcesso } from './paginas/entrar'
import { Painel } from './paginas/painel'
import { Episodios } from './paginas/episodios'
import { Ficha } from './paginas/ficha'

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: true } } })

function AreaDoMembro() {
  useAoVivo()
  return (
    <Moldura>
      <Routes>
        <Route path="/" element={<Painel />} />
        <Route path="/episodios" element={<Episodios />} />
        <Route path="/episodios/:slug" element={<Ficha />} />
        <Route path="*" element={<Vazio>Página não encontrada. <Link to="/" className="underline">Voltar ao painel</Link>.</Vazio>} />
      </Routes>
    </Moldura>
  )
}

function App() {
  const { carregando, sessao, membro } = useAuth()
  if (carregando) return <div className="grid min-h-dvh place-items-center"><Carregando /></div>
  if (!sessao) return <Entrar />
  if (!membro) return <SemAcesso />
  return <AreaDoMembro />
}

createRoot(document.getElementById('raiz')!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
