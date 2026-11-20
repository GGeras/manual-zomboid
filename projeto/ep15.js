import { THREE, PZ, scene, pose, S, Z, light, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { rua, casaDentro, camOn, rota, VEL, clima, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut, face, T } = U;
// EP15 v2 (revisão 2026-11-20 aplicada aos finais): ataque na rua do bairro (sprites do jogo) e tratamento na sala mobiliada.
// Animações ORIGINAIS: zumbi andando, arranhando (Zombie lunge) e mordendo (Zombie_Bite); o personagem reage ao golpe
// (Bob_AimHitReact), empurra na mordida (Bob_BiteDefend) e se trata SENTADO NA CADEIRA do jogo (Bob_SatChair + Bob_Bandage*),
// sem a pose antiga que sentava no chão e afundava.
const RUA = rua(20, 40, 'verao'), CASA = casaDentro(-60, 80), C = CASA.C;
const CH = C.assento('furniture_seating_indoor_01_57', 3, 3, { encosto: 'N' }), SEAT = C.at(3, 3);
const clip = (h, name, lf, o = {}) => { pose(h, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up] }, o)); if (h === S) { S.bat.visible = false; S.hammer.visible = false; } };
const blood = (x, y, z, lf, k = 1) => { for (let i = 0; i < 3; i++) puff(x, y, z, (lf + i * 9) % 26, { n: 2, seed: i, life: 26, size: .05 * k, rise: -.6, color: '#8a1010', op: .9 }); };
const P0 = RUA.at(-2, 2.9);
// ataque na calçada: o zumbi vem andando e arranha (lunge) ou morde (bite); o personagem reage com as animações do jogo
const attack = (lf, f, c, bite = false, len = 60) => { light('dawn'); tileLuz('#f2dac6'); clima('', 0); RUA.C.show();
  const hit = 34, zx = P0.x - .75, start = zx - 2.6,   // zumbi vem do lado de lá (oeste): não tapa o personagem
  w = rota([[start, P0.z], [zx, P0.z]], lf / 30, VEL.z_walk * 2.4);
  if (lf < hit - 8 && !w.fim) { clip(Z[0], 'z_walk', lf, { x: w.x, z: w.z, ry: Math.PI / 2 }); clip(S, 's_idle', lf, { x: P0.x, z: P0.z, ry: -Math.PI / 2 }); }
  else { const a = lf - (hit - 8); clip(Z[0], bite ? 'z_bite' : 'z_lunge', a, { x: zx, z: P0.z, ry: Math.PI / 2, loop: false });
    clip(S, bite ? 's_bitedefend' : 's_hitreact', a, { x: P0.x, z: P0.z, ry: -Math.PI / 2, loop: false }); if (a > 8) blood(P0.x - .15, 1.35, P0.z, a - 8, bite ? 1.6 : 1); }
  c.shake(lf - hit, bite ? .14 : .08); camOn(c, P0.x - .4, P0.z, lerp(7.4, 6.6, easeOut(lf / len)), .76); };
// tratamento sentado na cadeira (tronco/braços = animação de curativo do jogo)
const treat = (lf, c, anim = 's_band_up', h = 6.6) => { light('day'); tileLuz('#ffffff'); clima('', 0); C.show(); clip(S, 's_satchair', lf, { x: SEAT.x, z: SEAT.z, ry: 0, up: [anim, lf + 40] }); camOn(c, SEAT.x, SEAT.z, h, .76); };
run([
  // 0 — gancho: arranhão
  (lf, f, len, c) => attack(lf, f, c, false, len),
  // 1 — duas infecções: mordida
  (lf, f, len, c) => attack(lf, f, c, true, len),
  // 2 — infecção da ferida: tratando o braço
  (lf, f, len, c) => treat(lf, c, 's_band_larm'),
  // 3 — painel de saúde (tela) com o ataque ao fundo
  (lf, f, len, c) => attack(lf, f, c, false, len),
  // 4 — tratamentos
  (lf, f, len, c) => treat(lf, c, 's_band_up'),
  // 5 — fratura: tala na perna (em pé, animação de curativo na perna)
  (lf, f, len, c) => { light('day'); tileLuz('#ffffff'); clima('', 0); C.show(); const p = C.at(3.6, 4.2); clip(S, 's_band_rleg', lf + 60, { x: p.x, z: p.z, ry: .4 }); camOn(c, p.x, p.z, 6.6, .76); },
  // 6 — vidro: pinça primeiro (sangra no começo)
  (lf, f, len, c) => { treat(lf, c, 's_band_larm', 6.2); if (lf < 70) blood(SEAT.x + .25, .9, SEAT.z + .25, lf); },
  // 7 — bala: pinça e sutura
  (lf, f, len, c) => treat(lf, c, 's_band_up', 6.2),
  // 8 — curativo sujo
  (lf, f, len, c) => treat(lf, c, 's_band_larm', 6.6),
  // 9 — tratar infecção
  (lf, f, len, c) => treat(lf, c, 's_band_up', 7),
  // 10 — mordida: sem cura
  (lf, f, len, c) => attack(lf, f, c, true, len)
]);
