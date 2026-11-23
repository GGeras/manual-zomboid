// cenarios.js — lugares completos montados com os sprites ORIGINAIS do jogo (tiles.js).
// Regra do canal (revisão 2026-11-20): lugar nunca vazio — rua com casas, árvores, grama e postes; casa com móveis e eletrodomésticos;
// fazenda com cercados, feno e cocho. Cada função devolve { C (cena), pontos úteis }. Chame .show() na cena do episódio.
import { THREE, PZ, prop, box, mat, U } from './engine.js';
import { cena, tileLuz, WALL_H } from './tiles.js';
export { tileLuz, WALL_H };
const { R, clamp, lerp, T } = U;
const n4 = (p, ids) => ids.map(i => p + i);
export const PISO = {
  grama: n4('blends_natural_01_', [16, 21, 22, 23]), gramaSeca: n4('blends_natural_01_', [32, 37, 38, 39]), terra: n4('blends_natural_01_', [64, 69, 70, 71]),
  neve: n4('e_newgrassbase_snow_1_', [16, 21, 22, 23]), asfalto: n4('floors_exterior_street_01_', [0, 1, 2, 3, 4, 5]), calcada: n4('floors_exterior_tilesandstone_01_', [0, 1, 2]),
  madeira: ['floors_interior_tilesandwood_01_42'], cozinha: ['floors_interior_tilesandwood_01_0'], telhado: ['floors_exterior_street_01_16'],
};
// paredes do jogo: [W, N, canto, janela W, janela N] (walls_*_house_01: cada grupo de 16 tem duas cores)
const PAR = { siding: [32, 33, 34, 40, 41].map(i => 'walls_exterior_house_01_' + i), tijolo: [4, 5, 6, 12, 13].map(i => 'walls_exterior_house_01_' + i),
  bege: [36, 37, 38, 44, 45].map(i => 'walls_interior_house_01_' + i), azul: [64, 65, 66, 72, 73].map(i => 'walls_interior_house_01_' + i) };

// fachada de casa vista da rua: parede da frente (N do ladrilho j0) + lateral (W do ladrilho i1+1) + telhado plano. Janela nas posições dadas.
function casaFora(C, i0, i1, j0, j1, o = {}) { const P = PAR[o.parede || 'siding'], jan = o.janelas || [], tint = o.tint;
  for (let i = i0; i <= i1; i++) { const w = jan.includes(i); C.parede('N', P[w ? 4 : 1], i, j1 + 1, { tint });
    if (w) { vidro(C, i, j1 + 1, 'N'); C.parede('N', o.cortina || 'fixtures_windows_curtains_01_10', i, j1 + 1, { off: -.06, tint }); } }   // regra 4.4: cortina da parede N = desenho da borda N
  for (let j = j0; j <= j1; j++) { const w = jan.includes('w' + j); C.parede('W', P[w ? 3 : 0], i1 + 1, j, { tint }); if (w) vidro(C, i1 + 1, j, 'W'); }
  C.parede('N', P[2], i1 + 1, j1 + 1, { tint });
  C.chao(o.telhado || PISO.telhado, i0, j0, i1, j1, { y: WALL_H + .02, tint: o.tetoTint || tint });
  // interior escuro atrás das janelas (vidro)
}
function vidro(C, i, j, lado, y = 0, luz = null) { const g = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.6), luz || new THREE.MeshBasicMaterial({ color: '#1d2a33' }));
  if (lado === 'N') g.position.set(C.x(i) - C.G.position.x, 1.25 + y, C.z(j) - C.G.position.z - .62); else { g.rotation.y = Math.PI / 2; g.position.set(C.x(i) - C.G.position.x - .62, 1.25 + y, C.z(j) - C.G.position.z); }
  C.G.add(g); return g; }

// árvore do jogo = tronco/galhos (e_redmaple_1_3) + copa da estação por cima (verão _15/_14; outono _19; inverno: galhos com neve _7)
export function arvore(C, i, j, est = 'verao', k = 0) { if (est === 'inverno') return C.placa(k % 2 ? 'e_redmaple_1_6' : 'e_redmaple_1_7', i, j);
  C.placa(k % 2 ? 'e_redmaple_1_2' : 'e_redmaple_1_3', i, j); return C.placa(est === 'outono' ? 'e_redmaple_1_19' : k % 2 ? 'e_redmaple_1_14' : 'e_redmaple_1_15', i, j, { fz: .55 }); }

