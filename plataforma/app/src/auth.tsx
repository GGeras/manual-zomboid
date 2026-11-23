import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { Membro } from './tipos'

type Auth = {
  carregando: boolean
  sessao: Session | null
  membro: Membro | null
  entrar: () => Promise<void>
  sair: () => Promise<void>
}

const Ctx = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null)
  const [membro, setMembro] = useState<Membro | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
      if (!data.session) setCarregando(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_ev, s) => setSessao(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // liga a conta GitHub ao membro (função `entrar` no banco); null = conta não liberada
  const uid = sessao?.user.id
  useEffect(() => {
    if (!uid) { setMembro(null); return }
    setCarregando(true)
    supabase.rpc('entrar').then(({ data, error }) => {
      setMembro(!error && data?.id ? (data as Membro) : null)
      setCarregando(false)
    })
  }, [uid])

  const valor: Auth = {
    carregando,
    sessao,
    membro,
    entrar: async () => {
      await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } })
    },
    sair: async () => { await supabase.auth.signOut() },
  }
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth fora do AuthProvider')
  return c
}
