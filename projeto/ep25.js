// EP 25 — Agricultura (B42.22) — RASCUNHO v1 (27/11): lugar fixo horta() (cenarios.js, sprites do jogo), uma cena por fala do roteiro.
// Plantas = desenhos do jogo por estágio (vegetation_farming_01) e estados unhealthy/dying/dead. Mato = capim no quadrado do canteiro.
// Fatos: info-validada/agricultura.md. Regra 4.7: todo quadro termina com PZ.apoiar.
import { THREE, PZ, pose, S, light, U } from './engine.js';
import { run } from './ep3d.js';
import { horta, tileLuz, camOn, clima, neve, rota, VEL, pocas, chuvaChao } from './cenarios.js';
import { rain } from './sets.js';
const { clamp, lerp, easeOut } = U;
const ease = t => t * t * (3 - 2 * t);

const H = horta(260, -260), HI = horta(320, -260, { inverno: true }), A = (i, j) => H.at(i, j), AI = (i, j) => HI.at(i, j);
pocas(H.C, [[-1, 0, .8, .5], [2, 2, .6, .4], [-2, 3, .5, .35]]);
tileLuz(new THREE.Color(1.1, 1.1, 1.1));   // terra arada do jogo é escura: +10% nos sprites para o brilho mínimo de exterior-dia (95)
S.g.traverse(o => { o.renderOrder = 2; });
const SY = .5;   // personagem no meio da tela (inspeção: pés acima de 1580 px)
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false; PZ.apoiar(S, 0); };
const andar = (pts, lf, nome = 's_walk', vel = VEL.s_walk, o = {}) => { const q = rota(pts, lf / 30, vel); clip(q.fim ? (o.parado || 's_idle') : nome, lf, { x: q.x, z: q.z, ry: q.ry }); return q; };
const LUZ_D = new THREE.Color(1.14, 1.14, 1.14), LUZ_I = new THREE.Color(.9, .9, .9);
const dia = (sol = 1) => { tileLuz(LUZ_D); light('day'); clima('sol', sol); H.C.show(); };
const chuva = f => { tileLuz(LUZ_D); light('dawn'); clima('chuva', .9); H.C.show(); rain(A(0, 0).x, A(0, 0).z, f, 1); chuvaChao(f); };
const inverno = f => { tileLuz(LUZ_I); light('day'); clima('gelo', .5); HI.C.show(); neve(AI(0, 0).x, AI(0, 0).z, f, .7); };
// ponto ao lado de um canteiro (agachado de frente para ele)
const junto = (nome, h = H) => { const c = h.canteiro(nome); return { x: c.x + .35, z: c.z + .75, ry: Math.PI }; };

