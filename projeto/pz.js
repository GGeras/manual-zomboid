// PZ — modelos ORIGINAIS do Project Zomboid (corpo, cabelo, roupas, mochilas, itens, veículos) dentro do engine.
// As malhas e texturas vêm da pasta media do jogo (convertidas por pz/convert.py -> assets/pz/models.js e tex.js).
// O personagem continua sendo animado pelo mesmo "esqueleto guia" do engine (hips, spine, neck, aL/aR, lL/lR, grip):
// a cada frame o esqueleto do jogo (Bip01) copia a posição e a rotação das juntas do guia. Por isso pose(), ACT,
// zDead, sit, slump etc. funcionam sem mudança.
import * as THREE from './runtime/hero3d/vendor/three.module.js';
import MODELS from './assets/pz/models.js';
import TEX from './assets/pz/tex.js';

const IMG = {};
export const ready = Promise.all(Object.entries(TEX).map(([k, src]) => new Promise(res => { const im = new Image(); im.onload = () => { IMG[k] = im; res(); }; im.onerror = () => res(); im.src = src; })));
export const hasTex = n => !!IMG[n];

// ---------- texturas: camadas do jogo (pele + roupas pintadas no corpo), com tinta e máscaras ----------
const cnv = (S = 256) => { const c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; return { c, x }; };
const TMPS = {};
// tint: cor que multiplica a textura (como o jogo faz nas roupas "TINT"); gain: clareia antes de tingir (para pintar texturas escuras)
function drawLayer(x, name, tint, gain) { const im = IMG[name], S = x.canvas.width; if (!im) { console.warn('pz: textura ausente:', name); return; }
  if (!tint && !gain) { x.drawImage(im, 0, 0, S, S); return; }
  const T = TMPS[S] || (TMPS[S] = cnv(S)), t = T.x; t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, S, S); t.filter = gain ? `grayscale(1) brightness(${gain})` : 'none'; t.drawImage(im, 0, 0, S, S); t.filter = 'none';
  if (tint) { t.globalCompositeOperation = 'multiply'; t.fillStyle = tint; t.fillRect(0, 0, S, S); }
  t.globalCompositeOperation = 'destination-in'; t.drawImage(im, 0, 0, S, S); x.drawImage(T.c, 0, 0); }
// layers: ['nome' | ['nome', '#tinta', ganho]] de baixo para cima; masks: regiões do corpo a esconder (sob roupas de malha); blood: manchas extras; fill: cor de fundo (pintura de carro)
export function texture(layers, { masks = [], blood = 0, seed = 1, size = 256, fill = null } = {}) { const { c, x } = cnv(size);
  if (fill) { x.fillStyle = fill; x.fillRect(0, 0, size, size); }
  layers.forEach(L => { if (L) Array.isArray(L) ? drawLayer(x, L[0], L[1], L[2]) : drawLayer(x, L); });
  if (blood) { x.globalCompositeOperation = 'source-atop'; let r = seed * 9301 + 49297; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < blood * 9; i++) { const px = 30 + rnd() * 196, py = 30 + rnd() * 215, rr = 1.5 + rnd() * 4.5; x.fillStyle = `rgba(${52 + rnd() * 24 | 0},${4 + rnd() * 6 | 0},${6 + rnd() * 6 | 0},${.45 + rnd() * .35})`;
      for (let k = 0; k < 6; k++) { x.beginPath(); x.ellipse(px + (rnd() - .5) * rr * 2.4, py + (rnd() - .5) * rr * 3.4, rr * (.25 + rnd() * .6), rr * (.4 + rnd() * 1.1), rnd() * 3, 0, 7); x.fill(); } }
    x.globalCompositeOperation = 'source-over'; }
  masks.forEach(m => { if (IMG[m]) { x.globalCompositeOperation = 'destination-out'; x.drawImage(IMG[m], 0, 0, size, size); } }); x.globalCompositeOperation = 'source-over';
  const t = new THREE.CanvasTexture(c); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4; return t; }
const TC = {};
export function tex(name, tint, gain) { const k = name + (tint || '') + (gain || ''); return TC[k] || (TC[k] = texture([[name, tint, gain]], { size: IMG[name] ? Math.max(256, IMG[name].width) : 256 })); }
// emissive leve com a própria textura: o personagem não some nas cenas escuras (o jogo também ilumina os personagens por igual)
const material = (map, o = {}) => new THREE.MeshLambertMaterial(Object.assign({ map, alphaTest: .5, side: THREE.DoubleSide, emissive: '#ffffff', emissiveMap: map, emissiveIntensity: .2 }, o));

// ---------- geometria ----------
const GC = {};
function geom(name) { if (GC[name]) return GC[name]; const m = MODELS.mesh[name]; if (!m) throw new Error('pz: malha ausente: ' + name);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(m.pos, 3));
  if (m.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(m.uv, 2)); g.setIndex(m.idx);
  if (m.nrm) g.setAttribute('normal', new THREE.Float32BufferAttribute(m.nrm, 3)); else g.computeVertexNormals();
  if (m.si) { g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(m.si, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(m.sw, 4)); }
  return GC[name] = g; }
