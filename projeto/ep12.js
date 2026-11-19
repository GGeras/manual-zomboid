import { THREE, PZ, scene, pose, S, Z, zWalk, light, puff, prop, box, mat, U } from './engine.js';
import { run } from './ep3d.js';
import { river, RA, RVX, RVZ, rain } from './sets.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };

// ---------- horta (longe da cidade) ----------
const FX = 100, FZ = -45;
const FARM = prop(new THREE.Group()); FARM.position.set(FX, 0, FZ);
const grassM = new THREE.MeshLambertMaterial({ color: '#4c6b34' }), soilM = new THREE.MeshLambertMaterial({ color: '#5a3f26' });
{ const g = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), grassM); g.rotation.x = -Math.PI / 2; g.position.y = .01; g.receiveShadow = true; FARM.add(g);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.2), soilM); s.rotation.x = -Math.PI / 2; s.position.y = .02; s.receiveShadow = true; FARM.add(s);
  for (let r = 0; r < 4; r++) { const f = box(6, .08, .32, '#4a321e'); f.position.set(0, .04, -1.35 + r * .9); f.receiveShadow = true; FARM.add(f); }
  [[-3.4, -2.3], [3.4, -2.3], [-3.4, 2.3], [3.4, 2.3]].forEach(([x, z]) => { const p = box(.12, .9, .12, '#6a4a2a'); p.position.set(x, .45, z); p.castShadow = true; FARM.add(p); }); }
const leafGeo = new THREE.IcosahedronGeometry(.2, 0), fruitGeo = new THREE.SphereGeometry(.075, 10, 8), moldGeo = new THREE.SphereGeometry(.035, 6, 5);
function mkPlant(seed) { const g = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color: '#4f8a2e', flatShading: true }), leaves = [], fruits = [], mold = new THREE.Group();
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + R(seed + i), piv = new THREE.Group(); piv.rotation.y = a; const l = new THREE.Mesh(leafGeo, m); l.scale.set(1.3, .35, .7); l.position.set(.17, .12 + (i % 2) * .08, 0); l.castShadow = true; piv.add(l); g.add(piv); leaves.push(piv); }
  const fm = new THREE.MeshLambertMaterial({ color: '#d8261c' });
  for (let i = 0; i < 4; i++) { const f = new THREE.Mesh(fruitGeo, fm); f.position.set(Math.cos(i * 1.7) * .17, .22 + (i % 2) * .1, Math.sin(i * 1.7) * .17); f.castShadow = true; g.add(f); fruits.push(f); }
  for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(moldGeo, new THREE.MeshLambertMaterial({ color: '#f2f2ea' })); const a = R(seed * 7 + i) * 6.28; d.position.set(Math.cos(a) * (.1 + R(i + seed) * .2), .17 + R(i * 3 + seed) * .12, Math.sin(a) * (.1 + R(i + seed) * .2)); mold.add(d); }
  g.add(mold); FARM.add(g); return { g, m, fm, leaves, fruits, mold }; }
const PL = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { const p = mkPlant(r * 5 + c + 1); p.g.position.set(-2.4 + c * 1.2, .06, -1.35 + r * .9); PL.push(p); }
const GREEN = new THREE.Color('#4f8a2e'), DRY = new THREE.Color('#7a5a2a'), RED = new THREE.Color('#d8261c'), ROT = new THREE.Color('#3e2a18'), CURSE = new THREE.Color('#4a3a2a');
// o = { grow 0..1, dry 0..1, mold 0..1, fruit 0..1, rot 0..1, curse }
function setP(p, o = {}) { const grow = o.grow ?? .8, dry = o.dry ?? 0; p.g.visible = grow > .01; p.g.scale.setScalar(Math.max(.01, grow) * (1 - dry * .25));
  p.m.color.copy(GREEN).lerp(o.curse ? CURSE : DRY, dry); p.leaves.forEach((l, i) => { l.children[0].rotation.z = -dry * .9 - (i % 2) * .1; });
  p.mold.visible = (o.mold || 0) > .02; p.mold.children.forEach((d, i) => d.visible = i / 14 < (o.mold || 0));
  p.fm.color.copy(RED).lerp(ROT, o.rot || 0); p.fruits.forEach((f, i) => { f.visible = (o.fruit || 0) > .02 && !(o.picked && i < 2); f.scale.setScalar(Math.max(.01, o.fruit || 0)); f.position.y = (.22 + (i % 2) * .1) - (o.rot || 0) * (.18 + (i % 2) * .1); }); }
