// Runner 3D genérico: escolhe a cena pelo frame, aplica "punch" de câmera na entrada e tremida de impacto.
import { cv, setCam as cam0, frame, draw, U, Z, S, pose, light, cam, scene, THREE } from './engine.js';
export function run(shots) {
  const CUTS = window.__CUTS, RED = window.__RED, END = Math.round(window.__DUR * 30);
  let st = { f: 0, shake: 0, s0: 0 };
  const ctx = {
    F: window.__F, C: i => window.__F[i] - 3, END,
    cam(tx, tz, h, ty = 1.5) { const age = st.f - st.s0; cam0(tx, tz, h, ty, { f: st.f, shake: st.shake, punch: st.s0 === 0 ? 0 : 1 - U.easeOut(age / 12) }); },
    shake(age, amp = .18) { if (age >= 0 && age < 12) st.shake = Math.max(st.shake, amp * (1 - age / 12)); }
  };
  function render(t) {
    const f = Math.round(t * 30); frame(f); st.f = f; st.shake = 0;
    let k = 0; CUTS.forEach((c, i) => { if (f >= c) k = i; });
    st.s0 = CUTS[k]; const len = (k + 1 < CUTS.length ? CUTS[k + 1] : END) - CUTS[k];
    const INTRO = window.__INTRO || 0;
    if (f < INTRO) { // susto de abertura: zumbi avança na câmera
      cv.style.visibility = 'visible'; light('red'); const z = Z[15], p = U.clamp((f - 4) / 8), zx = 24 + p * 1.2;
      ctx.shake(f - 9, .12); cam0(24.6, -1.4, U.lerp(3.6, 2.6, U.easeOut(f / INTRO)), 1.4, { f, shake: st.shake });
      pose(z, { x: zx, z: -2 + p * 1.2, ry: Math.PI / 4, ph: f * .4, amp: .3, bite: U.clamp((f - 6) / 10) }); draw(); return;
    }
    const show = !RED[k] && shots[k];
    cv.style.visibility = show ? 'visible' : 'hidden';
    if (show) { shots[k](f - CUTS[k], f, len, ctx); draw(); }
  }
  // sonda para a inspeção automática (pipeline/inspect.mjs): onde o personagem está na tela e se algo o esconde
  const ray = new THREE.Raycaster(), v = new THREE.Vector3();
  const seen = o => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
  const inside = (o, root) => { for (let p = o; p; p = p.parent) if (p === root) return true; return false; };
  let MOV = null;
  function probe(h) {
    if (!h.g.visible || cv.style.visibility === 'hidden') return null; h.g.updateMatrixWorld(true);
    const pts = [h.neck, h.spine, h.hips].map(o => o.getWorldPosition(new THREE.Vector3()));
    let hid = 0; const scr = pts.map(p => { v.copy(p).project(cam); return [(v.x + 1) / 2, (1 - v.y) / 2]; });
    { v.copy(pts[0]).add(new THREE.Vector3(0, .12, 0)).project(cam); scr.push([(v.x + 1) / 2, (1 - v.y) / 2]); }   // scr[3] = meio da cabeça (rosto) — regra 4.3: modal não cobre a cabeça
    pts.forEach(p => { const d = p.clone().sub(cam.position).normalize(); ray.set(cam.position, d); ray.camera = cam; ray.far = cam.position.distanceTo(p) - .05;
      const hit = ray.intersectObjects(scene.children, true).find(x => x.object.isMesh && seen(x.object) && !inside(x.object, h.g) && !x.object.userData.tile && !x.object.isInstancedMesh && !x.object.material.transparent && x.object.geometry.type !== 'PlaneGeometry');
      if (hit) hid++; });
    let feet = null; if (h.pz && h.pz.bones.Bip01_L_Toe0) feet = Math.min(...['Bip01_L_Toe0', 'Bip01_R_Toe0', 'Bip01_L_Foot', 'Bip01_R_Foot'].map(n => h.pz.bones[n].getWorldPosition(new THREE.Vector3()).y)) - h.g.position.y;
    // regra 4.6: personagem ATRAVESSANDO móvel (cadeira, poltrona, mesa, bancada…): quadril, peito ou pés dentro da caixa de um móvel do cenário
    // (sentado vale: o quadril fica ACIMA do assento). Caixas dos sprites do jogo (obj/assento) — chão, paredes e placas não entram.
    if (!MOV) { MOV = []; scene.traverse(o => { if (o.isMesh && o.userData.tile && o.geometry.type === 'BoxGeometry' && !/^(floors|blends|walls|fencing|f_bushes|e_|vegetation|lighting|carpentry_01_(8|9|1[0-5]))/.test(o.userData.tile)) MOV.push(o); }); }
    const corpo = [pts[1], pts[2]]; if (h.pz && h.pz.bones.Bip01_L_Toe0) ['Bip01_L_Toe0', 'Bip01_R_Toe0'].forEach(n => corpo.push(h.pz.bones[n].getWorldPosition(new THREE.Vector3())));
    const bb = new THREE.Box3(), atravessa = [];
    MOV.forEach(o => { if (!seen(o)) return; o.updateMatrixWorld(); bb.setFromObject(o); bb.min.x += .1; bb.min.z += .1; bb.max.x -= .1; bb.max.z -= .1; bb.max.y -= .04;
      if (corpo.some(p => bb.containsPoint(p))) atravessa.push(o.userData.tile); });
    return { scr, hid, feet, y: h.g.position.y, atravessa: [...new Set(atravessa)] };
  }
  window.__probe = () => ({ S: probe(S), Z: Z.filter(z => z.g.visible).length });
  const orig = window.__seek; window.__seek = t => { orig(t); render(t); }; Promise.all(window.__TILES || []).then(() => { render(0); window.__resolveWorld(); });   // espera os sprites do jogo (tiles.js)
}
