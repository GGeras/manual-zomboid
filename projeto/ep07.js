import { THREE, pose, S, Z, zWalk, light, waves, puff, sparks, flashAt, splat, cars, prop, box, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;

const HERO = cars[0], PX = 0.5; // PX: vaga sem árvore/poste na frente da câmera
const HOME = [[-8.5, 1.2, 0], [15, -1.2, Math.PI], [30, 1.2, 0]];
function reset() { cars.forEach((c, i) => { c.position.set(HOME[i][0], 0, HOME[i][1]); c.rotation.set(0, HOME[i][2], 0); }); }
// hero(x, z, ry): frente do carro = +x local. lights 0..1; rumble = tremor do motor
function hero(x, z, ry, lights = 0, rumble = 0, f = 0) { HERO.position.set(x, rumble ? Math.sin(f * 2.1) * .012 * rumble : 0, z); HERO.rotation.set(0, ry, rumble ? Math.sin(f * 1.7) * .006 * rumble : 0); HERO.userData.lm.emissiveIntensity = lights * 1.6; }
const local = (lx, lz) => { const a = HERO.rotation.y, c = Math.cos(a), s = Math.sin(a); return [HERO.position.x + lx * c + lz * s, HERO.position.z - lx * s + lz * c]; };

// chave (dourada, gira) — marca onde procurar
const keys = Array.from({ length: 4 }, () => { const g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: '#ffd23a' });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.13, .045, 6, 14), m); ring.position.x = -.2; g.add(ring);
  const sh = new THREE.Mesh(new THREE.BoxGeometry(.34, .06, .06), m); sh.position.x = .08; g.add(sh);
  [.12, .2].forEach(x => { const t = new THREE.Mesh(new THREE.BoxGeometry(.05, .1, .05), m); t.position.set(x, -.07, 0); g.add(t); });
  g.scale.setScalar(1.7); return prop(g); });
function key(i, x, y, z, age, f) { if (age < 0) return; const k = keys[i]; k.visible = true; const p = easeOut(clamp(age / 8));
  k.position.set(x, y + Math.sin(f * .12) * .06 + (1 - p) * .6, z); k.rotation.set(0, f * .06, 0); k.scale.setScalar(1.7 * lerp(2, 1, p));
  waves(x, z, age % 24, { period: 999, life: 24, maxR: 1.1, color: '#ffd23a' }); }

const ALERT = '#ff3d55';
// zumbi atropelado: cai e é empurrado
function runOver(i, zx, zz, ry, hitAge, dir, f) {
  if (hitAge < 0) { zWalk(Z[i], i, f, zx, zz, ry, .5); return; }
  const k = easeOut(clamp(hitAge / 10)); pose(Z[i], { x: zx + dir * k * 1.6, z: zz + (R(i) - .5) * k * 1.2, ry: ry + k * 1.2, fall: k, ph: 0, amp: 0 }); splat(zx + dir * 1.2, zz, .3 * k);
}

