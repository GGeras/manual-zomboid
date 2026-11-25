// EP 23 — Carga e Peso (B42.22) — RASCUNHO v3 (24/11, Jose):
// • abertura: casa saqueada no fim da tarde (sol baixo pela janela, abajur aceso, lixo e papéis), personagem saqueando a estante e mochilas jogadas no chão;
// • corrida com peso: trote LENTO e pesado (Bob_Run original a 70%, corpo andando na mesma velocidade dos pés, sem deslizar) com zumbis atrás
//   ganhando pouco — ele corre só um pouco mais que eles (tensão); depois para ofegante;
// • mochilas: as 5 mochilas do jogo (malhas originais WorldItems/*_Ground) no chão e o personagem mexendo nelas, agachado;
// • Movimento Restrito: ele NÃO corre — anda (Bob_Walk na velocidade certa), olhando a horda atrás;
// • luz e ambiente em toda cena: rua com lixo do jogo, carro, cerca; casa com janelas, abajur e poeira no ar.
import { THREE, PZ, pose, S, Z, light, U } from './engine.js';
import { run } from './ep3d.js';
import { rua, casaDentro, luzInterior, camOn as camOn0, clima, clarao, tileLuz } from './cenarios.js';
const { clamp, lerp } = U;
const camOn = (c, x, z, h, sy) => window.DBG ? camOn0(c, S.g.position.x, S.g.position.z, window.DBG, .5, .7) : camOn0(c, x, z, h, sy);

const RUA = rua(300, 0), RC = RUA.C, R = RC.at;
[['trash_01_27', -3, -1.2], ['d_trash_1_9', 2, 2.3], ['trash_01_24', 6, -1.3], ['trash_01_33', -7, 2.4], ['d_trash_1_13', 9, 2.2], ['trash_01_18', 12, -1.4], ['d_trash_1_0', 15, 2.3]].forEach(([n, i, j]) => RC.placa(n, i, j));
const CASA = casaDentro(-60, 80, { completa: true }), KC = CASA.C, K = KC.at;
[['trash_01_27', 3.2, 2.6], ['d_trash_1_9', 6.0, 2.9], ['d_trash_1_13', 1.6, 6.2], ['trash_01_33', 8.2, 6.4]].forEach(([n, i, j]) => KC.placa(n, i, j));
const TARDE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
// mochilas originais do jogo no chão da sala (malha do jogo + textura do jogo); [malha, textura, i, j, giro]
const BAGS = [['bag_duffel', 'duffelbaggreen', 2.35, 5.55, .4], ['bag_school', 'schoolbag_black', 3.05, 5.95, -.3], ['bag_hiking', 'hikingbaggreen', 3.75, 5.65, 1.2],
  ['bag_bighiking', 'bighikingbaggreen', 2.55, 6.45, 2.1], ['bag_alice', 'alicepack_green', 3.6, 6.5, -1.0]];
// a malha da Bolsa de Viagem vem em pé (eixo longo vertical): deita como no chão do jogo
const BAGM = BAGS.map(([m, t, i, j, r]) => { const me = PZ.propMesh(m, t), g = new THREE.Group(); g.add(me); if (m === 'bag_duffel') me.rotation.x = -Math.PI / 2;
  me.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(me); me.position.y -= bb.min.y; g.position.set(i, .03, j); g.rotation.y = r; me.castShadow = true; KC.G.add(g); return g; });
S.g.traverse(o => { o.renderOrder = 2; });
const PX7 = 5.0, PZ7 = 3.7;
const SY = .62, FRENTE = .9;   // ry que deixa o personagem de frente para a câmera (EP22: cozinha)
// velocidades medidas nos clipes do jogo (o corpo anda junto com os pés: sem deslizar)
// medido no pé de apoio dos clipes (pipeline: /tmp/speed) e calibrado pelo s_walk ≈ 1,35 do cenarios.rota
const V_SPRINT = 2.8, V_WALK = 1.35, V_SLOW = .75, V_ZS = 1.78;

const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: Math.PI / 2, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  S.olhar = 0; PZ.apoiar(S, o.base ?? 0); };
const zClip = (z, name, lf, o = {}) => { pose(z, Object.assign({ clip: [name, lf, o.loop !== false] }, o)); PZ.apoiar(z, 0); };
const rua0 = (k = 'dawn') => { light(k); clima('', 0); RC.show(); clarao(0); tileLuz('#fff0dc'); };
const casa0 = f => { light('dawn'); clima('', 0); KC.show(); TARDE.set(f); clarao(0); tileLuz('#fff2e0'); };
// perseguidores: corpo e pés na mesma velocidade (sem deslizar). x = posição do personagem; gap = distância do 1º zumbi até ele; os outros ficam atrás (+0,9 m cada).
// só corredores (z_sprint 1,78 m/s): a distância muda com o tempo, então o chamador passa o gap já calculado.
const atras = (f, x, z, gap, n = 3) => { for (let i = 0; i < n; i++)
  zClip(Z[i], 'z_sprint', f + i * 5, { x: x - gap - i * .95, z: z + (i % 2 ? .45 : -.4), ry: Math.PI / 2 }); };
