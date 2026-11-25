// Versão leve de projeto/pz.js para o site: monta os zumbis ORIGINAIS do jogo (malhas, texturas e esqueleto Bip01)
// e toca as animações originais do jogo (z_walk, z_idle, z_lunge...). Só o modo "clip" do pz.js: sem o esqueleto guia do engine.
// Dados: public/jogo/zumbis.json (gerado por scripts/gerar-zumbis.mjs a partir de projeto/assets/pz).
import * as THREE from 'three'

type Camada = string | [string, string?, number?]
export interface ZumbiBase { nome: string; sex: 'M' | 'F'; skin: string; layers: Camada[]; masks?: string[]; hair?: string; hairColor?: string; wear?: [string, string, string?, number?][]; pack?: [string, string, string?, number?]; blood?: number }
interface Malha { pos: number[]; uv: number[]; idx: number[]; nrm?: number[]; bones: string[]; inv: number[][]; si: number[]; sw: number[] }
interface Osso { n: string; p: string | null; m: number[] }
interface Clip { n: number; b: Record<string, { r: number[]; t: number[] }> }
export interface Pacote { zumbis: ZumbiBase[]; skel: Record<'M' | 'F', Osso[]>; mesh: Record<string, Malha>; clips: Record<string, Clip>; tex: Record<string, string> }

/** clip = animação atual; mix = animação anterior congelada, misturada com peso w (transição suave, como o jogo faz entre estados). */
export interface Humano { g: THREE.Group; bones: Record<string, THREE.Bone>; order: THREE.Bone[]; clip: [string, number, boolean]; mix: [string, number, boolean, number] | null; mats: THREE.MeshLambertMaterial[]; sombra: THREE.Mesh }

export async function carregarPacote(url: string): Promise<{ P: Pacote; IMG: Record<string, HTMLImageElement> }> {
  const P = (await (await fetch(url)).json()) as Pacote
  const IMG: Record<string, HTMLImageElement> = {}
  await Promise.all(Object.entries(P.tex).map(([k, src]) => new Promise<void>((res) => { const im = new Image(); im.onload = () => { IMG[k] = im; res() }; im.onerror = () => res(); im.src = src })))
  return { P, IMG }
}

