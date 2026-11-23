import { describe, expect, it } from 'vitest'
import { checarGuia } from './checar-guias.mjs'

const guia = (fm, corpo) => `---\n${fm}\n---\n${corpo}`
const OK = 'titulo: "T"\nresumo: "R"\ndata: 2026-11-23\nbuild: B42.22'

describe('trava da Regra nº 1 nos Guias', () => {
  it('aceita guia só com fatos validados', () => {
    expect(checarGuia('a.mdx', guia(`${OK}\nfatos: [sono-niveis]`, '<Fato id="sono-niveis" />'))).toEqual([])
  })
  it('barra fato fora de info-validada', () => {
    expect(checarGuia('a.mdx', guia(`${OK}\nfatos: [inventado-123]`, '<Fato id="inventado-123" />')).join()).toMatch(/Regra nº 1/)
  })
  it('barra <Fato> sem o id no cabeçalho', () => {
    expect(checarGuia('a.mdx', guia(`${OK}\nfatos: []`, '<Fato id="sono-niveis" />')).join()).toMatch(/sem o id/)
  })
  it('barra termo proibido do _nao-usar.md', () => {
    expect(checarGuia('a.mdx', guia(`${OK}\nfatos: [sono-niveis]`, 'Forrageamento <Fato id="sono-niveis" />')).join()).toMatch(/proibido/)
  })
  it('barra build antigo', () => {
    expect(checarGuia('a.mdx', guia('titulo: "T"\nresumo: "R"\ndata: 2026-11-23\nbuild: B41\nfatos: [sono-niveis]', '<Fato id="sono-niveis" />')).join()).toMatch(/B42/)
  })
})
