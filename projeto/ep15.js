import { THREE, PZ, scene, pose, S, Z, zWalk, light, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { house, HA } from './sets.js';
const { clamp, lerp, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// rua: zumbi ataca; casa: sobrevivente sentado no chão se tratando
const SX = -2, SZ = 2.6;
const blood = (x, y, z, lf, k = 1) => { for (let i = 0; i < 3; i++) puff(x, y, z, (lf + i * 9) % 26, { n: 2, seed: i, life: 26, size: .05 * k, rise: -.6, color: '#8a1010', op: .9 }); };
const treat = (lf, c, o = {}, cam = 3.8) => { house({}); light('day'); const k = HA(-2.2, .4);
  pose(S, Object.assign({ x: k.x, z: k.z, ry: .7, ph: 0, amp: 0, sit: 1, hold: .7 }, o)); S.bat.visible = false; c.cam(k.x + .4, k.z - .2, cam, .7); return k; };
const attack = (lf, f, c, bite = false, len = 60) => { light('dawn'); pose(S, { x: SX, z: SZ, ry: Math.PI / 2, ph: 0, amp: 0, flinch: lf > 30 ? clamp((lf - 30) / 20) : -1 }); S.bat.visible = false;
  const a = clamp((lf - 10) / 30); pose(Z[0], { x: SX + 1.5 - a * .7, z: SZ, ry: -Math.PI / 2, ph: T(f) * 5, amp: .3, attack: bite ? 0 : a, bite: bite ? a : 0 });
  if (lf > 30) blood(SX + .1, 1.3, SZ, lf - 30, bite ? 1.6 : 1); c.cam(SX + .8, SZ - .3, lerp(5, 4.4, easeOut(lf / len)), 1.1); };
run([
  // 0 — gancho (3D da cena antiga 0)
  (lf, f, len, c) => attack(lf, f, c, false, len),
  // 1 — duas infecções (tela) (3D da cena antiga 9)
  (lf, f, len, c) => attack(lf, f, c, true, len),
  // 2 — infecção da ferida (3D da cena antiga 1)
  (lf, f, len, c) => { treat(lf, c, { slump: .3 }); },
  // 3 — painel de saúde (tela) (3D da cena antiga 0)
  (lf, f, len, c) => attack(lf, f, c, false, len),
  // 4 — tratamentos (3D da cena antiga 2)
  (lf, f, len, c) => { treat(lf, c, { hold: 1 }); },
  // 5 — fratura (3D da cena antiga 6)
  (lf, f, len, c) => { treat(lf, c, { hold: .5, slump: .2 }); },
  // 6 — vidro (3D da cena antiga 4)
  (lf, f, len, c) => { const k = treat(lf, c, { hold: 1, lean: .25 }, 3.4); if (lf < 70) blood(k.x + .2, .6, k.z + .2, lf); },
  // 7 — bala (3D da cena antiga 5)
  (lf, f, len, c) => { treat(lf, c, { hold: 1, lean: .2 }); },
  // 8 — curativo sujo (3D da cena antiga 7)
  (lf, f, len, c) => { treat(lf, c, { hold: 1 }); },
  // 9 — tratar infecção (3D da cena antiga 8)
  (lf, f, len, c) => { treat(lf, c, { hold: .8 }, 4.4); },
  // 10 — mordida: sem cura (3D da cena antiga 9)
  (lf, f, len, c) => attack(lf, f, c, true, len)
]);
