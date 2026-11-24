// ENGINE — mundo isométrico low-poly estilo Project Zomboid (reutilizável em todos os episódios).
// Tudo é função pura do frame: o episódio chama frame() e depois posiciona câmera/personagens.
import * as THREE from './runtime/hero3d/vendor/three.module.js';
export { THREE };
export const W = 1080, H = 1920;
const cv = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true, alpha: !!window.CAPA });   // CAPA: fundo transparente (capa feita em HTML por cima/por baixo)
renderer.setSize(W, H, false); renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
// modelos originais do jogo (EP.pz = true no cfg do episódio): personagens, veículos e ícones de itens
const PZ = (window.EP && window.EP.pz) ? await import('./pz.js') : null;
if (PZ) { await PZ.ready; await PZ.loadIcons(window.EP.itens || []); }
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0d12');
scene.fog = new THREE.Fog('#0b0d12', 96, 150);

// ---------- câmera isométrica (dimétrica 2:1, como no jogo) ----------
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
const DIR = new THREE.Vector3(1, 0.82, 1).normalize();
// fx: { shake: amplitude (unid. do mundo), f: frame atual, punch: 0..1 (entrada de câmera: começa mais perto) }
let NOW = 0; const TGT = new THREE.Vector3();
function setCam(tx, tz, h, ty = 1.5, fx = {}) {
  h *= 0.86 * (1 - (fx.punch || 0) * 0.12);
  const w = h * W / H;
  cam.left = -w / 2; cam.right = w / 2; cam.top = h / 2; cam.bottom = -h / 2; cam.updateProjectionMatrix();
  const sk = fx.shake || 0, f = fx.f || 0;
  const hand = fx.still ? 0 : 1;
  const tgt = new THREE.Vector3(tx + Math.sin(f * 2.7) * sk + Math.sin(f * .037) * .06 * hand, ty + Math.sin(f * 3.9 + 1) * sk * .6 + Math.sin(f * .051) * .03 * hand, tz + Math.cos(f * 2.3) * sk + Math.cos(f * .029) * .06 * hand);
  TGT.copy(tgt);
  cam.position.copy(tgt).addScaledVector(DIR, 80); cam.lookAt(tgt);
  // sombra acompanha o enquadramento
  sun.position.set(tgt.x - 6, 12, tgt.z + 9); sun.target.position.copy(tgt); sun.target.updateMatrixWorld();
}

// ---------- helpers ----------
const MC = {};
const mat = (c, o = {}) => { const k = c + JSON.stringify(o); return MC[k] || (MC[k] = new THREE.MeshLambertMaterial(Object.assign({ color: c }, o))); };
const box = (w, h, d, c, o) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, o));
const R = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);

function canvasTex(size, draw, rep) {
  const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d'); draw(g, size);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  if (rep) t.repeat.set(rep[0], rep[1]); t.anisotropy = 4; return t;
}

// ---------- luzes ----------
const hemi = new THREE.HemisphereLight('#c4d2ee', '#4a4030', 2.3); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffe0b8', 2.4); sun.position.set(-6, 12, 9); scene.add(sun); scene.add(sun.target);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 60 });
sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
const lamps = [];
[[-6, 3.4], [8, 3.4], [22, 3.4]].forEach(([x, z]) => { const p = new THREE.PointLight('#ffc070', 40, 12, 1.4); p.position.set(x, 4.2, z); scene.add(p); lamps.push(p); });

// ---------- chão: grama em tiles ----------
const grassTex = canvasTex(256, (g, s) => {
  g.fillStyle = '#5c7d3c'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 2200; i++) { const r = R(i); g.fillStyle = r > .5 ? 'rgba(90,120,60,.5)' : 'rgba(40,58,28,.5)'; g.fillRect(R(i + 1) * s, R(i + 2) * s, 2 + r * 3, 2 + r * 3); }
  g.strokeStyle = 'rgba(0,0,0,.10)'; g.lineWidth = 2; g.strokeRect(0, 0, s, s);
}, [200, 200]);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: grassTex }));
ground.rotation.x = -Math.PI / 2; scene.add(ground);

const roadTex = canvasTex(256, (g, s) => {
  g.fillStyle = '#3a3a3c'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 1800; i++) { g.fillStyle = R(i) > .5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.12)'; g.fillRect(R(i + 3) * s, R(i + 4) * s, 2, 2); }
  g.fillStyle = '#d8b23a'; g.fillRect(0, s / 2 - 5, s * .55, 10);
}, [50, 1]);
const road = new THREE.Mesh(new THREE.PlaneGeometry(200, 4.4), new THREE.MeshLambertMaterial({ map: roadTex }));
road.rotation.x = -Math.PI / 2; road.position.y = 0.01; scene.add(road);
[-2.75, 2.75].forEach(z => { const sw = box(200, 0.08, 1.1, '#8d8b84'); sw.position.set(0, 0.04, z); scene.add(sw); });

// ---------- casas (frente virada para +z, de frente para a câmera) ----------
const houses = [];
function house(x, color, roofC, idx) {
  const g = new THREE.Group(); g.position.set(x, 0, -11.5);
  const body = box(7, 3, 7, color); body.position.y = 1.5; g.add(body);
  // ripas (siding)
  for (let i = 0; i < 9; i++) { const s = box(7.02, 0.04, 7.02, '#000', { transparent: true, opacity: .12 }); s.position.y = 0.3 + i * 0.32; g.add(s); }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(5.6, 2.2, 4, 1), mat(roofC, { flatShading: true }));
  roof.rotation.y = Math.PI / 4; roof.position.y = 4.1; g.add(roof);
  const door = box(1.0, 2.0, 0.08, '#4a2e1c'); door.position.set(-1.6, 1.0, 3.52); g.add(door);
  const step = box(1.6, 0.2, 0.8, '#7a776f'); step.position.set(-1.6, 0.1, 3.9); g.add(step);
  const wins = [];
  [[1.4, 1.5], [-3.52, 1.5]].forEach(([wx, wy], k) => {
    const fr = box(1.5, 1.3, 0.1, '#e8e2d2'); fr.position.set(k ? 0 : wx, wy, k ? 0 : 3.52);
    if (k) { fr.rotation.y = Math.PI / 2; fr.position.set(3.52, wy, 1.2); }
    g.add(fr);
    const pane = box(1.25, 1.05, 0.06, '#ffcf73', { emissive: '#ffb347', emissiveIntensity: .9 });
    pane.position.copy(fr.position); pane.rotation.copy(fr.rotation);
    if (k) pane.position.x += 0.04; else pane.position.z += 0.04; g.add(pane); wins.push(pane);
  });
  scene.add(g); houses.push({ g, wins, idx }); return g;
}
house(0, '#b9a98c', '#5a2c2a', 0); house(11, '#8fa3a8', '#3d3f46', 1); house(-11, '#a8907a', '#46302a', 2); house(22, '#c2b79a', '#4b2b2b', 3); house(-22, '#9aa58c', '#3a3a3a', 4);

