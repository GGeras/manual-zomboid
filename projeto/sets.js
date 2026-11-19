// sets.js — cenários e objetos reutilizáveis (casa em corte, banheiro, rio, fogueira, chuva, coletor, gerador)
// Tudo é prop(): fica escondido a cada frame e só aparece quando a cena chama a função.
import { THREE, prop, box, mat, puff, flashAt, U } from './engine.js';
const { R, clamp, lerp, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const shadowy = o => { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };

// ---------- casa em corte: cozinha (pia + fogão) à esquerda, banheiro (banheira + vaso + pia) à direita ----------
export const HX = 80, HZ = -5;
export const HOUSE = prop(new THREE.Group()); HOUSE.position.set(HX, 0, HZ);
const hadd = (o, x, y, z) => { o.position.set(x, y, z); HOUSE.add(o); return shadowy(o); };
function tiles(a, b, n = 8) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? a : b; g.fillRect(i * 128 / n, j * 128 / n, 128 / n, 128 / n); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t; }
{ const out = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshLambertMaterial({ color: '#4c6b34' })); out.rotation.x = -Math.PI / 2; out.position.y = .01; out.receiveShadow = true; HOUSE.add(out);
  const k = new THREE.Mesh(new THREE.PlaneGeometry(5, 6), new THREE.MeshLambertMaterial({ map: tiles('#d8d2c2', '#8f8a7e') })); k.rotation.x = -Math.PI / 2; k.position.set(-1.5, .03, 0); k.receiveShadow = true; HOUSE.add(k);
  const b = new THREE.Mesh(new THREE.PlaneGeometry(3, 6), new THREE.MeshLambertMaterial({ map: tiles('#e8eef0', '#9fb3bd', 12) })); b.rotation.x = -Math.PI / 2; b.position.set(2.5, .03, 0); b.receiveShadow = true; HOUSE.add(b);
  hadd(box(8, 2.6, .2, '#c9b48a'), 0, 1.3, -3); hadd(box(.2, 2.6, 6, '#bfa982'), -4, 1.3, 0);
  hadd(box(.16, 1.1, 2.4, '#bfa982'), 1, .55, -1.8);                 // meia-parede entre cozinha e banheiro
  hadd(box(8, .22, .22, '#8a6a46'), 0, .11, -2.88); hadd(box(.22, .22, 6, '#8a6a46'), -3.88, .11, 0);
}
export const winH = new THREE.MeshLambertMaterial({ color: '#cfe6ff', emissive: '#9cc8ff', emissiveIntensity: .7 });
hadd(new THREE.Mesh(new THREE.BoxGeometry(1.3, .9, .06), winH), -1.6, 1.65, -2.88);
// cozinha: bancada com pia e torneira, fogão
hadd(box(3.2, .9, .7, '#efe9dc'), -1.9, .45, -2.5); hadd(box(3.24, .06, .74, '#7a6a5a'), -1.9, .93, -2.5);
hadd(box(.7, .04, .5, '#b8bec4'), -1.6, .95, -2.5); hadd(box(.62, .02, .42, '#5c646b'), -1.6, .955, -2.5);   // cuba
const tap = new THREE.Group(); hadd(tap, -1.6, .96, -2.78); { const a = box(.05, .3, .05, '#c9ced3'); a.position.y = .15; tap.add(a); const b = box(.05, .05, .2, '#c9ced3'); b.position.set(0, .3, .08); tap.add(b); }
export const stream = new THREE.Mesh(new THREE.CylinderGeometry(.018, .022, 1, 8), new THREE.MeshLambertMaterial({ color: '#8fd0ff', emissive: '#3a8acc', emissiveIntensity: .4, transparent: true, opacity: .85 }));
stream.position.set(-1.6, 1.12, -2.62); HOUSE.add(stream);
hadd(box(.9, .9, .7, '#2e2e30'), .1, .45, -2.5);
[[-.2, -.15], [.2, -.15], [-.2, .15], [.2, .15]].forEach(([a, b]) => hadd(new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .02, 12), mat('#111')), .1 + a, .91, -2.5 + b));
// banheiro: banheira oca com nível de água, vaso, pia
const tub = new THREE.Group(); hadd(tub, 2.6, 0, -2.25);
[[0, .28, -.42, 1.8, .56, .1], [0, .28, .42, 1.8, .56, .1], [-.86, .28, 0, .1, .56, .9], [.86, .28, 0, .1, .56, .9], [0, .05, 0, 1.8, .1, .9]].forEach(([x, y, z, w, h, d]) => { const m = box(w, h, d, '#f4f4f0'); m.position.set(x, y, z); tub.add(m); });
export const tubWater = new THREE.Mesh(new THREE.BoxGeometry(1.6, .02, .74), new THREE.MeshLambertMaterial({ color: '#6fb6e6', emissive: '#2a6a99', emissiveIntensity: .35, transparent: true, opacity: .85 }));
tub.add(tubWater);
const toilet = new THREE.Group(); hadd(toilet, 3.4, 0, -.3); { const a = box(.42, .42, .5, '#f4f4f0'); a.position.y = .21; toilet.add(a); const b = box(.46, .5, .18, '#f4f4f0'); b.position.set(0, .65, -.22); toilet.add(b); }
export const lampH = new THREE.PointLight('#fff2d8', 1.5, 10, 1.3); lampH.position.set(0, 2.4, 0); HOUSE.add(lampH);
export const HA = (x, z) => ({ x: HX + x, z: HZ + z });          // posição local da casa -> mundo
export function house(o = {}) { HOUSE.visible = true; lampH.intensity = o.dark ? 0 : 1.5; winH.emissiveIntensity = o.dark ? .05 : .7;
  stream.visible = (o.flow ?? 0) > .02; stream.scale.set(lerp(.5, 1.8, clamp(o.flow ?? 0)), .3, lerp(.5, 1.8, clamp(o.flow ?? 0)));
  tubWater.position.y = lerp(.1, .5, clamp(o.tub ?? .45)); }
