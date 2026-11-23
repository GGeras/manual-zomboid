'use client'
// Estado do navegador da Comunidade.
//  - Modo prévia: conta de teste, votos, tópicos e comentários ficam SÓ neste navegador (localStorage). Nada vai para servidor.
//  - Modo real: a conta vem do Supabase (cliente-real.ts); aqui fica só o cache de votos para a tela responder na hora.
import { useSyncExternalStore } from 'react'
import type { Comentario, Perfil, Topico } from './tipos'

interface Estado { conta: Perfil | null; votos: Record<string, true>; topicos: Topico[]; comentarios: Comentario[]; melhores: Record<string, string>; denuncias: Record<string, true> }
const CHAVE = 'mz-comunidade-v1'
const VAZIO: Estado = { conta: null, votos: {}, topicos: [], comentarios: [], melhores: {}, denuncias: {} }

let estado: Estado = VAZIO
let carregado = false
const ouvintes = new Set<() => void>()

function carregar() {
  if (carregado || typeof window === 'undefined') return
  carregado = true
  try { estado = { ...VAZIO, ...JSON.parse(localStorage.getItem(CHAVE) ?? '{}') } } catch { estado = VAZIO }
  window.addEventListener('storage', (e) => { if (e.key === CHAVE) { carregado = false; carregar(); ouvintes.forEach((f) => f()) } })
}

export class ErroEspaco extends Error {}
export function mudar(f: (e: Estado) => Estado) {
  carregar()
  const novo = f(estado)
  try { localStorage.setItem(CHAVE, JSON.stringify(novo)) } catch { throw new ErroEspaco('Sem espaço no navegador para guardar isso (modo prévia).') }
  estado = novo
  ouvintes.forEach((o) => o())
}

const assinar = (f: () => void) => { carregar(); ouvintes.add(f); return () => { ouvintes.delete(f) } }
export function useLocal<T>(sel: (e: Estado) => T, servidor: T): T {
  return useSyncExternalStore(assinar, () => { carregar(); return sel(estado) }, () => servidor)
}

export const useConta = () => useLocal((e) => e.conta, null)

export function criarContaTeste(usuario: string): Perfil {
  const conta: Perfil = { usuario, nome: usuario, avatar: null, bio: '', papel: 'usuario', criadoEm: new Date().toISOString() }
  mudar((e) => ({ ...e, conta }))
  return conta
}
export const sairLocal = () => mudar((e) => ({ ...e, conta: null }))

export const USUARIO_OK = /^[a-z0-9_]{3,20}$/
export const novoId = () => `local-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