// janela quebrada na casa 0 (frente)
const broken = new THREE.Group(); broken.position.set(1.4, 1.5, -7.9);
const hole = box(1.25, 1.05, 0.05, '#120c0b'); broken.add(hole);
const shards = [];
for (let i = 0; i < 9; i++) {
  const s = new THREE.Shape(); const a = R(i * 3) * Math.PI * 2, L = .35 + R(i * 5) * .3;
  s.moveTo(0, 0); s.lineTo(Math.cos(a) * L, Math.sin(a) * L); s.lineTo(Math.cos(a + .5) * L * .6, Math.sin(a + .5) * L * .6); s.lineTo(0, 0);
  const m = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshLambertMaterial({ color: '#a9d2e6', transparent: true, opacity: .85, side: THREE.DoubleSide, emissive: '#5a8aa0', emissiveIntensity: .4 }));
  const ex = [-.55, .55, -.55, .55, 0, -.55, .55, -.2, .25][i], ey = [.45, .45, -.45, -.45, .5, 0, 0, -.5, -.5][i];
  m.position.set(ex, ey, 0.05); m.rotation.z = Math.atan2(-ey, -ex) - a - .25; broken.add(m); shards.push({ m, ex, ey });
}
scene.add(broken);
houses[0].wins[0].visible = false;

// cercas, árvores, carro, postes, caixa de correio
function picket(x0, x1, z) { for (let x = x0; x <= x1; x += 0.35) { const p = box(0.1, 0.7, 0.06, '#e6e0d0'); p.position.set(x, 0.35, z); scene.add(p); } const r = box(x1 - x0, 0.08, 0.05, '#e6e0d0'); r.position.set((x0 + x1) / 2, 0.5, z); scene.add(r); }
picket(-14.5, -7.6, -4.2);
function tree(x, z, s = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s);
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(.14, .2, 1.6, 6), mat('#5a3d26')); tr.position.y = .8; g.add(tr);
  [[0, 2.2, 0, 1.2], [.5, 1.8, .3, .8], [-.45, 1.9, -.2, .85]].forEach(([a, b, c, r], i) => { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), mat(i ? '#2f4a24' : '#3a5a2a', { flatShading: true })); f.position.set(a, b, c); g.add(f); });
  scene.add(g); }
[[-5.5, -6], [5.8, -6.2], [16.5, -6], [-16.8, -5.8], [27, -6], [-27, -6], [-3, 6.5], [12, 7], [-14, 6.8], [24, 6.5], [3, 9], [-20, 9]].forEach(([x, z], i) => tree(x, z, .9 + R(i) * .4));
const cars = [];
function car(x, z, c, ry = 0, kind = 'normal') {
  if (PZ) { const v = PZ.vehicle(kind, c); v.position.set(x, 0, z); v.rotation.y = ry; cars.push(v); scene.add(v); return v; }
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry;
  const lm = new THREE.MeshLambertMaterial({ color: '#fff6c8', emissive: '#ffd84a', emissiveIntensity: 0 });
  [-.5, .5].forEach(zz => { const hl = new THREE.Mesh(new THREE.BoxGeometry(.06, .18, .3), lm); hl.position.set(1.82, .65, zz); g.add(hl); const tl = new THREE.Mesh(new THREE.BoxGeometry(.06, .18, .3), lm); tl.position.set(-1.82, .65, zz); g.add(tl); });
  g.userData.lm = lm; cars.push(g);
  const b = box(3.6, .7, 1.6, c); b.position.y = .6; g.add(b); const t = box(2, .55, 1.45, c); t.position.set(-.2, 1.2, 0); g.add(t);
  const gl = box(2.02, .4, 1.47, '#1d2733'); gl.position.set(-.2, 1.22, 0); g.add(gl);
  [[-1.1, .8], [1.1, .8], [-1.1, -.8], [1.1, -.8]].forEach(([a, b2]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .25, 10), mat('#141414')); w.rotation.x = Math.PI / 2; w.position.set(a, .32, b2); g.add(w); });
  scene.add(g); return g; }
car(-8.5, 1.2, '#6b7f95'); car(15, -1.2, '#8a3b32', Math.PI, 'pickup'); car(30, 1.2, '#c9c7c0');
[[-6, 3.4], [8, 3.4], [22, 3.4]].forEach(([x, z]) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, 4.2, 6), mat('#555')); p.position.set(x, 2.1, z); scene.add(p);
  const l = box(.5, .15, .3, '#ffe2a0', { emissive: '#ffcc66', emissiveIntensity: 1 }); l.position.set(x, 4.2, z - .2); scene.add(l); });
const mb = box(.3, .3, .5, '#2a4d7a'); mb.position.set(2.8, 1.0, -3.9); scene.add(mb); const mbp = box(.08, .9, .08, '#5a3d26'); mbp.position.set(2.8, .45, -3.9); scene.add(mbp);

// ---------- decalques de sangue ----------
const blood = [];
for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 10), new THREE.MeshBasicMaterial({ color: '#6e0c12', transparent: true, opacity: .92 })); m.rotation.x = -Math.PI / 2; m.visible = false; scene.add(m); blood.push(m); }
let bi = 0; const splat = (x, z, r) => { const m = blood[bi++]; if (!m) return; m.visible = true; m.position.set(x, 0.02 + bi * 0.0005, z); m.scale.setScalar(r); };