// panela (com água) e garrafa/copo seguros na mão: posicionar a cada frame
export const pot = prop(shadowy((() => { const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.CylinderGeometry(.2, .17, .2, 14, 1, true), mat('#5d636a', { side: THREE.DoubleSide })); p.position.y = .1; g.add(p);
  const b = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .02, 14), mat('#4a4f55')); b.position.y = .01; g.add(b);
  [-1, 1].forEach(s => { const h = box(.08, .03, .04, '#2a2a2a'); h.position.set(s * .24, .17, 0); g.add(h); });
  const w = new THREE.Mesh(new THREE.CylinderGeometry(.185, .185, .01, 14), new THREE.MeshLambertMaterial({ color: '#6aa8d8', emissive: '#2a5a88', emissiveIntensity: .3 })); w.position.y = .15; g.add(w); g.userData.w = w; return g; })()));
export function potAt(x, y, z, water = 1, tint = 0) { pot.visible = true; pot.position.set(x, y, z); const w = pot.userData.w; w.visible = water > .02; w.position.y = lerp(.03, .16, water); w.material.color.set(tint ? '#7a8a4a' : '#6aa8d8'); }
export const bottle = prop(shadowy((() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, .26, 10), new THREE.MeshLambertMaterial({ color: '#bfe4ff', transparent: true, opacity: .8 })); b.position.y = .13; g.add(b);
  const c = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .06, 8), mat('#2a6ad0')); c.position.y = .29; g.add(c); return g; })()));

