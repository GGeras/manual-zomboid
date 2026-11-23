'use client'
// Formulário de resposta: carregado só quando a pessoa clica em responder (economiza JS na página do tópico).
import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { comunidadeAtiva } from '@/config/publico'
import type { ImagemPronta } from '@/lib/comunidade/imagens'
import { ErroEspaco, mudar, novoId, useConta } from '@/lib/comunidade/local'
import type { Comentario } from '@/lib/comunidade/tipos'
import { CampoTexto } from './campo-texto'
import { SeletorImagens } from './seletor-imagens'

const EntrarModal = dynamic(() => import('../entrar-modal').then((m) => m.EntrarModal), { ssr: false })

export function FormResposta({ topico, pai, fechar }: { topico: string; pai: string | null; fechar: () => void }) {
  const conta = useConta()
  const [texto, setTexto] = useState('')
  const [imagens, setImagens] = useState<ImagemPronta[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [entrar, setEntrar] = useState(false)
  const ponte = useRef<((a: File[]) => void) | null>(null)
  const id = `resposta-${pai ?? 'raiz'}`

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!texto.trim() && !imagens.length) return setErro('Escreva alguma coisa.')
    if (!conta) return setEntrar(true)
    setEnviando(true); setErro(null)
    try {
      if (comunidadeAtiva) {
        const real = await import('@/lib/comunidade/cliente-real')
        const subidas = await Promise.all(imagens.map((i) => real.subirImagem(i.blob, i.alt || 'Imagem da resposta', i.w, i.h)))
        await real.comentar(topico, texto.trim(), pai, subidas)
        location.reload()
      } else {
        const c: Comentario = { id: novoId(), topico, pai, autor: conta, corpo: texto.trim(), imagens: imagens.map((i) => ({ url: i.previa, alt: i.alt || 'Imagem da resposta', w: i.w, h: i.h })), votos: 0, melhor: false, criadoEm: new Date().toISOString(), editadoEm: null }
        mudar((s) => ({ ...s, comentarios: [...s.comentarios, c], topicos: s.topicos.map((t) => (t.id === topico ? { ...t, comentarios: t.comentarios + 1 } : t)) }))
      }
      fechar()
    } catch (x) {
      setErro(x instanceof ErroEspaco ? 'No modo prévia o navegador guarda pouco. Tente sem imagem.' : (x as Error).message)
    } finally { setEnviando(false) }
  }

  return (
    <form onSubmit={enviar} className="grid gap-2.5">
      <CampoTexto id={id} autoFoco rotulo={pai ? 'Sua resposta ao comentário' : 'Sua resposta'} valor={texto} setValor={setTexto} ponte={ponte} linhas={pai ? 3 : 4} max={5000} placeholder="Ajude com o que você sabe. Pode colar print." />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SeletorImagens imagens={imagens} setImagens={setImagens} max={4} ponte={ponte} compacto />
        <div className="flex gap-2">
          <button type="button" onClick={fechar} className="botao botao-fantasma !min-h-10 text-sm">Cancelar</button>
          <button className="botao botao-sangue !min-h-10 text-sm" disabled={enviando}>{enviando ? 'Enviando…' : 'Responder'}</button>
        </div>
      </div>
      {erro && <p role="alert" className="text-sm text-sangue">{erro}</p>}
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Seu texto fica aqui. Entre em 1 clique para enviar." />}
    </form>
  )
}