// ---------- RUA DE BAIRRO (EP18): estação = 'verao' | 'inverno' | 'chuva' | 'calor' (verão de seca: grama queimada, asfalto desbotado, sombras duras) ----------
// estrada ao longo de x nas linhas j = 0..1, calçadas j = -1 e j = 2, jardins e duas casas ao fundo, grama, árvores e postes na frente.
export function rua(x0, z0, est = 'verao') {
  const C = cena(x0, z0), inv = est === 'inverno', chu = est === 'chuva', cal = est === 'calor';
  const gr = inv ? PISO.neve : PISO.grama, tA = inv ? '#e9eef6' : chu ? '#a9b2bc' : cal ? '#efe4cf' : null, tR = inv ? '#d8dde6' : cal ? '#fff4e2' : null;
  C.chao(gr, -16, -14, 16, 12, { seed: 3, tint: cal ? '#f2cf7e' : null });   // calor: grama do jogo queimada pelo sol (tinta amarelada)
  C.chao(PISO.asfalto, -16, 0, 16, 1, { y: .02, tint: tA });
  C.chao(PISO.calcada, -16, -1, 16, -1, { y: .025, tint: tR }); C.chao(PISO.calcada, -16, 2, 16, 2, { y: .025, tint: tR });
  C.chao(PISO.calcada, -6, -4, -6, -2, { y: .025, tint: tR }); C.chao(PISO.calcada, 5, -4, 5, -2, { y: .025, tint: tR });   // caminhos até as portas
  const tetoNeve = inv ? '#f4f7fb' : null;
  casaFora(C, -11, -2, -12, -5, { parede: 'siding', janelas: [-9, -4, 'w-7', 'w-10'], tetoTint: tetoNeve, cortina: 'fixtures_windows_curtains_01_26' });
  casaFora(C, 2, 10, -12, -5, { parede: 'tijolo', janelas: [3, 8, 'w-8'], tetoTint: tetoNeve, cortina: 'fixtures_windows_curtains_01_10' });
  // cerquinhas brancas na frente das casas
  for (let i = -11; i <= -2; i++) if (i !== -6) C.parede('N', 'fencing_01_5', i, -1, { tint: tR });
  // árvores (verão: verde cheio; inverno: galhos com neve) e arbustos
  const TREES = [[-13, -3], [0, -3], [12, -3], [-8, 5], [7, 6], [14, 4], [-15, 7], ...(cal ? [[-5, 4]] : [])];   // calor: árvore extra na frente = a sombra para onde se foge
  TREES.forEach(([i, j], k) => arvore(C, i, j, inv ? 'inverno' : 'verao', k));
  // sol a pino: sombra dura e escura de cada árvore no chão (é ali que se foge do calor)
  // tamanho da copa da árvore (≈ 2 ladrilhos), deitada para longe do sol (sol no alto à direita da tela → sombra para +z), base presa no tronco
  if (cal) TREES.forEach(([i, j]) => { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 32), sombraMat); m.rotation.x = -Math.PI / 2; m.scale.set(1.05, 1.3, 1);
    m.position.set(C.x(i) - C.G.position.x + .05, .035, C.z(j) - C.G.position.z + .7); C.G.add(m); });
  const ar = inv ? ['f_bushes_1_28', 'f_bushes_1_29', 'f_bushes_1_30'] : ['f_bushes_1_100', 'f_bushes_1_101', 'f_bushes_1_103', 'f_bushes_1_105'];
  [[-10, -4], [-3, -4], [3, -4], [9, -4], [cal ? 12 : -3, cal ? 6 : 4], [3, 4], [10, 3], [-12, 4]].forEach(([i, j], k) => C.obj(ar[k % ar.length], i, j, { w: .6, d: .6 }));
  if (!inv) [[-1, 6], [5, 9], [-6, 8]].forEach(([i, j], k) => C.obj('f_bushes_1_' + (64 + k * 3), i, j, { w: .5, d: .5 }));
  // postes de rua na calçada
  [[-9, 2], [6, 2]].forEach(([i, j]) => C.obj('lighting_outdoor_01_1', i, j, { w: .3, d: .3 }));
  if (!cal) C.obj('street_decoration_01_0', -4, 2, { w: .5, d: .5 });   // calor: sem a placa (ficava atrás dos textos)
  // carro estacionado (modelo original do jogo)
  const car = PZ.vehicle('normal', inv ? '#5a6f8a' : '#7a1f1c'); car.position.set(-11, 0, 1.15); car.scale.setScalar(1); C.G.add(car);
  return { C, at: C.at, chao: { x: x0, z: z0 } };
}