// ---------- rio / lago (margem de grama, água com ondinhas) ----------
export const RVX = -60, RVZ = -40;
export const RIVER = prop(new THREE.Group()); RIVER.position.set(RVX, 0, RVZ);
const rw = new THREE.MeshLambertMaterial({ color: '#3f7f9e', emissive: '#14384a', emissiveIntensity: .3 });
{ const g = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshLambertMaterial({ color: '#4f6f36' })); g.rotation.x = -Math.PI / 2; g.position.y = .012; g.receiveShadow = true; RIVER.add(g);
  const w = new THREE.Mesh(new THREE.PlaneGeometry(40, 14), rw); w.rotation.x = -Math.PI / 2; w.position.set(0, .02, -8); RIVER.add(w);
  const bank = new THREE.Mesh(new THREE.PlaneGeometry(40, .6), new THREE.MeshLambertMaterial({ color: '#7a6a4a' })); bank.rotation.x = -Math.PI / 2; bank.position.set(0, .016, -.9); RIVER.add(bank);
  [[-3, -1.2], [3.5, -1.0], [-6, -.9], [6.5, -1.3]].forEach(([x, z], i) => { const r = new THREE.Mesh(new THREE.IcosahedronGeometry(.25 + R(i) * .2, 0), mat('#7d786e', { flatShading: true })); r.position.set(x, .08, z); RIVER.add(shadowy(r)); });
  [[-2, .8], [2.6, 1.2], [-4.6, 1.6], [4.8, .6]].forEach(([x, z], i) => { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.4 + R(i + 3) * .2, 0), mat(i % 2 ? '#2f4a24' : '#3d5e2c', { flatShading: true })); b.position.set(x, .3, z); RIVER.add(shadowy(b)); }); }
const ripples = Array.from({ length: 8 }, () => { const m = new THREE.Mesh(new THREE.RingGeometry(.9, 1, 28), new THREE.MeshBasicMaterial({ color: '#b8e2f2', transparent: true, opacity: 0, depthWrite: false })); m.rotation.x = -Math.PI / 2; RIVER.add(m); return m; });
export const RA = (x, z) => ({ x: RVX + x, z: RVZ + z });
export function river(f, o = {}) { RIVER.visible = true; rw.color.set('#3f7f9e');   // no jogo a água contaminada tem a mesma cor: só o aviso muda
  ripples.forEach((m, i) => { const a = ((T(f) * .5 + i / 8) % 1); m.position.set((R(i) - .5) * 10, .03, -1.6 - R(i + 4) * 5); m.scale.setScalar(.2 + a * 1.4); m.material.opacity = .45 * (1 - a); }); }

// ---------- fogueira com panela ----------
export const FIRE = prop(new THREE.Group());
{ for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, s = new THREE.Mesh(new THREE.IcosahedronGeometry(.12, 0), mat('#8a857a', { flatShading: true })); s.position.set(Math.cos(a) * .42, .07, Math.sin(a) * .42); FIRE.add(shadowy(s)); }
  [0, 1.1, 2.2].forEach(a => { const l = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .6, 6), mat('#5a3a22')); l.rotation.set(Math.PI / 2, 0, a); l.position.y = .08; FIRE.add(shadowy(l)); });
  [0, 2.1, 4.2].forEach(a => { const st = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 1.1, 5), mat('#4a3020')); st.position.set(Math.cos(a) * .32, .5, Math.sin(a) * .32); st.rotation.set(Math.sin(a) * .32, 0, -Math.cos(a) * .32); FIRE.add(st); }); }
