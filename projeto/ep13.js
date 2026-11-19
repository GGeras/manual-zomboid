import { THREE, PZ, scene, pose, S, Z, zWalk, light, puff, prop, box, U } from './engine.js';
import { run } from './ep3d.js';
const { clamp, lerp, easeOut, face, T } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// rua da cidade: sobrevivente em x≈-2
const SX = -2, SZ = 2.6;
const AXE = PZ.weapon('w_axe', 'fireaxe'); S.bat.add(AXE);
// arma na mão: 'axe' = machado de bombeiro do jogo, null = nada
function arma(k) { S.bat.visible = !!k; S.bat.children.forEach(c => c.visible = (c === AXE) === (k === 'axe')); }
const idle = (o = {}) => { pose(S, Object.assign({ x: SX, z: SZ, ry: 0.6, ph: 0, amp: 0 }, o)); arma(o.arma || null); };
const horde = (f, n, x0, sp = .02, lf = 0) => { for (let i = 0; i < n; i++) zWalk(Z[i], i, f, x0 + i * 1.3 - lf * sp, SZ - 1.6 + (i % 3) * 1.1, -Math.PI / 2 + (i % 2 ? .2 : -.2), .9); };
// casa simples com janela (cena do ladrão), longe da rua
const WX = 100, WZ = -10, WIN_W = 1.3, WIN_H = 1.2, WY = 1.45;
const SET = prop(new THREE.Group()); SET.position.set(WX, 0, WZ);
{ const wallM = '#b9ab92';
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), new THREE.MeshLambertMaterial({ color: '#4c6b34' })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, .01, 2); fl.receiveShadow = true; SET.add(fl);
  const L = 7, Hh = 2.8, th = .2;
  const p1 = box((L - WIN_W) / 2, Hh, th, wallM); p1.position.set(-(L + WIN_W) / 4, Hh / 2, 0); SET.add(p1);
  const p2 = p1.clone(); p2.position.x *= -1; SET.add(p2);
  const lo = box(WIN_W, WY - WIN_H / 2, th, wallM); lo.position.set(0, (WY - WIN_H / 2) / 2, 0); SET.add(lo);
  const hiH = Hh - (WY + WIN_H / 2), hi = box(WIN_W, hiH, th, wallM); hi.position.set(0, WY + WIN_H / 2 + hiH / 2, 0); SET.add(hi);
  const gl = new THREE.Mesh(new THREE.PlaneGeometry(WIN_W, WIN_H), new THREE.MeshLambertMaterial({ color: '#2a3440' })); gl.position.set(0, WY, -.02); SET.add(gl);
  const fr = box(WIN_W + .12, .08, th + .06, '#e8e2d4'); fr.position.set(0, WY - WIN_H / 2, 0); SET.add(fr); }
SET.visible = false;
const BAR = { visible: false };
function hand(h = S) { h.g.updateMatrixWorld(true); return new THREE.Vector3(0, h.pz ? -h.pz.hand : -.36, .05).applyMatrix4(h.aR.el.matrixWorld); }
run([
  // 0 — gancho: zumbis chegando (morre antes de começar)
  (lf, f, len, c) => { BAR.visible = false; SET.visible = false; light('dawn'); idle({ ry: Math.PI / 2, slump: .25 }); horde(f, 5, SX + 3.2, .02, lf); c.cam(SX + .8, SZ - .3, lerp(6.6, 5.6, easeOut(lf / len)), 1); },
  // 1 — tela de criação (HUD por cima): personagem parado, câmera lenta; machado aparece quando vira Lenhador
  (lf, f, len, c) => { SET.visible = false; light('day'); const axe = f >= c.F[5] + Math.round(.55 * (c.F[6] - c.F[5]));
    idle({ ry: .5 + Math.sin(T(f) * .8) * .08, arma: axe ? 'axe' : null }); c.cam(SX + .6, SZ - .4, lerp(5.4, 4.6, lf / len), 1.1); },
  // 2 — surdo: zumbi chega pelas costas sem ele perceber
  (lf, f, len, c) => { SET.visible = false; light('dawn'); idle({ ry: -Math.PI / 2 + .3, slump: .1 }); const t = sm(lf / len);
    zWalk(Z[0], 0, f, SX + lerp(5.0, .9, t), SZ + .2, -Math.PI / 2, .9); c.cam(SX + .9, SZ - .3, lerp(5.6, 4.8, t), 1); },
  // 3 — traços que não combinam
  (lf, f, len, c) => { SET.visible = false; light('day'); idle({ ry: .4 }); c.cam(SX + .6, SZ - .4, lerp(4.6, 4.2, lf / len), 1.1); },
  // 5 — fechamento: build pronto
  (lf, f, len, c) => { BAR.visible = false; SET.visible = false; light('dawn'); idle({ ry: .7, arma: 'axe' }); c.cam(SX + .6, SZ - .3, lerp(5.6, 4.8, easeOut(lf / len)), 1); }
]);
