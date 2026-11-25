// A horda da tela inicial: zumbis ORIGINAIS do jogo, com as animações do jogo, numa noite de Knox County.
//  - zumbis-tópico (Tierlists, Comunidade, Discord, Guias, Shorts): ficam perto do seu lugar, seguem o ponteiro quando ele chega perto
//    e carregam a placa do tópico (DOM por cima do canvas, acessível e clicável);
//  - zumbis da horda: perseguem o ponteiro pela cena inteira e dão o bote quando alcançam;
//  - clique num zumbi: ele leva o golpe (z_hit). Clique num zumbi-tópico: abre o tópico.
// Carregado sob demanda (import dinâmico) depois que a página já apareceu; pausa fora da tela e com a aba escondida.
import { carregarPacote, criarFabrica, posar, THREE, type Humano } from './pz-leve'

export interface OpcoesHorda {
  canvas: HTMLCanvasElement
  placas: (HTMLElement | null)[] // uma por zumbi-tópico, na mesma ordem de `topicos`
  topicos: { modelo: number; casa: [number, number] }[]
  horda: number // quantos zumbis extras perseguem o ponteiro
  leve: boolean // celular / máquina fraca: menos pixels, sem sombra projetada
  aoAbrir: (i: number) => void
  aoPronto: () => void
  aoMirar: (i: number | null) => void
}
type Estado = 'parado' | 'andando' | 'bote' | 'golpe'
interface Agente { h: Humano; topico: number | null; casa: THREE.Vector3; rumo: number; vel: number; estado: Estado; f: number; espera: number; andar: string; trocou: number; brilho: number }

const VEL_ANIM = { z_walk: 0.42, z_walk2: 0.34 } as Record<string, number> // metros por ciclo/0,7 s, medidos no olho: pé não "patina"

