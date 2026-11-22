import { THREE, PZ, pose, S, light, puff, U, prop } from './engine.js';
import { run } from './ep3d.js';
import { rain } from './sets.js';
import { rua, casaDentro, camOn, rota, VEL, neve, pocas, chuvaChao, clima, tileLuz, calor, clarao } from './cenarios.js';
const { clamp, lerp, easeOut, T } = U;
// EP18 v3 (22/11): take do calor refeito para imersão (seca, miragem, sol com raios, suor, insolação/hipertermia na câmera); gancho mostra frio E calor; relâmpago na chuva; sem casaco depois de "TIRA".
// EP18 v2 (revisão 2026-11-20): rua de bairro com casas, árvores, grama e postes (nunca lugar vazio).
// FRIO = inverno de verdade (neve no chão, neve caindo, bordas geladas, respiração); CALOR = verão de sol forte; CHUVA = poças no chão.
// Animações ORIGINAIS do jogo: s_shiver (tremendo), s_wipe (enxuga o suor), s_drink (bebe), s_walk / s_walkslow.
const INV = rua(-40, 40, 'inverno'), VER = rua(20, 40, 'calor'), CHU = rua(55, 75, 'chuva'), CASA = casaDentro(30, -60);
pocas(CHU.C, [[-3, .4, .9, .5], [1, 1.2, 1.3, .6], [4, .2, .8, .45], [-6, 1.5, 1.1, .5], [2.5, 2.2, .6, .35], [-1.5, 2.6, .7, .3], [7, 1, 1, .5]]);
const BOT = PZ.attach(S, 'Bip01_Prop1', PZ.itemModel('waterbottle')); BOT.scale.setScalar(.55);
const JACK = S.pz && S.pz.meshes.wear0;
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false] }, o)); S.bat.visible = false; S.hammer.visible = false; BOT.visible = !!o.bot; if (JACK) JACK.visible = !o.semCasaco; };
// suor pingando da cabeça (gotas brilhando ao sol) — n gotas por ciclo, mais com mais calor
const GOTAS = Array.from({ length: 8 }, () => prop(new THREE.Mesh(new THREE.SphereGeometry(.022, 8, 6), new THREE.MeshBasicMaterial({ color: '#f4fbff', transparent: true, depthWrite: false }))));
// (gotas na frente do rosto, caindo até o peito: brilho pequeno, nunca bolinha nas costas)
const suor = (p, f, n = 4, ry = .8) => GOTAS.forEach((m, i) => { if (i >= n) return; const a = (f + i * 11) % 22, t = a / 22, s = Math.floor((f + i * 11) / 22) * 7 + i;
  const R = U.R, fx = Math.sin(ry), fz = Math.cos(ry), sd = (R(s) - .5) * .14, fw = .11 + R(s + 3) * .05; m.visible = true;
  m.position.set(p.x + fx * fw + fz * sd, 1.6 - .55 * t * t, p.z + fz * fw - fx * sd); m.scale.set(.8, 2, .8); m.material.opacity = (t < .12 ? t / .12 : 1 - t * .8) * .95; });
