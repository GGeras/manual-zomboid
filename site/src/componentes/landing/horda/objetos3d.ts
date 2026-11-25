// Objetos 3D da rua (árvores, postes, telhados). O resto do cenário são os sprites do jogo (tiles-leve.ts); estes três viraram 3D
// para terem volume e luz de verdade (a lanterna e os postes iluminam as copas, a lua projeta sombra). Cores tiradas dos sprites
// do jogo: copas e troncos dos JUMBO (JumboTrees2x.pack), poste de lighting_outdoor_01_1, telhado dos roofs_01.
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { THREE } from './pz-leve'

/** gerador pseudoaleatório com semente (a mesma árvore sai sempre igual) */
function sorteio(seed: number) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280) }
const cor = (c: string) => new THREE.Color(c)

// ---------- árvores ----------
type Especie = 'bordo' | 'tilia' | 'betula' | 'pinheiro' | 'pinheiroVirginia' | 'seca'
const PALETA: Record<Especie, { tronco: [string, string]; folha: [string, string, string] }> = {
  bordo: { tronco: ['#3c2e24', '#6c5445'], folha: ['#2f4422', '#4f7a3a', '#7aae5c'] }, // e_redmapleJUMBO
  tilia: { tronco: ['#382f2d', '#544846'], folha: ['#3a5428', '#6f8f55', '#9fbf7f'] }, // e_americanlindenJUMBO
  betula: { tronco: ['#958f87', '#bab6a8'], folha: ['#4c5e1f', '#7c9634', '#adbd48'] }, // e_riverbirchJUMBO
  pinheiro: { tronco: ['#2a211b', '#3e3128'], folha: ['#1f2b16', '#34501f', '#55772b'] }, // e_canadianhemlockJUMBO
  pinheiroVirginia: { tronco: ['#2f2620', '#45372c'], folha: ['#2a3a24', '#47693e', '#77a065'] }, // e_virginiapineJUMBO
  seca: { tronco: ['#382f2d', '#544846'], folha: ['#000', '#000', '#000'] },
}
const matTronco = new THREE.MeshLambertMaterial({ vertexColors: true })
// folha: brilho próprio verde-escuro (não azul) para a copa continuar verde sob a lua; a cor vem dos vértices
const matFolha = new THREE.MeshLambertMaterial({ vertexColors: true, emissive: '#16220f', side: THREE.DoubleSide })