// ---------- FAZENDA (EP16): três cercados separados (vaca, ovelha, galinhas), celeiro, feno, cocho ----------
// cerca de madeira de criação: location_farm_accesories_01 (postes + tábuas). Cercado = retângulo de ladrilhos (i0..i1, j0..j1).
export function cercado(C, i0, i1, j0, j1, o = {}) { const N = o.n || 'fencing_01_17', Wn = o.w || 'fencing_01_16', gate = o.portao || [];
  for (let i = i0; i <= i1; i++) { if (!gate.includes('n' + i)) C.parede('N', N, i, j0); if (!gate.includes('s' + i)) C.parede('N', N, i, j1 + 1); }
  for (let j = j0; j <= j1; j++) { if (!gate.includes('w' + j)) C.parede('W', Wn, i0, j); if (!gate.includes('e' + j)) C.parede('W', Wn, i1 + 1, j); }
}
export function fazenda(x0, z0) {
  const C = cena(x0, z0);
  C.chao(PISO.grama, -16, -14, 16, 14, { seed: 5 }); C.chao(PISO.terra, -1, -12, 0, 12, { y: .02, seed: 2 });   // trilha de terra no meio
  // celeiro vermelho ao fundo (paredes do jogo: location_barn_01) e telhado
  for (let i = -12; i <= 9; i++) C.parede('N', 'location_barn_01_1', i, -11);
  C.parede('N', 'location_barn_01_2', 10, -11); C.chao(PISO.telhado, -12, -16, 9, -12, { y: WALL_H + .02, tint: '#b07060' });
  // três cercados: A (vacas) à esquerda, B (ovelhas) à direita, C (galinhas) na frente à direita
  cercado(C, -11, -3, -8, -1); cercado(C, 2, 10, -8, -1); cercado(C, 2, 8, 2, 7);
  // feno, cochos, sal, comedouros
  [[-10, -7], [-9, -7], [-4, -7]].forEach(([i, j]) => C.obj('farm_01_8', i, j, { w: .8, d: .8 }));
  C.obj('location_farm_accesories_01_4', -6, -7); C.obj('location_farm_accesories_01_5', 6, -7); C.obj('location_farm_accesories_01_12', -10, -2, { w: .4, d: .4 });
  C.obj('location_farm_accesories_01_14', 7, 3); C.obj('farm_01_14', 3, 6, { w: .8, d: .8 });
  C.obj('location_farm_accesories_01_36', 12, 3, { w: .6, d: .6 });   // espantalho
  [[-14, -4], [13, -6], [-14, 6], [14, 9], [-7, 10]].forEach(([i, j], k) => arvore(C, i, j, 'verao', k));
  [[-5, 4], [-9, 6], [11, 0], [-13, 2]].forEach(([i, j], k) => C.obj('f_bushes_1_' + [100, 103, 105, 101][k], i, j, { w: .6, d: .6 }));
  return { C, at: C.at, A: C.at(-7, -4.5), B: C.at(6, -4.5), G: C.at(5, 4.5) };
}

