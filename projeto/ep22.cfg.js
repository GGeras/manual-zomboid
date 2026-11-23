// EP 22 — Fadiga Muscular (B42.22) — RASCUNHO AUTOMÁTICO v2 (gerado de roteiros/ep22-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>FADIGA MUSCULAR</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Axe", "Item_PillsPainkiller", "Item_Sledgehammer2"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0], END: 32.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7 }],
  titles: [
    { i: 0, a: "Seu braço", b: "cansa de bater", aSize: 110, size: 100 },
    { i: 1, a: "Distensão", b: "muscular", aSize: 110, size: 128 },
    { i: 2, a: "Braço, perna", b: "e costas", aSize: 96, size: 128 },
    { i: 3, a: "Pisão", b: "cansa menos", col: 'green', aSize: 110, size: 128 },
    { i: 4, a: "Força e", b: "habilidade", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Analgésico", b: "não cura", aSize: 110, size: 128 },
    { i: 6, a: "Exercício", b: "tem preço", aSize: 110, size: 128 },
    { i: 7, a: "Divide", b: "o esforço", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    H.el('style', null, '.moodle{left:760px;width:170px;height:170px}.mtag{left:700px;width:290px;font-size:30px;margin-top:40px}', document.head);
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    row(0, [["Item_Axe", "", P(0, 0.18)]]);
    tag(1, "ABA SAÚDE", '#efe5cf', P(1, 0.18), P(1, 0.40));
    tag(1, "DISTENSÃO MUSCULAR LEVE", '#ffb020', P(1, 0.40), P(1, 0.62));
    tag(1, "DISTENSÃO MUSCULAR", '#ff3d55', P(1, 0.62), null);
    H.moodle(2, 'pz:Status_HeavyLoad', "PESO → COSTAS", P(2, 0.62), false, null, 560);
    tag(2, "BATER → BRAÇO", '#ff3d55', P(2, 0.18), P(2, 0.40));
    tag(2, "CORRER → PERNAS", '#ffb020', P(2, 0.40), null);
    row(3, [["Item_Sledgehammer2", "PESADA", P(3, 0.18)]]);
    tag(3, "PISÃO = MENOS ESFORÇO", '#8fe04a', P(3, 0.51), null);
    tag(4, "FORÇA ↑", '#8fe04a', P(4, 0.18), P(4, 0.40));
    tag(4, "MACHADOS ↑", '#8fe04a', P(4, 0.40), P(4, 0.62));
    tag(4, "DISTENSÃO ↓", '#8fe04a', P(4, 0.62), null);
    row(5, [["Item_PillsPainkiller", "ANALGÉSICO", P(5, 0.18)]]);
    H.moodle(5, 'pz:Mood_Pained', "DOR ✓", P(5, 0.40), true, null, 560);
    tag(5, "DISTENSÃO CONTINUA", '#ff3d55', P(5, 0.62), null);
    H.moodle(6, 'pz:Mood_Pained', "DOR", P(6, 0.51), false, null, 560);
    tag(6, "\"DORES TERRÍVEIS NO DIA SEGUINTE\"", '#efe5cf', P(6, 0.18), null);
    tag(7, "GOLPE · PISÃO · CAMINHADA", '#8fe04a', P(7, 0.18), P(7, 0.51));
    tag(7, "SALVA E COMENTA", '#8fe04a', P(7, 0.51), null);
  }
};