export const hasMesh = n => !!MODELS.mesh[n];

// ---------- esqueleto do jogo + medidas ----------
const M4 = a => new THREE.Matrix4().fromArray(a);   // DirectX (vetor-linha) -> three (vetor-coluna): mesma lista de números
function bindInfo(sex) { const W = {}, P = {}; for (const b of MODELS.skel[sex]) { const L = M4(b.m); W[b.n] = b.p ? W[b.p].clone().multiply(L) : L; P[b.n] = new THREE.Vector3().setFromMatrixPosition(W[b.n]); } return P; }
const INFO = {};
function info(sex) { if (INFO[sex]) return INFO[sex]; const P = bindInfo(sex), d = (a, b) => P[a].distanceTo(P[b]);
  const body = MODELS.mesh[sex + '_body']; let minY = 1e9; for (let i = 1; i < body.pos.length; i += 3) minY = Math.min(minY, body.pos[i]);
  // escala: com as pernas na vertical e o quadril do guia em 0,95 o pé encosta no chão
  const side = 'R', lt = d(`Bip01_${side}_Thigh`, `Bip01_${side}_Calf`), lc = d(`Bip01_${side}_Calf`, `Bip01_${side}_Foot`), ankle = P[`Bip01_${side}_Foot`].y - minY;
  const drop = P.Bip01_Pelvis.y - P[`Bip01_${side}_Thigh`].y, s = .95 / (lt + lc + ankle + drop);
  return INFO[sex] = { P, s }; }

const BONE_DRV = { Bip01_Pelvis: 'hips', Bip01_Spine: 'spine', Bip01_Head: 'neck', Bip01_R_UpperArm: 'aRa', Bip01_R_Forearm: 'aRe', Bip01_L_UpperArm: 'aLa', Bip01_L_Forearm: 'aLe',
  Bip01_R_Thigh: 'lRl', Bip01_R_Calf: 'lRk', Bip01_L_Thigh: 'lLl', Bip01_L_Calf: 'lLk' };
const CHILD = { Bip01_R_UpperArm: 'Bip01_R_Forearm', Bip01_R_Forearm: 'Bip01_R_Hand', Bip01_L_UpperArm: 'Bip01_L_Forearm', Bip01_L_Forearm: 'Bip01_L_Hand',
  Bip01_R_Thigh: 'Bip01_R_Calf', Bip01_R_Calf: 'Bip01_R_Foot', Bip01_L_Thigh: 'Bip01_L_Calf', Bip01_L_Calf: 'Bip01_L_Foot' };
const DOWN = new THREE.Vector3(0, -1, 0);
const ALL = [];   // todos os humanoides PZ (para sincronizar antes de desenhar)