export function criarFabrica(P: Pacote, IMG: Record<string, HTMLImageElement>) {
  // ---------- texturas: pele + roupas pintadas em camadas, com tinta (como o jogo faz nas roupas "TINT") ----------
  const cnv = (S: number) => { const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d')!; x.imageSmoothingEnabled = false; return { c, x } }
  const tmp = cnv(256)
  function camada(x: CanvasRenderingContext2D, nome: string, tinta?: string, ganho?: number) {
    const im = IMG[nome], S = x.canvas.width; if (!im) return
    if (!tinta && !ganho) { x.drawImage(im, 0, 0, S, S); return }
    const t = tmp.x; t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, S, S); t.filter = ganho ? `grayscale(1) brightness(${ganho})` : 'none'; t.drawImage(im, 0, 0, S, S); t.filter = 'none'
    if (tinta) { t.globalCompositeOperation = 'multiply'; t.fillStyle = tinta; t.fillRect(0, 0, S, S) }
    t.globalCompositeOperation = 'destination-in'; t.drawImage(im, 0, 0, S, S); x.drawImage(tmp.c, 0, 0)
  }
  function textura(camadas: Camada[], { masks = [] as string[], blood = 0, seed = 1 } = {}) {
    const { c, x } = cnv(256)
    camadas.forEach((L) => (Array.isArray(L) ? camada(x, L[0], L[1], L[2]) : camada(x, L)))
    if (blood) { // manchas de sangue (mesma receita do pz.js)
      x.globalCompositeOperation = 'source-atop'; let r = seed * 9301 + 49297; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280
      for (let i = 0; i < blood * 9; i++) { const px = 30 + rnd() * 196, py = 30 + rnd() * 215, rr = 1.5 + rnd() * 4.5; x.fillStyle = `rgba(${(52 + rnd() * 24) | 0},${(4 + rnd() * 6) | 0},${(6 + rnd() * 6) | 0},${0.45 + rnd() * 0.35})`
        for (let k = 0; k < 6; k++) { x.beginPath(); x.ellipse(px + (rnd() - 0.5) * rr * 2.4, py + (rnd() - 0.5) * rr * 3.4, rr * (0.25 + rnd() * 0.6), rr * (0.4 + rnd() * 1.1), rnd() * 3, 0, 7); x.fill() } }
      x.globalCompositeOperation = 'source-over'
    }
    masks.forEach((m) => { if (IMG[m]) { x.globalCompositeOperation = 'destination-out'; x.drawImage(IMG[m], 0, 0, 256, 256) } })
    x.globalCompositeOperation = 'source-over'
    const t = new THREE.CanvasTexture(c); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.LinearMipmapLinearFilter; return t
  }
  const cacheTex: Record<string, THREE.Texture> = {}
  const tex1 = (n: string, tinta?: string, ganho?: number) => (cacheTex[n + (tinta ?? '') + (ganho ?? '')] ??= textura([[n, tinta, ganho]]))
  const material = (map: THREE.Texture) => new THREE.MeshLambertMaterial({ map, alphaTest: 0.5, side: THREE.DoubleSide, emissive: '#ffffff', emissiveMap: map, emissiveIntensity: 0.2 })

  // ---------- geometria ----------
  const cacheGeo: Record<string, THREE.BufferGeometry> = {}
  function geom(nome: string) {
    if (cacheGeo[nome]) return cacheGeo[nome]
    const m = P.mesh[nome], g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(m.pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(m.uv, 2)); g.setIndex(m.idx)
    if (m.nrm?.length) g.setAttribute('normal', new THREE.Float32BufferAttribute(m.nrm, 3)); else g.computeVertexNormals()
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(m.si, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(m.sw, 4))
    return (cacheGeo[nome] = g)
  }
  const M4 = (a: number[]) => new THREE.Matrix4().fromArray(a) // DirectX (vetor-linha) -> three: mesma lista de números

  // escala: com a perna esticada o pé encosta no chão e o quadril fica a 0,95 (igual ao pz.js)
  const escala: Partial<Record<'M' | 'F', number>> = {}
  function escalaDe(sex: 'M' | 'F') {
    if (escala[sex]) return escala[sex]!
    const W: Record<string, THREE.Matrix4> = {}, Pp: Record<string, THREE.Vector3> = {}
    for (const b of P.skel[sex]) { const L = M4(b.m); W[b.n] = b.p ? W[b.p].clone().multiply(L) : L; Pp[b.n] = new THREE.Vector3().setFromMatrixPosition(W[b.n]) }
    const body = P.mesh[`${sex}_body`]; let minY = 1e9; for (let i = 1; i < body.pos.length; i += 3) minY = Math.min(minY, body.pos[i])
    const d = (a: string, b: string) => Pp[a].distanceTo(Pp[b])
    const total = d('Bip01_R_Thigh', 'Bip01_R_Calf') + d('Bip01_R_Calf', 'Bip01_R_Foot') + (Pp.Bip01_R_Foot.y - minY) + (Pp.Bip01_Pelvis.y - Pp.Bip01_R_Thigh.y)
    return (escala[sex] = 0.95 / total)
  }

  /** Monta um zumbi do jogo. i = qual dos modelos base; seed muda o sangue. */
  function zumbi(i: number, seed = i * 11): Humano {
    const o = P.zumbis[i % P.zumbis.length], sex = o.sex, s = escalaDe(sex)
    const g = new THREE.Group(), model = new THREE.Group(); model.rotation.y = Math.PI; model.scale.setScalar(s); g.add(model)
    const bones: Record<string, THREE.Bone> = {}, order: THREE.Bone[] = []
    for (const b of P.skel[sex]) { const bn = new THREE.Bone(); bn.name = b.n; M4(b.m).decompose(bn.position, bn.quaternion, bn.scale); bones[b.n] = bn; order.push(bn); (b.p ? bones[b.p] : model).add(bn) }
    g.updateMatrixWorld(true)
    const mats: THREE.MeshLambertMaterial[] = []
    const pele = (nome: string, map: THREE.Texture) => {
      const m = P.mesh[nome]; const sk = new THREE.Skeleton(m.bones.map((n) => bones[n]), m.inv.map(M4))
      const mat = material(map); mats.push(mat)
      const me = new THREE.SkinnedMesh(geom(nome), mat); me.frustumCulled = false; me.castShadow = true; model.add(me); me.bind(sk, new THREE.Matrix4())
    }
    pele(`${sex}_body`, textura([o.skin, ...o.layers], { masks: o.masks, blood: o.blood, seed }))
    if (o.hair) pele(`${sex}_hair_${o.hair}`, tex1('f_hair_white', o.hairColor ?? '#4a2e1a'))
    ;(o.wear ?? []).forEach(([mn, tn, tinta, ganho]) => pele(mn, tex1(tn, tinta, ganho)))
    if (o.pack) pele(o.pack[0], tex1(o.pack[1], o.pack[2], o.pack[3]))
    // sombra de contato (barata, sem shadow map)
    const sombra = new THREE.Mesh(new THREE.CircleGeometry(0.36, 20), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.45, depthWrite: false }))
    sombra.rotation.x = -Math.PI / 2; sombra.position.y = 0.012; g.add(sombra)
    return { g, bones, order, clip: ['z_idle', 0, true], mix: null, mats, sombra }
  }
  return { zumbi }
}

