// A abertura: uma rua de Knox County à noite, vista pela CÂMERA DO JOGO (isométrica 2:1, 30°), montada com os SPRITES ORIGINAIS
// do jogo (piso, rua, casas, cercas, árvores, postes, lixeiras, sangue: projeto/assets/tiles) e os ZUMBIS e CARROS ORIGINAIS (3D).
//  - zumbis-tópico (Tierlists, Comunidade, Discord, Guias, Shorts): ficam perto do seu lugar, seguem o ponteiro quando ele chega perto
//    e carregam a placa do tópico (DOM por cima do canvas, acessível e clicável);
//  - zumbis da horda: vagam sem rumo; quando o ponteiro aparece, perseguem e dão o bote quando alcançam;
//  - um zumbi bate na lataria do sedã (z_doorbang) até o ponteiro chegar perto; outro está caído perto do acampamento e levanta (z_getup);
//  - todos viram a cabeça para o ponteiro (por cima da animação do jogo), cada um com o seu jeito de andar (z_walk 1 a 4);
//  - clique num zumbi: ele leva o golpe (z_hit); dois golpes seguidos derrubam (z_death) e, como no jogo, ele levanta de novo.
//    Clique num zumbi-tópico: abre o tópico.
//  - ambiente: lanterna no ponteiro, postes (um falhando), janela acesa, fogueira de um acampamento abandonado, chuva fina, lua.
// Carregado sob demanda (import dinâmico) depois que a página já apareceu; pausa fora da tela e com a aba escondida.
import { carregarPacote, criarFabrica, posar, THREE, type Humano, type Pacote } from './pz-leve'
import { criarTiles, DIR, WALL_H, type MetaTile } from './tiles-leve'
import { ALTURA_GLOBO, arvore3d, balancar, poste3d, telhado } from './objetos3d'

export interface OpcoesHorda {
  canvas: HTMLCanvasElement
  placas: (HTMLElement | null)[] // uma por zumbi-tópico, na mesma ordem de `topicos`
  topicos: { modelo: number; casa: [number, number] }[] // casa = ladrilho (x, z) da rua
  horda: number // quantos zumbis extras perseguem o ponteiro
  leve: boolean // celular / máquina fraca: menos pixels, sem sombra projetada, menos chuva
  aoAbrir: (i: number) => void
  aoPronto: () => void
  /** progresso da carga para o preloader: p de 0 a 1 e a etapa (baixando, vestindo, montando, acendendo) */
  aoProgresso?: (p: number, etapa: 'baixando' | 'vestindo' | 'montando' | 'acendendo') => void
  tamanhoPacote?: number
  aoMirar: (i: number | null) => void
}
type Estado = 'parado' | 'andando' | 'bote' | 'golpe' | 'caindo' | 'caido' | 'levantando' | 'batendo' | 'pulando'
type Papel = 'topico' | 'horda' | 'carro' | 'caido' | 'morto'
interface Agente {
  h: Humano; papel: Papel; topico: number | null; casa: THREE.Vector3; rumo: number; estado: Estado; f: number; espera: number
  andar: string; vel: number; trocou: number; brilho: number; golpes: number; ultimoGolpe: number; vago: THREE.Vector3; proxVago: number
  olharY: number; olharP: number; acordado: boolean; mistura: number
  antes: THREE.Vector3 // posição no começo do passo (para saber se cruzou uma cerca)
  pulo: { de: THREE.Vector3; meio: THREE.Vector3; para: THREE.Vector3; fase: number } | null
}
/** obstáculo no chão (casa, carro, lixeira, cerca): retângulo girado; ninguém atravessa */
interface Caixa { x: number; z: number; hx: number; hz: number; r: number }
/** cerca baixa: linha em x (eixo 'x', na altura z = em) ou em z (eixo 'z', em x = em), de..ate; portões = ladrilhos abertos */
interface Cerca { eixo: 'x' | 'z'; em: number; de: number; ate: number; portoes: number[] }
// pular cerca = a sequência da janela no jogo: apoia e sobe (start) -> cai do outro lado e levanta (end). A z_climbwin NÃO entra:
// ela já é um pulo inteiro (sobe, cai e levanta) e repetia a queda da end. A altura do quadril bate na emenda (start termina e end começa em y 0,08).
const PULO = [{ clip: 'z_climbwin_start', vel: 1 }, { clip: 'z_climbwin_end', vel: 1.2 }]

const ANDARES = ['z_walk', 'z_walk2', 'z_walk3', 'z_walk4']
const FPS = 30
const RUMO_CAMERA = Math.atan2(DIR.x, DIR.z) // de frente para quem olha
// centro do quadro (ladrilho) e tamanho da vista (em ladrilhos): paisagem pela altura, retrato pela largura
const CENTRO = { paisagem: new THREE.Vector3(-0.7, 0, -0.3), retrato: new THREE.Vector3(-0.6, 0, -0.2) }
const VISTA = { altura: 11.2, largura: 6.6 } // um pouco mais aberta: os elementos respiram

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

/** textura de brilho (círculo macio) para postes, janela e fogo */
function brilho(cor: string) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, cor); g.addColorStop(0.25, cor.replace(/[\d.]+\)$/, '0.35)')); g.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