// ---------- personagens ----------
function human(o) {
  const g = new THREE.Group(), hips = new THREE.Group(); hips.position.y = .95; g.add(hips); g.rotation.order = 'YXZ';
  const spine = new THREE.Group(); hips.add(spine);
  const torso = box(.5, .62, .27, o.shirt); torso.position.y = .32; spine.add(torso);
  if (o.jacket) { const j = box(.54, .5, .3, o.jacket); j.position.y = .36; spine.add(j); const z1 = box(.06, .5, .02, o.shirt); z1.position.set(0, .36, .16); spine.add(z1); }
  if (o.blood) for (let i = 0; i < 4; i++) { const b = box(.12 + R(i + o.seed) * .1, .1 + R(i + 9 + o.seed) * .12, .02, '#7a0f14'); b.position.set((R(i * 7 + o.seed) - .5) * .35, .15 + R(i * 3 + o.seed) * .4, .145); spine.add(b); }
  const belt = box(.52, .06, .29, '#2a1d12'); belt.position.y = .02; spine.add(belt);
  const neck = new THREE.Group(); neck.position.y = .66; spine.add(neck);
  const head = box(.3, .32, .3, o.skin); head.position.y = .17; neck.add(head);
  const hair = box(.32, .12, .32, o.hair); hair.position.y = .3; neck.add(hair);
  const hb = box(.32, .22, .08, o.hair); hb.position.set(0, .22, -.13); neck.add(hb);
  [-.07, .07].forEach(x => { const e = box(.05, .04, .02, o.zombie ? '#d9d2a0' : '#111'); e.position.set(x, .19, .155); neck.add(e); });
  let mouth = null;
  if (o.zombie) { mouth = box(.14, .05, .02, '#3a0a0a'); mouth.position.set(0, .07, .155); neck.add(mouth);
    for (let i = 0; i < 3; i++) { const t = box(.08 + R(o.seed + i) * .08, .06, .08, o.hair); t.position.set((R(o.seed * 3 + i) - .5) * .26, .37, (R(o.seed + i * 5) - .5) * .26); neck.add(t); }
    const wound = box(.1, .08, .02, '#6e0c12'); wound.position.set(.08, .25, .156); neck.add(wound); }
  else { const fr = box(.32, .07, .06, o.hair); fr.position.set(0, .28, .14); neck.add(fr); }
  const arm = s => { const a = new THREE.Group(); a.position.set(s * .32, .58, 0); spine.add(a);
    const up = box(.14, .34, .15, o.jacket || o.shirt); up.position.y = -.17; a.add(up);
    const el = new THREE.Group(); el.position.y = -.34; a.add(el);
    const lo = box(.13, .3, .13, o.sleeveLong ? (o.jacket || o.shirt) : o.skin); lo.position.y = -.15; el.add(lo);
    const hand = box(.12, .12, .12, o.skin); hand.position.y = -.34; el.add(hand);
    return { a, el, lo }; };
  const aL = arm(-1), aR = arm(1);
  const leg = s => { const l = new THREE.Group(); l.position.set(s * .13, 0, 0); hips.add(l);
    const th = box(.2, .46, .22, o.pants); th.position.y = -.23; l.add(th);
    const kn = new THREE.Group(); kn.position.y = -.46; l.add(kn);
    const sh = box(.18, .42, .2, o.pants); sh.position.y = -.21; kn.add(sh);
    const shoe = box(.2, .1, .3, o.shoes); shoe.position.set(0, -.44, .04); kn.add(shoe);
    return { l, kn }; };
  const lL = leg(-1), lR = leg(1);
  let pack = null, bat = null, band = null;
  if (o.pack) { pack = new THREE.Group(); pack.position.set(0, .32, -.14); spine.add(pack);
    const pb = box(.42, .5, .22, o.pack); pb.position.z = -.11; pack.add(pb); const pp = box(.34, .2, .06, '#3b2a1a'); pp.position.set(0, -.08, -.24); pack.add(pp); }
  const grip = new THREE.Group(); grip.position.set(0, -.34, 0); aR.el.add(grip);   // punho: gira a arma em relação ao antebraço
  if (o.bat) { bat = new THREE.Group(); grip.add(bat);
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(.058, .03, .78, 8), mat('#c9a46a')); b1.rotation.x = Math.PI / 2; b1.position.z = .44; b1.castShadow = true; bat.add(b1);
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(.036, .036, .14, 8), mat('#3a2a1c')); b2.rotation.x = Math.PI / 2; b2.position.z = .0; bat.add(b2);
    const b3 = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 6), mat('#c9a46a')); b3.position.z = .83; bat.add(b3); }
  band = new THREE.Mesh(new THREE.BoxGeometry(.19, .2, .19), new THREE.MeshLambertMaterial({ color: '#f7f5ee' })); band.position.y = -.16; band.visible = false; aL.el.add(band);
  let hammer = null, gun = null, flash = null;
  if (o.bat) {
    hammer = new THREE.Group(); hammer.position.set(0, 0, .02); grip.add(hammer);
    const hh = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .55, 6), mat('#8a5a32')); hh.rotation.x = Math.PI / 2; hh.position.z = .22; hammer.add(hh);
    const hd = box(.08, .22, .08, '#4a4e55'); hd.position.z = .48; hammer.add(hd);
    gun = new THREE.Group(); gun.position.set(0, -.36, .02); aR.el.add(gun);
    const gb = box(.07, .1, .3, '#1c1c1e'); gb.position.z = .14; gun.add(gb); const gg = box(.06, .14, .07, '#2a2a2a'); gg.position.set(0, -.08, .02); gun.add(gg);
    flash = new THREE.Mesh(new THREE.IcosahedronGeometry(.16, 0), new THREE.MeshBasicMaterial({ color: '#ffe27a' })); flash.position.z = .42; gun.add(flash);
  }
  const sh = new THREE.Mesh(new THREE.CircleGeometry(.42, 16), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .35 })); sh.rotation.x = -Math.PI / 2; sh.position.y = .015; g.add(sh);
  scene.add(g);
  return { g, hips, spine, neck, aL, aR, lL, lR, pack, bat, band, hammer, gun, flash, grip, mouth, shadow: sh, o };
}
// ---------- animação: curvas de pose (v3) ----------
// Cada ação é uma sequência de poses-chave com antecipação, impacto, parada no golpe e recuperação.
const sm = t => t * t * (3 - 2 * t);
function kf(t, keys) { // keys: [[t, pose, ease?]] ; ease do trecho que CHEGA na pose: 'in' acelera (golpe), 'out' desacelera
  const n = keys.length; if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  let i = 0; while (t > keys[i + 1][0]) i++;
  const a = keys[i], b = keys[i + 1]; let u = (t - a[0]) / (b[0] - a[0]); const e = b[2];
  u = e === 'in' ? u * u * u : e === 'out' ? 1 - (1 - u) * (1 - u) : sm(u);
  const o = {}; for (const k in b[1]) o[k] = lerp(a[1][k], b[1][k], u); return o; }
// pose de combate (taco pronto, pés afastados). Braço R = lado do taco (+x); perna L na frente.
const GUARD = { w: 1, sx: .1, sy: .28, sz: 0, nx: 0, ny: -.2, hy: -.06, fwd: 0, gr: .25,
  aRx: -.8, aRy: 0, aRz: -.35, eR: -1.55, aLx: -1.0, aLy: 0, aLz: .5, eL: -1.5,
  lLx: -.24, lLz: -.06, kL: .32, lRx: .24, lRz: .06, kR: .38 };
