import { describe, expect, it } from 'vitest'
import { comVotoLocal, placar, quadro, tierDaMedia } from './placar'
import { OFICIAIS } from './oficiais'
import type { VotoTier } from './tipos'

const v = (item: string, tier: VotoTier['tier'], usuario: string | null = null): VotoTier => ({ item, tier, usuario, criadoEm: '' })
const itens = [{ id: 'a', nome: 'Alfa', icone: null }, { id: 'b', nome: 'Beta', icone: null }, { id: 'c', nome: 'Gama', icone: null }]

describe('placar das tierlists', () => {
  it('média vira o tier mais próximo', () => {
    expect(tierDaMedia(6)).toBe('S+'); expect(tierDaMedia(5.5)).toBe('S+'); expect(tierDaMedia(5.49)).toBe('S')
    expect(tierDaMedia(1.2)).toBe('D'); expect(tierDaMedia(3.5)).toBe('A')
  })
  it('conta votos por tier, separa visíveis de anônimos e deixa item sem voto fora das linhas', () => {
    const l = placar(itens, [v('a', 'S+', 'ana'), v('a', 'S'), v('a', 'S', 'bia'), v('b', 'D')])
    expect(l[0]).toMatchObject({ votos: 3, tier: 'S', anonimos: 1, visiveis: { 'S+': ['ana'], S: ['bia'] } })
    expect(l[0].porTier.S).toBe(2)
    const q = quadro(l)
    expect(q.tiers.find((t) => t.id === 'S')!.itens.map((x) => x.item.id)).toEqual(['a'])
    expect(q.semVotos.map((x) => x.item.id)).toEqual(['c'])
  })
  it('voto anônimo nunca expõe o nome', () => {
    const l = placar(itens, comVotoLocal([], { 'x::a': { tier: 'A', anonimo: true } }, 'eu', 'x'))
    expect(l[0].visiveis).toEqual({}); expect(l[0].anonimos).toBe(1)
  })
  it('o voto local da pessoa substitui o voto dela que veio do servidor (não conta duas vezes)', () => {
    const l = placar(itens, comVotoLocal([v('a', 'D', 'eu'), v('a', 'S', 'ana')], { 'x::a': { tier: 'S+', anonimo: false } }, 'eu', 'x'))
    expect(l[0].votos).toBe(2); expect(l[0].visiveis['S+']).toEqual(['eu'])
  })
  it('oficiais: ids únicos e nada de item repetido', () => {
    for (const t of OFICIAIS) expect(new Set(t.itens.map((i) => i.id)).size).toBe(t.itens.length)
  })
})
