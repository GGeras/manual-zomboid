'use client'
import { useRef, useState } from 'react'
import { imagensDoColar } from '@/lib/comunidade/imagens'
import { cx } from '@/lib/util'
import { Citacao, Italico, Link as LinkIcone, Lista, Negrito } from '../icones'
import { Markdown } from '../markdown'
import type { Ponte } from './seletor-imagens'

const ACOES = [
  { rotulo: 'Negrito', icone: Negrito, antes: '**', depois: '**', vazio: 'texto' },
  { rotulo: 'Itálico', icone: Italico, antes: '*', depois: '*', vazio: 'texto' },
  { rotulo: 'Link', icone: LinkIcone, antes: '[', depois: '](https://)', vazio: 'texto do link' },
  { rotulo: 'Lista', icone: Lista, antes: '- ', depois: '', vazio: 'item', linha: true },
  { rotulo: 'Citação', icone: Citacao, antes: '> ', depois: '', vazio: 'citação', linha: true },
]

/** Texto com barra de formatação, prévia e colar print direto (Ctrl+V). */
export function CampoTexto({ id, valor, setValor, ponte, placeholder, linhas = 6, max = 10000, rotulo, autoFoco = false }: {
  id: string; valor: string; setValor: (v: string) => void; ponte?: Ponte; placeholder?: string; linhas?: number; max?: number; rotulo: string; autoFoco?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [previa, setPrevia] = useState(false)

  function aplicar(a: (typeof ACOES)[number]) {
    const el = ref.current; if (!el) return
    const { selectionStart: i, selectionEnd: f } = el
    const sel = valor.slice(i, f) || a.vazio
    const inicio = a.linha && i > 0 && valor[i - 1] !== '\n' ? '\n' : ''
    const novo = valor.slice(0, i) + inicio + a.antes + sel + a.depois + valor.slice(f)
    setValor(novo)
    requestAnimationFrame(() => { el.focus(); const p = i + inicio.length + a.antes.length; el.setSelectionRange(p, p + sel.length) })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-borda bg-[#0f0f11] focus-within:border-white/30">
      <div className="flex items-center gap-0.5 border-b border-white/[.06] px-1.5 py-1">
        <div role="tablist" aria-label={rotulo} className="mr-1 flex">
          {[['Escrever', false], ['Prévia', true]].map(([r, p]) => (
            <button key={String(r)} type="button" role="tab" aria-selected={previa === p} onClick={() => setPrevia(p as boolean)}
              className={cx('rounded-md px-2.5 py-1.5 text-xs font-bold', previa === p ? 'bg-white/[.08] text-osso' : 'text-apagado hover:text-osso')}>{r}</button>
          ))}
        </div>
        {!previa && ACOES.map((a) => (
          <button key={a.rotulo} type="button" onClick={() => aplicar(a)} title={a.rotulo} aria-label={a.rotulo} className="rounded-md p-1.5 text-apagado hover:bg-white/[.06] hover:text-osso"><a.icone className="size-4" /></button>
        ))}
        <span className={cx('ml-auto pr-2 font-mono text-[.66rem]', valor.length > max * 0.9 ? 'text-alerta' : 'text-apagado')}>{valor.length > max * 0.7 && `${valor.length}/${max}`}</span>
      </div>
      {previa ? (
        <div className="min-h-[9rem] p-4">{valor.trim() ? <Markdown texto={valor} /> : <p className="text-sm text-apagado">Nada para mostrar ainda.</p>}</div>
      ) : (
        <>
          <label htmlFor={id} className="sr-only">{rotulo}</label>
          <textarea ref={ref} id={id} value={valor} autoFocus={autoFoco} maxLength={max} rows={linhas} placeholder={placeholder}
            onChange={(e) => setValor(e.target.value)}
            onPaste={(e) => { const imgs = imagensDoColar(e); if (imgs.length && ponte?.current) { e.preventDefault(); ponte.current(imgs) } }}
            className="block w-full resize-y bg-transparent p-3.5 text-[1rem] leading-relaxed text-osso placeholder:text-[#6f6a5e] focus:outline-none" />
        </>
      )}
    </div>
  )
}
