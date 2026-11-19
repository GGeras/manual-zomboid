// EP 11 — Armas de fogo (B42). Pistola M9 e escopeta JS-2000 com as malhas do jogo; zumbis com as animações do jogo.
import { THREE, pose, S, Z, zWalk, light, puff, sparks, splat, burst, prop, box, strike, swoosh, hitFx, flashAt, waves, scene, cam, PZ, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;

const CX = 1, CZ = 1.6;          // arena na rua (mesma do ep08)
const sm01 = t => { t = clamp(t); return t * t * (3 - 2 * t); };

// ---------- armas do jogo presas no tronco (linha de mira) + braços por IK até o cabo e a telha ----------
// pistola M9 (Handgun03 / M9_Pistol.x) e escopeta JS-2000 (Shotgun / PumpAction_Shotgun.x), malhas originais
const mk = (mesh, tex, flash) => { const g = new THREE.Group(); S.spine.add(g); const w = PZ.weapon(mesh, tex); g.add(w); const L = w.userData.len;
  const fl = new THREE.Mesh(new THREE.IcosahedronGeometry(flash, 0), new THREE.MeshBasicMaterial({ color: '#ffe27a' })); fl.position.z = L + flash * .6; g.add(fl);
  const mz = new THREE.Object3D(); mz.position.z = L; g.add(mz); g.userData = { w, fl, mz, L }; return g; };
const WP = mk('w_m9', 'm9_pistol', .1), WS = mk('w_pump', 'pumpaction_shotgun', .17);
const SH = S.aR.a.position.clone(), SHL = S.aL.a.position.clone();     // ombros (no espaço do tronco)
const L1 = Math.abs(S.aR.el.position.y), L2 = S.pz.hand;                 // braço e antebraço até o centro da mão
const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _t = new THREE.Quaternion(), _e = new THREE.Vector3(), _ax = new THREE.Vector3();
// IK de 2 ossos: leva a mão do braço (a: ombro, el: cotovelo) até P (espaço do tronco); cotovelo para baixo e para fora (side = +1 dir, -1 esq)
function reach(arm, P, side) { const sh = arm.a.position; _v.copy(P).sub(sh); let d = _v.length(); d = Math.min(d, L1 + L2 - .002); d = Math.max(d, Math.abs(L1 - L2) + .01);
  const ce = clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1), e = -Math.acos(ce);
  arm.el.rotation.set(e, 0, 0); arm.a.rotation.set(0, 0, 0);
  const h = new THREE.Vector3(0, -L1 - L2 * Math.cos(e), -L2 * Math.sin(e)).normalize(); _v.normalize();
  _q.setFromUnitVectors(h, _v); let best = 1e9, bq = _q.clone();
  for (let i = 0; i < 24; i++) { _t.setFromAxisAngle(_v, i / 24 * Math.PI * 2).multiply(_q); _e.set(0, -L1, 0).applyQuaternion(_t);
    const sc = _e.y * 2 - _e.x * side * 1.2 + Math.abs(_e.z) * .2; if (sc < best) { best = sc; bq.copy(_t); } }
  arm.a.quaternion.copy(bq); }
