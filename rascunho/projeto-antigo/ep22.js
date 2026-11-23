import { THREE, PZ, scene, pose, S, Z, light, puff, U } from './engine.js';
import { run } from './ep3d.js';
const { clamp, lerp, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// rua: combate com taco; a fadiga deixa o golpe mais lento (período maior) e aparecem marcas de dor (vermelho)
const SX = -2, SZ = 2.6;
function fight(lf, f, c, len, per = 24, pain = 0, o = {}) { light(o.light || 'day'); const sw = (lf % per) / per;
  pose(S, { x: SX, z: SZ, ry: Math.PI / 2, ph: 0, amp: 0, swing: sw, slump: pain * .3 }); S.bat.visible = true;
  pose(Z[0], { x: SX + 1.1, z: SZ, ry: -Math.PI / 2, ph: T(f) * 4, amp: .3, flinch: sw > .55 ? (sw - .55) * 2 : -1 });
  if (pain) for (let i = 0; i < 2; i++) puff(SX + .05, 1.45, SZ - .15, (lf + i * 11) % 22, { n: 2, seed: i, life: 22, size: .07, rise: .3, color: '#ff3d55', op: .8 * pain });
  c.cam(SX + .6, SZ - .4, lerp(o.h || 4.6, (o.h || 4.6) - .4, easeOut(lf / len)), 1.1); }
run([
  (lf, f, len, c) => fight(lf, f, c, len, 20, .2),
  (lf, f, len, c) => fight(lf, f, c, len, lerp(18, 32, lf / len), .4),
  (lf, f, len, c) => fight(lf, f, c, len, 34, .9),
  (lf, f, len, c) => fight(lf, f, c, len, 28, .3),
  (lf, f, len, c) => { light('day'); const x = SX + 1.5 - lf * .03; pose(S, { x, z: SZ, ry: -Math.PI / 2, ph: T(f) * 13, amp: 1.2, slump: .2 }); S.bat.visible = false; c.cam(x + .5, SZ - .4, 5.2, 1); },
  (lf, f, len, c) => fight(lf, f, c, len, 34, 0, { h: 4.2 }),
  (lf, f, len, c) => fight(lf, f, c, len, 20, 0),
  (lf, f, len, c) => { const ph = (lf % 60) / 60; light('day');
    if (ph < .4) fight(lf, f, c, len, 24, 0); else { pose(S, { x: SX, z: SZ, ry: Math.PI / 2, ph: 0, amp: 0, stomp: (ph - .4) / .6 }); S.bat.visible = true; pose(Z[0], { x: SX + .9, z: SZ, ry: -Math.PI / 2, clip: ['z_death', 60, false] }); c.cam(SX + .6, SZ - .4, 4.4, 1); } },
  (lf, f, len, c) => fight(lf, f, c, len, 40, 1, { light: 'dawn', h: 5 })
]);
