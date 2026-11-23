// EP 22 — Fadiga muscular (mecânica da Build 42; fonte sem números) — RASCUNHO
const LAB = 'PROJECT ZOMBOID · <b>FADIGA MUSCULAR</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_BaseballBat', 'Item_Axe', 'Item_Crowbar', 'Item_PillsPainkiller'],
  OFF: 1.3,
  T: [0.0, 2.96, 6.7, 10.43, 15.38, 21.21, 26.1, 30.88, 35.87], END: 38.57,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, red: 1 }],
  titles: [
    { i: 0, a: 'Seu braço', b: 'cansa', size: 160 },
    { i: 1, a: 'Cada golpe', b: 'acumula', aSize: 110, size: 140 },
    { i: 2, a: 'Mais lento', b: 'e com dor', size: 140 },
    { i: 3, a: 'Longa e pesada', b: 'cansa mais', aSize: 96, size: 124 },
    { i: 4, a: 'Pernas, costas', b: 'e pescoço', aSize: 100, size: 124 },
    { i: 5, a: 'Analgésico', b: 'não acelera', aSize: 110, size: 124 },
    { i: 6, a: 'Força e prática', b: 'seguram', col: 'green', aSize: 96, size: 140 },
    { i: 7, a: 'Golpe e pisão,', b: 'poucos por vez', col: 'green', aSize: 100, size: 112 },
    { i: 8, a: 'Descansa', b: 'pra passar', col: 'green', size: 140 }
  ],
  extras(H) {
    const { F, C, M } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    H.bar(1, 'TENSÃO DO BRAÇO', [[0, .1], [C(1) + 10, .1], [F[1] + 80, .7]], { color: Y, colorKeys: [[C(1), G], [F[1] + 80, RD]], text: '' });
    tag(2, 'ATAQUE ↓  DOR ↑', RD, C(2) + 20, null, 1320);
    H.items(3, [['Item_Axe', 'CANSA +', C(3) + 10], ['Item_BaseballBat', 'CANSA −', F[3] + 50]], { top: 1290, size: 200, gap: 90 });
    tag(4, 'PERNAS · COSTAS', B, C(4) + 30, null, 1320); tag(4, 'PESCOÇO', B, F[4] + 90, null, 1440);
    H.items(5, [['Item_PillsPainkiller', 'DOR ✓  VELOCIDADE ✗', C(5) + 10]], { top: 1290, size: 260 });
    tag(6, 'FORÇA + PRÁTICA', G, C(6) + 30, null, 1320);
    tag(7, 'POUCOS POR VEZ', G, F[7] + 60, null, 1320);
  }
};
