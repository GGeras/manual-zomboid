import { THREE, PZ, pose, S, light, prop, box, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { casaDentro, camOn, clima, luzInterior, rota, VEL } from './cenarios.js';
const { clamp, lerp, easeOut } = U;
// EP19 FINAL (23/11, voz ElevenLabs) — casa COMPLETA (regra 4.4: móveis encostados e virados certo; rodapé, porta, quadros, relógio)
// e LUZ DE INTERIOR (regra 4.5): fim de tarde, sol entrando pelas janelas (facho no chão + poeira) e abajur de pé aceso no canto de leitura.
// Leitura: na poltrona de couro ao lado do abajur — chega na frente da poltrona, senta (Bob_SatChairIn, o corpo recua para o assento: não atravessa a poltrona)
// e lê (Bob_SatChair + Bob_IdleReadBook) virando a página. Prática: serra a tábua na bancadinha (Bob_IdleSawSmallItem + serra do jogo) e monta o caixote
// ajoelhado martelando (Bob_IdleHammering_Low): cada martelada prega uma peça (lasca de madeira + tremidinha), até o caixote pronto do jogo.
const CASA = casaDentro(-60, 80, { completa: true }), C = CASA.C;
const LUZ = luzInterior(C, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
const SEAT = C.at(.08, 2), FRONT = C.at(.72, 2), CH_RY = Math.PI / 2;   // poltrona encostada na parede W, virada para o leste
// livro aberto na mão (capa vermelha da Carpintaria) com uma página que vira de verdade sobre a lombada
const BOOK = new THREE.Group();
{ const cv = box(.15, .01, .2, '#7a2a1e'); BOOK.add(cv);
  const pc = document.createElement('canvas'); pc.width = 64; pc.height = 96; const x = pc.getContext('2d'); x.fillStyle = '#efe6cf'; x.fillRect(0, 0, 64, 96); x.fillStyle = 'rgba(90,80,60,.55)';
  for (let r = 10; r < 88; r += 6) { x.fillRect(6, r, 24, 1.4); x.fillRect(36, r, 22, 1.4); }
  const pm = new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(pc), side: THREE.DoubleSide });
  const pg = new THREE.Mesh(new THREE.BoxGeometry(.135, .015, .185), pm); pg.position.y = .01; BOOK.add(pg);
  const sp = box(.004, .018, .185, '#9a8f78'); sp.position.y = .012; BOOK.add(sp);
  const hinge = new THREE.Group(); hinge.position.y = .019; const leaf = new THREE.Mesh(new THREE.PlaneGeometry(.066, .18), pm); leaf.rotation.x = -Math.PI / 2; leaf.position.x = .034; hinge.add(leaf); BOOK.add(hinge); BOOK.userData.hinge = hinge; }
BOOK.rotation.set(0, 0, Math.PI / 2); PZ.attach(S, 'Bip01_Prop1', BOOK);
const HAM = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hammer', 'hammer'));
const SAW = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hacksaw', 'hacksaw'));
// página virando: a cada `per` quadros a folha da direita passa por cima da lombada (12 quadros)
const PER = 96, FLIP0 = 40;
const pagina = lf => { const a = (lf - FLIP0) % PER, k = lf >= FLIP0 && a < 12 ? a / 12 : 0; BOOK.userData.hinge.rotation.z = k * Math.PI; BOOK.userData.hinge.visible = k > 0; };
// livro guardado na estante (cena 9)
const SHELFBOOK = prop(box(.06, .3, .22, '#7a2a1e'));
// ---------- oficina: bancadinha com a tábua, caixote montado peça por peça ----------
const WOOD = ['#9a7346', '#8a6538', '#a57d4c'];
const TB = C.at(4.75, 6.55); C.obj('carpentry_02_0', 4.75, 6.55, { w: .7, d: .7 });
const SAWAT = C.at(4.05, 6.55);   // em pé à esquerda da bancada, virado para ela (leste)
const PLANK = prop(box(.9, .04, .18, WOOD[0])), CUT = prop(box(.3, .04, .18, WOOD[2]));
const CR = C.at(5, 5.1), PL = prop(new THREE.Group()); PL.position.set(CR.x, 0, CR.z);
const pile = [[0, .03, .05, .1], [.05, .08, -.08, -.08], [-.04, .13, .02, .2]].map(([x, y, z, r], i) => { const p = box(.95, .05, .18, WOOD[i]); p.position.set(x, y, z); p.rotation.y = r; PL.add(p); return p; });
const parts = []; // base, 4 paredes em 2 camadas (8 marteladas)
[[0, .03, 0, .8, .06, .8], [0, .2, .38, .8, .26, .05], [0, .2, -.38, .8, .26, .05], [.38, .2, 0, .05, .26, .8], [-.38, .2, 0, .05, .26, .8],
 [0, .5, .38, .8, .3, .05], [0, .5, -.38, .8, .3, .05], [.38, .5, 0, .05, .3, .8], [-.38, .5, 0, .05, .3, .8]].forEach(([x, y, z, w, h, d], i) => { const p = box(w, h, d, WOOD[i % 3]); p.position.set(x, y, z); PL.add(p); parts.push(p); });
