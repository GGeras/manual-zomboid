import { THREE, pose, S, Z, zWalk, light, puff, flashAt, sparks, waves, burst, gen, houses, winMat, prop, box, mat, U } from './engine.js';
import { run } from './ep3d.js';
import { HX, HZ, HA, house, inHand, inHandL, item, itGas, itMag, itScrap } from './sets.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;
const sm01 = t => { t = clamp(t); return t * t * (3 - 2 * t); };

// cada casa com material de janela próprio (acende/apaga separado)
const HM = houses.map(h => { const m = h.wins[0].material.clone(); h.wins.forEach(w => w.material = m); return m; });
function lights(on) { HM.forEach((m, i) => m.emissiveIntensity = (Array.isArray(on) ? on[i] : on) ? .95 : .03); winMat.emissiveIntensity = HM[0].emissiveIntensity; }
// gerador: luz de status + escapamento + tremida quando ligado
const led = new THREE.Mesh(new THREE.BoxGeometry(.08, .08, .02), new THREE.MeshBasicMaterial({ color: '#7cff6a' })); led.position.set(.3, .55, .33); gen.add(led);
function genAt(x, z, ry, on, f, o = {}) { gen.visible = true; const sh = on ? Math.sin(f * 2.3) * .008 : 0; gen.position.set(x + sh, 0, z); gen.rotation.set(0, ry, on ? Math.sin(f * 1.9) * .01 : 0);
  led.material.color.set(on ? '#7cff6a' : '#552222'); led.visible = true;
  if (on && o.smoke !== false) { const ex = x + Math.cos(ry) * .55, ez = z - Math.sin(ry) * .55; puff(ex, .5, ez, f % 24, { n: 2, seed: 4, life: 24, size: .12, rise: .6, color: o.dark ? '#2a2825' : '#8a857c', op: o.dark ? .7 : .45 }); } }
// anel do alcance (20 quadrados)
const ring = prop(new THREE.Group());
{ const a = new THREE.Mesh(new THREE.RingGeometry(19.6, 20, 96), new THREE.MeshBasicMaterial({ color: '#ffd23a', transparent: true, opacity: .9, depthWrite: false })); a.rotation.x = -Math.PI / 2; a.position.y = .11; ring.add(a);
  const b = new THREE.Mesh(new THREE.CircleGeometry(19.6, 96), new THREE.MeshBasicMaterial({ color: '#ffd23a', transparent: true, opacity: .12, depthWrite: false })); b.rotation.x = -Math.PI / 2; b.position.y = .1; ring.add(b); ring.userData = { a, b }; }