const flames = Array.from({ length: 7 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(.09, .4, 6), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffb020' : '#ff5a1a', transparent: true, opacity: .92 })); m.position.set(Math.cos(i) * .12, .25, Math.sin(i) * .12); FIRE.add(m); return m; });
export function fire(x, z, f, o = {}) { FIRE.visible = true; FIRE.position.set(x, 0, z); const k = o.k ?? 1;
  flames.forEach((m, i) => { m.visible = k > .02; m.scale.set(k, k * (1 + Math.sin(f * .7 + i * 1.7) * .3), k); });
  if (k > .02) { flashAt(x, .6, z, '#ff9a40', 1.6 * k + Math.sin(f * .9) * .2, 5); puff(x, .7, z, f % 30, { n: 2, seed: 9, life: 30, size: .14, rise: 1.2, color: '#6d665d', op: .35 }); } }

// ---------- chuva ----------
const DROPS = 260;
const rainGeo = new THREE.BufferGeometry(); const rainPos = new Float32Array(DROPS * 6); rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
export const RAIN = prop(new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: '#dceaf5', transparent: true, opacity: .8 })));
RAIN.frustumCulled = false;
export function rain(cx, cz, f, k = 1) { RAIN.visible = k > .02; RAIN.material.opacity = .8 * k;
  for (let i = 0; i < DROPS; i++) { const x = cx + (R(i) - .5) * 14, z = cz + (R(i + 900) - .5) * 14, y = 7 - ((f * .55 + R(i + 400) * 7) % 7), l = .45;
    rainPos.set([x, y, z, x - .05, y - l, z - .05], i * 6); }
  rainGeo.attributes.position.needsUpdate = true; }

// ---------- coletor de chuva (Build 42: barril de madeira + saco de lixo/lona esticado por cima como funil) ----------
export const COL = prop(new THREE.Group());
const colSeq = [];   // [objeto, ordem de montagem 0..1]
{ const N = 14, r = .44, H = 1.0;
  const bottom = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .06, 20), mat('#6e4c2c')); bottom.position.y = .03; COL.add(shadowy(bottom)); colSeq.push([bottom, 0]);
  for (let i = 0; i < N; i++) { const a = i / N * 6.283, w = 2 * Math.PI * r / N + .006;
    const st = box(w, H, .05, ['#8a6238', '#7d5732', '#93693d'][i % 3]); st.position.set(Math.sin(a) * r, H / 2, Math.cos(a) * r); st.rotation.y = a; COL.add(shadowy(st)); colSeq.push([st, .05 + i / N * .5]); }
  [.12, .5, .9].forEach((y, i) => { const h = new THREE.Mesh(new THREE.TorusGeometry(r + .03, .022, 6, 28), mat('#3b3b3d')); h.rotation.x = Math.PI / 2; h.position.y = y; COL.add(shadowy(h)); colSeq.push([h, .6 + i * .05]); });
  // saco de lixo preto: cai pra dentro como funil e sobra pendurado na borda
  const sheet = new THREE.Group(); sheet.position.y = H;
  const sag = new THREE.Mesh(new THREE.ConeGeometry(r + .06, .32, 20, 1, true), mat('#1c1d20', { side: THREE.DoubleSide })); sag.rotation.x = Math.PI; sag.position.y = -.14; sheet.add(sag);
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(r + .07, r + .09, .2, 20, 1, true), mat('#1c1d20', { side: THREE.DoubleSide })); skirt.position.y = -.07; sheet.add(skirt);
  const tie = new THREE.Mesh(new THREE.TorusGeometry(r + .075, .018, 6, 28), mat('#b8a07a')); tie.rotation.x = Math.PI / 2; tie.position.y = -.1; sheet.add(tie);
  [0, 1.6, 3.2, 4.7].forEach(a => { const f = box(.12, .1, .04, '#1c1d20'); f.position.set(Math.sin(a) * (r + .1), -.2, Math.cos(a) * (r + .1)); f.rotation.y = a; sheet.add(f); });
  COL.add(shadowy(sheet)); colSeq.push([sheet, .82]); }
