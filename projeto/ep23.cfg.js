// EP 23 — Carga e Peso (B42.22) — RASCUNHO AUTOMÁTICO v2 (gerado de roteiros/ep23-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>CARGA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_AliceBag", "Item_Backpack", "Item_Backpack_Black", "Item_BigHiking_Green", "Item_Hiking_Green"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0], END: 36.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: "Pegar tudo", b: "te mata", aSize: 110, size: 128 },
    { i: 1, a: "Força e", b: "moodles", aSize: 110, size: 128 },
    { i: 2, a: "Sobrecarga:", b: "te machuca", aSize: 110, size: 128 },
    { i: 3, a: "Costas e", b: "cercas", aSize: 110, size: 128 },
    { i: 4, a: "Mochila", b: "nas costas", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Militar:", b: "reduz 85%", col: 'green', aSize: 110, size: 128 },
    { i: 6, a: "Movimento", b: "restrito", col: 'yellow', aSize: 110, size: 128 },
    { i: 7, a: "Forte", b: "carrega mais", col: 'green', aSize: 110, size: 128 },
    { i: 8, a: "Só o que", b: "precisa", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    H.el('style', null, '.moodle{left:760px;width:170px;height:170px}.mtag{left:700px;width:290px;font-size:30px;margin-top:40px}', document.head);
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    H.moodle(0, 'pz:Status_HeavyLoad', "CARGA", P(0, 0.18), false, null, 560);
    H.moodle(1, 'pz:Status_Hunger', "FOME", P(1, 0.34), false, P(1, 0.51), 560);
    H.moodle(1, 'pz:Status_Thirst', "SEDE", P(1, 0.51), false, P(1, 0.68), 560);
    H.moodle(1, 'pz:Mood_Ill', "DOENÇA", P(1, 0.68), false, null, 560);
    tag(1, "LIMITE = FORÇA + MOODLES", '#ffb020', P(1, 0.18), null);
    tag(2, "CARGA PESADA", '#ffb020', P(2, 0.18), P(2, 0.40));
    tag(2, "SOBRECARGA EXTREMA", '#ff3d55', P(2, 0.40), P(2, 0.62));
    tag(2, "\"VOCÊ VAI SE MACHUCAR\"", '#ff3d55', P(2, 0.62), null);
    tag(3, "COSTAS: DISTENSÃO", '#ff3d55', P(3, 0.18), P(3, 0.51));
    tag(3, "CERCA ALTA ✗", '#ff3d55', P(3, 0.51), null);
    row(4, [["Item_Backpack", "VESTIDA ✓", P(4, 0.18)]]);
    tag(4, "GUARDADA NO INVENTÁRIO ✗", '#ff3d55', P(4, 0.51), null);
    row(5, [["Item_Backpack_Black", "70%", P(5, 0.18)], ["Item_Hiking_Green", "75%", P(5, 0.34)], ["Item_BigHiking_Green", "80%", P(5, 0.51)], ["Item_AliceBag", "85%", P(5, 0.68)]]);
    H.moodle(6, 'pz:Status_MovementRestricted', "NÃO CORRE", P(6, 0.18), false, null, 560);
    tag(7, "MUSCULOSO · FORTE +", '#8fe04a', P(7, 0.18), P(7, 0.51));
    tag(7, "FRACO · FRANZINO −", '#ff3d55', P(7, 0.51), null);
    row(8, [["Item_AliceBag", "", P(8, 0.18)]]);
    tag(8, "SALVA E COMENTA", '#8fe04a', P(8, 0.51), null);
  }
};