function farm(o = {}, each) { FARM.visible = true; grassM.color.set(o.winter ? new THREE.Color('#4c6b34').lerp(new THREE.Color('#dfe6ea'), o.winter) : '#4c6b34'); soilM.color.set(o.winter ? new THREE.Color('#5a3f26').lerp(new THREE.Color('#c9cdd0'), o.winter) : '#5a3f26');
  PL.forEach((p, i) => setP(p, each ? each(i, p) : o)); }
const FA = (x, z) => ({ x: FX + x, z: FZ + z });
const P = (r, c) => FA(-2.4 + c * 1.2, -1.35 + r * .9);   // posição da planta (linha, coluna)

// ---------- objetos na mão (ícones originais do jogo) ----------
const handIcon = n => { const s = prop(PZ.icon3d(n, .5)); scene.add(s); return s; };
const CAN = handIcon('Item_WateringCan'), SPRAY = handIcon('Item_TZ_GardeningSprayCan'), FERT = handIcon('Item_Fertilizer'), COMP = handIcon('Item_Compost'), TOM = handIcon('Item_Tomato');
const FISH = handIcon('Item_Fish_BassLargemouth');
function hand(h = S) { h.g.updateMatrixWorld(true); return new THREE.Vector3(0, h.pz ? -h.pz.hand : -.36, .05).applyMatrix4(h.aR.el.matrixWorld); }
function holdIcon(o, dy = .05) { o.visible = true; o.position.copy(hand()).add(new THREE.Vector3(0, dy, 0)); }
const stream = prop(new THREE.Mesh(new THREE.CylinderGeometry(.018, .022, 1, 8), new THREE.MeshLambertMaterial({ color: '#8fd0ff', emissive: '#3a8acc', emissiveIntensity: .4, transparent: true, opacity: .85 })));
function pour(from, to, k = 1) { stream.visible = k > .02; const d = to.clone().sub(from), L = d.length(); stream.position.copy(from).add(to).multiplyScalar(.5); stream.scale.set(k, L, k); stream.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); }

// ---------- vara de pesca (linha e boia) ----------
const ROD_L = 2.1, ROD = prop(new THREE.Group()); { const g = new THREE.CylinderGeometry(.012, .028, ROD_L, 6); g.rotateX(Math.PI / 2); g.translate(0, 0, ROD_L / 2); const m = new THREE.Mesh(g, mat('#3a2a1a')); m.castShadow = true; ROD.add(m);
  const reel = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .05, 10), mat('#9a9aa0')); reel.rotation.z = Math.PI / 2; reel.position.set(0, -.05, .25); ROD.add(reel); } scene.add(ROD);
const LINE = prop(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: '#e8e8e8' }))); scene.add(LINE);
const BOB = prop(new THREE.Group()); { const a = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8, 0, 6.29, 0, 1.6), mat('#e8e8e8')), b = new THREE.Mesh(new THREE.SphereGeometry(.07, 10, 8, 0, 6.29, 1.6, 1.6), mat('#d8261c')); BOB.add(a, b); } scene.add(BOB);
// tilt: inclinação da vara (rad, + = para cima); bob: posição da boia (ou null); line: linha visível
function rod(tilt, bob, line = true, sag = 0) { const h = hand(); ROD.visible = true; ROD.position.copy(h); ROD.rotation.order = 'YXZ'; ROD.rotation.set(-tilt, S.g.rotation.y, 0);
  ROD.updateMatrixWorld(true); const tip = new THREE.Vector3(0, 0, ROD_L).applyMatrix4(ROD.matrixWorld);
  if (bob) { BOB.visible = true; BOB.position.copy(bob); }
  if (line) { LINE.visible = true; const end = bob || tip.clone().add(new THREE.Vector3(0, -.6, 0)); const a = LINE.geometry.attributes.position; a.setXYZ(0, tip.x, tip.y, tip.z); a.setXYZ(1, end.x, end.y + .06, end.z); a.needsUpdate = true; }
  return tip; }
const splash = (x, z, age, seed = 0, k = 1) => puff(x, .05, z, age, { n: 8, seed, life: 20, size: .12 * k, rise: .6, color: '#cfe8f5', op: .8 });
const W = (x, z) => new THREE.Vector3(RVX + x, .03, RVZ + z);   // ponto na água (z < -1)

