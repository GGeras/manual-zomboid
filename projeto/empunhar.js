// empunhar.js — ferramentas de braço/mão (25/11, EP22): IK de 2 ossos, referencial do tronco e MÃO FECHADA em volta de um cilindro (frasco do
// tomar.js). A orientação da mão/dedos é copiada do golpe do jogo (Bob_Attack2H_Heavy01_Hit, quadro 25), medida no cabo do machado.
// O machado em si usa a pegada do próprio jogo (ver GUARDA no ep22.js).
import { THREE, PZ } from './engine.js';
const V = THREE.Vector3, Q = THREE.Quaternion;
const Y0 = -.02, Y1 = .34;                       // malha FireAxe: ponta do cabo → cabeça (eixo +y); lâmina para −z
const P = (B, n) => new V().setFromMatrixPosition(B[n].matrixWorld);
const wq = o => o.getWorldQuaternion(new Q());
// gira um osso no MUNDO (em volta da própria junta) e atualiza os filhos
export function gira(b, q, w = 1) { const pq = wq(b.parent), alvo = pq.invert().multiply(q.clone().multiply(wq(b))); b.quaternion.slerp(alvo, w);
  b.updateMatrix(); b.matrixWorld.multiplyMatrices(b.parent.matrixWorld, b.matrix); b.children.forEach(c => c.updateMatrixWorld(true)); }
// leva o punho (mão) até o alvo T com o cotovelo apontando para 'polo'
export function ik(B, L, T, polo) { const U = B[`Bip01_${L}_UpperArm`], F = B[`Bip01_${L}_Forearm`], H = `Bip01_${L}_Hand`;
  const s = P(B, U.name), e = P(B, F.name), h = P(B, H), a = e.distanceTo(s), b = h.distanceTo(e);
  const d = Math.min(a + b - 1e-3, Math.max(Math.abs(a - b) + 1e-3, T.distanceTo(s)));
  const dir = T.clone().sub(s).normalize(), cos = (a * a + d * d - b * b) / (2 * a * d), sen = Math.sqrt(Math.max(0, 1 - cos * cos));
  const lado = polo.clone().addScaledVector(dir, -polo.dot(dir)).normalize();
  const e2 = s.clone().addScaledVector(dir, a * cos).addScaledVector(lado, a * sen);
  gira(U, new Q().setFromUnitVectors(e.sub(s).normalize(), e2.clone().sub(s).normalize()));
  const e3 = P(B, F.name), h3 = P(B, H), t3 = s.clone().addScaledVector(dir, d);
  gira(F, new Q().setFromUnitVectors(h3.sub(e3).normalize(), t3.sub(e3).normalize())); }

// referencial do tronco: at([lado direito, acima, à frente]) a partir do meio dos ombros
export function tronco(h) { const B = h.pz.bones, sr = P(B, 'Bip01_R_UpperArm'), sl = P(B, 'Bip01_L_UpperArm'), C = sr.clone().add(sl).multiplyScalar(.5);
  const up = P(B, 'Bip01_Neck').sub(P(B, 'Bip01_Pelvis')).normalize(), right = sr.clone().sub(sl); right.addScaledVector(up, -right.dot(up)).normalize();
  const fwd = new V().crossVectors(up, right).normalize(); if (fwd.dot(new V(Math.sin(h.g.rotation.y), 0, Math.cos(h.g.rotation.y))) < 0) fwd.negate();
  return { up, right, fwd, at: a => C.clone().addScaledVector(right, a[0]).addScaledVector(up, a[1]).addScaledVector(fwd, a[2]) }; }
