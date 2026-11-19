import { THREE, PZ, scene, pose, S, Z, light, puff, prop, box, U } from './engine.js';
import { run } from './ep3d.js';
import { house, HA } from './sets.js';
const { clamp, lerp, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// casa: cama (procedural, cores do jogo) no quarto do set; deitado = corpo girado sobre a cama
const k0 = HA(-2.4, -1.2);
const BED = prop(new THREE.Group()); { const fr = box(1.1, .35, 2.1, '#6a4a2a'); fr.position.y = .18; BED.add(fr); const mt = box(1, .18, 2, '#d8d2c2'); mt.position.y = .44; BED.add(mt); const pw = box(.7, .12, .35, '#f2efe6'); pw.position.set(0, .58, -.8); BED.add(pw); const bl = box(1.02, .06, 1.2, '#3e5a7a'); bl.position.set(0, .56, .35); BED.add(bl); } BED.position.set(k0.x, 0, k0.z); scene.add(BED);
const zz = (lf, x, y, z) => { for (let i = 0; i < 3; i++) puff(x, y, z, (lf + i * 16) % 48, { n: 1, seed: i, life: 48, size: .1, rise: .6, color: '#cfe8ff', op: .7 }); };
const inHouse = (dark) => { house(dark ? { dark: true } : {}); light(dark ? 'dark' : 'day'); BED.visible = true; };
const lie = (lf, c, h = 3.6) => { pose(S, { x: k0.x + .55, z: k0.z + .5, ry: -.6, ph: 0, amp: 0, sit: 1, slump: .7 }); S.bat.visible = false; zz(lf, k0.x + .4, 1.5, k0.z + .3); c.cam(k0.x + 1.1, k0.z + .5, h + .4, .9); };
const sitB = (c, o = {}, h = 4) => { pose(S, Object.assign({ x: k0.x + 1.1, z: k0.z + .4, ry: -.6, ph: 0, amp: 0, sit: 1 }, o)); S.bat.visible = false; c.cam(k0.x + .9, k0.z + .3, h, .8); };
run([
  (lf, f, len, c) => { inHouse(true); sitB(c, { slump: .6 }, 4.4); },
  (lf, f, len, c) => { inHouse(false); sitB(c, { slump: .3 + sm(lf / len) * .4 }); },
  (lf, f, len, c) => { inHouse(false); sitB(c, { slump: .3 }); puff(k0.x + 1.2, 1.4, k0.z + .4, lf % 30, { n: 2, seed: 1, life: 30, size: .08, rise: .4, color: '#ffffff', op: .5 }); },
  (lf, f, len, c) => { inHouse(true); lie(lf, c, 4); },
  (lf, f, len, c) => { inHouse(true); sitB(c, { slump: .2, ry: -1.2 }); pose(Z[0], { x: k0.x + 3.2, z: k0.z - 1.6, ry: -Math.PI / 2, ph: T(f) * 4, amp: .3 }); },
  (lf, f, len, c) => { inHouse(true); sitB(c, { slump: .4 }); for (let i = 0; i < 4; i++) puff(k0.x + 1.1, 1.3, k0.z + .4, (lf + i * 9) % 36, { n: 1, seed: i, life: 36, size: .12, rise: .5, color: '#9aa04a', op: .5 }); },
  (lf, f, len, c) => { inHouse(false); sitB(c, { hold: .8 }); },
  (lf, f, len, c) => { inHouse(false); sitB(c, { hold: .8, slump: .2 }); },
  (lf, f, len, c) => { inHouse(true); lie(lf, c, 4.6); }
]);
