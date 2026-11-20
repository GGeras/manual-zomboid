import { THREE, PZ, scene, pose, S, light, prop, box, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { casaDentro, camOn, clima, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut, T } = U;
// EP19 v2 (revisão 2026-11-20): o MESMO lugar do começo ao fim — sala mobiliada com os sprites do jogo (sofá, estante, TV, cozinha).
// Leitura com as animações ORIGINAIS: em pé = Bob_IdleReadBook; sentado = Bob_SatChair (pernas) + Bob_IdleReadBook (tronco/braços),
// na cadeira do jogo (sem afundar no chão). Prática = construir um CAIXOTE de madeira (Carpintaria) ajoelhado martelando (Bob hammer low):
// tábuas no chão → base → paredes → caixote pronto (sprite original carpentry_01_16) + serragem a cada martelada.
const CASA = casaDentro(-60, 80), C = CASA.C;
const CHAIR = C.obj('furniture_seating_indoor_01_57', 3, 3, { w: .6, d: .6 }); const SEAT = C.at(3, 3);
// livro aberto na mão (Carpintaria = capa vermelha/marrom), preso no osso de item do jogo
const BOOK = new THREE.Group(); { const cv = box(.15, .01, .2, '#7a2a1e'); BOOK.add(cv); const pg = box(.135, .015, .185, '#efe6cf'); pg.position.y = .01; BOOK.add(pg); const sp = box(.004, .018, .185, '#9a8f78'); sp.position.y = .012; BOOK.add(sp); }
BOOK.rotation.set(0, 0, Math.PI / 2); PZ.attach(S, 'Bip01_Prop1', BOOK);
const HAM = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hammer', 'hammer'));
// livro guardado na estante (cena 9)
const SHELFBOOK = prop(box(.06, .3, .22, '#7a2a1e'));
// caixote sendo construído (peças 3D de madeira) + caixote pronto (sprite do jogo)
const WOOD = ['#9a7346', '#8a6538', '#a57d4c'], CR = C.at(5, 5.2);
const PL = prop(new THREE.Group()); PL.position.set(CR.x, 0, CR.z);
const pile = [[0, .03, .05, .1], [.05, .08, -.08, -.08], [-.04, .13, .02, .2]].map(([x, y, z, r], i) => { const p = box(.95, .05, .18, WOOD[i]); p.position.set(x, y, z); p.rotation.y = r; PL.add(p); return p; });
const parts = []; // base, 4 paredes em 2 camadas
[[0, .03, 0, .8, .06, .8], [0, .2, .38, .8, .26, .05], [0, .2, -.38, .8, .26, .05], [.38, .2, 0, .05, .26, .8], [-.38, .2, 0, .05, .26, .8],
 [0, .5, .38, .8, .3, .05], [0, .5, -.38, .8, .3, .05], [.38, .5, 0, .05, .3, .8], [-.38, .5, 0, .05, .3, .8]].forEach(([x, y, z, w, h, d], i) => { const p = box(w, h, d, WOOD[i % 3]); p.position.set(x, y, z); PL.add(p); parts.push(p); });
const CRATE = C.obj('carpentry_01_16', 5, 5.2, { w: .8, d: .8 }); CRATE.visible = false;
function build(k, f) { PL.visible = true; CRATE.visible = k >= .92; pile.forEach((p, i) => { p.visible = k < .35 - i * .08; });
  parts.forEach((p, i) => { const t = clamp((k - .2 - i * .075) / .06); p.visible = t > 0 && k < .92; p.position.y = p.userData.y0 ??= p.position.y; p.scale.setScalar(lerp(1.3, 1, t)); });
  if (CRATE.visible) { const t = clamp((k - .92) / .05); CRATE.scale.setScalar(lerp(1.15, 1, easeOut(t))); }
  PL.children.forEach(o => { if (CRATE.visible) o.visible = false; }); }
const SPOT = C.at(4.1, 5.2);   // onde ele se ajoelha para martelar (o caixote fica à direita dele)
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false; BOOK.visible = !!o.book; HAM.visible = !!o.ham; };
const room = () => { light('day'); tileLuz('#ffffff'); clima('', 0); C.show(); };
const readStand = (lf, p, ry = .8) => clip('s_read', lf, { x: p.x, z: p.z, ry, book: true });
// sentado na cadeira do jogo: senta (Bob_SatChairIn) e fica sentado lendo (Bob_SatChair + Bob_IdleReadBook no tronco)
const CH_RY = 0;
const readSit = (lf, sitIn = false) => { if (sitIn && lf < 31) clip('s_satchairin', lf, { x: SEAT.x, z: SEAT.z, ry: CH_RY, loop: false }); else clip('s_satchair', lf, { x: SEAT.x, z: SEAT.z, ry: CH_RY, up: ['s_read', lf], book: true }); };
// martelando ajoelhado: a cada golpe (quadro ~10 do ciclo de 21) solta serragem
const hammer = (lf, k, f) => { clip('s_hammer_low', lf, { x: SPOT.x, z: SPOT.z, ry: Math.PI / 2, ham: true }); build(k, f); const a = lf % 20;
  if (a > 9 && a < 22) puff(CR.x - .1, .35, CR.z, a - 9, { n: 3, seed: Math.floor(lf / 20), life: 18, size: .05, rise: .2, color: '#d8c294', op: .7 }); };
