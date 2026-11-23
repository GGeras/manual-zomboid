'use client'
// Volta do login (Discord/Google/link por e-mail). Troca o código pela sessão e devolve a pessoa para onde estava.
import { useEffect, useState } from 'react'

export default function Callback() {
  const [erro, setErro] = useState(false)
  useEffect(() => {
    (async () => {
      const p = new URLSearchParams(location.search)
      const para = p.get('para')?.startsWith('/') ? p.get('para')! : '/comunidade'
      const codigo = p.get('code')
      if (!codigo) return location.replace(para)
      const { supabase } = await import('@/lib/comunidade/cliente-real')
      const { error } = await supabase().auth.exchangeCodeForSession(codigo)
      if (error) return setErro(true)
      location.replace(para)
    })()
  }, [])
  return <p className="px-4 py-24 text-center text-osso-2" role="status">{erro ? 'A conexão caiu como a energia no dia 7. Tente entrar de novo.' : 'Entrando…'}</p>
}
