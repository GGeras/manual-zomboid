// Pacote leve dos zumbis da tela inicial: recorta de projeto/assets/pz (modelos ORIGINAIS do jogo, os mesmos dos vídeos)
// só o que a abertura 3D usa — 10 zumbis, as animações do jogo que a cena toca e o sedã do jogo — e grava public/jogo/zumbis.json.
// Texturas viram WebP (com transparência) e os números são arredondados: ~7 MB + 5 MB -> < 1 MB (gzip bem menor).
// Chamado pelo copiar-assets.mjs (antes do dev e do build). Sem os arquivos do LFS: pula e a abertura fica na imagem.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

// Mesmos modelos base de projeto/pz.js (ZUMBIS[0,1,2,3,5,9,4,13,14,6]); manter em sincronia se mudar lá.
// A ordem importa: abertura.tsx escolhe o zumbi de cada tópico pelo índice daqui (novos entram sempre no fim).
const J = (c) => ['clothingjeanstint', c], T = (c) => ['tshirt_white', c], BRACOS = ['leftarm', 'rightarm']
export const ZUMBIS = [
  { nome: 'camiseta azul', sex: 'M', skin: 'm_zedbody01_level2', layers: [J('#3b4a5e'), T('#5d7a96'), 'blackshoes'], hair: 'messy', hairColor: '#2a2a22', blood: 1 },
  { nome: 'vestido vinho', sex: 'F', skin: 'f_zedbody01_level2', layers: [['dress', '#8f3340'], 'blackshoes'], hair: 'long', hairColor: '#c9a552', blood: 1 },
  { nome: 'lenhador careca', sex: 'M', skin: 'm_zedbody04_level3', layers: [J('#2a2a2a'), 'shirt_lumberjackgreen', 'armyboots'], hair: 'baldspot', hairColor: '#7a7a6a', blood: 2 },
  { nome: 'regata e saia', sex: 'F', skin: 'f_zedbody02_level3', layers: [['skirtknees', '#4a4030'], ['clothingvest', '#c9c2b0'], 'trainers_red'], hair: 'ponytail', hairColor: '#6b3a22', blood: 2 },
  { nome: 'moletom vermelho', sex: 'M', skin: 'm_zedbody03_level1', layers: [J('#2f3f5c'), T('#b8b0a0'), 'trainers_white'], masks: BRACOS, hair: 'crewcut', hairColor: '#2a2a22', wear: [['M_hoodie', 'hoodieup_white', '#8a3b36']], pack: ['M_schoolbag', 'schoolbag_blue'], blood: 1 },
  { nome: 'jaqueta e mochila', sex: 'M', skin: 'm_zedbody04_level2', layers: [J('#3a3a3a'), T('#c4c0b6'), 'brownshoes'], masks: BRACOS, hair: 'mullet', hairColor: '#5a4630', wear: [['M_jacket', 'jacket_white', '#7a5a3a']], pack: ['M_hikingbag', 'bighikingbaggreen'], blood: 1 },
  { nome: 'escritório', sex: 'M', skin: 'm_zedbody02_level2', layers: [J('#55555c'), 'shirt_formal', 'brownshoes'], hair: 'short', hairColor: '#4a3a2a', blood: 1 },
  { nome: 'vestido curto', sex: 'F', skin: 'f_zedbody01_level2', layers: [['dresssmall', '#4f7a4a'], 'trainers_red'], hair: 'overeye', hairColor: '#d0b060', blood: 1 },
  { nome: 'xadrez azul', sex: 'M', skin: 'm_zedbody02_level2', layers: [J('#2b3b55'), 'shirt_lumberjackblue', 'brownshoes'], hair: 'messy', hairColor: '#8a8a80', blood: 2 },
  { nome: 'camiseta e jeans', sex: 'F', skin: 'f_zedbody03_level2', layers: [J('#4a6a94'), T('#c98aa0'), 'trainers_white'], hair: 'bob', hairColor: '#4a2e1a', blood: 1 },
]
// andares (4 jeitos de andar do jogo), parado, bote, golpe, queda, levantar e bater na lataria
// + pular cerca: a sequência da janela no jogo (start = apoia e sobe; end = cai do outro lado e levanta). A z_climbwin é um pulo inteiro
// por si só (repetiria a queda), então fica de fora.
const CLIPS = ['z_walk', 'z_walk2', 'z_walk3', 'z_walk4', 'z_idle', 'z_lunge', 'z_hit', 'z_death', 'z_getup', 'z_doorbang', 'z_climbwin_start', 'z_climbwin_end']
// cenário: o sedã (Chevalier Nyala) e a picape (Chevalier D6) do jogo, abandonados na rua
const CENARIO = { malhas: ['car_normal', 'car_pickup'], texturas: ['vehicle_carnormalshell', 'vehicle_pickupshell'] }
// sprites ORIGINAIS do jogo (projeto/assets/tiles, extraídos do Tiles2x.pack) que a rua da abertura usa: viram public/jogo/tiles/<nome>.webp
const n = (p, ids) => ids.map((i) => p + i)
export const TILES = [
  ...n('blends_natural_01_', [16, 21, 22, 23]), ...n('floors_exterior_street_01_', [0, 1, 2, 3, 4, 5]), ...n('floors_exterior_tilesandstone_01_', [0, 1, 2]),
  // paredes: [W, N, pilar da quina, janela W, janela N, batente de porta N] (siding 32.. e tijolo 4..)
  ...n('walls_exterior_house_01_', [32, 33, 35, 40, 41, 43, 4, 5, 7, 12, 13, 15]), 'fixtures_windows_01_16', 'fixtures_windows_01_17', 'fixtures_windows_curtains_01_26', 'fixtures_windows_curtains_01_10', 'fixtures_doors_01_5',
  'fencing_01_5', 'fencing_01_16', 'fencing_01_17',
  // (árvores e postes são 3D: horda/objetos3d.ts, com as cores tiradas dos sprites JUMBO e do poste do jogo)
  ...n('f_bushes_1_', [100, 101, 103, 105, 64, 67, 70]), ...n('e_newgrass_1_', [16, 17, 40, 41, 64]), ...n('d_generic_1_', [21, 24, 51]),
  ...n('trash_01_', [18, 24, 27, 33]), ...n('d_trash_1_', [0, 9, 13]), 'street_roadsigns_01_9',
  ...n('street_decoration_01_', [0, 8, 12, 15, 18, 26, 27, 28]), ...n('trashcontainers_01_', [0, 8, 16, 24]), ...n('camping_01_', [0, 1, 4, 24, 25]),
  ...n('blood_floor_large_0', [1, 3, 5]), ...n('blood_floor_med_0', [2, 5]), ...n('blood_floor_small_0', [3, 6]),
]