// o: { sex: 'M'|'F', skin: 'malebody01', layers: [...], masks: [...], hair: 'short', hairColor: '#4a2e1a', wear: [['M_jacket', 'jacket_white', '#3e5a3a']], pack: ['M_schoolbag','schoolbag_black','#5b4630'],
//      blood, zombie, seed, bat }
export function humanPZ(o, scene) {
  const sex = o.sex || 'M', { P, s } = info(sex);
  const V = n => new THREE.Vector3(-P[n].x, P[n].y, -P[n].z).multiplyScalar(s);          // posição de repouso no espaço do personagem (modelo virado 180°)
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const hipsP = V('Bip01_Pelvis'); const hips = new THREE.Group(); hips.position.set(0, .95, 0); g.add(hips);
  const rel = (n, base) => V(n).sub(base);
  const spineP = V('Bip01_Spine'), spine = new THREE.Group(); spine.position.copy(spineP).sub(hipsP); spine.position.x = 0; hips.add(spine);
  const neck = new THREE.Group(); neck.position.copy(rel('Bip01_Head', spineP)); neck.position.x = 0; spine.add(neck);
  const arm = S => { const a = new THREE.Group(); a.position.copy(rel(`Bip01_${S}_UpperArm`, spineP)); spine.add(a);
    const el = new THREE.Group(); el.position.y = -P[`Bip01_${S}_UpperArm`].distanceTo(P[`Bip01_${S}_Forearm`]) * s; a.add(el);
    const fore = P[`Bip01_${S}_Forearm`].distanceTo(P[`Bip01_${S}_Hand`]) * s; return { a, el, lo: el, fore }; };
  const aR = arm('R'), aL = arm('L');   // R do jogo fica em +x (lado da arma), igual ao boneco antigo
  const leg = S => { const l = new THREE.Group(); l.position.copy(rel(`Bip01_${S}_Thigh`, hipsP)); hips.add(l);
    const kn = new THREE.Group(); kn.position.y = -P[`Bip01_${S}_Thigh`].distanceTo(P[`Bip01_${S}_Calf`]) * s; l.add(kn); return { l, kn }; };
  const lR = leg('R'), lL = leg('L');
  const hand = aR.fore + .07;           // centro da mão abaixo do cotovelo
  const grip = new THREE.Group(); grip.position.set(0, -hand, 0); aR.el.add(grip);
  const drv = { hips, spine, neck, aRa: aR.a, aRe: aR.el, aLa: aL.a, aLe: aL.el, lRl: lR.l, lRk: lR.kn, lLl: lL.l, lLk: lL.kn };

  // esqueleto do jogo
  const model = new THREE.Group(); model.rotation.y = Math.PI; model.scale.setScalar(s); g.add(model);
  const bones = {}, order = [];
  for (const b of MODELS.skel[sex]) { const bn = new THREE.Bone(); bn.name = b.n; M4(b.m).decompose(bn.position, bn.quaternion, bn.scale); bones[b.n] = bn; order.push(bn); (b.p ? bones[b.p] : model).add(bn); }
  g.updateMatrixWorld(true);
  const q = new THREE.Quaternion(), va = new THREE.Vector3(), vb = new THREE.Vector3();
  for (const [bn, dk] of Object.entries(BONE_DRV)) { const b = bones[bn], D = drv[dk]; b.getWorldQuaternion(q); const A = q.clone();
    if (CHILD[bn]) { b.getWorldPosition(va); bones[CHILD[bn]].getWorldPosition(vb); A.premultiply(new THREE.Quaternion().setFromUnitVectors(vb.sub(va).normalize(), DOWN)); }
    const off = new THREE.Vector3(); if (dk === 'hips') off.set(hipsP.x, 0, hipsP.z);
    b.userData.drv = { D, A, off }; }

  // mão da arma fechada (dedos dobrados em volta do cabo)
  if (o.bat || o.fistK) { const k = o.fistK || [0, 0, 1.25];   // dedos dobrados (eixo conferido em foto)
    bones.Bip01_R_Finger1.rotateX(k[0]); bones.Bip01_R_Finger1.rotateY(k[1]); bones.Bip01_R_Finger1.rotateZ(k[2]); }
  // malhas com pele
  const meshes = {};
  const skinned = (key, meshName, map, mo) => { const m = MODELS.mesh[meshName]; const sk = new THREE.Skeleton(m.bones.map(n => bones[n]), m.inv.map(M4));
    const me = new THREE.SkinnedMesh(geom(meshName), material(map, mo)); me.frustumCulled = false; me.castShadow = true; model.add(me); me.bind(sk, new THREE.Matrix4()); meshes[key] = me; return me; };
  skinned('body', sex + '_body', texture([o.skin, ...(o.layers || [])], { masks: o.masks, blood: o.blood, seed: o.seed }));
  if (o.hair) skinned('hair', `${sex}_hair_${o.hair}`, tex('f_hair_white', o.hairColor || '#4a2e1a'));
  (o.wear || []).forEach(([mn, tn, tint, gain], i) => skinned('wear' + i, mn, tex(tn, tint, gain)));
  let pack = null; if (o.pack) pack = skinned('pack', o.pack[0], tex(o.pack[1], o.pack[2], o.pack[3]));

  // acessórios do personagem principal (mesmos do boneco antigo: taco, martelo, arma, atadura)
  const box = (w, h, d, c) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: c }));
  const cyl = (r1, r2, h, c) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, 8), new THREE.MeshLambertMaterial({ color: c })); m.rotation.x = Math.PI / 2; return m; };
  let bat = null, hammer = null, gun = null, flash = null;
  if (o.bat) { bat = new THREE.Group(); grip.add(bat);
    const b1 = cyl(.058, .03, .78, '#c9a46a'); b1.position.z = .44; b1.castShadow = true; bat.add(b1); const b2 = cyl(.036, .036, .14, '#3a2a1c'); bat.add(b2);
    const b3 = new THREE.Mesh(new THREE.SphereGeometry(.06, 8, 6), new THREE.MeshLambertMaterial({ color: '#c9a46a' })); b3.position.z = .83; bat.add(b3);
    hammer = new THREE.Group(); hammer.position.z = .02; grip.add(hammer); const hh = cyl(.03, .03, .55, '#8a5a32'); hh.position.z = .22; hammer.add(hh); const hd = box(.08, .22, .08, '#4a4e55'); hd.position.z = .48; hammer.add(hd); hammer.visible = false;
    gun = new THREE.Group(); gun.position.set(0, -hand - .02, .02); aR.el.add(gun); const gb = box(.07, .1, .3, '#1c1c1e'); gb.position.z = .14; gun.add(gb); const gg = box(.06, .14, .07, '#2a2a2a'); gg.position.set(0, -.08, .02); gun.add(gg);
    flash = new THREE.Mesh(new THREE.IcosahedronGeometry(.16, 0), new THREE.MeshBasicMaterial({ color: '#ffe27a' })); flash.position.z = .42; gun.add(flash); gun.visible = false; }
  if (o.bat && MODELS.mesh.w_bat && o.gameWeapons !== false) {   // troca as formas simples pelas armas do jogo
    [...bat.children].forEach(c => bat.remove(c)); bat.add(weapon('w_bat', 'baseballbat'));
    [...hammer.children].forEach(c => hammer.remove(c)); hammer.add(weapon('w_hammer', 'hammer'));
    [...gun.children].forEach(c => { if (c !== flash) gun.remove(c); }); const wg = MODELS.mesh.w_m9 ? weapon('w_m9', 'm9_pistol') : weapon('w_handgun', 'handgun'); gun.add(wg); flash.position.z = wg.userData.len + .08; }
  const band = box(.15, .17, .15, '#f7f5ee'); band.position.y = -aL.fore * .5; band.visible = false; aL.el.add(band);
  const sh = new THREE.Mesh(new THREE.CircleGeometry(.4, 16), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .35 })); sh.rotation.x = -Math.PI / 2; sh.position.y = .015; g.add(sh);
  if (scene) scene.add(g);
  const h = { g, hips, spine, neck, aL, aR, lL, lR, pack, bat, band, hammer, gun, flash, grip, mouth: null, shadow: sh, o, pz: { bones, order, model, meshes, s, sex, hand } };
  ALL.push(h); return h;
}

