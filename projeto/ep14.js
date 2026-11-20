import { THREE, PZ, scene, pose, S, light, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { fire } from './sets.js';
import { casaDentro, arvore, camOn, clima, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// EP14 v2 (revisão 2026-11-20 aplicada aos finais): casa mobiliada com os sprites do jogo (cozinha com geladeira, fogão e balcões)
// e o quintal da MESMA casa para a fogueira. Sem o cenário antigo (sets.js house), que piscava verde no chão (dois pisos brigando).
// Animações ORIGINAIS: acender o fogo (Bob_LightFire), mexer ajoelhado (Bob_IdleMakingLow), mexer abaixado (Bob_IdleLooting_Low),
// comer sentado na cadeira do jogo (Bob_SatChair + Bob_IdleEatingFromBowl). Nada de pose agachada inventada que afundava no chão.
const CASA = casaDentro(-60, 80), C = CASA.C;
// quintal: fogueira na grama na frente da casa, cadeira do jogo ao lado, árvores
const FI = 4.2, FJ = 10.4, FX = C.x(FI), FZ = C.z(FJ);
const CHAIR = C.assento('furniture_seating_indoor_01_56', FI - 1.6, FJ + .4, { encosto: 'W' }); const SEAT = C.at(FI - 1.6, FJ + .4);
arvore(C, 9, 12, 'verao', 0); arvore(C, -2, 13, 'verao', 1); C.obj('f_bushes_1_101', 7, 9.4, { w: .5, d: .5 }); C.obj('f_bushes_1_103', 0, 9.2, { w: .5, d: .5 });
const POT = PZ.itemModel('cookingpot'); POT.visible = false; scene.add(POT);
const potOn = (y = .42) => { POT.visible = true; POT.position.set(FX, y, FZ); };
const BOWL = new THREE.Group(); { const b = new THREE.Mesh(new THREE.CylinderGeometry(.09, .06, .06, 14), new THREE.MeshLambertMaterial({ color: '#d8d0c0' })); BOWL.add(b); } PZ.attach(S, 'Bip01_Prop2', BOWL);
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false; BOWL.visible = !!o.bowl; };
const steam = (lf, col = '#e8e8e8', op = .45, n = 4) => { for (let i = 0; i < n; i++) puff(FX, .7, FZ, (lf + i * 8) % 32, { n: 2, seed: i, life: 32, size: .16, rise: .9, color: col, op }); };
const yard = (f, kind = 'dawn') => { light(kind); tileLuz(kind === 'dawn' ? '#f4dcc4' : '#ffffff'); clima('', 0); C.show(); fire(FX, FZ, f); };
// ajoelhado ao lado da fogueira, de frente para ela
const NEAR = { x: FX - .85, z: FZ + .55 }; const atFire = (name, lf, o = {}) => clip(name, lf, Object.assign({ x: NEAR.x, z: NEAR.z, ry: face(NEAR.x, NEAR.z, FX, FZ) }, o));
const camYard = (c, h, lf, len) => camOn(c, FX - .5, FZ + .3, lerp(h, h - .5, easeOut(lf / len)), .74);
const K = C.at(7.6, 2.3);   // na cozinha, de frente para o fogão/balcão
run([
  // 0 — achou a comida (cozinha mobiliada)
  (lf, f, len, c) => { light('day'); tileLuz('#ffffff'); clima('', 0); C.show(); clip('s_lootlow', lf, { x: K.x, z: K.z, ry: Math.PI * .95 }); camOn(c, K.x, K.z, lerp(7.4, 6.8, lf / len)); },
  // 1 — fogão elétrico sem energia: cozinha escura
  (lf, f, len, c) => { light('dark'); tileLuz('#59617a'); clima('', 0); C.show(); clip('s_idle', lf, { x: K.x, z: K.z, ry: Math.PI * .95 }); camOn(c, K.x, K.z, 7.2); },
  // 2 — fogo de verdade: acende a fogueira
  (lf, f, len, c) => { yard(f); atFire('s_lightfire', lf); camYard(c, 6.6, lf, len); },
  // 3 — carne crua: cozinha antes (panela no fogo, mexendo ajoelhado)
  (lf, f, len, c) => { yard(f); potOn(); atFire('s_makinglow', lf); steam(lf); camYard(c, 6.2, lf, len); },
  // 4 — panela: ensopado
  (lf, f, len, c) => { yard(f); potOn(); atFire('s_makinglow', lf + 7); steam(lf); camYard(c, 6.2, lf, len); },
  // 5 — esqueceu: queimou (fumaça preta), ele longe do fogo
  (lf, f, len, c) => { const b = sm((lf - 40) / 50); yard(f); potOn(); const p = C.at(FI - 1.9, FJ + 1.4); clip('s_idle', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, FX, FZ) });
    steam(lf, b > .4 ? '#2a2420' : '#e8e8e8', .4 + b * .3, 5); camOn(c, FX - 1.0, FZ + .7, 7.4, .72); },
  // 6 — podre: só com Culinária 7
  (lf, f, len, c) => { yard(f); potOn(); atFire('s_lootlow', lf); camYard(c, 6.2, lf, len); },
  // 7 — ferver a água
  (lf, f, len, c) => { yard(f); potOn(); atFire('s_makinglow', lf); const b = sm((lf - 20) / 40); for (let i = 0; i < 6; i++) puff(FX + Math.sin(i) * .1, .62, FZ, (lf + i * 5) % 18, { n: 1, seed: i, life: 18, size: .05, rise: .2, color: '#ffffff', op: .8 * b }); steam(lf, '#ffffff', .5 * b); camYard(c, 6, lf, len); },
  // 8 — comer bem: sentado na cadeira, comendo da tigela
  (lf, f, len, c) => { yard(f); potOn(); clip('s_satchair', lf, { x: SEAT.x, z: SEAT.z, ry: Math.PI / 2, up: ['s_eatbowl', lf], bowl: true }); steam(lf); camYard(c, 6.6, lf, len); }
]);