const r4 = (a) => (a ? a.map((n) => Math.round(n * 1e4) / 1e4) : [])
const r3 = (a) => (a ? a.map((n) => Math.round(n * 1e3) / 1e3) : [])
// trilha de um osso: 3 casas bastam (erro < 0,1°); osso parado o clip inteiro guarda 1 quadro só (posar() segura o último)
const trilha = (a, k) => { const v = r3(a); for (let i = k; i < v.length; i++) if (v[i] !== v[i % k]) return v; return v.slice(0, k) }

// ---- caixa 3D de cada sprite (para C.obj): a menor base (w = d, até 1 ladrilho) e altura em que o desenho INTEIRO cai dentro da
// silhueta da caixa. Caixa pequena demais corta o desenho (barraca, arbusto, pedra "pela metade"). Mesma projeção de tiles-leve.ts.
const K = Math.SQRT2 / 128
const DIRv = (() => { const v = [1, 0.82, 1], n = Math.hypot(...v); return v.map((x) => x / n) })()
const RTv = [Math.SQRT1_2, 0, -Math.SQRT1_2]
const UPv = (() => { const v = [-DIRv[0] * DIRv[1], 1 - DIRv[1] * DIRv[1], -DIRv[2] * DIRv[1]], n = Math.hypot(...v); return v.map((x) => x / n) })()
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
function casco(pts) {
  pts = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = []
  for (const p of pts) { while (lo.length >= 2 && cr(lo.at(-2), lo.at(-1), p) <= 0) lo.pop(); lo.push(p) }
  for (const p of pts.reverse()) { while (up.length >= 2 && cr(up.at(-2), up.at(-1), p) <= 0) up.pop(); up.push(p) }
  return lo.slice(0, -1).concat(up.slice(0, -1))
}
const dentro = (h, p) => h.every((a, i) => { const b = h[(i + 1) % h.length]; return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) >= -0.5 })
async function caixaDoSprite(png, [, y0, , , W, H]) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const op = []; for (let y = 0; y < info.height; y += 2) for (let x = 0; x < info.width; x += 2) if (data[(y * info.width + x) * 4 + 3] > 115) op.push([x + 0.5, y + 0.5])
  if (!op.length) return [0.9, 0.5]
  let melhor = null
  for (let w = 0.3; w <= 1.0001; w += 0.05) {
    const h0 = Math.max(0.04, ((H - 32 - y0) * K - dot([-w / 2, 0, -w / 2], UPv)) / UPv[1] + 0.03)
    for (const f of [1, 1.15, 1.3]) {
      const h = h0 * f, vs = []
      for (const x of [-w / 2, w / 2]) for (const yy of [0, h]) for (const z of [-w / 2, w / 2]) vs.push([W / 2 + dot([x, yy, z], RTv) / K, H - 32 - dot([x, yy, z], UPv) / K])
      const hl = casco(vs), fora = op.filter((p) => !dentro(hl, p)).length / op.length
      if (!melhor || fora < melhor[2] - 1e-9) melhor = [w, h, fora]
      if (fora < 0.004) return [+w.toFixed(2), +h.toFixed(3)]
    }
  }
  return [+melhor[0].toFixed(2), +melhor[1].toFixed(3)]
}

