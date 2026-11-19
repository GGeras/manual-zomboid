import { pose, S, Z, zWalk, splat, burst, shards, light, gen, heli, rotor, cars, sirenMat, alarmLight, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;
const ring = (n, cx, cz, r0, r1, k, i) => { const a = i / n * 6.283 + R(i) * .4, r = lerp(r0, r1, k); return [cx + Math.cos(a) * r, cz + Math.sin(a) * r * .9]; };
import { waves, puff, glass, sparks, flashAt, beam, beamSpot } from './engine.js';
run([
  // 0 — esse som chama a horda: ondas saem do sobrevivente, zumbis viram e vêm
  (lf, f, len, c) => {
    c.cam(0, -5, lerp(11, 8.5, easeOut(lf / len)));
    pose(S, { x: 0, z: -5, ry: .8, ph: 0, amp: 0 });
    waves(0, -5, lf - 4, { period: 12, life: 40, maxR: 10 });
    for (let i = 0; i < 9; i++) { const st = 18 + i * 2, k = easeOut(clamp((lf - st) / 60)); const [x, z] = ring(9, 0, -5, 7.5, 4.5, k, i); const turn = ss(6 + i, 16 + i, lf);
      zWalk(Z[i], i, f, x, z, lerp(R(i) * 6.28, face(x, z, 0, -5), turn), lf > st ? 1 : .15); }
  },
  null, // 1 — vermelho
  // 2 — tiro
  (lf, f, len, c) => {
    const shot = 12, k3 = c.C(3) - c.C(2), k4 = c.C(4) - c.C(2);
    c.shake(lf - shot, .22);
    const wide = ss(k3, k3 + 24, lf); c.cam(lerp(.8, 0, wide), lerp(-5.2, -4, wide), lerp(6.5, 17, easeOut(wide)));
    S.bat.visible = false; S.gun.visible = true; S.flash.visible = lf >= shot && lf < shot + 2;
    pose(S, { x: 0, z: -5.2, ry: Math.PI / 2, aim: lf < k4 + 6 ? 1 : 1 - ss(k4 + 6, k4 + 16, lf), kick: lf >= shot && lf < shot + 5 ? 1 - (lf - shot) / 5 : 0, ph: 0, amp: 0 });
    pose(Z[0], { x: 2.6, z: -5.2, ry: -Math.PI / 2, ph: T(f) * 5, amp: lf < shot ? .5 : 0, fall: ss(shot, shot + 8, lf) });
    burst(2.6, 1.6, -5.2, lf - shot, 16, 5, Math.PI / 2); if (lf > shot + 8) splat(3.1, -5.1, .4);
    if (lf >= shot && lf < shot + 3) flashAt(.8, 1.5, -5.2, '#ffd27a', 90, 9);
    puff(.9, 1.45, -5.2, lf - shot, { n: 5, seed: 3, life: 36, size: .14, spread: .2, rise: .7, color: '#cfcac0', op: .5 });
    Z[0].g.position.x += Math.sin(clamp((lf - shot) / 4) * Math.PI / 2) * .4 * (lf >= shot ? 1 : 0);
    waves(0, -5.2, lf - shot, { period: 7, life: 70, maxR: 26, until: 14, color: '#ffe27a' });
    for (let i = 1; i < 15; i++) { if (lf < k3) continue; const k = clamp((lf - k3 - (i % 5) * 3) / 90); const [x, z] = ring(14, 0, -5, 13, 7, k, i); zWalk(Z[i], i, f, x, z, face(x, z, 0, -5), 1.1); }
  },
  // 3 — alarme de casa
  (lf, f, len, c) => {
    const hit = 14, wx = 1.4, wz = -7.9, k7 = c.C(7) - c.C(5);
    c.shake(lf - hit, .14); c.cam(wx + .6, wz + 3.2, lerp(7, 9.5, ss(k7, k7 + 30, lf)), 1.9);
    pose(S, { x: wx, z: -6.9, ry: Math.PI, swing: lf > 4 && lf < 22 ? (lf - 4) / 18 : -1, ph: 0, amp: 0 });
    glass(wx, 1.5, wz + .2, lf - hit, 16, 2, 0); if (lf > hit + 4) flashAt(wx, 2.4, -6.6, '#ff2030', Math.floor((lf - hit) / 6) % 2 ? 0 : 30, 12);
    shards.forEach(({ m, ex, ey }, i) => { const p = clamp((lf - hit - i) / 14); if (p > 0) { m.position.set(ex * (1 + p * .3), ey - p * p * 2.2, .05 + p * 1.1); m.rotation.x = p * 3; m.material.opacity = .85 * (1 - p); } });
    if (lf > hit + 4) { const on = Math.floor((lf - hit) / 6) % 2 === 0; sirenMat.emissiveIntensity = on ? 2.2 : .1; alarmLight.intensity = on ? 40 : 0; }
    waves(2.6, -8.2, lf - hit - 4, { period: 8, life: 44, maxR: 15, color: '#ff4050' });
    for (let i = 0; i < 10; i++) { if (lf < k7 - 10) continue; const k = clamp((lf - k7 + 10 - i * 2) / 110); const [x, z] = ring(10, wx, -6.2, 11, 4, k, i); zWalk(Z[i], i, f, x, z, face(x, z, wx, -6.2), 1.1); }
  },
  // 4 — alarme de carro
  (lf, f, len, c) => {
    const hit = 16, car = cars[0], cx = car.position.x, cz = car.position.z;
    c.shake(lf - hit, .12); c.cam(cx + .1, cz + .7, lerp(8, 10.5, ss(24, len, lf)), 1.2);
    pose(S, { x: cx + .2, z: cz + 1.35, ry: Math.PI, swing: lf > 6 && lf < 24 ? (lf - 6) / 18 : -1, ph: 0, amp: 0 });
    glass(cx - .2, 1.2, cz + .8, lf - hit, 14, 9, 0);
    if (lf > hit) flashAt(cx + 2.4, .8, cz, '#ffd84a', Math.floor((lf - hit) / 5) % 2 ? 0 : 26, 9);
    if (lf > hit) car.userData.lm.emissiveIntensity = Math.floor((lf - hit) / 5) % 2 ? .1 : 1.8;
    waves(cx, cz, lf - hit, { period: 9, life: 40, maxR: 13, color: '#ffd84a' });
    for (let i = 0; i < 8; i++) { const k = clamp((lf - hit - 6 - i * 2) / 70); if (k <= 0) continue; const [x, z] = ring(8, cx, cz, 10, 4.5, k, i); zWalk(Z[i], i, f, x, z, face(x, z, cx, cz), 1.1); }
  },
  // 5 — gerador
  (lf, f, len, c) => {
    const k12 = c.C(12) - c.C(10);
    gen.visible = true;
    if (lf < k12) { const gx = 3.5, gz = -5; gen.position.set(gx + Math.sin(f * 2.1) * .02, 0, gz); gen.rotation.y = .4;
      c.cam(gx, gz, lerp(6.5, 9, lf / k12));
      pose(S, { x: gx - 1.4, z: gz + .4, ry: face(gx - 1.4, gz + .4, gx, gz), ph: 0, amp: 0 });
      waves(gx, gz, lf - 4, { period: 14, life: 42, maxR: 9, color: '#d8d0b0' });
      for (let j = 0; j < 3; j++) puff(gx - .55, .75, gz + .1, (lf + j * 13) % 40, { n: 3, seed: j * 7 + Math.floor((lf + j * 13) / 40) * 3, life: 40, size: .2, spread: .15, rise: 1.4, color: '#6a6660', op: .5 });
      for (let i = 0; i < 8; i++) { const k = clamp((lf - 14 - i * 3) / 90); if (k <= 0) continue; const [x, z] = ring(8, gx, gz, 10, 3.6, k, i); zWalk(Z[i], i, f, x, z, face(x, z, gx, gz), 1); }
    } else { const l = lf - k12, gx = 14, gz = 1.6; gen.position.set(gx + Math.sin(f * 2.1) * .02, 0, gz);
      c.cam(lerp(6, 6.5, l / 60), -3, 19);
      pose(S, { x: -1.6, z: -6.6, ry: face(-1.6, -6.6, 6, 0), ph: 0, amp: 0 });
      waves(gx, gz, l, { period: 14, life: 42, maxR: 9, color: '#d8d0b0' });
      for (let i = 0; i < 8; i++) { const [x, z] = ring(8, gx, gz, 3.4, 3.2, .5, i); zWalk(Z[i], i, f, x, z, face(x, z, gx, gz), .6); }
    }
  },
  // 6 — helicóptero (invisível no jogo: só o som). Aparece de dia, te vê na rua e passa a te seguir com a horda.
  (lf, f, len, c) => {
    const k15 = c.C(15) - c.C(13);
    const hx = lf < k15 ? lerp(16, 1.5, easeOut(lf / k15)) : 0, sx = lf < k15 ? 0 : T(lf - k15) * 1.6, follow = lf >= k15;
    const px = follow ? sx + .2 : hx, pz = follow ? .1 : -1;
    c.cam(lerp(5, sx + .5, ss(0, k15, lf)), -1.2, lerp(16, 12, ss(0, k15, lf)), 1.6);
    pose(S, { x: sx, z: .1, ry: follow ? Math.PI / 2 : -Math.PI / 2 + .3, ph: T(lf) * 9, amp: follow ? .9 : 0, look: follow ? 0 : Math.sin(T(lf) * 3) * .6 });
    waves(px, pz, lf, { period: 9, life: 34, maxR: 6, color: '#ffffff', y: .06 });
    if (follow) for (let i = 0; i < 14; i++) { const l = lf - k15 - (i % 5) * 4; if (l < 0) continue; const ang = R(i) * 6.28, r = lerp(10, 4.5, clamp(l / 80)); const x = sx + Math.cos(ang) * r, z = .1 + Math.sin(ang) * r * .8; zWalk(Z[i], i, f, x, z, face(x, z, sx, .1), 1.2); }
  },
  // 7 — fique dentro de casa antes dele chegar: ele passa e não te segue
  (lf, f, len, c) => {
    const p = clamp(lf / 26), hx = lerp(14, -14, lf / len);
    c.cam(0, -4.5, 11, 1.6);
    pose(S, { x: -1.6, z: lerp(-5.4, -7.9, p), ry: Math.PI, ph: T(lf) * 9, amp: p < 1 ? .9 : 0, vis: p < .98 });
    waves(hx, -1, lf, { period: 9, life: 34, maxR: 6, color: '#ffffff', y: .06 });
    for (let i = 0; i < 4; i++) zWalk(Z[i], i, f, hx + 2 + i * 1.3, -1.5 + (i % 2), -Math.PI / 2, .8);
  },
  // 8 — já te viu: fuja pra longe da base (senão a horda cerca a casa)
  (lf, f, len, c) => {
    const half = Math.round(len * .55);
    if (lf < half) { const sx = 2 + T(lf) * 3.2;
      c.cam(sx - 1.5, -2, 13, 1.6);
      pose(S, { x: sx, z: 0, ry: Math.PI / 2, ph: T(lf) * 11, amp: 1, lean: .2 });
      waves(sx + .2, 0, lf, { period: 9, life: 34, maxR: 6, color: '#ffffff', y: .06 });
      for (let i = 0; i < 14; i++) { const x = sx - 3 - (i % 5) * 1.1 - R(i) * 1.5, z = -1.6 + Math.floor(i / 5) * 1.2 + R(i + 2) * .6; zWalk(Z[i], i, f, x, z, Math.PI / 2, 1.3); }
    } else { const l = lf - half, k = easeOut(clamp(l / 40)); light('red');
      c.cam(0, -8, 14, 1.6); S.g.visible = false;
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28, r = lerp(9, 5.2, k), x = Math.cos(a) * r, z = -11.5 + Math.sin(a) * r * .8; zWalk(Z[i], i, f, x, z, face(x, z, 0, -11.5), 1.1); }
      waves(0, -11.5, l, { period: 9, life: 34, maxR: 6, color: '#ffffff', y: .06 });
    }
  },
  // 9 — CTA: andando agachado, em silêncio, entre zumbis distraídos
  (lf, f, len, c) => {
    const sx = -2 + T(lf) * .9;
    c.cam(sx + .6, -4.4, 7);
    light('dark'); pose(S, { x: sx, z: -5, ry: Math.PI / 2, ph: T(lf) * 4, amp: .5, crouch: .7, lean: .45, look: Math.sin(T(lf) * 2) * .5 });
    [[2.5, -2.4, 2.2], [4.5, -6.8, 4], [-.5, -1.8, .6]].forEach(([x, z, r], i) => pose(Z[i], { x, z, ry: r + Math.sin(T(f) + i) * .3, ph: T(f) * 1.5 + i, amp: .08 }));
  }
]);
