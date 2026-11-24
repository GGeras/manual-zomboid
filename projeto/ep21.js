// EP 21 — Coleta (B42.22) — RASCUNHO v3 (24/11, revisão do Bruno):
// • chão que piscava (asfalto × grama um em cima do outro) → floresta com UMA camada de chão (cenarios.floresta);
// • floresta do jogo: relva, manchas de terra, árvores (tronco + copa), arbustos, capim, plantas, pedras, galhos e tronco caído (sprites originais);
// • MODO DE BUSCA igual ao jogo (busca.js): fora do raio desfoca, tira cor e escurece (ISSearchManager.lua), olho em cima da cabeça,
//   marcadores do jogo (pinIcon*) nos itens que entram no raio; ele procura OLHANDO EM VOLTA devagar (S.olhar por cima da animação do jogo);
// • pegar frutinha: ARBUSTO do jogo com frutinhas (f_bushes_1_117 + _95) e a animação original de coleta (Bob_IdleForage);
// • Foco de Busca: a janela Investigar Área do jogo (no cfg, com a imagem da zona e o seletor).
// Regra 4.7: todo quadro termina com PZ.apoiar (pé no chão, joelho no chão quando agacha — nunca atravessa o piso).
import { THREE, PZ, pose, S, light, U } from './engine.js';
import { run } from './ep3d.js';
import { floresta, arbustoFruta, camOn as camOn0, clima, rota, VEL } from './cenarios.js';
import { rain } from './sets.js';
import { busca, pin, buscaOff, pinsAtivos } from './busca.js';
const { clamp, lerp, easeOut, ss } = U;
const camOn = (c, x, z, h, sy) => window.DBG ? camOn0(c, S.g.position.x, S.g.position.z, window.DBG, .5, .7) : camOn0(c, x, z, h, sy);
const ease = t => t * t * (3 - 2 * t);

const F = floresta(150, 150, { livre: [[3, 1]] }), C = F.C, A = (i, j) => C.at(i, j);
const BUSH = arbustoFruta(C, 3, 1), BU = A(3, 1);
S.g.traverse(o => { o.renderOrder = 2; });
const SY = .66;
// itens escondidos no mato (marcador do jogo + ícone do item)
const P = {
  galho: [pin(A(-2, -2).x, A(-2, -2).z, 'ForestGoods', 'Item_Twigs'), pin(A(2, -3).x, A(2, -3).z, 'ForestGoods', 'Item_Twigs'), pin(A(-4, 1).x, A(-4, 1).z, 'ForestGoods', 'Item_Twigs')],
  pedra: [pin(A(-3, 2).x, A(-3, 2).z, 'Stones', 'Item_Rock'), pin(A(4, -1).x, A(4, -1).z, 'Stones', 'Item_Rock')],
  fruta: [pin(BU.x + .1, BU.z + .45, 'Berries', 'Item_BerryBlue')],
  cogumelo: [pin(A(-1, 3).x, A(-1, 3).z, 'Mushrooms', 'Item_MushroomGeneric1'), pin(A(1.5, -2).x, A(1.5, -2).z, 'Mushrooms', 'Item_MushroomGeneric2')],
  inseto: [pin(A(.5, 4).x, A(.5, 4).z, 'Insects', 'Item_Cricket')],
};
const TODOS = Object.values(P).flat();
// personagem: animação do jogo + contato com o chão + olhar em volta (modo de busca)
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  S.olhar = o.olhar || 0; PZ.apoiar(S, 0); };
const olhando = lf => Math.sin(lf / 38) * .75 + Math.sin(lf / 91) * .25;   // devagar, de um lado para o outro
const andar = (pts, lf, nome = 's_walk', vel = VEL.s_walk, o = {}) => { const q = rota(pts, lf / 30, vel); clip(q.fim ? (o.parado || 's_idle') : nome, lf * (o.sp || 1), { x: q.x, z: q.z, ry: q.ry, olhar: o.olhar }); return q; };
const dia = (f, sol = .55) => { light('day'); clima('sol', sol); C.show(); F.vida(f); };   // v5: folhas e pólen no ar
const on = (lf, a, b = 1e9) => clamp((lf - a) / 12) * (1 - clamp((lf - b) / 12));

