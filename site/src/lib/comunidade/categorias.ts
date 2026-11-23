// Categorias fixas da Comunidade (plataforma/site.md §4). Cor de HUD; ícone = item/moodle real do jogo.
export interface Categoria { slug: string; nome: string; curto: string; cor: string; icone: string; descricao: string }

export const CATEGORIAS: Categoria[] = [
  { slug: 'duvida', nome: 'Dúvida', curto: 'Dúvida', cor: '#FFB020', icone: 'itens/Item_Notebook', descricao: 'Pergunte. O autor marca a melhor resposta.' },
  { slug: 'minha-base', nome: 'Minha base', curto: 'Base', cor: '#8FE04A', icone: 'itens/Item_Hammer', descricao: 'Mostre onde você se trancou.' },
  { slug: 'como-morri', nome: 'Como morri', curto: 'Como morri', cor: '#FF3D55', icone: 'moodles/Mood_Dead', descricao: 'Histórias de quem não voltou.' },
  { slug: 'builds', nome: 'Builds e personagem', curto: 'Builds', cor: '#6FB7FF', icone: 'itens/Item_Book', descricao: 'Profissões, traços e planos de personagem.' },
  { slug: 'mods', nome: 'Mods', curto: 'Mods', cor: '#C59BFF', icone: 'itens/Item_Wrench', descricao: 'Workshop, listas e indicações.' },
  { slug: 'multiplayer', nome: 'Multiplayer (procuro grupo)', curto: 'Multiplayer', cor: '#3DD6C6', icone: 'itens/Item_Radio', descricao: 'Servidores e gente para sobreviver junto.' },
  { slug: 'mapa', nome: 'Mapa e rotas', curto: 'Mapa', cor: '#FF8A3D', icone: 'itens/Item_Map', descricao: 'Lugares, rotas e pontos de saque.' },
  { slug: 'noticias', nome: 'Notícias e patch', curto: 'Notícias', cor: '#EFE5CF', icone: 'itens/Item_Radio', descricao: 'Atualizações do jogo e o que mudou.' },
  { slug: 'off-topic', nome: 'Off-topic', curto: 'Off-topic', cor: '#A39C8A', icone: 'moodles/Mood_Bored', descricao: 'Tédio também é um moodle.' },
]
export const categoria = (slug: string) => CATEGORIAS.find((c) => c.slug === slug)

/** Builds para o campo opcional do tópico. Os nomes dos modos só entram quando estiverem em info-validada/nomes-ptbr.md. */
export const BUILDS = ['B42.22', 'B42.21', 'B42.20', 'B42 (outra)', 'B41']
export const MODOS: string[] = []
