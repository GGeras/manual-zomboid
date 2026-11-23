// EP 20 — Sono (B42.22) — RASCUNHO AUTOMÁTICO (gerado de roteiros/ep20-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>SONO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Mattress", "Item_Pillow", "Item_PillsCaffeine", "Item_PillsSleeping"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0, 36.0], END: 40.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9 }],
  titles: [
    { i: 0, a: "Dormir mal", b: "te mata devagar", col: 'bone', aSize: 110, size: 100 },
    { i: 1, a: "4 níveis", b: "de sono", aSize: 110, size: 128 },
    { i: 2, a: "Cansado:", b: "menos força", aSize: 110, size: 128 },
    { i: 3, a: "Cadeira:", b: "só o fôlego", aSize: 110, size: 128 },
    { i: 4, a: "Cama boa", b: "recupera mais", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "O jogo nem", b: "deixa dormir", aSize: 110, size: 128 },
    { i: 6, a: "Soníferos", b: "ajudam", col: 'green', aSize: 110, size: 128 },
    { i: 7, a: "Cafeína:", b: "só um empurrão", col: 'yellow', aSize: 110, size: 100 },
    { i: 8, a: "Tranca e", b: "deita", col: 'green', aSize: 110, size: 128 },
    { i: 9, a: "Durma bem,", b: "lute melhor", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    H.moodle(0, 'pz:Mood_Sleepy', "SONO", P(0, 0.18), false, null);
    tag(1, "SONOLÊNCIA", '#ffb020', P(1, 0.18), P(1, 0.34));
    tag(1, "CANSAÇO", '#ffb020', P(1, 0.34), P(1, 0.51));
    tag(1, "CANSAÇO INTENSO", '#ff3d55', P(1, 0.51), P(1, 0.68));
    tag(1, "CANSAÇO ABSURDO", '#ff3d55', P(1, 0.68), null);
    H.moodle(2, 'pz:Mood_Sleepy', "SONO", P(2, 0.18), false, null);
    tag(2, "\"O CANSAÇO ESTÁ TIRANDO SUAS FORÇAS\"", '#efe5cf', P(2, 0.51), null);
    row(3, [["Item_Mattress", "CAMA", P(3, 0.62)]]);
    H.moodle(3, 'pz:Mood_Exhausted', "FÔLEGO ✓", P(3, 0.18), true, null);
    tag(3, "CANSAÇO, SÓ DORMINDO", '#ff3d55', P(3, 0.40), null);
    row(4, [["Item_Mattress", "CAMA BOA", P(4, 0.18)], ["Item_Pillow", "TRAVESSEIRO", P(4, 0.34)]]);
    H.moodle(4, 'pz:Mood_Pained', "DOR", P(4, 0.68), false, null);
    tag(4, "CHÃO / CARRO = DOR NO PESCOÇO", '#ff3d55', P(4, 0.51), null);
    H.moodle(5, 'pz:Mood_Panicked', "PÂNICO", P(5, 0.34), false, P(5, 0.51));
    H.moodle(5, 'pz:Mood_Pained', "DOR", P(5, 0.51), false, P(5, 0.68));
    H.moodle(5, 'pz:Mood_NoxiousSmell', "MAU CHEIRO", P(5, 0.68), false, null);
    tag(5, "ZUMBI ✗", '#ff3d55', P(5, 0.18), null);
    row(6, [["Item_PillsSleeping", "SONÍFEROS", P(6, 0.18)]]);
    tag(6, "SEM ÁLCOOL ✗", '#ff3d55', P(6, 0.51), null);
    row(7, [["Item_PillsCaffeine", "CAFEÍNA", P(7, 0.18)]]);
    tag(7, "NÃO SUBSTITUI A CAMA", '#ff3d55', P(7, 0.51), null);
    row(8, [["Item_Mattress", "MELHOR CAMA", P(8, 0.40)]]);
    H.moodle(8, 'pz:Mood_Sleepy', "SONOLÊNCIA", P(8, 0.18), false, null);
    tag(8, "ACORDA INTEIRO ✓", '#8fe04a', P(8, 0.62), null);
    tag(9, "SONO LEVE", '#8fe04a', P(9, 0.18), P(9, 0.40));
    tag(9, "MADRUGADOR", '#8fe04a', P(9, 0.40), P(9, 0.62));
    tag(9, "SALVA E COMENTA", '#8fe04a', P(9, 0.62), null);
  }
};
