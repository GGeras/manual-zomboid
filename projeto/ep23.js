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
[['trash_01_27', 3.2, 2.6], ['d_trash_1_9', 5.0, 3.6], ['d_trash_1_13', 1.6, 6.2], ['trash_01_33', 8.2, 6.4]].forEach(([n, i, j]) => KC.placa(n, i, j));
const TARDE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
// mochilas originais do jogo no chão da sala (malha do jogo + textura do jogo); [malha, textura, i, j, giro]
const BAGS = [['bag_duffel', 'duffelbaggreen', 2.35, 5.55, .4], ['bag_school', 'schoolbag_black', 3.05, 5.95, -.3], ['bag_hiking', 'hikingbaggreen', 3.75, 5.65, 1.2],
  ['bag_bighiking', 'bighikingbaggreen', 2.55, 6.45, 2.1], ['bag_alice', 'alicepack_green', 3.6, 6.5, -1.0]];
// a malha da Bolsa de Viagem vem em pé (eixo longo vertical): deita como no chão do jogo
const BAGM = BAGS.map(([m, t, i, j, r]) => { const me = PZ.propMesh(m, t), g = new THREE.Group(); g.add(me); if (m === 'bag_duffel') me.rotation.x = -Math.PI / 2;
  me.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(me); me.position.y -= bb.min.y; g.position.set(i, .03, j); g.rotation.y = r; me.castShadow = true; KC.G.add(g); return g; });
S.g.traverse(o => { o.renderOrder = 2; });
const SY = .62;
// velocidades medidas nos clipes do jogo (o corpo anda junto com os pés: sem deslizar)
// medido no pé de apoio dos clipes (pipeline: /tmp/speed) e calibrado pelo s_walk ≈ 1,35 do cenarios.rota
const V_RUN = 2.4, V_SPRINT = 2.8, V_WALK = 1.35, V_SLOW = .75, V_ZW = .85, V_ZS = 1.78;

const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: Math.PI / 2, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  S.olhar = 0; PZ.apoiar(S, o.base ?? 0); };
const zClip = (z, name, lf, o = {}) => { pose(z, Object.assign({ clip: [name, lf, o.loop !== false] }, o)); PZ.apoiar(z, 0); };
const rua0 = (k = 'dawn') => { light(k); clima('', 0); RC.show(); clarao(0); tileLuz('#fff0dc'); };
const casa0 = f => { light('dawn'); clima('', 0); KC.show(); TARDE.set(f); clarao(0); tileLuz('#fff2e0'); };
// perseguidores: corpo e pés na mesma velocidade (sem deslizar). Corredores (z_sprint a "rz" da velocidade) logo atrás; andarilhos bem atrás.
// x0 = onde ele começou; gap0 = distância inicial; rz = ritmo dos corredores (1 = 1,78 m/s)
const atras = (f, lf, x0, z, gap0, rz, n = 5) => { for (let i = 0; i < n; i++) { const runr = i < 2;
  if (runr) zClip(Z[i], 'z_sprint', f * rz + i * 5, { x: x0 - gap0 - i * .9 + lf / 30 * V_ZS * rz, z: z + (i % 2 ? .45 : -.4), ry: Math.PI / 2 });
  else zClip(Z[i], 'z_walk3', f * .95 + i * 9, { x: x0 - gap0 - 2.5 - (i - 2) * 1.1 + lf / 30 * V_ZW * .95, z: z + ((i % 2) ? .6 : -.5), ry: Math.PI / 2 }); } };

