// EP 26 — Fome e Peso do Corpo (B42.22) — RASCUNHO AUTOMÁTICO v2 (gerado de roteiros/ep26-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>FOME E PESO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_BerryBlue", "Item_Butter", "Item_Lard"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0], END: 32.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7 }],
  titles: [
    { i: 0, a: "Come e", b: "emagrece", aSize: 110, size: 128 },
    { i: 1, a: "Fome tira", b: "suas forças", aSize: 110, size: 128 },
    { i: 2, a: "Peso =", b: "calorias", aSize: 110, size: 128 },
    { i: 3, a: "Dieta", b: "balanceada", col: 'yellow', aSize: 110, size: 128 },
    { i: 4, a: "Peso errado", b: "cobra caro", aSize: 110, size: 128 },
    { i: 5, a: "Cozida", b: "sacia mais", col: 'green', aSize: 110, size: 128 },
    { i: 6, a: "Inverno", b: "gasta mais", col: 'yellow', aSize: 110, size: 128 },
    { i: 7, a: "Fome é alarme,", b: "caloria é combustível", col: 'green', aSize: 96, size: 100 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    H.el('style', null, '.moodle{left:760px;width:170px;height:170px}.mtag{left:700px;width:290px;font-size:30px;margin-top:40px}', document.head);
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    H.moodle(0, 'pz:Status_Hunger', "FOME", P(0, 0.18), false, null, 560);
    tag(1, "FOME LEVE", '#ffb020', P(1, 0.18), P(1, 0.51));
    tag(1, "MORRENDO DE FOME", '#ff3d55', P(1, 0.51), null);
    row(2, [["Item_BerryBlue", "LEVE", P(2, 0.18)], ["Item_Butter", "ENGORDA", P(2, 0.40)], ["Item_Lard", "ENGORDA", P(2, 0.62)]]);
    tag(3, "\"VOCÊ PODE GANHAR OU PERDER PESO!\"", '#efe5cf', P(3, 0.18), null);
    tag(4, "ABAIXO DO PESO: POUCA FORÇA", '#ff3d55', P(4, 0.18), P(4, 0.51));
    tag(4, "ACIMA DO PESO: MAIS DEVAGAR", '#ff3d55', P(4, 0.51), null);
    tag(5, "MAIS NUTRITIVA ✓", '#8fe04a', P(5, 0.18), null);
    H.moodle(6, 'pz:Status_TemperatureLow', "FRIO", P(6, 0.18), false, null, 560);
    tag(6, "BEM ALIMENTADO ✓", '#8fe04a', P(6, 0.51), null);
    tag(7, "SALVA E COMENTA", '#8fe04a', P(7, 0.18), null);
  }
};
