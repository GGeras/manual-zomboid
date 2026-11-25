// A horda da tela inicial: zumbis ORIGINAIS do jogo, com as animações do jogo, numa noite de Knox County.
//  - zumbis-tópico (Tierlists, Comunidade, Discord, Guias, Shorts): ficam perto do seu lugar, seguem o ponteiro quando ele chega perto
//    e carregam a placa do tópico (DOM por cima do canvas, acessível e clicável);
//  - zumbis da horda: vagam sem rumo; quando o ponteiro aparece, perseguem e dão o bote quando alcançam;
//  - um zumbi bate na lataria do sedã abandonado (z_doorbang) até o ponteiro chegar perto; outro está caído e levanta (z_getup);
//  - todos viram a cabeça para o ponteiro (por cima da animação do jogo), cada um com o seu jeito de andar (z_walk 1 a 4);
//  - clique num zumbi: ele leva o golpe (z_hit); dois golpes seguidos derrubam (z_death) e, como no jogo, ele levanta de novo.
//    Clique num zumbi-tópico: abre o tópico.
// Carregado sob demanda (import dinâmico) depois que a página já apareceu; pausa fora da tela e com a aba escondida.
import { carregarPacote, criarFabrica, posar, THREE, type Humano, type Pacote } from './pz-leve'

export interface OpcoesHorda {
  canvas: HTMLCanvasElement
  placas: (HTMLElement | null)[] // uma por zumbi-tópico, na mesma ordem de `topicos`
  topicos: { modelo: number; casa: [number, number] }[]
  horda: number // quantos zumbis extras perseguem o ponteiro
  leve: boolean // celular / máquina fraca: menos pixels, sem sombra projetada, cenário mais simples
  aoAbrir: (i: number) => void
  aoPronto: () => void
  aoMirar: (i: number | null) => void
}
type Estado = 'parado' | 'andando' | 'bote' | 'golpe' | 'caindo' | 'caido' | 'levantando' | 'batendo'
type Papel = 'topico' | 'horda' | 'carro' | 'caido'
interface Agente {
  h: Humano; papel: Papel; topico: number | null; casa: THREE.Vector3; rumo: number; estado: Estado; f: number; espera: number
  andar: string; vel: number; trocou: number; brilho: number; golpes: number; ultimoGolpe: number; vago: THREE.Vector3; proxVago: number
  olharY: number; olharP: number; acordado: boolean; mistura: number
}

const ANDARES = ['z_walk', 'z_walk2', 'z_walk3', 'z_walk4']
const FPS = 30

/** velocidade de cada jeito de andar, medida no próprio clip: o pé de apoio fica parado no chão (o pé não "patina") */
function medirAndar(P: Pacote, h: Humano, clip: string) {
  const c = P.clips[clip]; if (!c) return 0.5
  const g = h.g; g.position.set(0, 0, 0); g.rotation.y = 0; h.mix = null; h.olhar.y = h.olhar.p = 0
  const L = new THREE.Vector3(), R = new THREE.Vector3(); let soma = 0, n = 0, antes: [number, number] | null = null
  for (let f = 0; f <= c.n - 1; f++) {
    h.clip = [clip, f, true]; posar(P, h)
    L.setFromMatrixPosition(h.bones.Bip01_L_Toe0.matrixWorld); R.setFromMatrixPosition(h.bones.Bip01_R_Toe0.matrixWorld)
    const lado = L.y < R.y ? 0 : 1, z = lado ? R.z : L.z
    if (antes && antes[0] === lado) { soma += antes[1] - z; n++ } // pé de apoio anda para trás = o corpo anda para a frente
    antes = [lado, z]
  }
  const v = n ? (soma / n) * FPS : 0.5
  return THREE.MathUtils.clamp(v, 0.25, 1.1)
}

