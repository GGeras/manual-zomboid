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
    if (w) { vidro(C, i, j1 + 1, 'N'); C.parede('N', o.cortina || 'fixtures_windows_curtains_01_9', i, j1 + 1, { off: -.06, tint }); } }
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

// ---------- RUA DE BAIRRO (EP18): estação = 'verao' | 'inverno' | 'chuva' ----------
// estrada ao longo de x nas linhas j = 0..1, calçadas j = -1 e j = 2, jardins e duas casas ao fundo, grama, árvores e postes na frente.
export function rua(x0, z0, est = 'verao') {
  const C = cena(x0, z0), inv = est === 'inverno', chu = est === 'chuva';
  const gr = inv ? PISO.neve : PISO.grama, tA = inv ? '#e9eef6' : chu ? '#a9b2bc' : null, tR = inv ? '#d8dde6' : null;
  C.chao(gr, -16, -14, 16, 12, { seed: 3 });
  C.chao(PISO.asfalto, -16, 0, 16, 1, { y: .02, tint: tA });
  C.chao(PISO.calcada, -16, -1, 16, -1, { y: .025, tint: tR }); C.chao(PISO.calcada, -16, 2, 16, 2, { y: .025, tint: tR });
  C.chao(PISO.calcada, -6, -4, -6, -2, { y: .025, tint: tR }); C.chao(PISO.calcada, 5, -4, 5, -2, { y: .025, tint: tR });   // caminhos até as portas
  const tetoNeve = inv ? '#f4f7fb' : null;
  casaFora(C, -11, -2, -12, -5, { parede: 'siding', janelas: [-9, -4, 'w-7', 'w-10'], tetoTint: tetoNeve, cortina: 'fixtures_windows_curtains_01_25' });
  casaFora(C, 2, 10, -12, -5, { parede: 'tijolo', janelas: [3, 8, 'w-8'], tetoTint: tetoNeve, cortina: 'fixtures_windows_curtains_01_9' });
  // cerquinhas brancas na frente das casas
  for (let i = -11; i <= -2; i++) if (i !== -6) C.parede('N', 'fencing_01_5', i, -1, { tint: tR });
  // árvores (verão: verde cheio; inverno: galhos com neve) e arbustos
  [[-13, -3], [0, -3], [12, -3], [-8, 5], [7, 6], [14, 4], [-15, 7]].forEach(([i, j], k) => arvore(C, i, j, inv ? 'inverno' : 'verao', k));
  const ar = inv ? ['f_bushes_1_28', 'f_bushes_1_29', 'f_bushes_1_30'] : ['f_bushes_1_100', 'f_bushes_1_101', 'f_bushes_1_103', 'f_bushes_1_105'];
  [[-10, -4], [-3, -4], [3, -4], [9, -4], [-3, 4], [3, 4], [10, 3], [-12, 4]].forEach(([i, j], k) => C.obj(ar[k % ar.length], i, j, { w: .6, d: .6 }));
  if (!inv) [[-1, 6], [5, 9], [-6, 8]].forEach(([i, j], k) => C.obj('f_bushes_1_' + (64 + k * 3), i, j, { w: .5, d: .5 }));
  // postes de rua na calçada
  [[-9, 2], [6, 2]].forEach(([i, j]) => C.obj('lighting_outdoor_01_1', i, j, { w: .3, d: .3 }));
  C.obj('street_decoration_01_0', -4, 2, { w: .5, d: .5 });
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
  // cercado C: galinheiro do jogo (HutchDefinitions "hutchhen": base _50 + porta _44, _42 + _45, _43, _41) e DOIS cochos (ração e água)
  [['location_farm_accesories_01_41', 3, 3], ['location_farm_accesories_01_43', 4, 3], ['location_farm_accesories_01_50', 3, 4], ['location_farm_accesories_01_42', 4, 4]]   // portas abertas (sem _44/_45)
    .forEach(([n, i, j]) => C.obj(n, i, j, { w: 1, d: 1 }));   // peças encostadas: sem fresta entre os ladrilhos do galinheiro
  C.obj('location_farm_accesories_01_14', 6, 3); C.obj('location_farm_accesories_01_14', 6, 5); C.obj('farm_01_14', 2, 7, { w: .8, d: .8 });
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
  for (let i = 0; i <= 9; i++) C.parede('N', P[i === winN ? 4 : 1], i, 0);
  for (let j = 0; j <= 7; j++) C.parede('W', P[j === winW ? 3 : 0], 0, j);
  C.parede('N', P[2], 0, 0);
  // lado de fora da janela N: grama, cerca e árvore (aparecem pelo vão)
  for (let i = -3; i <= 12; i++) C.parede('N', 'fencing_01_5', i, -5);
  arvore(C, 2, -4, 'verao', 0); arvore(C, 8, -6, 'verao', 1); C.obj('f_bushes_1_101', 4, -2, { w: .6, d: .6 });
  // cozinha (fundo à direita): geladeira, fogão, balcões com pia
  C.obj('appliances_refrigeration_01_0', 9, 1, { w: .85, d: .85 }); C.obj('appliances_cooking_01_12', 8, 1); C.obj('fixtures_counters_01_40', 7, 1); C.obj('fixtures_counters_01_41', 6, 1);
  C.obj('fixtures_sinks_01_0', 7, 1, { w: .6, d: .6, h: 1.05 });
  C.obj('furniture_tables_high_01_8', 7, 4); C.obj('furniture_seating_indoor_01_56', 7, 5); C.obj('furniture_seating_indoor_01_58', 8, 4);
  // sala: sofá, poltrona, TV, estante, abajur, planta
  C.obj('furniture_seating_indoor_01_9', 1, 5); C.obj('furniture_seating_indoor_01_8', 1, 4);
  if (!o.janelaLivre) { C.obj('appliances_television_01_0', 4, 1, { w: .7, d: .7 }); C.obj('vegetation_indoor_01_0', 5, 1, { w: .5, d: .5 }); } else { C.obj('appliances_television_01_0', 5, 2, { w: .7, d: .7 }); }
  C.obj('furniture_storage_01_12', 2, 1); C.obj('furniture_shelving_01_40', 1, 1); C.obj('lighting_indoor_01_0', 1, 3, { w: .4, d: .4 });
  return { C, at: C.at, P };
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
export const VEL = { s_walk: 1.35, s_walkslow: .75, z_walk: .55 };

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
export function clima(kind, k = 1) {
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
  C.chao(PISO.telhado, -4, -6, 4, -1, { y: WALL_H * 2 + .02, tint: o.tetoTint });
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
