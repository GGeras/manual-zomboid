// EP 02 — O que fazer no dia 2 (roteiro corrigido)
const LAB = n => `PROJECT ZOMBOID · DICA <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 2.17, 4.26, 6.48, 9.30, 13.34, 16.24, 18.42, 20.82, 23.51, 25.16, 27.47, 29.17, 30.96, 32.59, 35.04, 36.12], END: 38.72,
  scenes: [{ at: 0 }, { at: 1 }, { at: 2, red: true }, { at: 3, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 7, lab: LAB(3) }, { at: 10, lab: LAB(4) }, { at: 13, lab: LAB(5) }, { at: 15 }],
  titles: [
    { i: 0, a: 'Você sobreviveu', b: 'ao dia 1' }, { i: 1, a: 'Agora vem', b: 'a parte difícil' },
    { i: 3, a: 'Não perca tempo', b: 'com garrafas', size: 112 }, { i: 4, a: 'Pias e banheiras', b: 'guardam água', col: 'green' },
    { i: 5, a: 'Base fora', b: 'do centro', col: 'green' }, { i: 6, a: 'Menos zumbis', b: 'menos surpresa', col: 'bone', size: 100 },
    { i: 7, a: 'Pregue tábuas', b: 'nas janelas', col: 'green' }, { i: 8, a: 'Martelo + tábua', b: '2 pregos cada', col: 'bone', size: 112 }, { i: 9, a: 'Sem isso', b: 'eles entram' },
    { i: 10, a: 'Estoque', b: 'enlatados', col: 'green' }, { i: 11, a: 'Geladeira', b: 'estraga' }, { i: 12, a: 'Não esqueça', b: 'o abridor', col: 'green' },
    { i: 13, a: 'Cinco:', b: 'durma', col: 'green' }, { i: 14, a: 'Cansaço reduz', b: 'dano e visão', size: 112 },
    { i: 15, a: 'Segue', b: 'o canal' }, { i: 16, a: 'Próximo:', b: 'o som da horda', size: 108 }
  ],
  extras(H) {
    const { F, C, M } = H;
    H.words(2, 'Faça essas', C(2), 'top:470px;font-size:104px;color:var(--blk)');
    H.big(2, '5', F[2] + 24, 'top:640px;font-size:520px;letter-spacing:-20px;color:var(--blk)');
    H.big(2, 'coisas hoje', F[2] + 34, 'top:1180px;font-size:120px;color:var(--bone)', { y: 80, scale: 1.3 });
    M.hide('#' + H.cross(3, C(3) + 30, 445, 1460), C(4));
    H.panel(3, 'ÁGUA APÓS O CORTE', [['Pia', '✓', 'color:var(--green)'], ['Banheira', '✓', 'color:var(--green)'], ['Vaso sanitário', '✓', 'color:var(--green)']], C(4) + 8, { style: 'top:600px', gap: 10 });
    H.chip(4, 'CENTRO ✕', C(5) + 10, 'left:110px;top:1490px;color:var(--red2)');
    H.chip(4, 'FORA DO CENTRO ✓', C(5) + 40, 'left:430px;top:1490px;color:var(--green)');
    H.panel(5, 'POR TÁBUA', [['Martelo', 'equipado'], ['Tábua', '1'], ['Pregos', '2']], C(8) + 2, { style: 'top:600px' });
    H.cross(5, C(9) + 14);
    H.panel(6, 'INVENTÁRIO', [['Feijão em lata', '✓'], ['Sopa em lata', '✓'], ['Atum em lata', '✓']], C(10) + 4, { style: 'top:600px' });
    H.panel(6, 'GELADEIRA', [['Leite', 'ESTRAGADO', 'color:var(--red2)'], ['Carne', 'ESTRAGADA', 'color:var(--red2)']], C(11) + 2, { style: 'top:960px' });
    H.chip(6, 'ABRIDOR DE LATAS ✓', C(12) + 10, 'left:280px;top:1490px;color:var(--green)');
    const z = H.big(7, 'Z z z', C(13) + 8, 'top:760px;font-size:120px;color:var(--bone);text-shadow:0 4px 20px #000', { y: 60, scale: .6 });
    M.kf('#' + z, 'y', [[C(13) + 18, 0], [C(14), -60, 'softInOut']]); M.hide('#' + z, C(14));
    H.moodle(7, 'tired', 'CANSADO', C(14) + 6);
    H.chip(7, 'DANO ↓   VISÃO ↓', C(14) + 22, 'left:300px;top:1490px;color:var(--red2)');
    H.follow(8, C(15) + 4);
  }
};