const hideAll = () => { WP.visible = false; WS.visible = false; S.gun.visible = false; S.flash.visible = false; S.bat.visible = false; };
// arma: 'pistol' | 'shotgun' | 'bat'
function arm(w, fire = false) { hideAll(); if (w === 'bat') { S.bat.visible = true; return; } const g = w === 'pistol' ? WP : WS; g.visible = true; g.userData.fl.visible = fire; }
// k: 0 = arma baixa (pronta) · 1 = mirando. kick = coice. lh: posição extra da mão esquerda (recarga), 0..1
const PIS = { grip: new THREE.Vector3(.02, .32, .5), up: new THREE.Vector3(.02, .38, .56) };
function aimPose(o, w, k, kick = 0, opt = {}) { pose(S, Object.assign({ ph: 0, amp: 0, look: 0 }, o));
  const sy = SH.y;
  if (w === 'pistol') { // duas mãos, braços quase estendidos, arma na altura dos olhos
    const g = WP; g.position.set(lerp(.05, .02, k), lerp(sy - .32, sy + .06, k), lerp(.34, .52, k)); g.rotation.set(lerp(.75, 0, k) - kick * .45, 0, 0);
    S.spine.rotation.x += lerp(.05, -.02, k) - kick * .04; S.neck.rotation.x = lerp(.25, .08, k);
    g.updateMatrix(); const gp = new THREE.Vector3(0, -.035, .03).applyMatrix4(g.matrix); reach(S.aR, gp, 1);
    if (opt.lh != null) { const u = Math.sin(clamp(opt.lh) * Math.PI); const base = new THREE.Vector3(-.12, sy - .55, .12), tgt = new THREE.Vector3(0, -.12, .03).applyMatrix4(g.matrix); reach(S.aL, base.lerp(tgt, u), -1); }
    else reach(S.aL, new THREE.Vector3(-.035, -.045, .02).applyMatrix4(g.matrix), -1); }
  else if (w === 'shotgun') { // coronha no ombro direito, cano na linha do olho; mão esquerda na telha
    const g = WS; const L = g.userData.L; g.position.set(lerp(.06, SH.x * .7, k), lerp(sy - .3, sy - .03, k), lerp(.1, .05, k)); g.rotation.set(lerp(.45, 0, k) - kick * .3, lerp(.1, -.03, k), 0);
    S.spine.rotation.y += lerp(.25, .38, k); S.neck.rotation.y = -lerp(.2, .38, k); S.neck.rotation.x = lerp(.2, .14, k); S.spine.rotation.x -= kick * .08;
    g.updateMatrix(); reach(S.aR, new THREE.Vector3(0, -.06, L * .3).applyMatrix4(g.matrix), 1);
    const fore = new THREE.Vector3(0, -.05, L * .62).applyMatrix4(g.matrix);
    if (opt.lh != null) { const u = Math.sin(clamp(opt.lh) * Math.PI), port = new THREE.Vector3(0, -.08, L * .42).applyMatrix4(g.matrix), belt = new THREE.Vector3(-.1, sy - .6, .05); reach(S.aL, u < .5 ? belt.lerp(port, u * 2) : port, -1); }
    else reach(S.aL, fore, -1); } }
// recarga da escopeta: a mão esquerda vai do cinto à janela de carga (fase 0..1 por cartucho)
const loadPh = u => clamp(u);
// tiro: clarão + luz + rastro da boca do cano até o alvo
const tracer = prop(new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, 1, 4), new THREE.MeshBasicMaterial({ color: '#fff4c0', transparent: true, opacity: .9 })));
const muzzle = w => { const g = w === 'shotgun' ? WS : WP; S.g.updateMatrixWorld(true); return g.userData.mz.getWorldPosition(new THREE.Vector3()); };
function shotW(age, w, x1, y1, z1) { if (age < 0 || age > 2) return; const a = muzzle(w); flashAt(a.x, a.y, a.z, '#ffd27a', w === 'shotgun' ? 12 : 9, 5); if (age > 1) return;
  const b = new THREE.Vector3(x1, y1, z1), d = b.clone().sub(a); tracer.visible = true; tracer.position.copy(a).addScaledVector(d, .5); tracer.scale.set(1, d.length(), 1); tracer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); }
const shotDead = (z, x, zz, ry, age) => pose(z, { x, z: zz, ry, clip: ['z_shotfall', age, false] });
// retícula (o jogo B42 mostra uma mira na tela): anel na altura da cabeça, virado para a câmera
const ret = prop(new THREE.Group()); { const m = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .95, depthTest: false });
  const r = new THREE.Mesh(new THREE.RingGeometry(.2, .24, 32), m); ret.add(r); [0, 1, 2, 3].forEach(i => { const b = new THREE.Mesh(new THREE.PlaneGeometry(.05, .14), m); b.position.set(Math.cos(i * Math.PI / 2) * .3, Math.sin(i * Math.PI / 2) * .3, 0); b.rotation.z = i * Math.PI / 2; ret.add(b); }); ret.renderOrder = 60; ret.userData.m = m; }
function reticle(x, y, z, col = '#ffffff', s = 1) { ret.visible = true; ret.position.set(x, y, z); ret.quaternion.copy(cam.quaternion); ret.scale.setScalar(s); ret.userData.m.color.set(col); }

