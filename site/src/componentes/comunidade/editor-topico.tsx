'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { comunidadeAtiva } from '@/config/publico'
import { BUILDS, CATEGORIAS } from '@/lib/comunidade/categorias'
import type { ImagemPronta } from '@/lib/comunidade/imagens'
import { ErroEspaco, mudar, novoId, USUARIO_OK, useConta, useLocal } from '@/lib/comunidade/local'
import type { Topico } from '@/lib/comunidade/tipos'
import { cx } from '@/lib/util'
import { Jogo } from '../icones'
import { CampoTexto } from './campo-texto'
import { SeletorImagens } from './seletor-imagens'

const EntrarModal = dynamic(() => import('../entrar-modal').then((m) => m.EntrarModal), { ssr: false })
const RASCUNHO = 'mz-rascunho-topico'
const MAX_TITULO = 120

export function EditorTopico({ categoriaInicial, episodioInicial, episodios }: { categoriaInicial?: string; episodioInicial?: string; episodios: { nn: string; titulo: string }[] }) {
  const router = useRouter()
  const conta = useConta()
  const jaPostou = useLocal((e) => e.topicos.length > 0, false)
  const [categoria, setCategoria] = useState(CATEGORIAS.some((c) => c.slug === categoriaInicial) ? categoriaInicial! : '')
  const [titulo, setTitulo] = useState('')
  const [corpo, setCorpo] = useState('')
  const [imagens, setImagens] = useState<ImagemPronta[]>([])
  const [build, setBuild] = useState('')
  const [dia, setDia] = useState('')
  const [episodio, setEpisodio] = useState(episodioInicial ?? '')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [entrar, setEntrar] = useState(false)
  const [usuario, setUsuario] = useState('')
  const precisaUsuario = Boolean(conta && !conta.usuario) // modo real: o nome é pedido uma vez, no 1º post
  const ponte = useRef<((a: File[]) => void) | null>(null)

  // rascunho: se a página fechar (ou o login redirecionar), o texto volta
  useEffect(() => {
    try { const r = JSON.parse(localStorage.getItem(RASCUNHO) ?? 'null'); if (r) { setTitulo(r.titulo ?? ''); setCorpo(r.corpo ?? ''); if (!categoriaInicial && r.categoria) setCategoria(r.categoria) } } catch { /* sem rascunho */ }
  }, [categoriaInicial])
  useEffect(() => { try { localStorage.setItem(RASCUNHO, JSON.stringify({ titulo, corpo, categoria })) } catch { /* cheio */ } }, [titulo, corpo, categoria])

  const faltando = !categoria ? 'Escolha uma categoria.' : titulo.trim().length < 5 ? 'Dê um título (pelo menos 5 letras).' : imagens.some((i) => !i.alt.trim()) ? 'Descreva cada imagem (texto alternativo).' : null

  async function publicar(e: React.FormEvent) {
    e.preventDefault()
    if (faltando) return setErro(faltando)
    if (!conta) return setEntrar(true)
    if (precisaUsuario && !USUARIO_OK.test(usuario)) return setErro('Escolha um nome de usuário: 3 a 20 letras minúsculas, números ou _.')
    setErro(null); setEnviando(true)
    const campos = { categoria, titulo: titulo.trim(), corpo: corpo.trim(), build: build || null, dia: dia ? Number(dia) : null, episodio: episodio || null }
    try {
      let id: string
      if (comunidadeAtiva) {
        const real = await import('@/lib/comunidade/cliente-real')
        if (precisaUsuario) { await real.definirUsuario(usuario); mudar((s) => ({ ...s, conta: s.conta && { ...s.conta, usuario } })) }
        const subidas = await Promise.all(imagens.map((i) => real.subirImagem(i.blob, i.alt.trim(), i.w, i.h)))
        id = await real.criarTopico({ ...campos, imagens: subidas })
      } else {
        id = novoId()
        const t: Topico = { id, autor: conta, ...campos, imagens: imagens.map((i) => ({ url: i.previa, alt: i.alt.trim(), w: i.w, h: i.h })), votos: 1, comentarios: 0, fixado: false, travado: false, resolvido: false, criadoEm: new Date().toISOString(), editadoEm: null }
        mudar((s) => ({ ...s, topicos: [t, ...s.topicos], votos: { ...s.votos } }))
      }
      localStorage.removeItem(RASCUNHO)
      router.push(`/comunidade/t/${id}`)
    } catch (x) {
      setEnviando(false)
      setErro(x instanceof ErroEspaco ? 'O navegador guarda pouco. Tente com menos imagens.' : (x as Error).message || 'A conexão caiu como a energia no dia 7. Tente de novo.')
    }
  }

  return (
    <form onSubmit={publicar} noValidate className="grid gap-6">
      <fieldset>
        <legend className="mb-3 text-sm font-bold">Categoria <span className="text-sangue">*</span></legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <label key={c.slug} className={cx('flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-alerta', categoria === c.slug ? 'text-noite' : 'border-white/12 text-osso-2 hover:border-white/30')}
              style={categoria === c.slug ? { background: c.cor, borderColor: c.cor } : undefined}>
              <input type="radio" name="categoria" value={c.slug} checked={categoria === c.slug} onChange={() => setCategoria(c.slug)} className="sr-only" />
              <Jogo nome={c.icone} tamanho={16} className="size-4" />{c.nome}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="titulo" className="text-sm font-bold">Título <span className="text-sangue">*</span></label>
          <span className={cx('font-mono text-xs', titulo.length > MAX_TITULO - 15 ? 'text-alerta' : 'text-apagado')}>{titulo.length}/{MAX_TITULO}</span>
        </div>
        <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value.slice(0, MAX_TITULO))} required autoComplete="off" placeholder={categoria === 'duvida' ? 'Ex.: Por que meu personagem não dorme?' : categoria === 'como-morri' ? 'Ex.: Fui pegar comida e esqueci a porta aberta' : 'Do que se trata?'} className="campo text-lg font-semibold" />
      </div>

      <div>
        <p className="mb-2 text-sm font-bold">Texto e imagens</p>
        <CampoTexto id="corpo" rotulo="Texto do tópico" valor={corpo} setValor={setCorpo} ponte={ponte} placeholder="Conte tudo. Cole o print direto aqui (Ctrl+V)." linhas={7} />
        <div className="mt-3"><SeletorImagens imagens={imagens} setImagens={setImagens} max={10} ponte={ponte} /></div>
      </div>

      <details className="group rounded-xl border border-borda bg-chao open:pb-4">
        <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-bold [&::-webkit-details-marker]:hidden">
          <span>Detalhes do Zomboid <span className="font-normal text-apagado">(opcional, vira etiqueta)</span></span>
          <span className="text-apagado transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-4 px-4 sm:grid-cols-3">
          <label className="text-sm"><span className="mb-1.5 block font-semibold text-osso-2">Build</span>
            <select value={build} onChange={(e) => setBuild(e.target.value)} className="campo !py-2.5"><option value="">—</option>{BUILDS.map((b) => <option key={b}>{b}</option>)}</select></label>
          <label className="text-sm"><span className="mb-1.5 block font-semibold text-osso-2">Dia sobrevivido</span>
            <input type="number" inputMode="numeric" min={0} max={9999} value={dia} onChange={(e) => setDia(e.target.value)} placeholder="—" className="campo !py-2.5" /></label>
          <label className="text-sm"><span className="mb-1.5 block font-semibold text-osso-2">Episódio do canal</span>
            <select value={episodio} onChange={(e) => setEpisodio(e.target.value)} className="campo !py-2.5"><option value="">—</option>{episodios.map((ep) => <option key={ep.nn} value={ep.nn}>EP {ep.nn} · {ep.titulo}</option>)}</select></label>
        </div>
      </details>

      {!jaPostou && (
        <div className="rounded-xl border border-white/[.07] bg-white/[.02] p-4 text-sm text-osso-2">
          <p className="font-bold text-osso">Seu primeiro tópico? 3 regras rápidas:</p>
          <p className="mt-1">Respeito sempre · nada de spam ou conteúdo impróprio · print de outra pessoa, só com crédito. <a href="/comunidade/regras" target="_blank" className="font-semibold text-alerta hover:underline">Ver todas</a></p>
        </div>
      )}

      {precisaUsuario && (
        <label className="block rounded-xl border border-vivo/30 bg-vivo/[.04] p-4">
          <span className="block text-sm font-bold">Seu nome na Comunidade <span className="text-sangue">*</span></span>
          <span className="mt-0.5 block text-xs text-osso-2">Só desta vez. 3 a 20 letras minúsculas, números ou _.</span>
          <input value={usuario} maxLength={20} onChange={(e) => setUsuario(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} placeholder="seu_usuario" autoComplete="off" spellCheck={false} className="campo mt-3 font-mono" />
        </label>
      )}
      {erro && <p role="alert" className="rounded-lg border border-sangue/30 bg-sangue/[.07] p-3 text-sm text-sangue">{erro}</p>}
      <div className="flex flex-wrap items-center gap-3 border-t border-white/[.07] pt-5">
        <button className="botao botao-sangue !min-h-12 !px-7 text-base" disabled={enviando}>{enviando ? 'Publicando…' : 'Publicar'}</button>
        <span className="text-sm text-apagado">{conta ? <>Postando como <strong className="text-osso-2">{conta.usuario}</strong></> : 'Você entra em 1 clique na hora de publicar.'}</span>
      </div>
      {entrar && <EntrarModal fechar={() => setEntrar(false)} motivo="Seu texto fica guardado. Entre em 1 clique para publicar." />}
    </form>
  )
}