export async function iniciarHorda(o: OpcoesHorda) {
  const { P, IMG } = await carregarPacote('/jogo/zumbis.json')
  const fab = criarFabrica(P, IMG)
  const rnd = (a: number, b: number) => a + Math.random() * (b - a)

  // ---------- render, câmera ----------
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: !o.leve, alpha: true, powerPreference: o.leve ? 'low-power' : 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, o.leve ? 1.25 : 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1
  renderer.shadowMap.enabled = !o.leve; renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const cena = new THREE.Scene()
  const NEVOA = '#0a0f17'
  cena.fog = new THREE.FogExp2(NEVOA, 0.05)
  const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 80)
  const camBase = new THREE.Vector3(0.4, 2.3, 7.2), olhoBase = new THREE.Vector3(0.4, 0.95, 0) // ajustar() troca para o retrato

  // ---------- luz: lua fria por trás (recorta a silhueta), lanterna quente na mão de quem olha, fogueira fora do quadro ----------
  cena.add(new THREE.HemisphereLight('#4d6390', '#120f0c', 1.25))
  const lua = new THREE.DirectionalLight('#9fb6e8', 1.1); lua.position.set(-5, 9, 6); cena.add(lua)
  const contraluz = new THREE.DirectionalLight('#7f9fe0', 2.4); contraluz.position.set(3, 4, -9); cena.add(contraluz)
  const lanterna = new THREE.SpotLight('#ffd9a8', 120, 26, 0.4, 0.55, 1.4)
  lanterna.castShadow = !o.leve; lanterna.shadow.mapSize.set(1024, 1024); lanterna.shadow.bias = -0.0004; lanterna.shadow.normalBias = 0.02
  cena.add(lanterna, lanterna.target)
  const fogo = new THREE.PointLight('#ff7a30', 7, 8, 1.8); fogo.position.set(-3.8, 0.5, -1.6); cena.add(fogo)

  // ---------- chão: terra e capim escuros + a estrada de Knox County, tudo procedural (sem arquivo) ----------
  const tela = (S: number, pinta: (x: CanvasRenderingContext2D) => void) => { const c = document.createElement('canvas'); c.width = c.height = S; pinta(c.getContext('2d')!); return c }
  const capim = tela(256, (x) => {
    x.fillStyle = '#191c15'; x.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 3200; i++) { const v = Math.random(); x.fillStyle = v < 0.5 ? `rgba(46,56,34,${rnd(0.3, 0.7)})` : v < 0.8 ? `rgba(60,48,32,${rnd(0.25, 0.6)})` : 'rgba(10,10,8,.5)'; x.fillRect(Math.random() * 256, Math.random() * 256, rnd(1, 4), rnd(1, 4)) }
  })
  const tc = new THREE.CanvasTexture(capim); tc.wrapS = tc.wrapT = THREE.RepeatWrapping; tc.repeat.set(16, 16); tc.colorSpace = THREE.SRGBColorSpace; tc.anisotropy = 4
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshLambertMaterial({ map: tc }))
  chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao)
  const asfalto = tela(512, (x) => {
    x.fillStyle = '#1d1e20'; x.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 9000; i++) { const g = rnd(18, 52) | 0; x.fillStyle = `rgba(${g},${g},${g + 2},${rnd(0.3, 0.8)})`; x.fillRect(Math.random() * 512, Math.random() * 512, rnd(1, 3), rnd(1, 3)) }
    // faixa amarela tracejada e gasta no meio; bordas comidas pelo capim
    x.fillStyle = 'rgba(176,140,52,.55)'; for (let y = 0; y < 512; y += 128) x.fillRect(250, y + rnd(0, 10), 12, rnd(50, 70))
    for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(38,46,28,${rnd(0.4, 0.9)})`; const lado = Math.random() < 0.5 ? rnd(0, 26) : rnd(486, 512); x.fillRect(lado, Math.random() * 512, rnd(3, 12), rnd(2, 8)) }
    for (let i = 0; i < 14; i++) { x.strokeStyle = 'rgba(8,8,8,.6)'; x.lineWidth = 1; x.beginPath(); let px = rnd(40, 470), py = rnd(0, 512); x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += rnd(-14, 14); py += rnd(6, 20); x.lineTo(px, py) } x.stroke() }
  })
  const ta = new THREE.CanvasTexture(asfalto); ta.wrapS = ta.wrapT = THREE.RepeatWrapping; ta.repeat.set(1, 8); ta.colorSpace = THREE.SRGBColorSpace; ta.anisotropy = 4
  const estrada = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 60), new THREE.MeshLambertMaterial({ map: ta, color: '#5c5c60' }))
  estrada.rotation.set(-Math.PI / 2, 0, 1.32); estrada.position.set(1.5, 0.006, -6.4); estrada.receiveShadow = true; cena.add(estrada)

  // ---------- o sedã do jogo, abandonado no acostamento, com um farol ainda piscando ----------
  const carro = new THREE.Group()
  {
    const { me, ext } = fab.cenario('car_normal', 'vehicle_carnormalshell', '#5d1d1b')
    const wr = 0.31, fx = 1.47, rx = -1.22, hw = 0.83
    me.rotation.y = -Math.PI / 2; me.position.y = wr * 0.42; carro.add(me)
    const pneu = new THREE.MeshLambertMaterial({ color: '#161616' }), aro = new THREE.MeshLambertMaterial({ color: '#8d8f8c' })
    ;[[fx, hw], [fx, -hw], [rx, hw], [rx, -hw]].forEach(([px, pz], i) => {
      const murcho = i === 1 ? 0.07 : 0 // um pneu murcho: o carro fica torto, parado há semanas
      const w = new THREE.Group(); w.position.set(px, wr - murcho, pz)
      const t = new THREE.Mesh(new THREE.CylinderGeometry(wr, wr, 0.22, 16), pneu); t.rotation.x = Math.PI / 2; t.castShadow = true; w.add(t)
      const a = new THREE.Mesh(new THREE.CylinderGeometry(wr * 0.52, wr * 0.52, 0.02, 12), aro); a.rotation.x = Math.PI / 2; a.position.z = Math.sign(pz) * 0.115; w.add(a)
      carro.add(w)
    })
    carro.rotation.set(0.025, 2.75, 0.035)
    carro.position.set(3.6, 0, -6.6)
    // farol: só a luz do farol esquerdo, fraca e falhando (bateria morrendo)
    const L = Math.max(ext[0], ext[2]) / 2
    const vidro = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.32), new THREE.MeshBasicMaterial({ color: '#fff1b8', transparent: true, opacity: 0.9, fog: false }))
    vidro.position.set(L + 0.01, wr * 0.42 + 0.52, 0.6); carro.add(vidro)
    carro.userData.vidro = vidro
    if (!o.leve) {
      const farol = new THREE.SpotLight('#ffe7b0', 26, 14, 0.42, 0.7, 1.6); farol.position.copy(vidro.position)
      const alvo = new THREE.Object3D(); alvo.position.set(L + 6, -0.3, 1.2); carro.add(farol, alvo); farol.target = alvo
      carro.userData.farol = farol
    }
    cena.add(carro)
  }

  // ---------- linha de árvores ao fundo (silhuetas de pinheiro, recortadas pela névoa) ----------
  function fileira(z: number, alt: number, cor: string, semente: number) {
    const c = tela(1024, (x) => {
      let r = semente; const rr = () => ((r = (r * 9301 + 49297) % 233280) / 233280)
      x.fillStyle = cor
      for (let i = 0; i < 70; i++) {
        const px = rr() * 1024, h = 380 + rr() * 560, w = h * (0.22 + rr() * 0.12), base = 1024
        x.beginPath(); x.moveTo(px, base - h)
        for (let k = 1; k <= 7; k++) { const y = base - h + (h * 0.9 * k) / 7, ww = (w * k) / 7; x.lineTo(px + ww * (k % 2 ? 1 : 0.7), y); }
        for (let k = 7; k >= 1; k--) { const y = base - h + (h * 0.9 * k) / 7, ww = (w * k) / 7; x.lineTo(px - ww * (k % 2 ? 1 : 0.7), y) }
        x.closePath(); x.fill(); x.fillRect(px - 4, base - h * 0.15, 8, h * 0.15)
      }
      x.fillRect(0, 1000, 1024, 24)
    })
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(2, 1)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(70, alt), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, fog: true }))
    m.position.set(0, alt / 2 - 0.1, z); cena.add(m); return m
  }
  fileira(-22, 11, '#0d131c', 7)
  fileira(-15, 8, '#080b10', 19)

  // ---------- névoa rasteira: cortinas baixas, em pé, que derivam devagar (densas no chão, somem para cima) ----------
  const nevoaTex = new THREE.CanvasTexture(tela(256, (x) => {
    for (let i = 0; i < 70; i++) { const px = rnd(0, 256), py = rnd(120, 250), r = rnd(25, 70); const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, 'rgba(110,130,165,.2)'); g.addColorStop(1, 'rgba(110,130,165,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256) }
    x.globalCompositeOperation = 'destination-in'; const v = x.createLinearGradient(0, 0, 0, 256); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.55, 'rgba(0,0,0,.6)'); v.addColorStop(1, 'rgba(0,0,0,1)'); x.fillStyle = v; x.fillRect(0, 0, 256, 256)
  }))
  nevoaTex.wrapS = THREE.RepeatWrapping
  const lencois = Array.from({ length: o.leve ? 2 : 3 }, (_, i) => {
    const t = nevoaTex.clone(); t.needsUpdate = true; t.repeat.set(3, 1); t.offset.x = Math.random()
    const m = new THREE.Mesh(new THREE.PlaneGeometry(40, 2.2), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.32, depthWrite: false, fog: false }))
    m.position.set(0, 0.95, -1.5 - i * 3.2); m.renderOrder = 2; cena.add(m)
    return { m, t, v: (i % 2 ? -1 : 1) * rnd(0.004, 0.009) }
  })

  // brasas da fogueira (só a luz e umas fagulhas: a fogueira de verdade fica fora do quadro)
  const brasas = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 60 * 3 }, (_, i) => (i % 3 === 1 ? Math.random() * 2 : (Math.random() - 0.5) * 0.6)), 3)),
    new THREE.PointsMaterial({ color: '#ffb35c', size: 0.045, transparent: true, opacity: 0.9, depthWrite: false }))
  brasas.position.copy(fogo.position).setY(0.1); cena.add(brasas)

  // ---------- sangue: respingo quando o zumbi leva o golpe ----------
  const GOTAS = 90
  const gotasPos = new Float32Array(GOTAS * 3), gotasVel = new Float32Array(GOTAS * 3), gotasVida = new Float32Array(GOTAS)
  const gotasGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(gotasPos, 3))
  const gotas = new THREE.Points(gotasGeo, new THREE.PointsMaterial({ color: '#5a0a0c', size: 0.05, transparent: true, opacity: 0.95, depthWrite: false }))
  gotas.frustumCulled = false; cena.add(gotas); gotasPos.fill(-99)
  let proxGota = 0
  function respingo(p: THREE.Vector3, dir: number) {
    for (let k = 0; k < 18; k++) {
      const i = proxGota++ % GOTAS
      gotasPos.set([p.x, p.y, p.z], i * 3)
      gotasVel.set([Math.sin(dir) * rnd(0.4, 1.4) + rnd(-0.5, 0.5), rnd(0.4, 1.6), Math.cos(dir) * rnd(0.4, 1.4) + rnd(-0.5, 0.5)], i * 3)
      gotasVida[i] = rnd(0.6, 1.1)
    }
  }

  // ---------- zumbis ----------
  // medida dos andares num zumbi de teste (fora da cena)
  const teste = fab.zumbi(0, 1), VEL: Record<string, number> = {}
  for (const c of ANDARES) VEL[c] = medirAndar(P, teste, c)
  const agentes: Agente[] = []
  const novo = (modelo: number, papel: Papel, topico: number | null, casa: THREE.Vector3, seed: number) => {
    const h = fab.zumbi(modelo, seed)
    h.g.position.copy(casa); h.g.rotation.y = Math.atan2(-casa.x, 6 - casa.z) // olhando para a câmera
    cena.add(h.g)
    const andar = ANDARES[seed % ANDARES.length]
    const a: Agente = { h, papel, topico, casa, rumo: h.g.rotation.y, estado: 'parado', f: Math.random() * 30, espera: 0, andar, vel: VEL[andar] * rnd(0.9, 1.1), trocou: 1, brilho: 0, golpes: 0, ultimoGolpe: -9,
      vago: casa.clone(), proxVago: rnd(1, 5), olharY: 0, olharP: 0, acordado: papel !== 'caido' && papel !== 'carro', mistura: 0.28 }
    h.clip = ['z_idle', a.f, true]; agentes.push(a); return a
  }
  o.topicos.forEach((t, i) => novo(t.modelo, 'topico', i, new THREE.Vector3(t.casa[0], 0, t.casa[1]), i * 7 + 3))
  let extra = o.topicos.length
  for (let i = 0; i < o.horda; i++) { const ang = (i / Math.max(1, o.horda)) * Math.PI + Math.PI * 0.1; novo(extra++ % P.zumbis.length, 'horda', null, new THREE.Vector3(Math.cos(ang) * 6.5, 0, -3.5 - Math.sin(ang) * 2.5), i * 13 + 5) }
  // o que bate no carro: de frente para a porta do motorista
  {
    const porta = new THREE.Vector3(0.1, 0, 1.25).applyEuler(carro.rotation).add(carro.position)
    const a = novo(extra++ % P.zumbis.length, 'carro', null, porta, 41)
    a.rumo = a.h.g.rotation.y = Math.atan2(carro.position.x - porta.x, carro.position.z - porta.z)
    a.estado = 'batendo'; a.h.clip = ['z_doorbang', rnd(0, 40), true]
  }
  // o caído: no chão, perto da frente; levanta quando o ponteiro chega
  if (!o.leve) {
    const a = novo(extra++ % P.zumbis.length, 'caido', null, new THREE.Vector3(2.3, 0, 2.5), 23)
    a.rumo = a.h.g.rotation.y = 2.2
    a.estado = 'caido'; a.h.clip = ['z_death', P.clips.z_death.n - 1, false]
  }

  // ---------- ponteiro -> ponto no chão ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const mira = new THREE.Vector3(0, 0, 2), miraSuave = new THREE.Vector3(0, 0, 2), paralaxe = new THREE.Vector2(), paralaxeSuave = new THREE.Vector2()
  let ponteiro: { x: number; y: number } | null = null, ultimoMov = -1e9, mirado: number | null = null
  const rect = () => o.canvas.getBoundingClientRect()
  function mover(e: PointerEvent) {
    const r = rect(); ponteiro = { x: e.clientX - r.left, y: e.clientY - r.top }; ultimoMov = performance.now()
    ndc.set((ponteiro.x / r.width) * 2 - 1, -(ponteiro.y / r.height) * 2 + 1); ray.setFromCamera(ndc, cam)
    paralaxe.set(ndc.x, ndc.y)
    const p = new THREE.Vector3(); if (ray.ray.intersectPlane(plano, p)) { p.x = THREE.MathUtils.clamp(p.x, -8, 8); p.z = THREE.MathUtils.clamp(p.z, -6, 5.2); mira.copy(p) }
  }
  const sair = () => { ponteiro = null; paralaxe.set(0, 0) }
  // zumbi debaixo do ponteiro: caixa na tela entre o pé e a cabeça (barato e preciso o bastante para clicar)
  const _a = new THREE.Vector3(), _b = new THREE.Vector3()
  function quemEsta(px: number, py: number) {
    const r = rect(); let melhor: number | null = null, prof = Infinity
    agentes.forEach((a, i) => {
      if (a.estado === 'caido' || a.estado === 'caindo') return
      _a.copy(a.h.g.position).project(cam); _b.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld).project(cam)
      const yPe = (1 - _a.y) / 2 * r.height, yCab = (1 - _b.y) / 2 * r.height - 14, xs = (_a.x + 1) / 2 * r.width, larg = Math.max(18, (yPe - yCab) * 0.28)
      if (px > xs - larg && px < xs + larg && py > yCab && py < yPe && _a.z < prof) { prof = _a.z; melhor = i }
    })
    return melhor
  }
  function clicar(e: PointerEvent) {
    const r = rect(), i = quemEsta(e.clientX - r.left, e.clientY - r.top); if (i == null) return
    const a = agentes[i]
    const toque = e.pointerType === 'touch' || e.pointerType === 'pen'
    if (a.topico != null && (!toque || mirado === i)) { o.aoAbrir(a.topico); return } // toque: 1º toque mira (mostra a placa), 2º abre
    if (a.topico != null) { mirado = i; o.aoMirar(a.topico); return }
    // golpe: sangue na altura do peito, voando para longe de quem bateu (a câmera)
    const agora = performance.now() / 1000
    a.golpes = agora - a.ultimoGolpe < 2.2 ? a.golpes + 1 : 1; a.ultimoGolpe = agora; a.acordado = true
    _b.setFromMatrixPosition(a.h.bones.Bip01_Spine1.matrixWorld); respingo(_b, Math.atan2(_b.x - cam.position.x, _b.z - cam.position.z))
    trocar(a, a.golpes >= 2 ? 'caindo' : 'golpe')
  }
  o.canvas.addEventListener('pointermove', mover); o.canvas.addEventListener('pointerdown', mover)
  o.canvas.addEventListener('pointerleave', sair); o.canvas.addEventListener('click', clicar as unknown as EventListener)

  // ---------- comportamento ----------
  const CLIP: Record<Estado, [string, boolean]> = { parado: ['z_idle', true], andando: ['', true], bote: ['z_lunge', false], golpe: ['z_hit', false], caindo: ['z_death', false], caido: ['z_death', false], levantando: ['z_getup', false], batendo: ['z_doorbang', true] }
  function trocar(a: Agente, e: Estado, mistura = 0.28) {
    if (a.estado === e) return
    const atual = a.h.clip
    a.h.mix = mistura > 0 ? [atual[0], atual[1], atual[2], 1] : null; a.trocou = mistura > 0 ? 0 : 1; a.mistura = mistura || 0.28
    a.estado = e; a.f = e === 'caido' ? P.clips.z_death.n - 1 : 0
    const [c, loop] = CLIP[e]
    a.h.clip = [e === 'andando' ? a.andar : c, a.f, loop]
  }
  const _alvo = new THREE.Vector3(), _d = new THREE.Vector3(), _cab = new THREE.Vector3()
  function passo(dt: number, agora: number) {
    const ativo = ponteiro != null || agora - ultimoMov < 2500
    for (const a of agentes) {
      const g = a.h.g
      a.trocou = Math.min(1, a.trocou + dt / a.mistura); if (a.h.mix) { a.h.mix[3] = 1 - a.trocou; if (a.trocou >= 1) a.h.mix = null }
      a.espera = Math.max(0, a.espera - dt)
      // ---- cabeça: segue o ponteiro (ou a câmera, quando não há ponteiro); só de pé ----
      const dePe = a.estado !== 'caido' && a.estado !== 'caindo' && a.estado !== 'levantando'
      let qy = 0, qp = 0
      if (dePe) {
        _cab.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld)
        const alvo = ativo ? miraSuave : cam.position
        const dx = alvo.x - _cab.x, dz = alvo.z - _cab.z, dy = (ativo ? 0.2 : alvo.y) - _cab.y
        let dif = Math.atan2(dx, dz) - g.rotation.y; dif = Math.atan2(Math.sin(dif), Math.cos(dif))
        qy = THREE.MathUtils.clamp(dif, -1.15, 1.15) * (Math.abs(dif) > 2.4 ? 0 : 1) // atrás das costas: desiste de olhar
        qp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)) - 0.15, -0.35, 0.55)
        if (a.estado === 'batendo' && !a.acordado) { qy = 0; qp = 0 }
      }
      a.olharY += (qy - a.olharY) * Math.min(1, dt * 4); a.olharP += (qp - a.olharP) * Math.min(1, dt * 4)
      a.h.olhar.y = a.olharY; a.h.olhar.p = a.olharP

      // ---- animações que tocam até o fim ----
      if (a.estado === 'golpe' || a.estado === 'bote' || a.estado === 'caindo' || a.estado === 'levantando') {
        a.f += dt * FPS; a.h.clip[1] = a.f
        const n = P.clips[a.h.clip[0]].n
        if (a.estado === 'bote' && a.f < 10) g.position.addScaledVector(_d.set(Math.sin(g.rotation.y), 0, Math.cos(g.rotation.y)), dt * 0.9)
        if (a.f >= n - 1) {
          if (a.estado === 'caindo') { trocar(a, 'caido', 0); a.espera = rnd(3.5, 6) }
          else if (a.estado === 'levantando') { a.espera = 0.4; a.golpes = 0; trocar(a, 'parado', 0.35) }
          else { a.espera = a.estado === 'bote' ? 1.4 : 0.6; trocar(a, 'parado') }
        }
        continue
      }
      // ---- no chão: espera (ou o ponteiro chegar perto, para o caído do começo) e levanta, como no jogo ----
      if (a.estado === 'caido') {
        const chamou = a.papel === 'caido' && !a.acordado ? ativo && mira.distanceTo(g.position) < 2.6 : a.espera <= 0
        if (chamou) { a.acordado = true; trocar(a, 'levantando', 0) }
        continue
      }
      // ---- o do carro: bate na lataria até o ponteiro chegar perto (ou alguém acertar ele) ----
      if (a.papel === 'carro' && !a.acordado) {
        if (ativo && mira.distanceTo(g.position) < 3.2) { a.acordado = true; trocar(a, 'parado'); a.espera = 0.3 }
        else { a.f += dt * FPS; a.h.clip[1] = a.f; continue }
      }
      if (a.papel === 'carro' && a.acordado && !ativo && agora - ultimoMov > 9000 && g.position.distanceTo(a.casa) < 0.2) {
        // ponteiro sumiu há tempo: volta a bater no carro
        a.acordado = false; a.rumo = g.rotation.y = Math.atan2(carro.position.x - g.position.x, carro.position.z - g.position.z); trocar(a, 'batendo'); continue
      }

      // ---- alvo: ponteiro (horda sempre; tópico só se o ponteiro chegar perto da casa dele) ou a casa / um ponto ao léu ----
      const perseguidor = a.papel !== 'topico'
      const perto = ativo && mira.distanceTo(a.casa) < (perseguidor ? 99 : 2.4)
      if (perto) _alvo.copy(mira)
      else if (a.papel === 'horda') {
        // sem ponteiro: vaga devagar, como zumbi sem estímulo no jogo
        a.proxVago -= dt
        if (a.proxVago <= 0) { a.vago.set(a.casa.x + rnd(-2.2, 2.2), 0, a.casa.z + rnd(-1.6, 1.6)); a.proxVago = rnd(5, 11) }
        _alvo.copy(a.vago)
      } else _alvo.copy(a.casa)
      if (a.papel === 'topico' && perto) { _d.subVectors(_alvo, a.casa); if (_d.length() > 1.1) _alvo.copy(a.casa).addScaledVector(_d.normalize(), 1.1) } // coleira: a placa não sai do lugar
      _d.subVectors(_alvo, g.position); _d.y = 0; const dist = _d.length()
      const parar = perto ? 0.72 : 0.15
      const lerdo = perto ? 1 : 0.7 // sem estímulo anda mais devagar
      if (dist > parar + 0.05) {
        if (a.estado !== 'andando' && a.espera <= 0) trocar(a, 'andando')
        if (a.estado === 'andando') {
          const queria = Math.atan2(_d.x, _d.z); let dif = queria - a.rumo; dif = Math.atan2(Math.sin(dif), Math.cos(dif))
          a.rumo += dif * Math.min(1, dt * 2.6); g.rotation.y = a.rumo
          const frente = Math.max(0, Math.cos(dif)) // vira antes de andar
          const ritmo = (0.35 + 0.65 * frente) * lerdo
          g.position.x += Math.sin(a.rumo) * a.vel * ritmo * dt; g.position.z += Math.cos(a.rumo) * a.vel * ritmo * dt
          a.f += dt * FPS * ritmo; a.h.clip[1] = a.f
        } else { a.f += dt * FPS; a.h.clip[1] = a.f }
      } else {
        if (perto && a.espera <= 0) trocar(a, 'bote')
        else if (a.estado !== 'parado') trocar(a, 'parado')
        else {
          // parado: vira devagar para o ponteiro (ou para a câmera)
          const alvoRumo = perto ? Math.atan2(mira.x - g.position.x, mira.z - g.position.z) : Math.atan2(-g.position.x * 0.3, 8 - g.position.z)
          let dif = alvoRumo - a.rumo; dif = Math.atan2(Math.sin(dif), Math.cos(dif)); a.rumo += dif * Math.min(1, dt * 1.2); g.rotation.y = a.rumo
          a.f += dt * FPS; a.h.clip[1] = a.f
        }
      }
    }
    // ninguém atravessa ninguém (nem o carro)
    for (let i = 0; i < agentes.length; i++) {
      const p = agentes[i].h.g.position
      if (agentes[i].estado !== 'batendo') {
        _d.subVectors(p, carro.position); _d.y = 0; _d.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -carro.rotation.y)
        const fora = Math.max(Math.abs(_d.x) - 2.7, Math.abs(_d.z) - 1.25)
        if (fora < 0) { if (Math.abs(_d.x) - 2.7 > Math.abs(_d.z) - 1.25) _d.x = Math.sign(_d.x) * 2.7; else _d.z = Math.sign(_d.z) * 1.25; _d.applyAxisAngle(THREE.Object3D.DEFAULT_UP, carro.rotation.y); p.x = carro.position.x + _d.x; p.z = carro.position.z + _d.z }
      }
      if (agentes[i].estado === 'caido' || agentes[i].estado === 'caindo') continue
      for (let j = i + 1; j < agentes.length; j++) {
        if (agentes[j].estado === 'caido' || agentes[j].estado === 'caindo') continue
        const q = agentes[j].h.g.position; _d.subVectors(p, q); _d.y = 0; const d = _d.length()
        if (d < 0.62 && d > 1e-4) { _d.multiplyScalar((0.62 - d) / d / 2); p.add(_d); q.sub(_d) }
      }
    }
  }

  // ---------- placas dos tópicos (DOM): presas na cabeça, sem sobrepor umas às outras ----------
  const _c = new THREE.Vector3()
  const caixas: { el: HTMLElement; x: number; y: number; w: number; h: number; z: number }[] = []
  function placas() {
    const r = rect(); caixas.length = 0
    agentes.forEach((a) => {
      if (a.topico == null) return
      const el = o.placas[a.topico]; if (!el) return
      _c.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld); _c.y += 0.38; _c.project(cam)
      caixas.push({ el, x: (_c.x + 1) / 2 * r.width, y: (1 - _c.y) / 2 * r.height, w: el.offsetWidth, h: el.offsetHeight, z: _c.z })
    })
    // empurra para cima a placa de trás quando encosta na da frente (2 passadas bastam para 5 placas)
    caixas.sort((p, q) => q.z - p.z) // de trás para a frente
    for (let k = 0; k < 2; k++) for (let i = 0; i < caixas.length; i++) for (let j = 0; j < caixas.length; j++) {
      if (i === j) continue
      const A = caixas[i], B = caixas[j]; if (A.z < B.z) continue // A está atrás de B: A é quem sobe
      const sobreX = Math.min(A.x + A.w / 2, B.x + B.w / 2) - Math.max(A.x - A.w / 2, B.x - B.w / 2)
      const sobreY = Math.min(A.y, B.y) - Math.max(A.y - A.h, B.y - B.h)
      if (sobreX > 4 && sobreY > -4) A.y = B.y - B.h - 6
    }
    for (const c of caixas) {
      const meia = c.w / 2 + 10 // a placa nunca sai da tela
      const xs = THREE.MathUtils.clamp(c.x, meia, r.width - meia), ys = Math.max(c.h + 8, c.y)
      c.el.style.transform = `translate3d(${xs.toFixed(1)}px, ${ys.toFixed(1)}px, 0) translate(-50%, -100%)`
      c.el.style.zIndex = String(Math.round((1 - c.z) * 1000))
    }
  }

  // ---------- tamanho e laço ----------
  function ajustar() {
    const r = rect(); if (!r.width || !r.height) return
    renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height
    const retrato = r.width < 768 // mesmo critério do horda.tsx (casas do celular)
    // paisagem: a horda ocupa a metade direita (o texto fica à esquerda); retrato: a horda fica embaixo do texto
    cam.fov = retrato ? 46 : 40
    // retrato: de cima, cada fileira de zumbis (e de placas) fica numa altura
    if (retrato) { camBase.set(0, 3.7, 6.4); olhoBase.set(0, 0.55, -0.7) }
    else { camBase.set(0.4, 2.3, 7.2); olhoBase.set(0.4, 0.95, 0) }
    cam.position.copy(camBase); cam.lookAt(olhoBase)
    cam.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(ajustar); ro.observe(o.canvas); ajustar()
  let visivel = true, rodando = true, quadroId = 0, antes = performance.now(), primeiro = true
  const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) laco() }, { threshold: 0.02 }); io.observe(o.canvas)
  const vis = () => { if (!document.hidden) { antes = performance.now(); laco() } }; document.addEventListener('visibilitychange', vis)

  // lanterna falhando de vez em quando (pilha fraca): uma rajada curta de piscadas a cada 12–28 s
  let proxFalha = performance.now() + rnd(8000, 16000), falhaAte = 0
  function quadroDeRender(agora: number) {
    const dt = Math.min(0.05, (agora - antes) / 1000); antes = agora
    passo(dt, agora)
    miraSuave.lerp(mira, Math.min(1, dt * 6))
    // câmera: respira devagar e se inclina um pouco para o lado do ponteiro (paralaxe)
    paralaxeSuave.lerp(paralaxe, Math.min(1, dt * 2))
    const t = agora / 1000
    cam.position.set(camBase.x + paralaxeSuave.x * 0.35 + Math.sin(t * 0.21) * 0.05, camBase.y + paralaxeSuave.y * 0.12 + Math.sin(t * 0.33) * 0.03, camBase.z)
    cam.lookAt(olhoBase.x + paralaxeSuave.x * 0.15, olhoBase.y, olhoBase.z)
    lanterna.position.set(cam.position.x + 0.8, 3.2, cam.position.z - 1.2); lanterna.target.position.copy(miraSuave)
    if (agora > proxFalha) { falhaAte = agora + rnd(300, 900); proxFalha = agora + rnd(12000, 28000) }
    lanterna.intensity = agora < falhaAte ? (Math.sin(agora / 23) > 0.2 ? 120 : 15) : 120
    fogo.intensity = 6 + Math.sin(agora / 90) * 0.9 + Math.sin(agora / 37) * 0.6
    // farol do carro: quase sempre fraco e estável, às vezes falha
    const vidro = carro.userData.vidro as THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>
    const falhaFarol = Math.sin(t * 7.3) * Math.sin(t * 2.1) > 0.82 ? 0.15 : 1
    vidro.material.opacity = 0.85 * falhaFarol
    if (carro.userData.farol) (carro.userData.farol as THREE.SpotLight).intensity = 26 * falhaFarol
    const pos = brasas.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) { let y = pos.getY(i) + dt * (0.5 + (i % 5) * 0.12); if (y > 2.2) y = 0; pos.setY(i, y); pos.setX(i, pos.getX(i) + Math.sin(agora / 400 + i) * dt * 0.08) }
    pos.needsUpdate = true
    for (const l of lencois) l.t.offset.x += l.v * dt * 6
    // sangue: cai com gravidade e para no chão
    let vivas = false
    for (let i = 0; i < GOTAS; i++) {
      if (gotasVida[i] <= 0) continue
      vivas = true; gotasVida[i] -= dt
      const k = i * 3
      if (gotasPos[k + 1] > 0.01) { gotasVel[k + 1] -= 9.8 * dt; gotasPos[k] += gotasVel[k] * dt; gotasPos[k + 1] = Math.max(0.01, gotasPos[k + 1] + gotasVel[k + 1] * dt); gotasPos[k + 2] += gotasVel[k + 2] * dt }
      if (gotasVida[i] <= 0) gotasPos[k + 1] = -99
    }
    if (vivas) gotasGeo.attributes.position.needsUpdate = true
    // destaque: zumbi sob o ponteiro brilha um pouco (mostra que é clicável)
    const sob = ponteiro ? quemEsta(ponteiro.x, ponteiro.y) : null
    o.canvas.style.cursor = sob != null ? (agentes[sob].topico != null ? 'pointer' : 'crosshair') : 'default'
    agentes.forEach((a, i) => { const alvo = i === sob ? 0.42 : 0.08; a.brilho += (alvo - a.brilho) * Math.min(1, dt * 8); a.h.mats.forEach((m) => (m.emissiveIntensity = a.brilho)) })
    if (o.placas.length) o.placas.forEach((el, tp) => el?.toggleAttribute('data-mirado', sob != null && agentes[sob].topico === tp))
    for (const a of agentes) posar(P, a.h)
    renderer.render(cena, cam)
    placas()
    if (primeiro) { primeiro = false; o.aoPronto() }
  }
  function laco() {
    if (!rodando || !visivel || document.hidden) return
    cancelAnimationFrame(quadroId)
    quadroId = requestAnimationFrame(function f(t) { if (!rodando || !visivel || document.hidden) return; quadroDeRender(t); quadroId = requestAnimationFrame(f) })
  }
  laco()

  return {
    destruir() {
      rodando = false; cancelAnimationFrame(quadroId); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis)
      o.canvas.removeEventListener('pointermove', mover); o.canvas.removeEventListener('pointerdown', mover); o.canvas.removeEventListener('pointerleave', sair)
      o.canvas.removeEventListener('click', clicar as unknown as EventListener)
      renderer.dispose()
    },
  }
}
