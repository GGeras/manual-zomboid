export const STATUS = ['rascunho', 'validado', 'aprovado', 'final', 'publicado'] as const
export type Status = (typeof STATUS)[number]

export type Membro = {
  id: number
  nome: string
  github: string
  papel: 'dono' | 'socio'
}

export type Episodio = {
  slug: string
  ep: string
  numero: number | null
  serie: 'shorts' | 'bases'
  tema: string
  responsavel: string | null
  status: Status
  build: string | null
  fatos: string[]
  titulo: string | null
  youtube_id: string | null
  arquivo: string
  commit_sha: string | null
  sincronizado_em: string
}

export type Fato = {
  id: string
  texto: string
  build: string | null
  fonte: string | null
  eps: string[]
}

export type Entrega = {
  id: string
  slug: string | null
  ep: string
  tipo: 'previa' | 'final'
  versao: number | null
  link_video: string | null
  link_capa: string | null
  autor: string | null
  duracao: string | null
  resumo: string | null
  criado_em: string
}