const CRATE = C.obj('carpentry_01_16', 5, 5.1, { w: .8, d: .8 }); CRATE.visible = false;
const SPOT = C.at(4.1, 5.1);   // ajoelhado, o caixote à direita dele
// n = peças já pregadas (0..9); a peça nova "assenta" nos 5 quadros depois da martelada
function build(n, since) { PL.visible = true; const done = n >= parts.length + 1; CRATE.visible = done;
  pile.forEach((p, i) => { p.visible = !done && n < 3 - i; });
  parts.forEach((p, i) => { p.visible = !done && i < n; p.userData.y0 ??= p.position.y; const t = i === n - 1 ? clamp(since / 5) : 1; p.position.y = p.userData.y0 + (1 - t) * .12; });
  if (done) CRATE.scale.setScalar(lerp(1.12, 1, easeOut(clamp(since / 8)))); }
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  BOOK.visible = !!o.book; HAM.visible = !!o.ham; SAW.visible = !!o.saw; };
const room = f => { light('dawn'); clima('', 0); C.show(); LUZ.set(f); PLANK.visible = false; CUT.visible = false; SHELFBOOK.visible = false; };
const readStand = (lf, p, ry = .8) => { clip('s_read', lf, { x: p.x, z: p.z, ry, book: true }); pagina(lf); };
// senta: começa EM PÉ NA FRENTE da poltrona e recua junto com a animação até o assento (o corpo nunca entra na poltrona)
const SIT = 31;
const readSit = (lf, sitIn = false) => { if (sitIn && lf < SIT) { const k = easeOut(clamp(lf / (SIT - 4))); clip('s_satchairin', lf, { x: lerp(FRONT.x, SEAT.x, k), z: lerp(FRONT.z, SEAT.z, k), ry: CH_RY, loop: false }); BOOK.visible = false; return; }
  const l = sitIn ? lf - SIT : lf; clip('s_satchair', l, { x: SEAT.x, z: SEAT.z, ry: CH_RY, up: ['s_read', l], book: true }); pagina(l + 30); };
// serrando a tábua na bancadinha: a cada 41 quadros (ciclo da animação) cai serragem; no fim o pedaço cortado cai
const saw = (lf, len) => { clip('s_sawsmall', lf, { x: SAWAT.x, z: SAWAT.z, ry: Math.PI / 2, saw: true }); const k = lf / len;
  PLANK.visible = true; PLANK.position.set(TB.x - .05, .8, TB.z); PLANK.scale.x = k < .85 ? 1 : .68;
  if (k >= .85) { const t = (k - .85) / .15; CUT.visible = true; CUT.position.set(TB.x + .5, Math.max(.02, .8 - t * t * 1.2), TB.z + t * .1); CUT.rotation.z = t * .9; }
  puff(TB.x + .22, .78, TB.z, lf % 14, { n: 3, seed: Math.floor(lf / 14), life: 14, size: .035, rise: -.35, color: '#e0cc9e', op: .8 }); };
// martelando ajoelhado: golpe no quadro 9 de cada ciclo de 20 → prega uma peça, solta lasca e treme de leve
const HIT = 9, CYC = 20;
const hammer = (lf, n0, c, maxN = 10) => { clip('s_hammer_low', lf, { x: SPOT.x, z: SPOT.z, ry: Math.PI / 2, ham: true }); S.g.position.y = .035;   // ajoelhado: a ponta do pé não entra no piso
  const hits = lf < HIT ? 0 : Math.floor((lf - HIT) / CYC) + 1, since = lf < HIT ? 99 : (lf - HIT) % CYC; build(Math.min(maxN, n0 + hits), since);
  if (hits > 0 && since < 14) { puff(CR.x - .25, .32, CR.z, since, { n: 5, seed: hits * 7, life: 14, size: .045, rise: .35, color: '#c9a46c', op: .85 }); c.shake(since, .035); } };