const G = (o, w = 1) => Object.assign({}, GUARD, o, { w });
const ACT = {
  // golpe de taco a duas mãos: arma atrás da cabeça -> desce na diagonal -> para no impacto -> atravessa -> volta
  swing: [[0, G({}, 0)], [.12, G({})],
    [.33, G({ aRx: -2.35, aRz: .25, eR: -1.2, gr: .95, aLx: -2.15, aLz: .8, eL: -1.35, sy: .9, sx: -.2, hy: -.09, lLx: -.12, kL: .28, lRx: .32, kR: .55, fwd: -.06, nx: .12, ny: -.6 }), 'out'],
    [.415, G({ aRx: -1.48, aRz: -.3, eR: -.15, gr: 1.5, aLx: -1.5, aLz: .55, eL: -.3, sy: -.38, sx: .24, hy: -.11, lLx: -.6, kL: .5, lRx: .42, kR: .15, fwd: .24, nx: -.18, ny: .25 }), 'in'],
    [.49, G({ aRx: -1.38, aRz: -.36, eR: -.18, gr: 1.58, aLx: -1.4, aLz: .5, eL: -.33, sy: -.46, sx: .27, hy: -.12, lLx: -.6, kL: .52, lRx: .43, kR: .15, fwd: .25, nx: -.18, ny: .3 })],
    [.64, G({ aRx: -.55, aRz: -.95, eR: -.6, gr: 1.95, aLx: -.65, aLz: .15, eL: -.75, sy: -1.0, sx: .5, hy: -.13, lLx: -.52, kL: .52, lRx: .46, kR: .3, fwd: .27, nx: -.1, ny: .55 }), 'out'],
    [.88, G({})], [1, G({}, 0)]],
  // empurrão: recolhe os braços -> estoca com o corpo -> segura -> volta
  shove: [[0, G({}, 0)], [.12, G({})],
    [.29, G({ aRx: -.5, aRz: -.2, eR: -2.1, gr: .7, aLx: -.5, aLz: .2, eL: -2.1, sx: -.14, sy: 0, hy: -.11, lLx: -.2, kL: .42, lRx: .2, kR: .42, fwd: -.07, ny: 0 }), 'out'],
    [.39, G({ aRx: -1.5, aRz: -.15, eR: -.12, gr: 1.25, aLx: -1.5, aLz: .15, eL: -.12, sx: .44, sy: 0, hy: -.13, lLx: -.66, kL: .52, lRx: .46, kR: .1, fwd: .32, nx: -.22, ny: 0 }), 'in'],
    [.56, G({ aRx: -1.45, aRz: -.15, eR: -.18, gr: 1.25, aLx: -1.45, aLz: .15, eL: -.18, sx: .4, sy: 0, hy: -.13, lLx: -.64, kL: .52, lRx: .45, kR: .12, fwd: .3, nx: -.2, ny: 0 })],
    [.86, G({})], [1, G({}, 0)]],
  // pisão: joelho sobe alto, braços abrem para equilibrar -> desce com o peso do corpo -> quica -> volta
  stomp: [[0, G({}, 0)], [.14, G({ sy: 0, ny: 0, lLx: 0, kL: .1, lRx: 0, kR: .1, hy: -.02, nx: .3 })],
    [.38, G({ lRx: -1.8, kR: 2.05, lLx: .06, kL: .12, hy: .03, sx: -.16, sy: 0, ny: 0, nx: .45, aRx: -.55, aRz: .6, eR: -.55, aLx: -.55, aLz: -.6, eL: -.55, gr: .5, fwd: 0 }), 'out'],
    [.5, G({ lRx: -.52, kR: .12, lLx: .22, kL: .6, hy: -.2, sx: .3, sy: 0, ny: 0, nx: .35, aRx: .25, aRz: .32, eR: -.35, aLx: .25, aLz: -.32, eL: -.35, gr: .5, fwd: .1 }), 'in'],
    [.58, G({ lRx: -.5, kR: .14, lLx: .22, kL: .62, hy: -.21, sx: .32, sy: 0, ny: 0, nx: .35, aRx: .3, aRz: .3, eR: -.35, aLx: .3, aLz: -.3, eL: -.35, gr: .5, fwd: .1 })],
    [.74, G({ lRx: -.3, kR: .3, lLx: .1, kL: .35, hy: -.1, sx: .18, sy: 0, ny: 0, nx: .3, aRx: -.2, aRz: .2, eR: -.5, aLx: -.2, aLz: -.2, eL: -.5, gr: .4, fwd: .05 }), 'out'],
    [1, G({ sy: 0, ny: 0, lLx: 0, kL: .1, lRx: 0, kR: .1, hy: -.02, nx: .3 }, 0)]]
};
// duração (frames) e frame do impacto de cada ação: use strike/shoveAt/stompAt para o impacto cair no frame certo
const ACTD = { swing: [24, 10], shove: [18, 7], stomp: [22, 11] };
const actAt = (name, lf, hit) => { const [d, pre] = ACTD[name], t = (lf - hit + pre) / d; return t >= 0 && t <= 1 ? t : -1; };
const strike = (lf, hit) => actAt('swing', lf, hit), shoveAt = (lf, hit) => actAt('shove', lf, hit), stompAt = (lf, hit) => actAt('stomp', lf, hit);
function rig(h, r, ry) { const w = r.w, a = (o, k, v) => { o[k] = lerp(o[k], v, w); };
  h.spine.rotation.x += r.sx * w; h.spine.rotation.y += r.sy * w; h.spine.rotation.z += r.sz * w;
  h.neck.rotation.x += r.nx * w; h.neck.rotation.y = lerp(h.neck.rotation.y, r.ny, w); h.hips.position.y += r.hy * w;
  a(h.aR.a.rotation, 'x', r.aRx); a(h.aR.a.rotation, 'y', r.aRy); a(h.aR.a.rotation, 'z', r.aRz); a(h.aR.el.rotation, 'x', r.eR);
  a(h.aL.a.rotation, 'x', r.aLx); a(h.aL.a.rotation, 'y', r.aLy); a(h.aL.a.rotation, 'z', r.aLz); a(h.aL.el.rotation, 'x', r.eL);
  a(h.lL.l.rotation, 'x', r.lLx); a(h.lL.l.rotation, 'z', r.lLz); a(h.lL.kn.rotation, 'x', r.kL);
  a(h.lR.l.rotation, 'x', r.lRx); a(h.lR.l.rotation, 'z', r.lRz); a(h.lR.kn.rotation, 'x', r.kR);
  h.grip.rotation.x = lerp(h.grip.rotation.x, r.gr, w);
  h.g.position.x += Math.sin(ry) * r.fwd * w; h.g.position.z += Math.cos(ry) * r.fwd * w; }

// zumbi morrendo (a = frames desde o golpe): cabeça estala, joelhos cedem, cai acelerando, quica, membros se espalham
function zDead(h, a, style, ry) { const sd = h.o.seed || 0;
  const snap = Math.exp(-a / 3.2), t = clamp((a - 2) / 11), fk = t * t, land = a - 13, on = land > 0;
  const bounce = on ? Math.exp(-land / 2.6) * Math.abs(Math.sin(land * .95)) : 0, rest = on ? sm(clamp(land / 7)) : 0, front = style === 2, dir = front ? 1 : -1;
  const air = Math.sin(clamp(a / 13) * Math.PI);          // 0 -> 1 -> 0 durante a queda
  h.g.rotation.x = dir * (Math.PI / 2) * fk; h.g.position.y = fk * .15 + bounce * .11;
  if (style === 1) { const s1 = R(sd + 2) > .5 ? 1 : -1; h.g.rotation.z = fk * s1 * .5; h.g.rotation.y += sm(clamp(a / 13)) * s1 * .9; }
  const back = (front ? -.15 : .6) * easeOut(clamp(a / 13)); h.g.position.x -= Math.sin(ry) * back; h.g.position.z -= Math.cos(ry) * back;
  h.hips.position.y = .95 - air * (front ? .3 : .12);
  h.spine.rotation.set(front ? (-.3 * snap + .55 * air) * (1 - rest) : (-.5 * snap + .3 * air) * (1 - rest) - .06 * rest, (R(sd + 5) - .5) * .5 * rest, (R(sd + 6) - .5) * .25 * rest);
  h.neck.rotation.set(front ? -.6 * snap + .3 * air * (1 - rest) : -.9 * snap - .2 * air * (1 - rest) - .15 * rest, (R(sd + 7) - .5) * 1.5 * rest, (R(sd + 8) - .5) * .5 * rest);
  const kb = air * (front ? 1.5 : .95), r1 = R(sd + 3), r2 = R(sd + 4);
  h.lL.l.rotation.set(-air * (front ? .9 : .35) - rest * r1 * .35, 0, -.08 - rest * (.1 + r1 * .22)); h.lL.kn.rotation.x = kb + rest * r1 * .7;
  h.lR.l.rotation.set(-air * (front ? .7 : .15) - rest * r2 * .15, 0, .08 + rest * (.1 + r2 * .22)); h.lR.kn.rotation.x = kb * .8 + rest * r2 * .35;
  // braços: sobem com o tranco, atrasam na queda e batem no chão abertos
  const up = front ? -2.7 : lerp(-2.5, -.25 - r1 * 2.4, rest), up2 = front ? -2.9 : lerp(-2.2, -.2 - r2 * 1.2, rest), flail = 1 - Math.exp(-a / 2);
  h.aL.a.rotation.set(lerp(-1.45, up, flail) + bounce * .3, 0, -(.25 + air * .5 + rest * (.5 + r2 * .6)));
  h.aR.a.rotation.set(lerp(-1.35, up2, flail) + bounce * .25, 0, .25 + air * .45 + rest * (.45 + r1 * .7));
  h.aL.el.rotation.x = -.2 - air * .7 - rest * r1 * .8; h.aR.el.rotation.x = -.2 - air * .5 - rest * r2 * .6;
  if (h.shadow) h.shadow.visible = false; if (h.mouth) h.mouth.scale.y = 1 + snap * 2; }

