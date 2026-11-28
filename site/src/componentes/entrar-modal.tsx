'use client'
import { useEffect, useRef, useState } from 'react'
import { comunidadeAtiva } from '@/config/publico'
import { criarContaTeste, USUARIO_OK } from '@/lib/comunidade/local'
import { Email, Fechar } from './icones'

/** Entrar com link por e-mail. Sem senha. No modo prévia: conta de teste só neste navegador. */
export function EntrarModal({ fechar, motivo }: { fechar: () => void; motivo?: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [email, setEmail] = useState('')
  const [usuario, setUsuario] = useState('')
  const [aviso, setAviso] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => { ref.current?.showModal() }, [])

  async function porEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!comunidadeAtiva) return setAviso('O link por e-mail chega quando a Comunidade abrir.')
    setEnviando(true)
    const { entrarEmail } = await import('@/lib/comunidade/cliente-real')
    const { error } = await entrarEmail(email)
    setEnviando(false)
    setAviso(error ? 'Não deu para mandar o link. Confira o e-mail e tente de novo.' : 'Pronto. Abra o link que chegou no seu e-mail.')
  }
  function contaTeste(e: React.FormEvent) {
    e.preventDefault()
    if (!USUARIO_OK.test(usuario)) return setAviso('Use de 3 a 20 letras minúsculas, números ou _.')
    criarContaTeste(usuario)
    fechar()
  }

  return (
    <dialog ref={ref} onClose={fechar} onClick={(e) => { if (e.target === ref.current) ref.current?.close() }} aria-labelledby="entrar-titulo"
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-borda bg-[#131315] p-0 text-osso shadow-2xl shadow-black backdrop:bg-black/70 backdrop:backdrop-blur-sm open:animate-[surgir_.25s_var(--ease-snap)]">
      <div className="relative p-6 sm:p-7">
        <button type="button" onClick={() => ref.current?.close()} className="absolute right-3 top-3 rounded-lg p-2 text-apagado hover:bg-white/5 hover:text-osso" aria-label="Fechar"><Fechar /></button>
        <p className="hud text-sangue">Comunidade</p>
        <h2 id="entrar-titulo" className="titulo mt-2 text-3xl">Entre e <span className="text-vivo">poste</span></h2>
        <p className="mt-2 text-sm text-osso-2">{motivo ?? 'Ler não precisa de conta. Para postar, votar e comentar, entre com o seu e-mail. Sem senha.'}</p>

        <form onSubmit={porEmail} className="mt-5 flex gap-2">
          <label className="sr-only" htmlFor="entrar-email">E-mail</label>
          <input id="entrar-email" type="email" required autoComplete="email" placeholder="seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="campo !py-2.5 text-sm" />
          <button className="botao botao-contorno !min-h-0 shrink-0 !px-3" aria-label="Mandar link por e-mail" disabled={enviando}><Email /></button>
        </form>

        {!comunidadeAtiva && (
          <form onSubmit={contaTeste} className="mt-5 rounded-xl border border-dashed border-alerta/40 bg-alerta/[.04] p-4">
            <p className="hud text-alerta">Conta de teste</p>
            <p className="mt-1.5 text-[.83rem] leading-snug text-osso-2">Crie uma conta para experimentar. Fica só neste navegador.</p>
            <div className="mt-3 flex gap-2">
              <label className="sr-only" htmlFor="entrar-usuario">Nome de usuário</label>
              <input id="entrar-usuario" autoComplete="off" spellCheck={false} placeholder="seu_usuario" value={usuario} maxLength={20}
                onChange={(e) => setUsuario(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="campo !py-2.5 font-mono text-sm" />
              <button className="botao botao-vivo !min-h-0 shrink-0 !px-4 text-sm">Testar</button>
            </div>
          </form>
        )}
        {aviso && <p role="status" className="mt-4 rounded-lg bg-white/[.04] p-3 text-sm text-osso-2">{aviso}</p>}
        <p className="mt-5 text-xs leading-relaxed text-apagado">Ao entrar você concorda com os <a className="underline hover:text-osso" href="/termos">termos</a>, a <a className="underline hover:text-osso" href="/privacidade">privacidade</a> e as <a className="underline hover:text-osso" href="/comunidade/regras">regras</a>.</p>
      </div>
    </dialog>
  )
}
