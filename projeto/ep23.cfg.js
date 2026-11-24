// EP 23 — Carga e Peso (B42.22) — RASCUNHO v3 (24/11, Jose): moodles de carga e de fôlego na corrida pesada, tabela das 5 mochilas
// (capacidade e redução, em ordem crescente de redução — arquivos do jogo container.txt), textos fora da área do personagem e dos botões do app.
// T/END vêm da voz provisória (tts_rascunho.py) no PC.
const LAB = 'PROJECT ZOMBOID · <b>CARGA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Duffelbag", "Item_Backpack_Black", "Item_Hiking_Green", "Item_BigHiking_Green", "Item_AliceBag"],
  OFF: 1.3,
  luz: { padrao: 'interior-tarde', 2: 'exterior-dia', 3: 'exterior-dia', 6: 'exterior-dia', 8: 'exterior-dia' },
  T: [0, 3.5, 10, 20, 25, 32, 41, 47, 52], END: 57,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: "Pegar tudo", b: "te mata", aSize: 110, size: 128 },
    { i: 1, a: "Força e", b: "moodles", aSize: 110, size: 128 },
    { i: 2, a: "Sobrecarga:", b: "te machuca", aSize: 110, size: 128 },
    { i: 3, a: "Costas e", b: "cercas", aSize: 110, size: 128 },
    { i: 4, a: "Mochila", b: "nas costas", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Cada mochila", b: "reduz o peso", col: 'green', aSize: 96, size: 112 },
    { i: 6, a: "Movimento", b: "restrito", col: 'yellow', aSize: 110, size: 128 },
    { i: 7, a: "Forte", b: "carrega mais", col: 'green', aSize: 110, size: 128 },
    { i: 8, a: "Só o que", b: "precisa", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', Y = '#ffb020', B = '#efe5cf';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k23' + p + (n++);
    const tag = (k, txt, col, at, end, top = 560, fs = 42) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:900px;white-space:nowrap;text-align:center;top:${top}px;color:${col};font:800 ${fs}px/1.15 var(--mono);padding:16px 28px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    el('style', null, `.moodle{left:130px;width:150px;height:150px}.mtag{left:50px;width:310px;font-size:24px;margin-top:22px;white-space:nowrap;text-align:center}
      .bt{position:absolute;left:90px;top:540px;width:900px;background:rgba(14,14,12,.92);border:2px solid #6a6a5a;border-radius:10px;font-family:var(--mono);color:${B};padding:18px 22px 10px}
      .bt h4{margin:0 0 10px;font:800 32px/1 var(--mono);color:${G};letter-spacing:1px}
      .bt .hd,.bt .r{display:grid;grid-template-columns:86px 1fr 150px 150px;align-items:center;gap:10px}
      .bt .hd{font:700 22px/1 var(--mono);color:#a9a28c;padding:0 0 8px;border-bottom:1px solid #444}
      .bt .r{font:800 30px/1 var(--mono);padding:8px 0;border-bottom:1px solid #2e2e2a}.bt .r:last-child{border:0}
      .bt .r img{width:76px;height:76px;image-rendering:pixelated}.bt .r .v{text-align:center}.bt .r .g{color:${G}}
      .bt .r.top{background:rgba(143,224,74,.12)}`, document.head);
    // 0 — saqueando: moodle de carga entra
    H.moodle(0, 'pz:Status_HeavyLoad', "CARGA PESADA", P(0, 0.40), false, null, 560);
    // 1 — limite = força + moodles
    tag(1, "LIMITE = FORÇA + MOODLES", Y, P(1, 0.06), null);
    H.moodle(1, 'pz:Status_Hunger', "FOME", P(1, 0.48), false, P(1, 0.62), 700);
    H.moodle(1, 'pz:Status_Thirst', "SEDE", P(1, 0.62), false, P(1, 0.76), 700);
    H.moodle(1, 'pz:Mood_Ill', "DOENÇA", P(1, 0.76), false, null, 700);
    // 2 — corrida pesada: carga sobe de nível e o fôlego acaba
    H.moodle(2, 'pz:Status_HeavyLoad', "CARGA PESADA", P(2, 0.18), false, P(2, 0.42), 560);
    H.moodle(2, 'pz:Status_HeavyLoad', "SOBRECARGA EXTREMA", P(2, 0.42), false, null, 560);
    H.moodle(2, 'pz:Mood_Exhausted', "SEM FÔLEGO", P(2, 0.30), false, P(2, 0.72), 760);
    tag(2, "\"VOCÊ VAI SE MACHUCAR\"", RD, P(2, 0.74), null, 940, 32);
    // 3 — costas e cerca
    tag(3, "COSTAS: DISTENSÃO", RD, P(3, 0.10), P(3, 0.50));
    tag(3, "CERCA ALTA ✗", RD, P(3, 0.50), null);
    // 4 — vestida × guardada
    tag(4, "MOCHILA VESTIDA ✓", G, P(4, 0.10), P(4, 0.48));
    tag(4, "GUARDADA NO INVENTÁRIO ✗", RD, P(4, 0.48), null, 560, 38);
    // 5 — tabela das mochilas (ordem crescente de redução de peso)
    const rows = [['Item_Duffelbag', 'Bolsa de Viagem', 18, 65], ['Item_Backpack_Black', 'Mochila Pequena', 15, 70], ['Item_Hiking_Green', 'Mochila de Trilha', 20, 75],
      ['Item_BigHiking_Green', 'Mochila Grande de Trilha', 22, 80], ['Item_AliceBag', 'Mochila Militar', 28, 85]];
    const bt = el('div', 'bt', `<h4>MOCHILAS (VESTIDAS NAS COSTAS)</h4><div class="hd"><span></span><span>MOCHILA</span><span class="v" style="text-align:center">CAPACIDADE</span><span style="text-align:center">REDUZ PESO</span></div>`, H.sc(5)); bt.id = nid('bt');
    M.enter('#' + bt.id, { at: P(5, 0.04), frames: 12, ease: 'snapSettle', from: { y: 60, opacity: 0 } });
    rows.forEach(([ic, nm, cap, red], i) => { const r = el('div', 'r' + (i === 4 ? ' top' : ''), `<img src="assets/items/${ic}.png"><span>${nm}</span><span class="v">${cap}</span><span class="v g">${red}%</span>`, bt); r.id = nid('r');
      M.enter('#' + r.id, { at: P(5, 0.10 + i * 0.09), frames: 9, ease: 'snapSettle', from: { x: -40, opacity: 0 } }); });
    // 6 — não corre
    H.moodle(6, 'pz:Status_MovementRestricted', "MOVIMENTO RESTRITO", P(6, 0.20), false, null, 560);
    tag(6, "SEM CORRER EM DISPARADA", Y, P(6, 0.48), null, 800, 36);
    // 7 — traços
    tag(7, "MUSCULOSO · FORTE +", G, P(7, 0.10), P(7, 0.50));
    tag(7, "FRACO · FRANZINO −", RD, P(7, 0.50), null);
    // 8 — CTA
    H.items(8, [["Item_AliceBag", "MILITAR 85%", P(8, 0.10)]], { top: 600, size: 150, left: 120 });
    tag(8, "SALVA E COMENTA", G, P(8, 0.60), null);
  }
};
