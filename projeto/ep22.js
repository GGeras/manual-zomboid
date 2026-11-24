// EP 22 — Fadiga Muscular (B42.22) — RASCUNHO v3 (24/11, Jose):
// • arma = MACHADO do jogo (malha FireAxe.x, ícone Item_Axe é o mesmo machado vermelho) em TODAS as cenas — o ícone e a habilidade (Machados) batem com a mão;
// • animações originais de arma pesada de duas mãos: Bob_Idle2H_Heavy, Bob_Attack2H_Heavy01_Hit, Bob_Run2H_Heavy/Bob_Sprint2H_Heavy, Bob_Walk2H_Heavy,
//   Bob_AttackFloorStamp_2Hheavy (pisão), Bob_Idle_HeavyBreathing_2Hheavy, Bob_EmotePainRightArm2H/Torso2H;
// • zumbi: morte do golpe com Zombie_HitDeath_HeadLeft tocada a 70% (mais quadros, queda mais fluida); pisão em zumbi DEITADO (Zombie_Idle_FloorOnBack)
//   no lugar exato do pé, com reação da cabeça (Zombie_HeadReact_OnBack01) no impacto;
// • corrida: horda vindo de longe pela rua (fim de tarde), justificando correr; rua com lixo e papéis do jogo;
// • ninguém atravessa o chão (regra 4.7): de pé/andando = PZ.apoiar(S, 0).
import { THREE, PZ, pose, S, Z, light, splat, U } from './engine.js';
import { run } from './ep3d.js';
import { rua, quarto, casaDentro, luzInterior, camOn as camOn0, clima, clarao, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut } = U;
const camOn = (c, x, z, h, sy) => window.DBG ? camOn0(c, S.g.position.x, S.g.position.z, window.DBG, .5, .7) : camOn0(c, x, z, h, sy);

const RUA = rua(300, 0), RC = RUA.C, R = RC.at;
[['trash_01_27', -3, -1.2], ['d_trash_1_9', 2, 2.3], ['trash_01_24', 6, -1.3], ['trash_01_33', -7, 2.4], ['d_trash_1_13', 9, 2.2], ['trash_01_18', 12, -1.4]].forEach(([n, i, j]) => RC.placa(n, i, j));
const Q = quarto(-120, 60, { cama: ['furniture_bedding_01_27', 'furniture_bedding_01_26'] }), QC = Q.C, A = QC.at;
QC.obj('furniture_storage_01_48', 3, 0, { w: .5, d: .45 });
[['trash_01_27', 1, 3.2], ['d_trash_1_9', 3.6, 1.6]].forEach(([n, i, j]) => QC.placa(n, i, j));
const MANHA = luzInterior(QC, { janelas: [['N', 4]], hora: 'tarde' });
const CASA = casaDentro(-60, 80, { completa: true }), KC = CASA.C, K = KC.at;
const TARDE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
const AXE = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_axe', 'fireaxe'));
S.g.traverse(o => { o.renderOrder = 2; });
const SY = .62, VRUN = 3.1, VWALK = 1.25;

const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: Math.PI / 2, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  AXE.visible = o.axe !== false; S.olhar = 0; (S.userData ??= {}).assento = o.assento; PZ.apoiar(S, o.base ?? 0); };
const zClip = (z, name, lf, o = {}) => { pose(z, Object.assign({ clip: [name, lf, o.loop !== false] }, o)); PZ.apoiar(z, 0); };
const rua0 = (f, k = 0) => { light('dawn'); clima('', 0); RC.show(); clarao(0); tileLuz('#fff0dc'); };
// golpe completo: zumbi chega andando, machado acerta no quadro H+18, zumbi cai em câmera lenta (70%) e fica no chão
const golpe = (lf, me, H, o = {}) => { const HIT = H + 18;
  if (lf >= H && lf < H + 76) clip('s_attack2h', lf - H, { x: me.x, z: me.z, loop: false }); else clip(o.cansado ? 's_breath2h' : 's_idle2h', lf, { x: me.x, z: me.z });
  const zx = me.x + 1.15, z0 = Z[0];
  if (lf < HIT) zClip(z0, 'z_walk', lf, { x: zx + (HIT - lf) * .016, z: me.z, ry: -Math.PI / 2 });
  else { const t = (lf - HIT) * .7; zClip(z0, 'z_deathleft', Math.min(t, 45), { x: zx, z: me.z, ry: -Math.PI / 2, loop: false }); if (lf > HIT + 40) splat(zx + .9, me.z + .2, .35 * clamp((lf - HIT - 40) / 20)); }
  return HIT; };