// copia o esqueleto guia para o esqueleto do jogo (chamar depois de posar tudo e antes de desenhar)
const _m = new THREE.Matrix4(), _i = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
// h.clip = ['z_walk', quadro, loop=true]: toca uma animação ORIGINAL do jogo (30 fps) no lugar da pose do engine
export const CLIPS = Object.keys(MODELS.clips || {});
const _qa = new THREE.Quaternion(), _qb = new THREE.Quaternion();
// h.clip[3] = ['s_read', quadro, loop]: tronco, braços e cabeça de OUTRA animação (ex.: sentado na cadeira + lendo), como o jogo mistura
const UPPER = /Spine1|Neck|Head|Clavicle|UpperArm|Forearm|_Hand|Finger|Prop/;
const frameOf = (c, f, loop) => { const n = c.n; return loop ? ((f % (n - 1)) + (n - 1)) % (n - 1) : Math.max(0, Math.min(n - 1, f)); };
// mix = [outra, quadro, loop, peso 0..1, giro]: MISTURA duas animações do jogo (transição suave, ex.: sentado na cama → deitado), como o jogo faz
// entre estados. "giro" (rad) = diferença de rumo entre as duas (a outra foi feita para um corpo virado "giro" a mais que este).
const _qm = new THREE.Quaternion(), _pm = new THREE.Vector3(), _qd = new THREE.Quaternion(), _qy = new THREE.Quaternion(), _Y = new THREE.Vector3(0, 1, 0);
const sample = (d, ff, q, p) => { const i0 = Math.floor(ff), k = ff - i0, nr = d.r.length / 4, a = Math.min(i0, nr - 1), a2 = Math.min(i0 + 1, nr - 1);
  _qa.fromArray(d.r, a * 4); _qb.fromArray(d.r, a2 * 4); q.copy(_qa).slerp(_qb, k).conjugate();
  const nt = d.t.length / 3; if (!nt) return false; const t = Math.min(i0, nt - 1), t2 = Math.min(i0 + 1, nt - 1);
  p.set(d.t[t * 3] + (d.t[t2 * 3] - d.t[t * 3]) * k, d.t[t * 3 + 1] + (d.t[t2 * 3 + 1] - d.t[t * 3 + 1]) * k, d.t[t * 3 + 2] + (d.t[t2 * 3 + 2] - d.t[t * 3 + 2]) * k); return true; };
function clipPose(h, name, f, loop = true, up = null, mix = null) { const c = MODELS.clips[name]; if (!c) throw new Error('pz: animação ausente: ' + name);
  const c2 = up && MODELS.clips[up[0]]; if (up && !c2) throw new Error('pz: animação ausente: ' + up[0]);
  const cm = mix && MODELS.clips[mix[0]]; if (mix && !cm) throw new Error('pz: animação ausente: ' + mix[0]);
  const fm = cm ? frameOf(cm, mix[1], mix[2] !== false) : 0, wm = cm ? Math.max(0, Math.min(1, mix[3])) : 0;
  if (cm && mix[4]) { const A = h.pz.order[0].parent.quaternion; _qy.setFromAxisAngle(_Y, mix[4]); _qd.copy(A).invert().multiply(_qy).multiply(A); }
  f = frameOf(c, f, loop); const f2 = c2 ? frameOf(c2, up[1], up[2] !== false) : 0;
  for (const b of h.pz.order) { const two = c2 && UPPER.test(b.name), d = (two ? c2 : c).b[b.name], par = b.parent; const ff = two ? f2 : f, i0 = Math.floor(ff), k = ff - i0;
    if (d) { const nr = d.r.length / 4, a = Math.min(i0, nr - 1), a2 = Math.min(i0 + 1, nr - 1); _qa.fromArray(d.r, a * 4); _qb.fromArray(d.r, a2 * 4); b.quaternion.copy(_qa).slerp(_qb, k).conjugate();
      const nt = d.t.length / 3; if (nt) { const t = Math.min(i0, nt - 1), t2 = Math.min(i0 + 1, nt - 1); b.position.set(d.t[t * 3] + (d.t[t2 * 3] - d.t[t * 3]) * k, d.t[t * 3 + 1] + (d.t[t2 * 3 + 1] - d.t[t * 3 + 1]) * k, d.t[t * 3 + 2] + (d.t[t2 * 3 + 2] - d.t[t * 3 + 2]) * k); if (b.name === 'Bip01') { b.position.x = 0; b.position.y = 0; } } b.scale.setScalar(1); }
    if (cm && wm > 0 && cm.b[b.name]) { const tem = sample(cm.b[b.name], fm, _qm, _pm);
      if (mix[4] && b === h.pz.order[0]) { _qm.premultiply(_qd); _pm.applyQuaternion(_qd); }
      b.quaternion.slerp(_qm, wm); if (tem) b.position.lerp(_pm, wm); }
    b.updateMatrix(); b.matrixWorld.multiplyMatrices(par.matrixWorld, b.matrix);
    if (h.olhar && OLHAR[b.name]) { _p.setFromMatrixPosition(b.matrixWorld); _m.makeRotationY(h.olhar * OLHAR[b.name]); _m.setPosition(_p.clone().sub(_p.clone().applyMatrix4(_m)));
      b.matrixWorld.premultiply(_m); } } }
