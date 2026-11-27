// EP 28 — Tédio e Tristeza (B42.22) — v4 (25/11, Jose): cada take com ambiente próprio, feito só com sprites e modelos do jogo.
// 0 tédio: casa, sentado no tapete olhando a janela; um zumbi passa lá fora (o perigo) · 1 anda de um lado a outro (ocupe-se)
// 2 tristeza: quartinho escuro com sacos de dormir no chão, lixo, luz da lua + abajur quente · 3 leitura: poltrona, estante com livros, óculos de leitura
// 4 floresta: fogueira, panela de ensopado, árvores/arbustos/pedras/flores do jogo; come a tigela · 5 fumante (janela) + antidepressivo (dias passando) · 6 base: livros e comida
import { THREE, PZ, pose, S, Z, light, puff, scene, U } from './engine.js';
import { run } from './ep3d.js';
import { quarto, casaDentro, luzInterior, camOn as camOn0, clima, clarao, tileLuz, floresta } from './cenarios.js';
import { fire, potAt, pot } from './sets.js';
const { clamp, lerp, easeOut } = U;
const camOn = (c, x, z, h, sy) => window.DBG ? camOn0(c, S.g.position.x, S.g.position.z, window.DBG, .5, .7) : camOn0(c, x, z, h, sy);
const solto = (C, m, t, i, j, ry = 0, y = .03, deitar = false) => { const me = PZ.propMesh(m, t), g = new THREE.Group(); g.add(me); if (deitar) me.rotation.x = -Math.PI / 2;
  me.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(me); me.position.y -= bb.min.y; g.position.set(i, y, j); g.rotation.y = ry; me.castShadow = true; C.G.add(g); return g; };

// ---------- casa (sala/cozinha) ----------
const CASA = casaDentro(-60, 80, { completa: true }), KC = CASA.C, K = KC.at;
[['d_trash_1_13', 1.6, 6.4], ['trash_01_33', 8.4, 6.5], ['trash_01_27', 4.6, 6.7]].forEach(([n, i, j]) => KC.placa(n, i, j));
// estante de livros: a estante do jogo (shelving_01_40) já está em (0,0); sobre ela, os livros do jogo (books&misc)
// livros na estante do jogo: lombadas em pé nas prateleiras (caixas finas coloridas, como os livros do jogo)
{ const COR = ['#8a2a2a', '#2c4a7a', '#3f6b3a', '#6b4a2a', '#7a6a2a', '#4a2a5a', '#a8a090', '#2a2a2e'], g = new THREE.Group(), SX = window.SX ?? .5, SZ = window.SZ ?? .52, YS = window.YS || [.3, .8, 1.3, 1.82];
  YS.forEach((y, r) => { let x = -.3; for (let k = 0; k < 8; k++) { const w = .04 + ((k * 7 + r * 3) % 5) * .008, h = .22 + ((k * 5 + r) % 4) * .035, b = new THREE.Mesh(new THREE.BoxGeometry(w, h, .2), new THREE.MeshLambertMaterial({ color: COR[(k + r * 3) % 8] }));
    b.position.set(x + w / 2, y + h / 2, 0); x += w + .004; g.add(b); } }); g.position.set(SX, 0, SZ); KC.G.add(g); }
