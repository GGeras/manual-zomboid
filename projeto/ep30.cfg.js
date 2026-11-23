// EP 30 — Cadáveres e Mau Cheiro (B42.22) — RASCUNHO AUTOMÁTICO (gerado de roteiros/ep30-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>CADÁVERES</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_DustMask", "Item_GasMask", "Item_Lighter", "Item_Petrol", "Item_Sandbag", "Item_Shovel", "Item_SurgicalMaskBlue"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0, 36.0], END: 40.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9 }],
  titles: [
    { i: 0, a: "O zumbi morto", b: "ainda mata", aSize: 96, size: 128 },
    { i: 1, a: "Quantidade +", b: "tempo", aSize: 96, size: 128 },
    { i: 2, a: "Moscas =", b: "perigo", aSize: 110, size: 128 },
    { i: 3, a: "Vapores", b: "mortais", aSize: 110, size: 128 },
    { i: 4, a: "Nem", b: "dormir", aSize: 110, size: 128 },
    { i: 5, a: "Arrasta", b: "pra longe", col: 'green', aSize: 110, size: 128 },
    { i: 6, a: "Cova:", b: "5 corpos", col: 'green', aSize: 110, size: 128 },
    { i: 7, a: "Ou", b: "queima", col: 'yellow', aSize: 110, size: 128 },
    { i: 8, a: "Máscara", b: "protege", col: 'green', aSize: 110, size: 128 },
    { i: 9, a: "Matou,", b: "limpou", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    H.moodle(0, 'pz:Mood_NoxiousSmell', "MAU CHEIRO", P(0, 0.18), false, null);
    H.moodle(1, 'pz:Mood_Ill', "DOENÇA", P(1, 0.68), false, null);
    tag(1, "QUANTIDADE", '#ffb020', P(1, 0.18), P(1, 0.34));
    tag(1, "DECOMPOSIÇÃO", '#ffb020', P(1, 0.34), P(1, 0.51));
    tag(1, "TEMPO PERTO", '#ff3d55', P(1, 0.51), null);
    H.moodle(2, 'pz:Mood_Ill', "DOENÇA", P(2, 0.18), false, null);
    tag(3, "MAU CHEIRO", '#ffb020', P(3, 0.18), P(3, 0.51));
    tag(3, "\"VOCÊ NÃO CONSEGUE RESPIRAR. SAIA DAQUI!\"", '#ff3d55', P(3, 0.51), null);
    H.moodle(4, 'pz:Mood_NoxiousSmell', "SEM SONO", P(4, 0.18), false, null);
    tag(5, "PEGAR CADÁVER", '#8fe04a', P(5, 0.18), P(5, 0.51));
    tag(5, "CERCA · JANELA", '#ffb020', P(5, 0.51), null);
    row(6, [["Item_Shovel", "PÁ", P(6, 0.18)]]);
    tag(6, "ENTERRAR CADÁVER (5/5)", '#8fe04a', P(6, 0.51), null);
    row(7, [["Item_Petrol", "GASOLINA", P(7, 0.18)], ["Item_Lighter", "FOGO", P(7, 0.40)], ["Item_Sandbag", "PERTO", P(7, 0.62)]]);
    row(8, [["Item_GasMask", "GÁS", P(8, 0.18)], ["Item_SurgicalMaskBlue", "CIRÚRGICA", P(8, 0.40)], ["Item_DustMask", "PÓ", P(8, 0.62)]]);
    row(9, [["Item_Shovel", "", P(9, 0.18)]]);
    tag(9, "SALVA E COMENTA", '#8fe04a', P(9, 0.51), null);
  }
};
