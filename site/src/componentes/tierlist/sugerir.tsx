'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { comunidadeAtiva } from '@/config/publico'
import { mudar, novoId, useConta } from '@/lib/comunidade/local'
import type { Tierlist } from '@/lib/tierlist/tipos'

const EntrarModal = dynamic(() => import('../entrar-modal').then((m) => m.EntrarModal), { ssr: false })
const slugDe = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)

export function FormSugerir() {
  const conta = useConta()
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [itensTxt, setItensTxt] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [entrar, setEntrar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const itens = [...new Set(itensTxt.split('\n').map((l) => l.trim().slice(0, 40)).filter(Boolean))]

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (titulo.trim().length < 5) return setErro('Dê um título com pelo menos 5 letras.')
    if (itens.length < 2 || itens.length > 30) return setErro('A lista precisa de 2 a 30 itens (um por linha).')
    if (!conta) return setEntrar(true)
    setEnviando(true); setErro(null)
    try {
      if (comunidadeAtiva) {
        const slug = await (await import('@/lib/comunidade/cliente-real')).sugerirTierlist({ titulo: titulo.trim(), descricao: descricao.trim(), itens })
        router.push(`/comunidade/tierlists/${slug}`)
      } else {
        const slug = `local-${slugDe(titulo)}-${novoId().slice(-4)}`
        const t: Tierlist = { slug, titulo: titulo.trim(), descricao: descricao.trim(), tipo: 'sugestao', autor: conta, itens: itens.map((nome, i) => ({ id: `i${i + 1}`, nome, icone: null })), apoios: 0, comentarios: 0, votos: 0, criadoEm: new Date().toISOString() }
        mudar((s) => ({ ...s, tlSugestoes: [t, ...s.tlSugestoes], votos: { ...s.votos, [`tl:${slug}`]: true } }))
        router.push(`/comunidade/tierlists/${slug}`)
      }
    } catch (x) { setErro((x as Error).message) } finally { setEnviando(false) }
  }

  return (
    <form onSubmit={enviar} className="mt-8 grid gap-5">
      <div>
        <label htmlFor="tl-titulo" className="block text-sm font-bold">Título</label>
        <input id="tl-titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={80} placeholder="Ex.: Melhor cidade pra começar" className="campo mt-1.5" />
      </div>
      <div>
        <label htmlFor="tl-desc" className="block text-sm font-bold">Pergunta para quem vai votar <span className="font-normal text-apagado">(opcional)</span></label>
        <input id="tl-desc" value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={400} placeholder="Ex.: Onde você nasce e sobrevive mais tempo?" className="campo mt-1.5" />
      </div>
      <div>
        <label htmlFor="tl-itens" className="block text-sm font-bold">Itens <span className="font-normal text-apagado">(um por linha, 2 a 30)</span></label>
        <textarea id="tl-itens" value={itensTxt} onChange={(e) => setItensTxt(e.target.value)} rows={8} placeholder={'Item 1\nItem 2\nItem 3'} className="campo mt-1.5 font-mono text-sm" />
        <p className="mt-1.5 text-xs text-apagado">{itens.length} {itens.length === 1 ? 'item' : 'itens'} · Use o nome igual ao do jogo em português.</p>
      </div>
      {erro && <p role="alert" className="text-sm text-sangue">{erro}</p>}
      <div className="flex justify-end"><button className="botao botao-sangue" disabled={enviando}>{enviando ? 'Enviando…' : 'Publicar sugestão'}</button></div>
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Sua lista fica aqui. Entre em 1 clique para publicar." />}
    </form>
  )
}