export async function gerarZumbis(raiz, saida) {
  const arq = (n) => path.join(raiz, 'projeto/assets/pz', n)
  const lfs = (p) => fs.existsSync(p) && !(fs.statSync(p).size < 200 && fs.readFileSync(p, 'utf8').startsWith('version https://git-lfs'))
  if (!lfs(arq('models.js')) || !lfs(arq('tex.js'))) return { ok: false, motivo: 'projeto/assets/pz sem os arquivos do LFS' }
  const destino = path.join(saida, 'zumbis.json')
  const PT = path.join(raiz, 'projeto/assets/tiles')
  const faltam = TILES.filter((t) => !lfs(path.join(PT, t + '.png')))
  if (faltam.length) return { ok: false, motivo: `sprites do jogo sem arquivo (git lfs pull): ${faltam.slice(0, 5).join(', ')}` }
  const origemMs = Math.max(fs.statSync(arq('models.js')).mtimeMs, fs.statSync(arq('tex.js')).mtimeMs, fs.statSync(new URL(import.meta.url)).mtimeMs, fs.statSync(path.join(PT, 'meta.js')).mtimeMs)
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
  CENARIO.texturas.forEach((t) => texturas.add(t))
  const mesh = {}
  for (const n of CENARIO.malhas) { const m = M.mesh[n]; if (!m) throw new Error(`gerar-zumbis: malha ausente ${n}`); mesh[n] = { pos: r3(m.pos), uv: r4(m.uv), idx: m.idx, nrm: m.nrm ? r3(m.nrm).map((n) => Math.round(n * 100) / 100) : undefined, ext: m.ext } }
  for (const n of malhas) {
    const m = M.mesh[n]; if (!m) throw new Error(`gerar-zumbis: malha ausente ${n}`)
    mesh[n] = { pos: r3(m.pos), uv: r4(m.uv), idx: m.idx, nrm: m.nrm ? r3(m.nrm).map((n) => Math.round(n * 100) / 100) : undefined, bones: m.bones, inv: m.inv.map(r4), si: m.si, sw: r3(m.sw) }
  }
  const clips = {}
  for (const c of CLIPS) {
    const k = M.clips[c]; if (!k) throw new Error(`gerar-zumbis: animação ausente ${c}`)
    clips[c] = { n: k.n, b: Object.fromEntries(Object.entries(k.b).map(([osso, d]) => [osso, { r: trilha(d.r, 4), t: trilha(d.t, 3) }])) }
  }
  const tex = {}
  for (const t of texturas) {
    const src = TEX[t]; if (!src) throw new Error(`gerar-zumbis: textura ausente ${t}`)
    const png = Buffer.from(src.split(',')[1], 'base64')
    const webp = await sharp(png).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toBuffer()
    tex[t] = `data:image/webp;base64,${webp.toString('base64')}`
  }
  // sprites do cenário: WebP com transparência (mesmo tamanho do sprite do jogo: a projeção depende dele) + o retângulo de cada um (meta.js)
  const META = (await import(pathToFileURL(path.join(PT, 'meta.js')).href)).default
  const PS = path.join(saida, 'tiles'); fs.mkdirSync(PS, { recursive: true })
  const tmeta = {}
  await Promise.all(TILES.map(async (t) => {
    const png = path.join(PT, t + '.png')
    tmeta[t] = [...META[t], ...(await caixaDoSprite(png, META[t]))]
    await sharp(png).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(path.join(PS, t + '.webp'))
  }))
  const skel = { M: M.skel.M.map((b) => ({ ...b, m: r4(b.m) })), F: M.skel.F.map((b) => ({ ...b, m: r4(b.m) })) }
  fs.writeFileSync(destino, JSON.stringify({ v: 3, zumbis: ZUMBIS, skel, mesh, clips, tex, tmeta }))
  return { ok: true, kb: Math.round(fs.statSync(destino).size / 1024) }
}