// ---------- CASA POR DENTRO (EP17 / EP19): sala + cozinha, paredes do jogo atrás (N e W), móveis originais ----------
// Interior i 0..9, j 0..7. Janela na parede N em i = 5 (barricadas) e na parede W em j = 3. Lado de fora: grama, cerca, árvores.
export function casaDentro(x0, z0, o = {}) {
  const C = cena(x0, z0), P = PAR[o.parede || 'bege'];
  C.chao(PISO.grama, -10, -10, 18, 16, { seed: 9 });
  C.chao(PISO.madeira, 0, 0, 5, 7, { y: .02 }); C.chao(PISO.cozinha, 6, 0, 9, 7, { y: .02 });
  C.chao('floors_rugs_01_0', 2, 4, 2, 4, { y: .03 });
  const winN = o.janelaN ?? 3, winW = o.janelaW ?? 3;
  const win2 = o.janelaN2 ?? -1;   // 2ª janela na parede do fundo (cozinha), opcional
  for (let i = 0; i <= 9; i++) C.parede('N', P[i === winN || i === win2 ? 4 : 1], i, 0);
  const porta = o.completa ? 6 : -1;   // casa completa: porta de madeira (batente + porta do jogo) na parede W
  for (let j = 0; j <= 7; j++) C.parede('W', j === porta ? 'walls_interior_house_01_46' : P[j === winW ? 3 : 0], 0, j);
  C.parede('N', P[2], 0, 0);
  // lado de fora da janela N: grama, cerca e árvore (aparecem pelo vão)
  for (let i = -3; i <= 12; i++) C.parede('N', 'fencing_01_5', i, -5);
  arvore(C, 2, -4, 'verao', 0); arvore(C, 8, -6, 'verao', 1); C.obj('f_bushes_1_101', 4, -2, { w: .6, d: .6 });
  // REGRA 4.4 (22/11): móvel ENCOSTADO na parede e com o desenho virado para dentro do cômodo (frente S na parede N, frente E na parede W).
  // Linha j = 0 encosta na parede N; coluna i = 0 encosta na parede W. Janelas (N em winN e win2, W em winW) ficam livres.
  // cozinha (fundo à direita): bancada com pia, [janela], fogão, geladeira — todos de frente para o cômodo (S)
  const livreN = i => i === winN || i === win2;
  [[6, 'fixtures_counters_01_45'], [7, 'fixtures_counters_01_45'], [8, 'appliances_cooking_01_13'], [9, 'appliances_refrigeration_01_1']].forEach(([i, n]) => {
    if (!livreN(i)) C.obj(n, i, 0, n.includes('refrigeration') ? { w: .85, d: .85 } : {}); });
  if (!livreN(6)) C.obj('fixtures_sinks_01_1', 6, 0, { w: .6, d: .6, h: 1.05 });
  // mesa da cozinha com cadeiras viradas PARA a mesa (ao sul da mesa = frente N; a leste = frente W)
  C.obj('furniture_tables_high_01_8', 7, 4); C.obj('furniture_seating_indoor_01_58', 7, 5); C.obj('furniture_seating_indoor_01_59', 8, 4);
  // sala: estante e cômoda na parede N (frente S), TV na parede N, duas poltronas na parede W (frente E), abajur, planta, tapete
  C.obj('furniture_shelving_01_40', 0, 0); C.obj('furniture_storage_01_13', 1, 0);
  if (!o.janelaLivre && !livreN(2)) C.obj('vegetation_indoor_01_0', 2, 0, { w: .5, d: .5 });
  if (!livreN(5)) C.obj('appliances_television_01_1', 5, 0, { w: .7, d: .7 });
  if (!o.completa) C.obj('lighting_indoor_01_0', 0, 2, { w: .4, d: .4 });
  [4, 5].forEach(j => { if (j !== winW) C.obj('furniture_seating_indoor_01_8', 0, j); });
  let poltrona = null;
  if (o.completa) {
    // ---- casa COMPLETA (EP19, 23/11): detalhes de construção + canto de leitura com luz de verdade ----
    // rodapé de madeira em todas as paredes (menos no vão da porta), porta fechada no batente
    for (let i = 0; i <= 9; i++) C.parede('N', 'walls_interior_detailing_01_33', i, 0, { off: .012 });
    for (let j = 0; j <= 7; j++) if (j !== porta) C.parede('W', 'walls_interior_detailing_01_32', 0, j, { off: .012 });
    C.parede('W', 'fixtures_doors_01_4', 0, porta, { off: .02 });
    // quadros e relógio na parede (desenho da mesma borda — regra 4.4)
    C.parede('N', 'walls_decoration_01_41', 4, 0, { off: .015 }); C.parede('N', 'walls_decoration_01_105', 1, 0, { off: .015 });
    C.parede('W', 'walls_decoration_01_52', 0, 4.5, { off: .015 });
    // canto de leitura: poltrona de couro encostada na parede W (frente E) com abajur de pé aceso ao lado
    poltrona = C.assento('furniture_seating_indoor_02_45', 0, 2, { encosto: 'W', hs: .486 });   // assento na altura do jogo (Bob_SatChair: nádega a 0,486 — regra 4.7)
    C.obj('lighting_indoor_01_on_58', 0, 1, { w: .35, d: .35 });
    // mesa de centro na frente das poltronas, em cima do tapete
    C.obj('furniture_tables_low_01_16', 1.2, 4.5, { w: .8, d: .9 });
  }
  return { C, at: C.at, P, poltrona };
}

// ---------- câmera: põe o personagem numa faixa da tela (sy = fração da altura, 0 = topo) para os modais ficarem acima dele ----------
// regra da revisão: modal nunca cobre o personagem/a animação → personagem na faixa de baixo (sy ≈ .74), modais na faixa de cima.
const UPV = new THREE.Vector3(0, 1, 0).addScaledVector(new THREE.Vector3(1, .82, 1).normalize(), -.82 / Math.hypot(1, .82, 1)).normalize();
export function camOn(c, x, z, h, sy = .74, y = 1) { const k = (sy - .5) * h * .86; c.cam(x + UPV.x * k, z + UPV.z * k, h, y + UPV.y * k); }

