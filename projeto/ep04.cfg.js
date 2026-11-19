// EP 04 — Duas infecções: ferimento (sujeira) x vírus zumbi (Knox). Roteiro corrigido.
const LABW = 'PROJECT ZOMBOID · <b style="color:#ffb020">INFECÇÃO DO FERIMENTO</b>', LABK = 'PROJECT ZOMBOID · <b style="color:#8fe04a">VÍRUS ZUMBI</b>';
window.EP = {
  OFF: 1.3,
  T: [0.00, 3.01, 4.66, 7.32, 10.40, 15.70, 17.71, 19.73, 21.69, 23.76, 25.85, 29.64, 32.47, 34.08, 38.19, 39.29], END: 40.97,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2, lab: LABW }, { at: 5, lab: LABK }, { at: 7, lab: LABK }, { at: 10, lab: LABK }, { at: 12, lab: 'PROJECT ZOMBOID · COMO EVITAR' }, { at: 14 }],
  titles: [
    { i: 0, a: 'No Project Zomboid', b: 'duas infecções', aSize: 84, size: 112 },
    { i: 2, a: 'Infecção do', b: 'ferimento', col: 'yellow' }, { i: 3, a: 'Ferida ou bandagem', b: 'suja infecciona', col: 'yellow', aSize: 84, size: 108 },
    { i: 4, a: 'Dói e deixa lento', b: 'mas tem cura', col: 'green', aSize: 90 },
    { i: 5, a: 'Vírus', b: 'zumbi', col: 'green' }, { i: 6, a: 'Decidido na', b: 'hora do golpe' },
    { i: 7, a: 'Arranhão', b: 'vírus: 7%' }, { i: 8, a: 'Corte', b: 'vírus: 25%' }, { i: 9, a: 'Mordida', b: 'vírus: 100%' },
    { i: 10, a: 'Desinfetar', b: 'não muda a chance', size: 100 }, { i: 11, a: 'Na config padrão', b: 'sem cura', aSize: 90 },
    { i: 12, a: 'Então não', b: 'leve o golpe', col: 'green' }, { i: 13, a: 'Não lute cansado', b: 'nem cercado', aSize: 90 },
    { i: 14, a: 'Segue', b: 'o canal' }, { i: 15, a: 'O próximo pode', b: 'salvar sua run', size: 108 }
  ],
  extras(H) {
    const { F, C, M } = H;
    // abertura: as duas infecções lado a lado
    H.chip(0, 'INFECÇÃO DO FERIMENTO', C(0) + 40, 'left:60px;top:1450px;color:#ffb020;font-size:30px');
    H.chip(0, 'VÍRUS ZUMBI', C(0) + 52, 'left:640px;top:1450px;color:#8fe04a;font-size:30px');
    H.words(1, 'E só', C(1), 'top:400px;font-size:110px;color:var(--blk)');
    H.big(1, '1', F[1] + 10, 'top:600px;font-size:520px;color:var(--blk)');
    H.big(1, 'mata', F[1] + 20, 'top:1240px;font-size:130px;color:var(--bone)', { y: 80, scale: 1.3 });
    // infecção do ferimento (amarelo)
    H.moodle(2, 'drop', 'INFECTADO', C(3) + 16, false, C(4) + 30);
    H.chip(2, 'CAUSA: SUJEIRA', C(3) + 24, 'left:60px;top:640px;color:#ffb020');
    H.moodle(2, 'tired', 'DOR', C(4) + 6, false, C(4) + 60);
    H.panel(2, 'TRATAMENTO', [['Desinfetar', '✓', 'color:var(--green)'], ['Bandagem limpa', '✓', 'color:var(--green)']], C(4) + 54, { style: 'top:960px', gap: 10 });
    H.stamp(2, 'TEM CURA', C(4) + 80, 1430, true);
    // vírus zumbi (verde-tóxico)
    H.chip(3, 'SORTEADO NO GOLPE', C(6) + 20, 'left:300px;top:1490px;color:#8fe04a');
    H.moodle(4, 'scratch', 'ARRANHÃO', C(7) + 6, false, C(8));
    M.hide('#' + H.pct(4, 7, C(7) + 12, '#8fe04a', 16), C(8));
    H.moodle(4, 'cut', 'CORTE', C(8) + 6, false, C(9));
    M.hide('#' + H.pct(4, 25, C(8) + 12, '#8fe04a', 18), C(9));
    H.moodle(4, 'bite', 'MORDIDA', C(9) + 6);
    H.pct(4, 100, C(9) + 12, 'var(--red2)', 20);
    M.hide('#' + H.cross(5, C(10) + 46, 445, 1440), C(11));
    H.stamp(5, 'SEM CURA', C(11) + 14, 1430);
    H.vig('rgba(70,190,60,.75)', [[0, 0], [C(5), 0], [C(5) + 16, .55, 'softInOut'], [C(11), .55], [C(11) + 16, 1, 'softInOut'], [C(12) - 1, 1], [C(12), 0]]);
    // como evitar
    H.check(6, C(12) + 26);
    H.moodle(6, 'tired', 'CANSADO', C(13) + 4, false, C(13) + 40);
    H.moodle(6, 'panic', 'CERCADO', C(13) + 40, false, C(13) + 80);
    H.chip(6, 'ROUPA GROSSA ✓', C(13) + 80, 'left:330px;top:1490px;color:var(--green)');
    H.follow(7, C(14) + 4);
  }
};
