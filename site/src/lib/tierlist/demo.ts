// Votos e conversas de EXEMPLO das tierlists (modo prévia, enquanto o projeto Supabase da Comunidade não existe).
// Só opinião de jogador, nenhum dado do jogo (Regra nº 1). As sugestões usam só nomes de info-validada/nomes-ptbr.md.
import { PERFIS } from '../comunidade/demo'
import { OFICIAIS } from './oficiais'
import { TIERS, type ComentarioTier, type Tier, type Tierlist, type VotoTier } from './tipos'

const ITEM = (id: string, nome: string) => ({ id, nome, icone: null })
export const SUGESTOES_DEMO: Tierlist[] = [
  { slug: 'habilidade-para-upar-primeiro', titulo: 'Habilidade pra upar primeiro', descricao: 'Começo de run: em qual você gasta o tempo antes?', tipo: 'sugestao', autor: PERFIS.dona_marta,
    itens: [ITEM('carpintaria', 'Carpintaria'), ITEM('culinaria', 'Culinária'), ITEM('coleta', 'Coleta'), ITEM('machados', 'Machados'), ITEM('laminas-longas', 'Lâminas Longas'), ITEM('pontaria', 'Pontaria'), ITEM('manutencao', 'Manutenção')],
    apoios: 14, comentarios: 0, votos: 0, criadoEm: '2026-11-23T18:00:00Z' },
  { slug: 'remedio-que-salva-a-run', titulo: 'Remédio que salva a run', descricao: 'Achou um armário de remédios. Qual você pega primeiro?', tipo: 'sugestao', autor: PERFIS.pedro_sem_sono,
    itens: [ITEM('calmantes', 'Calmantes'), ITEM('antidepressivos', 'Antidepressivos'), ITEM('comprimidos-soniferos', 'Comprimidos Soníferos'), ITEM('pilulas-de-cafeina', 'Pílulas de Cafeína'), ITEM('analgesicos', 'Analgésicos')],
    apoios: 6, comentarios: 0, votos: 0, criadoEm: '2026-11-24T21:00:00Z' },
]

// gosto "médio" da comunidade de exemplo (índice em TIERS: 0 = S+ ... 5 = D) para cada item; os votos variam em volta dele
const GOSTO: Record<string, number> = {
  'machado-de-bombeiro': 0.1, marreta: 1.4, 'martelo-de-garra': 3.2, pa: 2.6, 'marreta-pequena': 2.4, 'pa-de-corte': 2.9,
  'mochila-militar': 0.2, 'mochila-grande-de-trilha': 0.9, 'mochila-de-trilha': 2.1, 'bolsa-de-viagem': 2.6, 'mochila-pequena': 4.2,
  corajoso: 1.6, dessensibilizacao: 1.2, forte: 1.1, musculoso: 2.3, resiliente: 2.2, 'sono-leve': 3.4, madrugador: 3.6, 'leitura-dinamica': 1.9, herbalista: 3.0,
  carpintaria: 0.3, culinaria: 2.6, coleta: 2.2, machados: 1.7, 'laminas-longas': 2.8, pontaria: 2.0, manutencao: 2.4,
  calmantes: 2.4, antidepressivos: 2.6, 'comprimidos-soniferos': 3.2, 'pilulas-de-cafeina': 3.6, analgesicos: 1.5,
}
const VISIVEIS = Object.keys(PERFIS).filter((u) => u !== 'manualzomboid')

function votosDe(t: Tierlist, agora: number): VotoTier[] {
  let r = t.slug.length * 7919
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280
  const out: VotoTier[] = []
  const total = t.tipo === 'oficial' ? 34 : 9
  for (const it of t.itens) {
    const g = GOSTO[it.id] ?? 2.5
    const n = Math.round(total * (0.7 + rnd() * 0.5))
    for (let k = 0; k < n; k++) {
      const idx = Math.min(5, Math.max(0, Math.round(g + (rnd() + rnd() + rnd() - 1.5) * 1.3)))
      // os 8 perfis de exemplo votam com nome visível em parte dos itens; o resto é voto anônimo
      const usuario = k < VISIVEIS.length && rnd() < 0.7 ? VISIVEIS[k] : null
      out.push({ item: it.id, tier: TIERS[idx].id as Tier, usuario, criadoEm: new Date(agora - rnd() * 6 * 864e5).toISOString() })
    }
  }
  return out
}

const H = 3600e3
function conversas(agora: number): ComentarioTier[] {
  const c = (id: string, tierlist: string, autor: string, corpo: string, h: number, apoios = 0, pai: string | null = null): ComentarioTier =>
    ({ id, tierlist, pai, autor: PERFIS[autor], corpo, apoios, criadoEm: new Date(agora - h * H).toISOString() })
  return [
    c('tc-1', 'armas-corpo-a-corpo', 'tabua_e_prego', 'Machado de Bombeiro no S+ e não aceito discussão.', 20, 12),
    c('tc-2', 'armas-corpo-a-corpo', 'joao_dia7', 'Eu morro no dia 7 com qualquer uma, então pra mim é tudo D 😂', 18, 9, 'tc-1'),
    c('tc-3', 'armas-corpo-a-corpo', 'lanterna_fraca', 'Marreta merecia S+ também. Quem concorda dá Brabo.', 11, 7),
    c('tc-4', 'mochilas', 'bia_radio', 'Mochila Militar é o sonho de todo sobrevivente.', 30, 5),
    c('tc-5', 'mochilas', 'carol_cozinha', 'Bolsa de Viagem salvou minha primeira run inteira.', 8, 3, 'tc-4'),
    c('tc-6', 'tracos', 'pedro_sem_sono', 'Sono Leve no C? Vocês nunca jogaram com insônia kkkk', 6, 4),
    c('tc-7', 'habilidade-para-upar-primeiro', 'dona_marta', 'Sugeri essa porque toda run eu fico na dúvida. Votem!', 40, 8),
    c('tc-8', 'habilidade-para-upar-primeiro', 'zumbi_educado', 'Carpintaria primeiro, sempre. Base boa é vida.', 33, 6, 'tc-7'),
  ]
}

/** dados de exemplo calculados na hora (no Worker o relógio do escopo global é fixo) */
export function dadosDemo(agora = Date.now()) {
  const listas = [...OFICIAIS, ...SUGESTOES_DEMO]
  const votos: Record<string, VotoTier[]> = Object.fromEntries(listas.map((t) => [t.slug, votosDe(t, agora)]))
  const comentarios = conversas(agora)
  const comContagem = listas.map((t) => ({ ...t, votos: votos[t.slug].length, comentarios: comentarios.filter((c) => c.tierlist === t.slug).length }))
  return { listas: comContagem, votos, comentarios }
}