// ---------- animação: toca o clip do jogo (30 fps) direto no esqueleto Bip01 ----------
const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion(), _qm = new THREE.Quaternion(), _pm = new THREE.Vector3(), _v = new THREE.Vector3()
export const quadro = (c: { n: number }, f: number, loop: boolean) => { const n = c.n; return loop ? ((f % (n - 1)) + (n - 1)) % (n - 1) : Math.max(0, Math.min(n - 1, f)) }
/** amostra um osso do clip no quadro ff -> q (e p, se o osso tiver translação) */
function amostra(d: { r: number[]; t: number[] }, ff: number, q: THREE.Quaternion, p: THREE.Vector3) {
  const i0 = Math.floor(ff), k = ff - i0, nr = d.r.length / 4, a = Math.min(i0, nr - 1), a2 = Math.min(i0 + 1, nr - 1)
  _qa.fromArray(d.r, a * 4); _qb.fromArray(d.r, a2 * 4); q.copy(_qa).slerp(_qb, k).conjugate()
  const nt = d.t.length / 3; if (!nt) return false
  const t = Math.min(i0, nt - 1), t2 = Math.min(i0 + 1, nt - 1)
  p.set(d.t[t * 3] + (d.t[t2 * 3] - d.t[t * 3]) * k, d.t[t * 3 + 1] + (d.t[t2 * 3 + 1] - d.t[t * 3 + 1]) * k, d.t[t * 3 + 2] + (d.t[t2 * 3 + 2] - d.t[t * 3 + 2]) * k)
  return true
}
export function posar(P: Pacote, h: Humano) {
  const [nome, f0, loop] = h.clip, c = P.clips[nome]; if (!c) return
  const cm = h.mix ? P.clips[h.mix[0]] : null, fm = cm ? quadro(cm, h.mix![1], h.mix![2]) : 0, wm = cm ? h.mix![3] : 0
  h.g.updateMatrixWorld(true)
  const f = quadro(c, f0, loop)
  for (const b of h.order) {
    const d = c.b[b.name], par = b.parent!
    if (d && d.r.length) {
      if (amostra(d, f, b.quaternion, b.position) && b.name === 'Bip01') { b.position.x = 0; b.position.y = 0 }
      b.scale.setScalar(1)
      const dm = cm?.b[b.name]
      if (dm && dm.r.length && wm > 0) {
        const tem = amostra(dm, fm, _qm, _pm); b.quaternion.slerp(_qm, wm)
        if (tem) { if (b.name === 'Bip01') { _pm.x = 0; _pm.y = 0 } b.position.lerp(_pm, wm) }
      }
    }
    b.updateMatrix(); b.matrixWorld.multiplyMatrices(par.matrixWorld, b.matrix)
  }
  // REGRA 4.7 do canal: o ponto mais baixo do corpo encosta no chão (nem afunda, nem flutua)
  const B = h.bones, Y = (n: string) => _v.setFromMatrixPosition(B[n].matrixWorld).y
  const min = Math.min(Y('Bip01_L_Toe0'), Y('Bip01_R_Toe0'), Y('Bip01_L_Foot') - 0.1, Y('Bip01_R_Foot') - 0.1) - h.g.position.y
  h.g.position.y = -min
  h.sombra.position.y = 0.012 + min // a sombra fica no chão, mesmo com o corpo erguido
}
export { THREE }
