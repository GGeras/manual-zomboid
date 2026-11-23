export type Papel = 'usuario' | 'moderador' | 'admin'
export type Ordem = 'quente' | 'novos' | 'semana' | 'sem-resposta'

export interface Perfil {
  usuario: string
  nome: string
  avatar: string | null
  bio: string
  papel: Papel
  criadoEm: string
}
export interface Imagem { url: string; alt: string; w: number; h: number }
export interface Topico {
  id: string
  autor: Perfil
  categoria: string
  titulo: string
  corpo: string
  imagens: Imagem[]
  build: string | null
  dia: number | null
  episodio: string | null
  votos: number
  comentarios: number
  fixado: boolean
  travado: boolean
  resolvido: boolean
  criadoEm: string
  editadoEm: string | null
}
export interface Comentario {
  id: string
  topico: string
  pai: string | null
  autor: Perfil
  corpo: string
  imagens: Imagem[]
  votos: number
  melhor: boolean
  criadoEm: string
  editadoEm: string | null
}
export interface Filtro { ordem?: Ordem; categoria?: string; q?: string; build?: string; autor?: string; limite?: number }
