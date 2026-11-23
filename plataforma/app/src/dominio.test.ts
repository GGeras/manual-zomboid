import { describe, expect, it } from 'vitest'
import { contarPorStatus, filaDePostagem, ordenar, proximasPostagens, rotulo } from './dominio'
import type { Episodio } from './tipos'

const ep = (slug: string, numero: number | null, status: Episodio['status'], serie: Episodio['serie'] = 'shorts'): Episodio => ({
  slug, ep: numero === null ? slug.slice(0, 8) : String(numero).padStart(2, '0'), numero, serie, tema: slug, responsavel: 'jose',
  status, build: null, fatos: [], titulo: null, youtube_id: null, arquivo: `roteiros/${slug}.md`, commit_sha: null, sincronizado_em: '',
})

describe('proximasPostagens', () => {
  it('segunda antes das 18h: hoje, quarta e sexta', () => {
    const r = proximasPostagens(new Date(2026, 10, 23, 10, 0), 3) // seg 23/11/2026
    expect(r.map((d) => [d.getDate(), d.getHours()])).toEqual([[23, 18], [25, 18], [27, 18]])
  })
  it('segunda depois das 18h: pula para quarta', () => {
    const r = proximasPostagens(new Date(2026, 10, 23, 19, 0), 2)
    expect(r.map((d) => d.getDate())).toEqual([25, 27])
  })
  it('sábado: próxima segunda', () => {
    expect(proximasPostagens(new Date(2026, 10, 28, 9, 0), 1)[0].getDate()).toBe(30)
  })
})

describe('ordenar e fila', () => {
  const eps = [ep('bases-01-quartel', null, 'final', 'bases'), ep('ep10-gerador', 10, 'final'), ep('ep09-agua', 9, 'publicado'), ep('ep07-carros', 7, 'final')]
  it('shorts pelo número, séries gravadas no fim', () => {
    expect(ordenar(eps).map((e) => e.slug)).toEqual(['ep07-carros', 'ep09-agua', 'ep10-gerador', 'bases-01-quartel'])
  })
  it('fila só com finais', () => {
    expect(filaDePostagem(eps).map((e) => e.slug)).toEqual(['ep07-carros', 'ep10-gerador', 'bases-01-quartel'])
  })
  it('contagem por status', () => {
    expect(contarPorStatus(eps)).toMatchObject({ final: 3, publicado: 1, rascunho: 0 })
  })
  it('rótulo curto da série gravada', () => {
    expect(rotulo({ ep: 'bases-01', serie: 'bases' })).toBe('B01')
  })
})