solto(KC, 'bag_alice', 'alicepack_green', 1.2, 3.1, .5); solto(KC, 'bag_school', 'schoolbag_black', 1.5, 5.6, -.6); solto(KC, 'cigpack', 'cigarettepack', 7.1, 3.95, .4, 1.02);
const NOITE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'noite', lua: true });
const TARDE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
// ---------- quartinho triste: sacos de dormir no chão (camping_02), lixo, lua azul + abajur quente ----------
const Q = quarto(-120, 60, { sacos: true, semCadeira: true }), QC = Q.C, A = QC.at;
QC.chao('camping_02_41', 2, 1, 2, 1, { y: .035 }); QC.chao('camping_02_44', 3, 1, 3, 1, { y: .035 }); QC.chao('camping_02_47', 2, 2, 2, 2, { y: .035 });
[['d_trash_1_13', 4.4, 3.8], ['trash_01_33', 1.2, 3.6], ['trash_01_27', 5.2, 2.4], ['d_trash_1_9', 3.9, 4.2]].forEach(([n, i, j]) => QC.placa(n, i, j));
solto(QC, 'bag_duffel', 'duffelbaggreen', 4.6, 1.4, 1.3, .03, true); solto(QC, 'bag_school', 'schoolbag_black', 1.2, 2.8, .4);
const QN = luzInterior(QC, { janelas: [['N', 4]], abajur: [1, 0], hora: 'noite', lua: true });
// ---------- floresta ----------
const FL = floresta(150, 150, { livre: [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [2, 0], [-2, 0]] }), FC = FL.C, F = FC.at;
// fogueira do jogo (camping_01_4, lenha) + rochas, toras de sentar, tenda, mesa de piquenique; flores no capim
FC.placa('camping_01_4', 0, 0); FC.placa('camping_01_32', -1.6, .6); FC.placa('camping_01_34', 1.7, -.5); FC.placa('camping_01_0', -3.4, -2.4); FC.placa('camping_01_13', 3.6, -1.8);
[[-2.2, 1.2, 42], [2.4, 1.6, 20], [.9, -2.1, 24], [-.6, 2.4, 21]].forEach(([i, j, n]) => FC.placa('d_generic_1_' + n, i, j));
// ---------- itens/props na mão ----------
const CIG = PZ.attach(S, 'Bip01_Prop2', PZ.propMesh('cigarette', 'cigarette_lit'));
const PILL = PZ.attach(S, 'Bip01_Prop2', PZ.propMesh('pillbottle', 'pillbottle')); PILL.scale.setScalar(.45);
const BOOK = new THREE.Group();
{ const me = PZ.propMesh('w_bookhand', 'bookred'); me.material.side = THREE.DoubleSide;
  me.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(.0177, .0107, .0062), new THREE.Quaternion().setFromEuler(new THREE.Euler(...[-11.7984, 87.0744, -81.8605].map(d => d * Math.PI / 180), 'XYZ')), new THREE.Vector3(1, 1, 1)));
  BOOK.add(me); }
PZ.attach(S, 'Bip01_Prop2', BOOK);
// óculos de leitura (Glasses_Reading do jogo: armação redonda fina) — preso à cabeça
const OCULOS = new THREE.Group();   // eixos da cabeça (medidos): −y = para onde o rosto olha, +z = para baixo (queixo), x = lado a lado
{ const G2 = new THREE.Group(), mt = new THREE.MeshBasicMaterial({ color: window.GC || '#1e1a17', depthTest: false }), ring = new THREE.TorusGeometry(.03, .005, 6, 18);
  [-.04, .04].forEach(x => { const r = new THREE.Mesh(ring, mt); r.position.set(x, 0, 0); G2.add(r); });
  const br = new THREE.Mesh(new THREE.BoxGeometry(.03, .006, .006), mt); G2.add(br);
  [-1, 1].forEach(s => { const h = new THREE.Mesh(new THREE.BoxGeometry(.006, .006, .06), mt); h.position.set(s * .072, 0, -.03); G2.add(h); });
  G2.rotation.x = Math.PI / 2; G2.traverse(o => { o.renderOrder = 20; }); OCULOS.add(G2); }
const og = window.OG || { x: 0, y: -.022, z: .008, ry: 0 };
OCULOS.position.set(og.x, og.y, og.z); OCULOS.rotation.y = og.ry; PZ.attach(S, 'Bip01_Head', OCULOS);
if (window.CAND) { window.CAND.forEach(([x,y,z,c]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.012,8,6), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x,y,z); OCULOS.add(m); }); }
if (window.AXES) { [[1,0,0,'#f00'],[0,1,0,'#0f0'],[0,0,1,'#00f']].forEach(([x,y,z,c]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.04+x*.3,.04+y*.3,.04+z*.3), new THREE.MeshBasicMaterial({ color: c })); m.position.set(x*.15,y*.15,z*.15); OCULOS.add(m); }); }
S.g.traverse(o => { o.renderOrder = 2; });
const hide = () => { CIG.visible = PILL.visible = BOOK.visible = OCULOS.visible = false; };
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: Math.PI / 2, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  hide(); CIG.visible = !!o.cig; PILL.visible = !!o.pill; BOOK.visible = !!o.book; OCULOS.visible = !!o.oculos; S.olhar = o.olhar || 0; PZ.apoiar(S, 0); S.userData.assento = o.assento; S.shadow.visible = !o.assento; };
const zClip = (z, name, lf, o = {}) => { pose(z, Object.assign({ clip: [name, lf, o.loop !== false] }, o)); PZ.apoiar(z, 0); };
const SY = .7, SYI = .6;
const casaT = f => { light('dawn'); clima('', 0); KC.show(); TARDE.set(f); clarao(0); tileLuz('#fff2e0'); CASA.poltrona.sobrepor(false); pot.visible = false; };
const casaN = f => { light('dark'); clima('', 0); KC.show(); NOITE.set(f); clarao(0); tileLuz('#a99f90'); CASA.poltrona.sobrepor(false); pot.visible = false; };
const SEAT = K(.22, 2);
const sentado = (lf, up, o = {}) => { CASA.poltrona.sobrepor(true); clip('s_satchair', lf, Object.assign({ x: SEAT.x, z: SEAT.z, ry: Math.PI / 2, up, assento: CASA.poltrona.userData.hs }, o)); };
const lendo = (lf, f, c, cx, cz, h) => { casaT(f); sentado(lf, ['s_read', lf * .8], { book: true, oculos: true }); camOn(c, SEAT.x + cx, SEAT.z + cz, h, SYI); };

