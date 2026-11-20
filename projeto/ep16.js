import { THREE, PZ, scene, pose, S, Z, zWalk, light, puff, waves, prop, U } from './engine.js';
import { run } from './ep3d.js';
import { fazenda, camOn, rota, VEL, clima, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut, face, T, R } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// EP16 v2 (revisão 2026-11-20): fazenda com os sprites do jogo, UM CERCADO POR ESPÉCIE (espécies juntas estressam e o bicho
// bate na cerca até fugir). Vaca no cercado A, ovelha no B, galo + galinhas no C. Animações ORIGINAIS: s_walk (puxando a corda),
// s_petcow / s_petsheep, s_milk, s_shear, s_shout (grito que estressa). Animais andam/correm de verdade (sem andar no lugar).
const FZ = fazenda(-10, 75), C = FZ.C;
const W = (i, j) => C.at(i, j);
// limites internos dos cercados (mundo), para os animais não atravessarem a cerca
const PEN = { A: [C.x(-11) - .3, C.x(-3) + .3, C.z(-8) - .3, C.z(-1) + .3], B: [C.x(2) - .3, C.x(10) + .3, C.z(-8) - .3, C.z(-1) + .3], C: [C.x(2) - .3, C.x(8) + .3, C.z(2) - .3, C.z(7) + .3] };
const SCALE = { a_cow: .74, a_sheep: .82, a_hen: 1, a_rooster: 1 };   // tamanho relativo ao personagem como no jogo (vaca na altura do peito)
const mk = (n, p, ry) => { const a = PZ.animal(n, 1.94 * SCALE[n]); a.position.set(p.x, 0, p.z); a.rotation.y = ry; prop(a); return { g: a, home: new THREE.Vector3(p.x, 0, p.z), ry, pen: null }; };
const COW = mk('a_cow', W(-6, -4.5), .9), COW2 = mk('a_cow', W(-9, -6.2), -.4), SHEEP = mk('a_sheep', W(6, -4.4), 2.2), SHEEP2 = mk('a_sheep', W(8.3, -6), .5), ROOST = mk('a_rooster', W(5, 4.6), 2.6);
COW.pen = COW2.pen = 'A'; SHEEP.pen = SHEEP2.pen = 'B'; ROOST.pen = 'C';
const HENS = [[3.4, 3.6, .3], [6.5, 3.2, 1.4], [4.2, 6.1, 2.6], [7.1, 5.6, -.8], [3.1, 5.2, 1.9]].map(([i, j, r]) => { const h = mk('a_hen', W(i, j), r); h.pen = 'C'; return h; });
const ALL = [COW, COW2, SHEEP, SHEEP2, ROOST, ...HENS];
// cerca que balança quando o bicho bate: guarda as peças de cerca do cercado A e B
const FENCE = []; C.G.children.forEach(m => { if (/^fencing_01_1[67]$/.test(m.userData.tile || '') && m.position.z < 0) FENCE.push(m); });
// vida dos animais. o.stress 0..1: correm em linha reta de uma cerca à outra e batem nela (recuam, a cerca treme)
function animals(f, o = {}) { const st = o.stress || 0;
  ALL.forEach((a, i) => { const g = a.g; g.visible = true; g.position.copy(a.home); g.rotation.set(0, a.ry, 0);
    if (st > .02 && a.pen !== 'C' && a !== o.skip) { const [x0, x1, z0, z1] = PEN[a.pen], ang = a.ry + (i % 2 ? .6 : -.5), dx = Math.sin(ang), dz = Math.cos(ang);
      // vai e volta entre as cercas (período 2,2 s), batendo nas pontas
      const span = 2.6, ph = ((T(f) + R(i) * 3) / 2.2) % 1, tri = ph < .5 ? ph * 2 : 2 - ph * 2, d = (tri - .5) * span * st * 2;
      let x = a.home.x + dx * d, z = a.home.z + dz * d; x = clamp(x, x0 + .4, x1 - .4); z = clamp(z, z0 + .4, z1 - .4); g.position.set(x, Math.abs(Math.sin(T(f) * 16 + i)) * .06 * st, z);
      g.rotation.y = ph < .5 ? ang : ang + Math.PI; const hit = Math.min(Math.abs(ph - .5), ph, 1 - ph) < .04; if (hit) { g.rotation.z = .12 * st; } }
    else if (st > .02 && a.pen === 'C') { const k = T(f) * 9 + i * 2; g.position.x += Math.sin(k) * .35 * st; g.position.z += Math.cos(k * .7) * .3 * st; g.rotation.y = k; g.position.y = Math.abs(Math.sin(k * 2)) * .12 * st; }
    else g.position.y = Math.abs(Math.sin(T(f) * 1.4 + i)) * .006; });
  FENCE.forEach((m, i) => { m.position.y = 0; m.rotation.z = 0; if (st > .05) { const k = Math.max(0, Math.sin(T(f) * 2.85 * Math.PI + i * 1.3)); m.rotation.z = Math.pow(k, 18) * .06 * st; } }); }
