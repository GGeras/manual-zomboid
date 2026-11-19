import { pose, S, Z, zWalk, light, splat, U } from './engine.js';
import { run } from './ep3d.js';
const FACE = Math.PI / 4, CX = 0.5, CZ = 1.5, s = .82;
const at = (k, d) => ({ x: CX + k * s + d, z: CZ - k * s + d });   // k = posição na tela (esq->dir), d = profundidade (frente = +)
run([(lf, f, len, c) => {
  light('day'); c.cam(CX + .3, CZ - .3, 15.5);
  for (let i = 0; i < 6; i++) pose(Z[i], Object.assign(at(i - 2.5, -1.6), { ry: FACE, ph: 0, amp: 0 }));
  { const p = at(-2.4, .6); zWalk(Z[6], 6, 14, p.x, p.z, FACE, 1); }
  pose(Z[7], Object.assign(at(-1.2, .6), { ry: FACE, ph: 0, amp: 0, attack: 1 }));
  pose(Z[8], Object.assign(at(0.1, .6), { ry: FACE, ph: 0, amp: 0, bite: 1 }));
  { const p = at(1.5, .6); pose(Z[9], { x: p.x, z: p.z, ry: FACE + 1.2, fall: 1, ph: 0, amp: 0 }); splat(p.x + .2, p.z + .3, .45); }
  pose(S, Object.assign(at(2.7, -.3), { ry: FACE, ph: 0, amp: 0 }));
}]);