run([
  // 0 — tédio: sentado no tapete (sem fazer nada), pela janela passa um zumbi lá fora — até o tédio é perigoso
  (lf, f, len, c) => { casaT(f); const p = K(3.7, 3.0); clip('s_sitground', lf, { x: p.x, z: p.z, ry: Math.PI / 2 + .5 });
    const zi = K(.4 + lf / 30 * .7, -1.2); zClip(Z[0], 'z_walk', f, { x: zi.x, z: zi.z, ry: Math.PI / 2 });
    camOn(c, K(3.6, 1.6).x, K(3.6, 1.6).z, 7.8, SYI); },
  // 1 — ocupe-se: anda devagar de um lado ao outro da sala, sem rumo
  (lf, f, len, c) => { casaT(f); const L = 3.2, v = .75, d = (lf / 30 * v) % (2 * L), u = d < L ? d : 2 * L - d, dir = d < L ? 1 : -1, p = K(1.8 + u, 3.6);
    clip('s_walkslow', lf, { x: p.x, z: p.z, ry: dir > 0 ? Math.PI / 2 : -Math.PI / 2 }); camOn(c, K(3.4, 3.6).x, K(3.4, 3.6).z, 7.4, SY); },
  // 2 — tristeza: quartinho à noite, sacos de dormir no chão, lixo; sentado, cabeça baixa, a lua azul e o abajur quente
  (lf, f, len, c) => { light('dark'); clima('', 0); Q.C.show(); QN.set(f); clarao(0); tileLuz('#6c7486'); pot.visible = false; const p = A(3.4, 2.4);
    clip('s_sitground', lf, { x: p.x, z: p.z, ry: Math.PI / 2 + .3, up: ['s_painhead1', lf % 120] }); camOn(c, p.x + .2, p.z + .2, 5.8, SYI); },
  // 3 — leitura: poltrona de couro, estante com livros ao lado, óculos de leitura
  (lf, f, len, c) => lendo(lf, f, c, .6, .1, lerp(6.2, 5.0, easeOut(clamp(lf / len)))),
  // 4 — floresta: ensopado na panela sobre a fogueira; depois a tigela
  (lf, f, len, c) => { light('dusk'); clima('', 0); FC.show(); FL.vida(f, 1); clarao(0); tileLuz('#ffc890'); const p = F(1.5, 1.2);
    fire(F(0, 0).x, F(0, 0).z, f); potAt(F(0, 0).x, .55, F(0, 0).z, 1, 1);
    const k = len * .55; if (lf < k) clip('s_sitground', lf, { x: p.x, z: p.z, ry: -Math.PI / 2 }); else clip('s_eatbowl', lf - k, { x: p.x, z: p.z, ry: -Math.PI / 2 });
    camOn(c, F(.6, .6).x, F(.6, .6).z, 7.0, SYI); },
  // 5 — fumante e antidepressivo: cigarro na janela; depois o frasco e os dias passando
  (lf, f, len, c) => { const k = len * .42;
    if (lf < k) { casaT(f); const p = K(3.1, 1.0); clip('s_smoke', lf, { x: p.x, z: p.z, ry: .5, cig: true }); camOn(c, p.x + .15, p.z + .45, 4.7, SYI); }
    else { const t = (lf - k) / (len - k), dia = Math.floor(t * 3); (dia === 1 ? casaN : casaT)(f); const p = K(7.4, 1.6); const ll = (lf - k) % 110;
      clip(ll < 100 ? 's_pills' : 's_idle', ll, { x: p.x, z: p.z, ry: .7, pill: ll < 100, loop: false }); clarao((1 - Math.abs(((t * 3) % 1) - .5) * 2) < .12 ? .75 : 0, '#000');
      camOn(c, p.x - .2, p.z + .1, 5.4, SYI); } },
  // 6 — base: lendo na poltrona, livros na estante, panela de ensopado na mesa de centro
  (lf, f, len, c) => { lendo(lf, f, c, .9, .5, lerp(7.0, 6.0, easeOut(clamp(lf / len)))); const m = K(1.2, 4.5); potAt(m.x, .55, m.z, 1, 1); },
]);