// MACHADO DA GUARDA (v8): quando o tronco usa um quadro do golpe por cima de outras pernas, o osso da arma não acompanha a mão. Aqui o machado
// fica em relação à mão exatamente como no quadro inteiro do jogo. prender(clip, f) → chamar FORA do sync; devolve a função para o posClip.
export function machadoNaMao(h, axe) { const B = h.pz.bones, MEM = {}, M = THREE.Matrix4, base = axe.scale.clone();
  const solta = () => { axe.position.set(0, 0, 0); axe.quaternion.identity(); axe.scale.copy(base); axe.updateMatrix(); };
  const prender = (clip, f) => { const chave = clip + ':' + f; if (!MEM[chave]) { const g = h.g, antes = [h.clip, h.posClip, g.visible]; h.posClip = null; g.visible = true; h.clip = [clip, f, false]; solta(); PZ.sync(h);
      axe.updateWorldMatrix(true, false); MEM[chave] = new M().copy(B.Bip01_R_Hand.matrixWorld).invert().multiply(axe.matrixWorld); [h.clip, h.posClip, g.visible] = antes; }
    return () => { const pai = axe.parent, W = new M().multiplyMatrices(B.Bip01_R_Hand.matrixWorld, MEM[chave]);
      new M().copy(pai.matrixWorld).invert().multiply(W).decompose(axe.position, axe.quaternion, axe.scale); axe.updateMatrix(); axe.matrixWorld.multiplyMatrices(pai.matrixWorld, axe.matrix); }; };
  return { solta, prender }; }

export function empunhadura(h, axe) { const B = h.pz.bones, escala = axe.scale.clone(); let REF = null;
  const dedos = L => Object.keys(B).filter(n => n.startsWith(`Bip01_${L}_Finger`));
  // referência: no quadro 25 do golpe do jogo as DUAS mãos envolvem o cabo
  function ref() { const g = h.g, antes = [h.clip, h.posClip]; h.posClip = null; const vis = g.visible; g.visible = true; h.clip = ['s_attack2h', 25, false]; PZ.sync(h);
    axe.position.set(0, 0, 0); axe.quaternion.identity(); axe.scale.copy(escala); axe.updateMatrix(); axe.updateWorldMatrix(true, false);
    const a = new V(0, Y0, 0).applyMatrix4(axe.matrixWorld), b = new V(0, Y1, 0).applyMatrix4(axe.matrixWorld), dir = b.sub(a).normalize(), r = {};
    for (const L of ['R', 'L']) { const H = B[`Bip01_${L}_Hand`], hp = P(B, H.name), palma = hp.clone().lerp(P(B, `Bip01_${L}_Finger1`), .8);
      const eixo = a.clone().addScaledVector(dir, palma.clone().sub(a).dot(dir)), inv = wq(H).invert();
      r[L] = { off: eixo.lerp(palma, .25).sub(hp).applyQuaternion(inv), dir: dir.clone().applyQuaternion(inv), dedos: dedos(L).map(n => [n, B[n].quaternion.clone()]) }; }
    [h.clip, h.posClip] = antes; g.visible = vis; return r; }
  // mão L envolvendo o cabo no ponto G (direção d)
  function pega(L, G, d, polo, w, giro = 0) { const U = B[`Bip01_${L}_UpperArm`], F = B[`Bip01_${L}_Forearm`], H = B[`Bip01_${L}_Hand`], R = REF[L];
    const orig = [U, F, H].map(b => b.quaternion.clone()); let q = new Q().setFromAxisAngle(d, giro).multiply(wq(H));
    for (let k = 0; k < 4; k++) { q = new Q().setFromUnitVectors(R.dir.clone().applyQuaternion(q), d).multiply(q);
      ik(B, L, G.clone().sub(R.off.clone().applyQuaternion(q)), polo); gira(H, q.clone().multiply(wq(H).invert())); q = wq(H); }
    [U, F, H].forEach((b, i) => { const novo = b.quaternion.clone(); b.quaternion.copy(orig[i]).slerp(novo, w); });
    R.dedos.forEach(([n, qd]) => B[n].quaternion.slerp(qd, w));
    U.updateMatrix(); U.matrixWorld.multiplyMatrices(U.parent.matrixWorld, U.matrix);
    [U, F, H, ...dedos(L).map(n => B[n])].forEach(b => b.updateMatrix()); U.updateMatrixWorld(true); }
  const api = {};
  api.preparar = () => { if (!REF) REF = ref(); };   // medir a pegada ANTES do quadro (nunca de dentro do sync)
  api.ponto = L => { const H = B[`Bip01_${L}_Hand`]; return P(B, H.name).add(REF[L].off.clone().applyQuaternion(wq(H))); };   // onde está o objeto na mão L agora
  api.segurar = pega;                                // mão L fechada em volta de um objeto cilíndrico: segurar(L, ponto, eixo, polo, peso, giro)
  return api; }
