'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocal } from '@/lib/comunidade/local'
import dynamic from 'next/dynamic'

// carregado só quando o tópico é local (modo prévia): não pesa na página dos tópicos do servidor
const VistaTopico = dynamic(() => import('./vista-topico').then((m) => m.VistaTopico), { ssr: false })

/** Modo prévia: tópico que existe só neste navegador. */
export function TopicoLocal({ id }: { id: string }) {
  const t = useLocal((e) => e.topicos.find((x) => x.id === id) ?? null, null)
  const [pronto, setPronto] = useState(false)
  useEffect(() => setPronto(true), [])
  if (!pronto) return <div className="mx-auto h-96 max-w-3xl animate-pulse px-4 pt-10"><div className="h-full rounded-2xl bg-white/[.03]" /></div>
  if (!t) return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="titulo text-4xl">Sumiu.</p>
      <p className="mt-3 text-osso-2">Este tópico fica só neste navegador.</p>
      <Link href="/comunidade" className="botao botao-contorno mt-6">Voltar para a Comunidade</Link>
    </div>
  )
  return <VistaTopico t={t} comentarios={[]} />
}