// perseguição que se fecha: personagem a V (m/s) termina em xEnd; zumbi a V_ZS termina a gapEnd dele (o take troca quando está QUASE alcançando)
const perseg = (lf, len, xEnd, V, gapEnd, z) => { const r = (len - lf) / 30, x = xEnd - V * r, gap = gapEnd + (V_ZS - V) * r; return { x, z, gap }; };

run([
  // 0 — "Pegar tudo que vê...": sala saqueada no fim da tarde; ele enche a mochila na estante
  (lf, f, len, c) => { casa0(f); const p = K(1.05, .95);
    clip(lf % 90 < 60 ? 's_lootlow' : 's_makinglow', lf % 90, { x: p.x, z: p.z, ry: Math.PI });
    const k = lf / len; camOn(c, lerp(p.x + 1.4, p.x + .7, k), lerp(p.z + 1.2, p.z + .6, k), lerp(7.6, 6.2, k), SY); },
  // 1 — "Força e moodles": em pé, ofegante, carregado
  (lf, f, len, c) => { casa0(f); const p = K(2.2, 2.2); clip(lf < 40 ? 's_idle' : 's_breath', lf, { x: p.x, z: p.z, ry: FRENTE }); camOn(c, p.x + .3, p.z, 6.4, SY); },
  // 2 — sobrecarga: ele está PESADO, então anda curvado e lento (Bob_Walk 1,35 m/s); os zumbis correm (1,78 m/s) um pouco mais rápido e se aproximam;
  //     o take acaba quando o primeiro está quase nele
  (lf, f, len, c) => { rua0(); const q = perseg(lf, len, 7, V_WALK, .85, R(0, 1.2).z);
    clip('s_walk', lf, { x: q.x, z: q.z }); atras(f, q.x, q.z, q.gap); camOn(c, q.x - .9, q.z, 7.6, .6); },
  // 3 — costas e cerca: de costas, curvado, anda devagar até a cerca branca do quintal (a mesma da rua); chega, para ofegante e encara a cerca alta sem conseguir passar
  (lf, f, len, c) => { rua0(); const k = .6, z = R(0, -.2).z, x1 = R(-7.2, 0).x, x0 = x1 - V_SLOW * len * k / 30;
    if (lf < len * k) { const x = x0 + V_SLOW * lf / 30; clip('s_walkslow', lf, { x, z, ry: Math.PI / 2 }); camOn(c, x + .1, z - .1, 5.4, SY); }
    else { clip('s_breath', lf, { x: x1, z, ry: Math.PI }); camOn(c, x1 + .1, z - .5, lerp(5.4, 4.6, clamp((lf - len * k) / (len * .4))), SY); } },
  // 4 — "a solução é mochila — vestida": ele larga as sacolas e confere a mochila nas costas
  (lf, f, len, c) => { casa0(f); BAGM.forEach(m => m.visible = true); const p = K(3.0, 4.9);
    clip(lf < len * .55 ? 's_lootlow' : 's_idle', lf, { x: p.x, z: p.z, ry: 0 }); camOn(c, p.x + .1, p.z + .5, 5.6, SY); },
  // 5 — as 5 mochilas do jogo no chão; ele agachado mexendo nelas (tabela no cfg)
  (lf, f, len, c) => { casa0(f); BAGM.forEach(m => m.visible = true); const p = K(3.05, 4.85), q = Math.floor(lf / 80) % 3;
    const ry = [-.5, 0, .6][q]; clip(q === 1 ? 's_makinglow' : 's_lootlow', lf % 80, { x: p.x, z: p.z, ry });
    camOn(c, p.x + .15, p.z + .75, 5.2, .66); },
  // 6 — Movimento Restrito: NÃO corre — só anda (Bob_Walk 1,35 m/s); a horda corre e fecha o cerco, take troca quando está quase nele
  (lf, f, len, c) => { rua0(); const q = perseg(lf, len, 8, V_WALK, 1.1, R(0, 1.2).z);
    clip('s_walk', lf, { x: q.x, z: q.z }); atras(f, q.x, q.z, q.gap); camOn(c, q.x - .9, q.z, 7.6, .6); },
  // 7 — traços: em casa, alonga e respira
  (lf, f, len, c) => { casa0(f); BAGM.forEach(m => m.visible = true); const p = K(PX7, PZ7);
    clip(lf < 70 ? 's_stretch' : 's_idle', lf, { x: p.x, z: p.z, ry: FRENTE, loop: lf >= 70 }); camOn(c, p.x, p.z, 6.0, SY); },
  // 8 — mochila nas costas, só o necessário: corre em disparada (2,8 m/s) e deixa os zumbis (1,78 m/s) para trás
  (lf, f, len, c) => { rua0(); const r = (len - lf) / 30, x = 8 - V_SPRINT * r, z = R(0, 1.2).z, gap = 2.4 + (V_SPRINT - V_ZS) * (lf / 30);
    clip(lf < 10 ? 's_run' : 's_sprint', lf, { x, z }); atras(f, x, z, gap, 3); camOn(c, x - .7, z, 7.4, SY); },
]);
