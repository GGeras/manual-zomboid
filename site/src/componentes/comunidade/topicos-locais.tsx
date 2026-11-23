'use client'
// Modo prévia: os tópicos que VOCÊ criou neste navegador aparecem no topo do feed.
import { useLocal } from '@/lib/comunidade/local'
import { ordenar } from '@/lib/comunidade/quente'
import type { Ordem, Topico } from '@/lib/comunidade/tipos'
import { CartaoTopico } from './cartao-topico'

const VAZIA: Topico[] = []
export function TopicosLocais({ categoria, ordem }: { categoria?: string; ordem: Ordem }) {
  const meus = useLocal((e) => e.topicos, VAZIA)
  const lista = ordenar(meus.filter((t) => !categoria || t.categoria === categoria), ordem === 'sem-resposta' ? 'sem-resposta' : 'novos')
  return <>{lista.map((t) => <CartaoTopico key={t.id} t={t} />)}</>
}