// h.olhar (radianos): vira a cabeça para os lados POR CIMA da animação do jogo (procurar olhando em volta no modo de busca).
// Dividido entre peito, pescoço e cabeça como no corpo de verdade; gira em volta do eixo vertical do mundo, no lugar de cada osso.
const OLHAR = { Bip01_Spine1: .2, Bip01_Neck: .35, Bip01_Head: .45 };
export function sync(h) { if (!h.g.visible) return; h.g.updateMatrixWorld(true); const { order, s } = h.pz;
  if (h.clip) { clipPose(h, h.clip[0], h.clip[1], h.clip[2] !== false, h.clip[3], h.clip[4]); return; }
  for (const b of order) { const par = b.parent, d = b.userData.drv;
    if (d) { d.D.matrixWorld.decompose(_p, _q, _s); _p.copy(d.off).applyMatrix4(d.D.matrixWorld); _q.multiply(d.A); _m.compose(_p, _q, _s.multiplyScalar(s));
      b.matrix.copy(_i.copy(par.matrixWorld).invert()).multiply(_m); b.matrix.decompose(b.position, b.quaternion, b.scale); b.matrixWorld.copy(_m); }
    else { b.updateMatrix(); b.matrixWorld.multiplyMatrices(par.matrixWorld, b.matrix); } } }
export function syncAll() { for (const h of ALL) sync(h); }

// ---------- REGRA 4.7 (23/11): CONTATO COM A SUPERFÍCIE — medido com os dados do próprio jogo ----------
// Em pé no jogo (Bob_Idle) o osso do dedo (Toe0) fica exatamente no chão (0,000) e o tornozelo (Foot) a 0,121.
// Pontos que encostam numa superfície: sola = Toe0; calcanhar = Foot − 0,10; joelho = Calf − 0,05; nádega = Pelvis − 0,10.
// apoiar(h, base): depois de pose(), põe o ponto MAIS BAIXO do corpo exatamente sobre a superfície (base = altura do piso),
// quadro a quadro — nunca afunda (joelho/dedo dentro do chão) nem flutua. Sentado na cadeira: os pés no chão e a nádega no assento
// (assento na altura do jogo = ALTURA_ASSENTO). A inspeção confere (pipeline/inspect.mjs: AFUNDANDO / FLUTUANDO / NÁDEGA FORA DO ASSENTO).
export const CONTATO = { calcanhar: .10, joelho: .05, nadega: .10 };
export const ALTURA_ASSENTO = .486;   // Bob_SatChair: pelve a 0,586 com os pés no chão → nádega a 0,486
const _cv = new THREE.Vector3();
export function contatoMin(h) { const B = h.pz.bones, Y = n => _cv.setFromMatrixPosition(B[n].matrixWorld).y;
  return Math.min(Y('Bip01_L_Toe0'), Y('Bip01_R_Toe0'), Y('Bip01_L_Foot') - CONTATO.calcanhar, Y('Bip01_R_Foot') - CONTATO.calcanhar,
    Y('Bip01_L_Calf') - CONTATO.joelho, Y('Bip01_R_Calf') - CONTATO.joelho, Y('Bip01_Pelvis') - CONTATO.nadega); }
export function nadega(h) { return _cv.setFromMatrixPosition(h.pz.bones.Bip01_Pelvis.matrixWorld).y - CONTATO.nadega; }
export function apoiar(h, base = 0) { if (!h.pz || !h.clip) return 0; h.g.position.y = 0; sync(h); const m = contatoMin(h);
  h.g.position.y = base - m; (h.userData ??= {}).apoio = base; return base - m; }

// prende um objeto num osso do jogo (ex.: faca cravada nas costas). Medidas em unidades do jogo.
export function attach(h, bone, obj) { h.pz.bones[bone].add(obj); return obj; }