// ---------- mapa do som (raio em quadrados: 1 quadrado = 1 unidade) ----------
const MAP = prop(new THREE.Group());
{ const g = new THREE.Mesh(new THREE.CircleGeometry(330, 64), new THREE.MeshLambertMaterial({ color: '#4f6a36' })); g.rotation.x = -Math.PI / 2; g.position.y = -.02; MAP.add(g);
  for (let i = 0; i < 9; i++) { const r = new THREE.Mesh(new THREE.PlaneGeometry(660, 5), new THREE.MeshLambertMaterial({ color: '#3a3a3c' })); r.rotation.x = -Math.PI / 2; r.position.set(0, -.01, -240 + i * 60); if (i % 2) r.rotation.z = Math.PI / 2, r.position.set(-240 + i * 60, -.01, 0); MAP.add(r); }
  for (let i = 0; i < 140; i++) { const a = R(i) * 6.28, d = 12 + R(i + 50) * 290, h = box(9 + R(i + 9) * 8, 4 + R(i + 3) * 4, 8 + R(i + 7) * 7, ['#8a6a4a', '#9a8a70', '#7a5a48', '#a89878'][i % 4]); h.position.set(Math.cos(a) * d, 2, Math.sin(a) * d); MAP.add(h); } }
const rMat = r => new THREE.Mesh(new THREE.RingGeometry(r - 2.2, r, 128), new THREE.MeshBasicMaterial({ color: '#ffb020', transparent: true, opacity: .95, depthWrite: false, side: THREE.DoubleSide }));
const R100 = prop(new THREE.Group()), R200 = prop(new THREE.Group());
[[R100, 100, '#ffb020'], [R200, 200, '#ff3d55']].forEach(([g, r, c]) => { const a = rMat(r); a.material.color.set(c); a.rotation.x = -Math.PI / 2; a.position.y = .3; g.add(a);
  const f = new THREE.Mesh(new THREE.CircleGeometry(r, 128), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .14, depthWrite: false })); f.rotation.x = -Math.PI / 2; f.position.y = .25; g.add(f); });
// zumbis do mapa (pontos)
const DOTS = Array.from({ length: 70 }, (_, i) => { const a = R(i * 3 + 1) * 6.28, d = 20 + R(i * 5 + 2) * 270, m = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 1, 10), new THREE.MeshBasicMaterial({ color: '#d8cfc0' }));
  const o = prop(m); o.userData = { a, d }; return o; });
function mapView(on, h) { if (on) { cam.far = 2000; cam.position.addScaledVector(cam.getWorldDirection(new THREE.Vector3()), -400); cam.updateProjectionMatrix(); scene.fog.near = 3000; scene.fog.far = 4000; }
  else { cam.far = 400; cam.updateProjectionMatrix(); scene.fog.near = 96; scene.fog.far = 150; } }

// ---------- garantia: tudo que esta cena mexe volta ao padrão a cada quadro ----------
function base() { hideAll(); ret.visible = false; tracer.visible = false; mapView(false); }

