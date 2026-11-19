import { THREE, PZ, scene, pose, S, light, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { house, HA, HX, HZ, fire, potAt } from './sets.js';
const { clamp, lerp, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// fogueira no quintal da casa (grama do set da casa), panela original do jogo sobre ela
const FXp = HX + 5.5, FZp = HZ + 4.5;
const POT = PZ.itemModel('cookingpot'); POT.visible = false; scene.add(POT);
const potOn = (y = .42) => { POT.visible = true; POT.position.set(FXp, y, FZp); };
const cook = (o = {}) => { pose(S, Object.assign({ x: FXp - 1.0, z: FZp + .9, ry: face(FXp - 1.0, FZp + .9, FXp, FZp), ph: 0, amp: 0, crouch: .7, lean: .25 }, o)); S.bat.visible = false; };
const steam = (lf, col = '#e8e8e8', op = .45, n = 4) => { for (let i = 0; i < n; i++) puff(FXp, .7, FZp, (lf + i * 8) % 32, { n: 2, seed: i, life: 32, size: .16, rise: .9, color: col, op }); };
const yard = (f) => { house({}); light('dawn'); fire(FXp, FZp, f); };
const camYard = (c, h, lf, len) => c.cam(FXp - .6, FZp + .5, lerp(h, h - .6, easeOut(lf / len)), .8);
run([
  // 0 — achou a comida (cozinha)
  (lf, f, len, c) => { house({}); light('day'); const k = HA(-2, 0); pose(S, { x: k.x, z: k.z, ry: .8, ph: 0, amp: 0, hold: .7 }); S.bat.visible = false; c.cam(k.x + .5, k.z - .3, lerp(5, 4.4, lf / len), 1); },
  // 1 — fogão sem energia: casa escura
  (lf, f, len, c) => { house({ dark: true }); light('dark'); const k = HA(-2, 0); pose(S, { x: k.x, z: k.z, ry: .8, ph: 0, amp: 0, slump: .3 }); S.bat.visible = false; c.cam(k.x + .5, k.z - .3, 5, 1); },
  // 2 — fogueira
  (lf, f, len, c) => { yard(f); cook({ crouch: .5 }); camYard(c, 5.6, lf, len); },
  // 4 — carne crua: cozinha primeiro
  (lf, f, len, c) => { yard(f); potOn(); cook({ hold: .6 }); steam(lf); camYard(c, 4.4, lf, len); },
  // 3 — panela: ensopado
  (lf, f, len, c) => { yard(f); potOn(); cook(); steam(lf); camYard(c, 4.6, lf, len); },
  // 5 — esqueceu: queimou (fumaça preta)
  (lf, f, len, c) => { const b = sm((lf - 40) / 50); yard(f); potOn(); pose(S, { x: FXp - 2.0, z: FZp + 1.5, ry: face(FXp - 2.0, FZp + 1.5, FXp, FZp), ph: 0, amp: 0, slump: b * .3 }); S.bat.visible = false;
    steam(lf, b > .4 ? '#2a2420' : '#e8e8e8', .4 + b * .3, 5); c.cam(FXp - 1.2, FZp + 1.0, 5.4, 1); },
  // 6 — podre: só com culinária 7
  (lf, f, len, c) => { yard(f); potOn(); cook({ slump: .3 }); c.cam(FXp - .6, FZp + .5, 4.4, .8); },
  // 7 — ferver a água
  (lf, f, len, c) => { yard(f); potOn(); cook(); const b = sm((lf - 20) / 40); for (let i = 0; i < 6; i++) puff(FXp + Math.sin(i) * .1, .62, FZp, (lf + i * 5) % 18, { n: 1, seed: i, life: 18, size: .05, rise: .2, color: '#ffffff', op: .8 * b }); steam(lf, '#ffffff', .5 * b); camYard(c, 4.2, lf, len); },
  // 8 — comer bem
  (lf, f, len, c) => { yard(f); potOn(); pose(S, { x: FXp - 1.1, z: FZp + 1.0, ry: face(FXp - 1.1, FZp + 1.0, FXp, FZp), ph: 0, amp: 0, sit: 1, hold: .6 }); S.bat.visible = false; steam(lf); camYard(c, 5.4, lf, len); }
]);