const READ = C.at(3.15, 1.15);   // em pé, dentro do facho de sol da janela N
const SHELF = C.at(1.0, 1.05);
// bancada → caixote andando (nunca teleportar entre duas ações)
const ANDA = 34, paraCaixote = lf => { const q = rota([[SAWAT.x, SAWAT.z], [SPOT.x, SPOT.z]], lf / 30, VEL.s_walk); clip('s_walk', lf, { x: q.x, z: q.z, ry: q.ry }); return q; };
const SY = .67;   // regra 4.3: corpo inteiro acima da descrição do app
run([
  // 0 — livro na mão, nível parado: lendo em pé no sol da janela
  (lf, f, len, c) => { room(f); readStand(lf + 20, READ); camOn(c, READ.x, READ.z, lerp(7.6, 6.8, easeOut(lf / len)), SY); },
  // 1 — multiplica, mas só a prática: lê um pouco, vai para a bancada, serra a tábua, ANDA até o caixote (sem teleporte) e começa a pregar
  (lf, f, len, c) => { room(f); const r = len * .2, w = len * .38, s = len * .62, m = s + ANDA; let p = READ;
    if (lf < r) readStand(lf, READ);
    else if (lf < w) { const q = rota([[READ.x, READ.z], [READ.x + .6, READ.z + 2.4], [SAWAT.x, SAWAT.z]], (lf - r) / 30, VEL.s_walk); p = q; clip('s_walk', lf, { x: q.x, z: q.z, ry: q.ry }); build(0, 99); }
    else if (lf < s) { p = SAWAT; saw(lf - w, s - w); build(0, 99); }
    else if (lf < m) { p = paraCaixote(lf - s); build(0, 99); }
    else { p = SPOT; hammer(lf - m, 0, c); }
    camOn(c, p.x + .25, p.z, 8, SY); },   // câmera acompanha o personagem: ele nunca sai para a área dos botões (regra 4.3)
  // 2 — cinco volumes: chega na poltrona, senta e abre o livro (câmera sai do personagem andando e assenta na poltrona)
  (lf, f, len, c) => { room(f); const a = 26; let p = SEAT; if (lf < a) { const q = rota([[FRONT.x + .9, FRONT.z + .8], [FRONT.x, FRONT.z]], lf / 30, VEL.s_walk); p = q; clip('s_walk', lf, { x: q.x, z: q.z, ry: q.ry }); }
    else readSit(lf - a, true); const k = easeOut(clamp(lf / (a + 30))); camOn(c, lerp(p.x, SEAT.x + .6, k), lerp(p.z, SEAT.z + .2, k), 7.4, SY); },
  // 3 — o bônus cresce: lendo sentado, vira página
  (lf, f, len, c) => { room(f); readSit(lf + 60); camOn(c, SEAT.x + .6, SEAT.z + .2, lerp(7.2, 6.6, lf / len), SY); },
  // 4 — algumas rendem a metade: em pé na estante, lendo
  (lf, f, len, c) => { room(f); readStand(lf, SHELF, 1.0); camOn(c, SHELF.x + .3, SHELF.z + .3, 7.2, SY); },
  // 5 — exemplo: serra a tábua, anda até o caixote e monta o caixote inteiro
  (lf, f, len, c) => { room(f); const s = len * .3, m = s + ANDA; let p = SAWAT; build(0, 99);
    if (lf < s) saw(lf, s); else if (lf < m) p = paraCaixote(lf - s); else { p = SPOT; hammer(lf - m, 0, c); }
    camOn(c, p.x + .4, p.z, 7, SY); },
  // 6 — metade das páginas: sentado, vira página
  (lf, f, len, c) => { room(f); readSit(lf + 140); camOn(c, SEAT.x + .6, SEAT.z + .2, 6.8, SY); },
  // 7 — volume errado: em pé no sol, lendo
  (lf, f, len, c) => { room(f); readStand(lf + 70, READ, .5); camOn(c, READ.x, READ.z, 7.2, SY); },
  // 8 — sentado lê mais rápido (abajur aceso do lado)
  (lf, f, len, c) => { room(f); readSit(lf + 220); camOn(c, SEAT.x + .5, SEAT.z + .1, lerp(7.2, 6.2, lf / len), SY); },
  // 9 — o bônus fica: livro guardado na estante, ele de mão vazia
  (lf, f, len, c) => { room(f); const s = C.at(0, 0); SHELFBOOK.visible = true; SHELFBOOK.position.set(s.x + .1, 1.05, s.z + .25); clip('s_idle', lf, { x: SHELF.x + .3, z: SHELF.z + .5, ry: .8 }); build(7, 99); camOn(c, SHELF.x + .1, SHELF.z + .4, 7.4, SY); },
  // 10 — lê antes, pratica depois: últimas marteladas e o caixote pronto
  (lf, f, len, c) => { room(f); hammer(lf, 7, c); camOn(c, SPOT.x + .4, SPOT.z, lerp(6.8, 7.6, lf / len), SY); }
]);