const sx0 = -1.2, sz0 = .5;   // sobrevivente na margem, de costas para a câmera, olhando a água (-z)
function fisher(lf, o = {}) { pose(S, Object.assign({ x: RVX + sx0, z: RVZ + sz0, ry: Math.PI, ph: 0, amp: 0, hold: 1, lean: -.04 }, o)); S.bat.visible = false; }

run([
  // 0 — a horta secando; um zumbi passa e nem liga
  (lf, f, len, c) => { const k1 = c.C(1) - c.C(0); farm({}, i => ({ grow: .85, dry: sm((lf - 6) / (k1 + 10)) * (.7 + R(i) * .3) })); S.bat.visible = false;
    c.cam(FX - 1.5, FZ + 2.0, lerp(7.6, 6.8, easeOut(lf / len)), 1);
    pose(S, { x: FX - 2.2, z: FZ + 3.0, ry: face(FX - 1.7, FZ + 2.3, FX, FZ), ph: 0, amp: 0, slump: sm((lf - 20) / 40) * .5 });
    if (lf > k1 - 10) zWalk(Z[0], 0, f, FX + 6 - (lf - k1 + 10) * .03, FZ - 3.5, -Math.PI / 2, .9); },
  // 1 — mês certo: cava e planta; fora da época nasce condenada; inverno: só os resistentes
  (lf, f, len, c) => { const k4 = c.F[4] - c.C(2), k5 = c.C(5) - c.C(2); S.bat.visible = false;
    const winter = sm((lf - k5) / 30), seedA = sm((lf - 30) / 30), seedB = sm((lf - k4 - 30) / 20);
    farm({ winter }, i => { const res = i === 6 || i === 7 || i === 8;
      if (lf < k5) return i === 7 ? { grow: .1 + seedA * .3 } : i === 12 ? { grow: seedB * .45, dry: seedB, curse: 1 } : { grow: 0 };
      return res ? { grow: .75 } : { grow: .6, dry: winter, curse: i === 12 }; });
    const p = P(1, 2), q = P(2, 2), tgt0 = lf < c.F[4] - c.C(2) ? p : q;
    if (lf < k5) { c.cam(tgt0.x - .45, tgt0.z + .45, lerp(5.2, 4.6, lf / k5), .8);
      const tgt = tgt0; pose(S, { x: tgt.x - .9, z: tgt.z + .9, ry: face(tgt.x - .9, tgt.z + .9, tgt.x, tgt.z), ph: 0, amp: 0, crouch: .8, lean: .28 });
      if (lf > k4 + 30) for (let n = 0; n < 2; n++) puff(q.x, .3, q.z, (lf + n * 15) % 30, { n: 2, seed: n, life: 30, size: .1, rise: .3, color: '#3a2a1a', op: .5 });
    } else { light(winter > .5 ? 'dawn' : 'day'); c.cam(FX - 1.5, FZ + 2.0, 7.4, 1);
      pose(S, { x: FX - 2.4, z: FZ + 3.0, ry: face(FX - 1.7, FZ + 2.3, FX, FZ), ph: 0, amp: 0, slump: .2 });
      for (let n = 0; n < 3; n++) puff(FX - 2.3, 1.75, FZ + 2.9, (lf + n * 9) % 28, { n: 1, seed: n, life: 28, size: .1, rise: .4, color: '#ffffff', op: .4 }); } },
  // 2 — água: rega; secou depois de brotar = morreu; a chuva rega
  (lf, f, len, c) => { const k7 = c.F[7] - c.C(6), k8 = c.C(8) - c.C(6), dead = sm((lf - k7 - 30) / 14), wet = lf >= k8 ? sm((lf - k8) / 40) : 0;
    const p = P(1, 1); S.bat.visible = false;
    farm({}, i => i === 6 ? { grow: .5, dry: Math.max(lf < k8 ? sm((lf - 40) / (k7 - 10)) * .5 : .6, dead) } : { grow: .55, dry: lf < k8 ? sm((lf - 40) / k7) * .45 : .45 * (1 - wet) });
    if (lf < k8) { c.cam(p.x - .5, p.z + .35, lerp(5, 4.4, lf / k8), .8);
      pose(S, { x: p.x - 1.0, z: p.z + .7, ry: face(p.x - 1.0, p.z + .7, p.x, p.z), ph: 0, amp: 0, hold: lf < 40 ? .8 : 0, lean: .12 });
      if (lf < 40) { holdIcon(CAN); const h = hand(); pour(h.clone().add(new THREE.Vector3(.15, 0, -.1)), new THREE.Vector3(p.x, .1, p.z), sm(lf / 6) * (1 - sm((lf - 34) / 6))); } }
    else { c.cam(FX - 1.5, FZ + 2.0, 7.4, 1); rain(FX, FZ, f, wet); light('dawn');
      pose(S, { x: FX - 2.6, z: FZ + 2.9, ry: face(FX - 1.7, FZ + 2.3, FX, FZ), ph: 0, amp: 0 }); } },
  // 3 — fertilizante: um por estágio cresce; dois machuca; composto pode
  (lf, f, len, c) => { const a = c.F[9] + 40 - c.C(9), b = c.C(10) + 6 - c.C(9), d = c.C(11) + 6 - c.C(9), p = P(2, 2); S.bat.visible = false;
    const st = .45 + sm((lf - a) / 12) * .2, hurt = sm((lf - b - 8) / 10) * (1 - sm((lf - d - 10) / 30) * .6);
    farm({}, i => i === 12 ? { grow: st, dry: hurt * .5 } : { grow: .5 });
    c.cam(p.x - .45, p.z + .4, 4.6, .7);
    pose(S, { x: p.x - .9, z: p.z + .8, ry: face(p.x - .9, p.z + .8, p.x, p.z), ph: 0, amp: 0, crouch: .8, lean: .28 });
    const ico = lf < d ? FERT : COMP; if (lf > a - 20) holdIcon(ico, .1);
    [[a, '#c8d070'], [b, '#c8d070'], [d, '#5a3f26']].forEach(([t, col], n) => puff(p.x, .25, p.z, lf - t, { n: 7, seed: n, life: 22, size: .14, rise: .3, color: col, op: .7 }));
    if (lf > b + 6 && lf < d) puff(p.x, .5, p.z, lf - b - 6, { n: 5, seed: 9, life: 18, size: .1, rise: .5, color: '#ff3d55', op: .6 }); },
  // 4 — míldio toma a planta; spray de leite cura
  (lf, f, len, c) => { const k13 = c.C(13) - c.C(12), sp = k13 + 14, p = P(1, 2); S.bat.visible = false;
    const mold = sm((lf - 10) / 60) * (1 - sm((lf - sp - 10) / 30)), dry = sm((lf - 30) / 70) * .8 * (1 - sm((lf - sp - 10) / 30));
    farm({}, i => i === 7 ? { grow: .7, mold, dry } : { grow: .6 });
    c.cam(p.x - .5, p.z + .4, lerp(4.4, 4, lf / len), .8);
    pose(S, { x: p.x - 1.0, z: p.z + .8, ry: face(p.x - 1.0, p.z + .8, p.x, p.z), ph: 0, amp: 0, hold: lf > sp - 10 ? .8 : 0, crouch: .3, lean: .15 });
    if (lf > sp - 10) { holdIcon(SPRAY, .08); for (let n = 0; n < 4; n++) puff(lerp(p.x - .5, p.x, .5), .6, p.z + .2, (lf - sp + n * 6) % 24, { n: 3, seed: n, life: 24, size: .12, rise: .1, color: '#ffffff', op: lf < sp + 50 ? .55 : 0 }); } },
  // 5 — colha na hora; o tomate esquecido apodrece
  (lf, f, len, c) => { const k15 = c.C(15) - c.C(14), pk = c.F[14] + 27 - c.C(14), rot = sm((lf - k15 - 10) / 50); S.bat.visible = false;
    farm({}, i => ({ grow: .85, fruit: 1, rot: i === 7 ? 0 : (lf > k15 ? rot : 0), picked: i === 7 && lf > pk }));
    const p = P(1, 2);
    if (lf < k15) { c.cam(p.x - .45, p.z + .4, 4.6, .8); pose(S, { x: p.x - .95, z: p.z + .75, ry: face(p.x - .95, p.z + .75, p.x, p.z), ph: 0, amp: 0, hold: lf > pk - 12 && lf < pk + 30 ? .8 : 0, crouch: .45, lean: .2 });
      if (lf > pk - 4 && lf < pk + 30) holdIcon(TOM, .05); }
    else { const q = P(2, 3); c.cam(lerp(FX - 2.8, q.x, .6), lerp(FZ + 3, q.z, .6), lerp(5.4, 4.8, (lf - k15) / (len - k15)), .8); pose(S, { x: FX - 2.8, z: FZ + 3, ry: face(FX - 1.7, FZ + 2.3, FX, FZ), ph: 0, amp: 0 }); } },
  // 6 — pesca: lança a linha; sem isca só lixo
  (lf, f, len, c) => { river(f); fisher(lf); const cast = c.F[16] + 27 - c.C(16), k17 = c.C(17) - c.C(16);
    c.cam(RVX + sx0 + .3, RVZ + sz0 - .9, lerp(6.4, 5.8, easeOut(lf / len)), 1);
    const u = sm((lf - cast + 14) / 14), bob = lf >= cast ? W(sx0 + .1, -4.2).add(new THREE.Vector3(0, Math.sin(T(f) * 4) * .015, 0)) : null;
    rod(lerp(1.1, .45, u), bob, lf >= cast - 2); splash(RVX + sx0 + .1, RVZ - 4.2, lf - cast, 1);
    if (lf > k17 + 40) { const r = sm((lf - k17 - 40) / 30); BOB.position.lerp(W(sx0 + .1, -1.4).setY(.2), r); rod(lerp(.45, 1.0, r), BOB.position.clone()); } },
  // 7 — minigame: mordeu, puxa; frouxa foge; vermelho arrebenta
  (lf, f, len, c) => { river(f); const k19 = c.C(19) - c.C(18), k20 = c.C(20) - c.C(18), snap = c.F[20] + 30 - c.C(18);
    c.cam(RVX + sx0 + .3, RVZ + sz0 - .9, 6.0, 1);
    const pull = lf > 16 && lf < k19 ? 1 : lf > k20 && lf < snap ? 1.4 : 0, sway = pull ? Math.sin(T(f) * 9) * .06 * pull : 0;
    fisher(lf, { ry: Math.PI + sway, lean: pull ? -.24 : -.04 });
    const bz = -4.2 + clamp((lf - 16) / 60) * 1.0, dip = lf > 10 && lf < k19 ? Math.max(0, Math.sin(T(f) * 14)) * .08 : lf > k20 && lf < snap ? .06 : 0;
    const bob = W(sx0 + .1 + sway * 3, bz).add(new THREE.Vector3(0, -dip, 0));
    const tilt = pull ? .95 + sway : lf >= snap ? .7 : .55;
    if (lf < snap) { rod(tilt, bob); splash(bob.x, bob.z, lf - 12, 2); splash(bob.x, bob.z, lf - k20 - 4, 3); if (lf > k19 + 10 && lf < k20) splash(bob.x + .4, bob.z - .6, lf - k19 - 14, 4, 1.4); }
    else { rod(tilt, null, false); BOB.visible = false; puff(RVX + sx0 + .2, 1.2, RVZ + sz0 - 2.2, lf - snap, { n: 6, seed: 5, life: 16, size: .08, rise: .2, color: '#ffffff', op: .8 }); c.shake(lf - snap, .15); } },
  // 8 — madrugada, longe da margem, pega o peixe; buzina espanta tudo
  (lf, f, len, c) => { river(f); light('dawn'); const catchF = c.F[21] + 102 - c.C(21), k22 = c.C(22) - c.C(21); fisher(lf);
    c.cam(RVX + sx0 + .3, RVZ + sz0 - 1.1, lerp(7.0, 6.4, lf / len), 1);
    if (lf < catchF) { const bob = W(sx0 + .1, -7.5).add(new THREE.Vector3(0, Math.sin(T(f) * 4) * .015, 0)); const reel = sm((lf - catchF + 50) / 50); bob.lerp(W(sx0 + .1, -1.6), reel); rod(.55 + reel * .5, bob); splash(bob.x, bob.z, lf - 10, 1); }
    else if (lf < k22) { rod(1.0, null, true); BOB.visible = false; const t = sm((lf - catchF) / 14); FISH.visible = true; FISH.position.copy(new THREE.Vector3(RVX + sx0 + .1, lerp(.3, 1.4, t), RVZ + lerp(-1.6, sz0 - .5, t))); }
    else { rod(.55, W(sx0 + .1, -6), true); for (let n = 0; n < 3; n++) splash(RVX + (n - 1) * 1.5, RVZ - 5 - n, lf - k22 - 4 - n * 3, n + 6, 1.3); } },
  // 9 — horta cheia de tomate: comida que cresce não acaba
  (lf, f, len, c) => { farm({}, i => ({ grow: .9, fruit: 1 })); S.bat.visible = false; c.cam(FX - 1.5, FZ + 2.0, lerp(7.6, 6.8, easeOut(lf / len)), 1);
    pose(S, { x: FX - 2.4, z: FZ + 2.9, ry: face(FX - 1.7, FZ + 2.3, FX, FZ), ph: 0, amp: 0 }); holdIcon(TOM, .05); }
]);