// curva do calor no take 6: incômodo → superaquecimento → insolação → hipertermia (mesmas marcas do moodle)
const quente = u => u < .42 ? lerp(.55, .8, u / .42) : u < .56 ? lerp(.8, 1.05, (u - .42) / .14) : u < .70 ? lerp(1.05, 1.25, (u - .56) / .14) : lerp(1.25, 1.45, clamp((u - .70) / .2));
// respiração visível no frio (sai da boca a cada ~1,5 s)
const breath = (p, f) => { const a = f % 45; if (a < 30) puff(p.x + .28, 1.66, p.z + .28, a, { n: 2, seed: Math.floor(f / 45), life: 30, size: .1, rise: .25, color: '#f2f6fb', op: .5 }); };
// inverno: lugar fixo na calçada da frente (mesmo lugar do começo ao fim do frio)
const PI0 = INV.at(-2, 2.9);
// regra 4.3: personagem mais alto no quadro (pés acima da descrição/@canal do app)
const SY = .67;
const winter = (lf, f, c, h, o = {}) => { light('day'); tileLuz('#e3ebf7'); INV.C.show(); neve(PI0.x, PI0.z, f, o.snow ?? 1); clima('gelo', o.ice ?? .85); clarao(0); };
const summer = (lf, f, k = 1, pulse = 0, tilt = 0) => { light('day'); tileLuz('#fff1d6'); VER.C.show(); clima('calor', 1); calor(f, k, pulse, tilt); clarao(0); };
run([
  // 0 — frio e calor matam sem zumbi: metade tremendo na neve, clarão, metade derretendo no sol (o gancho mostra OS DOIS)
  (lf, f, len, c) => { const cut = Math.round(len * .5);
    if (lf < cut) { winter(lf, f, c); clip('s_shiver', lf, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, lerp(10, 8.6, easeOut(lf / cut)), SY); return; }
    const p = VER.at(-2, 2.9), u = (lf - cut) / (len - cut); summer(lf, f, 1.25, 0, .5); clip('s_wipe', lf - cut + 10, { x: p.x, z: p.z }); suor(p, f, 6, .8);
    clarao(lf - cut < 6 ? 1 - (lf - cut) / 6 : 0); camOn(c, p.x, p.z, lerp(8.2, 7.6, easeOut(u)), SY); },
  // 1 — dois termômetros
  (lf, f, len, c) => { winter(lf, f, c); clip('s_shiver', lf + 20, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, 9.2, SY); },
  // 2 — moodle
  (lf, f, len, c) => { winter(lf, f, c); clip('s_shiver', lf + 40, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, 8.8, SY); },
  // 3 — roupa segura calor e corta vento (vento empurra a neve)
  (lf, f, len, c) => { winter(lf, f, c); clip('s_idle', lf, { x: PI0.x, z: PI0.z }); breath(PI0, f); camOn(c, PI0.x, PI0.z, 8.6, SY); },
  // 4 — esfriou: anda devagar pela calçada
  (lf, f, len, c) => { winter(lf, f, c); const p = rota([[PI0.x - 2.2, PI0.z], [PI0.x + 3, PI0.z]], lf / 30, VEL.s_walkslow); clip('s_walkslow', lf, { x: p.x, z: p.z, ry: p.ry }); breath(p, f); camOn(c, p.x, p.z, 9.4, .70); },   // regra 4.3: a janela de Temperatura ocupa o alto, personagem um pouco mais baixo (pés ainda acima da descrição)
  // 5 — hipotermia: treme forte, quase parado
  (lf, f, len, c) => { winter(lf, f, c, 0, { ice: 1 }); const p = INV.at(.9, 2.9); clip('s_shiver', lf * 1.4, { x: p.x, z: p.z }); breath(p, f); camOn(c, p.x, p.z, lerp(8.6, 7.6, lf / len), SY); },
  // 6 — calor (v3, mais imersão): seca com grama queimada e sombras duras, ar tremendo, sol estourando; anda devagar no sol → para e enxuga o suor
  //     → insolação (câmera balança, tela inclina) → hipertermia (borda vermelha pulsando com o coração, cambaleia atrás da sombra da árvore)
  (lf, f, len, c) => { const u = lf / len, k = quente(u), hip = u > .70, ins = u > .56;
    const beat = hip ? Math.pow(Math.abs(Math.sin(((lf - Math.round(len * .70)) / 30) * Math.PI)), 8) : 0;   // 1 batida/s, casada com o som 'heart' (dt 9.17, 10.17, 11.17)
    summer(lf, f, k, beat, ins ? lerp(.4, 1.1, clamp((u - .56) / .3)) : 0);
    const A = VER.at(-5.6, 2.9), B = VER.at(-2, 2.9), SH = VER.at(-4.3, 4.6); let p, ry = .8;
    if (u < .22) { p = rota([[A.x, A.z], [B.x, B.z]], lf / 30, VEL.s_walkslow); clip('s_walkslow', lf, { x: p.x, z: p.z, ry: p.ry }); }
    else if (!hip) { p = B; clip('s_wipe', (lf - len * .22) * (ins ? .75 : 1), { x: p.x, z: p.z }); }
    else { const t = (lf - len * .70) / 30; p = rota([[B.x, B.z], [SH.x, SH.z]], t, VEL.s_walkslow * .62); const wob = Math.sin(lf * .19) * .35;
      ry = p.ry + wob; clip(p.fim ? 's_wipe' : 's_walkslow', lf * .7, { x: p.x + Math.sin(lf * .13) * .05, z: p.z, ry }); }
    if (u < .22) ry = p.ry; suor(p, f, u < .22 ? 2 : hip ? 8 : 5, ry);
    const sw = ins ? lerp(.05, .28, clamp((u - .56) / .3)) : 0;
    camOn(c, p.x + Math.sin(f * .06) * sw, p.z + Math.cos(f * .045) * sw, lerp(9.4, 7.2, easeOut(u)), SY); },
  // 7 — chuva de inverno: anda na chuva, poças no chão
  (lf, f, len, c) => { const fl = lf >= 82 && lf < 94 ? [.7, .7, .15, .1, .55, .5, .35, .25, .16, .1, .05, .02][lf - 82] : 0;   // relâmpago logo antes do trovão (sfx em {f:7, dt:3})
    light('dark'); tileLuz(fl > .3 ? '#d8e2f2' : '#9aa6b4'); CHU.C.show(); clima('chuva', 1); clarao(fl * .55); chuvaChao(f); const p0 = CHU.at(-4, 2.7); const p = rota([[p0.x, p0.z], [p0.x + 9, p0.z]], lf / 30, VEL.s_walk * .8);
    clip('s_walk', lf * .8, { x: p.x, z: p.z, ry: p.ry }); rain(p.x, p.z, f, 1); camOn(c, p.x, p.z, 9.2, SY); },
  // 8 — em casa, roupa seca (sala mobiliada)
  (lf, f, len, c) => { light('day'); tileLuz('#ffffff'); clima('', 0); clarao(0); CASA.C.show(); const p = CASA.at(3, 3.4); clip('s_idle', lf, { x: p.x, z: p.z }); camOn(c, p.x, p.z, 8.4, SY); },
  // 9 — verão: na sombra da árvore, bebe água
  (lf, f, len, c) => { summer(lf, f, lerp(.6, .25, clamp(lf / len * 2))); const p = VER.at(-.4, -2.1); const drink = lf > len * .45;
    clip(drink ? 's_drink' : 's_wipe', drink ? lf - len * .45 : lf, { x: p.x, z: p.z, loop: !drink, bot: drink, semCasaco: true }); if (!drink) suor(p, f, 2); camOn(c, p.x, p.z, 8.6, SY); },
  // 10 — ouve a previsão e sai preparado (anda pela calçada no sol)
  (lf, f, len, c) => { summer(lf, f, .35); const p0 = VER.at(-5, 2.8); const p = rota([[p0.x, p0.z], [p0.x + 8, p0.z]], lf / 30, VEL.s_walk); clip('s_walk', lf, { x: p.x, z: p.z, ry: p.ry, semCasaco: true }); camOn(c, p.x, p.z, lerp(9, 10, lf / len), SY); }
]);