run([
  // 0 — fugindo de carro: a horda fica pra trás
  (lf, f, len, c) => { reset(); const x = lerp(-16, 2, lf / len);
    hero(x, 1.2, 0, 1, 1, f); S.g.visible = false; c.cam(x - 1.2, .6, lerp(10.5, 9, easeOut(lf / len)));
    for (let n = 0; n < 5; n++) puff(x - 2 - n * .2, .35, 1.2, (lf + n * 7) % 28, { n: 2, seed: n * 5, life: 28, size: .2, rise: .5, color: '#bdb6a6' });
    for (let i = 0; i < 9; i++) zWalk(Z[i], i, f, -18.5 + lf * .045 - (i % 3) * 1.1 - R(i) * .8, .2 + Math.floor(i / 3) * 1.0 + R(i + 2) * .5, Math.PI / 2, 1.1); },
  null,
  // 2 — chega no carro parado
  (lf, f, len, c) => { reset(); hero(PX, 1.2, Math.PI); const p = easeOut(clamp(lf / (len - 10)));
    c.cam((PX + .3), 2.2, lerp(9.5, 7.6, p));
    pose(S, { x: lerp((PX + 4), (PX + .3), p), z: lerp(4.6, 2.9, p), ry: face((PX + 4), 4.6, (PX + .3), 2.9), ph: T(lf) * 6, amp: p < 1 ? .6 : 0 }); },
  // 3 — procure a chave: ignição, porta-luvas, chão, zumbi por perto (uma por vez)
  (lf, f, len, c) => { reset(); hero(PX, 1.2, Math.PI); const k4 = c.F[4] - c.C(3), t = [k4 + 15, k4 + 51, k4 + 84, k4 + 108];
    const st = lf < t[2] ? 0 : 1; c.cam(lerp((PX - .1), (PX + 1.1), ss(t[2] - 6, t[2] + 10, lf)), lerp(1.8, 2.6, ss(t[2] - 6, t[2] + 10, lf)), lerp(6.4, 7.6, ss(t[2] - 6, t[2] + 10, lf)));
    pose(S, { x: (PX + .2), z: 2.9, ry: Math.PI + Math.sin(T(lf) * 1.5) * .25, ph: 0, amp: 0, look: Math.sin(T(lf) * 2) * .4 });
    pose(Z[0], { x: (PX + 3.3), z: 3.9, ry: 2.2, fall: 1, ph: 0, amp: 0 }); splat((PX + 3.5), 4.3, .4);
    const [ix, iz] = local(.55, -.38), [gx, gz] = local(.55, .38);
    if (lf < t[1]) key(0, ix, 1.95, iz, lf - t[0], f);
    else if (lf < t[2]) key(1, gx, 1.95, gz, lf - t[1], f);
    else if (lf < t[3]) key(2, (PX + 1.6), .45, 3.2, lf - t[2], f);
    else key(3, (PX + 3.3), .75, 3.9, lf - t[3], f); },
  // 4 — ligação direta: entra, faíscas no painel, motor pega
  (lf, f, len, c) => { reset(); const on = lf >= 110; hero(PX, 1.2, Math.PI, on ? 1 : 0, on ? 1 : 0, f);
    c.cam((PX - .1), 1.9, lerp(6.6, 5.8, easeOut(lf / len))); if (on) c.shake(lf - 110, .08);
    const p = clamp(lf / 16); pose(S, { x: (PX + .2), z: lerp(2.9, 2.1, p), ry: Math.PI, ph: T(lf) * 6, amp: .5, vis: p < 1 });
    const [ix, iz] = local(.55, -.38);
    if (lf > 22 && !on) { const a = (lf - 22) % 13; sparks(ix, 1.15, iz + .5, a, 7, Math.floor((lf - 22) / 13) * 3, 0); if (a < 3) flashAt(ix, 1.3, iz + .8, '#bfe0ff', 2.5, 5); }
    if (on) for (let n = 0; n < 3; n++) puff(PX + 1.95, .4, 1.2 + .4, (lf - 110 - n * 6), { n: 3, seed: n * 4, life: 30, size: .22, rise: .5, color: '#c8c2b4' }); },
  // 5 — falhou: alarme (faróis piscam, som se espalha) e a rua inteira vem
  (lf, f, len, c) => { reset(); const AL = 62, k8 = c.C(8) - c.C(7), al = lf >= AL, blink = al && Math.floor((lf - AL) / 6) % 2 === 0;
    hero(PX, 1.2, Math.PI, blink ? 1.4 : 0); S.g.visible = false;
    c.cam((PX + .1), 1.6, lerp(6.4, 12.5, ss(AL, k8 + 30, lf))); c.shake(lf - AL, .1);
    const [ix, iz] = local(.55, -.38);
    if (lf > 6 && lf < 46) { const a = (lf - 6) % 13; sparks(ix, 1.15, iz + .5, a, 7, Math.floor(lf / 13) * 3, 0); if (a < 3) flashAt(ix, 1.3, iz + .8, '#bfe0ff', 2.5, 5); }
    if (lf >= 46 && lf < 56) puff(ix, 1.3, iz + .6, lf - 46, { n: 5, seed: 2, life: 22, size: .2, rise: .7, color: '#55504a' });
    if (al) { waves(PX, 1.2, lf - AL, { period: 9, life: 44, maxR: 15, color: ALERT }); if (blink) flashAt(PX, 1.4, 1.2, '#ffcf5a', 3, 9); }
    for (let i = 0; i < 13; i++) { const a = i / 13 * 6.283 + R(i) * .4, d0 = 13 + R(i + 3) * 4, st = AL + 14 + i * 4, k = lf < st ? 0 : clamp((lf - st) / 150) * .78;
      const x = PX + Math.cos(a) * d0 * (1 - k), z = 1.2 + Math.sin(a) * d0 * .7 * (1 - k);
      zWalk(Z[i], i, f, x, z, lf < st ? a : face(x, z, PX, 1.2), lf < st ? .15 : 1.1); } },
  // 6 — painel: sem bateria/gasolina não liga (tenta dar partida, apaga)
  (lf, f, len, c) => { reset(); const k10 = c.F[10] - c.C(9), t1 = k10 + 16, t2 = k10 + 56;
    const tr = (lf >= t1 && lf < t1 + 16) || (lf >= t2 && lf < t2 + 16);
    hero(PX, 1.2, Math.PI, tr ? .25 + .2 * Math.sin(lf * 2.4) : 0, tr ? 2.2 : 0, f); S.g.visible = false;
    c.cam((PX - .1), 1.9, 6.0);
    if (lf >= t1 + 12) puff(PX + 1.95, .4, 1.6, lf - t1 - 12, { n: 2, seed: 5, life: 20, size: .14, rise: .3, color: '#77726a' }); },
  // 7 — atropelar: cada batida estraga o carro (fumaça do capô aumenta)
  (lf, f, len, c) => { reset(); const hits = [26, 54, 78, 98], n = hits.filter(h => lf >= h).length;
    const x = lerp(-7, 7, lf / len); hero(x, 1.2, 0, 1, 1 + n * .8, f); S.g.visible = false;
    c.cam(x + 1.4, .9, 8.2); hits.forEach(h => { c.shake(lf - h, .22); sparks(x + 1.9, .7, 1.2, lf - h, 12, h, 0); });
    hits.map(h => -7 + 14 * h / len).forEach((zx, i) => runOver(i, zx + 1.8, 1.2 + (i % 2 ? .35 : -.3), -Math.PI / 2, lf - hits[i], 1, f));
    if (n) for (let m = 0; m < n + 1; m++) puff(x + 1.5, 1.0, 1.2, (lf + m * 9) % 30, { n: 2 + n, seed: m * 7, life: 30, size: .16 + n * .05, rise: 1.2, color: n > 2 ? '#3a3632' : '#8a857c' }); },
  // 8 — de ré: a traseira bate e o porta-malas é destruído
  (lf, f, len, c) => { reset(); const hits = [22, 46, 71], n = hits.filter(h => lf >= h).length;
    const x = lerp(-5, 4, lf / len); hero(x, 1.2, Math.PI, .6, 1.5, f); S.g.visible = false;
    c.cam(x + 1.6, .9, 7.6); hits.forEach(h => { c.shake(lf - h, .24); sparks(x + 1.9, .8, 1.2, lf - h, 12, h + 3, 0); });
    hits.map(h => -5 + 9 * h / len).forEach((zx, i) => runOver(i + 4, zx + 1.8, 1.2 + (i % 2 ? .3 : -.3), -Math.PI / 2, lf - hits[i], 1, f));
    for (let m = 0; m < 3; m++) puff(x - 1.5, 1.0, 1.2, (lf + m * 10) % 30, { n: 4, seed: m * 7, life: 30, size: .26, rise: 1.2, color: '#3a3632' });
    if (n) for (let m = 0; m < n; m++) puff(x + 1.7, .9, 1.2, (lf + m * 8) % 26, { n: 2 + n, seed: 40 + m * 3, life: 26, size: .2, rise: .9, color: '#55504a' }); },
  // 9 — CTA: carro quebrado fumegando, sai a pé com a horda chegando
  (lf, f, len, c) => { reset(); hero(1, 1.2, Math.PI, 0); c.cam(lerp(-.5, -2.5, lf / len), 1.4, lerp(9, 11, lf / len));
    for (let m = 0; m < 4; m++) { puff(-.5, 1.0, 1.2, (lf + m * 8) % 32, { n: 4, seed: m * 7, life: 32, size: .3, rise: 1.4, color: '#2e2b28' }); }
    const p = clamp((lf - 8) / 90), sx = lerp(1.2, -7, p); pose(S, { x: sx, z: 2.6, ry: -Math.PI / 2, ph: T(lf) * 11, amp: .95, lean: .15, vis: lf > 8 });
    for (let i = 0; i < 12; i++) zWalk(Z[i], i, f, 12 - T(lf) * 1.5 + (i % 4) * 1.2 + R(i), -.6 + Math.floor(i / 4) * 1.3 + R(i + 3) * .7, -Math.PI / 2, 1.1); }
]);
