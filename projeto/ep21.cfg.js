// EP 21 — Coleta (B42.22) — RASCUNHO AUTOMÁTICO v2 (gerado de roteiros/ep21-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>COLETA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_BerryBlue", "Item_Flashlight2", "Item_Rock", "Item_Twigs", "Item_Umbrella"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0], END: 36.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: "O mato", b: "tem comida", col: 'green', aSize: 110, size: 128 },
    { i: 1, a: "Tecla", b: "END", col: 'green', aSize: 110, size: 128 },
    { i: 2, a: "Raio: 3", b: "até 10", aSize: 110, size: 128 },
    { i: 3, a: "Chuva e escuro", b: "encolhem", aSize: 96, size: 128 },
    { i: 4, a: "Agachado", b: "acha mais", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Cada lugar", b: "tem o seu", aSize: 110, size: 128 },
    { i: 6, a: "Frutinha", b: "pode envenenar", aSize: 110, size: 100 },
    { i: 7, a: "Depende da", b: "estação", col: 'yellow', aSize: 110, size: 128 },
    { i: 8, a: "O mato", b: "vira mercado", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    H.el('style', null, '.moodle{left:760px;width:170px;height:170px}.mtag{left:700px;width:290px;font-size:30px;margin-top:40px}', document.head);
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    row(0, [["Item_BerryBlue", "?", P(0, 0.18)]]);
    tag(1, "INVESTIGAR ÁREA", '#efe5cf', P(1, 0.18), P(1, 0.40));
    tag(1, "ATIVAR MODO DE BUSCA", '#8fe04a', P(1, 0.40), P(1, 0.62));
    tag(1, "TECLA END", '#ffb020', P(1, 0.62), null);
    row(2, [["Item_Twigs", "GALHO", P(2, 0.51)], ["Item_Rock", "PEDRA", P(2, 0.68)]]);
    tag(2, "COLETA 0 → 3 QUADRADOS", '#ffb020', P(2, 0.18), P(2, 0.34));
    tag(2, "COLETA 10 → 10 QUADRADOS", '#8fe04a', P(2, 0.34), null);
    row(3, [["Item_Umbrella", "GUARDA-CHUVA", P(3, 0.40)], ["Item_Flashlight2", "LANTERNA", P(3, 0.62)]]);
    tag(3, "CHUVA · NEBLINA · NEVE · ESCURO", '#ff3d55', P(3, 0.18), null);
    tag(4, "AGACHADO ✓", '#8fe04a', P(4, 0.18), P(4, 0.51));
    tag(4, "EM CÍRCULO ✗", '#ff3d55', P(4, 0.51), null);
    row(5, [["Item_Twigs", "FLORESTA", P(5, 0.18)], ["Item_Rock", "ESTRADA", P(5, 0.34)], ["Item_BerryBlue", "FLORESTA", P(5, 0.51)]]);
    tag(5, "INSETO: À NOITE", '#ffb020', P(5, 0.68), null);
    row(6, [["Item_BerryBlue", "?", P(6, 0.18)]]);
    tag(6, "HERBALISTA ✓", '#8fe04a', P(6, 0.51), null);
    tag(7, "MÊS E ESTAÇÃO", '#ffb020', P(7, 0.18), P(7, 0.51));
    tag(7, "FOCO DE BUSCA", '#8fe04a', P(7, 0.51), null);
    row(8, [["Item_BerryBlue", "", P(8, 0.18)]]);
    tag(8, "SALVA E COMENTA", '#8fe04a', P(8, 0.51), null);
  }
};
