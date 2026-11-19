import { pose, S, Z, zWalk, splat, burst, light, bottles, sparks, puff, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;
const SX = 0, SZ = -5.2;
function attacker(z, i, lf, f, at, kind) {
  const zx = Math.max(SX + 1.0, SX + 3.4 - T(lf) * 2.2), a = clamp((lf - at) / 10);
  pose(z, { x: zx, z: SZ + .05, ry: -Math.PI / 2, ph: T(f) * 5 + i, amp: lf < at ? .55 : .1, attack: kind === 'bite' ? 0 : a, bite: kind === 'bite' ? a : 0 });
}
const hitPush = (lf, at, k = .6) => lf > at + 3 && lf < at + 15 ? Math.sin((lf - at - 3) / 12 * Math.PI) * k : 0;
run([
  // 0 — duas infecções
  (lf, f, len, c) => {
    c.cam(-.3, -4.9, lerp(6.4, 5.6, lf / len));
    pose(S, { x: SX, z: SZ, ry: face(SX, SZ, 6, 0), hold: .6, band: true, ph: 0, amp: 0 }); S.bat.visible = false;
    S.band.material.color.set('#9a7a50');
    pose(Z[0], { x: SX + 2.6, z: SZ + .6, ry: -Math.PI / 2 - .3, ph: T(f) * 2, amp: .1 });
  },
  null,
  // 2 — infecção do ferimento: bandagem suja → dor → desinfeta e troca
  (lf, f, len, c) => {
    const k3 = c.C(3) - c.C(2), k4 = c.C(4) - c.C(2), cure = k4 + 54;
    c.cam(-.3, -4.9, 4.8, 1.5); S.bat.visible = false;
    const dirt = lf < cure ? ss(k3, k3 + 40, lf) : 0;
    S.band.material.color.setRGB(lerp(.97, .45, dirt), lerp(.96, .32, dirt), lerp(.93, .18, dirt));
    pose(S, { x: SX, z: SZ, ry: face(SX, SZ, 6, 0), hold: 1, band: true, ph: 0, amp: 0, slump: lf >= k4 && lf < cure ? .45 : 0 });
    if (lf >= cure - 10) { const b = bottles[0]; b.visible = true; b.position.set(SX - .8, 0, SZ + .7); b.userData.water.scale.y = .8; b.scale.setScalar(lerp(1.8, 1.2, easeOut((lf - cure + 10) / 8))); }
    if (lf >= cure) S.band.scale.setScalar(lf < cure + 8 ? lerp(1.5, 1, (lf - cure) / 8) : 1);
  },
  // 3 — vírus zumbi: sorteado na hora do golpe
  (lf, f, len, c) => {
    const at = c.C(6) - c.C(5) + 10;
    c.shake(lf - at - 4, .12); c.cam(.6, -4.7, 5.8);
    pose(S, { x: SX, z: SZ, ry: Math.PI / 2, ph: 0, amp: 0, push: hitPush(lf, at, .6) });
    attacker(Z[0], 0, lf, f, at, 'scratch');
    burst(SX + .3, 1.3, SZ, lf - at - 4, 8, 3, -Math.PI / 2);
  },
  // 4 — arranhão 7% / corte 25% / mordida 100%
  (lf, f, len, c) => {
    const k8 = c.C(8) - c.C(7), k9 = c.C(9) - c.C(7);
    const seg = lf < k8 ? 0 : lf < k9 ? 1 : 2, l0 = [0, k8, k9][seg], l = lf - l0, at = 8, kind = ['scratch', 'cut', 'bite'][seg];
    if (seg === 2) light('red');
    c.shake(l - at - 4, [.08, .14, .24][seg]); c.cam(.6, -4.7, seg === 2 ? lerp(5.8, 4.8, clamp(l / 30)) : 5.8);
    pose(S, { x: SX, z: SZ, ry: Math.PI / 2, ph: 0, amp: 0, push: hitPush(l, at, [.4, .7, .6][seg]), slump: seg === 2 ? ss(at + 6, at + 26, l) * .7 : 0 });
    S.bat.visible = seg < 2;
    attacker(Z[seg], seg, l + 14, f, at + 14, kind);
    burst(SX + .3, seg === 2 ? 1.6 : 1.3, SZ, l - at - 4, [6, 14, 22][seg], 3 + seg * 4, -Math.PI / 2);
    if (seg >= 1 && l > at + 8) splat(SX - .2, SZ + .2, [0, .25, .45][seg]);
  },
  // 5 — desinfetar não muda a chance do vírus
  (lf, f, len, c) => {
    const k11 = c.C(11) - c.C(10);
    c.cam(-.3, -4.9, 4.8, 1.5); S.bat.visible = false;
    pose(S, { x: SX, z: SZ, ry: face(SX, SZ, 6, 0), hold: 1, band: lf > 30, ph: 0, amp: 0, slump: lf >= k11 ? .35 : 0 });
    const b = bottles[0]; b.visible = true; b.position.set(SX - .8, 0, SZ + .7); b.userData.water.scale.y = .8; b.scale.setScalar(1.2);
    splat(SX - .1, SZ + .2, .3);
  },
  // 6 — evite o golpe: acerta primeiro / não lute cansado / nem cercado / roupa grossa
  (lf, f, len, c) => {
    const k13 = c.C(13) - c.C(12), cx = 11, cz = -5.2;
    if (lf < k13) { const hit = 20; c.shake(lf - hit, .16); c.cam(cx + .8, cz, 6.4);
      pose(S, { x: cx, z: cz, ry: Math.PI / 2, swing: lf > hit - 9 && lf < hit + 9 ? (lf - hit + 9) / 18 : -1, ph: 0, amp: 0 });
      pose(Z[0], { x: Math.max(cx + 1.05, cx + 3 - T(lf) * 2.4) + ss(hit, hit + 6, lf) * .5, z: cz, ry: -Math.PI / 2, ph: T(f) * 5, amp: .5, push: lf > hit && lf < hit + 6 ? 1 : 0, fall: ss(hit + 3, hit + 12, lf) });
      burst(cx + 1.1, 1.6, cz, lf - hit, 14, 4, Math.PI / 2); puff(cx + 1.8, .15, cz, lf - hit - 12, { n: 6, seed: 4, life: 30, size: .22, spread: .5, rise: .3, color: '#8a8070' });
    } else { const l = lf - k13;
      if (l < 40) { c.cam(cx + .8, cz, 6.4); pose(S, { x: cx, z: cz, ry: Math.PI / 2, slump: .8, ph: 0, amp: 0 }); zWalk(Z[1], 1, f, Math.max(cx + 1.1, cx + 3.2 - T(l) * 1.8), cz, -Math.PI / 2, 1.1); }
      else if (l < 80) { const k = easeOut(clamp((l - 40) / 30)); c.cam(cx, cz, lerp(8, 6.5, k)); pose(S, { x: cx, z: cz, ry: Math.PI / 2 + Math.sin(T(l) * 4) * .8, ph: 0, amp: 0 });
        for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + .4, r = lerp(4.5, 1.3, k), x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r * .9; zWalk(Z[i + 2], i + 2, f, x, z, face(x, z, cx, cz), 1.1); } }
      else { const l2 = l - 80; c.cam(.6, -4.7, 5.8); S.jacketMat.color.set('#3a2216');
        pose(S, { x: SX, z: SZ, ry: Math.PI / 2, ph: 0, amp: 0 }); attacker(Z[3], 3, l2 + 14, f, 24, 'scratch'); sparks(SX + .3, 1.3, SZ, l2 - 14, 14, 8, -Math.PI / 2); }
    }
  },
  // 7 — CTA
  (lf, f, len, c) => {
    c.cam(lerp(-2, -4, lf / len), 0, lerp(11, 13, lf / len));
    const sx = -1 - T(lf) * 1.3; pose(S, { x: sx, z: .2, ry: -Math.PI / 2, ph: T(lf) * 6, amp: .6 });
    for (let i = 0; i < 6; i++) zWalk(Z[i], i, f, sx + 3.4 + (i % 3) * 1.2 + R(i), -1.6 + Math.floor(i / 3) * 1.3, -Math.PI / 2, 1);
  }
]);
