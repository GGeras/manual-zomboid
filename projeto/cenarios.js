// cenarios.js — lugares completos montados com os sprites ORIGINAIS do jogo (tiles.js).
// Regra do canal (revisão 2026-11-20): lugar nunca vazio — rua com casas, árvores, grama e postes; casa com móveis e eletrodomésticos;
// fazenda com cercados, feno e cocho. Cada função devolve { C (cena), pontos úteis }. Chame .show() na cena do episódio.
import { THREE, PZ, prop, box, mat, U } from './engine.js';
import { cena, tileLuz, WALL_H, PX_Y } from './tiles.js';
export { tileLuz, WALL_H };
const { R, clamp, lerp, T } = U;
const n4 = (p, ids) => ids.map(i => p + i);
export const PISO = {
  grama: n4('blends_natural_01_', [16, 21, 22, 23]), gramaSeca: n4('blends_natural_01_', [32, 37, 38, 39]), terra: n4('blends_natural_01_', [64, 69, 70, 71]),
  neve: n4('e_newgrassbase_snow_1_', [16, 21, 22, 23]), asfalto: n4('floors_exterior_street_01_', [0, 1, 2, 3, 4, 5]), calcada: n4('floors_exterior_tilesandstone_01_', [0, 1, 2]),
  madeira: ['floors_interior_tilesandwood_01_42'], cozinha: ['floors_interior_tilesandwood_01_0'], telhado: ['floors_exterior_street_01_16'],
};
// paredes do jogo: [W, N, canto, janela W, janela N] (walls_*_house_01: cada grupo de 16 tem duas cores)
const PAR = { tora: [0, 1, 2, 9, 8].map(i => 'walls_logs_' + i), siding: [32, 33, 34, 40, 41].map(i => 'walls_exterior_house_01_' + i), tijolo: [4, 5, 6, 12, 13].map(i => 'walls_exterior_house_01_' + i),
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
export function rua(x0, z0, est = 'verao', o = {}) {   // o.postes = posição dos postes (EP22: o da calçada da frente passava na frente do personagem)
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
  (o.postes ?? [[-9, 2], [6, 2]]).forEach(([i, j]) => C.obj('lighting_outdoor_01_1', i, j, { w: .3, d: .3 }));
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
  [['floors_rugs_01_6', 2, 4], ['floors_rugs_01_7', 3, 4], ['floors_rugs_01_0', 2, 5], ['floors_rugs_01_1', 3, 5]].forEach(([n, i, j]) => C.chao(n, i, j, i, j, { y: .03 }));   // tapete 2×2 inteiro (4 peças do jogo)
  const winN = o.janelaN ?? 3, winW = o.janelaW ?? 3;
  const win2 = o.janelaN2 ?? -1;   // 2ª janela na parede do fundo (cozinha), opcional
  for (let i = 0; i <= 9; i++) C.parede('N', P[i === winN || i === win2 ? 4 : 1], i, 0);
  const porta = o.completa ? 6 : -1;   // casa completa: porta de madeira (batente + porta do jogo) na parede W
  for (let j = 0; j <= 7; j++) C.parede('W', j === porta ? 'walls_interior_house_01_46' : P[j === winW ? 3 : 0], 0, j);
  C.parede('N', P[2], 0, 0);
  // REGRA 4.8 (25/11, Jose): TODO vão de janela na parede ganha a JANELA (caixilho do jogo) e a cortina — nunca fica só o buraco
  [winN, win2].filter(i => i >= 0).forEach(i => { C.parede('N', 'fixtures_windows_01_17', i, 0, { off: .02 }); C.parede('N', 'fixtures_windows_curtains_01_30', i, 0, { off: .035 }); });
  if (winW >= 0) { C.parede('W', 'fixtures_windows_01_16', 0, winW, { off: .02 }); C.parede('W', 'fixtures_windows_curtains_01_28', 0, winW, { off: .035 }); }
  // lado de fora da janela N: grama, cerca e árvore (aparecem pelo vão)
  for (let i = -3; i <= 12; i++) C.parede('N', 'fencing_01_5', i, -5);
  arvore(C, 2, -4, 'verao', 0); arvore(C, 8, -6, 'verao', 1); C.obj('f_bushes_1_101', 4, -2, { w: .6, d: .6 });
  // REGRA 4.4 (22/11): móvel ENCOSTADO na parede e com o desenho virado para dentro do cômodo (frente S na parede N, frente E na parede W).
  // Linha j = 0 encosta na parede N; coluna i = 0 encosta na parede W. Janelas (N em winN e win2, W em winW) ficam livres.
  // cozinha (fundo à direita): bancada com pia, [janela], fogão, geladeira — todos de frente para o cômodo (S)
  const livreN = i => i === winN || i === win2;
  [[6, 'fixtures_counters_01_45'], [7, 'fixtures_counters_01_45'], [8, 'appliances_cooking_01_13'], [9, 'appliances_refrigeration_01_1']].forEach(([i, n]) => {
    if (!livreN(i)) C.obj(n, i, 0, n.includes('refrigeration') ? { w: .85, d: .85 } : {}); });
  // o.pia = sprite de pia DE BANCADA (mesmo ladrilho e mesma âncora da bancada: assenta no tampo como no jogo; EP22, 25/11 — a _1 é pia de banheiro e sobrava para fora)
  if (!livreN(6)) { if (o.pia) C.obj(o.pia, 6, 0, { w: .96, d: .96 }); else C.obj('fixtures_sinks_01_1', 6, 0, { w: .6, d: .6, h: 1.05 }); }
  // mesa da cozinha com cadeiras viradas PARA a mesa (ao sul da mesa = frente N; a leste = frente W)
  C.obj('furniture_tables_high_01_29', 7, 4); C.obj('furniture_seating_indoor_01_58', 7, 5); C.obj('furniture_seating_indoor_01_59', 8, 4);   // mesa de 1 ladrilho INTEIRA (a _8 era só um canto: ficava cortada)
  // sala: estante e cômoda na parede N (frente S), TV na parede N, duas poltronas na parede W (frente E), abajur, planta, tapete
  C.obj('furniture_shelving_01_40', 0, 0); C.obj('furniture_storage_01_13', 1, 0);
  // vaso de planta EM CIMA da cômoda (mesmo ladrilho, caixa um pouco maior: não briga com a da cômoda) — antes flutuava ao lado dela
  if (!o.janelaLivre && !livreN(1)) C.obj('vegetation_indoor_01_0', 1, 0, { w: .96, d: .96 });
  // TV em cima de uma mesinha (no chão ela parecia caída)
  // o.rackTV = TV no rack do jogo (EP22, 25/11): a TV já é desenhada na altura de apoio; só sobe 7 px do desenho para assentar no meio do tampo
  if (!livreN(5)) { if (o.rackTV) { C.obj('furniture_tables_low_01_13', 5, 0, { w: .96, d: .96 }); C.obj('appliances_television_01_1', 5, 0, { w: .96, d: .96, dy: 7 * PX_Y }); }
    else { const TV = C.obj('furniture_tables_high_01_12', 5, 0, { w: .8, d: .8 }); C.obj('appliances_television_01_1', 5, 0, { w: .7, d: .7, dy: TV.userData.h * .86 }); } }
  if (!o.completa) C.placa('lighting_indoor_01_on_58', 0, 2, { fz: .2, solida: true });   // 25/11: abajur de pé = placa (sprite inteiro); antes era o interruptor (lighting_indoor_01_0) em pé no chão
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
    C.placa('lighting_indoor_01_on_58', 0, 1, { fz: .2, solida: true });   // 25/11: placa (antes a caixa de .35 cortava a base e a cúpula — EP23/EP24)
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
  // noite: o.lua = luar azulado entrando pela janela (EP20); sem o.lua a janela fica escura
  const lua = gradTex((x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(170,200,255,1)'); g.addColorStop(.55, 'rgba(140,175,240,.5)'); g.addColorStop(1, 'rgba(120,160,230,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,.85)'; x.fillRect(w / 2 - 5, 0, 10, h); x.fillRect(0, h * .42, w, 9); x.fillRect(0, 0, 14, h); x.fillRect(w - 14, 0, 14, h); });
  (o.janelas || []).forEach(([lado, n]) => { if (noite && !o.lua) return;
    // facho deitado no chão saindo da janela para dentro do cômodo, inclinado pelo sol da tarde
    const g = new THREE.PlaneGeometry(1, 1); const P = g.attributes.position, L = 2.6, sk = .9;
    for (let v = 0; v < 4; v++) { const u = P.getX(v) + .5, far = P.getY(v) < 0 ? 1 : 0;   // far = longe da janela
      if (lado === 'N') P.setXYZ(v, X(n) - .42 + u * .84 + far * sk, .045, Z(0) - .5 + far * L);
      else P.setXYZ(v, X(0) - .5 + far * L, .045, Z(n) - .42 + u * .84 + far * sk); }
    P.needsUpdate = true; const m = new THREE.Mesh(g, addMat(noite ? lua : sol, .5)); G.add(m); parts.push(m);
    // poeira dentro do facho
    const N = 70, pos = new Float32Array(N * 3), dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: noite ? '#cfe0ff' : '#ffe8c0', size: .035, transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending }));
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
    off() { if (vin) vin.style.opacity = 0; },
    // liga/desliga tudo desta luz (duas luzes no mesmo cômodo: noite com abajur e manhã com sol — EP20)
    mostrar(on) { parts.forEach(p => { p.visible = on; }); if (lamp) [lamp.chao, lamp.parede, lamp.pl].forEach(m => { m.visible = on; }); } };
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

// ---------- FLORESTA (EP21, 24/11): mato do jogo para a coleta — só UMA camada de chão (sem asfalto embaixo: o chão não pisca) ----------
// Sprites originais (Tiles2x.pack): relva blends_natural_01 (+ manchas de terra), árvores e_americanlinden/e_canadianhemlock/e_virginiapine/e_riverbirch
// (tronco + copa da estação), arbustos f_bushes_1_108–122, moitas de capim e_newgrass_1, plantas rasteiras d_plants_1, pedras/tronco caído/galhos d_generic_1.
// Clareira no meio (onde ele procura); árvores em volta e mais densas no fundo, como a floresta do jogo. o.livre = ladrilhos que ficam vazios.
export const ARBUSTO = ['f_bushes_1_108', 'f_bushes_1_111', 'f_bushes_1_113', 'f_bushes_1_114', 'f_bushes_1_117', 'f_bushes_1_119', 'f_bushes_1_120', 'f_bushes_1_121', 'f_bushes_1_122'];
export function floresta(x0, z0, o = {}) {
  const C = cena(x0, z0), R = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  C.chao(PISO.grama, -16, -16, 16, 16, { seed: 21 });
  // (sem manchas de terra em ladrilho: no mato do jogo o chão é relva contínua; a terra em losango ficava artificial)
  // variação de porte (tamanho) e espelhamento (a árvore é um sprite de frente para a câmera; "rotação" = virar o sprite) por árvore, com semente fixa (prévia sempre igual)
  const varia = (m, s) => { const esc = .82 + R(s) * .4; m.scale.set(esc * (R(s + 50) < .5 ? -1 : 1), esc, 1); };
  const tronco = (n, i, j, verde, s = 0) => { const m1 = C.placa(`e_${n}_1_3`, i, j); varia(m1, s);
    if (verde) { const m2 = C.placa(`e_${n}_1_${verde}`, i, j, { fz: .55 }); varia(m2, s); } };
  // árvores: fundo (N e W da clareira) bem fechado; lados abertos; nada entre a câmera e o personagem.
  // 24/11 (pedido do Jose, EP21 v4): bem mais árvores, em profundidades diferentes (perto/meio/fundo), posição com leve jitter (menos "grade")
  const AR = [[-7, -6], [-4, -8], [-1, -7], [2, -8], [5, -6], [8, -8], [-9, -2], [-8, 2], [-10, 5], [9, -3], [-6, -10], [0, -11], [4, -11], [-12, -4], [11, -7], [7, 7], [-6, 8],
    // fundo mais fechado
    [-3, -9], [1, -10], [6, -9], [-11, -8], [10, -9], [-8, -9], [3, -11], [-13, 2], [12, -2], [-11, 8], [10, 6], [13, -5],
    // meio, mais esparsas e perto das bordas, sem tapar o personagem nem o loot (zona central ±2 livre)
    [-6, 4], [6, -4], [-9, -5], [8, 4], [-4, 7], [5, 8], [-10, -2], [9, 1],
    // perto (frente, cantos — longe do centro de câmera)
    [-11, 7], [11, 5], [-7, -3], [7, 9]];
  AR.forEach(([i, j], k) => { const s = k * 7 + 1, ii = i + (R(s + 20) - .5) * 1.1, jj = j + (R(s + 30) - .5) * 1.1, t = k % 4;
    if (t === 0) tronco('americanlinden', ii, jj, k % 8 ? 15 : 14, s); else if (t === 1) { const m = C.placa('e_canadianhemlock_1_' + (k % 3 ? 3 : 2), ii, jj); varia(m, s); }
    else if (t === 2) { const m = C.placa('e_virginiapine_1_' + (k % 3 ? 3 : 2), ii, jj); varia(m, s); } else tronco('riverbirch', ii, jj, 15, s); });
  // arbustos espalhados (caixa baixa: quem passa atrás some atrás); posição e tamanho com leve jitter (menos "grade", 24/11 pedido do Jose)
  const livre = new Set((o.livre || []).map(([i, j]) => i + ',' + j));
  [[-5, -3], [-3, -5], [3, -4], [6, -2], [-6, 1], [5, 3], [-4, 5], [8, 1], [-2, -4], [1, -5], [7, -4], [-8, -5], [-7, 2], [2, 5], [-1, -6], [6, 3]].forEach(([i, j], k) => {
    if (livre.has(i + ',' + j)) return; const s = k * 11 + 3, esc = .85 + R(s) * .5;
    C.obj(ARBUSTO[k % ARBUSTO.length], i + (R(s + 5) - .5) * .4, j + (R(s + 6) - .5) * .4, { w: .6 * esc, d: .6 * esc }); });
  // capim alto, plantas rasteiras, pedras, galhos e um tronco caído (sprites em pé, de frente para a câmera)
  for (let k = 0; k < 100; k++) { const i = Math.round((R(k) - .5) * 28), j = Math.round((R(k + 99) - .5) * 28); if (livre.has(i + ',' + j) || (Math.abs(i) < 2 && Math.abs(j) < 2)) continue;
    const n = k % 5 === 0 ? 'd_plants_1_' + [28, 29, 32, 33, 44, 45, 61, 62][k % 8] : 'e_newgrass_1_' + [40, 41, 42, 43, 16, 17, 18, 64, 65, 66][k % 10];
    C.placa(n, i + (R(k + 7) - .5) * .5, j + (R(k + 3) - .5) * .5); }
  [[-3, 3, 34], [4, -1, 35], [-5, -1, 51], [2, 6, 54], [6, 5, 34], [-7, 4, 35]].forEach(([i, j, n]) => C.placa('d_generic_1_' + n, i, j));
  [[3, 1, 20], [-4, -2, 24], [1, -3, 21], [-6, 6, 42]].forEach(([i, j, n]) => C.placa('d_generic_1_' + n, i, j));
  // ---- EP21 v5 (24/11, pedido do Jose: floresta menos "superficial") — só sprites originais já no repo ----
  const perto = (i, j, r) => Math.hypot(i, j) < r || livre.has(Math.round(i) + ',' + Math.round(j));
  // anel externo de árvores (profundidade: o fundo nunca fica vazio)
  for (let k = 0; k < 34; k++) { const a = k / 34 * Math.PI * 2 + R(k + 400) * .3, r = 13 + R(k + 410) * 3.5, ii = Math.cos(a) * r, jj = Math.sin(a) * r, s = k * 13 + 500;
    if (ii > 9 && jj > 6) continue;   // canto da câmera aberto
    const t = k % 4; if (t === 0) tronco('americanlinden', ii, jj, 15, s); else if (t === 1) { const m = C.placa('e_canadianhemlock_1_' + (k % 2 ? 3 : 2), ii, jj); varia(m, s); }
    else if (t === 2) { const m = C.placa('e_virginiapine_1_' + (k % 2 ? 3 : 2), ii, jj); varia(m, s); } else tronco('riverbirch', ii, jj, 15, s); }
  // sub-bosque: muitos arbustos de todas as espécies do jogo, em touceiras (2–4 juntos), longe da área de busca (raio 4,5)
  const ARB2 = ['f_bushes_1_28', 'f_bushes_1_29', 'f_bushes_1_30', 'f_bushes_1_64', 'f_bushes_1_67', 'f_bushes_1_70', 'f_bushes_1_96', 'f_bushes_1_100', 'f_bushes_1_101', 'f_bushes_1_103', 'f_bushes_1_105', ...ARBUSTO];
  for (let g = 0; g < 16; g++) { const a = R(g + 600) * Math.PI * 2, r = 5 + R(g + 610) * 7, gi = Math.cos(a) * r, gj = Math.sin(a) * r, n = 2 + Math.floor(R(g + 620) * 3);
    for (let k = 0; k < n; k++) { const ii = gi + (R(g * 9 + k + 630) - .5) * 1.8, jj = gj + (R(g * 9 + k + 640) - .5) * 1.8; if (perto(ii, jj, 4.5)) continue;
      const esc = .7 + R(g * 9 + k + 650) * .55; C.obj(ARB2[(g * 3 + k) % ARB2.length], ii, jj, { w: .55 * esc, d: .55 * esc }); } }
  // capim e plantas em manchas (relva densa onde não se anda; mais rala perto da clareira)
  for (let g = 0; g < 40; g++) { const gi = (R(g + 700) - .5) * 30, gj = (R(g + 710) - .5) * 30, n = 4 + Math.floor(R(g + 720) * 6);
    for (let k = 0; k < n; k++) { const ii = gi + (R(g * 11 + k + 730) - .5) * 2.2, jj = gj + (R(g * 11 + k + 740) - .5) * 2.2; if (perto(ii, jj, 2.2)) continue;
      const q = (g + k) % 7, nm = q === 0 ? 'd_plants_1_' + [28, 29, 32, 33, 44, 45, 61, 62][(g + k) % 8] : 'e_newgrass_1_' + [40, 41, 42, 43, 16, 17, 18, 64, 65, 66][(g * 3 + k) % 10];
      const m = C.placa(nm, ii, jj); if (m) m.scale.multiplyScalar(.8 + R(g * 11 + k + 750) * .45); } }
  // vida no ar: folhas caindo e pólen/insetos brilhando na luz (efeito leve; não cobre o personagem)
  const N = 90, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), cor = [new THREE.Color('#c8a040'), new THREE.Color('#9fbf4a'), new THREE.Color('#fff2b0')];
  for (let k = 0; k < N; k++) cor[k % 3].toArray(col, k * 3);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const AR2 = prop(new THREE.Points(geo, new THREE.PointsMaterial({ size: 5, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: .85, depthWrite: false }))); AR2.frustumCulled = false;
  const vida = (f, k = 1) => { AR2.visible = k > .02; AR2.material.opacity = .85 * k; const c0 = C.at(0, 0);
    for (let n = 0; n < N; n++) { const r1 = R(n + 900), r2 = R(n + 910), r3 = R(n + 920), folha = n % 3 !== 2, t = f / 30;
      const y = folha ? 3.2 - ((t * (.35 + r3 * .3) + r1 * 3.2) % 3.2) : .4 + (Math.sin(t * .9 + n) * .5 + .5) * 1.4;
      const x = c0.x + (r1 - .5) * 14 + Math.sin(t * (folha ? 1.3 : .6) + n) * (folha ? .35 : .5), z = c0.z + (r2 - .5) * 14 + Math.cos(t * .8 + n * 1.7) * (folha ? .25 : .5);
      pos[n * 3] = x; pos[n * 3 + 1] = y; pos[n * 3 + 2] = z; }
    geo.attributes.position.needsUpdate = true; };
  return { C, at: C.at, vida };
}
// arbusto de frutinha do jogo: arbusto verde (f_bushes_1_117) + camada de frutinhas azuis por cima (f_bushes_1_95), um pouco maior para ficar na frente
export function arbustoFruta(C, i, j) { const b = C.obj('f_bushes_1_117', i, j, { w: .62, d: .62 }); const f = C.obj('f_bushes_1_95', i, j, { w: .66, d: .66, h: b.userData.h + .01 }); return { b, f }; }

// ---------- QUARTO (EP20, 24/11): cama do jogo encostada na parede N, guarda-roupa, abajur de pé, cadeira, tapete, janela com cortina, porta ----------
// Cama de 2 ladrilhos (furniture_bedding_01_9 = cabeceira na borda N, _8 = pé ao sul). Colchão na altura das animações do jogo:
// Bob_Asleep deita com o ponto mais baixo do corpo a 0,62–0,64 (≈ altura da cama do jogo); deitado = apoiar no colchão (o corpo fica EM CIMA, regra 4.7).
export const COLCHAO = .62;
export function quarto(x0, z0, o = {}) {
  const C = cena(x0, z0), P = PAR.bege, porta = 4, jan = 4;
  C.chao(PISO.grama, -8, -8, 14, 14, { seed: 5 });
  C.chao(PISO.madeira, 0, 0, 6, 5, { y: .02 });
  // tapete 2×2 do jogo: 4 peças diferentes (cantos NW/NE/SW/SE) formam UM tapete — antes era a mesma peça repetida e aparecia a borda de cada ladrilho
  [['floors_rugs_01_6', 2, 2], ['floors_rugs_01_7', 3, 2], ['floors_rugs_01_0', 2, 3], ['floors_rugs_01_1', 3, 3]].forEach(([n, i, j]) => C.chao(n, i, j, i, j, { y: .03 }));
  for (let i = 0; i <= 6; i++) C.parede('N', P[i === jan ? 4 : 1], i, 0);
  for (let j = 0; j <= 5; j++) C.parede('W', j === porta ? 'walls_interior_house_01_46' : P[0], 0, j);
  C.parede('N', P[2], 0, 0);
  for (let i = 0; i <= 6; i++) C.parede('N', 'walls_interior_detailing_01_33', i, 0, { off: .012 });
  for (let j = 0; j <= 5; j++) if (j !== porta) C.parede('W', 'walls_interior_detailing_01_32', 0, j, { off: .012 });
  const PORTA = C.parede('W', 'fixtures_doors_01_4', 0, porta, { off: .02 });
  C.parede('N', 'fixtures_windows_01_17', jan, 0, { off: .02 });   // regra 4.8: o vão da janela leva a janela
  C.parede('N', o.cortinaAberta ? 'fixtures_windows_curtains_01_30' : 'fixtures_windows_curtains_01_26', jan, 0, { off: .035 });
  C.parede('N', 'walls_decoration_01_41', 1, 0, { off: .015 }); C.parede('W', 'walls_decoration_01_52', 0, 1.5, { off: .015 });
  for (let i = -3; i <= 10; i++) C.parede('N', 'fencing_01_5', i, -5);
  arvore(C, 3, -4, 'verao', 0); arvore(C, 7, -6, 'verao', 1);
  // cama: cabeceira (assento com encosto N) + pé; colchão na altura do jogo
  // altura do colchão = a do próprio desenho do pé da cama (caixa automática); a cabeceira usa a mesma altura → as duas peças casam
  const [CBC, CPE] = o.cama || ['furniture_bedding_01_9', 'furniture_bedding_01_8'];   // o.cama = [cabeceira, pé] (EP20 v4: cama boa de madeira 27/26)
  // 24/11 (Jose: "cama rachada no meio"): as duas caixas vão até a junta (j = 0,5) — antes sobrava 0,1 entre elas e o desenho "quebrava" ao meio
  // o.sacos (EP25, 25/11): sem cama de verdade — quarto triste com sacos de dormir no chão (o chamador põe os sacos)
  const PE = o.sacos ? { sobrepor() {}, userData: { h: .1 } } : C.obj(CPE, 2, 1, { d: 1.0, dz: -.03 }), colchao = PE.userData.h, CAMA = o.sacos ? { sobrepor() {} } : C.assento(CBC, 2, 0, { encosto: 'N', hs: colchao, d: 1.0, dz: .05 });
  C.obj('furniture_storage_02_33', 5, 0, { w: .9, d: .7 });                 // guarda-roupa encostado na parede N (frente S)
  // abajur de pé ao lado da cabeceira (placa: sprite inteiro). o.abajurAceso (EP22, 25/11): como no jogo — peça sólida (_58) + camada de luz (_on_58) por cima
  if (o.abajurAceso) { C.placa('lighting_indoor_01_58', 1, 0, { fz: .2 }); C.placa('lighting_indoor_01_on_58', 1, 0, { fz: .21, op: .999 }); }
  else C.placa('lighting_indoor_01_on_58', 1, 0, { fz: .2, solida: true });
  const CAD = C.assento('furniture_seating_indoor_01_57', 5, 3, { encosto: 'N', hs: .486 }); if (o.semCadeira) CAD.visible = false;   // cadeira solta no meio do quarto (EP22/24): some   // cadeira (frente S) — Bob_SatChair: nádega a 0,486
  const cama = { sobrepor: on => { CAMA.sobrepor(on); PE.sobrepor(on); } };
  return { C, at: C.at, cama, cadeira: CAD, porta: PORTA, colchao };
}

// ---------- HORTA (EP25): horta cercada atrás de casa rural — tudo sprite do jogo (B42.22) ----------
// Casa de madeira ao fundo (parede N em j = -5), quintal de grama, horta com cerca branca (fencing_01_4/5, portão aberto em i = 0 na frente),
// 4 canteiros (vegetation_farming_01: o mesmo desenho do jogo para cada planta e estágio): tomate (escora), batata, repolho, cenoura.
// Galpão de ferramentas (location_farm_accesories_01_42), barril de chuva com lona (carpentry_02_122), compostor (carpentry_02_117), espantalho.
// Fora da cerca: capim alto (e_newgrass_1 24–29 / 48–51). Estado de cada canteiro: H.planta(nome, 'ok'|'unhealthy'|'dying'|'dead', estágio).
// o.mato = ervas daninhas nos canteiros (e_newgrass_1 40–43, como no jogo: mato = capim no mesmo quadrado). o.inverno = grama com neve.
const HORTA_SPR = { tomate: 64, batata: 40, repolho: 16, cenoura: 32 };   // primeiro sprite de cada planta (farming_vegetableconf_vegetables_sprites.lua)
export function horta(x0, z0, o = {}) {
  const C = cena(x0, z0), inv = !!o.inverno, tn = inv ? '#e6ecf4' : null;
  C.chao(inv ? PISO.neve : PISO.grama, -22, -22, 22, 22, { seed: 25 });
  casaFora(C, -10, 5, -15, -9, { parede: 'tora', janelas: [-6, 3, 'w-12'], tetoTint: inv ? '#f4f7fb' : '#c8a47c', cortina: 'fixtures_windows_curtains_01_10' });
  C.chao(['blends_natural_01_96', 'blends_natural_01_101', 'blends_natural_01_102', 'blends_natural_01_103'], -4, -4, 4, 3, { y: .018, seed: 4, tint: inv ? '#c9c4bd' : null });   // chão de terra dentro da cerca
  // cerca de estacas branca (portão aberto na frente, i = 0)
  for (let i = -4; i <= 4; i++) { C.parede('N', 'fencing_01_5', i, -4, { tint: tn }); if (i !== 0) C.parede('N', 'fencing_01_5', i, 4, { tint: tn }); }
  for (let j = -4; j <= 3; j++) { C.parede('W', 'fencing_01_4', -4, j, { tint: tn }); C.parede('W', 'fencing_01_4', 5, j, { tint: tn }); }
  // canteiros: 2 quadrados por planta (colunas), fileiras j = -2 e 1
  const POS = { tomate: [[-3, -2], [-2, -2]], batata: [[0, -2], [1, -2]], repolho: [[-3, 1], [-2, 1]], cenoura: [[0, 1], [1, 1]] };
  const est = o.estagio || {}, P = {};
  for (const nome in POS) { P[nome] = POS[nome].map(([i, j]) => {
    const v = {}, base = HORTA_SPR[nome], st = est[nome] ?? 5;
    v.ok = C.placa('vegetation_farming_01_' + (base + st), i, j, { fz: .2 });
    const k = base + 4;   // estágio adulto nos desenhos unhealthy/dying/dead
    for (const s of ['unhealthy', 'dying', 'dead']) { v[s] = C.placa(`vegetation_farming_${s}_01_${k}`, i, j, { fz: .2 }); v[s].visible = false; }
    v.solo = C.placa('vegetation_farming_01_1', i, j, { fz: .15 }); v.solo.visible = false;   // terra arada (antes de plantar)
    return v; }); }
  // mato nos canteiros (opcional, ligado/desligado por cena)
  const MATO = [[-3, -2], [0, 1], [1, -2], [-2, 1]].map(([i, j], k) => { const m = C.placa('e_newgrass_1_' + (40 + k), i + .25, j + .2, { fz: .3 }); m.visible = !!o.mato; return m; });
  // galpão de ferramentas, barril de chuva, compostor, espantalho
  C.placa('location_farm_accesories_01_114', -7, -5, { fz: .5, tint: tn });   // galpão de ferramentas, fora da cerca, encostado no quintal
  C.obj('carpentry_02_122', -3, 3, { w: .55, d: .55, tint: tn }); C.obj('carpentry_02_117', 3, 3, { w: .9, d: .9, tint: tn });
  C.placa('location_farm_accesories_01_36', 3, -3, { fz: .3 });
  // capim alto fora da cerca + árvores
  const CAP = [24, 25, 26, 27, 28, 29, 48, 49, 50, 51];
  for (let k = 0; k < 90; k++) { const a = k * 2.399, r = 6 + (k % 7) * 1.1, i = Math.round(Math.cos(a) * r), j = Math.round(Math.sin(a) * r * .8 + 2);
    if (j < -8 || (i >= -8 && i <= -6 && j >= -6 && j <= -4) || (Math.abs(i) <= 5 && j >= -5 && j <= 5)) continue; const m = C.placa('e_newgrass_1_' + CAP[k % CAP.length], i, j, { fz: .4, tint: tn }); if (inv) m.visible = false; }   // inverno: capim coberto de neve (o jogo esconde a relva)
  // mais grama: tufos curtos em volta da casa, do galinheiro e junto da cerca
  if (!inv) for (let i = -12; i <= 8; i++) for (const j of [-8, -4, 5, 6]) { if (Math.abs(i) <= 5 && j >= -4 && j <= 5) continue; if ((i * 7 + j * 3) % 3) C.placa('e_newgrass_1_' + CAP[Math.abs(i * 5 + j) % CAP.length], i + .3, j + .2, { fz: .35 }); }
  [[-12, -4], [11, -6], [-11, 7], [12, 8]].forEach(([i, j], k) => arvore(C, i, j, inv ? 'inverno' : 'verao', k));
  const H = { C, at: C.at, P, MATO,
    planta(nome, s = 'ok', solo = false) { (nome === '*' ? Object.keys(P) : [nome]).forEach(n => P[n].forEach(v => { for (const k of ['ok', 'unhealthy', 'dying', 'dead']) v[k].visible = !solo && k === s; v.solo.visible = solo; })); return H; },
    mato(on) { MATO.forEach(m => { m.visible = on; }); return H; },
    canteiro: nome => C.at(...POS[nome][0]) };
  return H;
}
