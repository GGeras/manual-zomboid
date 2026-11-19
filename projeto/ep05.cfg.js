// EP 05 — Furtividade: 5 regras pra passar sem ser visto.
const LAB = n => `PROJECT ZOMBOID · FURTIVIDADE <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 2.79, 4.31, 6.96, 8.82, 12.78, 13.80, 17.00, 18.25, 21.21, 22.94, 24.59, 26.48, 28.31, 30.66, 32.92, 35.35, 36.36], END: 38.21,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2 }, { at: 3, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 7, lab: LAB(3) }, { at: 9, lab: LAB(4) }, { at: 12, lab: LAB(5) }, { at: 14, lab: 'PROJECT ZOMBOID · <b>HABILIDADES</b>' }, { at: 16 }],
  titles: [
    { i: 0, a: 'Zumbis não te', b: 'acham por acaso', aSize: 92, size: 104 },
    { i: 1, a: 'Você se', b: 'entrega', size: 150 },
    { i: 2, a: '5 regras pra', b: 'não ser visto', size: 116 },
    { i: 3, a: 'Um:', b: 'ande agachado', size: 112 }, { i: 4, a: 'Agachado:', b: '1/5 do barulho', col: 'green', size: 112 },
    { i: 5, a: 'Dois:', b: 'não corra' }, { i: 6, a: 'Correr chama', b: 'a rua inteira', size: 112 },
    { i: 7, a: 'Três:', b: 'passe por trás', size: 116 }, { i: 8, a: 'Ele vê na frente', b: 'não nas costas', col: 'green', aSize: 90, size: 110 },
    { i: 9, a: 'Quatro:', b: 'use o escuro', size: 116 }, { i: 10, a: 'De noite', b: 'veem menos', col: 'bone' }, { i: 11, a: 'Lanterna acesa', b: 'te entrega', aSize: 92 },
    { i: 12, a: 'Cinco:', b: 'use as árvores', size: 112 }, { i: 13, a: 'Mato e cerca', b: 'cortam a visão', col: 'green', size: 112 },
    { i: 14, a: 'Treine', b: 'Furtividade', col: 'green', size: 120 }, { i: 15, a: 'Nível maior', b: 'menos te notam', size: 98 },
    { i: 16, a: 'Segue', b: 'o canal' }, { i: 17, a: 'Quem não é visto', b: 'não é mordido', col: 'green', aSize: 92, size: 112 }
  ],
  extras(H) {
    const { F, C, M } = H;
    // 0 — passos altos: o zumbi ouve
    H.moodle(0, 'sound', 'PASSOS', C(0) + 30, false, null, 1280);
    // 2 — agachado entre zumbis
    H.chip(2, 'SEM SER VISTO ✓', C(2) + 24, 'left:330px;top:1520px;color:var(--green)');
    // 3 — agachar: tecla C, som dos passos 100% -> ~20%
    H.chip(3, '[ C ] AGACHAR', C(3) + 10, 'left:60px;top:640px;color:var(--bone)');
    H.moodle(3, 'sneak', 'AGACHADO', C(3) + 16, true);
    H.bar(3, 'SOM DOS PASSOS', [[0, 1], [C(4) + 8, 1], [C(4) + 30, .2, 'softLand']], { color: 'var(--red2)', colorKeys: [[C(4) + 8, '#ff3d55'], [C(4) + 30, '#8fe04a']], count: { at: C(4) + 8, from: 100, to: 20, frames: 22, round: true, format: v => '~' + v + '%' } });
    // 4 — correr
    H.moodle(4, 'sound', 'BARULHO', C(5) + 12);
    H.chip(4, 'ZUMBIS VINDO', C(6) + 26, 'left:60px;top:640px;color:var(--red2)');
    // 5 — cone de visão
    H.chip(5, 'FRENTE: VÊ', C(8) + 6, 'left:70px;top:1500px;color:var(--red2)');
    H.chip(5, 'COSTAS: NÃO VÊ ✓', C(8) + 18, 'left:500px;top:1500px;color:var(--green)');
    // 6 — escuro / lanterna
    H.chip(6, 'NOITE: VISÃO CURTA ✓', C(10) + 8, 'left:250px;top:1500px;color:var(--green)');
    H.moodle(6, 'panic', 'VISTO', C(11) + 14);
    H.vig('rgba(0,0,0,.85)', [[0, 0], [C(9) - 1, 0], [C(9), .9], [C(12) - 1, .9], [C(12), 0]]);
    // 7 — árvore/mato e cerca alta
    M.hide('#' + H.chip(7, 'ÁRVORE + MATO ✓', C(12) + 26, 'left:330px;top:1500px;color:var(--green)'), C(13));
    H.chip(7, 'CERCA ALTA ✓', C(13) + 24, 'left:385px;top:1500px;color:var(--green)');
    // 8 — habilidades: quadradinhos de nível (estilo do jogo)
    const sec = H.sc(8);
    const pn = H.el('div', 'panel', '<div class="ptitle">HABILIDADES</div>', sec, 'left:60px;top:1330px;width:960px;height:300px'); pn.id = 'skp';
    M.enter('#skp', { at: C(14) + 6, frames: 10, ease: 'snapSettle', from: { y: 120 } });
    ['Furtividade', 'Passos Leves'].forEach((nm, r) => {
      const lb = H.el('div', null, nm, sec, `position:absolute;left:90px;top:${1418 + r * 100}px;font:700 36px/1 var(--mono);color:var(--bone)`); lb.id = 'skl' + r;
      M.enter('#skl' + r, { at: C(14) + 12 + r * 6, frames: 8, from: { x: -40 } });
      for (let q = 0; q < 10; q++) {
        const e = H.el('div', null, null, sec, `position:absolute;left:${470 + q * 52}px;top:${1408 + r * 100}px;width:42px;height:56px;border:4px solid rgba(239,229,207,.6);background:rgba(0,0,0,.4)`); e.id = `sq${r}_${q}`;
        const fill = H.el('div', null, null, sec, `position:absolute;left:${474 + q * 52}px;top:${1412 + r * 100}px;width:34px;height:48px;background:#8fe04a`); fill.id = `sf${r}_${q}`;
        M.enter('#' + e.id, { at: C(14) + 14 + r * 6, frames: 6, from: { scale: .4 } });
        M.enter('#' + fill.id, { at: C(14) + 30 + q * 4 + r * 8, frames: 6, ease: 'crashIn', from: { scale: 1.8 } });
      }
    });
    H.chip(8, 'TE NOTAM MENOS ✓', C(15) + 8, 'left:330px;top:1660px;color:var(--green)');
    // 9 — CTA
    H.follow(9, C(16) + 4);
    H.moodle(9, 'sneak', 'FURTIVO', C(17) + 6, true);
  }
};
