// EP 20 — Sono (B42.22) — RASCUNHO
const LAB = 'PROJECT ZOMBOID · <b>SONO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_PillsPainkiller', 'Item_PillsSleeping', 'Item_InstantCoffee', 'Item_Bedframe'],
  OFF: 1.3,
  T: [0.0, 2.65, 7.88, 13.05, 18.36, 22.81, 28.07, 32.79, 37.41], END: 41.28,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: 'Dormir mal', b: 'te mata', size: 150 },
    { i: 1, a: 'O cansaço', b: 'só piora', aSize: 110, size: 140 },
    { i: 2, a: 'Sentar não', b: 'tira cansaço', aSize: 110, size: 116 },
    { i: 3, a: 'Cama boa:', b: 'menos horas', col: 'green', aSize: 110, size: 120 },
    { i: 4, a: 'Zumbi, pânico', b: 'ou dor: sem sono', aSize: 96, size: 100 },
    { i: 5, a: 'Novo na 42.22:', b: 'mau cheiro', aSize: 96, size: 124 },
    { i: 6, a: 'Analgésico', b: 'antes', col: 'green', size: 150 },
    { i: 7, a: 'Café não', b: 'é cama', size: 150 },
    { i: 8, a: 'Cama boa', b: 'é base', col: 'green', size: 150 }
  ],
  extras(H) {
    const { F, C, M } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    tag(1, 'CANSADO', Y, C(1) + 30, null, 1320); tag(1, 'RIDICULAMENTE CANSADO', RD, F[1] + 40, null, 1460);
    tag(2, 'FÔLEGO ✓  CANSAÇO ✗', B, C(2) + 30, null, 1320);
    tag(3, 'CAMA BOA = MENOS HORAS', G, C(3) + 30, null, 1320);
    tag(3, 'CHÃO = DOR NO PESCOÇO', RD, F[3] + 90, null, 1440);
    tag(4, 'ZUMBI · PÂNICO · DOR', RD, C(4) + 20, null, 1320);
    tag(5, 'MAU CHEIRO ✗', RD, C(5) + 40, null, 1320);
    tag(5, 'FUMAÇA · CADÁVER', B, F[5] + 60, null, 1440);
    H.items(6, [['Item_PillsPainkiller', 'DOR', C(6) + 10], ['Item_PillsSleeping', 'DOSE ALTA', F[6] + 60]], { top: 1290, size: 200, gap: 90 });
    H.items(7, [['Item_InstantCoffee', 'CAFÉ', C(7) + 10]], { top: 1290, size: 210 });
    tag(7, 'SÓ UM TEMPINHO', Y, C(7) + 40, null);
  }
};
