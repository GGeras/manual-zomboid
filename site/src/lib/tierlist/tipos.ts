import type { Perfil } from '../comunidade/tipos'

export type Tier = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D'
/** valor de cada tier na média (S+ = 6 ... D = 1) e a cor de HUD de cada linha */
export const TIERS: { id: Tier; valor: number; cor: string; frase: string }[] = [
  { id: 'S+', valor: 6, cor: '#ff3d55', frase: 'leva pro túmulo' },
  { id: 'S', valor: 5, cor: '#ff7a3d', frase: 'sempre comigo' },
  { id: 'A', valor: 4, cor: '#ffb020', frase: 'muito bom' },
  { id: 'B', valor: 3, cor: '#8fe04a', frase: 'serve' },
  { id: 'C', valor: 2, cor: '#6fb7ff', frase: 'só se não tiver outro' },
  { id: 'D', valor: 1, cor: '#8f8875', frase: 'deixa no chão' },
]
export const VALOR: Record<Tier, number> = Object.fromEntries(TIERS.map((t) => [t.id, t.valor])) as Record<Tier, number>
export const ehTier = (t: unknown): t is Tier => TIERS.some((x) => x.id === t)

export type Visibilidade = 'perguntar' | 'anonimo' | 'visivel'

export interface ItemTier { id: string; nome: string; icone: string | null }
export interface Tierlist {
  slug: string
  titulo: string
  descricao: string
  tipo: 'oficial' | 'sugestao'
  autor: Perfil | null
  itens: ItemTier[]
  apoios: number
  comentarios: number
  votos: number
  criadoEm: string
}
/** um voto. usuario = null quando o voto é anônimo (ou quando quem lê não está logado). */
export interface VotoTier { item: string; tier: Tier; usuario: string | null; criadoEm: string }
export interface ComentarioTier { id: string; tierlist: string; pai: string | null; autor: Perfil; corpo: string; apoios: number; criadoEm: string }
