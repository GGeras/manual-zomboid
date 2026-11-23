'use client'
// Modo real (S4): login e escrita direto no Supabase `manual-zomboid-comunidade`, protegidos por RLS e pelos limites no banco
// (site/supabase/migrations). Carregado sob demanda: no modo prévia este arquivo nem baixa.
// ATENÇÃO: só pode ser testado quando o projeto existir (configuracao.md §8). Os testes de ponta a ponta entram na S4.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { CONFIG } from '@/config/publico'
import type { Imagem } from './tipos'

let sb: SupabaseClient | null = null
export function supabase() {
  sb ??= createClient(CONFIG.comunidade.supabaseUrl!, CONFIG.comunidade.supabaseChavePublica!, { auth: { persistSession: true, flowType: 'pkce' } })
  return sb
}

const volta = () => `${location.origin}/comunidade/entrar/callback?para=${encodeURIComponent(location.pathname + location.search)}`
export const entrarCom = (provider: 'discord' | 'google') => supabase().auth.signInWithOAuth({ provider, options: { redirectTo: volta() } })
export const entrarEmail = (email: string, captchaToken?: string) =>
  supabase().auth.signInWithOtp({ email, options: { emailRedirectTo: volta(), captchaToken, shouldCreateUser: true } })
export const sair = () => supabase().auth.signOut()

export async function definirUsuario(usuario: string) {
  const { error } = await supabase().rpc('definir_usuario', { novo: usuario })
  if (error) throw new Error(error.message.includes('duplicate') ? 'Esse nome já tem dono. Tente outro.' : error.message)
}

export interface NovoTopico { categoria: string; titulo: string; corpo: string; imagens: Imagem[]; build: string | null; dia: number | null; episodio: string | null }
export async function criarTopico(t: NovoTopico) {
  const { data, error } = await supabase().rpc('criar_topico', { dados: t })
  if (error) throw new Error(traduzir(error.message))
  return data as string
}
export async function comentar(topico: string, corpo: string, pai: string | null, imagens: Imagem[] = []) {
  const { data, error } = await supabase().rpc('comentar', { p_topico: topico, p_corpo: corpo, p_pai: pai, p_imagens: imagens })
  if (error) throw new Error(traduzir(error.message))
  return data as string
}
export async function votar(alvo: { topico?: string; comentario?: string }, ligar: boolean) {
  const { error } = await supabase().rpc('votar', { p_topico: alvo.topico ?? null, p_comentario: alvo.comentario ?? null, ligar })
  if (error) throw new Error(traduzir(error.message))
}
export async function marcarMelhor(comentario: string) {
  const { error } = await supabase().rpc('marcar_melhor', { p_comentario: comentario })
  if (error) throw new Error(traduzir(error.message))
}
export async function denunciar(alvo: { topico?: string; comentario?: string }, motivo: string) {
  const { error } = await supabase().from('denuncias').insert({ topico: alvo.topico ?? null, comentario: alvo.comentario ?? null, motivo })
  if (error) throw new Error(traduzir(error.message))
}

/** Sobe uma imagem já comprimida (WebP) para o R2 pelo Worker do site, que confere o login. */
export async function subirImagem(arquivo: Blob, alt: string, w: number, h: number): Promise<Imagem> {
  const { data } = await supabase().auth.getSession()
  const r = await fetch('/api/imagens', { method: 'POST', body: arquivo, headers: { 'content-type': 'image/webp', authorization: `Bearer ${data.session?.access_token ?? ''}` } })
  if (!r.ok) throw new Error(r.status === 413 ? 'Imagem grande demais.' : 'A conexão caiu como a energia no dia 7. Tente de novo.')
  const { url } = (await r.json()) as { url: string }
  return { url, alt, w, h }
}

// mensagens do banco (RAISE EXCEPTION) -> texto curto para a pessoa
function traduzir(m: string) {
  if (m.includes('limite_topicos')) return 'Calma, sobrevivente: você chegou no limite de tópicos por hoje.'
  if (m.includes('limite_comentarios')) return 'Muitos comentários em pouco tempo. Respira e tenta daqui a pouco.'
  if (m.includes('links_conta_nova')) return 'Contas com menos de 1 dia ainda não podem postar links.'
  if (m.includes('suspenso')) return 'Sua conta está suspensa.'
  if (m.includes('travado')) return 'Este tópico foi travado por um moderador.'
  return 'A conexão caiu como a energia no dia 7. Tente de novo.'
}

/** Sessão do Supabase -> conta na tela (o resto do site lê a conta pelo mesmo estado do modo prévia). */
export async function sincronizarConta(): Promise<import('./tipos').Perfil | null> {
  const { data } = await supabase().auth.getSession()
  const uid = data.session?.user.id
  if (!uid) return null
  const { data: p } = await supabase().from('perfis').select('usuario,nome,avatar_url,bio,papel,criado_em').eq('id', uid).maybeSingle()
  if (!p) return null
  return { usuario: p.usuario ?? '', nome: p.nome ?? '', avatar: p.avatar_url, bio: p.bio ?? '', papel: p.papel, criadoEm: p.criado_em }
}
