import type { Comentario, Ordem, Topico } from './tipos'
import { semAcento } from '../util'

const EPOCA = Date.UTC(2026, 0, 1) / 1000
/** Nota "Em alta" (a do Reddit antigo, plataforma/site.md §6). Só voto positivo, então o sinal é sempre +. Igual à função do banco. */
export function notaQuente(votos: number, criadoEm: string): number {
  const s = new Date(criadoEm).getTime() / 1000 - EPOCA
  return Math.log10(Math.max(votos, 1)) + s / 45000
}

export function ordenar(lista: Topico[], ordem: Ordem = 'quente', agora = Date.now()): Topico[] {
  const fixos = lista.filter((t) => t.fixado && ordem === 'quente')
  let resto = lista.filter((t) => !(t.fixado && ordem === 'quente'))
  if (ordem === 'novos') resto = [...resto].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
  else if (ordem === 'semana') resto = resto.filter((t) => agora - new Date(t.criadoEm).getTime() < 7 * 864e5).sort((a, b) => b.votos - a.votos)
  else if (ordem === 'sem-resposta') resto = resto.filter((t) => t.comentarios === 0).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
  else resto = [...resto].sort((a, b) => notaQuente(b.votos, b.criadoEm) - notaQuente(a.votos, a.criadoEm))
  return [...fixos, ...resto]
}

export function buscar(lista: Topico[], q?: string, categoria?: string, build?: string): Topico[] {
  const termos = q ? semAcento(q).split(/\s+/).filter(Boolean) : []
  return lista.filter((t) => {
    if (categoria && t.categoria !== categoria) return false
    if (build && t.build !== build) return false
    if (!termos.length) return true
    const alvo = semAcento(`${t.titulo} ${t.corpo}`)
    return termos.every((x) => alvo.includes(x))
  })
}

/** Árvore de comentários com no máximo 2 níveis. A melhor resposta sobe para o topo. */
export function arvore(comentarios: Comentario[]) {
  const raiz = comentarios.filter((c) => !c.pai).sort((a, b) => Number(b.melhor) - Number(a.melhor) || b.votos - a.votos || a.criadoEm.localeCompare(b.criadoEm))
  return raiz.map((c) => ({ ...c, respostas: comentarios.filter((r) => r.pai === c.id).sort((a, b) => a.criadoEm.localeCompare(b.criadoEm)) }))
}
