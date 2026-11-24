import { THREE, PZ, pose, S, light, prop, box, puff, U, scene } from './engine.js';
import { run } from './ep3d.js';
import { casaDentro, camOn as camOn0, clima, luzInterior, rota, VEL } from './cenarios.js';
const { clamp, lerp, easeOut } = U;
// window.DBG (ep19dbg.html, só para conferência): câmera bem perto do personagem para ver contato com o piso/assento e o livro na mão
const camOn = (c, x, z, h, sy) => window.DBG ? camOn0(c, S.g.position.x, S.g.position.z, window.DBG, .5, .7) : camOn0(c, x, z, h, sy);
// EP19 FINAL (23/11, voz ElevenLabs) — casa COMPLETA (regra 4.4: móveis encostados e virados certo; rodapé, porta, quadros, relógio)
// e LUZ DE INTERIOR (regra 4.5): fim de tarde, sol entrando pelas janelas (facho no chão + poeira) e abajur de pé aceso no canto de leitura.
// Leitura: na poltrona de couro ao lado do abajur — chega na frente da poltrona, senta (Bob_SatChairIn, o corpo recua para o assento: não atravessa a poltrona)
// e lê (Bob_SatChair + Bob_IdleReadBook) virando a página. Prática: serra a tábua na bancadinha (Bob_IdleSawSmallItem + serra do jogo) e monta o caixote
// ajoelhado martelando (Bob_IdleHammering_Low): cada martelada prega uma peça (lasca de madeira + tremidinha), até o caixote pronto do jogo.
const CASA = casaDentro(-60, 80, { completa: true }), C = CASA.C;
const LUZ = luzInterior(C, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
const SEAT = C.at(.22, 2), FRONT = C.at(.77, 2), CH_RY = Math.PI / 2;   // pelve no meio da almofada; na frente = onde os pés ficam quando ele senta (+0,55)   // poltrona encostada na parede W, virada para o leste
// livro aberto na mão = o MODELO DO JOGO (models_X/BookHand.fbx + WorldItems/BookRed_New.png), preso no osso Bip01_Prop2 com o anexo
// do jogo (scripts/generated/models_items.txt, "model Book": offset 0.0177 0.0107 0.0062, rotate -11.7984 87.0744 -81.8605)
const BOOK = new THREE.Group();
{ const me = PZ.propMesh('w_bookhand', 'bookred'); me.material.side = THREE.DoubleSide;
  const A = new THREE.Matrix4().compose(new THREE.Vector3(.0177, .0107, .0062), new THREE.Quaternion().setFromEuler(new THREE.Euler(...[-11.7984, 87.0744, -81.8605].map(d => d * Math.PI / 180), 'XYZ')), new THREE.Vector3(1, 1, 1));
  me.applyMatrix4(A.invert()); BOOK.add(me); }
PZ.attach(S, 'Bip01_Prop2', BOOK);
const HAM = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hammer', 'hammer'));
const SAW = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hacksaw', 'hacksaw'));
S.g.traverse(o => { o.renderOrder = 2; });   // regra 4.7: o personagem vem depois do móvel em que ele encosta (m.sobrepor)
// leitura como no jogo (AnimSets/player/actions/book.xml): Bob_IdleReadBook a 0,80 da velocidade; a página vira (evento PageFlip) a 60% de cada ciclo
const READSP = .8;
// livro guardado na estante (cena 9)
const SHELFBOOK = prop(box(.06, .3, .22, '#7a2a1e'));
// ---------- oficina: bancadinha com a tábua, caixote montado peça por peça ----------
const WOOD = ['#9a7346', '#8a6538', '#a57d4c'];
const TB = C.at(4.75, 6.55), BENCH = C.obj('carpentry_02_0', 4.75, 6.55, { w: .7, d: .7 });
const BENCH_TOP = BENCH.userData.h;   // tampo da bancada (0,55: pixel 181 do sprite do jogo = topo da caixa) — a tábua fica APOIADA nele (regra 4.7)
const SAWAT = C.at(4.05, 6.55);   // em pé à esquerda da bancada, virado para ela (leste)
const PLANK = prop(box(.8, .04, .18, WOOD[0])), CUT = prop(box(.25, .04, .18, WOOD[2])); [PLANK, CUT].forEach(o => o.traverse(m => { m.renderOrder = 2; }));
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
// regra 4.7: depois de cada pose o ponto mais baixo do corpo (sola/calcanhar/joelho/nádega, medidas do jogo) fica exatamente sobre o piso
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  BOOK.visible = !!o.book; HAM.visible = !!o.ham; SAW.visible = !!o.saw; PZ.apoiar(S, 0); S.userData.assento = o.assento; };
const room = f => { light('dawn'); clima('', 0); C.show(); LUZ.set(f); PLANK.visible = false; CUT.visible = false; SHELFBOOK.visible = false; CASA.poltrona.sobrepor(false); };
const readStand = (lf, p, ry = .8) => clip('s_read', lf * READSP, { x: p.x, z: p.z, ry, book: true });
// senta: começa EM PÉ NA FRENTE da poltrona e recua junto com a animação até o assento (o corpo nunca entra na poltrona)
const SIT = 31;
const readSit = (lf, sitIn = false) => { CASA.poltrona.sobrepor(true);   // sentado: por cima do desenho da poltrona (regra 4.7)
  if (sitIn && lf < SIT) { const k = easeOut(clamp(lf / (SIT - 4))); clip('s_satchairin', lf, { x: lerp(FRONT.x, SEAT.x, k), z: lerp(FRONT.z, SEAT.z, k), ry: CH_RY, loop: false }); return; }
  const l = sitIn ? lf - SIT : lf; clip('s_satchair', l, { x: SEAT.x, z: SEAT.z, ry: CH_RY, up: ['s_read', l * READSP], book: true, assento: CASA.poltrona.userData.hs }); };