// pose: tudo recalculado a cada frame
function pose(h, p) {
  const ph = p.ph || 0, amp = p.amp ?? 0, z = h.o.zombie, ry = p.ry || 0;
  h.g.visible = p.vis !== false;
  h.g.position.set(p.x || 0, 0, p.z || 0); h.g.rotation.set(0, ry, 0);
  if (h.shadow) h.shadow.visible = true; if (h.mouth) h.mouth.scale.y = 1; h.grip.rotation.x = 0;
  h.lL.l.rotation.set(0, 0, 0); h.lR.l.rotation.set(0, 0, 0); h.hips.rotation.set(0, 0, 0);
  const s = Math.sin(ph), sd = h.o.seed || 0, idle = 1 - clamp(amp * 2), br = Math.sin(NOW * .13 + sd);
  const limp = z ? .65 : 1, run = clamp((amp - .7) / .3);
  h.lL.l.rotation.x = s * .7 * amp; h.lR.l.rotation.x = -s * .7 * amp * limp;
  h.lL.kn.rotation.x = Math.max(0, -Math.cos(ph)) * .9 * amp; h.lR.kn.rotation.x = Math.max(0, Math.cos(ph)) * .9 * amp;
  h.hips.position.y = .95 + Math.abs(Math.cos(ph)) * .06 * amp - (p.crouch || 0) * .25;
  h.hips.rotation.z = Math.sin(ph) * .05 * amp;                                   // quadril balança com o passo
  h.spine.rotation.set((p.lean || 0) + (z ? .28 : 0) + run * .12, Math.sin(ph) * .1 * amp, z ? Math.sin(ph * .5) * .06 : -Math.sin(ph) * .04 * amp);
  h.neck.rotation.set(z ? -.1 : 0, p.look ?? (Math.sin(NOW * .045 + sd * 3) * .22 * idle), z ? .35 + Math.sin(ph * .5) * .05 + Math.sin(NOW * .9 + sd) * .035 : 0);
  h.spine.rotation.x += br * .025 * idle; h.hips.position.y += br * .008 * idle;
  if (z) { h.spine.rotation.y += Math.sin(ph * .5 + sd) * .07; h.lR.kn.rotation.x += .15 * amp;
    // andar de zumbi: arrasta a perna, tronco pende para o lado do passo, cabeça solta; cada um com um jeito (seed)
    const v1 = R(sd + 21), v2 = R(sd + 22);
    h.spine.rotation.z += Math.sin(ph) * .09 * amp + (v1 - .5) * .22; h.hips.rotation.z += Math.sin(ph) * .06 * amp; h.neck.rotation.x += Math.sin(ph * 2 + sd) * .05 * amp;
    const sway = Math.sin(ph * .5) * .1, sw2 = Math.sin(NOW * .21 + sd * 2) * .08, lowL = v2 > .72 ? 1 : 0, lowR = v2 < .2 ? 1 : 0; // alguns andam com um braço caído
    h.aL.a.rotation.set(lerp(-1.45 + sway + sw2, -.35 + s * .2 * amp, lowL), 0, .12); h.aR.a.rotation.set(lerp(-1.35 - sway - sw2 * .7, -.3 - s * .2 * amp, lowR), 0, -.12);
    h.aL.el.rotation.x = -.25 - lowL * .2; h.aR.el.rotation.x = -.15 - lowR * .2;
    if (p.attack) { const k = Math.sin(p.attack * Math.PI), k2 = Math.sin(clamp(p.attack * 1.3 - .15) * Math.PI);   // agarra com os dois braços e avança a cabeça
      h.aL.a.rotation.set(-1.5 + k * .35, 0, .12 + k * .32); h.aR.a.rotation.set(-1.45 + k2 * .3, 0, -.12 - k2 * .3); h.aL.el.rotation.x = -.25 - k * .5; h.aR.el.rotation.x = -.2 - k2 * .45;
      h.spine.rotation.x += k * .32; h.neck.rotation.x -= k * .28; h.g.position.x += Math.sin(ry) * k * .12; h.g.position.z += Math.cos(ry) * k * .12; if (h.mouth) h.mouth.scale.y = 1 + k * 2.2; }
    if (p.bite) { const k = Math.sin(clamp(p.bite) * Math.PI); h.spine.rotation.x += k * .55; h.neck.rotation.x -= k * .4; h.aL.a.rotation.x = -1.6; h.aR.a.rotation.x = -1.6; h.aL.a.rotation.z = -.35; h.aR.a.rotation.z = .35; if (h.mouth) h.mouth.scale.y = 1 + k * 2.5; }
    // tranco ao levar golpe sem morrer (flinch = frames desde o golpe): mola amortecida
    if (p.flinch != null && p.flinch >= 0 && p.flinch < 26) { const a = p.flinch, k = Math.exp(-a / 4.5) * Math.cos(a * .55), st = 1 - Math.exp(-a / 5);
      h.spine.rotation.x -= k * .75; h.spine.rotation.y += k * .4; h.neck.rotation.x -= k * .6; h.neck.rotation.y += k * .5; h.aL.a.rotation.x -= k * .7; h.aR.a.rotation.x -= k * .5; h.aL.a.rotation.z -= Math.abs(k) * .5; h.aR.a.rotation.z += Math.abs(k) * .5;
      const bk = (p.flinchDist ?? .3) * st; h.g.position.x -= Math.sin(ry) * bk; h.g.position.z -= Math.cos(ry) * bk; h.lL.kn.rotation.x += Math.abs(k) * .5; h.hips.position.y -= Math.abs(k) * .06; if (h.mouth) h.mouth.scale.y = 1 + Math.abs(k) * 2; }
  } else {
    h.aL.a.rotation.set(-s * (.55 + run * .35) * amp + br * .03 * idle, 0, .06 + br * .02 * idle); h.aL.el.rotation.x = -.3 - (.5 + run * .6) * amp;
    h.aR.a.rotation.set(s * (.55 + run * .2) * amp - .25, 0, -.06); h.aR.el.rotation.x = -.6 - .4 * amp;
    if (p.guard) rig(h, G({}, clamp(p.guard)), ry);
    if (p.slump) { const k = p.slump, pant = Math.sin(NOW * .42) * k; h.spine.rotation.x += k * .75 + pant * .07; h.aL.a.rotation.x = lerp(h.aL.a.rotation.x, -.6, k); h.aR.a.rotation.x = lerp(h.aR.a.rotation.x, -.4, k); h.aL.el.rotation.x = lerp(h.aL.el.rotation.x, -.2, k); h.hips.position.y -= k * .12 - pant * .015; h.lL.kn.rotation.x += k * .5; h.lR.kn.rotation.x += k * .5; h.lL.l.rotation.x -= k * .25; h.lR.l.rotation.x -= k * .25; h.neck.rotation.x += k * .25 - pant * .08; }
    if (p.aim) { const k = p.aim; h.aR.a.rotation.set(lerp(h.aR.a.rotation.x, -1.5, k), 0, 0); h.aR.el.rotation.x = lerp(h.aR.el.rotation.x, 0, k); h.aL.a.rotation.set(lerp(h.aL.a.rotation.x, -1.35, k), lerp(0, -.45, k), 0); h.aL.el.rotation.x = lerp(h.aL.el.rotation.x, -.3, k); h.spine.rotation.x -= (p.kick || 0) * .15; h.aR.a.rotation.x -= (p.kick || 0) * .5; }
    if (p.hold) { const k = p.hold; h.aL.a.rotation.set(lerp(h.aL.a.rotation.x, -.9, k), lerp(0, .5, k), .06); h.aL.el.rotation.x = lerp(h.aL.el.rotation.x, -1.6, k); h.aR.a.rotation.set(lerp(h.aR.a.rotation.x, -.7, k), lerp(0, -.6, k), -.1); h.aR.el.rotation.x = lerp(h.aR.el.rotation.x, -1.2, k); }
    for (const name of ['swing', 'shove', 'stomp']) { const t = p[name] ?? -1; if (t >= 0 && t <= 1) rig(h, kf(t, ACT[name]), ry); }
    // sentar no chão (sit 0..1): agacha, senta, pernas à frente, braços nos joelhos
    if (p.sit) { const k = sm(clamp(p.sit)), a = (o, kk, v) => { o[kk] = lerp(o[kk], v, k); }, mid = Math.sin(k * Math.PI);
      h.hips.position.y = lerp(h.hips.position.y, .17, k) + mid * .12; a(h.lL.l.rotation, 'x', -1.52); a(h.lR.l.rotation, 'x', -1.34); h.lL.l.rotation.z = -.14 * k; h.lR.l.rotation.z = .16 * k; a(h.lL.kn.rotation, 'x', .28 + mid * 1.2); a(h.lR.kn.rotation, 'x', .62 + mid * 1.0);
      h.spine.rotation.x = lerp(h.spine.rotation.x, .3, k) + mid * .25; a(h.aL.a.rotation, 'x', -.95); a(h.aR.a.rotation, 'x', -.85); a(h.aL.el.rotation, 'x', -.45); a(h.aR.el.rotation, 'x', -.5); h.grip.rotation.x = lerp(h.grip.rotation.x, .9, k); }
  }
  h.clip = p.clip || null;   // modelos do jogo: ['z_walk', quadro, loop] toca a animação original (pz.js)
  if (h.pack) h.pack.scale.setScalar(p.pack || 1);
  if (h.band) h.band.visible = !!p.band;
  if (p.push) { const k = p.push; h.spine.rotation.x -= k * .45; h.neck.rotation.x -= k * .3; h.g.position.x -= Math.sin(ry) * k * .35; h.g.position.z -= Math.cos(ry) * k * .35; h.lR.l.rotation.x -= k * .35; h.lL.kn.rotation.x += k * .3; }
  if (p.crouch) { const k = p.crouch; h.lL.l.rotation.x -= k * .95; h.lR.l.rotation.x -= k * .95; h.lL.kn.rotation.x += k * 1.5; h.lR.kn.rotation.x += k * 1.5; h.spine.rotation.x += k * .3; h.hips.position.y -= k * .07; }
  // morte: dead = frames desde o golpe (deadStyle 0 de costas, 1 girando de lado, 2 de bruços). fall 0..1 = compatível com episódios antigos
  const dead = p.dead != null && p.dead >= 0 ? p.dead : (p.fall ? p.fall * 22 : -1);
  if (dead >= 0) { zDead(h, dead, p.deadStyle ?? ((h.o.seed || 0) % 3 === 1 ? 1 : 0), ry);
    // corpo no chão leva pisão (jolt = frames desde o pisão): quica e os membros tremem
    if (p.jolt != null && p.jolt >= 0 && p.jolt < 14) { const k = Math.exp(-p.jolt / 3) * Math.cos(p.jolt * .9); h.g.position.y += Math.abs(k) * .09; h.lL.kn.rotation.x += Math.abs(k) * .5; h.lR.l.rotation.x -= Math.abs(k) * .35; h.aL.a.rotation.x -= k * .4; h.aR.a.rotation.x += k * .3; h.neck.rotation.x += k * .5; h.spine.rotation.x += k * .12; } }
}

