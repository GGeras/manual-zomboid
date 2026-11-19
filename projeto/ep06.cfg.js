// EP 06 — Comida que estraga: 5 regras pra não passar fome nem ficar doente.
const LAB = n => `PROJECT ZOMBOID · COMIDA <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 2.03, 3.93, 7.24, 9.72, 13.14, 16.53, 17.94, 20.03, 22.92, 24.54, 28.60, 30.27, 32.83, 34.00, 34.99], END: 36.71,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2 }, { at: 3, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 6, lab: LAB(3) }, { at: 8, lab: LAB(4) }, { at: 10, lab: LAB(5) }, { at: 12, lab: 'PROJECT ZOMBOID · <b>NÃO ESTRAGA</b>' }, { at: 14 }],
  titles: [
    { i: 0, a: 'No Project', b: 'Zomboid...', col: 'bone', size: 128 },
    { i: 1, a: 'Comida', b: 'também mata', size: 140 },
    { i: 2, a: '5 regras:', b: 'fome e doença', size: 116 },
    { i: 3, a: 'Um:', b: 'fresca estraga', size: 112 }, { i: 4, a: 'Fica velha...', b: 'depois podre', size: 116 },
    { i: 5, a: 'Dois: geladeira', b: 'dura o dobro', col: 'green', aSize: 88, size: 116 },
    { i: 6, a: 'Três:', b: 'freezer congela', size: 106 }, { i: 7, a: 'Congelada', b: 'para de estragar', col: 'green', size: 100 },
    { i: 8, a: 'Quatro: luz caiu?', b: 'geladeira para', aSize: 86, size: 112 }, { i: 9, a: 'Coma os perecíveis', b: 'primeiro', col: 'green', aSize: 80, size: 124 },
    { i: 10, a: 'Cinco: podre', b: 'te deixa doente', aSize: 92, size: 104 }, { i: 11, a: 'Cozinhar', b: 'não resolve' },
    { i: 12, a: 'Lata fechada e seca', b: 'não estragam', col: 'green', aSize: 80, size: 116 }, { i: 13, a: 'Guarde', b: 'pra depois', col: 'green' },
    { i: 14, a: 'Segue', b: 'o canal' }, { i: 15, a: 'O próximo pode', b: 'salvar sua run', size: 108 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const tag = (k, txt, col, at, end, top = 1480) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 54px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    // 0/2 — fome e doença
    H.moodle(2, 'food', 'FOME', C(2) + 14);
    H.moodle(2, 'sick', 'DOENTE', C(2) + 30, false, null, 840);
    // 3 — fresco -> velho -> podre
    const rot = F[4] + 58;
    tag(3, 'FRESCO', '#8fe04a', C(3) + 12, C(4));
    tag(3, 'VELHO', '#ffb020', C(4) + 4, rot);
    tag(3, 'PODRE', '#ff3d55', rot, null);
    // 4 — geladeira: 2x
    const sec4 = H.sc(4);
    [['FORA', .42, '#c9bfa8', 0], ['GELADEIRA', .84, '#8fe04a', 1]].forEach(([nm, w, col, r]) => {
      const lb = H.el('div', 'bartag', nm, sec4, `left:120px;top:${1440 + r * 110}px;color:var(--bone)`); lb.id = 'fl' + r;
      const bg = H.el('div', null, `<i id="fb${r}" style="display:block;height:100%;background:${col};transform-origin:0 50%"></i>`, sec4, `position:absolute;left:420px;top:${1428 + r * 110}px;width:540px;height:52px;border:5px solid var(--bone);padding:4px;background:rgba(0,0,0,.5)`); bg.id = 'fbg' + r;
      M.enter('#fl' + r, { at: C(5) + 30 + r * 8, frames: 8, from: { x: -40 } }); M.enter('#fbg' + r, { at: C(5) + 30 + r * 8, frames: 8, from: { x: -40 } });
      M.kf('#fb' + r, 'scaleX', [[0, 0], [C(5) + 38 + r * 8, 0], [C(5) + 62 + r * 8, w, 'softLand']]);
    });
    H.chip(4, '2x', C(5) + 70, 'left:880px;top:1300px;color:var(--green);font-size:64px');
    H.moodle(4, 'fridge', 'LIGADA', C(5) + 16, true);
    // 5 — freezer
    H.moodle(5, 'snow', 'CONGELADO', C(6) + 26, true);
    tag(5, '❄ ESTRAGAR: PAUSADO', '#7fd4ff', C(7) + 8, null);
    // 6 — luz caiu
    H.moodle(6, 'bolt', 'SEM LUZ', C(8) + 14);
    H.bar(6, 'ESTRAGANDO', [[0, .2], [C(8) + 20, .2], [C(9), .85, 'softInOut']], { color: '#ff3d55', text: 'RÁPIDO' });
    H.check(6, C(9) + 30, 445, 1300);
    H.vig('rgba(0,0,0,.8)', [[0, 0], [C(8) - 1, 0], [C(8), .8], [C(10) - 1, .8], [C(10), 0]]);
    // 7 — podre: menos fome, doente; cozinhar não resolve
    H.moodle(7, 'sick', 'ENJOADO', C(10) + 40);
    H.bar(7, 'FOME SACIADA', [[0, 0], [C(10) + 36, 0], [C(10) + 56, .32, 'softLand']], { color: '#ffb020', text: '< METADE' });
    H.stamp(7, 'AINDA PODRE', C(11) + 26, 1250);
    H.vig('rgba(70,140,30,.7)', [[0, 0], [C(10) - 1, 0], [C(10), 0], [C(10) + 50, .6, 'softInOut'], [C(12) - 1, .6], [C(12), 0]]);
    // 8 — não estragam
    H.panel(8, 'NÃO ESTRAGAM', [['Lata fechada', '✓', 'color:var(--green)'], ['Arroz / macarrão', '✓', 'color:var(--green)'], ['Lata aberta', '✗', 'color:var(--red2)']], C(12) + 20, { style: 'top:1300px;left:280px;width:520px', gap: 10 });
    H.check(8, C(13) + 6, 445, 1560);
    // 9 — CTA
    H.follow(9, C(14) + 4);
  }
};