export async function iniciarHorda(o: OpcoesHorda) {
  const { P, IMG } = await carregarPacote('/jogo/zumbis.json')
  const fab = criarFabrica(P, IMG)

  // ---------- render, câmera, luz ----------
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: !o.leve, alpha: true, powerPreference: o.leve ? 'low-power' : 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, o.leve ? 1.25 : 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = !o.leve; renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const cena = new THREE.Scene()
  cena.fog = new THREE.FogExp2('#0b1018', 0.055)
  const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60)

  cena.add(new THREE.HemisphereLight('#5a70a0', '#141210', 1.6))
  const lua = new THREE.DirectionalLight('#a9bde3', 1.6); lua.position.set(-5, 9, 6); cena.add(lua)
  const lanterna = new THREE.SpotLight('#ffd7a1', 110, 24, 0.42, 0.6, 1.4)
  lanterna.castShadow = !o.leve; lanterna.shadow.mapSize.set(1024, 1024); lanterna.shadow.bias = -0.0004
  cena.add(lanterna, lanterna.target)
  const fogo = new THREE.PointLight('#ff8a3c', 6, 7, 1.8); fogo.position.set(-3.6, 0.5, -2.2); cena.add(fogo)

  // chão: terra e capim escuros (textura procedural, sem arquivo)
  const cc = document.createElement('canvas'); cc.width = cc.height = 256; const x = cc.getContext('2d')!
  x.fillStyle = '#1a1d16'; x.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 2600; i++) { const v = Math.random(); x.fillStyle = v < 0.5 ? `rgba(44,52,34,${0.35 + Math.random() * 0.4})` : v < 0.8 ? `rgba(58,46,32,${0.25 + Math.random() * 0.35})` : `rgba(12,12,10,${0.5})`; x.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3) }
  const tc = new THREE.CanvasTexture(cc); tc.wrapS = tc.wrapT = THREE.RepeatWrapping; tc.repeat.set(14, 14); tc.colorSpace = THREE.SRGBColorSpace
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshLambertMaterial({ map: tc }))
  chao.rotation.x = -Math.PI / 2; chao.receiveShadow = true; cena.add(chao)
  // brasas da fogueira (só a luz e umas fagulhas: a fogueira de verdade fica fora do quadro)
  const brasas = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 60 * 3 }, (_, i) => (i % 3 === 1 ? Math.random() * 2 : (Math.random() - 0.5) * 0.6)), 3)),
    new THREE.PointsMaterial({ color: '#ffb35c', size: 0.045, transparent: true, opacity: 0.9, depthWrite: false }))
  brasas.position.copy(fogo.position).setY(0.1); cena.add(brasas)

  // ---------- zumbis ----------
  const agentes: Agente[] = []
  const novo = (modelo: number, topico: number | null, casa: THREE.Vector3, seed: number) => {
    const h = fab.zumbi(modelo, seed)
    h.g.position.copy(casa); h.g.rotation.y = Math.atan2(-casa.x, 6 - casa.z) // olhando para a câmera
    cena.add(h.g)
    const a: Agente = { h, topico, casa, rumo: h.g.rotation.y, vel: 0, estado: 'parado', f: Math.random() * 30, espera: 0, andar: seed % 2 ? 'z_walk2' : 'z_walk', trocou: 1, brilho: 0 }
    h.clip = ['z_idle', a.f, true]; agentes.push(a); return a
  }
  o.topicos.forEach((t, i) => novo(t.modelo, i, new THREE.Vector3(t.casa[0], 0, t.casa[1]), i * 7 + 3))
  for (let i = 0; i < o.horda; i++) { const ang = (i / Math.max(1, o.horda)) * Math.PI + Math.PI * 0.1; novo(i + o.topicos.length, null, new THREE.Vector3(Math.cos(ang) * 6.5, 0, -3.5 - Math.sin(ang) * 2.5), i * 13 + 5) }

  // ---------- ponteiro -> ponto no chão ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const mira = new THREE.Vector3(0, 0, 2), miraSuave = new THREE.Vector3(0, 0, 2)
  let ponteiro: { x: number; y: number } | null = null, ultimoMov = -1e9, mirado: number | null = null
  const rect = () => o.canvas.getBoundingClientRect()
  function mover(e: PointerEvent) {
    const r = rect(); ponteiro = { x: e.clientX - r.left, y: e.clientY - r.top }; ultimoMov = performance.now()
    ndc.set((ponteiro.x / r.width) * 2 - 1, -(ponteiro.y / r.height) * 2 + 1); ray.setFromCamera(ndc, cam)
    const p = new THREE.Vector3(); if (ray.ray.intersectPlane(plano, p)) { p.x = THREE.MathUtils.clamp(p.x, -8, 8); p.z = THREE.MathUtils.clamp(p.z, -6, 5.2); mira.copy(p) }
  }
  const sair = () => { ponteiro = null }
  // zumbi debaixo do ponteiro: caixa na tela entre o pé e a cabeça (barato e preciso o bastante para clicar)
  const _a = new THREE.Vector3(), _b = new THREE.Vector3()
  function quemEsta(px: number, py: number) {
    const r = rect(); let melhor: number | null = null, prof = Infinity
    agentes.forEach((a, i) => {
      _a.copy(a.h.g.position).project(cam); _b.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld).project(cam)
      const yPe = (1 - _a.y) / 2 * r.height, yCab = (1 - _b.y) / 2 * r.height - 14, xs = (_a.x + 1) / 2 * r.width, larg = (yPe - yCab) * 0.28
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
    trocar(a, 'golpe')
  }
  o.canvas.addEventListener('pointermove', mover); o.canvas.addEventListener('pointerdown', mover)
  o.canvas.addEventListener('pointerleave', sair); o.canvas.addEventListener('click', clicar as unknown as EventListener)

  // ---------- comportamento ----------
  function trocar(a: Agente, e: Estado) {
    if (a.estado === e) return
    const atual = a.h.clip
    a.h.mix = [atual[0], atual[1], atual[2], 1]; a.trocou = 0
    a.estado = e; a.f = 0
    a.h.clip = [e === 'andando' ? a.andar : e === 'bote' ? 'z_lunge' : e === 'golpe' ? 'z_hit' : 'z_idle', 0, e === 'andando' || e === 'parado']
  }
  const _alvo = new THREE.Vector3(), _d = new THREE.Vector3()
  function passo(dt: number, agora: number) {
    const ativo = ponteiro != null || agora - ultimoMov < 2500
    for (const a of agentes) {
      const g = a.h.g
      a.trocou = Math.min(1, a.trocou + dt / 0.28); if (a.h.mix) { a.h.mix[3] = 1 - a.trocou; if (a.trocou >= 1) a.h.mix = null }
      a.espera = Math.max(0, a.espera - dt)
      if (a.estado === 'golpe' || a.estado === 'bote') {
        a.f += dt * 30; a.h.clip[1] = a.f
        const n = P.clips[a.h.clip[0]].n
        if (a.f >= n - 1) { a.espera = a.estado === 'bote' ? 1.4 : 0.6; trocar(a, 'parado') }
        if (a.estado === 'bote' && a.f < 10) { g.position.addScaledVector(_d.set(Math.sin(g.rotation.y), 0, Math.cos(g.rotation.y)), dt * 0.9) }
        continue
      }
      // alvo: ponteiro (horda sempre; tópico só se o ponteiro chegar perto da casa dele) ou a casa
      const perto = ativo && mira.distanceTo(a.casa) < (a.topico == null ? 99 : 2.4)
      _alvo.copy(perto ? mira : a.casa)
      if (a.topico != null && perto) { _d.subVectors(_alvo, a.casa); if (_d.length() > 1.1) _alvo.copy(a.casa).addScaledVector(_d.normalize(), 1.1) } // coleira: a placa não sai do lugar
      _d.subVectors(_alvo, g.position); _d.y = 0; const dist = _d.length()
      const parar = perto ? 0.72 : 0.12
      if (dist > parar + 0.05) {
        if (a.estado !== 'andando' && a.espera <= 0) trocar(a, 'andando')
        if (a.estado === 'andando') {
          const queria = Math.atan2(_d.x, _d.z); let dif = queria - a.rumo; dif = Math.atan2(Math.sin(dif), Math.cos(dif))
          a.rumo += dif * Math.min(1, dt * 3.2); g.rotation.y = a.rumo
          const v = VEL_ANIM[a.andar] ?? 0.4, frente = Math.max(0, Math.cos(dif)) // vira antes de andar
          const vel = (v / 0.7) * frente; g.position.x += Math.sin(a.rumo) * vel * dt; g.position.z += Math.cos(a.rumo) * vel * dt
          a.f += dt * 30 * (0.35 + 0.65 * frente); a.h.clip[1] = a.f
        }
      } else {
        if (perto && a.espera <= 0) trocar(a, 'bote')
        else if (a.estado !== 'parado') trocar(a, 'parado')
        else {
          // parado: vira devagar para o ponteiro (ou para a câmera)
          const alvoRumo = perto ? Math.atan2(mira.x - g.position.x, mira.z - g.position.z) : Math.atan2(-g.position.x * 0.3, 8 - g.position.z)
          let dif = alvoRumo - a.rumo; dif = Math.atan2(Math.sin(dif), Math.cos(dif)); a.rumo += dif * Math.min(1, dt * 1.5); g.rotation.y = a.rumo
          a.f += dt * 30; a.h.clip[1] = a.f
        }
      }
    }
    // ninguém atravessa ninguém
    for (let i = 0; i < agentes.length; i++) for (let j = i + 1; j < agentes.length; j++) {
      const p = agentes[i].h.g.position, q = agentes[j].h.g.position; _d.subVectors(p, q); _d.y = 0; const d = _d.length()
      if (d < 0.62 && d > 1e-4) { _d.multiplyScalar((0.62 - d) / d / 2); p.add(_d); q.sub(_d) }
    }
  }

  // ---------- placas dos tópicos (DOM) ----------
  const _c = new THREE.Vector3()
  function placas() {
    const r = rect()
    agentes.forEach((a) => {
      if (a.topico == null) return
      const el = o.placas[a.topico]; if (!el) return
      _c.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld); _c.y += 0.42; _c.project(cam)
      const meia = el.offsetWidth / 2 + 10 // a placa nunca sai da tela
      const xs = THREE.MathUtils.clamp((_c.x + 1) / 2 * r.width, meia, r.width - meia), ys = Math.max(el.offsetHeight + 8, (1 - _c.y) / 2 * r.height)
      const esc = THREE.MathUtils.clamp(1.25 - _c.z * 0.25, 0.78, 1.08)
      el.style.transform = `translate3d(${xs.toFixed(1)}px, ${ys.toFixed(1)}px, 0) translate(-50%, -100%) scale(${esc.toFixed(3)})`
      el.style.zIndex = String(Math.round((1 - _c.z) * 1000))
    })
  }

  // ---------- tamanho e laço ----------
  function ajustar() {
    const r = rect(); if (!r.width || !r.height) return
    renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height
    const retrato = r.width < 768 // mesmo critério do horda.tsx (casas do celular)
    // paisagem: a horda ocupa a metade direita (o texto fica à esquerda); retrato: a horda fica embaixo do texto
    cam.fov = retrato ? 46 : 40
    if (retrato) { cam.position.set(0, 3.7, 6.4); cam.lookAt(0, 0.55, -0.7) } // de cima: cada fileira de zumbis (e de placas) fica numa altura else { cam.position.set(0.4, 2.3, 7.2); cam.lookAt(0.4, 0.95, 0) }
    cam.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(ajustar); ro.observe(o.canvas); ajustar()
  let visivel = true, rodando = true, quadroId = 0, antes = performance.now(), primeiro = true
  const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) laco() }, { threshold: 0.02 }); io.observe(o.canvas)
  const vis = () => { if (!document.hidden) { antes = performance.now(); laco() } }; document.addEventListener('visibilitychange', vis)

  function quadroDeRender(agora: number) {
    const dt = Math.min(0.05, (agora - antes) / 1000); antes = agora
    passo(dt, agora)
    miraSuave.lerp(mira, Math.min(1, dt * 6))
    lanterna.position.set(cam.position.x + 0.8, 3.2, cam.position.z - 1.2); lanterna.target.position.copy(miraSuave)
    fogo.intensity = 5 + Math.sin(agora / 90) * 0.8 + Math.sin(agora / 37) * 0.5
    const pos = brasas.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) { let y = pos.getY(i) + dt * (0.5 + (i % 5) * 0.12); if (y > 2.2) y = 0; pos.setY(i, y); pos.setX(i, pos.getX(i) + Math.sin(agora / 400 + i) * dt * 0.08) }
    pos.needsUpdate = true
    // destaque: zumbi sob o ponteiro brilha um pouco (mostra que é clicável)
    const sob = ponteiro ? quemEsta(ponteiro.x, ponteiro.y) : null
    o.canvas.style.cursor = sob != null ? (agentes[sob].topico != null ? 'pointer' : 'crosshair') : 'default'
    agentes.forEach((a, i) => { const alvo = i === sob ? 0.5 : 0.2; a.brilho += (alvo - a.brilho) * Math.min(1, dt * 8); a.h.mats.forEach((m) => (m.emissiveIntensity = a.brilho)) })
    if (o.placas.length) o.placas.forEach((el, t) => el?.toggleAttribute('data-mirado', sob != null && agentes[sob].topico === t))
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
      renderer.dispose()
    },
  }
}