const S = PZ ? PZ.humanPZ(PZ.SOBREVIVENTE, scene) : human({ shirt: '#d9d4c5', jacket: '#3e5a3a', pants: '#2f4a73', skin: '#d9a77f', hair: '#4a2e1a', shoes: '#3a2414', pack: '#5b4630', bat: true, sleeveLong: true, seed: 1 });
S.jacketMat = PZ ? new THREE.MeshLambertMaterial() : mat('#3e5a3a');
const ZC = [['#c9c2b0', '#3b4a5e'], ['#5d7a96', '#2a2a2a'], ['#8a3b36', '#4a4030'], ['#d8d0bf', '#28384e'], ['#556b47', '#3a3a3a'], ['#b8a074', '#2b3b55'], ['#7b6a8e', '#333'], ['#c4c0b6', '#5a4a36']];
const Z = [];
for (let i = 0; i < 16; i++) { if (PZ) { Z.push(PZ.zumbiPZ(i, scene)); continue; } const c = ZC[i % ZC.length]; Z.push(human({ zombie: true, shirt: c[0], pants: c[1], skin: ['#cfc8b4', '#b5b391', '#a99177', '#8a8474', '#766849', '#72726b'][i % 6] /* cores medidas nas skins reais do jogo (pálido -> decomposto) */, hair: ['#2a2a22', '#4a3a2a', '#6b6b5a'][i % 3], shoes: '#222', blood: true, seed: i * 11 })); }

// ---------- utilidades de cena ----------
const face = (fx, fz, tx, tz) => Math.atan2(tx - fx, tz - fz);
const T = f => f / 30;
function hideAllZ() { Z.forEach(z => z.g.visible = false); }
// com os modelos do jogo o andar é a animação ORIGINAL (Zombie_Walk / Walk2); com morte, ataque, mordida ou tranco volta para a pose do engine
function zWalk(z, i, f, x, zz, ry, sp = 1, extra = {}) { const o = Object.assign({ x, z: zz, ry, ph: T(f) * 5 * sp + i * 1.7, amp: .55 }, extra);
  if (PZ && o.clip === undefined && !(o.dead >= 0) && !o.fall && !o.attack && !o.bite && !(o.flinch >= 0)) o.clip = [i % 2 ? 'z_walk2' : 'z_walk', f * sp + i * 7];
  pose(z, o); }
