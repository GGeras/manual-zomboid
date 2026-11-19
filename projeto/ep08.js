import { THREE, pose, S, Z, zWalk, light, puff, sparks, splat, burst, prop, box, strike, shoveAt, stompAt, swoosh, hitFx, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;

// ---------- sala em corte com porta (paredes baixas, como o jogo mostra por dentro) ----------
const RX = 60, RZ = -5;
const ROOM = prop(new THREE.Group()); ROOM.position.set(RX, 0, RZ);
{ const add = (o, x, y, z) => { o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; ROOM.add(o); return o; };
  const out = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshLambertMaterial({ color: '#4c6b34' })); out.rotation.x = -Math.PI / 2; out.position.y = .01; out.receiveShadow = true; ROOM.add(out);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshLambertMaterial({ color: '#9a7650' })); fl.rotation.x = -Math.PI / 2; fl.position.y = .03; fl.receiveShadow = true; ROOM.add(fl);
  for (let i = -3; i <= 3; i++) { const l = box(7, .01, .04, '#7d5e3e'); l.position.set(0, .035, i); ROOM.add(l); }
  add(box(.22, 1.15, 2.8, '#c9b48a'), -3.5, .575, -2.1); add(box(.22, 1.15, 2.8, '#c9b48a'), -3.5, .575, 2.1);   // parede com vão de porta (z -0.7..0.7)
  add(box(.3, 2.3, .16, '#6a4426'), -3.5, 1.15, -.74); add(box(.3, 2.3, .16, '#6a4426'), -3.5, 1.15, .74); add(box(.3, .16, 1.64, '#6a4426'), -3.5, 2.3, 0); // batente
  add(box(7, 1.15, .22, '#bfa982'), 0, .575, -3.5);
  add(box(1.6, .5, .8, '#5a6b7a'), 1.8, .25, -2.7); add(box(1.6, .5, .25, '#4a5a68'), 1.8, .65, -3.0); // sofá
}
const AT = (x, z) => ({ x: RX + x, z: RZ + z });

const sm01 = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const CX = 1, CZ = 1.6;   // arena na rua (sem árvore/poste na frente da câmera)
const REACH = 1.45;        // distância do zumbi para o taco acertar a cabeça
// golpe do sobrevivente com rastro; devolve a fase (ou -1)
function hitS(o, lf, hits, slow = 0) { let t = -1; hits.forEach(h => { const u = slow ? ((lf - h + 16) / 38) : strike(lf, h); if (u >= 0 && u <= 1) t = u; }); pose(S, Object.assign({ guard: 1, swing: t }, o)); if (t >= 0) swoosh(S, t); return t; }
const blood = (x, y, z, age, seed, dir = Math.PI / 2) => { hitFx(x, y, z, age, seed); burst(x, y, z, age, 14, seed + 3, dir); };

