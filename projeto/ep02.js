import { pose, S, Z, zWalk, splat, burst, shards, light, bottles, cans, planks, winMat, puff, glass, sparks, waves, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;
run([
  // 0 — sobreviveu ao dia 1: manhã, zumbis mortos no gramado
  (lf, f, len, c) => {
    light('dawn'); c.cam(lerp(2, 1.2, lf / len), lerp(-4.6, -5.2, lf / len), lerp(12, 10, easeOut(lf / len)));
    pose(S, { x: 1.2, z: -5.2, ry: face(1.2, -5.2, 6, 0) + Math.sin(T(f) * 2) * .15, ph: T(f) * 2, amp: .05, slump: .25 });
    [[-1.2, -4.2, 1.2], [3.2, -3.6, 2.4], [0.2, -2.6, .3], [4.2, -6.2, 4]].forEach(([x, z, r], i) => { pose(Z[i], { x, z, ry: r, fall: 1, ph: 0, amp: 0 }); splat(x + .2, z + .5, .35 + R(i) * .2); });
  },
  // 1 — a parte difícil
  (lf, f, len, c) => {
    light('red'); c.cam(1.2, -5.2, lerp(7.5, 5.8, easeOut(lf / len)));
    pose(S, { x: 1.2, z: -5.2, ry: face(1.2, -5.2, 6, 0) + Math.sin(T(lf) * 3) * .6, ph: 0, amp: 0 });
    for (let i = 0; i < 4; i++) zWalk(Z[i], i, f, 7 + i * 1.2 - T(lf) * .8, -1.5 + i * .9, -Math.PI / 2 - .3, 1);
  },
  null, // 2 — tela vermelha
  // 3 — não perca tempo com garrafas: pias e banheiras guardam água → entra em casa
  (lf, f, len, c) => {
    const k4 = c.C(4) - c.C(3);
    c.cam(-1.0, -5.4, 6.2);
    S.bat.visible = false;
    if (lf < k4) { pose(S, { x: -0.5, z: -5.6, ry: face(-.5, -5.6, 3, -1), ph: 0, amp: 0, hold: .3 });
      bottles.forEach((b, i) => { const s0 = 4 + i * 3; if (lf < s0) return; b.visible = true; const p = easeOut((lf - s0) / 6); b.position.set(-1.9 + (i % 4) * .42, 0, -4.7 + Math.floor(i / 4) * .45); b.scale.setScalar(lerp(1.6, 1, p)); b.userData.water.scale.y = .03; }); }
    else { const l = lf - k4, p = clamp(l / 40);
      pose(S, { x: lerp(-.5, -1.6, p), z: lerp(-5.6, -7.9, p), ry: Math.PI + .3, ph: T(l) * 8, amp: p < 1 ? .8 : 0, vis: p < .98 }); }
  },
  // 4 — base fora do centro: panorâmica do centro (horda) até a casa isolada
  (lf, f, len, c) => {
    const k = easeOut(clamp((lf - 18) / (len - 30)));
    c.cam(lerp(11, -21, k), lerp(-4.5, -5, k), 9);
    for (let i = 0; i < 12; i++) zWalk(Z[i], i, f, 8 + (i % 4) * 1.4 + R(i) * .8, -2.5 - Math.floor(i / 4) * 1.3 - R(i + 2) * .6, R(i + 5) * 6.28, .7);
    pose(S, { x: -21.5, z: -5.2, ry: face(-21.5, -5.2, -15, 0), ph: T(f) * 2, amp: .05 });
  },
  // 5 — tábuas na janela; depois a janela sem tábuas, zumbi entrando
  (lf, f, len, c) => {
    const k10 = c.C(9) - c.C(7);
    if (lf < k10) {
      c.shake((lf - 12) % 14, .06);
      c.cam(12.9, -6.6, 5.6, 1.7);
      S.bat.visible = false; S.hammer.visible = true;
      const sw = lf > 8 ? ((lf - 8) % 14) / 14 : -1;
      pose(S, { x: 12.4, z: -6.9, ry: Math.PI, swing: sw, ph: 0, amp: 0 });
      planks.forEach((p, i) => { const s0 = 14 + i * 16; if (lf >= s0) { p.visible = true; p.scale.setScalar(lerp(1.3, 1, easeOut((lf - s0) / 6))); } });
      for (let n = 0; n < 4; n++) { const hit = 22 + n * 14; puff(12.4 + (R(n) - .5) * .8, 1.1 + (n % 3) * .36, -7.75, lf - hit, { n: 4, seed: n * 9, life: 26, size: .16, rise: .5, color: '#c8b89a' }); sparks(12.4, 1.4, -7.8, lf - hit, 6, n * 5, 0); }
    } else {
      light('red'); const l = lf - k10, wx = 1.4, wz = -7.9;
      c.cam(wx + .9, wz + 2.6, 6.4, 1.9); S.g.visible = false;
      const pj = clamp((l - 4) / 26); const z = lerp(-4.4, -8.4, pj), y = Math.sin(clamp((pj - .6) / .4) * Math.PI) * .7;
      zWalk(Z[0], 0, f, wx, z, Math.PI, 1.3, { vis: pj < .97 }); Z[0].g.position.y = y;
      const pj2 = clamp((l - 22) / 26); zWalk(Z[1], 1, f, wx + .4, lerp(-3.4, -8.4, pj2), Math.PI, 1.3, { vis: pj2 < .97 }); Z[1].g.position.y = Math.sin(clamp((pj2 - .6) / .4) * Math.PI) * .7;
      glass(wx, 1.2, wz + .2, l - 22, 12, 4, 0);
    }
  },
  // 6 — enlatados
  (lf, f, len, c) => {
    c.cam(-0.95, -4.95, 5.8);
    pose(S, { x: -0.5, z: -5.4, ry: face(-.5, -5.4, 4, -1), ph: T(f) * 2, amp: .04 });
    const pos = [[0, 0, 0], [.18, 0, 0], [.36, 0, 0], [.54, 0, 0], [.09, .16, 0], [.27, .16, 0], [.45, .16, 0], [.18, .32, 0], [.36, .32, 0], [.27, .48, 0]];
    cans.forEach((cn, i) => { const s0 = 6 + i * 4; if (lf < s0) return; cn.visible = true; const a = (lf - s0) / 6, fallY = a < 1 ? (1 - a * a) * 1.4 : 0, sq = a >= 1 && a < 2 ? 1 - Math.sin((a - 1) * Math.PI) * .25 : 1;
      cn.position.set(-1.6 + pos[i][0], pos[i][1] + fallY, -4.5); cn.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)); });
  },
  // 7 — durma (noite, casa) / cansaço na briga
  (lf, f, len, c) => {
    const k15 = c.C(14) - c.C(13);
    if (lf < k15) { light('dark'); winMat.emissiveIntensity = lf > 10 ? .2 : .9; c.cam(0, -8.5, 9, 2.2); S.g.visible = false; }
    else { const l = lf - k15, cx = 11, cz = -5.2; c.cam(cx + .6, cz, 6.4);
      const sw = l > 14 && l < 50 ? (l - 14) / 36 : -1;
      pose(S, { x: cx, z: cz, ry: Math.PI / 2, slump: .55, swing: sw, ph: 0, amp: 0, push: l > 40 && l < 56 ? Math.sin((l - 40) / 16 * Math.PI) * .8 : 0 });
      c.shake(l - 42, .14);
      zWalk(Z[0], 0, f, Math.max(cx + 1.1, cx + 3 - T(l) * 1.4), cz, -Math.PI / 2, 1.1); }
  },
  // 8 — CTA: sai andando; a horda e o barulho chegando
  (lf, f, len, c) => {
    c.cam(lerp(-2, -4, lf / len), 0, lerp(11, 13, lf / len));
    const sx = -1 - T(lf) * 1.3; pose(S, { x: sx, z: .2, ry: -Math.PI / 2, ph: T(lf) * 6, amp: .6 });
    const k17 = c.C(16) - c.C(15);
    waves(sx + 5, -1, lf - k17, { period: 9, life: 40, maxR: 9, color: '#ffe27a' });
    for (let i = 0; i < 14; i++) { const st = i < 3 ? 0 : k17 + (i - 3) * 3; if (lf < st) continue;
      zWalk(Z[i], i, f, sx + 3.2 + (i % 4) * 1.1 + R(i) + (i < 3 ? 0 : 1.5) + Math.max(0, 1 - T(lf - st)) * 2, -2 + Math.floor(i / 4) * 1.2 + R(i + 3) * .8, -Math.PI / 2, 1); }
  }
]);