function light(kind) {
  if (kind === 'red') { hemi.color.set('#b07a80'); hemi.groundColor.set('#2a1414'); hemi.intensity = 1.7; sun.color.set('#ff9a8a'); sun.intensity = 1.4; scene.background.set('#120708'); scene.fog.color.set('#120708'); }
  else if (kind === 'dark') { hemi.color.set('#6a7898'); hemi.groundColor.set('#1a1612'); hemi.intensity = 1.2; sun.color.set('#9ab0ff'); sun.intensity = .9; scene.background.set('#07080b'); scene.fog.color.set('#07080b'); }
  else if (kind === 'dawn') { hemi.color.set('#ffd9b8'); hemi.groundColor.set('#4a3a2a'); hemi.intensity = 2.0; sun.color.set('#ffb070'); sun.intensity = 2.8; scene.background.set('#120c0a'); scene.fog.color.set('#120c0a'); }
  else { hemi.color.set('#c4d2ee'); hemi.groundColor.set('#4a4030'); hemi.intensity = 2.3; sun.color.set('#ffe0b8'); sun.intensity = 2.4; scene.background.set('#0b0d12'); scene.fog.color.set('#0b0d12'); }
}


// ---------- partículas de sangue (golpes / cortes) ----------
const parts = [];
for (let i = 0; i < 60; i++) { const m = box(.07, .07, .07, '#9a0f1a'); m.visible = false; scene.add(m); parts.push(m); }
let pi = 0;
// burst: jato balístico a partir de (x,y,z); age = frames desde o impacto; seed muda o padrão
function burst(x, y, z, age, n = 12, seed = 1, dir = 0) {
  if (age < 0 || age > 26) return;
  for (let i = 0; i < n; i++) { const m = parts[pi++]; if (!m) return;
    const a = dir + (R(seed + i) - .5) * 2.2, v = 1.6 + R(seed + i * 3) * 2.2, up = 2 + R(seed + i * 7) * 2.5, t = age / 30;
    const yy = y + up * t - 9.8 * t * t / 2; if (yy < 0.03) { m.visible = false; continue; }
    m.visible = true; m.position.set(x + Math.sin(a) * v * t, yy, z + Math.cos(a) * v * t); m.rotation.set(t * 9, t * 7, 0); m.scale.setScalar(1 - age / 40); }
}

// ---------- objetos de cena (props) ----------
const props = [];
const prop = (o, parent = scene) => { o.visible = false; parent.add(o); props.push(o); return o; };
// ondas de som (anéis no chão)
const rings = [];
for (let i = 0; i < 40; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.94, 1, 64), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .8, depthWrite: false, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.visible = false; scene.add(m); rings.push(m); }
let ri = 0;
// emite um anel a cada `period` frames desde `age`=0; cada anel vive `life` frames e chega a `maxR`
function waves(x, z, age, o = {}) {
  const { period = 10, life = 34, maxR = 9, color = '#ffffff', until = 1e9, y = .05 } = o;
  if (age < 0) return;
  for (let k = 0; k * period <= Math.min(age, until); k++) { const a = age - k * period; if (a < 0 || a > life) continue; const m = rings[ri++]; if (!m) return;
    const t = a / life; m.visible = true; m.position.set(x, y + ri * .002, z); m.scale.setScalar(.3 + t * maxR); m.material.color.set(color); m.material.opacity = .85 * (1 - t); }
}
// tábuas na janela da casa 1
const planks = [0, 1, 2].map(i => { const b = box(1.7, .2, .09, '#8a5a32'); b.position.set(12.4, 1.15 + i * .36, -7.93); b.rotation.z = [-.12, .1, -.05][i]; return prop(b); });
// garrafas e latas
const bottles = Array.from({ length: 8 }, () => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .36, 12), new THREE.MeshLambertMaterial({ color: '#dff2fb', transparent: true, opacity: .35, depthWrite: false })); b.position.y = .18; g.add(b);
  const wg = new THREE.Group(); wg.position.y = .01; g.add(wg); const w = new THREE.Mesh(new THREE.CylinderGeometry(.085, .085, .34, 12), new THREE.MeshLambertMaterial({ color: '#4aa8e0', emissive: '#1a5a8a', emissiveIntensity: .35 })); w.position.y = .17; wg.add(w); g.userData.water = wg;
  const c = box(.08, .06, .08, '#2a5ab8'); c.position.y = .39; g.add(c); return prop(g); });
const cans = Array.from({ length: 10 }, () => { const g = new THREE.Group(); const c = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .16, 12), mat('#b8bcc2')); c.position.y = .08; g.add(c); const l = new THREE.Mesh(new THREE.CylinderGeometry(.082, .082, .08, 12), mat('#b8322a')); l.position.y = .08; g.add(l); return prop(g); });
// gerador
const gen = prop(new THREE.Group());
{ const b = box(1.0, .62, .62, '#e0b020'); b.position.y = .42; gen.add(b); const p2 = box(.5, .3, .02, '#2a2a2a'); p2.position.set(0, .45, .32); gen.add(p2); const fr = box(1.1, .08, .7, '#333'); fr.position.y = .1; gen.add(fr); }
// helicóptero
const heli = prop(new THREE.Group()); let rotor;
{ const b = box(2.4, 1.0, 1.0, '#4a5a3a'); b.position.y = 0; heli.add(b); const n = box(.6, .7, .9, '#2b3440'); n.position.set(1.4, -.05, 0); heli.add(n);
  const tb = box(2.6, .25, .25, '#4a5a3a'); tb.position.set(-2.4, .2, 0); heli.add(tb); const tf = box(.3, .7, .08, '#4a5a3a'); tf.position.set(-3.6, .5, 0); heli.add(tf);
  [-.45, .45].forEach(zz => { const sk = box(2.2, .06, .08, '#222'); sk.position.set(0, -.75, zz); heli.add(sk); });
  rotor = new THREE.Group(); rotor.position.y = .65; heli.add(rotor); [0, Math.PI / 2].forEach(r => { const bl = box(5.2, .04, .2, '#1a1a1a'); bl.rotation.y = r; rotor.add(bl); }); }
// alarme da casa 0: sirene no telhado + luz vermelha
const sirenMat = new THREE.MeshLambertMaterial({ color: '#ff3040', emissive: '#ff1020', emissiveIntensity: 0 });
const siren = new THREE.Mesh(new THREE.BoxGeometry(.4, .3, .4), sirenMat); siren.position.set(2.6, 3.3, -8.2); scene.add(siren);
const alarmLight = new THREE.PointLight('#ff2030', 0, 14, 1.2); alarmLight.position.set(1.4, 3, -6); scene.add(alarmLight);
const winMat = houses[0].wins[1].material;