// item do jogo como modelo 3D (galão, garrafa, panela...). Devolve um grupo já na escala do personagem.
const ITEM_ROT = { cookingpot: [Math.PI / 2, 0, 0] };   // acerto de pose: alguns modelos vêm deitados (feitos para a mão)
export function itemModel(name, texName, s = 1.94) { const m = MODELS.mesh[name]; const g = new THREE.Group(); const me = new THREE.Mesh(geom(name), material(tex(texName || name)));
  if (m.frame) me.applyMatrix4(M4(m.frame)); me.castShadow = true; const k = new THREE.Group(); k.scale.set(-s, s, s); const r = new THREE.Group();   // x invertido: desfaz o espelhamento do formato do jogo (textos legíveis)
  if (ITEM_ROT[name]) r.rotation.set(...ITEM_ROT[name]); r.add(me); k.add(r);
  g.add(k); g.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(g); k.position.y = -bb.min.y; k.position.x = -(bb.min.x + bb.max.x) / 2; k.position.z = -(bb.min.z + bb.max.z) / 2; return g; }

// malha do jogo "crua" (unidades e eixos do jogo) para prender num osso com attach(h, 'Bip01_Prop1', ...): fica na mão como no jogo
export function propMesh(name, texName) { const m = MODELS.mesh[name]; const me = new THREE.Mesh(geom(name), material(tex(texName || name), { alphaTest: .3 })); if (m.frame) me.applyMatrix4(M4(m.frame)); me.castShadow = true; return me; }
// ---------- armas do jogo (malhas originais) ----------
// devolve a malha com o cabo na origem e a ponta para +z (mesma convenção do taco antigo), já na escala do personagem
export function weapon(name, texName, s = 1.94) { const m = MODELS.mesh[name]; const me = new THREE.Mesh(geom(name), material(tex(texName), { alphaTest: .3 })); if (m.frame) me.applyMatrix4(M4(m.frame)); me.castShadow = true;
  const k = new THREE.Group(); k.scale.set(-s, s, s); k.add(me); const g = new THREE.Group(); g.add(k); g.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(g), sz = bb.getSize(new THREE.Vector3());
  const ax = sz.x > sz.y && sz.x > sz.z ? 'x' : sz.y > sz.z ? 'y' : 'z', dir = new THREE.Vector3(); dir[ax] = Math.abs(bb.max[ax]) >= Math.abs(bb.min[ax]) ? 1 : -1;
  g.quaternion.setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1)); const o = new THREE.Group(); o.add(g); o.userData.len = sz[ax]; return o; }

// ---------- veículos do jogo ----------
// kind: 'normal' (sedã Chevalier Nyala), 'pickup' (Chevalier D6), 'taxi'. color: pintura (o jogo pinta a lataria por baixo da textura de detalhes).
const VEH = { normal: ['car_normal', 'vehicle_carnormalshell', 1.47, -1.22, .83, .31], pickup: ['car_pickup', 'vehicle_pickupshell', 1.62, -1.52, .93, .37], taxi: ['car_taxi', 'vehicle_carnormalshell', 1.47, -1.22, .83, .31] };
// frente do veículo = +x (igual ao carro antigo do engine). userData.lm.emissiveIntensity acende os faróis (0..1).
export function vehicle(kind = 'normal', color = '#7a1f1c') { const [mn, tn, fx, rx, hw, wr] = VEH[kind]; const g = new THREE.Group();
  const map = kind === 'taxi' ? texture(['vehicle_taxi_yellow'], { size: 512 }) : texture([tn], { size: 512, fill: color });
  const body = new THREE.Mesh(geom(mn), material(map, { alphaTest: 0 })); body.rotation.y = -Math.PI / 2; body.position.y = wr * .42; body.castShadow = true; body.receiveShadow = true; g.add(body);
  const tire = new THREE.MeshLambertMaterial({ color: '#1b1b1b' }), hub = new THREE.MeshLambertMaterial({ color: '#b9bbb8' }), cap = new THREE.MeshLambertMaterial({ color: '#6f7170' }); const wheels = [];
  [[fx, hw], [fx, -hw], [rx, hw], [rx, -hw]].forEach(([x, z]) => { const w = new THREE.Group(); w.position.set(x, wr, z); const sd = Math.sign(z);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(wr, wr, .22, 14), tire); t.rotation.x = Math.PI / 2; t.castShadow = true; w.add(t);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(wr * .52, wr * .52, .02, 12), hub); h.rotation.x = Math.PI / 2; h.position.z = sd * .115; w.add(h);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(wr * .2, wr * .2, .03, 8), cap); c.rotation.x = Math.PI / 2; c.position.z = sd * .12; w.add(c); g.add(w); wheels.push(w); });
  const E = MODELS.mesh[mn].ext, L = Math.max(E[0], E[2]) / 2, lmat = new THREE.MeshBasicMaterial({ color: '#fff2b0', transparent: true, opacity: 0 });
  [-.6, .6].forEach(z => { const hl = new THREE.Mesh(new THREE.BoxGeometry(.05, .16, .34), lmat); hl.position.set(L + .01, wr * .42 + .52, z); g.add(hl); });
  g.userData = { kind, body, wheels, ext: E, lm: { set emissiveIntensity(v) { lmat.opacity = Math.max(0, Math.min(1, v)); }, get emissiveIntensity() { return lmat.opacity; } } }; return g; }