// ---------- andar de verdade: a animação do jogo é "no lugar" (o jogo move o corpo); aqui o corpo anda junto, sem patinar ----------
// pts = [[x, z], ...]; v = unidades/s (s_walk ≈ 1.35; s_walkslow ≈ .75). Devolve {x, z, ry, fim}
export function rota(pts, t, v) { let d = t * v; for (let i = 0; i + 1 < pts.length; i++) { const [ax, az] = pts[i], [bx, bz] = pts[i + 1], L = Math.hypot(bx - ax, bz - az);
    if (d <= L) { const k = d / L; return { x: ax + (bx - ax) * k, z: az + (bz - az) * k, ry: Math.atan2(bx - ax, bz - az), fim: false }; } d -= L; }
  const n = pts.length, [ax, az] = pts[n - 2], [bx, bz] = pts[n - 1]; return { x: bx, z: bz, ry: Math.atan2(bx - ax, bz - az), fim: true }; }
export const VEL = { s_walk: 1.35, s_walkslow: .75, z_walk: .55, s_sneak: .55 };   // s_sneak = andar agachado (Bob_WalkLowSneak) tocado a .8

// ---------- LUZ DE INTERIOR (regra 4.5, 23/11): a luz vem de algum lugar ----------
// luzInterior(C, { janelas: [['N', i] | ['W', j]], abajur: [i, j], hora: 'tarde' | 'noite' }) → { set(f) } — chamar set(f) em todo quadro da cena.
// janela = facho de sol no chão (com a cruz do caixilho) + poeira no ar; abajur = poça de luz quente no chão e na parede + luz de verdade no personagem
const gradTex = (fn, w = 256, h = 256) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); fn(x, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const addMat = (map, op) => new THREE.MeshBasicMaterial({ map, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
export function luzInterior(C, o = {}) {
  const G = C.G, X = i => C.x(i) - G.position.x, Z = j => C.z(j) - G.position.z, noite = o.hora === 'noite', parts = [];
  const sol = gradTex((x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,226,170,1)'); g.addColorStop(.55, 'rgba(255,200,130,.55)'); g.addColorStop(1, 'rgba(255,190,120,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,.85)'; x.fillRect(w / 2 - 5, 0, 10, h); x.fillRect(0, h * .42, w, 9);   // cruz do caixilho
    x.fillRect(0, 0, 14, h); x.fillRect(w - 14, 0, 14, h); });
  (o.janelas || []).forEach(([lado, n]) => { if (noite) return;
    // facho deitado no chão saindo da janela para dentro do cômodo, inclinado pelo sol da tarde
    const g = new THREE.PlaneGeometry(1, 1); const P = g.attributes.position, L = 2.6, sk = .9;
    for (let v = 0; v < 4; v++) { const u = P.getX(v) + .5, far = P.getY(v) < 0 ? 1 : 0;   // far = longe da janela
      if (lado === 'N') P.setXYZ(v, X(n) - .42 + u * .84 + far * sk, .045, Z(0) - .5 + far * L);
      else P.setXYZ(v, X(0) - .5 + far * L, .045, Z(n) - .42 + u * .84 + far * sk); }
    P.needsUpdate = true; const m = new THREE.Mesh(g, addMat(sol, .5)); G.add(m); parts.push(m);
    // poeira dentro do facho
    const N = 70, pos = new Float32Array(N * 3), dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: '#ffe8c0', size: .035, transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending }));
    dust.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3)); dust.userData = { lado, n, N }; G.add(dust); parts.push(dust); });
  let lamp = null;
  if (o.abajur) { const [i, j] = o.abajur, q = noite ? 1 : .7;
    const poca = gradTex((x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,196,120,1)'); g.addColorStop(.45, 'rgba(255,170,90,.45)'); g.addColorStop(1, 'rgba(255,150,70,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const chao = new THREE.Mesh(new THREE.CircleGeometry(1.7, 40), addMat(poca, .42 * q)); chao.rotation.x = -Math.PI / 2; chao.position.set(X(i) + .3, .05, Z(j) + .4); G.add(chao);
    const parede = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.2), addMat(poca, .38 * q)); parede.rotation.y = Math.PI / 2; parede.position.set(X(0) - .48, 1.5, Z(j)); G.add(parede);
    const pl = new THREE.PointLight('#ffb870', 6 * q, 4.5, 1.6); pl.position.set(X(i) + .2, 1.55, Z(j) + .2); G.add(pl); lamp = { chao, parede, pl, q }; }
  const vin = layer('vinheta', 'mix-blend-mode:multiply;');
  return { set(f) { tileLuz(noite ? '#9c8f82' : '#f0dfc6');
      vin.style.background = `radial-gradient(ellipse at 45% 55%, rgba(255,255,255,1) 42%, rgba(${noite ? '40,30,30' : '120,95,75'},1) 100%)`; vin.style.opacity = noite ? .95 : .55;
      parts.forEach(p => { if (!p.isPoints) { p.material.opacity = .42 + .06 * Math.sin(f * .02); return; }
        const { lado, n, N } = p.userData, a = p.geometry.attributes.position;
        for (let k = 0; k < N; k++) { const r1 = U.R(k * 3 + 1), r2 = U.R(k * 7 + 2), r3 = U.R(k * 11 + 5), t = f * .004 + r3;
          const along = (r1 * 2.2), across = (r2 - .5) * .8 + Math.sin(t * 6 + k) * .05, y = .2 + ((r3 * 2.1 + f * .0025 * (1 + r1)) % 2.1);
          if (lado === 'N') a.setXYZ(k, X(n) + across + along * .35, y, Z(0) - .4 + along); else a.setXYZ(k, X(0) - .4 + along, y, Z(n) + across + along * .35); }
        a.needsUpdate = true; });
      if (lamp) { const fl = 1 + .025 * Math.sin(f * .7) * Math.sin(f * .31); lamp.pl.intensity = 6 * lamp.q * fl; lamp.chao.material.opacity = .42 * lamp.q * fl; } },
    off() { if (vin) vin.style.opacity = 0; } };
}