run([
  // 0 — mata o primeiro; o segundo chega; o terceiro vem por trás
  (lf, f, len, c) => { const H = 20; c.cam(CX + .6, CZ, lerp(8.6, 7.4, easeOut(lf / len))); c.shake(lf - H, .2);
    hitS({ x: CX, z: CZ, ry: Math.PI / 2, ph: 0, amp: 0 }, lf, [H]);
    if (lf < H) zWalk(Z[0], 0, f, CX + REACH + Math.max(0, 14 - lf) * .05, CZ, -Math.PI / 2, .9, lf > 8 ? { attack: ((lf - 8) / 14) % 1 } : {});
    else { pose(Z[0], { x: CX + REACH, z: CZ, ry: -Math.PI / 2, dead: lf - H, deadStyle: 1 }); splat(CX + REACH + 1.5, CZ + .3, .4 * clamp((lf - H - 12) / 10)); }
    blood(CX + REACH - .1, 1.6, CZ, lf - H, 0);
    zWalk(Z[1], 1, f, CX + 6.5 - T(lf) * 1.5, CZ + .6, -Math.PI / 2, 1.1);
    zWalk(Z[2], 2, f, CX - 5.5 + T(lf) * 1.5, CZ - .4, Math.PI / 2, 1.1); },
  null,
  // 2 — cercado por três
  (lf, f, len, c) => { const r = lerp(4.2, 1.45, clamp(lf / len)); c.cam(CX + .3, CZ, lerp(7.4, 9.2, lf / len));
    pose(S, { x: CX, z: CZ, ry: Math.PI / 2 + Math.sin(T(lf) * 3.2) * 1.5, ph: T(lf) * 5, amp: .12, guard: 1 });
    [0.2, 2.3, 4.3].forEach((a, i) => { const x = CX + Math.cos(a) * r, z = CZ + Math.sin(a) * r * .9; zWalk(Z[i], i, f, x, z, face(x, z, CX, CZ), 1, r < 2.1 ? { attack: (T(f) * 1.5 + i * .33) % 1 } : {}); }); },
  // 3 — empurrão: no primeiro afasta; no segundo derruba
  (lf, f, len, c) => { const k4 = c.F[4] - c.C(3), h1 = 18, h2 = k4 + 50; c.cam(CX + 1.2, CZ, 6.4); c.shake(lf - h1, .12); c.shake(lf - h2, .2);
    const t = Math.max(shoveAt(lf, h1), shoveAt(lf, h2)); pose(S, { x: CX, z: CZ, ry: Math.PI / 2, ph: 0, amp: 0, guard: 1, shove: t });
    hitFx(CX + .95, 1.35, CZ, lf - h1, 0); hitFx(CX + .95, 1.35, CZ, lf - h2, 1);
    if (lf < h2) { const far = lf < h1 + 26 ? 0 : 1.0 * (1 - sm01((lf - h1 - 26) / Math.max(1, h2 - h1 - 34))), walking = lf >= h1 + 26 && far > 0.02;
      pose(Z[0], { x: CX + REACH + (lf < h1 + 26 ? 0 : far), z: CZ, ry: -Math.PI / 2, flinch: lf >= h1 && lf < h1 + 26 ? lf - h1 : -1, flinchDist: 1.0, ph: T(f) * 5, amp: lf < h1 ? .15 : walking ? .55 : .1, attack: lf < h1 - 2 || (lf > h2 - 12) ? (T(f) * 1.5) % 1 : 0 }); }
    else { pose(Z[0], { x: CX + REACH, z: CZ, ry: -Math.PI / 2, dead: lf - h2, deadStyle: 0 }); puff(CX + REACH + 1.4, .15, CZ, lf - h2 - 12, { n: 5, seed: 3, life: 22, size: .22, rise: .25, color: '#9a958c', op: .45 }); } },
  // 4 — pise na cabeça: não gasta a arma (zumbi caído de costas; cabeça em x+~2,2)
  (lf, f, len, c) => { const hits = [26, 56, 86, 111], hx = CX + REACH + 2.15; c.cam(hx - .2, CZ + .1, 5.4);
    let last = -99; hits.forEach(h => { if (lf >= h) last = h; c.shake(lf - h, .18); });
    pose(Z[0], { x: CX + REACH, z: CZ, ry: -Math.PI / 2, dead: 60, deadStyle: 0, jolt: lf - last });
    let t = -1; hits.forEach(h => { const u = stompAt(lf, h); if (u >= 0) t = u; });
    pose(S, { x: hx - .05, z: CZ - .62, ry: 0, ph: 0, amp: 0, stomp: t, look: 0 });
    hits.forEach((h, i) => { hitFx(hx, .25, CZ, lf - h, i); burst(hx, .2, CZ, lf - h, 9, h, 0); if (lf >= h) splat(hx + (R(h) - .5) * .5, CZ + (R(h + 1) - .5) * .5, .2 + R(h) * .14); }); },
  // 5 — um de cada vez: espalhados cercam (errado); na porta, vêm em fila (certo)
  (lf, f, len, c) => { const k8 = c.C(8) - c.C(7);
    if (lf < k8) { c.cam(CX, CZ, 8.6); const b = T(lf) * .9;
      pose(S, { x: CX - b, z: CZ, ry: Math.PI / 2, ph: -T(lf) * 5, amp: .35, guard: 1 });
      [[2.4, 0], [2.0, 1.9], [1.9, -1.9]].forEach(([dx, dz], i) => { const x = CX + dx - b * 1.5, z = CZ + dz * (1 - lf / k8 * .35); zWalk(Z[i], i, f, x, z, face(x, z, CX - b, CZ), 1.1, { attack: (T(f) * 1.5 + i * .3) % 1 }); });
    } else { const l = lf - k8; ROOM.visible = true; light('day'); c.cam(RX - 3.3, RZ + .1, 8.2, 1.2);
      const kills = [30, 62]; kills.forEach(h => c.shake(l - h, .18));
      hitS(Object.assign(AT(-2.35, 0), { ry: -Math.PI / 2, ph: 0, amp: 0 }), l, kills);
      const adv = kills.reduce((a, h) => a + sm01((l - h - 8) / 16), 0);
      for (let i = 0; i < 5; i++) { const dead = i < kills.length && l >= kills[i];
        if (dead) { pose(Z[i], Object.assign(AT(-3.5, (i ? .1 : -.1)), { ry: Math.PI / 2, dead: l - kills[i], deadStyle: i ? 0 : 1 })); blood(RX - 3.6, 1.6, RZ, l - kills[i], i, -Math.PI / 2); }
        else { const x = -3.5 - i * 1.25 + Math.min(adv, i) * 1.25; zWalk(Z[i], i, f, RX + x, RZ + Math.sin(i * 2.1) * .06, Math.PI / 2, .8, x > -3.7 ? { attack: (T(f) * 1.4) % 1 } : {}); } } } },
  // 6 — fôlego: descansado mata num golpe; no 1º aviso o golpe só balança; exausto não faz nada
  (lf, f, len, c) => { const k10 = c.F[10] - c.C(9), k11 = c.C(11) - c.C(9), hA = 20, hB = k10 + 62, hC = k11 + 44; c.cam(CX + .8, CZ, lerp(6.6, 5.8, lf / len));
    const tired = lf < k10 ? 0 : lf < k11 ? .28 : .6;
    c.shake(lf - hA, .2); c.shake(lf - hB, .08);
    let t = Math.max(strike(lf, hA), strike(lf, hB)); const u = (lf - hC + 16) / 38; if (u >= 0 && u <= 1) t = u;
    pose(S, { x: CX, z: CZ, ry: Math.PI / 2, guard: 1 - tired * .7, swing: t, slump: tired, ph: 0, amp: 0 }); if (t >= 0 && lf < hC - 20) swoosh(S, t);
    if (lf < hA) zWalk(Z[0], 0, f, CX + REACH, CZ, -Math.PI / 2, .5, { attack: (T(f) * 1.5) % 1 });
    else { pose(Z[0], { x: CX + REACH, z: CZ + .0, ry: -Math.PI / 2, dead: lf - hA, deadStyle: 1 }); splat(CX + REACH + 1.5, CZ + .4, .36 * clamp((lf - hA - 12) / 10)); }
    blood(CX + REACH - .1, 1.6, CZ, lf - hA, 0); hitFx(CX + REACH - .1, 1.6, CZ - .15, lf - hB, 1);
    // segundo zumbi: chega por cima do primeiro; golpe fraco só dá um tranco; depois agarra
    const arr = sm01((lf - 34) / (k10 + 16)), grab = lf > hB + 30;
    pose(Z[1], { x: lerp(CX + 6, CX + REACH - .05, arr), z: CZ - .25, ry: -Math.PI / 2, flinch: lf >= hB ? lf - hB : -1, flinchDist: .12, attack: arr >= 1 && (lf < hB - 4 || grab) ? (T(f) * 1.5) % 1 : 0, ph: T(f) * 5, amp: arr < 1 ? .55 : .08 });
    if (lf >= k11) for (let n = 0; n < 2; n++) puff(CX + .3, 1.75, CZ + .1, (lf + n * 14) % 26, { n: 2, seed: n * 3, life: 26, size: .1, rise: .5, color: '#ffffff', op: .5 }); },
  // 7 — descanse sentado no chão
  (lf, f, len, c) => { const sx = -2.6, sz = -5.0; c.cam(sx + 1.1, sz + 1.1, lerp(6.2, 5.4, easeOut(lf / len)));
    const k = ss(6, 30, lf); pose(S, { x: sx, z: sz, ry: lerp(Math.PI * .28, 2.25, ss(0, 22, lf)), ph: 0, amp: 0, slump: lerp(.5, .1, ss(20, len, lf)), sit: k });
    if (lf < 80) puff(sx + lerp(.25, .32, k), lerp(1.7, .95, k), sz + lerp(.25, -.25, k), lf % 24, { n: 2, seed: 2, life: 24, size: .09, rise: .4, color: '#ffffff', op: .45 }); },
  // 8 — toda arma quebra; puxa a reserva e resolve
  (lf, f, len, c) => { const k15 = c.C(15) - c.C(14), hA = 18, hB = k15 + 26; c.cam(CX + .8, CZ, 6.0); c.shake(lf - hA, .2); c.shake(lf - hB, .2);
    const t = hitS({ x: CX, z: CZ, ry: Math.PI / 2, ph: 0, amp: 0 }, lf, [hA, hB]);
    S.bat.visible = lf < hA; S.hammer.visible = lf >= k15 + 4;
    hitFx(CX + REACH - .1, 1.6, CZ, lf - hA, 0); sparks(CX + REACH - .2, 1.6, CZ, lf - hA, 16, 5, 0); puff(CX + REACH - .2, 1.6, CZ, lf - hA, { n: 6, seed: 4, life: 22, size: .13, rise: .3, color: '#a87a48', op: .85 });
    if (lf < hB) pose(Z[0], { x: CX + REACH, z: CZ, ry: -Math.PI / 2, flinch: lf >= hA ? lf - hA : -1, flinchDist: .15, attack: lf < hA - 3 || lf > hA + 22 ? (T(f) * 1.5) % 1 : 0, ph: T(f) * 4, amp: .1 });
    else pose(Z[0], { x: CX + REACH + .14, z: CZ, ry: -Math.PI / 2, dead: lf - hB, deadStyle: 0 });
    blood(CX + REACH, 1.6, CZ, lf - hB, 1); },
  // 9 — CTA: exausto, andando devagar, a horda alcançando
  (lf, f, len, c) => { const sx = CX + 2 - T(lf) * .7; c.cam(sx + 1.6, CZ, lerp(8.4, 10, lf / len));
    pose(S, { x: sx, z: CZ, ry: -Math.PI / 2, ph: T(lf) * 3.2, amp: .35, slump: .6 });
    for (let i = 0; i < 9; i++) zWalk(Z[i], i, f, sx + 6.5 - T(lf) * .9 + (i % 3) * 1.2 + R(i), CZ - 1.1 + Math.floor(i / 3) * 1.1 + R(i + 3) * .5, -Math.PI / 2, 1.1); }
]);
