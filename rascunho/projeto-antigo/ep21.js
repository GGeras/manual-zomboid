import { THREE, PZ, scene, pose, S, light, puff, prop, U } from './engine.js';
import { run } from './ep3d.js';
import { rain } from './sets.js';
const { R, clamp, lerp, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// mato longe da cidade; anel do raio de busca; itens (ícones originais) brotam no chão dentro do raio
const GX = 100, GZ = 60;
const FIELD = prop(new THREE.Group()); FIELD.position.set(GX, 0, GZ);
const gM = new THREE.MeshLambertMaterial({ color: '#4f6d33' });
{ const g = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), gM); g.rotation.x = -Math.PI / 2; g.position.y = .01; g.receiveShadow = true; FIELD.add(g);
  for (let i = 0; i < 70; i++) { const t = new THREE.Mesh(new THREE.ConeGeometry(.08 + R(i) * .08, .3 + R(i + 7) * .3, 5), new THREE.MeshLambertMaterial({ color: R(i + 3) > .5 ? '#5f8a3a' : '#466a2c' })); t.position.set((R(i + 11) - .5) * 16, .15, (R(i + 19) - .5) * 16); FIELD.add(t); } }
const RING = new THREE.Mesh(new THREE.RingGeometry(.96, 1, 64), new THREE.MeshBasicMaterial({ color: '#8fe04a', transparent: true, opacity: .8, side: THREE.DoubleSide, depthWrite: false })); RING.rotation.x = -Math.PI / 2; RING.position.y = .04; FIELD.add(RING);
const NAMES = ['Item_Branch', 'Item_Flint', 'Item_BerryBlue', 'Item_MushroomButton', 'Item_Grasshopper', 'Item_BerryGeneric2', 'Item_Branch', 'Item_LemonGrass'];
const ICONS = NAMES.map((n, i) => { const s = prop(PZ.icon3d(n, .4)); scene.add(s); const a = i / NAMES.length * 6.28 + .4, r = 1.6 + R(i + 5) * 4; s.userData.p = [GX + Math.cos(a) * r, GZ + Math.sin(a) * r]; s.userData.r = r; return s; });
// rad: raio de busca (quadrados ~ metros); show: itens dentro do raio aparecem
function field(f, rad, o = {}) { FIELD.visible = true; gM.color.set(o.snow ? '#d9e0e4' : '#4f6d33'); RING.scale.setScalar(Math.max(.1, rad)); RING.material.color.set(o.col || '#8fe04a');
  ICONS.forEach((s, i) => { const on = s.userData.r < rad && !(o.snow && i % 2); s.visible = on; if (on) s.position.set(s.userData.p[0], .3 + Math.sin(T(f) * 3 + i) * .03, s.userData.p[1]); if (o.poison && i === 2) s.material.color && s.material.color.set('#ff6070'); }); }
const st = (o = {}) => { pose(S, Object.assign({ x: GX, z: GZ, ry: .6, ph: 0, amp: 0 }, o)); S.bat.visible = false; };
const cam = (c, h, lf, len) => c.cam(GX + .3, GZ - .2, lerp(h, h - .6, easeOut(lf / len)), 1);
run([
  (lf, f, len, c) => { light('day'); field(f, 0); st(); cam(c, 7, lf, len); },
  (lf, f, len, c) => { light('day'); field(f, 3 + sm((lf - 20) / 40) * 3.5); st({ crouch: .2 }); cam(c, 9, lf, len); },
  (lf, f, len, c) => { light('day'); field(f, 3 + sm((lf - 20) / (len - 40)) * 7); st(); cam(c, 12, lf, len); },
  (lf, f, len, c) => { light('dawn'); rain(GX, GZ, f, 1); field(f, lerp(6.5, 2.5, sm(lf / 60)), { col: '#ffb020' }); st({ slump: .3 }); cam(c, 9, lf, len); },
  (lf, f, len, c) => { light('day'); const run1 = lf < len / 2; field(f, run1 ? 1.2 : 7); pose(S, { x: GX + (run1 ? 1.5 - lf * .03 : 0), z: GZ, ry: run1 ? -Math.PI / 2 : .6, ph: run1 ? T(f) * 13 : 0, amp: run1 ? 1.3 : 0, crouch: run1 ? 0 : .6 }); S.bat.visible = false; cam(c, 9, lf, len); },
  (lf, f, len, c) => { light('day'); field(f, 6.5); st({ crouch: .5, lean: .2 }); cam(c, 8, lf, len); },
  (lf, f, len, c) => { light('day'); field(f, 6.5, { poison: true }); st({ crouch: .5, slump: .2 }); c.cam(GX + 1, GZ + .3, 5, .6); },
  (lf, f, len, c) => { light('day'); field(f, 6.5, { poison: true }); st({ crouch: .5, lean: .2 }); c.cam(GX + 1, GZ + .3, 5, .6); },
  (lf, f, len, c) => { light('dawn'); field(f, 6.5, { snow: true }); st({ slump: .3 }); cam(c, 9, lf, len); },
  (lf, f, len, c) => { light('dawn'); field(f, 6.5); pose(S, { x: GX + .8 - lf * .01, z: GZ, ry: -Math.PI / 2, ph: T(f) * 3, amp: .3, crouch: .4 }); S.bat.visible = false; cam(c, 8, lf, len); }
]);