run([
  // 0 — gancho: tomate murchando, ele ajoelhado ao lado → punch-in (o calendário entra no cfg)
  (lf, f, len, c) => { dia(); H.mato(false).planta('*', 'ok').planta('tomate', lf < len * .35 ? 'unhealthy' : 'dying'); const p = junto('tomate');
    clip('s_forage', 40 + lf, p); camOn(c, p.x, p.z - .2, lerp(10, 8, easeOut(clamp(lf / (len * .7)))), SY); },
  // 1 — cada planta tem os meses certos: mão planta a semente na terra arada
  (lf, f, len, c) => { dia(); H.mato(false).planta('*', 'ok').planta('batata', 'ok', true); const p = junto('batata');
    clip('s_lootlow', lf, p); camOn(c, p.x, p.z - .2, 8.5, SY); },
  // 2 — plantou fora do mês: condenada, saúde caindo (a barra vem do cfg)
  (lf, f, len, c) => { dia(); H.mato(false).planta('*', 'ok').planta('batata', lf < len * .4 ? 'ok' : lf < len * .75 ? 'unhealthy' : 'dying'); const p = junto('batata');
    clip('s_idle', lf, { x: p.x + .4, z: p.z + .4, ry: Math.PI * 1.1 }); camOn(c, p.x, p.z - .2, 8.5, SY); },
  // 3 — novembro e dezembro: ninguém tem — horta vazia, luz esfriando
  (lf, f, len, c) => { const k = clamp(lf / len); tileLuz(LUZ_D); light('dawn'); clima('gelo', k * .35); H.C.show(); H.mato(false).planta('*', 'ok', true);
    clip('s_idle', lf, { x: A(-1, 0).x, z: A(-1, 0).z, ry: .8 }); camOn(c, A(-.5, 0).x, A(-.5, 0).z, lerp(12, 14, k), SY); },
  // 4 — calendário: batata, tomate, repolho e cenoura (cartões no cfg); câmera passeia pelos canteiros cheios
  (lf, f, len, c) => { dia(); H.mato(false).planta('*', 'ok'); const k = ease(clamp(lf / len));
    const q = andar([[A(-1.2, 3).x, A(-1.2, 3).z], [A(-1.2, -.3).x, A(-1.2, -.3).z]], lf, 's_walkslow', VEL.s_walkslow);
    camOn(c, q.x + .3, q.z, lerp(10, 8.5, k), SY); },
  // 5 — agora é água: regando o canteiro (barra de água sobe no cfg)
  (lf, f, len, c) => { dia(); H.mato(false).planta('*', 'ok'); const p = junto('repolho'); clip('s_lootlow', lf, p); camOn(c, p.x, p.z - .2, 8.5, SY); },
  // 6 — tomate quer muito, cenoura (depois de brotar) pouco: os dois canteiros lado a lado
  (lf, f, len, c) => { dia(); H.mato(false).planta('*', 'ok'); clip('s_idle', lf, { x: A(-1, -.3).x, z: A(-1, -.3).z, ry: Math.PI }); camOn(c, A(-1, -.5).x, A(-1, -.5).z, 9.5, SY); },
  // 7 — faltou água: atrasa → seca → corte para a chuva regando o que está fora
  (lf, f, len, c) => { const ch = lf > len * .62; H.mato(false).planta('*', 'ok');
    if (!ch) { dia(); H.planta('cenoura', lf < len * .3 ? 'unhealthy' : 'dying'); } else chuva(f);
    const p = junto('cenoura'); clip('s_idle', lf, { x: p.x + .5, z: p.z + .3, ry: Math.PI }); camOn(c, p.x, p.z - .2, ch ? 9 : 7, SY); },
  // 8 — arranca o mato: canteiro com capim, ele agacha e puxa
  (lf, f, len, c) => { dia(); H.planta('*', 'ok').planta('repolho', lf < len * .55 ? 'unhealthy' : 'ok'); H.mato(lf < len * .62); const p = junto('repolho');
    if (lf < len * .3) andar([[A(-1, 2.6).x, A(-1, 2.6).z], [p.x, p.z]], lf, 's_walk', VEL.s_walk); else clip('s_lootlow', lf, p);
    camOn(c, p.x, p.z - .2, lerp(10, 8.5, clamp(lf / len)), SY); },
  // 9 — doença passando de um canteiro ao vizinho (com mato, mais rápido)
  (lf, f, len, c) => { dia(); H.mato(true).planta('*', 'ok'); const k = clamp(lf / len); H.planta('tomate', 'unhealthy'); if (k > .45) H.planta('batata', 'unhealthy'); if (k > .8) H.planta('tomate', 'dying');
    clip('s_idle', lf, { x: A(-1, .5).x, z: A(-1, .5).z, ry: Math.PI * 1.15 }); camOn(c, A(-1, -.6).x, A(-1, -.6).z, 9, SY); },
  // 10 — inverno lá fora: tudo morto, o repolho de pé
  (lf, f, len, c) => { inverno(f); HI.mato(false).planta('*', 'dead').planta('repolho', 'ok');
    clip('s_idle', lf, { x: AI(-1, 0).x, z: AI(-1, 0).z, ry: .8 }); camOn(c, AI(-1, .5).x, AI(-1, .5).z, lerp(11, 9, easeOut(clamp(lf / len))), SY); },
  // 11 — CTA: colheita na mão, batata ou repolho? (ícones no cfg)
  (lf, f, len, c) => { dia(); H.mato(false).planta('*', 'ok'); const p = junto('repolho'); clip(lf < len * .4 ? 's_lootlow' : 's_idle', lf, p);
    camOn(c, p.x, p.z - .2, 8.5, SY); },
]);
