import { THREE, scene, pose, S, Z, zWalk, light, puff, flashAt, prop, box, mat, cans, U } from './engine.js';
import { run } from './ep3d.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;

// ---------- cozinha em corte (estilo do jogo: paredes do fundo, sem as da frente) ----------
const KX = 40, KZ = -5;
const K = prop(new THREE.Group()); K.position.set(KX, 0, KZ);
const add = (o, x, y, z) => { o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; K.add(o); return o; };
{ // piso xadrez
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#d8d2c2' : '#8f8a7e'; g.fillRect(i * 16, j * 16, 16, 16); }
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.magFilter = THREE.NearestFilter;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshLambertMaterial({ map: tx })); fl.rotation.x = -Math.PI / 2; fl.position.y = .02; fl.receiveShadow = true; K.add(fl);
}
add(box(7, 2.6, .2, '#c9b48a'), 0, 1.3, -3.5); add(box(.2, 2.6, 7, '#bfa982'), -3.5, 1.3, 0);
add(box(7, .25, .22, '#8a6a46'), 0, .12, -3.38); add(box(.22, .25, 7, '#8a6a46'), -3.38, .12, 0);
const winK = new THREE.MeshLambertMaterial({ color: '#cfe6ff', emissive: '#9cc8ff', emissiveIntensity: .7 });
add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1, .06), winK), .6, 1.6, -3.38);
// bancada + pia + fogão
add(box(3.0, .9, .7, '#efe9dc'), .3, .45, -3.0); add(box(3.04, .06, .74, '#7a6a5a'), .3, .93, -3.0);
const stove = add(box(.9, .9, .7, '#2e2e30'), 2.4, .45, -3.0);
[[-.2, -.15], [.2, -.15], [-.2, .15], [.2, .15]].forEach(([a, b]) => add(new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .02, 12), mat('#111')), 2.4 + a, .91, -3.0 + b));
const pan = add(new THREE.Group(), 2.2, .94, -2.85); { const p = new THREE.Mesh(new THREE.CylinderGeometry(.22, .18, .08, 14), mat('#444')); p.position.y = .04; pan.add(p); const h = box(.32, .03, .05, '#222'); h.position.set(.32, .07, 0); pan.add(h); }
const flames = []; for (let i = 0; i < 5; i++) { const fm = new THREE.Mesh(new THREE.ConeGeometry(.05, .16, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffb020' : '#ff5a1a', transparent: true, opacity: .9 })); add(fm, 2.2 + Math.cos(i * 1.26) * .13, .97, -2.85 + Math.sin(i * 1.26) * .13); fm.castShadow = false; flames.push(fm); }
// geladeira (freezer em cima)
const FR = { x: -2.6, z: -2.7 };
// casco oco: dá pra ver a comida dentro
add(box(1.0, 2.1, .06, '#e6e6e2'), FR.x, 1.05, FR.z - .37);
[-.48, .48].forEach(dx => add(box(.06, 2.1, .8, '#eeeeea'), FR.x + dx, 1.05, FR.z));
add(box(1.0, .06, .8, '#eeeeea'), FR.x, 2.08, FR.z); add(box(1.0, .12, .8, '#d8d8d4'), FR.x, .06, FR.z);
add(box(.92, .06, .76, '#eeeeea'), FR.x, 1.45, FR.z);
const inner = new THREE.MeshLambertMaterial({ color: '#f4f8ff', emissive: '#dff0ff', emissiveIntensity: .9 });
add(new THREE.Mesh(new THREE.BoxGeometry(.86, 1.3, .02), inner), FR.x, .76, FR.z - .33);
add(new THREE.Mesh(new THREE.BoxGeometry(.86, .55, .02), inner), FR.x, 1.75, FR.z - .33);
add(box(.9, .03, .7, '#cfe3ee', { transparent: true, opacity: .6 }), FR.x, .84, FR.z);
const mkDoor = (h, y) => { const g = new THREE.Group(); g.position.set(FR.x - .5, y, FR.z + .41); K.add(g); const d = box(1.0, h, .07, '#f6f6f2'); d.position.set(.5, 0, 0); d.castShadow = true; g.add(d);
  const hd = box(.05, h * .4, .05, '#9a9a9a'); hd.position.set(.9, 0, .06); g.add(hd); return g; };
const doorF = mkDoor(1.38, .72), doorZ = mkDoor(.6, 1.76);
const lamp = new THREE.PointLight('#fff2d8', 0, 9, 1.4); lamp.position.set(0, 2.4, 0); K.add(lamp);
const fLight = new THREE.PointLight('#dff0ff', 0, 3, 1.5); fLight.position.set(FR.x, 1.1, FR.z + .9); K.add(fLight);
// mesa
add(box(1.3, .08, .9, '#8a5a32'), .6, .78, -.4); [[-.55, -.35], [.55, -.35], [-.55, .35], [.55, .35]].forEach(([a, b]) => add(box(.07, .78, .07, '#6a4426'), .6 + a, .39, -.4 + b));
// comidas (frescas -> velhas -> podres)
const FOOD = [
  { m: new THREE.Mesh(new THREE.BoxGeometry(.32, .07, .22), new THREE.MeshLambertMaterial()), c: ['#c0392b', '#8a5a3a', '#55663a'] },   // bife
  { m: new THREE.Mesh(new THREE.IcosahedronGeometry(.1, 1), new THREE.MeshLambertMaterial()), c: ['#d42c26', '#8f4a2a', '#4f5f2a'] },   // maçã
  { m: new THREE.Mesh(new THREE.BoxGeometry(.34, .14, .16), new THREE.MeshLambertMaterial()), c: ['#d9ad62', '#a8966a', '#6f7d4f'] },   // pão
  { m: new THREE.Mesh(new THREE.BoxGeometry(.12, .26, .12), new THREE.MeshLambertMaterial()), c: ['#f2f2ee', '#d8d2b8', '#a8ad7a'] }    // leite
];
FOOD.forEach(o => { o.m.castShadow = true; K.add(o.m); });
const frost = FOOD.map(o => { const f = new THREE.Mesh(o.m.geometry, new THREE.MeshLambertMaterial({ color: '#dff4ff', transparent: true, opacity: 0, emissive: '#9fd8ff', emissiveIntensity: .4, depthWrite: false })); f.scale.setScalar(1.12); K.add(f); return f; });
const TABLE = [[.25, .85, -.5], [.6, .9, -.25], [.95, .89, -.5], [.75, .95, -.7]];
const SHELF = [[FR.x - .2, .2, FR.z + .05], [FR.x + .18, .23, FR.z + .1], [FR.x - .18, .93, FR.z + .02], [FR.x + .22, .98, FR.z]];
const FREEZ = [[FR.x - .2, 1.52, FR.z + .08], [FR.x + .2, 1.58, FR.z + .08], [FR.x - .05, 1.56, FR.z - .15], [FR.x + .3, 1.62, FR.z - .15]];
// moscas
const flies = Array.from({ length: 10 }, () => { const m = box(.03, .03, .03, '#111'); m.castShadow = false; K.add(m); return m; });
// secos: arroz e macarrão
const dry = [['#e9e2cc', '#c8402a'], ['#f0d27a', '#2a5ab8'], ['#e9e2cc', '#c8402a']].map(([a, b]) => { const g = new THREE.Group(); const bx = box(.22, .3, .12, a); bx.position.y = .15; g.add(bx); const lb = box(.225, .1, .125, b); lb.position.y = .17; g.add(lb); K.add(g); return g; });

const W = (x, z) => [KX + x, KZ + z];
function food(stage, place = TABLE, fz = 0, f = 0) { // stage 0..2 contínuo
  FOOD.forEach((o, i) => { o.m.visible = true; const p = place[i]; o.m.position.set(p[0], p[1], p[2]); o.m.rotation.y = i * .6;
    const a = clamp(stage), b = clamp(stage - 1), c0 = new THREE.Color(o.c[0]), c1 = new THREE.Color(o.c[1]), c2 = new THREE.Color(o.c[2]);
    o.m.material.color.copy(c0.lerp(c1, a).lerp(c2, b));
    o.m.scale.set(1, lerp(1, .78, b), 1);
    frost[i].visible = fz > 0; frost[i].position.copy(o.m.position); frost[i].rotation.copy(o.m.rotation); frost[i].material.opacity = .55 * fz; });
  const rotten = clamp(stage - 1.4) * 1.6;
  flies.forEach((m, i) => { m.visible = rotten > .05 && i < 10 * Math.min(1, rotten); const p = place[i % 3], t = T(f) * (2 + R(i) * 2) + i;
    m.position.set(p[0] + Math.cos(t * 2.3) * .22, p[1] + .25 + Math.sin(t * 3.1) * .08, p[2] + Math.sin(t * 1.9) * .22); });
}
function base(o = {}) {
  K.visible = true; lamp.intensity = o.dark ? 0 : 1.6; winK.emissiveIntensity = o.dark ? .05 : .7;
  doorF.rotation.y = -(o.openF || 0) * 1.9; doorZ.rotation.y = -(o.openZ || 0) * 1.9;
  inner.emissiveIntensity = o.dark ? 0 : .9; fLight.intensity = o.dark ? 0 : ((o.openF || 0) + (o.openZ || 0)) * 2.4;
  flames.forEach((m, i) => { m.visible = !!o.fire; m.scale.y = 1 + Math.sin((o.f || 0) * .9 + i) * .35; });
  FOOD.forEach(x => x.m.visible = false); frost.forEach(x => x.visible = false); flies.forEach(x => x.visible = false); dry.forEach(x => x.visible = false);
  if (o.dark) light('dark');
}
const cam = (c, x, z, h, ty = 1.1) => c.cam(KX + x, KZ + z, h, ty);
const at = (x, z) => ({ x: KX + x, z: KZ + z });
const look = (x, z, tx, tz) => face(KX + x, KZ + z, KX + tx, KZ + tz);

run([
  // 0 — cozinha: comida na mesa
  (lf, f, len, c) => { base({ f }); food(0, TABLE, 0, f); cam(c, -.2, -.6, lerp(7.2, 6.2, easeOut(lf / len)));
    pose(S, Object.assign(at(-.4, .6), { ry: look(-.4, .6, .6, -.4), ph: T(f) * 2, amp: .04 })); S.bat.visible = false; },
  null,
  // 2 — fome e doença: olha a comida
  (lf, f, len, c) => { base({ f }); food(.3, TABLE, 0, f); cam(c, .4, -.4, 4.8);
    pose(S, Object.assign(at(-.2, .3), { ry: look(-.2, .3, .6, -.4), ph: 0, amp: 0, slump: .25 })); S.bat.visible = false; },
  // 3 — fresca -> velha -> podre (close na mesa)
  (lf, f, len, c) => { base({ f }); const k4 = c.C(4) - c.C(3), rot = c.F[4] + 58 - c.C(3);
    const st = lf < k4 ? 0 : lf < rot ? ss(k4, k4 + 20, lf) : 1 + ss(rot, rot + 16, lf);
    food(st, TABLE, 0, f); cam(c, .6, -.5, lerp(3.4, 2.8, lf / len), .9); S.g.visible = false; },
  // 4 — geladeira ligada: abre, guarda a comida, dura 2x
  (lf, f, len, c) => { const o = ss(4, 18, lf); base({ f, openF: o }); food(0, SHELF, 0, f); cam(c, -2.45, -2.25, 3.4, .9);
    pose(S, Object.assign(at(-1.0, -1.55), { ry: look(-1.0, -1.55, -2.6, -2.5), ph: 0, amp: 0, hold: .7 })); S.bat.visible = false; },
  // 5 — freezer: abre em cima, frio sai, comida congela
  (lf, f, len, c) => { const o = ss(4, 18, lf), k7 = c.C(7) - c.C(6); base({ f, openZ: o }); const fz = ss(k7 - 20, k7 + 6, lf);
    food(0, FREEZ, fz, f); cam(c, -2.5, -2.4, 2.6, 1.6);
    for (let n = 0; n < 4; n++) puff(KX + FR.x + (R(n) - .5) * .5, 1.7, KZ + FR.z + .6, lf - 14 - n * 10, { n: 3, seed: n * 7, life: 34, size: .14, rise: -.3, color: '#dff4ff' });
    S.g.visible = false; },
  // 6 — luz caiu: geladeira apagada, comida estragando; come os perecíveis
  (lf, f, len, c) => { const k9 = c.C(9) - c.C(8); base({ f, dark: true, openF: lf < k9 ? ss(10, 24, lf) : 1 });
    const st = lf < k9 ? lerp(0, .9, ss(0, k9, lf)) : .9; food(st, SHELF, 0, f);
    cam(c, -2.4, -2.2, lf < k9 ? 3.6 : 4.0, 1.0); S.bat.visible = false;
    flashAt(KX - 1.6, 1.6, KZ - .4, '#9ab0ff', 1.2, 6);
    if (lf >= k9) { const l = lf - k9, bite = Math.sin(clamp((l - 8) / 30) * Math.PI * 3);
      FOOD[0].m.position.set(KX + 999, 0, 0); FOOD[0].m.visible = false;
      pose(S, Object.assign(at(-1.25, -1.6), { ry: look(-1.25, -1.6, 0, 2), ph: 0, amp: 0, hold: .7 + Math.max(0, bite) * .3 }));
    } else pose(S, Object.assign(at(-1.0, -1.55), { ry: look(-1.0, -1.55, -2.6, -2.5), ph: 0, amp: 0 })); },
  // 7 — come podre: enjoa. Depois tenta cozinhar: continua podre
  (lf, f, len, c) => { const k11 = c.C(11) - c.C(10), cook = lf >= k11; base({ f, fire: cook }); S.bat.visible = false;
    food(2, TABLE, 0, f);
    if (!cook) { cam(c, .3, -.1, 4.4, 1.1); const bite = Math.sin(clamp((lf - 10) / 30) * Math.PI * 3);
      pose(S, Object.assign(at(-.2, .3), { ry: look(-.2, .3, .6, -.4), ph: 0, amp: 0, hold: .7 + Math.max(0, bite) * .3, slump: ss(36, 60, lf) * .6 }));
    } else { const l = lf - k11; cam(c, 1.9, -2.2, 3.6, 1.1);
      FOOD[0].m.position.set(2.2, 1.02, -2.85); // bife podre na frigideira
      flies.forEach((m, i) => { m.position.set(2.2 + Math.cos(T(f) * 3 + i) * .2, 1.25 + Math.sin(T(f) * 4 + i) * .08, -2.85 + Math.sin(T(f) * 2.4 + i) * .2); m.visible = true; });
      puff(KX + 2.2, 1.1, KZ - 2.85, l - 4, { n: 6, seed: 3, life: 40, size: .16, rise: .8, color: '#8a9a6a' });
      flashAt(KX + 2.2, 1.2, KZ - 2.6, '#ff8a30', 2.2, 4);
      pose(S, Object.assign(at(2.0, -1.9), { ry: Math.PI, ph: 0, amp: 0, slump: .4 })); } },
  // 8 — não estragam: latas fechadas + arroz/macarrão na bancada
  (lf, f, len, c) => { base({ f }); cam(c, -.2, -2.6, 2.8, 1.0); S.g.visible = false;
    cans.forEach((cn, i) => { const s0 = 4 + i * 3; if (lf < s0) return; cn.visible = true; const a = clamp((lf - s0) / 6), col = i % 5, row = Math.floor(i / 5);
      cn.position.set(KX - 1.0 + col * .19, .96 + row * .16 + (1 - a) * .5, KZ - 3.0 + (row ? -.05 : .12)); });
    dry.forEach((d, i) => { const s0 = 30 + i * 5; d.visible = lf >= s0; d.position.set(.15 + i * .28, .96, -3.05); d.scale.setScalar(lf >= s0 ? lerp(1.4, 1, easeOut(clamp((lf - s0) / 6))) : 1); }); },
  // 9 — CTA: sai pela cozinha
  (lf, f, len, c) => { base({ f }); food(0, TABLE, 0, f); cam(c, lerp(.2, .8, lf / len), -.4, lerp(7, 6, easeOut(lf / len)));
    const p = clamp(lf / 80); pose(S, Object.assign(at(lerp(-1.4, 2.4, p), lerp(.8, 1.6, p)), { ry: Math.PI / 2 - .3, ph: T(lf) * 6, amp: p < 1 ? .6 : 0 })); }
]);
