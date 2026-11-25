// EP 25 — Tédio e Tristeza (B42.22) — RASCUNHO AUTOMÁTICO v2 (gerado de roteiros/ep25-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>TÉDIO E TRISTEZA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Book", "Item_Cigarette", "Item_ComicBook", "Item_Magazine", "Item_PillsAntidepressant", "Item_Pot_Forged_Stew", "Item_Icecream", "Item_Croissant"],
  OFF: 1.3,
  T: [0.0, 4.94, 12.8, 17.31, 24.06, 32.09, 39.76], END: 45.35,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6 }],
  titles: [
    { i: 0, a: "Até o tédio", b: "é perigoso", aSize: 110, size: 128 },
    { i: 1, a: "Ocupe-se", b: "", col: 'yellow', aSize: 110, size: 128 },
    { i: 2, a: "Triste até", b: "sem esperança", aSize: 110, size: 128 },
    { i: 3, a: "Leitura", b: "tira os dois", col: 'green', aSize: 110, size: 128 },
    { i: 4, a: "Comida que", b: "tira tristeza", col: 'yellow', aSize: 110, size: 128 },
    { i: 5, a: "Antidepressivo:", b: "devagar", col: 'green', aSize: 96, size: 128 },
    { i: 6, a: "Livro e", b: "comida boa", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 560) => {   // v5: topo (em 1560 caía na área da descrição/botões do app)
     const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 40px/1.15 var(--mono);padding:16px 28px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    H.el('style', null, '.moodle{left:760px;width:170px;height:170px}.mtag{left:700px;width:290px;font-size:30px;line-height:1.35;margin-top:34px}', document.head);
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 620, size: 180, gap: 30 }, o));
    H.moodle(0, 'pz:Mood_Bored', "TÉDIO", P(0, 0.18), false, null, 560);
    tag(1, "UM POUCO DE TÉDIO", '#ffb020', P(1, 0.18), P(1, 0.40));
    tag(1, "TÉDIO EXTREMO", '#ff3d55', P(1, 0.40), P(1, 0.62));
    tag(1, "\"OCUPE-SE OU PROCURE<br>ALGUMA DISTRAÇÃO\"", '#efe5cf', P(1, 0.62), null);
    H.moodle(2, 'pz:Mood_Sad', "TRISTEZA", P(2, 0.18), false, null, 560);
    tag(2, "SEM ESPERANÇA", '#ff3d55', P(2, 0.51), null, 560);
    row(3, [["Item_Book", "OS DOIS ↓", P(3, 0.18)], ["Item_ComicBook", "OS DOIS ↓", P(3, 0.40)], ["Item_Magazine", "TÉDIO ↓", P(3, 0.62)]], { top: 540 });   // v5: rótulo curto (cabia em 1 linha) e mais alto (cobria o personagem)
    row(4, [["Item_Pot_Forged_Stew", "ENSOPADO", P(4, 0.14)], ["Item_Icecream", "SORVETE", P(4, 0.30)], ["Item_Croissant", "CROISSANT", P(4, 0.44)]], { top: 560, size: 150, gap: 24, left: 60 });
    tag(4, "TRISTEZA ↓", '#8fe04a', P(4, 0.14), P(4, 0.56), 780);
    tag(4, "\"COZINHE PARA REMOVER<br>A PENALIDADE\"", '#8fe04a', P(4, 0.60), null, 780);
    row(5, [["Item_Cigarette", "SEM CIGARRO", P(5, 0.18)], ["Item_PillsAntidepressant", "DIAS", P(5, 0.51)]], { top: 540 });
    row(6, [["Item_Book", "LIVRO", P(6, 0.18)]], { top: 540, left: 60, size: 150 });
    tag(6, "SALVA E COMENTA", '#8fe04a', P(6, 0.51), null, 560);
  }
};