// serrando a tábua na bancadinha: a cada 41 quadros (ciclo da animação) cai serragem; no fim o pedaço cortado cai
// serrar como no jogo (Bob_IdleSawLog): a mão esquerda segura a tábua deitada no tampo da bancada e a serra corta a ponta que sobra;
// o pedaço cortado cai e fica deitado no chão (regra 4.7: tábua apoiada no tampo, pedaço apoiado no piso).
const CUTX = () => SAWAT.x + .45;
const saw = (lf, len) => { clip('s_sawlog', lf, { x: SAWAT.x, z: SAWAT.z, ry: Math.PI / 2, saw: true }); const k = lf / len, x0 = SAWAT.x + .2, x1 = TB.x + .3, y = BENCH_TOP + .02;
  PLANK.visible = true; const a = k < .85 ? x0 : CUTX(); PLANK.scale.x = (x1 - a) / .8; PLANK.position.set((a + x1) / 2, y, TB.z);
  if (k >= .85) { const t = clamp((k - .85) / .1); CUT.visible = true; CUT.position.set((x0 + CUTX()) / 2 - t * .12, lerp(y, .02, t * t), TB.z + t * .08); CUT.rotation.z = Math.sin(t * Math.PI) * .5; }
  else if (lf % 26 < 18) puff(CUTX(), y - .02, TB.z, lf % 14, { n: 3, seed: Math.floor(lf / 14), life: 14, size: .035, rise: -.35, color: '#e0cc9e', op: .8 }); };
// martelando ajoelhado: golpe no quadro 9 de cada ciclo de 20 → prega uma peça, solta lasca e treme de leve
const HIT = 9, CYC = 20;
const hammer = (lf, n0, c, maxN = 10) => { clip('s_hammer_low', lf, { x: SPOT.x, z: SPOT.z, ry: Math.PI / 2, ham: true });   // ajoelhado: o joelho encosta no piso (regra 4.7, apoiar)
  const hits = lf < HIT ? 0 : Math.floor((lf - HIT) / CYC) + 1, since = lf < HIT ? 99 : (lf - HIT) % CYC; build(Math.min(maxN, n0 + hits), since);
  if (hits > 0 && since < 14) { puff(CR.x - .25, .32, CR.z, since, { n: 5, seed: hits * 7, life: 14, size: .045, rise: .35, color: '#c9a46c', op: .85 }); c.shake(since, .035); } };
const READ = C.at(3.15, 1.15);   // em pé, dentro do facho de sol da janela N
const SHELF = C.at(1.0, 1.05);
// bancada → caixote andando (nunca teleportar entre duas ações)
const ANDA = 34, paraCaixote = lf => { const q = rota([[SAWAT.x, SAWAT.z], [SPOT.x, SPOT.z]], lf / 30, VEL.s_walk); clip('s_walk', lf, { x: q.x, z: q.z, ry: q.ry }); return q; };
const FIM = C.at(4.2, 5.75);   // em pé ao lado do caixote pronto
const SY = .67;   // regra 4.3: corpo inteiro acima da descrição do app
// ---------- CAPA (capa19.html, window.CAPA): só o personagem lendo o livro do jogo, fundo transparente; o resto da capa é HTML ----------
if (window.CAPA) { const cena = (lf, f, len, c) => { room(f); C.G.visible = false; LUZ.off(); PLANK.visible = false; PL.visible = false; CRATE.visible = false;
    light('day'); scene.background = null; scene.fog = null; scene.children.forEach(o => { if (o !== S.g && !o.isLight && !o.isCamera) o.visible = false; });   // só o personagem (sem chão/casas)
    clip('s_read', 40, { x: READ.x, z: READ.z, ry: window.CAPA_RY ?? .55, book: true });
    camOn0(c, READ.x, READ.z, window.CAPA_ZOOM ?? 4.3, window.CAPA_SY ?? .53, window.CAPA_Y ?? .95); };
  window.__CAPA_SHOTS = Array(11).fill(cena); }
run(window.__CAPA_SHOTS || [
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
  // 10 — lê antes, pratica depois: caixote pronto e ele, sem martelo, de frente para a câmera fazendo 👍 (Bob_EmoteThumbsUp do jogo) até o fim
  (lf, f, len, c) => { room(f); build(10, 99); clip('s_thumbsup', Math.min(lf + 6, 24), { x: FIM.x, z: FIM.z, ry: Math.PI / 4, loop: false });
    camOn(c, FIM.x + .2, FIM.z - .1, lerp(4.6, 4.9, lf / len), .58); }   // perto: o 👍 tem de ler bem no celular
]);