// pisão no zumbi deitado de costas: cabeça do zumbi exatamente sob o pé direito (pé avança ~0,55 m no Bob_AttackFloorStamp)
const pisao = (lf, me, H) => { const S0 = H, IMP = S0 + 13;
  if (lf >= S0 && lf < S0 + 38) clip('s_stomp2h', lf - S0, { x: me.x, z: me.z, loop: false }); else clip('s_idle2h', lf, { x: me.x, z: me.z });
  const hx = me.x + .42, hz = me.z + .06;   // cabeça
  if (lf >= IMP && lf < IMP + 11) zClip(Z[0], 'z_headreact_back', lf - IMP, { x: hx + .62, z: hz, ry: Math.PI / 2, loop: false }); else zClip(Z[0], 'z_floorback', lf * .5, { x: hx + .62, z: hz, ry: Math.PI / 2 });
  if (lf >= IMP) splat(hx + .05, hz, .3 * clamp((lf - IMP) / 8));
  return IMP; };
// horda vindo de longe pela rua (andando e alguns correndo)
const horda = (f, lf, x0, z0, n = 12, perto = 0) => { for (let i = 0; i < n; i++) { const fila = Math.floor(i / 4), lado = (i % 4) - 1.5, sprint = i < 3;
  const x = x0 - (perto + 3 + fila * 1.6 + (i % 2) * .5) + (sprint ? lf * .035 : lf * .012), z = z0 + lado * .55 + (fila % 2) * .2;
  zClip(Z[i + 1], sprint ? 'z_sprint' : (i % 2 ? 'z_walk3' : 'z_walk4'), f * (sprint ? 1 : .9) + i * 7, { x, z, ry: Math.PI / 2 }); } };

