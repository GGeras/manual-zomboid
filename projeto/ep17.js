import { THREE, PZ, pose, S, Z, zWalk, light, sparks, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { casaDentro, sobrado, coneLuz, camOn, rota, VEL, clima, tileLuz, WALL_H } from './cenarios.js';
const { clamp, lerp, easeOut, face, T } = U;
// EP17 v2 (revisão 2026-11-20): casa DE VERDADE (sala + cozinha mobiliadas, sprites do jogo), janela na parede do fundo.
// Barricadas com os sprites ORIGINAIS: tábuas carpentry_01_9/11/13/15 (1 a 4), chapa de metal constructedobjects_01_25,
// barras de metal constructedobjects_01_53, cortina fixtures_windows_curtains_01_25 (fechada) / _29 (aberta).
// Zumbi entra pela janela como no jogo: espreme pelo vão, cai no chão e só depois levanta (Zombie/ClimbWindow original).
// Martelo = malha do jogo presa no osso de item (cabeça para cima, como no jogo). Saída: janela do ANDAR DE CIMA, sem barricada,
// corda de lençol (crafted_01_1 + crafted_01_9) e o personagem descendo segurando a corda (Bob_ClimbRope).
const CASA = casaDentro(-60, 80, { janelaLivre: true }), C = CASA.C;
const JX = C.x(3), JZ = C.z(-.5);                 // janela N (linha da parede)
const ov = (name, lado = 'N', i = 3, j = 0) => { const m = C.parede(lado, name, i, j, { off: lado === 'N' ? .05 : .05 }); m.visible = false; return m; };
const PLK = [9, 11, 13, 15].map(n => ov('carpentry_01_' + n)), PLKW = [8, 10, 12, 14].map(n => ov('carpentry_01_' + n, 'W', 0, 3));
const SHEET = ov('constructedobjects_01_25'), BARS = ov('constructedobjects_01_53'), CUR = [ov('fixtures_windows_curtains_01_29'), ov('fixtures_windows_curtains_01_25')];
const planks = (n, nw = 0, shake = 0, f = 0) => { PLK.forEach((m, i) => { m.visible = i === n - 1; m.position.x = 3 + (shake ? Math.sin(f * 2.3) * .03 * shake : 0); });
  PLKW.forEach((m, i) => { m.visible = i === nw - 1; }); };
const HAM = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hammer', 'hammer'));
const clip = (h, name, lf, o = {}) => { pose(h, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false] }, o)); if (h === S) { S.bat.visible = false; S.hammer.visible = false; HAM.visible = !!o.ham; } };
const inside = (kind = 'dawn') => { pose(S, { vis: false }); light(kind); tileLuz(kind === 'dark' ? '#7a84a0' : kind === 'dawn' ? '#f0d8c0' : '#ffffff'); clima('', 0); C.show(); [...PLK, ...PLKW, SHEET, BARS, ...CUR].forEach(m => { m.visible = false; }); };
// zumbi do lado de fora batendo na janela / entrando por ela
const bang = (z, lf, dx = 0, ph = 0) => clip(z, 'z_doorbang', lf + ph, { x: JX + dx, z: JZ - .55, ry: 0 });
const climb = (z, t) => { const k = clamp(t / 112); clip(z, 'z_climbwin', t, { x: JX, z: JZ - .3 + Math.min(1, t / 70) * 1.5, ry: 0, loop: false }); };
const WIN = C.at(3.15, .08);   // onde ele fica para pregar as tábuas (de costas para a câmera, de frente para a janela)
const hammerAt = (lf) => clip(S, 's_hammer', lf, { x: WIN.x, z: WIN.z, ry: Math.PI, ham: true });
const camIn = (c, h, sy = .76) => camOn(c, JX + .2, JZ + 1.6, h, sy);
// sobrado visto de fora (noite e saída de emergência)
const LUZ = new THREE.MeshBasicMaterial({ color: '#1d2a33' });
const SOB = sobrado(20, 40, { luz: LUZ }), SC = SOB.C;
const CONE = coneLuz(SC, -2, 0, { len: 5, wide: 4.6 });
const SCUR = SC.parede('N', 'fixtures_windows_curtains_01_25', -2, 0, { off: -.05 });
const ROPE = [SC.parede('N', 'crafted_01_1', 0, 0, { off: .04, y: WALL_H }), SC.parede('N', 'crafted_01_9', 0, 0, { off: .04 })];
const SPLK = [SC.parede('N', 'carpentry_01_15', -2, 0, { off: .04 }), SC.parede('N', 'carpentry_01_15', 2, 0, { off: .04 })];
run([
  // 0 — janela = porta da horda: zumbi se espreme pela janela e cai dentro da sala
  (lf, f, len, c) => { inside('dawn'); climb(Z[0], 20 + lf * 1.25); bang(Z[1], lf, .9, 20); camIn(c, lerp(8, 6.8, easeOut(lf / len)), .7); c.shake(lf - 40, .08); },
  // 1 — barricada = vida extra: cada batida derruba uma tábua; zerou, ele entra
  (lf, f, len, c) => { inside('dawn'); const h = [.30, .46, .62].filter(k => lf > len * k).length; planks(3 - h, 0, 1, f);
    if (lf < len * .72) bang(Z[0], lf); else climb(Z[0], (lf - len * .72) * 1.9); [.30, .46, .62].forEach(k => c.shake(lf - len * k, .1));
    if (h < 3 && lf % 30 < 4) puff(JX, 1.3, JZ + .1, lf % 30, { n: 2, seed: lf, life: 12, size: .06, rise: .1, color: '#c9a77a', op: .6 }); camIn(c, 7.2, .72); },
  // 2 — martelo, tábua e pregos: pregando por dentro
  (lf, f, len, c) => { inside('day'); planks(lf < len * .3 ? 0 : lf < len * .6 ? 1 : 2); hammerAt(lf); camIn(c, 7, .78); },
  // 3 — até 4 de cada lado: as tábuas vão subindo (1 → 4)
  (lf, f, len, c) => { inside('day'); planks(clamp(Math.floor((lf / len - .45) / .09) + 1, 0, 4)); hammerAt(lf); camIn(c, 6.6, .78); },
  // 4 — chapa de metal (fica presa na janela; faíscas do maçarico)
  (lf, f, len, c) => { inside('day'); const on = lf > len * .3; SHEET.visible = on; clip(S, 's_hammer', lf, { x: WIN.x, z: WIN.z, ry: Math.PI });
    if (on && lf < len * .9) sparks(JX + .1, 1.4 + Math.sin(f * .3) * .3, JZ + .15, lf % 14, 6, Math.floor(lf / 14)); camIn(c, 6.6, .78); },
  // 5 — barras de metal: protege e dá pra ver lá fora (o zumbi aparece entre as barras)
  (lf, f, len, c) => { inside('day'); BARS.visible = true; bang(Z[0], lf); clip(S, 's_idle', lf, { x: C.x(4.2), z: C.z(2.6), ry: face(C.x(4.2), C.z(2.6), JX, JZ) }); camIn(c, 7, .76); },
  // 6 — noite, de fora: luz acesa sai em CONE pela janela → zumbi vê e vem; cortina fechada → luz some, ele passa reto
  (lf, f, len, c) => { light('dark'); tileLuz('#55607e'); clima('', 0); SC.show(); ROPE.forEach(m => { m.visible = false; }); SPLK.forEach(m => { m.visible = false; });
    const lit = lf < len * .54; SCUR.visible = !lit; CONE.visible = lit; LUZ.color.set(lit ? '#ffcf7a' : '#3a3020'); CONE.material.opacity = .85;
    const a = SC.at(-6.5, 4.2), b = SC.at(-2.2, 1.6), e = SC.at(9, 4.6);
    const p = lit ? rota([[a.x, a.z], [b.x, b.z]], lf / 30, VEL.z_walk * 2) : rota([[b.x - 1.5, b.z + 2.6], [e.x, e.z]], (lf - len * .54) / 30, VEL.z_walk * 2.2);
    clip(Z[0], p.fim && lit ? 'z_doorbang' : 'z_walk', lf, { x: p.x, z: p.z, ry: p.fim && lit ? Math.PI : p.ry }); pose(S, { vis: false });
    camOn(c, SC.x(-1.5), SC.z(2.4), 11, .62); },
  // 7 — saída de emergência: janela do ANDAR DE CIMA, sem barricada; corda de lençol; ele desce segurando a corda
  (lf, f, len, c) => { light('dawn'); tileLuz('#f2dcc4'); clima('', 0); SC.show(); SCUR.visible = false; CONE.visible = false; LUZ.color.set('#1d2a33'); ROPE.forEach(m => { m.visible = true; }); SPLK.forEach(m => { m.visible = true; });
    const k = clamp((lf - len * .12) / (len * .7)); const y = lerp(WALL_H + .75, 0, easeOut(k));
    if (k < 1) { clip(S, 's_climbrope', lf * 1.2, { x: SC.x(0), z: SC.z(-.5) + .34, ry: Math.PI }); S.g.position.y = y; }
    else { const p = rota([[SC.x(0), SC.z(-.5) + .34], [SC.x(2.5), SC.z(3)]], (lf - len * .82) / 30, VEL.s_walk); clip(S, 's_walk', lf, { x: p.x, z: p.z, ry: p.ry }); }
    camOn(c, SC.x(.3), SC.z(.5), 10.5, .84); },
  // 8 — base sem saída é caixão: os zumbis quebram as barricadas com ele preso lá dentro
  (lf, f, len, c) => { inside('dark'); const k = lf / len; planks(Math.max(0, 4 - Math.floor(k * 4.6)), Math.max(0, 4 - Math.floor(k * 3.4)), 1, f);
    if (k < .8) bang(Z[0], lf); else climb(Z[0], (lf - len * .8) * 2.2); bang(Z[1], lf, .8, 25); clip(Z[2], 'z_doorbang', lf + 12, { x: C.x(-.5) - .55, z: C.z(3), ry: Math.PI / 2 });
    clip(S, 's_idle', lf, { x: C.x(3.2), z: C.z(3.6), ry: lerp(-2.4, 2.6, (Math.sin(T(f) * 1.6) + 1) / 2) }); [.2, .45, .7].forEach(q => c.shake(lf - len * q, .12));
    camOn(c, C.x(3.1), C.z(1.6), lerp(9.8, 8.8, k), .7); }
]);
