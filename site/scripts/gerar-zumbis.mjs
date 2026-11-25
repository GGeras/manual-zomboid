// Pacote leve dos zumbis da tela inicial: recorta de projeto/assets/pz (modelos ORIGINAIS do jogo, os mesmos dos vídeos)
// só o que a abertura 3D usa — 6 zumbis, 5 animações do jogo — e grava public/jogo/zumbis.json.
// Texturas viram WebP (com transparência) e os números são arredondados: ~7 MB + 5 MB -> < 1 MB (gzip bem menor).
// Chamado pelo copiar-assets.mjs (antes do dev e do build). Sem os arquivos do LFS: pula e a abertura fica na imagem.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

// Mesmos modelos base de projeto/pz.js (ZUMBIS[0,1,2,3,5,9]); manter em sincronia se mudar lá.
const J = (c) => ['clothingjeanstint', c], T = (c) => ['tshirt_white', c], BRACOS = ['leftarm', 'rightarm']
export const ZUMBIS = [
  { nome: 'camiseta azul', sex: 'M', skin: 'm_zedbody01_level2', layers: [J('#3b4a5e'), T('#5d7a96'), 'blackshoes'], hair: 'messy', hairColor: '#2a2a22', blood: 1 },
  { nome: 'vestido vinho', sex: 'F', skin: 'f_zedbody01_level2', layers: [['dress', '#8f3340'], 'blackshoes'], hair: 'long', hairColor: '#c9a552', blood: 1 },
  { nome: 'lenhador careca', sex: 'M', skin: 'm_zedbody04_level3', layers: [J('#2a2a2a'), 'shirt_lumberjackgreen', 'armyboots'], hair: 'baldspot', hairColor: '#7a7a6a', blood: 2 },
  { nome: 'regata e saia', sex: 'F', skin: 'f_zedbody02_level3', layers: [['skirtknees', '#4a4030'], ['clothingvest', '#c9c2b0'], 'trainers_red'], hair: 'ponytail', hairColor: '#6b3a22', blood: 2 },
  { nome: 'moletom vermelho', sex: 'M', skin: 'm_zedbody03_level1', layers: [J('#2f3f5c'), T('#b8b0a0'), 'trainers_white'], masks: BRACOS, hair: 'crewcut', hairColor: '#2a2a22', wear: [['M_hoodie', 'hoodieup_white', '#8a3b36']], pack: ['M_schoolbag', 'schoolbag_blue'], blood: 1 },
  { nome: 'jaqueta e mochila', sex: 'M', skin: 'm_zedbody04_level2', layers: [J('#3a3a3a'), T('#c4c0b6'), 'brownshoes'], masks: BRACOS, hair: 'mullet', hairColor: '#5a4630', wear: [['M_jacket', 'jacket_white', '#7a5a3a']], pack: ['M_hikingbag', 'bighikingbaggreen'], blood: 1 },
]
const CLIPS = ['z_walk', 'z_walk2', 'z_idle', 'z_lunge', 'z_hit']

const r4 = (a) => (a ? a.map((n) => Math.round(n * 1e4) / 1e4) : [])
const r3 = (a) => (a ? a.map((n) => Math.round(n * 1e3) / 1e3) : [])

export async function gerarZumbis(raiz, saida) {
  const arq = (n) => path.join(raiz, 'projeto/assets/pz', n)
  const lfs = (p) => fs.existsSync(p) && !(fs.statSync(p).size < 200 && fs.readFileSync(p, 'utf8').startsWith('version https://git-lfs'))
  if (!lfs(arq('models.js')) || !lfs(arq('tex.js'))) return { ok: false, motivo: 'projeto/assets/pz sem os arquivos do LFS' }
  const destino = path.join(saida, 'zumbis.json')
  const origemMs = Math.max(fs.statSync(arq('models.js')).mtimeMs, fs.statSync(arq('tex.js')).mtimeMs, fs.statSync(new URL(import.meta.url)).mtimeMs)
  if (fs.existsSync(destino) && fs.statSync(destino).mtimeMs > origemMs) return { ok: true, kb: Math.round(fs.statSync(destino).size / 1024), cache: true }

  const M = (await import(pathToFileURL(arq('models.js')).href)).default
  const TEX = (await import(pathToFileURL(arq('tex.js')).href)).default

  const malhas = new Set(), texturas = new Set(['f_hair_white'])
  for (const z of ZUMBIS) {
    malhas.add(`${z.sex}_body`)
    if (z.hair) malhas.add(`${z.sex}_hair_${z.hair}`)
    ;[z.skin, ...(z.masks ?? [])].forEach((t) => texturas.add(t))
    z.layers.forEach((l) => texturas.add(Array.isArray(l) ? l[0] : l))
    ;(z.wear ?? []).forEach(([m, t]) => { malhas.add(m); texturas.add(t) })
    if (z.pack) { malhas.add(z.pack[0]); texturas.add(z.pack[1]) }
  }
  const mesh = {}
  for (const n of malhas) {
    const m = M.mesh[n]; if (!m) throw new Error(`gerar-zumbis: malha ausente ${n}`)
    mesh[n] = { pos: r4(m.pos), uv: r4(m.uv), idx: m.idx, nrm: m.nrm ? r3(m.nrm) : undefined, bones: m.bones, inv: m.inv.map(r4), si: m.si, sw: r3(m.sw) }
  }
  const clips = {}
  for (const c of CLIPS) {
    const k = M.clips[c]; if (!k) throw new Error(`gerar-zumbis: animação ausente ${c}`)
    clips[c] = { n: k.n, b: Object.fromEntries(Object.entries(k.b).map(([osso, d]) => [osso, { r: r4(d.r), t: r4(d.t) }])) }
  }
  const tex = {}
  for (const t of texturas) {
    const src = TEX[t]; if (!src) throw new Error(`gerar-zumbis: textura ausente ${t}`)
    const png = Buffer.from(src.split(',')[1], 'base64')
    const webp = await sharp(png).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toBuffer()
    tex[t] = `data:image/webp;base64,${webp.toString('base64')}`
  }
  const skel = { M: M.skel.M.map((b) => ({ ...b, m: r4(b.m) })), F: M.skel.F.map((b) => ({ ...b, m: r4(b.m) })) }
  fs.writeFileSync(destino, JSON.stringify({ v: 1, zumbis: ZUMBIS, skel, mesh, clips, tex }))
  return { ok: true, kb: Math.round(fs.statSync(destino).size / 1024) }
}
