// EP 28 — Helicóptero (B42.22) — RASCUNHO AUTOMÁTICO (gerado de roteiros/ep28-*.md; T/END vêm da voz provisória)
// Para a versão final: troque a voz (check_vo.py), ajuste títulos/cenas à mão onde precisar.
const LAB = 'PROJECT ZOMBOID · <b>HELICÓPTERO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Radio"],
  OFF: 1.3,
  T: [0.0, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0, 32.0], END: 36.0,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: "Você ouve.", b: "Eles também.", aSize: 110, size: 128 },
    { i: 1, a: "Uma vez,", b: "noite 6 a 9", col: 'yellow', aSize: 110, size: 128 },
    { i: 2, a: "O rádio", b: "avisa", col: 'green', aSize: 110, size: 128 },
    { i: 3, a: "Não dá pra", b: "atirar nele", aSize: 110, size: 128 },
    { i: 4, a: "Te viu?", b: "Te segue", aSize: 110, size: 128 },
    { i: 5, a: "Das 9h", b: "às 18h", col: 'yellow', aSize: 110, size: 128 },
    { i: 6, a: "Depois:", b: "rua lotada", aSize: 110, size: 128 },
    { i: 7, a: "Tiros", b: "ao longe", col: 'yellow', aSize: 110, size: 128 },
    { i: 8, a: "Dentro de casa,", b: "quieto", col: 'green', aSize: 96, size: 128 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:960px;text-align:center;top:${top}px;color:${col};font:800 46px/1.15 var(--mono);padding:18px 30px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1250, size: 180, gap: 30 }, o));
    tag(0, "HELICÓPTERO", '#ff3d55', P(0, 0.18), null);
    tag(1, "APOCALIPSE: UMA VEZ", '#ffb020', P(1, 0.18), P(1, 0.51));
    tag(1, "NOITE 6 · 7 · 8 · 9", '#ff3d55', P(1, 0.51), null);
    row(2, [["Item_Radio", "RÁDIO", P(2, 0.18)]]);
    tag(2, "\"ATIVIDADE AÉREA\"", '#ffb020', P(2, 0.51), null);
    tag(3, "\"VOCÊ NÃO PODE ATIRAR NO HELICÓPTERO.\"", '#efe5cf', P(3, 0.18), null);
    tag(4, "ELE TE SEGUE", '#ff3d55', P(4, 0.18), P(4, 0.51));
    tag(4, "A HORDA VEM JUNTO", '#ff3d55', P(4, 0.51), null);
    tag(5, "9H → 18H", '#ffb020', P(5, 0.18), P(5, 0.51));
    tag(5, "1 A 4 HORAS", '#ffb020', P(5, 0.51), null);
    tag(6, "BASE CERCADA", '#ff3d55', P(6, 0.18), null);
    tag(7, "METAEVENTO: ÀS VEZES", '#ffb020', P(7, 0.18), null);
    row(8, [["Item_Radio", "", P(8, 0.18)]]);
    tag(8, "SALVA E COMENTA", '#8fe04a', P(8, 0.51), null);
  }
};