const colPool = new THREE.Mesh(new THREE.CircleGeometry(1, 20), new THREE.MeshLambertMaterial({ color: '#5f8aa6', emissive: '#1d3a4e', emissiveIntensity: .35 }));
colPool.rotation.x = -Math.PI / 2; COL.add(colPool);
export function collector(x, z, build = 1, water = 0) { COL.visible = true; COL.position.set(x, 0, z);
  colSeq.forEach(([o, t0]) => { const k = sm((build - t0) / .07); o.visible = k > .02; o.scale.setScalar(o === colSeq[colSeq.length - 1][0] ? lerp(.2, 1, k) : lerp(1.25, 1, k)); o.userData.y0 ??= o.position.y; o.position.y = o.userData.y0 + (1 - k) * .35; });
  colPool.visible = build >= 1 && water > .01; colPool.scale.setScalar(lerp(.06, .3, clamp(water))); colPool.position.y = 1.0 - .29 + water * .06; }
export const COL_TOP = 1.0;

// ---------- materiais e itens ----------
const plank = (x, z, r) => { const p = box(1.1, .05, .2, '#9a7346'); p.position.set(x, .03, z); p.rotation.y = r; return p; };
export const itPlanks = prop(new THREE.Group()); [[0, 0, .1], [0, .24, -.05], [.05, .1, .3]].forEach(([x, z, r], i) => { const p = plank(x, z, r); p.position.y = .03 + i * .05; itPlanks.add(p); }); shadowy(itPlanks);
export const itNails = prop(new THREE.Group()); { const b = box(.22, .12, .16, '#b8a07a'); b.position.y = .06; itNails.add(b); const l = box(.225, .05, .165, '#c8402a'); l.position.y = .07; itNails.add(l); } shadowy(itNails);
export const itBags = prop(new THREE.Group()); { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(.18, 1), mat('#1e1f22', { flatShading: true })); b.scale.set(1.2, .5, 1); b.position.y = .08; itBags.add(b); } shadowy(itBags);
export const itGas = prop(new THREE.Group()); { const b = box(.3, .38, .16, '#c8231e'); b.position.y = .19; itGas.add(b); const h = box(.18, .05, .05, '#2a2a2a'); h.position.y = .42; itGas.add(h); const s = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .14, 6), mat('#e0b020')); s.position.set(.12, .44, 0); s.rotation.z = -.6; itGas.add(s); } shadowy(itGas);
export const itMag = prop(new THREE.Group()); { const b = box(.3, .02, .4, '#e8d9a8'); itMag.add(b); const c = box(.26, .021, .2, '#c8402a'); c.position.z = -.08; itMag.add(c); const t = box(.2, .022, .04, '#222'); t.position.z = .1; itMag.add(t); } shadowy(itMag);
export const itScrap = prop(new THREE.Group()); { const b = box(.18, .04, .12, '#2e6b3a'); b.position.y = .03; itScrap.add(b); [[-.05, 0], [.04, .03], [.02, -.04]].forEach(([x, z]) => { const c = box(.04, .04, .04, '#d0b030'); c.position.set(x, .07, z); itScrap.add(c); }); } shadowy(itScrap);
export function item(o, x, y, z, ry = 0, s = 1) { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); }
// coloca um item na mão direita do humano (segue o braço)
// rx: inclinação no sentido de quem segura (positivo = topo vai pra frente/derrama; negativo = topo vem pra boca)
export function inHand(h, o, s = 1, rx = 0) { o.visible = true; h.g.updateMatrixWorld(true); const v = new THREE.Vector3(0, h.pz ? -h.pz.hand : -.36, .05).applyMatrix4(h.aR.el.matrixWorld);
  o.position.copy(v); o.rotation.order = 'YXZ'; o.rotation.set(rx, h.g.rotation.y, 0); o.scale.setScalar(s); }
export function inHandL(h, o, s = 1, rx = 0) { h.g.updateMatrixWorld(true); const v = new THREE.Vector3(0, h.pz ? -h.pz.hand : -.36, .05).applyMatrix4(h.aL.el.matrixWorld); o.visible = true; o.position.copy(v); o.rotation.order = 'YXZ'; o.rotation.set(rx, h.g.rotation.y, 0); o.scale.setScalar(s); }