const sombraMat = new THREE.MeshBasicMaterial({ color: '#1f1608', transparent: true, opacity: .42, depthWrite: false });
// ---------- clima ----------
// neve caindo: flocos (pontos) numa caixa em volta do ponto (x, z)
const NF = 700, snowGeo = new THREE.BufferGeometry(), snowPos = new Float32Array(NF * 3); snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
const SNOW = prop(new THREE.Points(snowGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 7, sizeAttenuation: false, transparent: true, opacity: .9, depthWrite: false }))); SNOW.frustumCulled = false;
export function neve(x, z, f, k = 1) { SNOW.visible = k > .02; SNOW.material.opacity = .9 * k;
  for (let i = 0; i < NF; i++) { const fall = (f * (.035 + R(i + 77) * .03) + R(i + 9) * 8) % 8, y = 8 - fall, sw = Math.sin(f * .05 + i) * .25;
    snowPos.set([x + (R(i) - .5) * 22 + sw - fall * .15, y, z + (R(i + 500) - .5) * 22 + sw - fall * .15], i * 3); }
  snowGeo.attributes.position.needsUpdate = true; }
// poças de chuva no chão (como no jogo: manchas escuras e brilhantes) com pingos fazendo anéis
const POCAS = prop(new THREE.Group()), poMat = new THREE.MeshBasicMaterial({ color: '#2f3d4a', transparent: true, opacity: .62, depthWrite: false }), rings = [];
export function pocas(C, lista) { lista.forEach(([i, j, w, d], n) => { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 28), poMat); m.rotation.x = -Math.PI / 2; m.scale.set(w, d, 1); m.position.set(C.x(i), .04, C.z(j)); POCAS.add(m);
  for (let r = 0; r < 3; r++) { const g = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 24), new THREE.MeshBasicMaterial({ color: '#d8e6f2', transparent: true, opacity: 0, depthWrite: false })); g.rotation.x = -Math.PI / 2; g.userData = { x: C.x(i), z: C.z(j), w, d, s: n * 7 + r }; POCAS.add(g); rings.push(g); } }); }
export function chuvaChao(f) { POCAS.visible = true; rings.forEach(g => { const u = g.userData, a = ((f / 30 + R(u.s) * 3) % 1); g.position.set(u.x + (R(u.s + 1) - .5) * u.w, .045, u.z + (R(u.s + 2) - .5) * u.d); g.scale.setScalar(.05 + a * .35); g.material.opacity = .7 * (1 - a); }); }

