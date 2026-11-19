// EP 07 — Carros: 5 regras pra ter um carro.
const LAB = n => `PROJECT ZOMBOID · CARROS <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 2.80, 4.31, 7.32, 9.03, 14.23, 16.51, 18.98, 22.63, 24.99, 26.79, 30.25, 31.87, 34.03, 36.96, 37.95], END: 40.06,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2 }, { at: 3, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 7, lab: LAB(3) }, { at: 9, lab: LAB(4) }, { at: 11, lab: LAB(5) }, { at: 13, lab: LAB(5) }, { at: 14 }],
  titles: [
    { i: 0, a: 'Um carro pode', b: 'salvar sua run', col: 'green', size: 108 },
    { i: 1, a: 'Ou acabar', b: 'com ela', size: 150 },
    { i: 2, a: '5 regras pra', b: 'ter um carro', size: 116 },
    { i: 3, a: 'Um:', b: 'procure a chave', size: 104 }, { i: 4, a: 'A chave pode', b: 'estar em 4 lugares', col: 'bone', aSize: 96, size: 92 },
    { i: 5, a: 'Dois: sem chave?', b: 'ligação direta', aSize: 88, size: 108 }, { i: 6, a: 'Elétrica 1', b: 'Mecânica 2', col: 'green', size: 124 },
    { i: 7, a: 'Três: se falhar', b: 'alarme pode tocar', aSize: 92, size: 96 }, { i: 8, a: 'A rua inteira', b: 'vem', size: 170 },
    { i: 9, a: 'Quatro:', b: 'confira o painel', size: 104 }, { i: 10, a: 'Sem bateria ou', b: 'gasolina: não liga', aSize: 96, size: 92 },
    { i: 11, a: 'Cinco:', b: 'não atropele', size: 124 }, { i: 12, a: 'Cada batida', b: 'estraga rápido', size: 112 },
    { i: 13, a: 'De ré: destrói', b: 'o porta-malas', aSize: 100, size: 112 },
    { i: 14, a: 'Segue', b: 'o canal' }, { i: 15, a: 'Carro quebrado', b: 'não foge de horda', aSize: 92, size: 96 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const tag = (k, txt, col, at, end, top = 1480) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 54px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    // 0 — fugindo da horda de carro
    tag(0, 'HORDA FICOU PRA TRÁS ✓', '#8fe04a', C(0) + 34, null, 1520);
    // 3 — os 4 lugares da chave, um por vez
    const K = [F[4] + 15, F[4] + 51, F[4] + 84, F[4] + 108];
    ['1 · IGNIÇÃO', '2 · PORTA-LUVAS', '3 · CHÃO PERTO DO CARRO', '4 · ZUMBI POR PERTO'].forEach((t, i) => tag(3, t, '#ffd23a', K[i], i < 3 ? K[i + 1] : null));
    // 4 — ligação direta: níveis exigidos (quadradinhos de nível do jogo)
    const sec = H.sc(4);
    const pn = H.el('div', 'panel', '<div class="ptitle">LIGAÇÃO DIRETA · EXIGE</div>', sec, 'left:60px;top:1330px;width:960px;height:300px'); pn.id = 'skp';
    M.enter('#skp', { at: C(6) + 4, frames: 10, ease: 'snapSettle', from: { y: 120 } });
    [['Elétrica', 1], ['Mecânica', 2]].forEach(([nm, lv], r) => {
      const lb = H.el('div', null, nm, sec, `position:absolute;left:90px;top:${1418 + r * 100}px;font:700 36px/1 var(--mono);color:var(--bone)`); lb.id = 'skl' + r;
      M.enter('#skl' + r, { at: C(6) + 10 + r * 26, frames: 8, from: { x: -40 } });
      for (let q = 0; q < 10; q++) {
        const e = H.el('div', null, null, sec, `position:absolute;left:${470 + q * 52}px;top:${1408 + r * 100}px;width:42px;height:56px;border:4px solid rgba(239,229,207,.6);background:rgba(0,0,0,.4)`); e.id = `sq${r}_${q}`;
        M.enter('#' + e.id, { at: C(6) + 12 + r * 26, frames: 6, from: { scale: .4 } });
        if (q < lv) { const fill = H.el('div', null, null, sec, `position:absolute;left:${474 + q * 52}px;top:${1412 + r * 100}px;width:34px;height:48px;background:#8fe04a`); fill.id = `sf${r}_${q}`;
          M.enter('#' + fill.id, { at: C(6) + 22 + r * 26 + q * 6, frames: 6, ease: 'crashIn', from: { scale: 1.8 } }); }
      }
    });
    tag(4, 'LIGOU ✓', '#8fe04a', C(5) + 112, null, 1660);
    // 5 — falhou: alarme, a rua vem
    M.hide('#' + H.stamp(5, 'FALHOU', C(7) + 46, 1430), C(8));
    H.moodle(5, 'sound', 'ALARME', C(7) + 64);
    H.moodle(5, 'pz:Mood_Panicked', 'PÂNICO', C(8) + 14, false, null, 840);
    tag(5, 'ZUMBIS VINDO', '#ff3d55', C(8) + 10, null, 1500);
    // 6 — painel do carro
    tag(6, 'PAINEL DO CARRO', '#efe5cf', C(9) + 12, null, 1250);
    tag(6, 'MOTOR ✓', '#8fe04a', C(9) + 26, null, 1345);
    tag(6, 'BATERIA: SEM CARGA ✗', '#ff3d55', F[10] + 10, null, 1440);
    tag(6, 'GASOLINA: VAZIO ✗', '#ff3d55', F[10] + 44, null, 1535);
    H.stamp(6, 'NÃO LIGA', F[10] + 70, 1660);
    // 7 — atropelar: estado do carro cai a cada batida
    const hit = [26, 54, 78, 98].map(n => C(11) + n);
    H.bar(7, 'ESTADO DO CARRO', [[0, 1], [hit[0], 1], [hit[0] + 4, .74], [hit[1], .74], [hit[1] + 4, .5], [hit[2], .5], [hit[2] + 4, .28], [hit[3], .28], [hit[3] + 4, .1]],
      { color: '#8fe04a', colorKeys: [[hit[0], '#8fe04a'], [hit[1] + 4, '#ffb020'], [hit[3] + 4, '#ff3d55']], text: 'CAINDO' });
    // 8 — de ré: porta-malas
    const rh = [22, 46, 71].map(n => C(13) + n);
    H.bar(8, 'PORTA-MALAS', [[0, 1], [rh[0], 1], [rh[0] + 4, .6], [rh[1], .6], [rh[1] + 4, .25], [rh[2], .25], [rh[2] + 4, 0]],
      { color: '#ffb020', colorKeys: [[rh[0], '#ffb020'], [rh[2] + 4, '#ff3d55']], text: 'ESPAÇO' });
    H.stamp(8, 'DESTRUÍDO', rh[2] + 8, 1430);
    // 9 — CTA
    H.follow(9, C(14) + 4);
  }
};