run([
  // 0 — "Pegar tudo que vê...": sala saqueada no fim da tarde; ele enche a mochila na estante
  (lf, f, len, c) => { casa0(f); const p = K(1.05, .95);
    clip(lf % 90 < 60 ? 's_lootlow' : 's_makinglow', lf % 90, { x: p.x, z: p.z, ry: Math.PI });
    const k = lf / len; camOn(c, lerp(p.x + 1.4, p.x + .7, k), lerp(p.z + 1.2, p.z + .6, k), lerp(7.6, 6.2, k), SY); },
  // 1 — "Força e moodles": em pé, ofegante, carregado
  (lf, f, len, c) => { casa0(f); const p = K(2.2, 2.2); clip(lf < 40 ? 's_idle' : 's_breath', lf, { x: p.x, z: p.z, ry: 2.4 }); camOn(c, p.x + .3, p.z, 6.4, SY); },
  // 2 — sobrecarga: trote PESADO (Bob_Run a 76%: passos curtos, 1,8 m/s) e os zumbis correndo logo atrás, só um pouco mais lentos (tensão)
  (lf, f, len, c) => { rua0(); const x0 = R(-1, 1.2).x, x = x0 + lf / 30 * V_RUN * .76, z = R(0, 1.2).z;
    clip('s_run', lf * .76, { x, z }); atras(f, lf, x0, z, 2.6, .88); camOn(c, x - 1.1, z, 7.6, .6); },
  // 3 — costas e cerca: anda devagar, curvado, até a cerca do quintal
  (lf, f, len, c) => { rua0(); const l = Math.min(lf, len * .7), x = R(1, 1.2).x + l / 30 * V_SLOW, z = R(0, 1.2).z;
    if (lf < len * .7) clip('s_walkslow', lf, { x, z }); else clip('s_breath', lf, { x, z, ry: Math.PI });
    camOn(c, x + .2, z - .2, 6.2, SY); },
  // 4 — "a solução é mochila — vestida": ele larga as sacolas e confere a mochila nas costas
  (lf, f, len, c) => { casa0(f); BAGM.forEach(m => m.visible = true); const p = K(3.0, 4.9);
    clip(lf < len * .55 ? 's_lootlow' : 's_idle', lf, { x: p.x, z: p.z, ry: 0 }); camOn(c, p.x + .1, p.z + .5, 5.6, SY); },
  // 5 — as 5 mochilas do jogo no chão; ele agachado mexendo nelas (tabela no cfg)
  (lf, f, len, c) => { casa0(f); BAGM.forEach(m => m.visible = true); const p = K(3.05, 4.85), q = Math.floor(lf / 80) % 3;
    const ry = [-.5, 0, .6][q]; clip(q === 1 ? 's_makinglow' : 's_lootlow', lf % 80, { x: p.x, z: p.z, ry });
    camOn(c, p.x + .15, p.z + .75, 5.2, .66); },
  // 6 — Movimento Restrito: NÃO consegue correr em disparada — só o trote normal (Bob_Run na velocidade dos pés), horda atrás
  (lf, f, len, c) => { rua0(); const x0 = R(0, 1.2).x, x = x0 + lf / 30 * V_RUN * .85, z = R(0, 1.2).z;
    clip('s_run', lf * .85, { x, z }); atras(f, lf, x0, z, 3.0, 1.0); camOn(c, x - 1.1, z, 7.6, .6); },
  // 7 — traços: em casa, alonga e respira
  (lf, f, len, c) => { casa0(f); BAGM.forEach(m => m.visible = true); const p = K(6.6, 2.6);
    clip(lf < 70 ? 's_stretch' : 's_idle', lf, { x: p.x, z: p.z, ry: 2.2, loop: lf >= 70 }); camOn(c, p.x, p.z, 6.0, SY); },
  // 8 — mochila nas costas, só o necessário: corre em disparada e deixa os zumbis para trás
  (lf, f, len, c) => { rua0(); const x0 = R(0, 1.2).x, x = x0 + lf / 30 * V_SPRINT, z = R(0, 1.2).z;
    clip(lf < 10 ? 's_run' : 's_sprint', lf, { x, z }); atras(f, lf, x0, z, 2.4, 1.0, 4); camOn(c, x - .9, z, 7.4, SY); },
]);
