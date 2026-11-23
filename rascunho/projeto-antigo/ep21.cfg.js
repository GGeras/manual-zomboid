// EP 21 — Forrageamento (fonte B42.19, mais recente com números) — RASCUNHO
const LAB = 'PROJECT ZOMBOID · <b>FORRAGEAMENTO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_Magazine', 'Item_Branch', 'Item_Flint', 'Item_BerryBlue', 'Item_MushroomButton', 'Item_Grasshopper', 'Item_BerryGeneric2', 'Item_LemonGrass', 'Item_MushroomDeathCap'],
  OFF: 1.3,
  T: [0.0, 4.0, 9.69, 16.12, 22.71, 27.3, 30.37, 33.89, 37.97, 40.81], END: 43.79,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9 }],
  titles: [
    { i: 0, a: 'O mato', b: 'tem comida', col: 'green', size: 140 },
    { i: 1, a: 'Modo de', b: 'busca', col: 'green', size: 160 },
    { i: 2, a: 'Raio: 3', b: 'até 10', aSize: 120, size: 160 },
    { i: 3, a: 'Chuva e escuro', b: 'encolhem', aSize: 96, size: 140 },
    { i: 4, a: 'Correndo não,', b: 'agachado sim', aSize: 100, size: 112 },
    { i: 5, a: 'Desde', b: 'o nível 0', col: 'green', size: 140 },
    { i: 6, a: 'Frutinha igual', b: 'pode envenenar', aSize: 96, size: 104 },
    { i: 7, a: 'Herbalista', b: 'reconhece', col: 'green', size: 132 },
    { i: 8, a: 'Neve esconde', b: 'comida', aSize: 100, size: 150 },
    { i: 9, a: 'Devagar,', b: 'olho no chão', col: 'green', size: 120 }
  ],
  extras(H) {
    const { F, C, M } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    tag(2, 'FORRAGEAMENTO 0 → 10', G, C(2) + 20, null, 1320);
    tag(3, 'CHUVA · ESCURO', Y, C(3) + 20, null, 1320);
    tag(4, 'AGACHADO +10%', G, F[4] + 70, null, 1320);
    H.items(5, [['Item_Branch', 'GALHO', C(5) + 6], ['Item_Flint', 'PEDRA', C(5) + 18], ['Item_BerryBlue', 'FRUTINHA', C(5) + 30]], { top: 1290, size: 180, gap: 40 });
    H.items(6, [['Item_BerryBlue', '?', C(6) + 10], ['Item_MushroomDeathCap', '?', C(6) + 30]], { top: 1290, size: 200, gap: 90 });
    tag(6, 'PODE SER VENENO', RD, C(6) + 50, null);
    row(7, [['Item_Magazine', 'REVISTA', F[7] + 30]], { size: 200 });
    tag(7, 'HERBALISTA ✓', G, C(7) + 30, null, 1560);
  }
};