// ---------- camadas de tela (por cima do 3D, por baixo dos textos) ----------
// 'gelo': bordas congeladas; 'sol': brilho forte e quente de verão; 'chuva': tela mais fria e escura
const LAYER = {}; function layer(k, css) { if (LAYER[k]) return LAYER[k]; const d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;' + css;
  const gl = document.getElementById('gl'); gl.parentNode.insertBefore(d, gl.nextSibling); return LAYER[k] = d; }
// ---------- CALOR (EP18 v3): ar tremendo (miragem), cor queimada, sol estourando com raios, borda quente que pulsa ----------
// calor(f, k): k 0..1.4 (1 = sol forte; >1 = insolação/hipertermia). pulse 0..1 = batida do coração na borda vermelha.
let HZ = null;
function hazeSvg() { if (HZ) return HZ; const ns = 'http://www.w3.org/2000/svg', sv = document.createElementNS(ns, 'svg'); sv.setAttribute('width', 0); sv.setAttribute('height', 0); sv.style.position = 'absolute';
  sv.innerHTML = `<filter id="pzHaze" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" x="0" y="0" width="1080" height="2600" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.006 0.035" numOctaves="2" seed="7" stitchTiles="stitch" x="0" y="0" width="540" height="540" result="n"/>
    <feTile in="n" x="0" y="0" width="1080" height="2600" result="t"/>
    <feOffset in="t" dx="0" dy="0" result="o"/>
    <feDisplacementMap in="SourceGraphic" in2="o" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  document.body.appendChild(sv); HZ = { off: sv.querySelector('feOffset'), dis: sv.querySelector('feDisplacementMap') }; return HZ; }
export function calor(f, k = 1, pulse = 0, tilt = 0) { const h = hazeSvg(), gl = document.getElementById('gl');
  gl.style.transform = tilt ? `scale(${1 + .05 * Math.abs(tilt) + .02}) rotate(${(tilt * Math.sin(f * .045)).toFixed(3)}deg)` : '';
  h.off.setAttribute('dy', -((f * 2.4) % 540)); h.dis.setAttribute('scale', (5 + 9 * Math.max(0, k - .4)).toFixed(1));
  gl.style.filter = `url(#pzHaze) saturate(${1.12 + .18 * k}) sepia(${.1 + .14 * k}) brightness(${1.02 + .06 * k}) contrast(1.06)`;
  const L = layer('calor', ''), a = (f * .25) % 360, glow = .75 + .25 * Math.sin(f * .21) * Math.sin(f * .13);
  L.style.background = `radial-gradient(circle at 86% 4%, rgba(255,255,236,${.98 * glow}) 0, rgba(255,226,140,${.7 * glow}) 9%, rgba(255,190,80,.28) 26%, rgba(255,160,60,0) 52%),
    repeating-conic-gradient(from ${a}deg at 86% 4%, rgba(255,236,170,.16) 0deg 4deg, rgba(255,236,170,0) 4deg 13deg),
    radial-gradient(ellipse at 50% 55%, rgba(255,120,30,0) 50%, rgba(255,120,30,${.18 * k}) 80%, rgba(220,60,20,${.28 * k + .35 * pulse}) 100%)`;
  L.style.mixBlendMode = 'screen'; L.style.opacity = Math.min(1, .55 + .4 * k);
  const V = layer('calorV', ''); V.style.background = `radial-gradient(ellipse at 50% 50%, rgba(120,0,0,0) 55%, rgba(150,10,10,${.45 * pulse}) 100%)`; V.style.opacity = pulse > 0 ? 1 : 0; }
export function calorOff() { if (HZ) { const gl = document.getElementById('gl'); gl.style.filter = ''; gl.style.transform = ''; } ['calor', 'calorV'].forEach(n => { if (LAYER[n]) LAYER[n].style.opacity = 0; }); }
// clarão branco de corte/raio (k 0..1)
export function clarao(k, cor = '#fff') { const L = layer('clarao', ''); L.style.background = cor; L.style.opacity = Math.max(0, Math.min(1, k)); }
export function clima(kind, k = 1) {
  if (kind !== 'calor') calorOff();
  const css = { gelo: 'background:radial-gradient(ellipse at center, rgba(220,235,255,0) 52%, rgba(214,232,255,.55) 78%, rgba(240,248,255,.92) 100%);box-shadow:inset 0 0 120px 30px rgba(230,242,255,.65)',
    sol: 'background:radial-gradient(circle at 88% 6%, rgba(255,250,215,.95) 0, rgba(255,214,120,.55) 14%, rgba(255,190,80,.18) 38%, rgba(255,170,60,0) 60%);mix-blend-mode:screen',
    chuva: 'background:linear-gradient(180deg, rgba(40,55,75,.35), rgba(20,30,45,.25))' };
  Object.keys(css).forEach(n => { layer(n, css[n]).style.opacity = n === kind ? k : 0; }); }

// ---------- SOBRADO visto de fora (EP17): dois andares, janelas no térreo e no andar de cima, telhado, jardim ----------
// fachada = paredes N da linha j = 0 (térreo y = 0, andar de cima y = WALL_H); casa ocupa j < 0. Janelas em i = jan (térreo) e i = janCima.
export function sobrado(x0, z0, o = {}) {
  const C = cena(x0, z0), P = PAR[o.parede || 'siding'], jan = o.jan ?? [-2, 2], cima = o.janCima ?? [0, 3];
  C.chao(PISO.grama, -14, -12, 14, 12, { seed: 4 }); C.chao(PISO.calcada, -1, 1, -1, 6, { y: .025 });
  for (let i = -4; i <= 4; i++) { const w = jan.includes(i), wc = cima.includes(i);
    C.parede('N', P[w ? 4 : 1], i, 0); C.parede('N', P[wc ? 4 : 1], i, 0, { y: WALL_H });
    if (w) vidro(C, i, 0, 'N', 0, i === jan[0] ? o.luz : null); if (wc) vidro(C, i, 0, 'N', WALL_H, o.luzCima); }
  for (let j = -6; j <= -1; j++) { C.parede('W', P[0], 5, j); C.parede('W', P[j === -3 ? 3 : 0], 5, j, { y: WALL_H }); if (j === -3) vidro(C, 5, j, 'W', WALL_H); }
  C.parede('N', P[2], 5, 0); C.parede('N', P[2], 5, 0, { y: WALL_H });
  // casa FECHADA (revisão 22/11): paredes de trás (N em j = -6) e do lado oeste (W em i = -4) nos dois andares, piso do térreo e do 2º andar
  for (let i = -4; i <= 4; i++) { C.parede('N', P[1], i, -6); C.parede('N', P[1], i, -6, { y: WALL_H }); }
  for (let j = -6; j <= -1; j++) { C.parede('W', P[0], -4, j); C.parede('W', P[0], -4, j, { y: WALL_H }); }
  C.parede('N', P[2], -4, -6); C.parede('N', P[2], -4, -6, { y: WALL_H });
  C.chao(PISO.madeira, -4, -6, 4, -1, { y: .02 }); C.chao(PISO.madeira, -4, -6, 4, -1, { y: WALL_H + .02 });
  C.chao(PISO.telhado, -4, -6, 4, -1, { y: WALL_H * 2 + .02, tint: o.tetoTint || '#8a7464' });
  C.obj('fixtures_doors_01_1', -1, 0, { w: .9, d: .2, dz: -.4, h: 2.2 });
  [[-6, 2], [7, 3], [-9, -4], [9, -6]].forEach(([i, j], k) => arvore(C, i, j, 'verao', k));
  [[-3, 1], [1, 1], [4, 1]].forEach(([i, j], k) => C.obj('f_bushes_1_' + [100, 103, 105][k], i, j, { w: .5, d: .5 }));
  for (let i = -8; i <= 8; i++) if (i !== -1) C.parede('N', 'fencing_01_5', i, 7);
  return { C, at: C.at };
}
// cone de luz saindo da janela para fora, no chão (como no jogo: a luz do cômodo se espalha em cone pela janela)
const coneTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 0, 4, 64, 0, 128);
  gr.addColorStop(0, 'rgba(255,214,140,1)'); gr.addColorStop(.55, 'rgba(255,190,110,.45)'); gr.addColorStop(1, 'rgba(255,170,90,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
export function coneLuz(C, i, j, o = {}) { const L = o.len || 4.5, W0 = .9, W1 = o.wide || 4.2; const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([-W0 / 2, 0, 0, W0 / 2, 0, 0, W1 / 2, 0, L, -W1 / 2, 0, L], 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute([.45, 1, .55, 1, 1, 0, 0, 0].map((v, k) => k % 2 ? 1 - v : v), 2)); g.setIndex([0, 2, 1, 0, 3, 2]);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: coneTex, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  m.position.set(C.x(i) - C.G.position.x, .05, C.z(j) - C.G.position.z - .5); C.G.add(m); return m; }
