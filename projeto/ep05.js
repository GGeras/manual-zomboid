import { THREE, scene, pose, S, Z, zWalk, light, waves, flashAt, prop, box, mat, houses, winMat, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;

// ---------- cone de visão do zumbi (no chão) ----------
const cones = Array.from({ length: 4 }, () => {
  const g = new THREE.Group(); const half = .62;
  const m = new THREE.Mesh(new THREE.CircleGeometry(1, 28, -Math.PI / 2 - half, half * 2), new THREE.MeshBasicMaterial({ color: '#ff3d55', transparent: true, opacity: .32, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.position.y = .1; g.add(m);
  const e = new THREE.Mesh(new THREE.RingGeometry(.97, 1, 28, 1, -Math.PI / 2 - half, half * 2), new THREE.MeshBasicMaterial({ color: '#ff3d55', transparent: true, opacity: .8, depthWrite: false, side: THREE.DoubleSide }));
  e.rotation.x = -Math.PI / 2; e.position.y = .105; g.add(e);
  g.userData = { m, e }; return prop(g);
});
function cone(i, x, z, ry, len, color = '#ff3d55', a = 1) {
  const c = cones[i]; c.visible = len > .05; c.position.set(x, 0, z); c.rotation.y = ry; c.scale.setScalar(Math.max(.05, len));
  c.userData.m.material.color.set(color); c.userData.e.material.color.set(color); c.userData.m.material.opacity = .30 * a; c.userData.e.material.opacity = .8 * a;
}
// costas: semicírculo verde atrás do zumbi
const back = prop(new THREE.Mesh(new THREE.CircleGeometry(1, 28, Math.PI / 2 - 1.2, 2.4), new THREE.MeshBasicMaterial({ color: '#8fe04a', transparent: true, opacity: .22, depthWrite: false, side: THREE.DoubleSide })));
back.rotation.x = -Math.PI / 2;
const backG = prop(new THREE.Group()); backG.add(back); back.visible = true;
// lanterna: feixe no chão à frente do sobrevivente
const torch = prop(new THREE.Group());
{ const m = new THREE.Mesh(new THREE.CircleGeometry(1, 24, -Math.PI / 2 - .34, .68), new THREE.MeshBasicMaterial({ color: '#fff2b0', transparent: true, opacity: .45, depthWrite: false, side: THREE.DoubleSide }));
  m.rotation.x = -Math.PI / 2; m.position.y = .04; torch.add(m); }
// mato (arbustos) e cerca alta de madeira
const bush = prop(new THREE.Group());
[[-.9, .2, .55], [.9, .1, .6], [-.4, -.7, .5], [.5, -.8, .55], [0, .75, .45], [-1.2, -.5, .45], [1.25, -.45, .5]].forEach(([x, z, r], i) => {
  const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), mat(i % 2 ? '#2f4a24' : '#3d5e2c', { flatShading: true })); b.position.set(x, r * .7, z); b.castShadow = true; b.receiveShadow = true; bush.add(b); });
const fence = prop(new THREE.Group());
for (let i = 0; i < 14; i++) { const p = box(.3, 1.9, .08, i % 2 ? '#7a5634' : '#86603a'); p.position.set(-2.1 + i * .31, .95, 0); p.castShadow = true; fence.add(p); }
{ const r = box(4.4, .1, .06, '#5a3d26'); r.position.set(0, 1.5, -.06); fence.add(r); const r2 = r.clone(); r2.position.y = .4; fence.add(r2); }

const step = (lf, per = 9) => lf - Math.floor(lf / per) * per;
// passos: um anel a cada passo, raio = barulho
function steps(x, z, lf, maxR, color, per = 9) { waves(x, z, step(lf, per), { period: 999, life: per * 3, maxR, color }); waves(x, z, step(lf, per) + per, { period: 999, life: per * 3, maxR, color }); waves(x, z, step(lf, per) + per * 2, { period: 999, life: per * 3, maxR, color }); }
const ALERT = '#ff3d55', OK = '#8fe04a';

run([
  // 0 — andando em pé: os passos chegam no zumbi e ele se vira
  (lf, f, len, c) => {
    const sx = lerp(-3.2, .6, lf / len), sz = -3.6; c.cam(sx + 1.6, -4.6, 8.4);
    pose(S, { x: sx, z: sz, ry: Math.PI / 2, ph: T(lf) * 6, amp: .6 });
    steps(sx, sz, lf, 4.6, '#ffffff', 10);
    const turn = ss(26, 40, lf), zx = 3.6, zz = -6.6;
    pose(Z[0], { x: zx - turn * T(Math.max(0, lf - 40)) * .9, z: zz + turn * T(Math.max(0, lf - 40)) * .5, ry: lerp(Math.PI * .1, face(zx, zz, sx, sz), turn), ph: T(f) * 4, amp: lf > 40 ? .5 : .05 });
    cone(0, Z[0].g.position.x, Z[0].g.position.z, Z[0].g.rotation.y, lerp(2.4, 3.6, turn), ALERT, .4 + turn * .6);
  },
  null,
  // 2 — agachado entre três zumbis, ninguém vê
  (lf, f, len, c) => {
    c.cam(.4, -5.2, 9.6);
    const sx = lerp(-3.4, 2.6, lf / len), sz = -5.4;
    pose(S, { x: sx, z: sz, ry: Math.PI / 2, ph: T(lf) * 4, amp: .45, crouch: 1, lean: .1 });
    steps(sx, sz, lf, .9, OK, 12);
    [[-1.0, -2.6, -Math.PI * .25], [2.2, -2.8, Math.PI * .5], [3.6, -7.6, Math.PI * .75]].forEach(([x, z, r], i) => { const ry = r + Math.sin(T(f) * .6 + i) * .25;
      pose(Z[i], { x, z, ry, ph: T(f) * 2 + i, amp: .08 }); cone(i, x, z, ry, 2.6, ALERT, .9); });
  },
  // 3 — ande agachado: anel grande -> anel pequeno
  (lf, f, len, c) => {
    const kc = 14, cr = ss(kc, kc + 8, lf), sx = lerp(-2.6, 1.8, lf / len), sz = -4.6;
    c.cam(sx + .8, -4.8, lerp(6.8, 6, ss(kc, kc + 20, lf)));
    pose(S, { x: sx, z: sz, ry: Math.PI / 2, ph: T(lf) * lerp(6, 4, cr), amp: lerp(.6, .45, cr), crouch: cr, lean: cr * .1 });
    const r = lerp(4.6, .9, cr);
    steps(sx, sz, lf, r, cr > .5 ? OK : '#ffffff', 10);
    const zx = 4.6, zz = -1.6; pose(Z[0], { x: zx, z: zz, ry: Math.PI * 1.25 + Math.sin(T(f) * .5) * .2, ph: T(f) * 2, amp: .06 });
  },
  // 4 — correr: anéis enormes, zumbis da rua inteira vêm
  (lf, f, len, c) => {
    const sx = lerp(-5, 3, lf / len), sz = .2; c.cam(sx * .5 - .5, -.6, lerp(10, 13.5, easeOut(lf / len)));
    pose(S, { x: sx, z: sz, ry: Math.PI / 2, ph: T(lf) * 13, amp: 1, lean: .18 });
    steps(sx, sz, lf, 9, ALERT, 6);
    for (let i = 0; i < 10; i++) { const a = R(i) * 6.28, d = 3.6 + R(i + 4) * 2.6, ox = -1 + Math.cos(a) * d, oz = sz + Math.sin(a) * d * .8, heard = 10 + i * 4, l = lf - heard;
      const k = clamp(l / 120) * .55, x = lerp(ox, sx, k), z = lerp(oz, sz, k);
      zWalk(Z[i], i, f, x, z, l > 0 ? face(x, z, sx, sz) : a, l > 0 ? 1.1 : .2); }
  },
  // 5 — passe por trás: cone vermelho na frente, costas verdes
  (lf, f, len, c) => {
    const k8 = c.C(8) - c.C(7), zx = .4, zz = -4.6, zry = Math.PI * .25;
    c.cam(.4, -5.2, 7.4);
    pose(Z[0], { x: zx, z: zz, ry: zry + Math.sin(T(f) * .7) * .08, ph: T(f) * 2, amp: .06 });
    cone(0, zx, zz, zry, 4.2, ALERT, 1);
    backG.visible = lf > k8; backG.position.set(zx, .1, zz); backG.rotation.y = zry; backG.scale.setScalar(lerp(.2, 2.6, easeOut(clamp((lf - k8) / 10))));
    // caminho por trás (arco atrás do zumbi)
    const p = clamp(lf / (len - 6)), ang = zry + Math.PI + lerp(-1.25, 1.25, p), rr = 2.0;
    const sx = zx + Math.sin(ang) * rr, sz = zz + Math.cos(ang) * rr;
    pose(S, { x: sx, z: sz, ry: ang + Math.PI / 2, ph: T(lf) * 4, amp: .45, crouch: 1, lean: .1 });
    steps(sx, sz, lf, .8, OK, 12);
  },
  // 6 — escuro: visão curta; lanterna acende e ele vê
  (lf, f, len, c) => {
    light('dark'); winMat.emissiveIntensity = .2; houses.forEach(h => h.wins.forEach(w => w.material.emissiveIntensity = .15));
    const k11 = c.C(11) - c.C(9), on = lf >= k11, l = lf - k11, sx = -.6, sz = -5.2, zx = 2.6, zz = -2.6;
    c.cam(1, -4, 7.2);
    pose(S, { x: sx, z: sz, ry: face(sx, sz, zx, zz) + (on ? 0 : -.6), ph: on ? 0 : T(lf) * 3, amp: on ? 0 : .35, crouch: 1, lean: .1, aim: on ? .5 : 0 });
    S.bat.visible = !on;
    const zry0 = Math.PI * 1.1, zry = on ? lerp(zry0, face(zx, zz, sx, sz), ss(4, 14, l)) : zry0 + Math.sin(T(f) * .5) * .15;
    const walk = on ? clamp((l - 14) / 40) : 0, x = lerp(zx, sx + 1, walk * .6), z = lerp(zz, sz + .8, walk * .6);
    pose(Z[0], { x, z, ry: zry, ph: T(f) * 4, amp: on && l > 14 ? .55 : .05 });
    cone(0, x, z, zry, on ? lerp(1.6, 4.4, ss(2, 12, l)) : 1.6, ALERT, on ? 1 : .55);
    if (on) { torch.visible = true; torch.position.set(sx, 0, sz); torch.rotation.y = S.g.rotation.y; torch.scale.setScalar(lerp(.5, 4.2, easeOut(clamp(l / 6))));
      flashAt(sx + Math.sin(S.g.rotation.y) * 1.6, .9, sz + Math.cos(S.g.rotation.y) * 1.6, '#fff0b0', 5, 8); }
  },
  // 7 — árvore + mato; depois cerca alta. O cone para no obstáculo (zumbi do outro lado).
  (lf, f, len, c) => {
    const k13 = c.C(13) - c.C(12);
    // linha zumbi -> obstáculo -> sobrevivente na horizontal da tela (esq -> dir = (+x,-z))
    const go = (ox, oz, l, isFence) => {
      const zx = ox - 2.7, zz = oz + Math.sin(T(l) * .5) * .3, zry = face(zx, zz, ox, oz) + Math.sin(T(l) * .7) * .12;
      pose(isFence ? Z[1] : Z[0], { x: zx, z: zz, ry: zry, ph: T(f) * 3, amp: .25 });
      const dist = Math.hypot(ox - zx, oz - zz) - (isFence ? .1 : .35);
      cone(0, zx, zz, zry, lerp(5.4, dist, ss(6, 18, l)), ALERT, 1);
      pose(S, { x: ox + 1.1, z: oz, ry: face(ox + 1.1, oz, zx, zz), ph: 0, amp: 0, crouch: 1, lean: .1, look: Math.sin(T(f) * 2) * .3 });
      c.cam(ox - .6, oz + .2, 8.2);
    };
    if (lf < k13) { const tx = 5.8, tz = -6.2; bush.visible = true; bush.position.set(tx, 0, tz); go(tx, tz, lf, false); }
    else { const fx = 11.5, fz = -5.4; fence.visible = true; fence.position.set(fx, 0, fz); fence.rotation.y = Math.PI / 2; go(fx, fz, lf - k13, true); }
  },
  // 8 — treino: anéis encolhem conforme o nível sobe
  (lf, f, len, c) => {
    const sx = lerp(-2.2, 2.4, lf / len), sz = -5.0; c.cam(sx + .6, -4.3, 7.8);
    const lv = clamp((lf - 30) / 50);
    pose(S, { x: sx, z: sz, ry: Math.PI / 2, ph: T(lf) * 4, amp: .45, crouch: 1, lean: .1 });
    steps(sx, sz, lf, lerp(1.1, .45, lv), OK, 12);
    [[1.2, -2.2, Math.PI * 1.3], [4.2, -7.4, Math.PI * .6]].forEach(([x, z, r], i) => { const ry = r + Math.sin(T(f) * .5 + i) * .2;
      pose(Z[i], { x, z, ry, ph: T(f) * 2 + i, amp: .06 }); cone(i, x, z, ry, lerp(2.8, 1.9, lv), ALERT, .8); });
  },
  // 9 — CTA: some agachado no mato
  (lf, f, len, c) => {
    const tx = 5.8, tz = -6.2; c.cam(lerp(4.6, 5.8, lf / len), -5.6, lerp(8.6, 7.4, easeOut(lf / len)));
    bush.visible = true; bush.position.set(tx, 0, tz);
    const sx = lerp(3.4, tx + .3, easeOut(clamp(lf / 50))), sz = lerp(-3.4, tz + 1.3, easeOut(clamp(lf / 50)));
    pose(S, { x: sx, z: sz, ry: face(sx, sz, tx + .3, tz + 1.3), ph: T(lf) * 4, amp: lf < 50 ? .45 : 0, crouch: 1, lean: .1 });
    { const zr = Math.sin(T(f) * .5) * .25; pose(Z[0], { x: 5.4, z: -8.8, ry: zr, ph: T(f) * 2, amp: .06 }); cone(0, 5.4, -8.8, zr, 2.4, ALERT, .8); }
  }
]);
