// Cenário com os SPRITES ORIGINAIS do jogo — versão leve de projeto/tiles.js (mesma matemática, mesma câmera).
// A câmera olha de (1, .82, 1) = 30° de elevação = a projeção 2:1 do Project Zomboid. Cada sprite é "pintado" numa forma 3D simples
// (chão, parede, caixa, placa) com UV = projeção de cada vértice na tela: na tela o sprite aparece igual ao jogo, e a forma 3D dá a
// profundidade certa (zumbi atrás da cerca some atrás dela).
// Diferença do pipeline: aqui é noite, então os sprites são Lambert (a lanterna e os postes iluminam o chão e as paredes). As normais
// das peças em pé apontam para a câmera: o sprite já vem sombreado pelo jogo, e assim cada face da caixa recebe a mesma luz (sem emenda).
import { THREE } from './pz-leve'

export type MetaTile = [number, number, number, number, number, number] // retângulo opaco (x0, y0, x1, y1) + largura e altura do sprite
const K = Math.SQRT2 / 128 // unidades de mundo por pixel do sprite (no plano da câmera)
export const DIR = new THREE.Vector3(1, 0.82, 1).normalize() // de onde a câmera olha (igual ao engine.js)
const RT = new THREE.Vector3(1, 0, -1).normalize() // direita da tela
const UP = new THREE.Vector3(0, 1, 0).addScaledVector(DIR, -DIR.y).normalize() // cima da tela
export const WALL_H = (192 * K) / UP.y // altura de uma parede do jogo (≈2,45)

