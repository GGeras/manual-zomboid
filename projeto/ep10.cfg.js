// EP 10 — Gerador: 5 regras pra usar gerador.
const LAB = n => `PROJECT ZOMBOID · GERADOR <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 1.65, 4.48, 7.71, 9.67, 14.48, 16.19, 18.24, 21.23, 23.55, 25.51, 27.19, 28.93, 32.46, 35.48, 36.48, 37.47], END: 39.77,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2 }, { at: 3, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 7, lab: LAB(3) }, { at: 9, lab: LAB(4) }, { at: 11, lab: LAB(5) }, { at: 13, lab: LAB(5) }, { at: 15 }],
  titles: [
    { i: 0, a: 'A luz', b: 'caiu...', col: 'bone', size: 170 },
    { i: 1, a: 'Sua base não', b: 'fica no escuro', size: 112 },
    { i: 2, a: '5 regras pra', b: 'usar gerador', size: 116 },
    { i: 3, a: 'Um:', b: 'aprenda antes', size: 116 }, { i: 4, a: 'Eletricista', b: 'ou revista', col: 'green', size: 140 },
    { i: 5, a: 'Dois: nunca', b: 'dentro de casa', aSize: 100, size: 108 }, { i: 6, a: 'A fumaça', b: 'mata rápido', size: 124 },
    { i: 7, a: 'Três: alimenta', b: '20 quadrados', col: 'green', aSize: 96, size: 124 }, { i: 8, a: 'Do lado de fora', b: 'colado na parede', col: 'green', aSize: 88, size: 100 },
    { i: 9, a: 'Quatro:', b: 'faz barulho', size: 124 }, { i: 10, a: 'Zumbis por', b: 'perto ouvem', size: 124 },
    { i: 11, a: 'Cinco:', b: 'cuide dele', col: 'green', size: 140 }, { i: 12, a: 'Abasteça desligado', b: 'conserte com sucata', col: 'green', aSize: 80, size: 88 },
    { i: 13, a: 'Abaixo de 20%', b: 'pode pegar fogo', aSize: 96, size: 104 }, { i: 14, a: 'Ou', b: 'explodir', size: 170 },
    { i: 15, a: 'Segue', b: 'o canal' }, { i: 16, a: 'Gerador cuidado', b: 'é base acesa', col: 'green', aSize: 96, size: 124 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const tag = (k, txt, col, at, end, top = 1480) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 54px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    // 0 — luz caiu
    tag(0, 'SEM ENERGIA', '#ff3d55', C(0) + 30, null, 1500);
    // 3 — não sabe ligar; eletricista ou revista
    M.hide('#' + H.cross(3, C(3) + 26, 445, 1380), F[4] + 4);
    tag(3, 'NÃO SABE LIGAR', '#ff3d55', C(3) + 28, F[4] + 4, 1580);
    tag(3, 'ELETRICISTA ✓', '#8fe04a', F[4] + 22, null, 1380);
    tag(3, 'OU REVISTA DE GERADOR ✓', '#8fe04a', F[4] + 56, null, 1480);
    tag(3, 'LIGOU ✓', '#8fe04a', F[4] + 112, null, 1580);
    // 4 — dentro de casa: fumaça, saúde despenca
    H.moodle(4, 'pz:Status_DifficultyBreathing', 'FUMAÇA', C(5) + 30);
    H.bar(4, 'SAÚDE', [[0, 1], [C(5) + 24, 1], [C(6) + 30, .08, 'softInOut']], { color: '#8fe04a', colorKeys: [[C(5) + 24, '#8fe04a'], [C(6), '#ffb020'], [C(6) + 24, '#ff3d55']], text: 'CAINDO' });
    H.stamp(4, 'MORREU', C(6) + 40, 1250);
    H.vig('rgba(40,40,40,.85)', [[0, 0], [C(5), 0], [C(6) + 30, .8, 'softInOut'], [C(7) - 1, .8], [C(7), 0]]);
    // 5 — raio de 20 quadrados / fora, na parede
    tag(5, 'RAIO: 20 QUADRADOS', '#ffd23a', C(7) + 30, C(8), 1500);
    tag(5, 'FORA ✓  NA PAREDE ✓', '#8fe04a', C(8) + 20, null, 1500);
    // 6 — barulho atrai
    H.moodle(6, 'sound', 'BARULHO', C(9) + 16);
    tag(6, 'ZUMBIS VINDO', '#ff3d55', C(10) + 10, null, 1500);
    // 7 — cuide dele: desliga, abastece, conserta
    tag(7, 'DESLIGADO ✓', '#8fe04a', C(11) + 22, null, 1280);
    tag(7, 'GASOLINA ✓', '#8fe04a', F[12] + 10, null, 1380);
    tag(7, 'SUCATA ELETRÔNICA ✓', '#8fe04a', F[12] + 56, null, 1480);
    H.bar(7, 'CONDIÇÃO', [[0, .4], [F[12] + 62, .4], [F[12] + 92, .78, 'softLand']], { color: '#ffb020', colorKeys: [[F[12] + 62, '#ffb020'], [F[12] + 92, '#8fe04a']], text: '' });
    // 8 — abaixo de 20%: fogo / explosão
    H.bar(8, 'CONDIÇÃO', [[0, .3], [C(13) + 10, .3], [C(13) + 50, .18, 'softInOut']], { color: '#ffb020', colorKeys: [[C(13) + 30, '#ff3d55']], text: 'ABAIXO DE 20%' });
    H.stamp(8, 'BOOM', C(14) + 6, 1300);
    // 9 — CTA
    H.follow(9, C(15) + 4);
  }
};