// ---------- fumaça / poeira ----------
const smoke = [];
for (let i = 0; i < 48; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), new THREE.MeshLambertMaterial({ color: '#9a958c', transparent: true, opacity: .5, depthWrite: false })); m.visible = false; scene.add(m); smoke.push(m); }
let si = 0;
// puff: nuvem que sobe, cresce e some. age em frames.
function puff(x, y, z, age, o = {}) {
  const { n = 6, seed = 1, life = 40, spread = .5, rise = 1.0, size = .32, color = '#9a958c', op = .55 } = o;
  if (age < 0 || age > life) return; const t = age / life;
  for (let i = 0; i < n; i++) { const m = smoke[si++]; if (!m) return; const a = R(seed + i) * 6.283, r = spread * (.3 + R(seed + i * 3) * .7) * (0.4 + t);
    m.visible = true; m.material.color.set(color); m.material.opacity = op * (1 - t) * (t < .1 ? t / .1 : 1);
    m.position.set(x + Math.cos(a) * r, y + rise * t * (.6 + R(seed + i * 5) * .6), z + Math.sin(a) * r); m.scale.setScalar(size * (.6 + t * 1.6) * (.7 + R(seed + i * 7) * .6)); }
}
// ---------- cacos de vidro / faíscas ----------
const glassP = [];
for (let i = 0; i < 36; i++) { const m = box(.08, .08, .015, '#bfe4f4', { emissive: '#5a9ab8', emissiveIntensity: .5 }); m.visible = false; scene.add(m); glassP.push(m); }
const sparkP = [];
for (let i = 0; i < 24; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.05, .05, .05), new THREE.MeshBasicMaterial({ color: '#fff2a8' })); m.visible = false; scene.add(m); sparkP.push(m); }
let gi = 0, ki = 0;
function shardBurst(pool, idx, x, y, z, age, n, seed, dir, spd = 2.4, life = 30) {
  if (age < 0 || age > life) return idx;
  for (let i = 0; i < n; i++) { const m = pool[idx++]; if (!m) return idx; const a = dir + (R(seed + i) - .5) * 2.4, v = spd * (.5 + R(seed + i * 3)), up = 1.5 + R(seed + i * 7) * 2.5, t = age / 30;
    const yy = y + up * t - 9.8 * t * t / 2; if (yy < .02) { m.visible = true; m.position.set(x + Math.sin(a) * v * Math.min(t, .5), .02, z + Math.cos(a) * v * Math.min(t, .5)); continue; }
    m.visible = true; m.position.set(x + Math.sin(a) * v * t, yy, z + Math.cos(a) * v * t); m.rotation.set(t * 14 + i, t * 11, t * 7); }
  return idx;
}
const glass = (x, y, z, age, n = 14, seed = 1, dir = 0) => { gi = shardBurst(glassP, gi, x, y, z, age, n, seed, dir, 2.2, 40); };
const sparks = (x, y, z, age, n = 12, seed = 1, dir = 0) => { if (age > 10) return; ki = shardBurst(sparkP, ki, x, y, z, age, n, seed, dir, 3.2, 10); };
// ---------- luz de clarão (tiro, faróis) ----------
const flashL = new THREE.PointLight('#ffd27a', 0, 10, 1.5); scene.add(flashL);
const flashAt = (x, y, z, color, intensity, dist = 10) => { flashL.position.set(x, y, z); flashL.color.set(color); flashL.intensity = intensity; flashL.distance = dist; };
// ---------- holofote do helicóptero ----------
const beam = prop(new THREE.Mesh(new THREE.ConeGeometry(1.6, 1, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#fff2c0', transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide })));
const beamSpot = prop(new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), new THREE.MeshBasicMaterial({ color: '#fff6d0', transparent: true, opacity: .32, depthWrite: false })));
beamSpot.rotation.x = -Math.PI / 2;
// ---------- poeira no ar ----------
const DN = 140, dpos = new Float32Array(DN * 3);
const dust = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(dpos, 3)), new THREE.PointsMaterial({ color: '#fff1d6', size: 3.2, sizeAttenuation: false, transparent: true, opacity: .55, depthWrite: false }));
dust.frustumCulled = false; scene.add(dust);
function updDust() { for (let i = 0; i < DN; i++) { const t = NOW / 30;
  dpos[i * 3] = TGT.x + ((R(i) * 16 + t * (.15 + R(i + 1) * .2)) % 16) - 8; dpos[i * 3 + 1] = .3 + ((R(i + 2) * 4 + t * .08 + Math.sin(t + i) * .1) % 4); dpos[i * 3 + 2] = TGT.z + ((R(i + 3) * 16 + Math.sin(t * .3 + i) * .4) % 16) - 8; }
  dust.geometry.attributes.position.needsUpdate = true; }

// sombras em tudo
scene.traverse(o => { if (o.isMesh) { o.castShadow = !(o.material && o.material.isMeshBasicMaterial); o.receiveShadow = true; } });
ground.castShadow = false; road.castShadow = false;
smoke.forEach(m => { m.castShadow = false; m.receiveShadow = false; }); glassP.forEach(m => m.castShadow = false);

// zera o estado do frame (chamar no início de cada frame)
function frame(f = 0) {
  NOW = f; si = 0; gi = 0; ki = 0; smoke.forEach(m => m.visible = false); glassP.forEach(m => m.visible = false); sparkP.forEach(m => m.visible = false); flashL.intensity = 0; dust.visible = true;
  bi = 0; pi = 0; blood.forEach(b => b.visible = false); parts.forEach(p => p.visible = false); hideAllZ();
  S.g.visible = true; S.bat.visible = true; S.g.position.y = 0; light('day');
  shards.forEach(({ m, ex, ey }) => { m.visible = true; m.position.set(ex, ey, .05); m.rotation.x = 0; m.material.opacity = .85; });
  props.forEach(o => o.visible = false); ri = 0; rings.forEach(r => r.visible = false);
  S.hammer.visible = false; S.gun.visible = false; S.flash.visible = false; S.band.material.color.set('#f7f5ee');
  S.jacketMat.color.set('#3e5a3a'); S.g.scale.setScalar(1); S.band.scale.setScalar(1); cars.forEach(c => c.userData.lm.emissiveIntensity = 0);
  sirenMat.emissiveIntensity = 0; alarmLight.intensity = 0; winMat.emissiveIntensity = .9; rotor.rotation.y = 0;
}
const draw = () => { updDust(); if (PZ) PZ.syncAll(); renderer.render(scene, cam); };

// ---------- efeitos de golpe ----------
// rastro do taco (aparece só nos frames do golpe) e estrela de impacto
const arcH = prop(new THREE.Group()), arcT = new THREE.Group(); arcH.add(arcT);
const arcM = new THREE.MeshBasicMaterial({ color: '#fff3d0', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
{ const m = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.62, 24, 1, -2.3, 2.3), arcM); m.rotation.x = -Math.PI / 2; arcT.add(m); arcT.rotation.z = .5; }
function swoosh(h, t) { if (t < .37 || t > .62) return; const k = (t - .37) / .25; arcH.visible = true; arcH.position.set(h.g.position.x, 1.38, h.g.position.z); arcH.rotation.y = h.g.rotation.y; arcM.opacity = .42 * (1 - k) * (1 - k); }
const stars = Array.from({ length: 3 }, () => { const g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: '#fff6d8', transparent: true, opacity: 1, depthWrite: false });
  for (let i = 0; i < 9; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.035, .5, .035), m); b.rotation.set(R(i * 3) * 6.28, R(i * 5) * 6.28, R(i * 7) * 6.28); b.translateY(.32); g.add(b); } g.userData.m = m; return prop(g); });
function hitFx(x, y, z, age, slot = 0) { if (age < 0 || age > 5) return; const g = stars[slot % 3]; g.visible = true; g.position.set(x, y, z); const k = age / 5; g.scale.setScalar(.5 + k * 1.1); g.userData.m.opacity = 1 - k; if (age < 2) flashAt(x, y, z, '#fff2c8', 3.5, 6); }
export const U = { R, clamp, lerp, ss, easeOut, face, T };
export { PZ };
export { cv, scene, cam, setCam, light, human, pose, S, Z, zWalk, splat, burst, shards, houses, frame, draw, puff, glass, sparks, flashAt, beam, beamSpot, dust, waves, planks, bottles, cans, gen, heli, rotor, cars, sirenMat, alarmLight, winMat, prop, box, mat, strike, shoveAt, stompAt, ACTD, swoosh, hitFx };
