// EP 09 — Água: 5 regras pra nunca faltar água.
const LAB = n => `PROJECT ZOMBOID · ÁGUA <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 2.14, 4.31, 7.79, 11.73, 14.18, 17.63, 19.47, 21.91, 23.78, 25.16, 28.87, 31.40, 33.55, 35.70, 37.11, 38.06], END: 39.99,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2 }, { at: 3, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 7, lab: LAB(3) }, { at: 9, lab: LAB(4) }, { at: 11, lab: LAB(5) }, { at: 13, lab: LAB(5) }, { at: 15 }],
  titles: [
    { i: 0, a: 'Um dia a', b: 'torneira para', col: 'bone', size: 120 },
    { i: 1, a: 'Esteja', b: 'pronto', size: 150 },
    { i: 2, a: '5 regras pra', b: 'nunca faltar água', size: 96 },
    { i: 3, a: 'Um: água e luz', b: 'caem até o dia 30', aSize: 92, size: 96 }, { i: 4, a: 'E o jogo', b: 'não avisa', size: 140 },
    { i: 5, a: 'Dois: pia e banheira', b: 'guardam um resto', col: 'green', aSize: 82, size: 104 }, { i: 6, a: 'Use esse', b: 'primeiro', col: 'green', size: 140 },
    { i: 7, a: 'Três: rio e lago', b: 'contaminados', aSize: 92, size: 112 }, { i: 8, a: 'Beber assim', b: 'te deixa doente', size: 108 },
    { i: 9, a: 'Quatro:', b: 'ferva', col: 'green', size: 170 }, { i: 10, a: 'Até sumir o aviso', b: 'de contaminada', col: 'green', aSize: 84, size: 104 },
    { i: 11, a: 'Cinco: coletor', b: 'de chuva', col: 'green', aSize: 100, size: 140 }, { i: 12, a: 'Tábuas, pregos', b: 'e sacos de lixo', col: 'bone', aSize: 96, size: 104 },
    { i: 13, a: 'A chuva também', b: 'é contaminada', aSize: 92, size: 108 }, { i: 14, a: 'Ferva antes', b: 'de beber', col: 'green', size: 130 },
    { i: 15, a: 'Segue', b: 'o canal' }, { i: 16, a: 'Sede mata mais', b: 'rápido que zumbi', aSize: 96, size: 100 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const tag = (k, txt, col, at, end, top = 1480) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 54px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    // 0 — torneira para
    tag(0, 'ÁGUA CORTADA', '#ff3d55', C(0) + 52, null, 1500);
    // 2 — sede
    H.moodle(2, 'pz:Status_Thirst', 'SEDE', C(2) + 16);
    // 3 — calendário: dia 0 .. 30 rolando; para em "?"
    const cal = H.el('div', 'big', '', H.sc(3), 'top:1270px;font-size:170px;letter-spacing:-6px;color:#efe5cf;text-shadow:0 8px 0 rgba(0,0,0,.55),0 0 30px #000'); cal.id = 'cal';
    M.enter('#cal', { at: C(3) + 8, frames: 8, ease: 'snapSettle', from: { scale: .6 } });
    for (let d = 0; d <= 30; d++) { const s = H.el('span', null, 'DIA ' + d, cal, 'position:absolute;left:0;right:0;opacity:0'); s.id = 'cd' + d;
      const a = C(3) + 10 + Math.round(d * 2.6); M.kf('#cd' + d, 'opacity', [[0, 0], [a - 1, 0], [a, 1], [a + (d < 30 ? 2 : 999), d < 30 ? 0 : 1]]); }
    tag(3, 'ÁGUA + LUZ: ENTRE DIA 0 E 30', '#efe5cf', C(3) + 14, null, 1500);
    M.hide('#cal', F[4] + 2);
    H.big(3, '?', F[4] + 4, 'top:1240px;font-size:260px;color:#ff3d55;text-shadow:0 10px 0 rgba(0,0,0,.6),0 0 40px #000');
    // 4 — resto de água
    H.panel(4, 'DEPOIS DO CORTE', [['Pia', 'UM RESTO ✓', 'color:var(--green)'], ['Banheira', 'UM RESTO ✓', 'color:var(--green)'], ['Vaso', 'UM RESTO ✓', 'color:var(--green)']], C(5) + 22, { style: 'top:1290px;left:200px;width:680px', gap: 14 });
    H.check(4, C(6) + 14, 445, 1640);
    // 5 — rio contaminado -> doente
    tag(5, '☣ CONTAMINADA', '#b5d43a', C(7) + 30, null, 1480);
    H.moodle(5, 'pz:Mood_Ill', 'DOENTE', C(8) + 26);
    H.vig('rgba(70,140,30,.7)', [[0, 0], [C(8), 0], [C(8) + 40, .6, 'softInOut'], [C(9) - 1, .6], [C(9), 0]]);
    // 6 — ferver: contaminada -> limpa
    H.bar(6, 'FERVENDO', [[0, 0], [C(9) + 14, 0], [F[10] + 70, 1, 'softInOut']], { color: '#ffb020', colorKeys: [[C(9) + 14, '#ffb020'], [F[10] + 70, '#8fe04a']], text: '' });
    tag(6, '☣ CONTAMINADA', '#b5d43a', C(9) + 18, F[10] + 72, 1360);
    tag(6, 'LIMPA ✓', '#8fe04a', F[10] + 74, null, 1360);
    tag(6, 'FOGÃO OU FOGUEIRA', '#efe5cf', F[10] + 8, null, 1660);
    // 7 — construir coletor: materiais um por vez
    [['TÁBUAS', F[12] + 2], ['PREGOS', F[12] + 22], ['SACOS DE LIXO', F[12] + 38]].forEach(([t, a], i) => tag(7, t + ' ✓', '#efe5cf', a, null, 1300 + i * 100));
    H.moodle(7, 'pz:Mood_Concentrating', 'CARPINTARIA', C(11) + 20, true);
    // 8 — chuva contaminada -> ferva
    tag(8, '☣ CHUVA CONTAMINADA', '#b5d43a', C(13) + 24, C(14), 1480);
    tag(8, 'FERVA ✓', '#8fe04a', C(14) + 10, null, 1480);
    // 9 — CTA
    H.follow(9, C(15) + 4);
    H.moodle(9, 'pz:Status_Thirst', 'SEDE', C(16) + 10);
  }
};