const READ = C.at(3.6, 1.8);
run([
  // 0 — livro na mão, nível parado
  (lf, f, len, c) => { room(); readStand(lf, READ); camOn(c, READ.x, READ.z, lerp(8, 7, easeOut(lf / len))); },
  // 1 — praticar enche a barra: lê um pouco e vai construir o caixote
  (lf, f, len, c) => { room(); const k0 = len * .28; if (lf < k0) readStand(lf, READ); else hammer(lf - k0, clamp((lf - k0) / (len - k0) * .62), f); const p = lf < k0 ? READ : SPOT; camOn(c, lerp(READ.x, SPOT.x, clamp((lf - k0 + 10) / 20)), lerp(READ.z, SPOT.z, clamp((lf - k0 + 10) / 20)), 7.6); },
  // 2 — volumes: senta na cadeira e lê
  (lf, f, len, c) => { room(); readSit(lf, true); camOn(c, SEAT.x, SEAT.z, 7.6); },
  // 3 — bônus
  (lf, f, len, c) => { room(); readSit(lf + 60); camOn(c, SEAT.x, SEAT.z, 7.2); },
  // 4 — metade: em pé, perto da estante
  (lf, f, len, c) => { room(); const p = C.at(1.8, 2.2); readStand(lf, p, 1.1); camOn(c, p.x, p.z, 7.4); },
  // 5 — exemplo: a mesma construção do começo ao fim
  (lf, f, len, c) => { room(); hammer(lf, clamp(lf / len * 1.05), f); camOn(c, SPOT.x + .3, SPOT.z, 6.8); },
  // 6 — páginas lidas
  (lf, f, len, c) => { room(); readSit(lf + 120); camOn(c, SEAT.x, SEAT.z, 7.2); },
  // 7 — volume errado
  (lf, f, len, c) => { room(); readStand(lf, READ, .5); camOn(c, READ.x, READ.z, 7.2); },
  // 8 — sentado lê mais rápido
  (lf, f, len, c) => { room(); readSit(lf + 200); camOn(c, SEAT.x, SEAT.z, lerp(7.2, 6.2, lf / len)); },
  // 9 — o bônus fica: livro guardado na estante, ele sem nada na mão
  (lf, f, len, c) => { room(); const s = C.at(1, 1); SHELFBOOK.visible = true; SHELFBOOK.position.set(s.x + .1, 1.05, s.z + .25); const p = C.at(2.2, 2.6); clip('s_idle', lf, { x: p.x, z: p.z, ry: .8 }); camOn(c, p.x - .3, p.z - .3, 7.4); },
  // 10 — lê antes, pratica depois: caixote fica pronto
  (lf, f, len, c) => { room(); hammer(lf, clamp(.55 + lf / len * .6), f); camOn(c, SPOT.x + .3, SPOT.z, lerp(6.8, 7.6, lf / len)); }
]);