export async function iniciarHorda(o: OpcoesHorda) {
  // pesos do preloader: baixar o pacote 60%, texturas dos zumbis 8%, sprites da rua 27%, primeiro quadro 5%
  const avisar = o.aoProgresso ?? (() => {})
  const { P, IMG } = await carregarPacote('/jogo/zumbis.json', o.tamanhoPacote, (e, f) => avisar(e === 'baixando' ? f * 0.6 : 0.6 + f * 0.08, e))
  const fab = criarFabrica(P, IMG)
  const T = criarTiles((P as Pacote & { tmeta: Record<string, MetaTile> }).tmeta)
  const rnd = (a: number, b: number) => a + Math.random() * (b - a)

  // ---------- render, câmera do jogo ----------
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: !o.leve, alpha: false, powerPreference: o.leve ? 'low-power' : 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, o.leve ? 1.5 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08
  renderer.shadowMap.enabled = !o.leve; renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const cena = new THREE.Scene()
  const NOITE = '#06070b'
  cena.background = new THREE.Color(NOITE)
  cena.fog = new THREE.Fog(NOITE, 46, 64) // o fundo da rua some no escuro, como no jogo à noite
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200)
  const alvo = new THREE.Vector3().copy(CENTRO.paisagem), alvoBase = alvo.clone()

  // ---------- luz: como a arte da tela de título do jogo (media/ui/Title*.png): quase preto, poças de luz âmbar quente
  // (postes, janela, fogueira, lanterna) e, de vez em quando, o clarão frio do relâmpago (Title_lightning) ----------
  const CEU = new THREE.Color('#4f5f8c'), CEU_RAIO = new THREE.Color('#c4d2fa'), BASE = { ceu: 0.78, lua: 0.62 }
  const ceu = new THREE.HemisphereLight(CEU, '#120f12', BASE.ceu); cena.add(ceu)
  const lua = new THREE.DirectionalLight('#a8bce8', BASE.lua); lua.position.set(-7, 12, -3); cena.add(lua, lua.target)
  if (!o.leve) { lua.castShadow = true; lua.shadow.mapSize.set(2048, 2048); Object.assign(lua.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 }); lua.shadow.bias = -0.0006; lua.shadow.normalBias = 0.03 }
  const lanterna = new THREE.SpotLight('#ffe9c7', 78, 16, 0.42, 0.62, 1.4); cena.add(lanterna, lanterna.target)

  // ---------- a rua (sprites do jogo) ----------
  const mundo = new THREE.Group(); cena.add(mundo)
  const C = T.cena(mundo)
  const n4 = (p: string, ids: number[]) => ids.map((i) => p + i)
  const GRAMA = n4('blends_natural_01_', [16, 21, 22, 23])
  const ASFALTO = n4('floors_exterior_street_01_', [0, 1, 2, 3, 4, 5]), CALCADA = ['floors_exterior_tilesandstone_01_0'], LAJOTA = n4('floors_exterior_tilesandstone_01_', [1, 2])
  const caixas: Caixa[] = []
  const bloqueia = (x: number, z: number, hx: number, hz: number, r = 0) => caixas.push({ x, z, hx, hz, r })
  // chão: grama; rua ao longo de x (j = 0..1), calçadas (j = -1 e 2), caminhos até as portas
  C.chao(GRAMA, -20, -18, 20, 16, { seed: 3 })
  C.chao(ASFALTO, -20, 0, 20, 1, { y: 0.02 })
  C.chao(CALCADA, -20, -1, 20, -1, { y: 0.025 }); C.chao(CALCADA, -20, 2, 20, 2, { y: 0.025 })
  C.chao(LAJOTA, -7, -4, -7, -2, { y: 0.025 }); C.chao(LAJOTA, 5, -4, 5, -2, { y: 0.025 }) // caminho de lajota até a porta

  // casas vistas da rua: parede da frente (N do ladrilho j1+1) + lateral (W do ladrilho i1+1) + telhado plano. Toda janela tem
  // o caixilho do jogo (regra 4.8) + cortina; atrás, vidro escuro (ou aceso: tem alguém lá dentro).
  // paredes do jogo: [W, N, pilar da quina, janela W, janela N, batente de porta N]
  const PAR = { siding: n4('walls_exterior_house_01_', [32, 33, 35, 40, 41, 43]), tijolo: n4('walls_exterior_house_01_', [4, 5, 7, 12, 13, 15]) }
  const vidroEscuro = new THREE.MeshBasicMaterial({ color: '#141c24' }), vidroAceso = new THREE.MeshBasicMaterial({ color: '#ffb766' })
  const acesas: THREE.Mesh[] = []
  function vidro(i: number, j: number, lado: 'N' | 'W', aceso: boolean) {
    // mesmo vidro do pipeline (cenarios.js): maior que o vão e atrás da cortina (-0,56) e da parede (-0,5): só aparece pelo buraco da janela
    const g = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), aceso ? vidroAceso : vidroEscuro)
    if (lado === 'N') g.position.set(i, 1.25, j - 0.62); else { g.rotation.y = Math.PI / 2; g.position.set(i - 0.62, 1.25, j) }
    mundo.add(g); if (aceso) acesas.push(g); return g
  }
  function casa(i0: number, i1: number, j0: number, j1: number, o: { parede: 'siding' | 'tijolo'; janelas: (number | string)[]; porta: number; acesa?: number | string; cortina: string; chamine?: [number, number] }) {
    const P_ = PAR[o.parede]
    for (let i = i0; i <= i1; i++) {
      const jan = o.janelas.includes(i)
      C.parede('N', P_[jan ? 4 : i === o.porta ? 5 : 1], i, j1 + 1) // porta: parede com batente (não parede lisa com porta colada)
      if (jan) { vidro(i, j1 + 1, 'N', o.acesa === i); C.parede('N', o.cortina, i, j1 + 1, { off: -0.06, luz: o.acesa === i ? '#ffb45c' : undefined }); C.parede('N', 'fixtures_windows_01_17', i, j1 + 1, { off: 0.01 }) }
      if (i === o.porta) C.parede('N', 'fixtures_doors_01_5', i, j1 + 1, { off: 0.01 })
    }
    for (let j = j0; j <= j1; j++) {
      const jan = o.janelas.includes('w' + j)
      C.parede('W', P_[jan ? 3 : 0], i1 + 1, j)
      if (jan) { vidro(i1 + 1, j, 'W', o.acesa === 'w' + j); C.parede('W', 'fixtures_windows_01_16', i1 + 1, j, { off: 0.01 }) }
    }
    // quina: no jogo o encontro da parede da frente com a lateral leva o PILAR (sem ele fica uma fresta de 1 px)
    C.obj(P_[2], i1 + 1, j1 + 1, { w: 0.13, d: 0.13, dx: -0.5, dz: -0.5, h: WALL_H + 0.2 })
    // telhado de 4 águas por fora (o jogo mostra o telhado, não o dentro da casa); beiral passa um pouco das paredes
    mundo.add(telhado(i0 - 0.5, j0 - 0.5, i1 + 0.5, j1 + 0.5, WALL_H + 0.02, { beiral: 0.32, chamine: o.chamine }))
    bloqueia((i0 + i1) / 2, (j0 + j1) / 2, (i1 - i0) / 2 + 0.6, (j1 - j0) / 2 + 0.6)
  }
  casa(-13, -3, -13, -5, { parede: 'siding', janelas: [-10, -5, 'w-7', 'w-10'], porta: -7, acesa: -5, cortina: 'fixtures_windows_curtains_01_26', chamine: [-10.5, -8.2] })
  casa(2, 10, -13, -5, { parede: 'tijolo', janelas: [3, 8, 'w-8'], porta: 5, acesa: 'w-8', cortina: 'fixtures_windows_curtains_01_10', chamine: [4, -10.6] })

  // cercas contínuas: cerquinha branca na frente dos dois quintais (portão nos caminhos das portas) e cerca de postes fechando o
  // terreno do acampamento (fundo + lateral até a calçada). Os zumbis PULAM as cercas, como no jogo (ver "pular" no comportamento).
  const CERCAS: Cerca[] = [
    { eixo: 'x', em: -1.5, de: -20.5, ate: 20.5, portoes: [-7, 5] },
    { eixo: 'x', em: 8.5, de: -20.5, ate: 20.5, portoes: [] },
    { eixo: 'z', em: 8.5, de: 2.5, ate: 8.5, portoes: [] },
  ]
  for (let i = -20; i <= 20; i++) if (i !== -7 && i !== 5) C.parede('N', 'fencing_01_5', i, -1)
  for (let i = -20; i <= 20; i++) C.parede('N', 'fencing_01_17', i, 9)
  for (let j = 3; j <= 8; j++) C.parede('W', 'fencing_01_16', 9, j)

  // árvores 3D (volume de verdade, sombra da lua, copa balançando), com as cores das árvores do jogo
  const arvores: THREE.Group[] = []
  const plantar = (especie: Parameters<typeof arvore3d>[0], x: number, z: number, seed: number, escala = 1) => {
    const a = arvore3d(especie, seed, escala); a.position.set(x, 0, z); a.rotation.y = seed; mundo.add(a); arvores.push(a); bloqueia(x, z, 0.3, 0.3)
  }
  plantar('bordo', -15, -3, 3); plantar('tilia', 0, -3.2, 5, 0.95); plantar('bordo', 13.2, -2.8, 7); plantar('tilia', -9.5, 6.2, 11)
  plantar('bordo', 13.5, 8.2, 13); plantar('betula', 16.5, 4, 17); plantar('bordo', -16, 8, 19); plantar('betula', 7.6, -3.2, 23, 0.9)
  plantar('pinheiro', -5.4, 7.6, 29); plantar('pinheiroVirginia', 13.4, 10.6, 31); plantar('pinheiro', -12.4, 11, 37)
  plantar('seca', -2.6, 7.2, 41, 0.95) // a seca, perto do acampamento
  // arbustos, capim alto, pedras
  const ARB = n4('f_bushes_1_', [100, 101, 103, 105])
  ;[[-11, -4], [-5.2, -3.8], [3, -4], [9, -4], [-13, 4], [8, 4], [12, 3], [-6, 5]].forEach(([i, j], k) => C.obj(ARB[k % 4], i, j))
  ;[[-2, 8], [6, 10], [-8, 9]].forEach(([i, j], k) => C.obj('f_bushes_1_' + [64, 67, 70][k], i, j))
  const CAPIM = n4('e_newgrass_1_', [16, 17, 40, 41, 64])
  ;[[-8, 3], [-3, 3], [6, 3], [11, 3], [-12, 3], [0, -2], [-1, 4], [7, 8], [-5, 9], [12, -2], [-14, -2]].forEach(([i, j], k) => C.obj(CAPIM[k % 5], i, j))
  ;[[-6, 3], [9, 7], [3, 8]].forEach(([i, j], k) => C.obj('d_generic_1_' + [24, 21, 51][k], i, j))

  // postes (um pisca: fiação ruim), placa de PARE, hidrante, caixas de correio, cone e barril (acidente), bueiro
  const postes: { luz: THREE.PointLight; halo: THREE.Sprite; falha: boolean }[] = []
  const haloTex = brilho('rgba(255,196,120,1)')
  // poste 3D (como o lighting_outdoor_01_1 do jogo); luz e brilho no globo, tudo num grupo: o poste em que a picape bateu entorta junto
  const GLOBO = new THREE.Vector3(0, ALTURA_GLOBO, 0)
  ;([[-10.5, 2, 0], [7, 2, 0.2], [-2, -1, 0]] as [number, number, number][]).forEach(([i, j, torto]) => {
    const pe = poste3d(); pe.position.set(i, 0, j); mundo.add(pe)
    pe.rotation.z = torto; bloqueia(i, j, 0.2, 0.2)
    const luz = new THREE.PointLight('#ffb15c', 20, 8.5, 1.5); luz.position.copy(GLOBO); pe.add(luz)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); halo.scale.setScalar(1.2)
    halo.position.copy(GLOBO).addScaledVector(DIR, 0.3); pe.add(halo) // um pouco para a câmera: o brilho fica na frente do globo
    postes.push({ luz, halo, falha: torto > 0 })
  })
  C.obj('street_decoration_01_0', -15, 2); C.obj('street_roadsigns_01_9', 14.5, -1)
  C.obj('street_decoration_01_12', -4.6, -1); C.obj('street_decoration_01_18', -8.8, -1); C.obj('street_decoration_01_8', 15.5, 2)
  C.obj('street_decoration_01_26', 13, 0.15); C.obj('street_decoration_01_27', 13.4, 1.7); C.obj('street_decoration_01_15', -3, 1, { w: 0.9, d: 0.9, h: 0.05 })
  C.obj('street_decoration_01_28', 16, 0.5)
  ;[[-4.6, -1], [-8.8, -1], [15.5, 2], [13.4, 1.7], [13, 0.15], [-15, 2], [14.5, -1]].forEach(([i, j]) => bloqueia(i, j, 0.25, 0.25))
  // lixo: caçamba e latões ao lado da casa de tijolo, sacos e papel na calçada e na rua
  C.obj('trashcontainers_01_8', 11.6, -3.7); C.obj('trashcontainers_01_0', 0.8, -2.6); C.obj('trashcontainers_01_16', -0.6, 2.3); C.obj('trashcontainers_01_24', 10.6, -2.3)
  bloqueia(11.6, -3.7, 0.6, 0.55); bloqueia(0.8, -2.6, 0.3, 0.3); bloqueia(-0.6, 2.3, 0.3, 0.3)
  ;[[-5, -1, 'trash_01_18'], [3, 2, 'trash_01_24'], [-12, 1, 'trash_01_27'], [5, -1, 'trash_01_33'], [4, 1, 'd_trash_1_13'], [-9, 2, 'd_trash_1_9'], [12, 1, 'trash_01_24']].forEach(([i, j, n]) => C.mancha(n as string, i as number, j as number, 0.035))
  // sangue no chão (sprites de sangue do jogo): onde a horda já passou
  ;[[-4, 2, 'blood_floor_large_01'], [-3, 1, 'blood_floor_med_02'], [1, 4, 'blood_floor_large_03'], [2, 3, 'blood_floor_small_03'], [9, 1, 'blood_floor_large_05'], [-8, 0, 'blood_floor_small_06'], [1, 1, 'blood_floor_med_05'], [-6, -2, 'blood_floor_small_03']].forEach(([i, j, n]) => C.mancha(n as string, i as number, j as number, 0.04, '#7a1616'))

  // acampamento abandonado no terreno da frente: barraca, lenha e a fogueira ainda acesa (alguém fugiu às pressas)
  const FOGO = new THREE.Vector3(3, 0, 5.4)
  // barraca do jogo = 2 peças (frente com a entrada + fundo, no ladrilho de trás), ao lado da fogueira
  C.obj('camping_01_0', 6, 5); C.obj('camping_01_1', 6, 4); bloqueia(6, 4.5, 0.55, 1.05)
  // lenha do jogo = 2 peças também: toras (camping_01_24, atrás) + pontas cortadas (camping_01_25, na frente)
  C.obj('camping_01_25', 1, 6); C.obj('camping_01_24', 0, 6); bloqueia(0.5, 6, 1, 0.5)
  C.obj('camping_01_4', FOGO.x, FOGO.z, { h: 0.12 }); bloqueia(FOGO.x, FOGO.z, 0.45, 0.45)
  const fogo = new THREE.PointLight('#ff7a2e', 16, 7.5, 1.6); fogo.position.set(FOGO.x, 0.5, FOGO.z); mundo.add(fogo)
  const chamaTex = brilho('rgba(255,150,60,1)')
  // chamas nascem da lenha no meio do anel de pedras (y ≈ 0,1) e afinam para cima
  const chamas = Array.from({ length: 4 }, (_, k) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: chamaTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); s.position.set(FOGO.x + rnd(-0.06, 0.06), 0.12 + k * 0.11, FOGO.z + rnd(-0.06, 0.06)).addScaledVector(DIR, 0.35); mundo.add(s); return s })
  const FAG = 40
  const fagPos = new Float32Array(FAG * 3).map((_, k) => (k % 3 === 1 ? Math.random() * 2 : (Math.random() - 0.5) * 0.4))
  const fagulhas = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(fagPos, 3)), new THREE.PointsMaterial({ color: '#ffb35c', size: 0.05, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  fagulhas.position.set(FOGO.x, 0.15, FOGO.z); mundo.add(fagulhas)
  // brilho da janela acesa no gramado
  const luzJanela = new THREE.PointLight('#ffa95a', 7, 5.5, 1.7); luzJanela.position.set(-5, 1.4, -3.6); mundo.add(luzJanela)

  // ---------- carros do jogo: o sedã parado na rua (com um zumbi batendo na porta) e a picape que bateu no poste ----------
  const VEH = { normal: ['car_normal', 'vehicle_carnormalshell', 1.47, -1.22, 0.83, 0.31], pickup: ['car_pickup', 'vehicle_pickupshell', 1.62, -1.52, 0.93, 0.37] } as const
  function veiculo(tipo: keyof typeof VEH, cor: string, x: number, z: number, r: number, inclina: [number, number] = [0, 0]) {
    const [malha, tex, fx, rx, hw, wr] = VEH[tipo], g = new THREE.Group()
    const { me, ext } = fab.cenario(malha, tex, cor); me.rotation.y = -Math.PI / 2; me.position.y = wr * 0.42; g.add(me)
    const pneu = new THREE.MeshLambertMaterial({ color: '#151515' }), aro = new THREE.MeshLambertMaterial({ color: '#8d8f8c' })
    ;[[fx, hw], [fx, -hw], [rx, hw], [rx, -hw]].forEach(([px, pz]) => {
      const w = new THREE.Group(); w.position.set(px, wr, pz)
      const t = new THREE.Mesh(new THREE.CylinderGeometry(wr, wr, 0.22, 16), pneu); t.rotation.x = Math.PI / 2; t.castShadow = true; w.add(t)
      const a = new THREE.Mesh(new THREE.CylinderGeometry(wr * 0.52, wr * 0.52, 0.02, 12), aro); a.rotation.x = Math.PI / 2; a.position.z = Math.sign(pz) * 0.115; w.add(a); g.add(w)
    })
    g.rotation.set(inclina[0], r, inclina[1]); g.position.set(x, 0, z); mundo.add(g)
    const L = Math.max(ext[0], ext[2]) / 2, W = Math.min(ext[0], ext[2]) / 2
    bloqueia(x, z, L + 0.25, W + 0.25, r)
    return { g, L, W, hw }
  }
  const sedan = veiculo('normal', '#5d1d1b', -5.6, 0.35, 0.04, [0.01, 0.02])
  // frente (+x do carro) apontada para o poste (7, 2), para-choque encostado nele; levemente torta (roda subiu na calçada)
  const picape = veiculo('pickup', '#566a4e', 9.62, 1.27, -2.87, [0.02, -0.035])
  // farol da picape ainda aceso, batendo no poste e no chão à frente
  const farolTex = brilho('rgba(255,236,190,1)')
  const farolHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: farolTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); farolHalo.scale.setScalar(0.7)
  farolHalo.position.set(picape.L + 0.18, 0.78, 0.62); picape.g.add(farolHalo)
  let farol: THREE.SpotLight | null = null
  if (!o.leve) { farol = new THREE.SpotLight('#ffe7b0', 22, 9, 0.45, 0.7, 1.5); farol.position.copy(farolHalo.position); const a = new THREE.Object3D(); a.position.set(picape.L + 5, -0.4, 1); picape.g.add(farol, a); farol.target = a }

  // ---------- chuva fina (o jogo chove muito) ----------
  const GOTAS_CHUVA = o.leve ? 160 : 420, chuvaPos = new Float32Array(GOTAS_CHUVA * 6)
  const VENTO = new THREE.Vector3(-0.9, -9, -0.5), passoGota = VENTO.clone().normalize().multiplyScalar(-0.32)
  const novaGota = (k: number, y = rnd(0, 10)) => { const x = alvo.x + rnd(-14, 14), z = alvo.z + rnd(-14, 14); chuvaPos.set([x, y, z, x + passoGota.x, y + passoGota.y, z + passoGota.z], k * 6) }
  for (let k = 0; k < GOTAS_CHUVA; k++) novaGota(k)
  const chuvaGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(chuvaPos, 3))
  const chuva = new THREE.LineSegments(chuvaGeo, new THREE.LineBasicMaterial({ color: '#9fb2d6', transparent: true, opacity: 0.28, depthWrite: false, fog: false }))
  chuva.frustumCulled = false; cena.add(chuva)

  // ---------- sangue: respingo quando o zumbi leva o golpe ----------
  const GOTAS = 90
  const gotasPos = new Float32Array(GOTAS * 3), gotasVel = new Float32Array(GOTAS * 3), gotasVida = new Float32Array(GOTAS)
  const gotasGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(gotasPos, 3))
  const gotas = new THREE.Points(gotasGeo, new THREE.PointsMaterial({ color: '#5a0a0c', size: 0.06, transparent: true, opacity: 0.95, depthWrite: false }))
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
  const teste = fab.zumbi(0, 1), VEL: Record<string, number> = {}
  for (const c of ANDARES) VEL[c] = medirAndar(P, teste, c)
  const agentes: Agente[] = []
  const novo = (modelo: number, papel: Papel, topico: number | null, casa: THREE.Vector3, seed: number) => {
    const h = fab.zumbi(modelo, seed)
    h.g.position.copy(casa); h.g.rotation.y = RUMO_CAMERA + rnd(-0.5, 0.5)
    cena.add(h.g)
    const andar = ANDARES[seed % ANDARES.length]
    const a: Agente = { h, papel, topico, casa, rumo: h.g.rotation.y, estado: 'parado', f: Math.random() * 30, espera: 0, andar, vel: VEL[andar] * rnd(0.9, 1.1), trocou: 1, brilho: 0, golpes: 0, ultimoGolpe: -9,
      vago: casa.clone(), proxVago: rnd(1, 5), olharY: 0, olharP: 0, acordado: papel === 'topico' || papel === 'horda', mistura: 0.28, antes: casa.clone(), pulo: null }
    h.clip = ['z_idle', a.f, true]; agentes.push(a); return a
  }
  o.topicos.forEach((t, i) => novo(t.modelo, 'topico', i, new THREE.Vector3(t.casa[0], 0, t.casa[1]), i * 7 + 3))
  let extra = o.topicos.length
  const PONTOS_HORDA = [[-12.5, 0.6], [11.5, -0.6], [-12, 4.5], [11, 5.5], [-1.4, -5.2], [6, 7.4]]
  for (let i = 0; i < o.horda; i++) { const [x, z] = PONTOS_HORDA[i % PONTOS_HORDA.length]; novo(extra++ % P.zumbis.length, 'horda', null, new THREE.Vector3(x, 0, z), i * 13 + 5) }
  // o que bate no sedã: do lado da calçada de baixo, de frente para a porta
  {
    const porta = new THREE.Vector3(0.15, 0, sedan.W + 0.55).applyAxisAngle(THREE.Object3D.DEFAULT_UP, sedan.g.rotation.y).add(sedan.g.position)
    const a = novo(extra++ % P.zumbis.length, 'carro', null, porta, 41)
    a.rumo = a.h.g.rotation.y = Math.atan2(sedan.g.position.x - porta.x, sedan.g.position.z - porta.z)
    a.estado = 'batendo'; a.h.clip = ['z_doorbang', rnd(0, 40), true]
  }
  // corpos: um caído perto da fogueira (levanta quando o ponteiro chega) e um que não levanta mais, na calçada
  {
    const a = novo(extra++ % P.zumbis.length, 'caido', null, new THREE.Vector3(1.4, 0, 3.6), 23)
    a.rumo = a.h.g.rotation.y = 2.3; a.estado = 'caido'; a.h.clip = ['z_death', P.clips.z_death.n - 1, false]
  }
  if (!o.leve) {
    const a = novo(extra++ % P.zumbis.length, 'morto', null, new THREE.Vector3(-4, 0, 2.4), 31)
    a.rumo = a.h.g.rotation.y = -0.6; a.estado = 'caido'; a.h.clip = ['z_death', P.clips.z_death.n - 1, false]
  }

  // ---------- ponteiro -> ponto no chão ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const mira = new THREE.Vector3().copy(alvo), miraSuave = mira.clone(), paralaxe = new THREE.Vector2(), paralaxeSuave = new THREE.Vector2()
  let ponteiro: { x: number; y: number } | null = null, ultimoMov = -1e9, mirado: number | null = null
  const rect = () => o.canvas.getBoundingClientRect()
  function mover(e: PointerEvent) {
    const r = rect(); ponteiro = { x: e.clientX - r.left, y: e.clientY - r.top }; ultimoMov = performance.now()
    ndc.set((ponteiro.x / r.width) * 2 - 1, -(ponteiro.y / r.height) * 2 + 1); ray.setFromCamera(ndc, cam)
    paralaxe.set(ndc.x, ndc.y)
    const p = new THREE.Vector3(); if (ray.ray.intersectPlane(plano, p)) { p.x = THREE.MathUtils.clamp(p.x, alvoBase.x - 14, alvoBase.x + 14); p.z = THREE.MathUtils.clamp(p.z, alvoBase.z - 12, alvoBase.z + 12); mira.copy(p) }
  }
  const sair = () => { ponteiro = null; paralaxe.set(0, 0) }
  // zumbi debaixo do ponteiro: caixa na tela entre o pé e a cabeça (barato e preciso o bastante para clicar)
  const _a = new THREE.Vector3(), _b = new THREE.Vector3()
  function quemEsta(px: number, py: number) {
    const r = rect(); let melhor: number | null = null, prof = Infinity
    agentes.forEach((a, i) => {
      if (a.estado === 'caido' || a.estado === 'caindo' || a.papel === 'morto') return
      _a.copy(a.h.g.position).project(cam); _b.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld).project(cam)
      const yPe = (1 - _a.y) / 2 * r.height, yCab = (1 - _b.y) / 2 * r.height - 12, xs = (_a.x + 1) / 2 * r.width, larg = Math.max(16, (yPe - yCab) * 0.3)
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
    if (a.estado === 'pulando') return // em cima da cerca: termina de pular primeiro
    const agora = performance.now() / 1000
    a.golpes = agora - a.ultimoGolpe < 2.2 ? a.golpes + 1 : 1; a.ultimoGolpe = agora; a.acordado = true
    _b.setFromMatrixPosition(a.h.bones.Bip01_Spine1.matrixWorld); respingo(_b, RUMO_CAMERA + Math.PI)
    trocar(a, a.golpes >= 2 ? 'caindo' : 'golpe')
  }
  o.canvas.addEventListener('pointermove', mover); o.canvas.addEventListener('pointerdown', mover)
  o.canvas.addEventListener('pointerleave', sair); o.canvas.addEventListener('click', clicar as unknown as EventListener)

  // ---------- comportamento ----------
  const CLIP: Record<Estado, [string, boolean]> = { parado: ['z_idle', true], andando: ['', true], bote: ['z_lunge', false], golpe: ['z_hit', false], caindo: ['z_death', false], caido: ['z_death', false], levantando: ['z_getup', false], batendo: ['z_doorbang', true], pulando: ['z_climbwin_start', false] }
  function trocar(a: Agente, e: Estado, mistura = 0.28) {
    if (a.estado === e) return
    const atual = a.h.clip
    a.h.mix = mistura > 0 ? [atual[0], atual[1], atual[2], 1] : null; a.trocou = mistura > 0 ? 0 : 1; a.mistura = mistura || 0.28
    a.estado = e; a.f = e === 'caido' ? P.clips.z_death.n - 1 : 0
    const [c, loop] = CLIP[e]
    a.h.clip = [e === 'andando' ? a.andar : c, a.f, loop]
  }
  const _alvo = new THREE.Vector3(), _d = new THREE.Vector3(), _cab = new THREE.Vector3(), _q = new THREE.Vector3()
  // cerca cruzada entre a e b (fora dos portões), ou null
  function cruza(a: THREE.Vector3, b: THREE.Vector3) {
    for (const c of CERCAS) {
      const pa = c.eixo === 'x' ? a.z : a.x, pb = c.eixo === 'x' ? b.z : b.x
      if ((pa - c.em) * (pb - c.em) >= 0) continue
      const t = (c.em - pa) / (pb - pa), ao = c.eixo === 'x' ? a.x + (b.x - a.x) * t : a.z + (b.z - a.z) * t
      if (ao < c.de || ao > c.ate || c.portoes.some((g) => Math.abs(ao - g) < 0.45)) continue
      return { c, ao }
    }
    return null
  }
  function comecarPulo(a: Agente, c: Cerca, ao: number, lado: number) {
    const n = c.eixo === 'x' ? new THREE.Vector3(0, 0, lado) : new THREE.Vector3(lado, 0, 0)
    const linha = c.eixo === 'x' ? new THREE.Vector3(ao, 0, c.em) : new THREE.Vector3(c.em, 0, ao)
    a.pulo = { de: linha.clone().addScaledVector(n, -0.42), meio: linha.clone().addScaledVector(n, -0.22), para: linha.clone().addScaledVector(n, 0.5), fase: 0 }
    a.h.g.position.copy(a.antes); a.rumo = a.h.g.rotation.y = Math.atan2(n.x, n.z)
    trocar(a, 'pulando', 0.2); a.h.apoio = false // em cima da cerca o corpo não "gruda" no chão
  }
  function passo(dt: number, agora: number) {
    const ativo = ponteiro != null || agora - ultimoMov < 2500
    for (const a of agentes) {
      const g = a.h.g
      if (a.papel === 'morto') continue
      a.antes.copy(g.position)
      a.trocou = Math.min(1, a.trocou + dt / a.mistura); if (a.h.mix) { a.h.mix[3] = 1 - a.trocou; if (a.trocou >= 1) a.h.mix = null }
      a.espera = Math.max(0, a.espera - dt)
      // ---- cabeça: segue o ponteiro (ou olha para quem está vendo, quando não há ponteiro); só de pé ----
      const dePe = a.estado !== 'caido' && a.estado !== 'caindo' && a.estado !== 'levantando' && a.estado !== 'pulando'
      let qy = 0, qp = 0
      if (dePe && !(a.estado === 'batendo' && !a.acordado)) {
        _cab.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld)
        if (ativo) _q.copy(miraSuave).setY(0.2); else _q.copy(_cab).addScaledVector(DIR, 20)
        const dx = _q.x - _cab.x, dz = _q.z - _cab.z, dy = _q.y - _cab.y
        let dif = Math.atan2(dx, dz) - g.rotation.y; dif = Math.atan2(Math.sin(dif), Math.cos(dif))
        qy = Math.abs(dif) > 2.4 ? 0 : THREE.MathUtils.clamp(dif, -1.15, 1.15) // atrás das costas: desiste de olhar
        qp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)) - 0.15, -0.35, 0.55)
      }
      a.olharY += (qy - a.olharY) * Math.min(1, dt * 4); a.olharP += (qp - a.olharP) * Math.min(1, dt * 4)
      a.h.olhar.y = a.olharY; a.h.olhar.p = a.olharP

      // ---- pulando a cerca: as 3 fases do jogo, o corpo atravessa junto ----
      if (a.estado === 'pulando' && a.pulo) {
        const fase = PULO[a.pulo.fase], n = P.clips[fase.clip].n
        a.f += dt * FPS * fase.vel; a.h.clip = [fase.clip, a.f, false]
        const t = Math.min(1, a.f / (n - 1))
        // fase 0 chega na cerca; fase 1: o corpo passa por cima e cai (primeiro terço da end), depois só levanta onde caiu
        if (a.pulo.fase === 0) g.position.lerpVectors(a.pulo.de, a.pulo.meio, t)
        else g.position.lerpVectors(a.pulo.meio, a.pulo.para, THREE.MathUtils.smoothstep(t, 0, 0.32))
        if (a.f >= n - 1) {
          if (a.pulo.fase < PULO.length - 1) { a.pulo.fase++; a.f = 0; a.h.mix = [fase.clip, n - 1, false, 1]; a.trocou = 0; a.mistura = 0.12 }
          else { a.pulo = null; a.h.apoio = true; a.espera = 0.3; trocar(a, 'parado', 0.3) }
        }
        continue
      }
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
        a.acordado = false; a.rumo = g.rotation.y = Math.atan2(sedan.g.position.x - g.position.x, sedan.g.position.z - g.position.z); trocar(a, 'batendo'); continue
      }

      // ---- alvo: ponteiro (horda sempre; tópico só se o ponteiro chegar perto da casa dele) ou a casa / um ponto ao léu ----
      const perseguidor = a.papel !== 'topico'
      const perto = ativo && mira.distanceTo(a.casa) < (perseguidor ? 99 : 2.6)
      if (perto) _alvo.copy(mira)
      else if (a.papel === 'horda') {
        a.proxVago -= dt
        if (a.proxVago <= 0) { // ao léu, do mesmo lado da cerca (sem estímulo ninguém pula à toa)
          for (let k = 0; k < 6; k++) { a.vago.set(a.casa.x + rnd(-2.5, 2.5), 0, a.casa.z + rnd(-1.8, 1.8)); if (!cruza(g.position, a.vago)) break; a.vago.copy(g.position) }
          a.proxVago = rnd(5, 11)
        }
        _alvo.copy(a.vago)
      } else _alvo.copy(a.casa)
      if (a.papel === 'topico' && perto) { _d.subVectors(_alvo, a.casa); if (_d.length() > 1.2) _alvo.copy(a.casa).addScaledVector(_d.normalize(), 1.2) } // coleira: a placa não sai do lugar
      _d.subVectors(_alvo, g.position); _d.y = 0; const dist = _d.length()
      const parar = perto ? 0.72 : 0.15
      const lerdo = perto ? 1 : 0.7
      if (dist > parar + 0.05) {
        if (a.estado !== 'andando' && a.espera <= 0) trocar(a, 'andando')
        if (a.estado === 'andando') {
          const queria = Math.atan2(_d.x, _d.z); let dif = queria - a.rumo; dif = Math.atan2(Math.sin(dif), Math.cos(dif))
          a.rumo += dif * Math.min(1, dt * 2.6); g.rotation.y = a.rumo
          const frente = Math.max(0, Math.cos(dif)), ritmo = (0.35 + 0.65 * frente) * lerdo
          g.position.x += Math.sin(a.rumo) * a.vel * ritmo * dt; g.position.z += Math.cos(a.rumo) * a.vel * ritmo * dt
          a.f += dt * FPS * ritmo; a.h.clip[1] = a.f
        } else { a.f += dt * FPS; a.h.clip[1] = a.f }
      } else {
        if (perto && a.espera <= 0) trocar(a, 'bote')
        else if (a.estado !== 'parado') trocar(a, 'parado')
        else {
          const alvoRumo = perto ? Math.atan2(mira.x - g.position.x, mira.z - g.position.z) : RUMO_CAMERA
          let dif = alvoRumo - a.rumo; dif = Math.atan2(Math.sin(dif), Math.cos(dif)); a.rumo += dif * Math.min(1, dt * 1.2); g.rotation.y = a.rumo
          a.f += dt * FPS; a.h.clip[1] = a.f
        }
      }
    }
    // ninguém atravessa casa, carro, cerca, poste ou outro zumbi
    for (let i = 0; i < agentes.length; i++) {
      const A = agentes[i]; if (A.papel === 'morto') continue
      const p = A.h.g.position
      if (A.estado !== 'batendo' && A.estado !== 'pulando') for (const c of caixas) {
        _d.set(p.x - c.x, 0, p.z - c.z).applyAxisAngle(THREE.Object3D.DEFAULT_UP, -c.r)
        const fx = Math.abs(_d.x) - c.hx, fz = Math.abs(_d.z) - c.hz
        if (fx < 0 && fz < 0) { if (fx > fz) _d.x = Math.sign(_d.x || 1) * c.hx; else _d.z = Math.sign(_d.z || 1) * c.hz; _d.applyAxisAngle(THREE.Object3D.DEFAULT_UP, c.r); p.x = c.x + _d.x; p.z = c.z + _d.z }
      }
      if (A.estado === 'caido' || A.estado === 'caindo') continue
      for (let j = i + 1; j < agentes.length; j++) {
        const B = agentes[j]; if (B.estado === 'caido' || B.estado === 'caindo' || B.papel === 'morto') continue
        const q = B.h.g.position; _d.subVectors(p, q); _d.y = 0; const d = _d.length()
        if (d < 0.62 && d > 1e-4 && A.estado !== 'pulando' && B.estado !== 'pulando') { _d.multiplyScalar((0.62 - d) / d / 2); p.add(_d); q.sub(_d) }
      }
    }
    // cerca: quem persegue PULA (como no jogo); zumbi-tópico (preso à placa), parado ou caído não passa
    for (const A of agentes) {
      if (A.papel === 'morto' || A.estado === 'pulando') continue
      const x = cruza(A.antes, A.h.g.position); if (!x) continue
      const pode = A.papel !== 'topico' && A.estado === 'andando'
      const lado = Math.sign((x.c.eixo === 'x' ? A.h.g.position.z : A.h.g.position.x) - x.c.em)
      if (pode) comecarPulo(A, x.c, x.ao, lado)
      else A.h.g.position.copy(A.antes)
    }
  }

  // ---------- placas dos tópicos (DOM): presas na cabeça, sem sobrepor umas às outras ----------
  const _c = new THREE.Vector3()
  const caixasPlaca: { el: HTMLElement; x: number; y: number; w: number; h: number; z: number }[] = []
  function placas() {
    const r = rect(); caixasPlaca.length = 0
    agentes.forEach((a) => {
      if (a.topico == null) return
      const el = o.placas[a.topico]; if (!el) return
      _c.setFromMatrixPosition(a.h.bones.Bip01_Head.matrixWorld); _c.y += 0.36; _c.project(cam)
      caixasPlaca.push({ el, x: (_c.x + 1) / 2 * r.width, y: (1 - _c.y) / 2 * r.height, w: el.offsetWidth, h: el.offsetHeight, z: _c.z })
    })
    caixasPlaca.sort((p, q) => q.z - p.z)
    for (let k = 0; k < 2; k++) for (let i = 0; i < caixasPlaca.length; i++) for (let j = 0; j < caixasPlaca.length; j++) {
      if (i === j) continue
      const A = caixasPlaca[i], B = caixasPlaca[j]; if (A.z < B.z) continue // A está atrás de B: A é quem sobe
      const sobreX = Math.min(A.x + A.w / 2, B.x + B.w / 2) - Math.max(A.x - A.w / 2, B.x - B.w / 2)
      const sobreY = Math.min(A.y, B.y) - Math.max(A.y - A.h, B.y - B.h)
      if (sobreX > 4 && sobreY > -4) A.y = B.y - B.h - 6
    }
    for (const c of caixasPlaca) {
      const meia = c.w / 2 + 10
      const xs = THREE.MathUtils.clamp(c.x, meia, r.width - meia), ys = Math.max(c.h + 8, c.y)
      c.el.style.transform = `translate3d(${xs.toFixed(1)}px, ${ys.toFixed(1)}px, 0) translate(-50%, -100%)`
      c.el.style.zIndex = String(Math.round((1 - c.z) * 1000))
    }
  }

  // ---------- tamanho e laço ----------
  let meiaL = 8, meiaA = 4.6
  function ajustar() {
    const r = rect(); if (!r.width || !r.height) return
    renderer.setSize(r.width, r.height, false)
    const aspecto = r.width / r.height, retrato = aspecto < 1
    alvoBase.copy(retrato ? CENTRO.retrato : CENTRO.paisagem)
    // paisagem: a altura manda (a rua inteira cabe); retrato: a largura manda (os zumbis não ficam minúsculos)
    meiaA = retrato ? VISTA.largura / aspecto / 2 : VISTA.altura / 2; meiaL = meiaA * aspecto
    cam.left = -meiaL; cam.right = meiaL; cam.top = meiaA; cam.bottom = -meiaA; cam.updateProjectionMatrix()
  }
  function posicionarCamera(t: number) {
    alvo.copy(alvoBase)
    // a câmera desliza um pouco para o lado do ponteiro e "respira" (mão de quem segura a lanterna)
    alvo.x += paralaxeSuave.x * 0.45 - paralaxeSuave.y * 0.3 + Math.sin(t * 0.21) * 0.06
    alvo.z += -paralaxeSuave.x * 0.45 - paralaxeSuave.y * 0.3 + Math.cos(t * 0.17) * 0.06
    cam.position.copy(alvo).addScaledVector(DIR, 40); cam.lookAt(alvo)
    lua.position.copy(alvo).add(new THREE.Vector3(-7, 12, -3)); lua.target.position.copy(alvo); lua.target.updateMatrixWorld()
  }
  const ro = new ResizeObserver(ajustar); ro.observe(o.canvas); ajustar(); posicionarCamera(0)
  let visivel = true, rodando = true, quadroId = 0, antes = performance.now(), primeiro = true
  const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) laco() }, { threshold: 0.02 }); io.observe(o.canvas)
  const vis = () => { if (!document.hidden) { antes = performance.now(); laco() } }; document.addEventListener('visibilitychange', vis)

  let proxFalha = performance.now() + rnd(8000, 16000), falhaAte = 0
  // relâmpago: clarão duplo, frio, que acende a rua inteira por um instante (a chuva já está caindo)
  let proxRaio = performance.now() + rnd(7000, 14000), raio = -1e9
  function clarao(agora: number) {
    if (agora > proxRaio) { raio = agora; proxRaio = agora + rnd(16000, 34000) }
    const t = (agora - raio) / 1000
    return t < 0 ? 0 : t < 0.07 ? 1 : t < 0.15 ? 0.12 : t < 0.22 ? 0.8 : t < 1.2 ? 0.8 * Math.exp(-(t - 0.22) * 5) : 0
  }
  function quadroDeRender(agora: number) {
    const dt = Math.min(0.05, (agora - antes) / 1000); antes = agora
    const t = agora / 1000
    passo(dt, agora)
    miraSuave.lerp(mira, Math.min(1, dt * 6))
    paralaxeSuave.lerp(paralaxe, Math.min(1, dt * 1.6))
    posicionarCamera(t)
    const k = clarao(agora)
    ceu.intensity = BASE.ceu + k * 2.1; ceu.color.copy(CEU).lerp(CEU_RAIO, k); lua.intensity = BASE.lua + k * 2.6
    // lanterna: na mão de quem olha (perto da câmera), apontada para o ponteiro; sem ponteiro, varre devagar o meio da rua
    const foco = ponteiro || agora - ultimoMov < 2500 ? miraSuave : _q.set(alvo.x + Math.sin(t * 0.4) * 2.2, 0, alvo.z + Math.cos(t * 0.31) * 1.4)
    lanterna.position.set(foco.x + 2.2, 5.2, foco.z + 2.2); lanterna.target.position.copy(foco); lanterna.target.updateMatrixWorld()
    if (agora > proxFalha) { falhaAte = agora + rnd(300, 900); proxFalha = agora + rnd(12000, 28000) }
    lanterna.intensity = agora < falhaAte ? (Math.sin(agora / 23) > 0.2 ? 70 : 8) : 70
    // postes: o da picape pisca (bateu nele), os outros tremem de leve
    for (const p of postes) {
      const f = p.falha ? (Math.sin(t * 9.1) * Math.sin(t * 2.3) > 0.55 ? 0.08 : Math.sin(t * 31) > 0.9 ? 0.4 : 1) : 0.94 + Math.sin(t * 13 + p.luz.position.x) * 0.03
      p.luz.intensity = 16 * f; (p.halo.material as THREE.SpriteMaterial).opacity = 0.9 * f
    }
    // janela acesa: TV ou vela lá dentro (tremido azul/laranja de leve)
    const tv = 0.85 + Math.sin(t * 5.3) * 0.08 + Math.sin(t * 11.7) * 0.05; luzJanela.intensity = 5 * tv
    vidroAceso.color.setRGB(1 * tv, 0.72 * tv, 0.42 * tv)
    // fogueira
    balancar(arvores, t) // vento nas copas
    fogo.intensity = 13 + Math.sin(agora / 90) * 2 + Math.sin(agora / 37) * 1.2
    chamas.forEach((s, k) => { const v = 0.55 + Math.sin(t * (7 + k * 2.3) + k) * 0.12 + Math.sin(t * 17 + k * 3) * 0.06; const afina = 1 - k * 0.2; s.scale.set(v * 0.75 * afina, v * 1.1 * afina, 1); (s.material as THREE.SpriteMaterial).opacity = 0.85 - k * 0.15 })
    for (let k = 0; k < FAG; k++) { let y = fagPos[k * 3 + 1] + dt * (0.45 + (k % 5) * 0.12); if (y > 2.4) { y = 0; fagPos[k * 3] = (Math.random() - 0.5) * 0.4; fagPos[k * 3 + 2] = (Math.random() - 0.5) * 0.4 } fagPos[k * 3 + 1] = y; fagPos[k * 3] += Math.sin(t * 2.5 + k) * dt * 0.1 }
    ;(fagulhas.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    // farol da picape: bateria morrendo
    const ff = Math.sin(t * 7.3) * Math.sin(t * 2.1) > 0.82 ? 0.15 : 1
    ;(farolHalo.material as THREE.SpriteMaterial).opacity = 0.9 * ff; if (farol) farol.intensity = 22 * ff
    // chuva
    for (let k = 0; k < GOTAS_CHUVA; k++) {
      const b = k * 6
      for (const off of [0, 3]) { chuvaPos[b + off] += VENTO.x * dt; chuvaPos[b + off + 1] += VENTO.y * dt; chuvaPos[b + off + 2] += VENTO.z * dt }
      if (chuvaPos[b + 1] < 0) novaGota(k, rnd(8, 10))
    }
    ;(chuvaGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    // sangue: cai com gravidade e para no chão
    let vivas = false
    for (let i = 0; i < GOTAS; i++) {
      if (gotasVida[i] <= 0) continue
      vivas = true; gotasVida[i] -= dt
      const k = i * 3
      if (gotasPos[k + 1] > 0.02) { gotasVel[k + 1] -= 9.8 * dt; gotasPos[k] += gotasVel[k] * dt; gotasPos[k + 1] = Math.max(0.02, gotasPos[k + 1] + gotasVel[k + 1] * dt); gotasPos[k + 2] += gotasVel[k + 2] * dt }
      if (gotasVida[i] <= 0) gotasPos[k + 1] = -99
    }
    if (vivas) gotasGeo.attributes.position.needsUpdate = true
    // destaque: zumbi sob o ponteiro brilha um pouco (mostra que é clicável)
    const sob = ponteiro ? quemEsta(ponteiro.x, ponteiro.y) : null
    o.canvas.style.cursor = sob != null ? (agentes[sob].topico != null ? 'pointer' : 'crosshair') : 'default'
    agentes.forEach((a, i) => { const al = i === sob ? 0.42 : 0.08; a.brilho += (al - a.brilho) * Math.min(1, dt * 8); a.h.mats.forEach((m) => (m.emissiveIntensity = a.brilho)) })
    if (o.placas.length) o.placas.forEach((el, tp) => el?.toggleAttribute('data-mirado', sob != null && agentes[sob].topico === tp))
    for (const a of agentes) if (a.papel !== 'morto' || primeiro) posar(P, a.h)
    renderer.render(cena, cam)
    placas()
    if (primeiro) { primeiro = false; o.aoPronto() }
  }
  function laco() {
    if (!rodando || !visivel || document.hidden) return
    cancelAnimationFrame(quadroId)
    quadroId = requestAnimationFrame(function f(tt) { if (!rodando || !visivel || document.hidden) return; quadroDeRender(tt); quadroId = requestAnimationFrame(f) })
  }
  // só mostra a rua depois que todos os sprites chegaram (nada de zumbi andando no vazio)
  await T.pronto((f) => avisar(0.68 + f * 0.27, 'montando'))
  avisar(0.96, 'acendendo')
  if (rodando) laco()

  return {
    destruir() {
      rodando = false; cancelAnimationFrame(quadroId); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', vis)
      o.canvas.removeEventListener('pointermove', mover); o.canvas.removeEventListener('pointerdown', mover); o.canvas.removeEventListener('pointerleave', sair)
      o.canvas.removeEventListener('click', clicar as unknown as EventListener)
      renderer.dispose()
    },
  }
}
