'use client'
// Perfil: como os votos nas tierlists aparecem. Escolhida no 1º voto; muda aqui quando quiser (e pode aplicar aos votos antigos).
import { useState } from 'react'
import { comunidadeAtiva } from '@/config/publico'
import { mudar, useConta, useLocal } from '@/lib/comunidade/local'
import type { Visibilidade } from '@/lib/tierlist/tipos'
import { cx } from '@/lib/util'

const OPCOES: { v: Visibilidade; titulo: string; texto: string }[] = [
  { v: 'perguntar', titulo: 'Perguntar a cada voto', texto: 'Você escolhe na hora de votar.' },
  { v: 'anonimo', titulo: 'Sempre anônimo', texto: 'Seus votos só contam no placar.' },
  { v: 'visivel', titulo: 'Sempre com meu nome', texto: 'Quem estiver logado vê seu nome em "quem votou".' },
]

export function PreferenciaVoto({ usuario }: { usuario: string }) {
  const conta = useConta()
  const atual = useLocal((e) => e.visibilidade, 'perguntar' as Visibilidade)
  const [aplicar, setAplicar] = useState(false)
  const [ok, setOk] = useState(false)
  if (conta?.usuario !== usuario) return null
  async function escolher(v: Visibilidade) {
    mudar((e) => ({ ...e, visibilidade: v, tlVotos: aplicar && v !== 'perguntar' ? Object.fromEntries(Object.entries(e.tlVotos).map(([k, x]) => [k, { ...x, anonimo: v === 'anonimo' }])) : e.tlVotos }))
    if (comunidadeAtiva) await (await import('@/lib/comunidade/cliente-real')).definirVisibilidade(v, aplicar).catch(() => {})
    setOk(true); setTimeout(() => setOk(false), 1600)
  }
  return (
    <section id="votos" aria-labelledby="votos-titulo" className="mt-6 scroll-mt-20 rounded-2xl border border-borda bg-chao p-5">
      <h2 id="votos-titulo" className="text-lg font-extrabold">Votos nas tierlists</h2>
      <p className="mt-1 text-sm text-osso-2">Como seus votos aparecem para quem está logado.</p>
      <div role="radiogroup" aria-label="Visibilidade dos votos" className="mt-4 grid gap-2 sm:grid-cols-3">
        {OPCOES.map((o) => (
          <button key={o.v} type="button" role="radio" aria-checked={atual === o.v} onClick={() => escolher(o.v)}
            className={cx('rounded-xl border p-3 text-left transition-colors', atual === o.v ? 'border-alerta/60 bg-alerta/[.07]' : 'border-borda hover:border-white/25')}>
            <span className="block text-sm font-bold">{o.titulo}</span><span className="mt-0.5 block text-xs text-apagado">{o.texto}</span>
          </button>
        ))}
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-osso-2"><input type="checkbox" checked={aplicar} onChange={(e) => setAplicar(e.target.checked)} className="size-4 accent-[var(--color-alerta)]" />Aplicar também aos votos que já dei</label>
      <p aria-live="polite" className="mt-2 h-4 text-xs text-vivo">{ok ? 'Salvo.' : ''}</p>
    </section>
  )
}
