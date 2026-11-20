import { THREE, PZ, pose, S, light, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { rain } from './sets.js';
import { rua, casaDentro, camOn, rota, VEL, neve, pocas, chuvaChao, clima, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut, T } = U;
// EP18 v2 (revisão 2026-11-20): rua de bairro com casas, árvores, grama e postes (nunca lugar vazio).
// FRIO = inverno de verdade (neve no chão, neve caindo, bordas geladas, respiração); CALOR = verão de sol forte; CHUVA = poças no chão.
// Animações ORIGINAIS do jogo: s_shiver (tremendo), s_wipe (enxuga o suor), s_drink (bebe), s_walk / s_walkslow.
const INV = rua(-40, 40, 'inverno'), VER = rua(20, 40, 'verao'), CHU = rua(55, 75, 'chuva'), CASA = casaDentro(30, -60);
pocas(CHU.C, [[-3, .4, .9, .5], [1, 1.2, 1.3, .6], [4, .2, .8, .45], [-6, 1.5, 1.1, .5], [2.5, 2.2, .6, .35], [-1.5, 2.6, .7, .3], [7, 1, 1, .5]]);
const BOT = PZ.attach(S, 'Bip01_Prop1', PZ.itemModel('waterbottle')); BOT.scale.setScalar(.55);
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false] }, o)); S.bat.visible = false; S.hammer.visible = false; BOT.visible = !!o.bot; };
// respiração visível no frio (sai da boca a cada ~1,5 s)
const breath = (p, f) => { const a = f % 45; if (a < 30) puff(p.x + .28, 1.66, p.z + .28, a, { n: 2, seed: Math.floor(f / 45), life: 30, size: .1, rise: .25, color: '#f2f6fb', op: .5 }); };
// inverno: lugar fixo na calçada da frente (mesmo lugar do começo ao fim do frio)
const PI0 = INV.at(-2, 2.9);
const winter = (lf, f, c, h, o = {}) => { light('day'); tileLuz('#e3ebf7'); INV.C.show(); neve(PI0.x, PI0.z, f, o.snow ?? 1); clima('gelo', o.ice ?? .85); };
const summer = (lf, f) => { light('day'); tileLuz('#fff6e6'); VER.C.show(); clima('sol', 1); };
run([
  // 0 — frio e calor matam sem zumbi: tremendo de frio na neve
  (lf, f, len, c) => { winter(lf, f, c); clip('s_shiver', lf, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, lerp(10, 8.6, easeOut(lf / len))); },
  // 1 — dois termômetros
  (lf, f, len, c) => { winter(lf, f, c); clip('s_shiver', lf + 20, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, 9.2); },
  // 2 — moodle
  (lf, f, len, c) => { winter(lf, f, c); clip('s_shiver', lf + 40, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, 8.8); },
  // 3 — roupa segura calor e corta vento (vento empurra a neve)
  (lf, f, len, c) => { winter(lf, f, c); clip('s_idle', lf, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, 8.6); },
  // 4 — esfriou: anda devagar pela calçada
  (lf, f, len, c) => { winter(lf, f, c); const p = rota([[PI0.x - 2.2, PI0.z], [PI0.x + 3, PI0.z]], lf / 30, VEL.s_walkslow); clip('s_walkslow', lf, { x: p.x, z: p.z, ry: p.ry }); breath(p, f); camOn(c, p.x, p.z, 9.4, .77); },
  // 5 — hipotermia: treme forte, quase parado
  (lf, f, len, c) => { winter(lf, f, c, 0, { ice: 1 }); const p = INV.at(.9, 2.9); clip('s_shiver', lf * 1.4, { x: p.x, z: p.z }); breath(p, f); camOn(c, p.x, p.z, lerp(8.6, 7.6, lf / len)); },
  // 6 — calor: sol forte de verão, enxuga o suor
  (lf, f, len, c) => { summer(lf, f); const p = VER.at(-2, 2.9); clip('s_wipe', lf, { x: p.x, z: p.z }); camOn(c, p.x, p.z, 8.8); },
  // 7 — chuva de inverno: anda na chuva, poças no chão
  (lf, f, len, c) => { light('dark'); tileLuz('#9aa6b4'); CHU.C.show(); clima('chuva', 1); chuvaChao(f); const p0 = CHU.at(-4, 2.7); const p = rota([[p0.x, p0.z], [p0.x + 9, p0.z]], lf / 30, VEL.s_walk * .8);
    clip('s_walk', lf * .8, { x: p.x, z: p.z, ry: p.ry }); rain(p.x, p.z, f, 1); camOn(c, p.x, p.z, 9.2, .77); },
  // 8 — em casa, roupa seca (sala mobiliada)
  (lf, f, len, c) => { light('day'); tileLuz('#ffffff'); clima('', 0); CASA.C.show(); const p = CASA.at(3, 3.4); clip('s_idle', lf, { x: p.x, z: p.z }); camOn(c, p.x, p.z, 8.4); },
  // 9 — verão: na sombra da árvore, bebe água
  (lf, f, len, c) => { summer(lf, f); const p = VER.at(-.4, -2.1); const drink = lf > len * .45; clip(drink ? 's_drink' : 's_wipe', drink ? lf - len * .45 : lf, { x: p.x, z: p.z, loop: !drink, bot: drink }); camOn(c, p.x, p.z, 8.6); },
  // 10 — ouve a previsão e sai preparado (anda pela calçada no sol)
  (lf, f, len, c) => { summer(lf, f); const p0 = VER.at(-5, 2.8); const p = rota([[p0.x, p0.z], [p0.x + 8, p0.z]], lf / 30, VEL.s_walk); clip('s_walk', lf, { x: p.x, z: p.z, ry: p.ry }); camOn(c, p.x, p.z, lerp(9, 10, lf / len), .76); }
]);