// ---------- modelos base: personagem principal e zumbis ----------
// Personagem principal: MESMA roupa e cores dos vídeos anteriores (jaqueta verde, camiseta clara, jeans azul, bota marrom, mochila marrom, cabelo castanho, taco).
export const SOBREVIVENTE = { sex: 'M', skin: 'malebody02', layers: [['clothingjeanstint', '#3d5f96'], ['tshirt_white', '#d9d4c5'], 'brownshoes'], masks: ['leftarm', 'rightarm'],
  hair: 'short', hairColor: '#4a2e1a', wear: [['M_jacket', 'jacket_white', '#46663f']], pack: ['M_schoolbag', 'schoolbag_black', '#8a6a48', 3.2], bat: true, seed: 1 };
// Zumbis: 14 modelos base (homens e mulheres; camiseta, regata, camisa, vestido, saia, moletom, jaqueta; careca, curto, longo, rabo; com e sem mochila; faca cravada).
// pele: texturas de zumbi do jogo (níveis 1 a 3 = mais decomposto). Usar intercalado: zumbiPZ(i).
const J = c => ['clothingjeanstint', c], T = c => ['tshirt_white', c], ARMS = ['leftarm', 'rightarm'];
export const ZUMBIS = [
  { nome: 'camiseta azul',     sex: 'M', skin: 'm_zedbody01_level2', layers: [J('#3b4a5e'), T('#5d7a96'), 'blackshoes'], hair: 'messy', hairColor: '#2a2a22', blood: 1 },
  { nome: 'vestido vinho',     sex: 'F', skin: 'f_zedbody01_level2', layers: [['dress', '#8f3340'], 'blackshoes'], hair: 'long', hairColor: '#c9a552', blood: 1 },
  { nome: 'lenhador careca',   sex: 'M', skin: 'm_zedbody04_level3', layers: [J('#2a2a2a'), 'shirt_lumberjackgreen', 'armyboots'], hair: 'baldspot', hairColor: '#7a7a6a', blood: 2 },
  { nome: 'regata e saia',     sex: 'F', skin: 'f_zedbody02_level3', layers: [['skirtknees', '#4a4030'], ['clothingvest', '#c9c2b0'], 'trainers_red'], hair: 'ponytail', hairColor: '#6b3a22', blood: 2 },
  { nome: 'escritório',        sex: 'M', skin: 'm_zedbody02_level2', layers: [J('#55555c'), 'shirt_formal', 'brownshoes'], hair: 'short', hairColor: '#4a3a2a', blood: 1 },
  { nome: 'moletom vermelho',  sex: 'M', skin: 'm_zedbody03_level1', layers: [J('#2f3f5c'), T('#b8b0a0'), 'trainers_white'], masks: ARMS, hair: 'crewcut', hairColor: '#2a2a22', wear: [['M_hoodie', 'hoodieup_white', '#8a3b36']], pack: ['M_schoolbag', 'schoolbag_blue'], blood: 1 },
  { nome: 'camiseta e jeans',  sex: 'F', skin: 'f_zedbody03_level2', layers: [J('#4a6a94'), T('#c98aa0'), 'trainers_white'], hair: 'bob', hairColor: '#4a2e1a', blood: 1 },
  { nome: 'careca de preto',   sex: 'M', skin: 'm_zedbody01_level3', layers: [J('#6f8fb5'), 'tshirt_black', 'armyboots'], blood: 2, knife: 'costas' },
  { nome: 'vestido de alça',   sex: 'F', skin: 'f_zedbody04_level3', layers: [['dress_straps', '#3f5f8a'], 'brownshoes'], hair: 'bun', hairColor: '#8a8a80', blood: 2 },
  { nome: 'jaqueta e mochila', sex: 'M', skin: 'm_zedbody04_level2', layers: [J('#3a3a3a'), T('#c4c0b6'), 'brownshoes'], masks: ARMS, hair: 'mullet', hairColor: '#5a4630', wear: [['M_jacket', 'jacket_white', '#7a5a3a']], pack: ['M_hikingbag', 'bighikingbaggreen'], blood: 1 },
  { nome: 'jaqueta roxa',      sex: 'F', skin: 'f_zedbody01_level1', layers: [['skirt', '#2a2a30'], T('#d8d0bf'), 'blackshoes'], masks: ARMS, hair: 'kate', hairColor: '#1e1a18', wear: [['F_jacket', 'jacket_white', '#6a5a8e']], blood: 1, knife: 'peito' },
  { nome: 'manga longa verde', sex: 'M', skin: 'm_zedbody01_level1', layers: [J('#4a4030'), ['tshirt_longsleeve_white', '#556b47'], 'blackshoes'], hair: 'ponytail', hairColor: '#3a2a1c', blood: 1 },
  { nome: 'moletom e mochila', sex: 'F', skin: 'f_zedbody04_level2', layers: [J('#28384e'), T('#c9c2b0'), 'trainers_blue'], masks: ARMS, hair: 'long2', hairColor: '#7a3a22', wear: [['F_hoodie', 'hoodieup_white', '#b8a074']], pack: ['F_schoolbag', 'schoolbag_black'], blood: 2 },
  { nome: 'vestido curto',     sex: 'F', skin: 'f_zedbody01_level2', layers: [['dresssmall', '#4f7a4a'], 'trainers_red'], hair: 'overeye', hairColor: '#d0b060', blood: 1 },
  { nome: 'xadrez azul',       sex: 'M', skin: 'm_zedbody02_level2', layers: [J('#2b3b55'), 'shirt_lumberjackblue', 'brownshoes'], hair: 'messy', hairColor: '#8a8a80', blood: 2 },
  { nome: 'regata branca',     sex: 'M', skin: 'm_zedbody03_level1', layers: [J('#5a4a36'), ['clothingvest', '#d8d0bf'], 'trainers_white'], hair: 'crewcut', hairColor: '#4a3a2a', blood: 1 },
];
function knife() { if (MODELS.mesh.w_knife) { const w = weapon('w_knife', 'huntingknife', 1); w.rotation.x = Math.PI; w.position.z = .07; const g = new THREE.Group(); g.add(w); return g; }
  const g = new THREE.Group(), L = (w, h, d, c) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color: c }));
  const hd = L(.016, .016, .06, '#2a2420'); hd.position.z = .03; g.add(hd); const bl = L(.004, .018, .05, '#c9ccd0'); bl.position.z = -.02; g.add(bl); return g; }
