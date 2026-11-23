// EP 27 — Resfriado e Doença (B42.22) — RASCUNHO AUTOMÁTICO (gerado de roteiros/ep27-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>RESFRIADO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_CommonMallow", "Item_LemonGrass", "Item_Soap", "Item_Tissue"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0, 36.0], END: 40.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9 }],
  titles: [
    { i: 0, a: "Um espirro", b: "e a horda vem", aSize: 110, size: 128 },
    { i: 1, a: "Frio e molhado:", b: "resfriado", aSize: 96, size: 128 },
    { i: 2, a: "Nariz escorrendo", b: "até terrível", aSize: 96, size: 128 },
    { i: 3, a: "Espirro", b: "atrai zumbi", aSize: 110, size: 128 },
    { i: 4, a: "Lenço", b: "abafa", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Doença:", b: "até febre", aSize: 110, size: 128 },
    { i: 6, a: "Cozinha", b: "direito", col: 'green', aSize: 110, size: 128 },
    { i: 7, a: "Corpo", b: "limpo", col: 'green', aSize: 110, size: 128 },
    { i: 8, a: "Resiliente", b: "adoece menos", col: 'green', aSize: 110, size: 128 },
    { i: 9, a: "Seco, limpo", b: "e com malva", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    row(0, [["Item_Tissue", "", P(0, 0.18)]]);
    H.moodle(1, 'pz:Status_Wet', "MOLHADO", P(1, 0.18), false, P(1, 0.51));
    H.moodle(1, 'pz:Status_TemperatureLow', "FRIO", P(1, 0.51), false, null);
    tag(2, "NARIZ ESCORRENDO", '#ffb020', P(2, 0.18), P(2, 0.40));
    tag(2, "RESFRIADO TERRÍVEL", '#ff3d55', P(2, 0.40), P(2, 0.62));
    tag(2, "ESPIRRO → TOSSE → LENTO", '#ff3d55', P(2, 0.62), null);
    tag(3, "BARULHO → ZUMBI", '#ff3d55', P(3, 0.18), null);
    row(4, [["Item_Tissue", "ABAFA ✓", P(4, 0.18)], ["Item_CommonMallow", "ALIVIA ✓", P(4, 0.51)]]);
    H.moodle(5, 'pz:Mood_Ill', "DOENÇA", P(5, 0.18), false, P(5, 0.40));
    H.moodle(5, 'pz:Mood_Nauseous', "NÁUSEA", P(5, 0.40), false, null);
    tag(5, "\"VIRAR COMIDA DE RATO\"", '#ff3d55', P(5, 0.62), null);
    row(6, [["Item_LemonGrass", "CAPIM-LIMÃO ✓", P(6, 0.18)]]);
    row(7, [["Item_Soap", "SABÃO", P(7, 0.18)]]);
    tag(7, "FERIDA SUJA INFECCIONA", '#ff3d55', P(7, 0.51), null);
    tag(8, "RESILIENTE −", '#8fe04a', P(8, 0.18), P(8, 0.51));
    tag(8, "BAIXA IMUNIDADE +", '#ff3d55', P(8, 0.51), null);
    row(9, [["Item_CommonMallow", "", P(9, 0.18)]]);
    tag(9, "SALVA E COMENTA", '#8fe04a', P(9, 0.51), null);
  }
};
