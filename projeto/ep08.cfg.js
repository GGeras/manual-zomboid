// EP 08 — Combate corpo a corpo: 5 regras pra lutar sem morrer.
const LAB = n => `PROJECT ZOMBOID · COMBATE <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 2.64, 4.14, 7.64, 9.11, 11.95, 14.32, 16.83, 18.57, 21.23, 22.99, 26.03, 28.71, 30.39, 33.20, 34.40, 35.91, 36.89], END: 38.89,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2 }, { at: 3, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 7, lab: LAB(3) }, { at: 9, lab: LAB(4) }, { at: 12, lab: LAB(5) }, { at: 14, lab: 'PROJECT ZOMBOID · <b>ARMAS</b>' }, { at: 16 }],
  titles: [
    { i: 0, a: 'Você não morre', b: 'pro primeiro', col: 'bone', aSize: 96, size: 124 },
    { i: 1, a: 'Morre pro', b: 'terceiro', size: 150 },
    { i: 2, a: '5 regras pra', b: 'lutar de perto', size: 112 },
    { i: 3, a: 'Um:', b: 'empurre' }, { i: 4, a: 'Empurra e', b: 'pode derrubar', col: 'green', size: 116 },
    { i: 5, a: 'Dois: caiu?', b: 'pise na cabeça', size: 108 }, { i: 6, a: 'Pisar não', b: 'gasta a arma', col: 'green', size: 120 },
    { i: 7, a: 'Três: lute com', b: 'um de cada vez', aSize: 96, size: 108 }, { i: 8, a: 'Use portas:', b: 'eles vêm em fila', col: 'green', size: 100 },
    { i: 9, a: 'Quatro:', b: 'olhe o fôlego', size: 116 }, { i: 10, a: '1º aviso: dano', b: 'cai pela metade', aSize: 96, size: 104 }, { i: 11, a: 'Exausto:', b: 'quase zero', size: 132 },
    { i: 12, a: 'Cinco:', b: 'descanse', col: 'green' }, { i: 13, a: 'Sentado: fôlego', b: 'volta mais rápido', col: 'green', aSize: 92, size: 96 },
    { i: 14, a: 'Toda arma', b: 'quebra', size: 150 }, { i: 15, a: 'Leve uma', b: 'reserva', col: 'green', size: 140 },
    { i: 16, a: 'Segue', b: 'o canal' }, { i: 17, a: 'Quem luta cansado', b: 'vira zumbi', aSize: 84, size: 140 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const tag = (k, txt, col, at, end, top = 1480) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 54px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const big = (k, txt, col, at, end, top = 1330) => { const id = H.big(k, txt, at, `top:${top}px;font-size:150px;letter-spacing:-5px;color:${col};text-shadow:0 8px 0 rgba(0,0,0,.55),0 0 30px #000`); if (end != null) M.hide('#' + id, end); return id; };
    // 0 — contagem dos zumbis
    tag(0, '1º ZUMBI ✓', '#8fe04a', C(0) + 30, null, 1500);
    // 2 — cercado
    H.moodle(2, 'pz:Mood_Panicked', 'PÂNICO', C(2) + 20);
    // 3 — empurrão
    tag(3, '[ ESPAÇO ] EMPURRAR', '#efe5cf', C(3) + 10, F[4] + 50);
    tag(3, 'DERRUBOU ✓', '#8fe04a', F[4] + 52, null);
    // 4 — pisão não gasta a arma
    H.bar(4, 'DESGASTE DA ARMA', [[0, 0], [C(6) + 10, 0], [C(6) + 14, .02]], { color: '#8fe04a', text: 'ZERO' });
    H.check(4, C(6) + 30, 445, 1360);
    // 5 — um por vez / porta
    M.hide('#' + H.cross(5, C(7) + 30, 445, 1400), C(8));
    tag(5, 'UM POR VEZ ✓', '#8fe04a', C(8) + 40, null, 1500);
    // 6 — fôlego: dano do golpe
    H.moodle(6, 'pz:Mood_Exhausted', 'ESFORÇO', F[10] + 8);
    tag(6, 'DANO DO GOLPE', '#efe5cf', C(9) + 16, null, 1250);
    big(6, '100%', '#8fe04a', C(9) + 24, F[10] + 52);
    big(6, '−50%', '#ffb020', F[10] + 54, C(11) + 22);
    big(6, '−95%', '#ff3d55', C(11) + 24, null);
    H.vig('rgba(120,0,10,.55)', [[0, 0], [C(11), 0], [C(11) + 30, .7, 'softInOut'], [C(12) - 1, .7], [C(12), 0]]);
    // 7 — descanse sentado: fôlego volta
    H.bar(7, 'FÔLEGO', [[0, .12], [C(12) + 20, .12], [C(13), .3, 'softInOut'], [C(13) + 60, 1, 'softInOut']], { color: '#ff3d55', colorKeys: [[C(12) + 20, '#ff3d55'], [C(13) + 20, '#ffb020'], [C(13) + 60, '#8fe04a']], text: 'VOLTANDO' });
    tag(7, 'SENTADO: MAIS RÁPIDO ✓', '#8fe04a', F[13] + 14, null, 1480);
    // 8 — arma quebra / reserva
    M.hide('#' + H.stamp(8, 'QUEBROU', C(14) + 22, 1430), C(15));
    tag(8, 'ARMA RESERVA ✓', '#8fe04a', C(15) + 14, null, 1480);
    // 9 — CTA
    H.follow(9, C(16) + 4);
  }
};
