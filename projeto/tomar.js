// tomar.js — TOMAR COMPRIMIDO (25/11, revisão do EP22). Base: Bob_IdleTakePills só do tronco para cima (as pernas ficam na respiração,
// com os pés plantados — na animação inteira o corpo anda no lugar e parecia flutuar). Uma mão segura o frasco EM PÉ o tempo todo;
// a outra mexe na tampa, leva o comprimido à boca (cabeça inclina para trás) e volta.
import { THREE } from './engine.js';
import { gira, ik, tronco } from './empunhar.js';
const V = THREE.Vector3, Q = THREE.Quaternion, M = THREE.Matrix4;
const P = (B, n) => new V().setFromMatrixPosition(B[n].matrixWorld);
const suave = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const janela = (f, a, b, c, d) => Math.min(suave((f - a) / (b - a)), 1 - suave((f - c) / (d - c)));
export const DUR = 101;
// quadro da animação do jogo para o quadro f da cena: sobe até a boca (0..68) e volta pelo mesmo caminho (sem o gesto de jogar fora)
export const quadroPills = f => f < 40 ? f : f < 66 ? 40 + (f - 40) * (24 / 26) : f < 74 ? 64 : Math.max(0, 64 - (f - 74) * (64 / 27));
export const MAO = { g: [.07, -.31, .31], boca: [-.01, .11, .162], tampa: [.04, -.22, .32], giro: .8, cabeca: .22, y: .18,
  ponta: 1.45, dirTampa: [.75, -.1, .65], dirBoca: [.55, .72, -.42], arco: .07 };
export function tomarRemedio(h, frasco, pega) { const B = h.pz.bones, escala = frasco.scale.clone();
  return f => { pega.preparar(); h.posClip = () => { const T = tronco(h);
    // cabeça para trás na hora de engolir
    const k = janela(f, 54, 66, 72, 84);
    if (k > 0) { gira(B.Bip01_Neck, new Q().setFromAxisAngle(T.right, MAO.cabeca * .4 * k)); gira(B.Bip01_Head, new Q().setFromAxisAngle(T.right, MAO.cabeca * .6 * k)); }
    // mão da boca (v8): do começo ao fim é guiada aqui (a pose do clipe enfiava a mão no queixo). Os DEDOS param na frente dos lábios:
    // a ponta vai ao ponto 'boca' (medido a partir do osso da cabeça) e a mão chega de baixo, apontada para cima — o punho fica fora do rosto.
    const wL = janela(f, 4, 18, 86, 99);
    if (wL > .001) { const H = B.Bip01_L_Hand, pu = P(B, 'Bip01_L_Hand'), dedo = P(B, 'Bip01_L_Finger1').sub(pu), alcance = dedo.length() * MAO.ponta, dAtual = dedo.normalize();
      const rel = a => new V().addScaledVector(T.right, a[0]).addScaledVector(T.up, a[1]).addScaledVector(T.fwd, a[2]).normalize();
      const boca = P(B, 'Bip01_Head').add(new V().addScaledVector(T.right, MAO.boca[0]).addScaledVector(T.up, MAO.boca[1]).addScaledVector(T.fwd, MAO.boca[2])
        .applyQuaternion(new Q().setFromAxisAngle(T.right, MAO.cabeca * k)));
      const m = suave(k), d = rel(MAO.dirTampa).lerp(rel(MAO.dirBoca), m).normalize();
      const alvo = T.at(MAO.tampa).lerp(boca, m).addScaledVector(T.fwd, MAO.arco * Math.sin(Math.PI * m));   // sobe fazendo um arco para a frente
      const punho = alvo.addScaledVector(d, -alcance), polo = T.up.clone().negate().addScaledVector(T.right, -.7).addScaledVector(T.fwd, .15);
      ik(B, 'L', pu.clone().lerp(punho, wL), polo);
      const agora = P(B, 'Bip01_L_Finger1').sub(P(B, 'Bip01_L_Hand')).normalize();
      gira(H, new Q().setFromUnitVectors(agora, d), wL); }
    // mão do frasco
    const w = janela(f, 2, 16, 84, 99), baixo = T.up.clone().negate();
    pega.segurar('R', T.at(MAO.g), new V(0, 1, 0), baixo.addScaledVector(T.right, .9).addScaledVector(T.fwd, -.35), w, MAO.giro);
    // frasco EM PÉ preso na mão (pega perto do fundo: a tampa aparece acima dos dedos)
    if (!frasco.visible) return;
    const pai = frasco.parent; frasco.position.set(0, 0, 0); frasco.quaternion.identity(); frasco.scale.copy(escala); frasco.updateMatrix(); frasco.updateWorldMatrix(true, false);
    const s = new V(); frasco.matrixWorld.decompose(new V(), new Q(), s);
    // a malha PillBottle é deitada no eixo z (comprimento .11, diâmetro .079): gira para ficar em pé, tampa para cima
    const a = Math.abs(s.y), comp = .11 * a, C = pega.ponto('R'); C.y += comp * (.5 - MAO.y);
    const q = new Q().setFromAxisAngle(new V(0, 1, 0), h.g.rotation.y).multiply(new Q().setFromAxisAngle(new V(1, 0, 0), -Math.PI / 2));
    const e = new V(-a, a, a), centro = new V(0, .0397, 0).multiply(e).applyQuaternion(q), W = new M().compose(C.sub(centro), q, e);
    new M().copy(pai.matrixWorld).invert().multiply(W).decompose(frasco.position, frasco.quaternion, frasco.scale); frasco.updateMatrix(); frasco.matrixWorld.multiplyMatrices(pai.matrixWorld, frasco.matrix);
  }; }; }
