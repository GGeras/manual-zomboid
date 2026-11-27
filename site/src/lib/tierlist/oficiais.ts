// As 3 tierlists oficiais do canal. Itens = nomes EXATOS de info-validada/nomes-ptbr.md (Regra nº 1); ícones = os mesmos
// já usados nos episódios (ep17, ep23, ep30). Item sem ícone conferido fica sem ícone (o quadro mostra as iniciais).
// Mantenha igual ao seed de supabase/migrations/20261125000000_tierlists.sql.
import type { ItemTier, Tierlist } from './tipos'

const i = (id: string, nome: string, icone: string | null = null): ItemTier => ({ id, nome, icone })
const base = { tipo: 'oficial' as const, autor: null, apoios: 0, comentarios: 0, votos: 0, criadoEm: '2026-11-25T12:00:00Z' }

export const OFICIAIS: Tierlist[] = [
  { ...base, slug: 'armas-corpo-a-corpo', titulo: 'Melhor arma corpo a corpo', descricao: 'Qual arma você leva quando a horda chega? Vote em cada uma.',
    itens: [i('machado-de-bombeiro', 'Machado de Bombeiro', 'Item_Axe'), i('marreta', 'Marreta', 'Item_Sledgehamer'), i('martelo-de-garra', 'Martelo de Garra', 'Item_Hammer'), i('pa', 'Pá', 'Item_Shovel'), i('marreta-pequena', 'Marreta Pequena'), i('pa-de-corte', 'Pá de Corte')] },
  { ...base, slug: 'mochilas', titulo: 'Melhor mochila', descricao: 'Espaço, peso e onde achar: qual mochila merece as suas costas?',
    itens: [i('mochila-militar', 'Mochila Militar', 'Item_AliceBag'), i('mochila-grande-de-trilha', 'Mochila Grande de Trilha', 'Item_BigHiking_Green'), i('mochila-de-trilha', 'Mochila de Trilha', 'Item_Hiking_Green'), i('bolsa-de-viagem', 'Bolsa de Viagem', 'Item_Duffelbag'), i('mochila-pequena', 'Mochila Pequena', 'Item_Backpack_Black')] },
  { ...base, slug: 'tracos', titulo: 'Traços que valem os pontos', descricao: 'Na criação de personagem, quais traços você sempre pega?',
    itens: [i('corajoso', 'Corajoso'), i('dessensibilizacao', 'Dessensibilização'), i('forte', 'Forte'), i('musculoso', 'Musculoso'), i('resiliente', 'Resiliente'), i('sono-leve', 'Sono Leve'), i('madrugador', 'Madrugador'), i('leitura-dinamica', 'Leitura Dinâmica'), i('herbalista', 'Herbalista')] },
]