run([
  // 0 — o mato tem comida, você só não está vendo: anda pela clareira, nada marcado
  (lf, f, len, c) => { dia(f); buscaOff(); const q = andar([[A(-3, 2.5).x, A(-3, 2.5).z], [A(0, 0).x, A(0, 0).z]], lf);
    camOn(c, q.x + .3, q.z, lerp(10, 8.6, easeOut(lf / len)), SY); },
  // 1 — janela Investigar Área → Ativar Modo de Busca (ou tecla End): o efeito do jogo entra
  (lf, f, len, c) => { dia(f); const k = on(lf, len * .44); clip('s_idle', lf, { x: A(0, 0).x, z: A(0, 0).z, ry: .8, olhar: k * olhando(lf) * .8 });
    camOn(c, A(0, 0).x + .3, A(0, 0).z, 8.4, SY); pinsAtivos([]); busca(S, { on: k, R: 5, f: lf }); },
  // 2 — os itens aparecem dentro do raio: Coleta 0 = 3 quadrados … nível 10 = 10 (câmera abre junto)
  // 24/11 (pedido do Jose): o enquadramento ficava parado quase a cena toda — o zoom/abertura agora começa no meio da cena, não perto do fim
  (lf, f, len, c) => { dia(f); const g = ease(clamp((lf - len * .35) / 50)), R = lerp(3, 10, g);
    const q = andar([[A(-1, 1).x, A(-1, 1).z], [A(.5, -.5).x, A(.5, -.5).z]], lf, 's_walkslow', VEL.s_walkslow, { olhar: 0, parado: 's_idle' }); S.olhar = olhando(lf); PZ.apoiar(S, 0);
    camOn(c, q.x + .3, q.z, lerp(19, 23, g), .6); pinsAtivos(TODOS); busca(S, { on: 1, R, f: lf }); },
  // 3 — chuva, neblina, neve e escuro encolhem o círculo
  (lf, f, len, c) => { light('dawn'); clima('chuva', .9); C.show(); rain(A(0, 0).x, A(0, 0).z, f, 1); const g = ease(clamp((lf - len * .08) / 60)), R = lerp(6, 3, g);
    clip('s_idle', lf, { x: A(0, 0).x, z: A(0, 0).z, ry: .8, olhar: olhando(lf) }); camOn(c, A(0, 0).x + .3, A(0, 0).z, 15, .62); pinsAtivos(TODOS);
    busca(S, { on: 1, R, f: lf, dark: lerp(.15, .55, g) }); },
  // 4 — agachado acha um pouco mais; anda enquanto procura (andar em círculo não revela nada novo)
  (lf, f, len, c) => { dia(f); const circ = lf > len * .55; let q;
    if (!circ) q = andar([[A(-2, 2).x, A(-2, 2).z], [A(1, 0).x, A(1, 0).z]], lf, 's_sneak', VEL.s_sneak, { sp: .8 });
    else { const a = (lf - len * .55) / 30 * 1.4, cx = A(1, 0).x - .6, cz = A(1, 0).z; clip('s_sneak', lf * .8, { x: cx + Math.cos(a) * .6, z: cz + Math.sin(a) * .6, ry: Math.atan2(-Math.sin(a), Math.cos(a)) }); q = S.g.position; }
    S.olhar = olhando(lf) * .7; PZ.apoiar(S, 0); camOn(c, q.x + .3, q.z, 12, .62); pinsAtivos(TODOS); busca(S, { on: 1, R: circ ? 6.5 : lerp(5.5, 6.5, clamp(lf / 40)), f: lf }); },
  // 5 — cada lugar tem o seu: galho/lenha na floresta, pedra (estrada), frutinha e cogumelo, inseto (mais à noite)
  (lf, f, len, c) => { dia(f); const q = andar([[A(-2, -1).x, A(-2, -1).z], [A(1, 1).x, A(1, 1).z]], lf, 's_walkslow', VEL.s_walkslow, { parado: 's_idle' }); S.olhar = olhando(lf); PZ.apoiar(S, 0);
    camOn(c, q.x + .3, q.z, 16, .6); const seq = [P.galho, P.pedra, P.fruta.concat(P.cogumelo), P.inseto]; const ate = Math.floor(clamp(lf / len) * 4.2);
    pinsAtivos(seq.slice(0, ate + 1).flat()); busca(S, { on: 1, R: 7, f: lf }); },
  // 6 — frutinha pode envenenar: vai até o ARBUSTO do jogo, agacha e colhe (Bob_IdleForage); Herbalista sabe quais são seguras
  (lf, f, len, c) => { dia(f); const fr = { x: BU.x - .95, z: BU.z + .15 }, ch = 34;
    if (lf < ch) andar([[A(1, 1.2).x, A(1, 1.2).z], [fr.x, fr.z]], lf, 's_sneak', VEL.s_sneak, { sp: .8 });
    else clip('s_forage', 40 + (lf - ch), { x: fr.x, z: fr.z, ry: Math.PI / 2 });
    camOn(c, BU.x - .5, BU.z, 7.6, SY); pinsAtivos(P.fruta); busca(S, { on: 1, R: 5, f: lf }); },
  // 7 — tudo depende da estação; quer algo específico? Foco de Busca (janela do jogo no cfg)
  (lf, f, len, c) => { dia(f, .7); clip('s_idle', lf, { x: A(0, 0).x, z: A(0, 0).z, ry: .8, olhar: olhando(lf) * .6 }); camOn(c, A(0, 0).x + .3, A(0, 0).z, 9.2, SY);
    pinsAtivos(P.fruta); busca(S, { on: 1, R: 5, f: lf }); },
  // 8 — dia de sol, agachado e andando: o mato vira mercado
  (lf, f, len, c) => { dia(f, .8); const q = andar([[A(-3, 2).x, A(-3, 2).z], [A(1, -1).x, A(1, -1).z]], lf, 's_sneak', VEL.s_sneak, { sp: .8 }); S.olhar = olhando(lf) * .6; PZ.apoiar(S, 0);
    camOn(c, q.x + .3, q.z, 14, .6); pinsAtivos(TODOS); busca(S, { on: 1, R: lerp(6, 8, clamp(lf / len)), f: lf }); },
]);
