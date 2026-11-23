// Trava da Regra nº 1 nos Guias (igual ao build dos vídeos): o build do site PARA se um guia
//  - citar um fato que não está em info-validada/ (projeto/pipeline/fatos.json),
//  - usar <Fato id="..."/> sem listar o id no cabeçalho (ou vice-versa),
//  - usar um termo proibido de info-validada/_nao-usar.md,
//  - tiver cabeçalho incompleto.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAIZ = path.resolve(SITE, '..')
const { fatos, nao_usar } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'projeto/pipeline/fatos.json'), 'utf8'))
const BUILD_OK = /^B42(\.(2\d)[\d.]*)?$/
// termos proibidos: o que vem entre aspas no começo de cada linha do _nao-usar.md (ex.: "Forrageamento")
const proibidos = Object.values(nao_usar).map((t) => t.match(/^"([^"]+)"/)?.[1]).filter(Boolean)

export function checarGuia(nome, texto) {
  const erros = []
  const { data: fm, content } = matter(texto)
  for (const campo of ['titulo', 'resumo', 'data', 'build', 'fatos']) if (fm[campo] == null || fm[campo] === '') erros.push(`${nome}: falta "${campo}" no cabeçalho`)
  if (fm.build && !BUILD_OK.test(String(fm.build))) erros.push(`${nome}: build "${fm.build}" não é B42.20+`)
  const lista = Array.isArray(fm.fatos) ? fm.fatos : []
  const usados = [...content.matchAll(/<Fato\s+id=["']([^"']+)["']/g)].map((m) => m[1])
  for (const id of new Set([...lista, ...usados])) if (!fatos[id]) erros.push(`${nome}: fato "${id}" não está em info-validada/ (Regra nº 1)`)
  for (const id of usados) if (!lista.includes(id)) erros.push(`${nome}: <Fato id="${id}"> sem o id em "fatos:" no cabeçalho`)
  for (const id of lista) if (!usados.includes(id)) erros.push(`${nome}: "${id}" no cabeçalho mas não aparece no texto`)
  const baixo = (fm.titulo + ' ' + fm.resumo + ' ' + content).toLowerCase()
  for (const t of proibidos) if (baixo.includes(t.toLowerCase())) erros.push(`${nome}: termo proibido "${t}" (info-validada/_nao-usar.md)`)
  return erros
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const pasta = path.join(SITE, 'content/guias')
  const arquivos = fs.readdirSync(pasta).filter((f) => f.endsWith('.mdx'))
  const erros = arquivos.flatMap((f) => checarGuia(f, fs.readFileSync(path.join(pasta, f), 'utf8')))
  for (const e of erros) console.log('ERRO:', e)
  console.log(`guias: ${arquivos.length} conferido(s) · ${erros.length} erro(s) · ${proibidos.length} termos proibidos na lista`)
  process.exit(erros.length ? 1 : 0)
}