/** pinta a geometria com uma cor que varia entre a e b (ruído + altura: mais claro em cima, como a luz da lua nas copas) */
function pintar(g: THREE.BufferGeometry, cores: string[], rnd: () => number, alturaRef = 1) {
  const p = g.attributes.position as THREE.BufferAttribute, c = new Float32Array(p.count * 3), cs = cores.map(cor), tmp = new THREE.Color()
  for (let i = 0; i < p.count; i++) {
    const t = THREE.MathUtils.clamp(0.25 + (p.getY(i) / alturaRef) * 0.45 + (rnd() - 0.5) * 0.5, 0, 1)
    const k = t * (cs.length - 1), i0 = Math.floor(k), i1 = Math.min(cs.length - 1, i0 + 1)
    tmp.copy(cs[i0]).lerp(cs[i1], k - i0); c.set([tmp.r, tmp.g, tmp.b], i * 3)
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g
}
/** "embola" uma esfera: tira a perfeição (folhagem irregular). Funde os vértices antes: a superfície fica lisa (sem facetas) */
function amassar(g0: THREE.BufferGeometry, forca: number, rnd: () => number) {
  g0.deleteAttribute('normal'); g0.deleteAttribute('uv'); const g = mergeVertices(g0)
  const p = g.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3(), mapa = new Map<string, number>()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const k = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}` // vértices repetidos andam juntos (sem rasgar)
    let f = mapa.get(k); if (f == null) { f = 1 + (rnd() - 0.5) * forca; mapa.set(k, f) }
    p.setXYZ(i, v.x * f, v.y * f, v.z * f)
  }
  g.computeVertexNormals(); return g
}
function galho(de: THREE.Vector3, para: THREE.Vector3, r0: number, r1: number, cores: [string, string], rnd: () => number) {
  const d = new THREE.Vector3().subVectors(para, de), L = d.length()
  const g = new THREE.CylinderGeometry(r1, r0, L, 6, 3); g.translate(0, L / 2, 0)
  pintar(g, cores, rnd, L)
  const m = new THREE.Mesh(g, matTronco); m.position.copy(de); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize())
  m.castShadow = true; return m
}

/** Árvore 3D com a base no (0,0,0). altura ≈ a do sprite JUMBO do jogo (≈ 5,5–6). userData.copa balança com o vento. */
export function arvore3d(especie: Especie, seed = 1, escala = 1) {
  const rnd = sorteio(seed), P = PALETA[especie], g = new THREE.Group(), copa = new THREE.Group(); g.add(copa)
  const conifera = especie === 'pinheiro' || especie === 'pinheiroVirginia'
  const H = (conifera ? 5.8 : especie === 'betula' ? 5.2 : 4.6) * escala
  // tronco levemente torto + galhos
  const topo = new THREE.Vector3((rnd() - 0.5) * 0.25, H * (conifera ? 0.95 : 0.62), (rnd() - 0.5) * 0.25)
  g.add(galho(new THREE.Vector3(0, 0, 0), topo, (conifera ? 0.15 : 0.17) * escala, 0.05 * escala, P.tronco, rnd))
  if (!conifera) {
    const nG = especie === 'seca' ? 7 : 4
    for (let k = 0; k < nG; k++) {
      const a = (k / nG) * Math.PI * 2 + rnd(), y0 = H * (0.35 + rnd() * 0.3)
      const de = new THREE.Vector3(topo.x * (y0 / topo.y), y0, topo.z * (y0 / topo.y))
      const para = de.clone().add(new THREE.Vector3(Math.cos(a) * (0.8 + rnd() * 0.7) * escala, (0.7 + rnd() * 1.1) * escala, Math.sin(a) * (0.8 + rnd() * 0.7) * escala))
      g.add(galho(de, para, 0.06 * escala, 0.015 * escala, P.tronco, rnd))
      if (especie === 'seca') for (let q = 0; q < 2; q++) { // gravetos na ponta
        const b = a + (rnd() - 0.5) * 1.6, ponta = para.clone().add(new THREE.Vector3(Math.cos(b) * 0.5 * escala, (0.3 + rnd() * 0.5) * escala, Math.sin(b) * 0.5 * escala))
        g.add(galho(para, ponta, 0.018 * escala, 0.006 * escala, P.tronco, rnd))
      }
    }
  }
  if (especie === 'seca') { g.userData.copa = copa; return g }
  if (conifera) {
    // pinheiro: camadas de cone com a borda serrilhada, cada uma um pouco girada
    const camadas = 6
    for (let k = 0; k < camadas; k++) {
      const t = k / (camadas - 1), r = (1.35 - t * 1.05) * escala * (especie === 'pinheiroVirginia' ? 0.85 : 1), h = (1.5 - t * 0.5) * escala
      const cone = amassar(new THREE.ConeGeometry(r, h, 9, 2, true), 0.28, rnd)
      const p = cone.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) if (p.getY(i) < -h / 2 + 0.01) p.setY(i, p.getY(i) - rnd() * 0.25 * escala) // pontas caídas
      cone.computeVertexNormals(); pintar(cone, P.folha, rnd, h)
      const m = new THREE.Mesh(cone, matFolha); m.position.y = H * 0.22 + t * H * 0.72 + h / 2; m.rotation.y = rnd() * Math.PI; m.castShadow = true; copa.add(m)
    }
  } else {
    // folhosa: nuvem de bolas amassadas em volta do topo do tronco, mais claras em cima
    const nB = especie === 'betula' ? 7 : 9, R = (especie === 'betula' ? 1.05 : 1.35) * escala
    for (let k = 0; k < nB; k++) {
      const a = rnd() * Math.PI * 2, d = rnd() * R * 0.75, y = topo.y + (rnd() * 1.6 - 0.2) * escala
      const r = (0.55 + rnd() * 0.5) * escala * (y > topo.y + 0.9 * escala ? 0.8 : 1)
      const bola = amassar(new THREE.IcosahedronGeometry(r, 3), 0.12, rnd); pintar(bola, P.folha, rnd, r)
      const m = new THREE.Mesh(bola, matFolha); m.position.set(topo.x + Math.cos(a) * d, y, topo.z + Math.sin(a) * d); m.castShadow = true; copa.add(m)
      // tufos de folha na superfície: quebram a silhueta redonda (copa de folhas, não bola lisa)
      for (let q = 0; q < 12; q++) {
        const dir = new THREE.Vector3(rnd() - 0.5, rnd() * 0.9 - 0.2, rnd() - 0.5).normalize(), rt = (0.16 + rnd() * 0.16) * escala
        const tufo = amassar(new THREE.IcosahedronGeometry(rt, 1), 0.35, rnd); pintar(tufo, P.folha, rnd, rt)
        const mt = new THREE.Mesh(tufo, matFolha); mt.position.copy(m.position).addScaledVector(dir, r * 0.92); mt.castShadow = false; copa.add(mt)
      }
    }
  }
  g.userData.copa = copa; g.userData.fase = rnd() * 10
  return g
}
/** vento: a copa balança pouco (chuva fina, sem tempestade) */
export function balancar(arvores: THREE.Group[], t: number) {
  for (const a of arvores) { const c = a.userData.copa as THREE.Group | undefined; if (!c) continue; const f = a.userData.fase ?? 0; c.rotation.z = Math.sin(t * 0.9 + f) * 0.018; c.rotation.x = Math.sin(t * 0.7 + f * 1.3) * 0.012 }
}

// ---------- poste de rua (lighting_outdoor_01_1 do jogo: poste preto, globo branco no topo) ----------
export const ALTURA_GLOBO = 2.66 // mesma altura do globo medida no sprite do jogo
export function poste3d() {
  const g = new THREE.Group(), ferro = new THREE.MeshLambertMaterial({ color: '#1f2124' })
  const peca = (geo: THREE.BufferGeometry, y: number) => { const m = new THREE.Mesh(geo, ferro); m.position.y = y; m.castShadow = true; g.add(m); return m }
  peca(new THREE.CylinderGeometry(0.11, 0.15, 0.32, 12), 0.16) // base
  peca(new THREE.CylinderGeometry(0.075, 0.1, 0.12, 12), 0.38) // anel
  peca(new THREE.CylinderGeometry(0.04, 0.055, 2.05, 10), 1.43) // haste
  peca(new THREE.CylinderGeometry(0.07, 0.05, 0.1, 10), 2.47) // colar sob o globo
  const globo = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 14), new THREE.MeshBasicMaterial({ color: '#fff1d2' })); globo.position.y = ALTURA_GLOBO; g.add(globo)
  peca(new THREE.ConeGeometry(0.06, 0.08, 10), ALTURA_GLOBO + 0.17) // tampinha
  g.userData.globo = globo
  return g
}

// ---------- telhado de 4 águas (o jogo mostra o telhado por fora; nunca o "dentro" da casa) ----------
function texturaTelha() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')!, rnd = sorteio(7)
  x.fillStyle = '#272d32'; x.fillRect(0, 0, 256, 256)
  const linhas = 8, alt = 256 / linhas
  for (let l = 0; l < linhas; l++) {
    const desloc = l % 2 ? alt * 0.75 : 0
    for (let k = -1; k < 6; k++) {
      const v = 0.82 + rnd() * 0.32, musgo = rnd() < 0.08
      x.fillStyle = musgo ? `rgb(${44 * v | 0},${58 * v | 0},${42 * v | 0})` : `rgb(${48 * v | 0},${55 * v | 0},${61 * v | 0})`
      x.fillRect(k * alt * 1.5 + desloc + 1, l * alt + 1, alt * 1.5 - 2, alt - 2)
      x.fillStyle = 'rgba(255,255,255,.05)'; x.fillRect(k * alt * 1.5 + desloc + 1, l * alt + alt - 5, alt * 1.5 - 2, 3) // borda de baixo de cada telha pega luz
    }
    x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect(0, l * alt, 256, 2)
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t
}
let _telha: THREE.Texture | null = null
/** Telhado de 4 águas sobre o retângulo (x0..x1, z0..z1) a partir da altura y0, com beiral, acabamento branco e chaminé opcional. */
export function telhado(x0: number, z0: number, x1: number, z1: number, y0: number, o: { beiral?: number; altura?: number; chamine?: [number, number] } = {}) {
  const b = o.beiral ?? 0.3, ax = x0 - b, bx = x1 + b, az = z0 - b, bz = z1 + b, W = bx - ax, D = bz - az, H = o.altura ?? Math.min(W, D) * 0.32
  const g = new THREE.Group(), tex = (_telha ??= texturaTelha())
  const lx = W >= D // cumeeira ao longo do lado maior
  const m = Math.min(W, D) / 2
  const r0 = lx ? new THREE.Vector3(ax + m, y0 + H, (az + bz) / 2) : new THREE.Vector3((ax + bx) / 2, y0 + H, az + m)
  const r1 = lx ? new THREE.Vector3(bx - m, y0 + H, (az + bz) / 2) : new THREE.Vector3((ax + bx) / 2, y0 + H, bz - m)
  const c = [new THREE.Vector3(ax, y0, az), new THREE.Vector3(bx, y0, az), new THREE.Vector3(bx, y0, bz), new THREE.Vector3(ax, y0, bz)]
  // 4 águas: cada face com UV "u ao longo do beiral, v subindo a água" (as fileiras de telha ficam paralelas ao beiral)
  const faces: THREE.Vector3[][] = lx
    ? [[c[3], c[2], r1, r0], [c[1], c[0], r0, r1], [c[0], c[3], r0], [c[2], c[1], r1]]
    : [[c[0], c[3], r1, r0], [c[2], c[1], r0, r1], [c[1], c[0], r0], [c[3], c[2], r1]]
  const pos: number[] = [], uv: number[] = []
  for (const f of faces) {
    const e = new THREE.Vector3().subVectors(f[1], f[0]), comp = e.length(); e.normalize()
    const sobe = new THREE.Vector3().subVectors(f[2], f[0]).addScaledVector(e, -new THREE.Vector3().subVectors(f[2], f[0]).dot(e))
    const alt = sobe.length(); sobe.normalize()
    const tri = f.length === 4 ? [0, 1, 2, 0, 2, 3] : [0, 1, 2]
    for (const k of tri) { const p = f[k], d = new THREE.Vector3().subVectors(p, f[0]); pos.push(p.x, p.y, p.z); uv.push(d.dot(e) * 0.9, d.dot(sobe) * 1.2) }
    void comp; void alt
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.computeVertexNormals()
  const teto = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide })); teto.castShadow = true; teto.receiveShadow = true; g.add(teto)
  // acabamento branco do beiral (o jogo tem a faixa clara na borda do telhado)
  const faixa = new THREE.MeshLambertMaterial({ color: '#b9b4a8' })
  for (let k = 0; k < 4; k++) {
    const p = c[k], q = c[(k + 1) % 4], L = p.distanceTo(q), m2 = new THREE.Mesh(new THREE.BoxGeometry(L + 0.06, 0.13, 0.06), faixa)
    m2.position.copy(p).add(q).multiplyScalar(0.5).setY(y0 - 0.04); m2.rotation.y = -Math.atan2(q.z - p.z, q.x - p.x); g.add(m2)
  }
  // fundo do beiral (sem ele, de baixo dava para ver o "dentro")
  const forro = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshLambertMaterial({ color: '#1b1d20', side: THREE.DoubleSide })); forro.rotation.x = -Math.PI / 2; forro.position.set((ax + bx) / 2, y0 - 0.02, (az + bz) / 2); g.add(forro)
  if (o.chamine) {
    const [cx, cz] = o.chamine, tijolo = new THREE.MeshLambertMaterial({ color: '#6e3a2c' })
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.55, H + 0.9, 0.55), tijolo); ch.position.set(cx, y0 + (H + 0.9) / 2, cz); ch.castShadow = true; g.add(ch)
    const topo = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.1, 0.66), new THREE.MeshLambertMaterial({ color: '#3a3b3d' })); topo.position.set(cx, y0 + H + 0.95, cz); g.add(topo)
  }
  return g
}