run([
  // 0 — "na 42, seu braço cansa de bater": golpe de machado, zumbi cai devagar; depois ofegante segurando o braço
  (lf, f, len, c) => { rua0(f); const me = R(-2, 1.2), HIT = golpe(lf, me, 26);
    if (lf > HIT + 70) clip('s_painarm2h', lf - HIT - 70, { x: me.x, z: me.z, loop: false });
    c.shake(lf - HIT, .07); camOn(c, me.x + .6, me.z, 6.2, SY); },
  // 1 — "Distensão Muscular... no painel de saúde" (painel no cfg): ofegante com o machado, dor no braço
  (lf, f, len, c) => { rua0(f); const me = R(-2, 1.2); zClip(Z[0], 'z_deathleft', 45, { x: me.x + 1.15, z: me.z, ry: -Math.PI / 2, loop: false });
    if (lf < 40) clip('s_breath2h', lf, { x: me.x, z: me.z }); else clip('s_painarm2h', lf - 40, { x: me.x, z: me.z });
    camOn(c, me.x + .4, me.z, 6.6, .6); },
  // 2 — bater (braço) · CORRER (pernas: horda vindo de longe) · peso (costas: andando devagar, curvado)
  (lf, f, len, c) => { rua0(f); const k1 = len * .3, k2 = len * .64;
    if (lf < k1) { const me = R(-2, 1.2); const HIT = golpe(lf, me, 6, { cansado: true }); c.shake(lf - HIT, .06); camOn(c, me.x + .6, me.z, 6.2, SY); }
    else if (lf < k2) { const l = lf - k1, x = R(0, 1.2).x + l / 30 * VRUN, z = R(0, 1.2).z;   // começa depois do carro estacionado (i -13…-9)
      clip(l < 12 ? 's_run2h' : 's_sprint2h', l * 1.05, { x, z }); horda(f, l, x, z, 12, 2.5);
      camOn(c, x - 1.4, z, 8.0, .64); }
    else { const l = lf - k2, x = R(-6, 1.3).x + l / 30 * VWALK * .7, z = R(0, 1.3).z;
      clip('s_walk2h', l * .75, { x, z, up: ['s_paintorso2h', l + 20] }); camOn(c, x + .3, z, 6.0, SY); }
    clarao(Math.max(1 - Math.abs(lf - k1) / 5, 1 - Math.abs(lf - k2) / 5, 0) * .8, '#000'); },
  // 3 — arma pesada cansa mais (golpe pesado) · pisão em zumbi caído cansa menos (pisão no lugar certo)
  (lf, f, len, c) => { rua0(f); const k = len * .45, me = R(3, 1.2);
    if (lf < k) { const HIT = golpe(lf, me, 4, { cansado: true }); c.shake(lf - HIT, .08); camOn(c, me.x + .6, me.z, 6.0, SY); }
    else { const l = lf - k, IMP = pisao(l, me, 10); c.shake(l - IMP, .05); camOn(c, me.x + .7, me.z + .1, 4.9, SY); }
    clarao(Math.max(1 - Math.abs(lf - k) / 5, 0) * .8, '#000'); },
  // 4 — força e nível em Machados diminuem a distensão: golpe limpo, firme, zumbi cai
  (lf, f, len, c) => { rua0(f); const me = R(7, 1.2), HIT = golpe(lf, me, 14); c.shake(lf - HIT, .07); camOn(c, me.x + .6, me.z, 6.4, SY); },
  // 5 — analgésico tira a dor, a distensão continua (cozinha, tarde): toma o comprimido e ainda segura o braço
  (lf, f, len, c) => { light('dawn'); clima('', 0); KC.show(); TARDE.set(f); clarao(0); const p = K(7.4, 1.7);
    if (lf < 90) clip('s_pills', lf + 5, { x: p.x, z: p.z, ry: .9, axe: false }); else clip('s_painarm', lf - 90, { x: p.x, z: p.z, ry: .9, axe: false });
    camOn(c, p.x - .1, p.z, 6.4, SY); },
  // 6 — exercício demais: "no dia seguinte, dores terríveis" — de manhã no quarto, levanta da cama com dor
  (lf, f, len, c) => { light('dawn'); clima('sol', .35); QC.show(); MANHA.mostrar(true); MANHA.set(f); clarao(0); const p = A(3.1, 1.15);
    if (lf < 70) clip('s_stretch', lf, { x: p.x, z: p.z, ry: .6, loop: false, axe: false }); else clip('s_painarm', lf - 70, { x: p.x, z: p.z, ry: .6, axe: false, up: ['s_painleg', lf - 70] });
    camOn(c, p.x - .35, p.z - .45, 6.6, SY); },
  // 7 — golpe · pisão · caminhada · descanso: quatro cortes rápidos
  (lf, f, len, c) => { const q = len / 4, i = Math.min(3, Math.floor(lf / q)), l = lf - i * q;
    if (i === 0) { rua0(f); const me = R(-2, 1.2), HIT = golpe(l, me, 0, {}); c.shake(l - HIT, .06); camOn(c, me.x + .6, me.z, 6.2, SY); }
    else if (i === 1) { rua0(f); const me = R(3, 1.2); pisao(l, me, 0); camOn(c, me.x + .7, me.z + .1, 5.0, SY); }
    else if (i === 2) { rua0(f); const x = R(-6, 1.3).x + l / 30 * VWALK, z = R(0, 1.3).z; clip('s_walk2h', l, { x, z }); camOn(c, x + .3, z, 6.2, SY); }
    else { light('dawn'); clima('sol', .35); QC.show(); MANHA.mostrar(true); MANHA.set(f); const p = A(3.1, 1.15); clip('s_breath', l, { x: p.x, z: p.z, ry: .6, axe: false }); camOn(c, p.x - .35, p.z - .45, 6.6, SY); }
    clarao(Math.max(...[1, 2, 3].map(k => 1 - Math.abs(lf - k * q) / 4), 0) * .7, '#000'); },
]);
