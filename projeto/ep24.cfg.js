// EP 24 — Pânico e Estresse (B42.22) — RASCUNHO AUTOMÁTICO (gerado de roteiros/ep24-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>PÂNICO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Book", "Item_Cigarette", "Item_ComicBook", "Item_Magazine", "Item_PillsBetablocker"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0], END: 36.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: "Mão treme,", b: "tiro torto", aSize: 110, size: 128 },
    { i: 1, a: "Nervosismo", b: "até Terror", aSize: 110, size: 128 },
    { i: 2, a: "Pânico e cansaço:", b: "erra mais", aSize: 96, size: 128 },
    { i: 3, a: "Estresse", b: "também", aSize: 110, size: 128 },
    { i: 4, a: "Calmantes", b: "reduzem o pânico", col: 'green', aSize: 110, size: 100 },
    { i: 5, a: "Leitura", b: "acalma", col: 'green', aSize: 110, size: 128 },
    { i: 6, a: "Corajoso ou", b: "Covarde?", aSize: 110, size: 128 },
    { i: 7, a: "Rua ou", b: "quartinho", col: 'yellow', aSize: 110, size: 128 },
    { i: 8, a: "Calma na mão,", b: "tiro na cabeça", col: 'green', aSize: 96, size: 100 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    H.moodle(0, 'pz:Mood_Panicked', "PÂNICO", P(0, 0.18), false, null);
    tag(1, "NERVOSISMO", '#ffb020', P(1, 0.18), P(1, 0.40));
    tag(1, "\"MÃOS TRÊMULAS\"", '#ff3d55', P(1, 0.40), P(1, 0.62));
    tag(1, "TERROR", '#ff3d55', P(1, 0.62), null);
    H.moodle(2, 'pz:Mood_Panicked', "PÂNICO", P(2, 0.18), false, P(2, 0.51));
    H.moodle(2, 'pz:Mood_Sleepy', "SONO", P(2, 0.51), false, null);
    H.moodle(3, 'pz:Mood_Stressed', "ESTRESSE", P(3, 0.18), false, null);
    tag(3, "\"IMPOSSÍVEL PENSAR DIREITO\"", '#ff3d55', P(3, 0.51), null);
    row(4, [["Item_PillsBetablocker", "CALMANTES", P(4, 0.18)]]);
    row(5, [["Item_Book", "1º", P(5, 0.18)], ["Item_ComicBook", "2º", P(5, 0.34)], ["Item_Magazine", "3º", P(5, 0.51)], ["Item_Cigarette", "FUMANTE", P(5, 0.68)]]);
    tag(6, "CORAJOSO −", '#8fe04a', P(6, 0.18), P(6, 0.40));
    tag(6, "COVARDE +", '#ff3d55', P(6, 0.40), P(6, 0.62));
    tag(6, "DESSENSIBILIZAÇÃO", '#8fe04a', P(6, 0.62), null);
    H.moodle(7, 'pz:Mood_Panicked', "PÂNICO", P(7, 0.62), false, null);
    tag(7, "AGORAFÓBICO: AO AR LIVRE", '#ffb020', P(7, 0.18), P(7, 0.40));
    tag(7, "CLAUSTROFÓBICO: LUGAR FECHADO", '#ffb020', P(7, 0.40), null);
    tag(8, "SALVA E COMENTA", '#8fe04a', P(8, 0.18), null);
  }
};