const ROPE = prop(new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 12 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: '#c8a96a' })));
function rope(a, b, sag = .25) { ROPE.visible = true; const p = ROPE.geometry.attributes.position; for (let i = 0; i < 12; i++) { const t = i / 11; p.setXYZ(i, lerp(a.x, b.x, t), lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * sag, lerp(a.z, b.z, t)); } p.needsUpdate = true; }
const handL = () => { S.g.updateMatrixWorld(true); return S.pz.bones.Bip01_L_Hand.getWorldPosition(new THREE.Vector3()); };
const hearts = (x, y, z, lf) => { for (let i = 0; i < 3; i++) puff(x, y, z, (lf + i * 14) % 42, { n: 1, seed: i, life: 42, size: .1, rise: .5, color: '#ff8fb0', op: .7 }); };
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false] }, o)); S.bat.visible = false; S.hammer.visible = false; };
const base = (kind = 'day') => { light(kind); tileLuz(kind === 'dawn' ? '#ffe6cc' : '#ffffff'); clima('', 0); C.show(); };
const TRILHA = W(-.5, 1.2);
run([
  // 0 — animais da B42: a fazenda inteira, um cercado para cada espécie
  (lf, f, len, c) => { base('dawn'); animals(f); clip('s_idle', lf, { x: TRILHA.x, z: TRILHA.z, ry: Math.PI * 1.05 }); camOn(c, C.x(-.5), C.z(-2.6), lerp(17, 15, easeOut(lf / len)), .56); },
  // 1 — leva a vaca na corda pela trilha até o portão do cercado A (anda de verdade; a vaca segue atrás)
  (lf, f, len, c) => { base(); animals(f, { skip: COW }); const path = [[C.x(-14), C.z(.5)], [C.x(-2.2), C.z(.5)]];
    // anda para a direita (leste): a vaca vem atrás, do lado de lá (não cobre o personagem)
    const v = VEL.s_walk * .82, L = Math.hypot(path[1][0] - path[0][0], path[1][1] - path[0][1]), dS = Math.min(1.9 + lf / 30 * v, L);
    const p = rota(path, dS / v, v); p.fim = dS >= L; clip(p.fim ? 's_idle' : 's_walk', lf * .82, { x: p.x, z: p.z, ry: p.ry }); const q = rota(path, (dS - 1.9) / v, v);
    const cw = COW.g; cw.visible = true; cw.position.set(q.x, Math.abs(Math.sin(T(f) * 7)) * .03 * (p.fim ? 0 : 1), q.z); cw.rotation.set(0, q.ry, 0);
    rope(handL(), new THREE.Vector3(q.x + Math.sin(q.ry) * .95, 1.05, q.z + Math.cos(q.ry) * .95), p.fim ? .3 : .12); camOn(c, p.x - .8, p.z, 9, .8); },
  // 2 — comida, água e calma: olhando a vaca calma no cercado dela
  (lf, f, len, c) => { base(); animals(f); const p = W(-2.2, -3.6); clip('s_idle', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, COW.home.x, COW.home.z) }); camOn(c, p.x - 1.2, p.z, 9.2, .82); },
  // 3 — cochos: um com ração, outro com água (dentro do cercado A)
  (lf, f, len, c) => { base(); animals(f); const p = W(-5.2, -6.2); clip('s_idle', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, C.x(-6), C.z(-7)) }); camOn(c, p.x, p.z, 7.4, .8); },
  // 4 — zumbis do lado de fora não atacam, mas estressam; o GRITO (s_shout + "Hey!" do jogo) faz os bichos correrem e baterem na cerca
  (lf, f, len, c) => { base('dawn'); const shout = lf > len * .62 && lf < len * .78, st = sm((lf - len * .40) / (len * .2)) * .7 + (lf > len * .62 ? .3 : 0);
    animals(f, { stress: st }); [[-13.5, -6], [-13.5, -3.6], [-13.8, -1.6]].forEach(([i, j], n) => zWalk(Z[[1, 4, 7][n]], n, f, C.x(i), C.z(j) + Math.sin(T(f) * .4 + n) * .4, Math.PI / 2 + .3, .5));
    const p = W(-1.4, 1.4); if (lf > len * .58) clip(shout ? 's_shout' : 's_idle', shout ? lf - len * .62 : lf, { x: p.x, z: p.z, ry: face(p.x, p.z, COW.home.x, COW.home.z), loop: !shout }); else pose(S, { vis: false });
    waves(COW.home.x, COW.home.z, (lf - len * .22) % 40, { color: '#efe5cf', maxR: 4 }); camOn(c, C.x(-6.5), C.z(-2.6), 14, .62); },
  // 5 — galinheiro: galinhas e galo no cercado C
  (lf, f, len, c) => { base(); animals(f); const p = W(9.3, 5.4); clip('s_idle', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, ROOST.home.x, ROOST.home.z) }); camOn(c, p.x - 2.2, p.z - 1, 9, .76); },
  // 6 — leite (ordenha na vaca) e lã (tosquia na ovelha)
  (lf, f, len, c) => { base(); animals(f); const wool = lf > len * .64, a = wool ? SHEEP : COW, side = wool ? .95 : 1.25; const p = { x: a.home.x + Math.sin(a.ry + Math.PI / 2) * side, z: a.home.z + Math.cos(a.ry + Math.PI / 2) * side };
    clip(wool ? 's_shear' : 's_milk', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, a.home.x, a.home.z) }); camOn(c, a.home.x, a.home.z, 7.2, .76); },
  // 7 — acariciar a ovelha (animação original do jogo) acalma
  (lf, f, len, c) => { base(); animals(f); const s = SHEEP.home, p = { x: s.x + Math.sin(SHEEP.ry + Math.PI / 2) * .9, z: s.z + Math.cos(SHEEP.ry + Math.PI / 2) * .9 };
    clip('s_petsheep', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, s.x, s.z) }); hearts(s.x, 1.0, s.z, lf); camOn(c, s.x, s.z, 5.6, .74); },
  // 8 — fazenda bem cuidada
  (lf, f, len, c) => { base('dawn'); animals(f); clip('s_idle', lf, { x: TRILHA.x, z: TRILHA.z, ry: Math.PI * 1.05 }); camOn(c, C.x(-.5), C.z(-2.6), lerp(16, 14.5, easeOut(lf / len)), .56); }
]);
