// EP 29 — Fogo e Incêndio (B42.22) — RASCUNHO AUTOMÁTICO v2 (gerado de roteiros/ep29-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>FOGO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Bucket_Water", "Item_Extinguisher", "Item_Gravelbag", "Item_Rock", "Item_Sandbag", "Item_WaterBottle"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0], END: 32.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7 }],
  titles: [
    { i: 0, a: "Fogão esquecido", b: "queima tudo", aSize: 96, size: 128 },
    { i: 1, a: "O fogo", b: "se espalha", aSize: 110, size: 128 },
    { i: 2, a: "Desliga", b: "o fogão", aSize: 110, size: 128 },
    { i: 3, a: "Zumbi em chamas", b: "espalha", aSize: 96, size: 128 },
    { i: 4, a: "Extintor:", b: "apagar fogo", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Areia", b: "também apaga", col: 'green', aSize: 110, size: 128 },
    { i: 6, a: "3 pedras,", b: "até 8 horas", col: 'yellow', aSize: 110, size: 128 },
    { i: 7, a: "Extintor", b: "sempre perto", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    H.el('style', null, '.moodle{left:760px;width:170px;height:170px}.mtag{left:700px;width:290px;font-size:30px;margin-top:40px}', document.head);
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    tag(1, "PROPAGAÇÃO DO FOGO: LIGADA", '#ff3d55', P(1, 0.18), null);
    tag(2, "\"A MENOS QUE QUEIRA COZINHAR SUA CASA\"", '#efe5cf', P(2, 0.18), null);
    tag(3, "EM CHAMAS", '#ff3d55', P(3, 0.18), null);
    row(4, [["Item_Extinguisher", "EXTINTOR", P(4, 0.18)]]);
    tag(4, "APAGAR FOGO", '#8fe04a', P(4, 0.51), null);
    row(5, [["Item_Sandbag", "AREIA ✓", P(5, 0.18)], ["Item_Gravelbag", "CASCALHO ✓", P(5, 0.34)], ["Item_Bucket_Water", "BALDE ✓", P(5, 0.51)], ["Item_WaterBottle", "GOLE ✗", P(5, 0.68)]]);
    row(6, [["Item_Rock", "3 PEDRAS", P(6, 0.18)]]);
    tag(6, "MÁXIMO 8H DE COMBUSTÍVEL", '#ffb020', P(6, 0.51), null);
    row(7, [["Item_Extinguisher", "", P(7, 0.18)], ["Item_Sandbag", "", P(7, 0.40)]]);
    tag(7, "SALVA E COMENTA", '#8fe04a', P(7, 0.62), null);
  }
};