export function criarTiles(META: Record<string, MetaTile>, base = '/jogo/tiles/') {
  const TEX: Record<string, THREE.Texture> = {}, MAT: Record<string, THREE.MeshLambertMaterial> = {}, espera: Promise<void>[] = []
  function tex(nome: string) {
    if (TEX[nome]) return TEX[nome]
    const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter
    espera.push(new Promise((res) => { const im = new Image(); im.onload = () => { t.image = im; t.needsUpdate = true; res() }; im.onerror = () => res(); im.src = base + nome + '.webp' }))
    return (TEX[nome] = t)
  }
  // luz: o sprite brilha com essa cor por trás (cortina de janela acesa: a luz do cômodo atravessa o pano)
  function mat(nome: string, o: { tint?: string; op?: number; luz?: string } = {}) {
    const k = nome + '|' + (o.tint ?? '') + '|' + (o.op ?? '') + '|' + (o.luz ?? '')
    return (MAT[k] ??= new THREE.MeshLambertMaterial({ map: tex(nome), color: o.tint ?? '#ffffff', alphaTest: o.op ? 0.02 : 0.45, side: THREE.DoubleSide, transparent: Boolean(o.op), opacity: o.op ?? 1, depthWrite: !o.op,
      ...(o.luz ? { emissive: o.luz, emissiveMap: tex(nome), emissiveIntensity: 1.5 } : {}) }))
  }
  const meta = (nome: string) => { const m = META[nome]; if (!m) throw new Error('tiles: sprite ausente: ' + nome); return m }
  // UV de cada vértice = onde ele cai no sprite. Âncora = centro do losango do piso (pixel w/2, h-32).
  function projetar(g: THREE.BufferGeometry, nome: string) {
    const [, , , , w, h] = meta(nome), p = g.attributes.position, uv = new Float32Array(p.count * 2), v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); uv[i * 2] = (w / 2 + v.dot(RT) / K) / w; uv[i * 2 + 1] = 1 - (h - 32 - v.dot(UP) / K) / h }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g
  }
  // peça em pé: normal = para a câmera (luz igual em todas as faces)
  function deFrente(g: THREE.BufferGeometry) { const n = g.attributes.normal as THREE.BufferAttribute; for (let i = 0; i < n.count; i++) n.setXYZ(i, DIR.x, DIR.y, DIR.z); return g }
  function autoH(nome: string, w: number, d: number, dx = 0, dz = 0) { const [, y0, , , , h] = meta(nome); const tras = new THREE.Vector3(dx - w / 2, 0, dz - d / 2).dot(UP); return Math.max(0.04, ((h - 32 - y0) * K - tras) / UP.y + 0.03) }
  const semente = (i: number, j: number, s: number) => Math.abs((i * 7349 + j * 1931 + s * 17) % 9973)

  /** Uma cena = um grupo. (i, j) = ladrilho; o centro do ladrilho fica em (i, j) do grupo. */
  function cena(G: THREE.Group) {
    const C = {
      G,
      /** piso: retângulo de ladrilhos (i0..i1, j0..j1); nomes = um sprite ou lista sorteada por ladrilho */
      chao(nomes: string | string[], i0: number, j0: number, i1: number, j1: number, o: { y?: number; tint?: string; seed?: number; furo?: (i: number, j: number) => boolean } = {}) {
        const lista = ([] as string[]).concat(nomes), por: Record<string, [number, number][]> = {}
        for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) { if (o.furo?.(i, j)) continue; const n = lista[semente(i, j, o.seed ?? 0) % lista.length]; (por[n] ??= []).push([i, j]) }
        for (const n in por) {
          const g = new THREE.PlaneGeometry(1.01, 1.01).rotateX(-Math.PI / 2) // UV um pouco para dentro: sem fresta entre ladrilhos
          g.setAttribute('uv', projetar(new THREE.PlaneGeometry(0.955, 0.955).rotateX(-Math.PI / 2), n).attributes.uv)
          const m = new THREE.InstancedMesh(g, mat(n, o), por[n].length), M = new THREE.Matrix4()
          por[n].forEach(([i, j], k) => m.setMatrixAt(k, M.makeTranslation(i, o.y ?? 0.012, j))); m.renderOrder = -1; m.receiveShadow = true; G.add(m)
        }
        return C
      },
      /** mancha no chão (sangue, lixo achatado): um ladrilho só, sem sortear */
      mancha(nome: string, i: number, j: number, y = 0.03, tint?: string) { return C.chao(nome, i, j, i, j, { y, tint }) },
      /** parede (ou o que fica colado nela: janela, cortina, porta, cerca) na borda N (ao longo de x) ou W (ao longo de z) do ladrilho */
      parede(lado: 'N' | 'W', nome: string, i: number, j: number, o: { off?: number; h?: number; y?: number; tint?: string; luz?: string } = {}) {
        const off = o.off ?? 0, H = o.h ?? WALL_H + 0.2
        // o desenho da parede N do jogo começa 4 px antes do ladrilho e termina 2 px antes do fim: a peça cobre essa sobra (sem fresta)
        const g = new THREE.PlaneGeometry(lado === 'N' ? 1.07 : 1.035, H); g.translate(lado === 'N' ? -0.035 : 0.0175, H / 2, 0)
        if (lado === 'N') g.translate(0, 0, -0.5 + off); else { g.rotateY(Math.PI / 2); g.translate(-0.5 + off, 0, 0) }
        projetar(g, nome); deFrente(g); g.translate(0, o.y ?? 0, 0)
        const m = new THREE.Mesh(g, mat(nome, o)); m.position.set(i, 0, j); m.receiveShadow = true; G.add(m); return m
      },
      /** objeto: caixa com o sprite projetado; w/d = base (1 = ladrilho inteiro), dx/dz = deslocamento da base dentro do ladrilho */
      obj(nome: string, i: number, j: number, o: { w?: number; d?: number; dx?: number; dz?: number; h?: number; tint?: string } = {}) {
        const w = o.w ?? 0.9, d = o.d ?? 0.9, dx = o.dx ?? 0, dz = o.dz ?? 0, h = o.h ?? autoH(nome, w, d, dx, dz)
        const g = new THREE.BoxGeometry(w, h, d); g.translate(dx, h / 2, dz); projetar(g, nome); deFrente(g)
        const m = new THREE.Mesh(g, mat(nome, o)); m.position.set(i, 0, j); m.userData.h = h; G.add(m); return m
      },
      /** sprite em pé de frente para a câmera (árvores, postes, capim alto), com a âncora no ponto (i, j) do chão */
      placa(nome: string, i: number, j: number, o: { fz?: number; tint?: string } = {}) {
        const [, , , , w, h] = meta(nome), g = new THREE.PlaneGeometry(w * K, h * K)
        const m = new THREE.Mesh(g, mat(nome, o)); m.quaternion // normal do plano (0,0,1) vira DIR pela própria base.setFromRotationMatrix(new THREE.Matrix4().makeBasis(RT, UP, DIR))
        m.position.set(i, 0, j).addScaledVector(UP, (h / 2 - 32) * K).addScaledVector(DIR, o.fz ?? 0.5) // fz: puxa para a frente (não afunda no chão)
        G.add(m); return m
      },
    }
    return C
  }
  return { cena, pronto: () => Promise.all(espera), mats: () => Object.values(MAT) }
}
