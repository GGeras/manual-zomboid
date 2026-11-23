import { describe, expect, it } from 'vitest'
import { markdown, textoPuro, youtubeId } from '../markdown'
import { dadosDemo } from './demo'
import { altDoNome } from './imagens'
import { arvore, buscar, notaQuente, ordenar } from './quente'

const agora = Date.UTC(2026, 10, 23, 12)

describe('Em alta (nota do Reddit antigo)', () => {
  it('10x mais votos vale ~12,5 h de idade', () => {
    const t = new Date(agora).toISOString()
    expect(notaQuente(10, t) - notaQuente(1, t)).toBeCloseTo(1)
    expect(notaQuente(1, new Date(agora + 45000e3).toISOString()) - notaQuente(1, t)).toBeCloseTo(1)
  })
  it('fixado fica no topo; novos ordena por data; sem resposta filtra', () => {
    const { topicos } = dadosDemo(agora)
    expect(ordenar(topicos, 'quente', agora)[0].fixado).toBe(true)
    const novos = ordenar(topicos, 'novos', agora)
    expect(novos.every((t, i) => i === 0 || novos[i - 1].criadoEm >= t.criadoEm)).toBe(true)
    expect(ordenar(topicos, 'sem-resposta', agora).every((t) => t.comentarios === 0)).toBe(true)
  })
  it('busca ignora acento e caixa', () => {
    const { topicos } = dadosDemo(agora)
    expect(buscar(topicos, 'TABUA').length + buscar(topicos, 'mordida').length).toBeGreaterThan(0)
    expect(buscar(topicos, 'mordida infecta').map((t) => t.id)).toContain('mordida-sempre-infecta')
    expect(buscar(topicos, undefined, 'duvida').every((t) => t.categoria === 'duvida')).toBe(true)
  })
  it('comentários: 2 níveis e melhor resposta primeiro', () => {
    const { comentarios } = dadosDemo(agora)
    const a = arvore(comentarios.filter((c) => c.topico === 'mordida-sempre-infecta'))
    expect(a[0].melhor).toBe(true)
    expect(a[0].respostas.length).toBe(1)
    expect(a.every((c) => c.pai === null)).toBe(true)
  })
})

describe('Markdown seguro', () => {
  const html = (s: string) => markdown(s).map((b) => b.valor).join('')
  it('escapa HTML e scripts', () => {
    expect(html('<script>alert(1)</script>')).not.toContain('<script>')
    expect(html('<img src=x onerror=alert(1)>')).toContain('&lt;img')
  })
  it('só aceita links http(s) ou relativos', () => {
    expect(html('[x](javascript:alert(1))')).not.toContain('href')
    expect(html('[guia](/guias/sono)')).toContain('href="/guias/sono"')
    expect(html('veja https://exemplo.com.br/a?b=1&c=2')).toContain('rel="nofollow ugc noopener"')
  })
  it('negrito, itálico, listas e citação', () => {
    expect(html('**a** *b*')).toBe('<p><strong>a</strong> <em>b</em></p>')
    expect(html('- um\n- dois')).toBe('<ul><li>um</li><li>dois</li></ul>')
    expect(html('> ei')).toBe('<blockquote>ei</blockquote>')
  })
  it('YouTube vira player e Steam vira cartão', () => {
    expect(youtubeId('https://youtube.com/shorts/abcdefghijk')).toBe('abcdefghijk')
    expect(markdown('https://youtu.be/abcdefghijk')[0]).toEqual({ tipo: 'youtube', valor: 'abcdefghijk' })
    expect(markdown('https://steamcommunity.com/sharedfiles/filedetails/?id=1')[0].tipo).toBe('steam')
  })
  it('texto puro para resumo', () => expect(textoPuro('**oi** [link](/x)', 10)).toBe('oi link'))
})

describe('imagens', () => {
  it('sugere texto alternativo pelo nome do arquivo', () => {
    expect(altDoNome('Screenshot_2026-11-20 base-na-escola.png')).toBe('Base na escola')
    expect(altDoNome('IMG_1234.jpg')).toBe('')
  })
})