// i = índice (0..N): escolhe o modelo base intercalado; extra = sobrescreve campos (ex.: { knife: 'costas' })
export function zumbiPZ(i, scene, extra = {}) { const base = ZUMBIS[i % ZUMBIS.length], o = Object.assign({}, base, { zombie: true, seed: i * 11 }, extra), h = humanPZ(o, scene);
  if (o.knife) { const k = knife(), back = o.knife === 'costas'; k.position.set(back ? .035 : -.04, back ? .69 : .7, back ? .1 : -.09); k.rotation.set(back ? -.3 : .25, back ? 0 : Math.PI, .25); h.pz.model.add(k); h.pz.bones.Bip01_Spine1.attach(k); h.knife = k; }
  return h; }

// ---------- ícones de itens do jogo (assets/items/Item_*.png, 32x32, arte original) ----------
// Declarar no cfg do episódio: window.__ITENS = ['Item_Hammer', ...]; o engine espera carregar antes do 1º quadro.
const ICON = {};
export function loadIcons(names = []) { return Promise.all(names.map(n => ICON[n] ? 1 : new Promise(res => { const im = new Image(); im.onload = () => { const t = new THREE.Texture(im); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true; ICON[n] = t; res(); };
  im.onerror = () => { console.error('pz: ícone de item não existe: ' + n); res(); }; im.src = `./assets/items/${n}.png`; }))); }
// ícone flutuando na cena (sempre de frente para a câmera). size = altura em unidades do mundo
export function icon3d(name, size = .7) { const t = ICON[name]; if (!t) throw new Error('pz: ícone não carregado (faltou em window.__ITENS): ' + name);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false })); sp.scale.setScalar(size); sp.renderOrder = 50; return sp; }

export { THREE, MODELS, IMG };

// ---------- animais da Build 42 (malhas originais do jogo, pose de repouso) ----------
// As texturas dos animais ficam nos pacotes de textura do jogo; até extraí-las, pintamos com cores do jogo:
// corpo (body), pernas/bico (legs) abaixo de legH (fração da altura). Frente do animal = +z.
const ANIMAL = { a_hen: ['#efe9dc', '#d8a030', .28], a_rooster: ['#9a4a22', '#d8a030', .28], a_cow: ['#2b2623', '#2b2623', .3], a_sheep: ['#e6dcc6', '#3a302a', .32] };
export function animal(name, s = 1.94) { const m = MODELS.mesh[name], [cb, cl, lh] = ANIMAL[name]; const g0 = geom(name).clone(), p = g0.attributes.position;
  let ymax = 0; for (let i = 0; i < p.count; i++) ymax = Math.max(ymax, p.getY(i));
  const col = new Float32Array(p.count * 3), A = new THREE.Color(cb), B = new THREE.Color(cl);
  for (let i = 0; i < p.count; i++) { const c = p.getY(i) < ymax * lh ? B : A; col.set([c.r, c.g, c.b], i * 3); }
  g0.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const me = new THREE.Mesh(g0, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })); if (m.frame) me.applyMatrix4(M4(m.frame)); me.castShadow = true;
  const k = new THREE.Group(); k.scale.set(-s, s, s); k.add(me); const o = new THREE.Group(); o.add(k); return o; }