run([
  // 0 — um tiro resolve um zumbi (pistola, cabeça; zumbi cai para trás com a animação do jogo)
  (lf, f, len, c) => { base(); const H = 26; c.cam(CX + 1.5, CZ, lerp(7.2, 6.4, easeOut(lf / len))); c.shake(lf - H, .16);
    const zx = CX + 2.9; arm('pistol', lf >= H && lf < H + 2); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 }, 'pistol', ss(2, 14, lf), lf >= H && lf < H + 5 ? 1 - (lf - H) / 5 : 0);
    shotW(lf - H, 'pistol', zx - .1, 1.6, CZ);
    if (lf < H) zWalk(Z[0], 0, f, zx + Math.max(0, H - lf) * .02, CZ, -Math.PI / 2, .9); else shotDead(Z[0], zx, CZ, -Math.PI / 2, lf - H);
    burst(zx, 1.6, CZ, lf - H, 12, 3, Math.PI / 2); if (lf > H + 22) splat(zx + 1.2, CZ, .35 * clamp((lf - H - 22) / 10)); },
  // 1 — e chama todos os outros: ondas do tiro; zumbis de todos os lados viram e vêm
  (lf, f, len, c) => { base(); c.cam(CX + .5, CZ, lerp(9, 15, easeOut(lf / len))); arm('pistol'); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + Math.sin(T(lf) * 2.5) * 1.2 }, 'pistol', 1);
    waves(CX, CZ, lf, { period: 9, life: 40, maxR: 14, color: '#ffb020', until: 30 });
    shotDead(Z[0], CX + 3.2, CZ, -Math.PI / 2, 40);
    for (let i = 1; i < 11; i++) { const a = i * 0.63 + 0.3, r = 10 - T(lf) * 1.6, x = CX + Math.cos(a) * r, z = CZ + Math.sin(a) * r * .85; zWalk(Z[i], i, f, x, z, face(x, z, CX, CZ), 1.1); } },
  // 2 — cinco regras: pronto com a escopeta
  (lf, f, len, c) => { base(); c.cam(CX + .4, CZ, lerp(5.6, 5.0, easeOut(lf / len))); arm('shotgun'); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + .25, look: 0 }, 'shotgun', 1);
    for (let i = 0; i < 3; i++) zWalk(Z[i + 3], i + 3, f, CX + 7 - T(lf) * .8 + i * .9, CZ - 1.2 + i * 1.3, -Math.PI / 2, .9); },
  // 3 — barulho: mapa da cidade; tiro de pistola acende o raio de 100; tiro de escopeta acende o de 200
  (lf, f, len, c) => { base(); light('day'); const k4 = c.F[4] - c.C(3), k5 = c.F[5] - c.C(3), h1 = k4 + 8, h2 = k5 + 6;
    const hh = lf < k4 ? lerp(8, 30, ss(0, k4, lf)) : lf < k5 ? lerp(30, 250, easeOut(clamp((lf - h1) / 34))) : lerp(250, 470, easeOut(clamp((lf - h2) / 34)));
    c.cam(0, 0, hh, 0); mapView(true); MAP.visible = true; c.shake(lf - h1, .2 * hh / 40); c.shake(lf - h2, .3 * hh / 40);
    const w = lf < k5 ? 'pistol' : 'shotgun', ht = lf < k5 ? h1 : h2; arm(w, lf >= ht && lf < ht + 2); aimPose({ x: 0, z: 0, ry: Math.PI / 2 }, w, 1, lf >= ht && lf < ht + 5 ? 1 - (lf - ht) / 5 : 0);
    
    R100.visible = lf >= h1; R100.scale.setScalar(Math.max(.01, easeOut(clamp((lf - h1) / 26))));
    R200.visible = lf >= h2; R200.scale.setScalar(Math.max(.01, easeOut(clamp((lf - h2) / 26))));
    const rad = lf >= h2 ? 200 * easeOut(clamp((lf - h2) / 26)) : lf >= h1 ? 100 * easeOut(clamp((lf - h1) / 26)) : 0;
    DOTS.forEach((o, i) => { const { a, d } = o.userData, inR = d < rad; o.visible = true; o.material.color.set(inR ? '#ff3d55' : '#d8cfc0'); o.scale.setScalar(hh / 120);
      o.position.set(Math.cos(a) * d, .6, Math.sin(a) * d); }); },
  // 4 — todo zumbi nesse raio vem atrás de você
  (lf, f, len, c) => { base(); light('dawn'); c.cam(CX + .2, CZ, lerp(15, 11, easeOut(lf / len))); arm('shotgun'); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + Math.sin(T(lf) * 3) * 1.4 }, 'shotgun', 1);
    for (let i = 0; i < 14; i++) { const a = i * .45 + R(i) * .3, r = 8.5 - T(lf) * 1.6 + R(i + 3) * 1.5, x = CX + Math.cos(a) * r, z = CZ + Math.sin(a) * r * .9; zWalk(Z[i], i, f, x, z, face(x, z, CX, CZ), 1.15); } },
  // 5 — munição certa: mostra a pistola; depois a escopeta
  (lf, f, len, c) => { base(); const k9 = c.F[9] - c.C(7); c.cam(CX + .5, CZ - .2, lerp(4.6, 4.2, easeOut(lf / len)), 1.3); const w = lf < k9 ? 'pistol' : 'shotgun'; arm(w);
    const sw = lf >= k9 ? ss(k9, k9 + 10, lf) : 0;
    aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + .55, look: -.35 }, w, 1); },
  // 6 — encha os pentes antes (pistola parada, pente entra); escopeta: um cartucho por vez
  (lf, f, len, c) => { base(); const k11 = c.F[11] - c.C(10), L11 = len - k11; c.cam(CX + .4, CZ - .1, 4.4, 1.25);
    if (lf < k11) { arm('pistol'); const tIn = Math.round(k11 * .55) - 6, u = clamp((lf - tIn + 14) / 28); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + .6, look: -.4 }, 'pistol', 0, 0, { lh: u > 0 && u < 1 ? u : 0 }); }
    else { const l = lf - k11, per = Math.max(14, Math.floor((L11 - 24) / 5)); arm('shotgun'); const n = Math.floor((l - 10) / per); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + .6, look: -.4 }, 'shotgun', 0, 0, l >= 10 && n < 5 ? { lh: ((l - 10) % per) / per } : {}); } },
  // 7 — recarregue longe deles (certo); na recarga perto, ele agarra (errado)
  (lf, f, len, c) => { base(); const k13 = c.F[13] - c.C(12), per = 16;
    if (lf < k13) { light('day'); c.cam(CX + 2.6, CZ, lerp(11, 10, lf / k13)); arm('shotgun'); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + .5 }, 'shotgun', 0, 0, { lh: (lf % per) / per });
      for (let i = 0; i < 3; i++) zWalk(Z[i + 5], i + 5, f, CX + 6.2 - T(lf) * .5, CZ - 1.4 + i * 1.4, -Math.PI / 2, .8); }
    else { const l = lf - k13, grab = 22; light('dawn'); c.cam(CX + .8, CZ, 5.6); c.shake(l - grab, .18); arm('shotgun'); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + .5 }, 'shotgun', 0, 0, l < grab ? { lh: (l % per) / per } : {});
      const zx = lerp(CX + 3.5, CX + 1.05, sm01(l / grab)); zWalk(Z[6], 6, f, zx, CZ, -Math.PI / 2, 1, l > grab - 10 ? { attack: ((l - grab + 10) / 22) % 1 } : {});
      if (l > grab) puff(CX + .5, 1.5, CZ, l - grab, { n: 5, seed: 2, life: 16, size: .12, rise: .2, color: '#7a0f14', op: .8 }); } },
  // 8 — mire na cabeça (acerta) · pontaria · pânico (treme e pega no peito)
  (lf, f, len, c) => { base(); const k15 = c.F[15] - c.C(14), k16 = c.F[16] - c.C(14), H = 28, H2 = k16 + 34; const zx = CX + 3.1;
    c.cam(CX + 1.5, CZ, lf < k15 ? lerp(7.4, 6.8, lf / k15) : 7.4); c.shake(lf - H, .15); c.shake(lf - H2, .12);
    const pan = lf >= k16 ? 1 : 0, wob = pan * .55;
    arm('pistol', (lf >= H && lf < H + 2) || (lf >= H2 && lf < H2 + 2)); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 + Math.sin(T(lf) * 9) * .05 * pan }, 'pistol', 1, (lf >= H && lf < H + 5) ? 1 - (lf - H) / 5 : (lf >= H2 && lf < H2 + 5) ? 1 - (lf - H2) / 5 : 0);
    if (lf < k15) { reticle(zx - .1, 1.62, CZ, lf < H ? '#ffffff' : '#8fe04a', lerp(1.6, 1, ss(0, H - 6, lf))); shotW(lf - H, 'pistol', zx - .1, 1.62, CZ);
      if (lf < H) zWalk(Z[2], 2, f, zx, CZ, -Math.PI / 2, .7); else shotDead(Z[2], zx, CZ, -Math.PI / 2, lf - H); burst(zx, 1.62, CZ, lf - H, 12, 5, Math.PI / 2); }
    else if (lf < k16) { const l = lf - k15; for (let i = 0; i < 3; i++) { const h = 6 + i * 16, z2 = CZ - 1 + i; if (l < h) zWalk(Z[8 + i], 8 + i, f, zx, z2, -Math.PI / 2, .7); else shotDead(Z[8 + i], zx, z2, -Math.PI / 2, l - h); shotW(l - h, 'pistol', zx - .1, 1.62, z2); }
      arm('pistol', [6, 22, 38].some(h => l >= h && l < h + 2)); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 }, 'pistol', 1, [6, 22, 38].reduce((a, h) => l >= h && l < h + 5 ? 1 - (l - h) / 5 : a, 0)); }
    else { const l = lf - k16, zxx = lerp(zx + .4, CX + 1.6, sm01(l / (len - k16)));
      reticle(zxx - .1 + Math.sin(T(lf) * 11) * .35, 1.45 + Math.sin(T(lf) * 7.3) * .3, CZ + Math.cos(T(lf) * 9) * .3, '#ff3d55', 1.9);
      shotW(lf - H2, 'pistol', zxx - .1, 1.2, CZ + .2);
      if (lf >= H2 && lf < H2 + 30) pose(Z[3], { x: zxx, z: CZ, ry: -Math.PI / 2, clip: ['z_shotchest', lf - H2, false] }); else zWalk(Z[3], 3, f, zxx, CZ, -Math.PI / 2, 1.1);
      burst(zxx, 1.2, CZ, lf - H2, 6, 9, Math.PI / 2); } },
  // 9 — a arma trava (clique seco) · troca para o taco e resolve
  (lf, f, len, c) => { base(); const k18 = c.F[18] - c.C(17), J1 = 12, J2 = 26, HB = k18 + 30; c.cam(CX + .9, CZ, 5.8); c.shake(lf - HB, .2);
    const zx = lerp(CX + 3.6, CX + 1.45, sm01(lf / (k18 + 18)));
    if (lf < k18) { arm('pistol'); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 }, 'pistol', 1, (lf >= J1 && lf < J1 + 3) || (lf >= J2 && lf < J2 + 3) ? .25 : 0); }
    else { arm('bat'); const t = strike(lf, HB); pose(S, { x: CX, z: CZ, ry: Math.PI / 2, ph: 0, amp: 0, guard: 1, swing: t }); if (t >= 0) swoosh(S, t); }
    if (lf < HB) zWalk(Z[4], 4, f, zx, CZ, -Math.PI / 2, .9, lf > k18 ? { attack: (T(f) * 1.5) % 1 } : {});
    else pose(Z[4], { x: zx, z: CZ, ry: -Math.PI / 2, clip: ['z_death', lf - HB, false] });
    hitFx(zx - .1, 1.6, CZ, lf - HB, 0); burst(zx - .1, 1.6, CZ, lf - HB, 14, 7, Math.PI / 2); },
  // 10 — CTA: segue o canal; e o barulho traz a horda
  (lf, f, len, c) => { base(); light('dawn'); const k20 = c.F[20] - c.C(19), H = k20 + 10; c.cam(CX + .6, CZ, lerp(7.5, 13, easeOut(clamp((lf - k20) / 40)))); c.shake(lf - H, .25);
    arm('shotgun', lf >= H && lf < H + 2); aimPose({ x: CX, z: CZ, ry: Math.PI / 2 }, 'shotgun', 1, lf >= H && lf < H + 6 ? 1 - (lf - H) / 6 : 0);
    if (lf >= H && lf < H + 3) { const m = muzzle('shotgun'); flashAt(m.x, m.y, m.z, '#ffd27a', 12, 6); }
    waves(CX, CZ, lf - H, { period: 8, life: 44, maxR: 16, color: '#ff3d55', until: 30 });
    const zx = CX + 3.6; if (lf < H) zWalk(Z[0], 0, f, zx, CZ, -Math.PI / 2, .7); else shotDead(Z[0], zx, CZ, -Math.PI / 2, lf - H);
    burst(zx, 1.5, CZ, lf - H, 16, 11, Math.PI / 2);
    if (lf > H) for (let i = 1; i < 16; i++) { const a = i * .41, r = 15 - T(lf - H) * 2.2 + R(i) * 2, x = CX + Math.cos(a) * r, z = CZ + Math.sin(a) * r * .9; zWalk(Z[i], i, f, x, z, face(x, z, CX, CZ), 1.2); } }
]);