// fogo em cima do gerador e destroços da explosão
const gfl = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(.12, .55, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffb020' : '#ff4a12', transparent: true, opacity: .92 })); return prop(m); });
function genFire(x, z, k, f) { gfl.forEach((m, i) => { m.visible = k > .02; m.position.set(x + (R(i) - .5) * .8, .75 + k * .2, z + (R(i + 3) - .5) * .5); m.scale.set(k, k * (1 + Math.sin(f * .8 + i * 1.7) * .35), k); });
  if (k > .02) { flashAt(x, 1.2, z, '#ff8a30', 3 * k + Math.sin(f * .9) * .4, 7); puff(x, 1.2, z, f % 26, { n: 4, seed: 2, life: 26, size: .3, rise: 1.6, color: '#1e1c1a', op: .8 }); } }
const debris = Array.from({ length: 14 }, (_, i) => prop(box(.18 + R(i) * .2, .08, .12 + R(i + 1) * .15, i % 3 ? '#e0b020' : '#333')));
function boom(x, z, a, c) { if (a < 0) return; c.shake(a, .55);
  if (a < 4) flashAt(x, 1.2, z, '#fff0c0', 14 - a * 3, 18);
  for (let n = 0; n < 3; n++) puff(x, .8, z, a - n * 2, { n: 8, seed: n * 11, life: 40, spread: 1.6, size: .6, rise: 1.4, color: n ? '#2a2724' : '#ff9a30', op: n ? .8 : .9 });
  sparks(x, .8, z, a, 30, 7, 0); burst(x, .8, z, a, 0, 1, 0);
  debris.forEach((m, i) => { const t = a / 30, ang = R(i + 5) * 6.283, v = 3 + R(i + 9) * 4, up = 4 + R(i + 2) * 4, y = .6 + up * t - 9.8 * t * t / 2;
    m.visible = true; m.position.set(x + Math.cos(ang) * v * Math.min(t, .9), Math.max(.05, y), z + Math.sin(ang) * v * Math.min(t, .9)); m.rotation.set(t * 9 + i, t * 7, t * 5); }); }

const GX = 10.6, GZ = -7.45;   // gerador encostado na parede da frente da casa 1 (lado de fora)

run([
  // 0 — dentro de casa à noite: a luz cai
  (lf, f, len, c) => { const off = 22; light('dark'); house({ dark: lf >= off }); lights(false); c.cam(HX - .6, HZ - 1.4, lerp(6.4, 5.6, easeOut(lf / len)), 1.0);
    pose(S, Object.assign(HA(-.6, -1.2), { ry: lf < off ? face(0, 0, 1, 1) : face(0, 0, 1, 1) + Math.sin(T(lf - off) * 3) * .6, ph: 0, amp: 0, look: lf >= off ? Math.sin(T(lf) * 4) * .5 : 0 })); S.bat.visible = false;
    if (lf >= off && lf < off + 3) flashAt(HX, 2.2, HZ, '#fff2d8', 2, 6); },
  null,
  // 2 — do lado de fora: o gerador desligado
  (lf, f, len, c) => { light('dawn'); lights(false); genAt(GX, GZ + .4, 0, false, f); c.cam(GX - .5, GZ + .9, lerp(7.0, 6.0, easeOut(lf / len)), .8);
    pose(S, { x: GX - 1.2, z: GZ + 1.3, ry: face(GX - 1.2, GZ + 1.3, GX, GZ + .4), ph: 0, amp: 0 }); S.bat.visible = false; },
  // 3 — tenta ligar e falha; lê a revista; liga
  (lf, f, len, c) => { const k4 = c.F[4] - c.C(3), on = lf >= k4 + 110; light('dawn'); lights(false); genAt(GX, GZ + .4, 0, on, f);
    c.cam(GX - .5, GZ + .9, 6.0, .8);
    const read = lf >= k4 && lf < k4 + 96, sx = GX - 1.0, sz = GZ + 1.25;
    if (!read) { const tug = lf > 10 && lf < 30 ? Math.sin(clamp((lf - 10) / 20) * Math.PI * 2) : 0; const t2 = lf >= k4 + 98 && lf < k4 + 112 ? Math.sin(clamp((lf - k4 - 98) / 14) * Math.PI) : 0;
      pose(S, { x: sx, z: sz, ry: face(sx, sz, GX, GZ + .4), ph: 0, amp: 0, crouch: .4, lean: .15 + Math.abs(tug) * .15 + t2 * .15 }); S.aR.a.rotation.set(-1.0 - tug * .35 - t2 * .3, 0, -.1); S.aR.el.rotation.x = -.5;
      if (lf > 24 && lf < 34) puff(GX + .55, .5, GZ + .4, lf - 24, { n: 3, seed: 3, life: 18, size: .1, rise: .4, color: '#55504a', op: .6 }); }
    else { pose(S, { x: sx, z: sz, ry: face(sx, sz, GX, GZ + .4) + .5, ph: 0, amp: 0, hold: 1 }); inHand(S, itMag, 1.3, -.9);
      if (lf - k4 === 60) flashAt(sx, 1.8, sz, '#ffe27a', 2, 4); }
    if (on) flashAt(GX, 1.0, GZ + .4, '#ffe9a0', .8, 4); S.bat.visible = false; },
  // 4 — gerador DENTRO de casa: fumaça enche, ele cai
  (lf, f, len, c) => { const k6 = c.C(6) - c.C(5), fall = k6 + 22; light('dark'); house({ dark: false }); lights(false); genAt(HX - .2, HZ - 1.7, 0, true, f, { dark: true });
    c.cam(HX - .5, HZ - 1.2, lerp(6.2, 5.4, easeOut(lf / len)), 1.0);
    for (let n = 0; n < 6; n++) puff(HX - .2 + (R(n) - .5) * 3, .8 + R(n + 1) * 1.2, HZ - 1.4 + (R(n + 2) - .5) * 2, (lf + n * 11) % 60, { n: 3, seed: n * 7, life: 60, spread: 1.2, size: .5 + lf / len * .5, rise: .5, color: '#3a3733', op: Math.min(.7, .15 + lf / len * .6) });
    const sx = HX + .9, sz = HZ - .6;
    if (lf < fall) pose(S, { x: sx, z: sz, ry: face(sx, sz, HX, HZ + 1), ph: T(lf) * 6, amp: 0, slump: clamp(lf / fall) * .9, look: Math.sin(T(lf) * 5) * .3 * (lf / fall) });
    else pose(S, { x: sx, z: sz, ry: face(sx, sz, HX, HZ + 1), dead: lf - fall, deadStyle: 2 });
    S.bat.visible = false; },
  // 5 — fora, na parede: anel de 20 quadrados acende as casas dentro do alcance
  (lf, f, len, c) => { const k8 = c.C(8) - c.C(7); light('dawn'); genAt(GX, GZ, 0, true, f);
    const grow = easeOut(clamp((lf - 8) / 26)); ring.visible = lf < k8 + 6; ring.position.set(GX, 0, GZ); ring.scale.setScalar(Math.max(.02, grow)); ring.userData.a.material.opacity = .9 * (1 - ss(k8 - 6, k8 + 6, lf));
    const lit = houses.map(h => Math.abs(h.g.position.x - GX) - 3.5 < 20 * grow); lights(lit);
    if (lf < k8) c.cam(GX - 1, GZ + 1, lerp(10, 44, easeOut(clamp(lf / 34))), 1.0);
    else c.cam(GX - .5, GZ + .9, lerp(44, 6.4, easeOut(clamp((lf - k8) / 18))), 1.0);
    pose(S, { x: GX - 1.3, z: GZ + 1.4, ry: face(GX - 1.3, GZ + 1.4, GX, GZ), ph: 0, amp: 0 }); S.bat.visible = false; },
  // 6 — barulho: ondas e zumbis da rua vindo
  (lf, f, len, c) => { light('dawn'); lights([0, 1, 0, 0, 0]); genAt(GX, GZ, 0, true, f); c.cam(GX - 4, GZ + 1.2, lerp(10, 12, easeOut(lf / len)), 1.0);
    waves(GX, GZ, lf, { period: 10, life: 40, maxR: 11, color: '#ffd23a' });
    for (let i = 0; i < 9; i++) { const ox = GX - 15 + (i % 5) * 2.2 + R(i) * 1.5, oz = GZ + 1.5 + Math.floor(i / 5) * 2.2 + R(i + 3) * 1.2, st = 14 + i * 5, k = lf < st ? 0 : clamp((lf - st) / 140) * .7;
      const x = lerp(ox, GX, k), z = lerp(oz, GZ + 1.5, k); zWalk(Z[i], i, f, x, z, lf < st ? R(i) * 6.28 : face(x, z, GX, GZ), lf < st ? .15 : 1); } },
  // 7 — cuida: desliga, abastece, conserta com sucata
  (lf, f, len, c) => { const k12 = c.F[12] - c.C(11), offAt = 20, gasA = k12, gasB = k12 + 44, fixA = k12 + 50, fixB = k12 + 92; light('dawn'); lights([0, 1, 0, 0, 0]);
    const on = lf < offAt; genAt(GX, GZ, 0, on, f); c.cam(GX - .5, GZ + .5, 5.6, .8);
    const sx = GX - 1.05, sz = GZ + .55, ry = face(sx, sz, GX, GZ); S.bat.visible = false;
    if (lf < gasA) { const p = lf > offAt - 8 && lf < offAt + 4 ? 1 : 0; pose(S, { x: sx, z: sz, ry, ph: 0, amp: 0, crouch: .35, lean: .1 }); S.aR.a.rotation.set(-1.0 - p * .3, 0, -.1); S.aR.el.rotation.x = -.4; }
    else if (lf < gasB) { const tilt = sm01((lf - gasA) / 8) * (1 - sm01((lf - gasB + 8) / 8));   // galão sobre o bocal do gerador, inclina e derrama
      pose(S, { x: sx, z: sz, ry, ph: 0, amp: 0, crouch: .25, lean: .12 + tilt * .08 }); S.aR.a.rotation.set(-1.05 - tilt * .15, 0, -.1); S.aR.el.rotation.x = -.35; S.aL.a.rotation.set(-.95, 0, .25); S.aL.el.rotation.x = -.5;
      const cx = GX - .42, cz = GZ + .12; item(itGas, cx, .78 + tilt * .05, cz, ry, 1); itGas.rotation.order = 'YXZ'; itGas.rotation.x = tilt * 1.15;
      if (tilt > .5) for (let n = 0; n < 3; n++) puff(GX - .3, .72, GZ + .05, (lf + n * 4) % 8, { n: 1, seed: n, life: 8, size: .035, rise: -.5, color: '#d0a840', op: .85 }); }
    else { const w = lf >= fixA && lf < fixB, k = w ? ((lf - fixA) % 10) / 10 : 0; pose(S, { x: sx, z: sz, ry, ph: 0, amp: 0, crouch: .7, lean: .2 }); S.aR.a.rotation.set(-1.1 - Math.sin(k * Math.PI) * .25, 0, -.1); S.aR.el.rotation.x = -.6; S.hammer.visible = w;
      if (lf < fixA + 6) item(itScrap, sx + .35, .05, sz - .3, 0, 1);
      if (w && (lf - fixA) % 10 === 5) { sparks(GX - .2, .55, GZ + .3, 0, 6, lf, 0); flashAt(GX - .2, .6, GZ + .35, '#bfe0ff', 1.6, 3); }
      if (w) sparks(GX - .2, .55, GZ + .3, (lf - fixA) % 10, 6, Math.floor(lf / 10), 0); }
    if (lf >= gasA && lf < gasB) item(itScrap, sx + .35, .05, sz - .3, 0, 1); },
  // 8 — condição baixa: fumaça preta, fogo, explosão
  (lf, f, len, c) => { const k14 = c.C(14) - c.C(13), fireAt = 46, boomAt = k14 + 6; light('dawn'); lights([0, lf < boomAt ? 1 : 0, 0, 0, 0]);
    if (lf < boomAt) genAt(GX, GZ, 0, true, f, { dark: true });
    for (let n = 0; n < 3; n++) puff(GX, .9, GZ, (lf + n * 8) % 26, { n: 3, seed: n * 5, life: 26, size: .22, rise: 1.4, color: '#1e1c1a', op: lf < boomAt ? .75 : .4 });
    genFire(GX, GZ, lf < fireAt ? 0 : lf < boomAt ? sm01((lf - fireAt) / 12) : 1.4, f);
    if (lf < boomAt && lf > 20 && lf % 9 === 0) sparks(GX + .3, .7, GZ + .3, 0, 8, lf, 0);
    if (lf < boomAt) sparks(GX + .3, .7, GZ + .3, lf % 9, 8, Math.floor(lf / 9), 0);
    boom(GX, GZ, lf - boomAt, c);
    c.cam(GX - .9, GZ + .8, lf < boomAt ? lerp(7, 6.2, lf / boomAt) : lerp(6.2, 9, easeOut(clamp((lf - boomAt) / 20))), .9);
    const ba = lf - boomAt, sx = GX - 2.4, sz = GZ + 2.4;
    const run_ = clamp((lf - fireAt - 6) / 50), rx = sx - run_ * 6, rz = sz + run_ * 3;   // vê o fogo e corre pra longe
    pose(S, { x: rx, z: rz, ry: lf < fireAt + 6 ? face(sx, sz, GX, GZ) : face(sx, sz, sx - 6, sz + 3), ph: T(lf) * 13, amp: lf < fireAt + 6 ? 0 : 1, lean: lf < fireAt + 6 ? -.1 : .15, vis: run_ < .98 });
    if (ba >= 0 && ba < 14) S.g.position.y += 0;
    S.bat.visible = false; },
  // 9 — CTA: casa acesa, gerador ligado na parede
  (lf, f, len, c) => { light('dawn'); lights([0, 1, 0, 0, 0]); genAt(GX, GZ, 0, true, f); c.cam(lerp(GX - 1.4, GX - .8, lf / len), GZ + 1.0, lerp(9, 7.6, easeOut(lf / len)), 1.4);
    pose(S, { x: GX - 2.2, z: GZ + 1.8, ry: face(GX - 2.2, GZ + 1.8, GX, GZ), ph: 0, amp: 0 }); S.bat.visible = false; }
]);
