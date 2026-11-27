// EP 24 — Pânico e Estresse (B42.22) — RASCUNHO v3 (24/11, Jose): falas v7 (mais longas), moodles reais com os nomes dos níveis,
// cartões dos traços com ÍCONE do jogo e PONTOS (verde = devolve pontos, vermelho = custa) — character_traits.txt; T/END = voz provisória (Piper).
const LAB = 'PROJECT ZOMBOID · <b>PÂNICO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_PillsBetablocker", "Item_Book", "Item_ComicBook", "Item_Magazine", "Item_Cigarette", "trait_brave", "trait_cowardly", "trait_desensitized", "trait_agoraphobic", "trait_claustrophobic"],
  OFF: 1.3,
  luz: { padrao: 'exterior-dia', 3: 'interior-noite', 4: 'interior-tarde', 5: 'interior-tarde', 6: 'interior-tarde' },
  T: [0.0, 7.15, 17.92, 30.31, 41.18, 49.89, 59.64, 66.67, 85.82, 101.85], END: 104.76, cauda: 99,   // v5: final de tiros mais longo (câmera lenta + recarga) depois da última fala
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9 }],
  titles: [
    { i: 0, a: "Mão treme,", b: "tiro torto", aSize: 110, size: 128 },
    { i: 1, a: "Pânico:", b: "4 níveis", aSize: 110, size: 128 },
    { i: 2, a: "Pânico e cansaço:", b: "erra mais", aSize: 96, size: 128 },
    { i: 3, a: "Estresse", b: "também treme", aSize: 110, size: 112 },
    { i: 4, a: "Calmantes", b: "reduzem o pânico", col: 'green', aSize: 110, size: 100 },
    { i: 5, a: "Leitura", b: "tira estresse", col: 'green', aSize: 110, size: 112 },
    { i: 6, a: "Fumante:", b: "cigarro acalma", col: 'yellow', aSize: 110, size: 108 },
    { i: 7, a: "Corajoso ou", b: "Covarde?", aSize: 110, size: 128 },
    { i: 8, a: "Rua ou", b: "quartinho", col: 'yellow', aSize: 110, size: 128 },
    { i: 9, a: "Calma na mão,", b: "tiro na cabeça", col: 'green', aSize: 96, size: 100 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', Y = '#ffb020', B = '#efe5cf';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k24' + p + (n++);
    const tag = (k, txt, col, at, end, top = 800, fs = 36) => { const id = H.chip(k, txt, at, `left:60px;width:max-content;max-width:960px;white-space:nowrap;text-align:left;top:${top}px;color:${col};font:800 ${fs}px/1.15 var(--mono);padding:14px 24px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    el('style', null, `.moodle{left:840px;width:150px;height:150px}.mtag{left:805px;width:220px;font-size:20px;line-height:1.1;margin-top:18px;white-space:nowrap;text-align:center}
      .tr{position:absolute;left:60px;width:700px;height:150px;background:rgba(14,14,12,.92);border:2px solid #6a6a5a;border-radius:12px;display:grid;grid-template-columns:140px 1fr 150px;align-items:center;font-family:var(--mono)}
      .tr img{width:110px;height:110px;margin-left:22px;image-rendering:pixelated}.tr .nm{font:800 40px/1.1 var(--mono);color:${B}}.tr .ds{font:700 24px/1.2 var(--mono);color:#b9b29c;margin-top:6px}
      .tr .pt{font:900 54px/1.2 var(--mono);text-align:center;white-space:nowrap}`, document.head);
    const card = (k, ic, nm, ds, pts, at, end, top) => { const col = pts > 0 ? G : pts < 0 ? RD : B, sg = pts > 0 ? '+' + pts : pts < 0 ? '−' + (-pts) : '0';
      const e = el('div', 'tr ins', `<img src="assets/items/${ic}.png"><div><div class="nm">${nm}</div><div class="ds">${ds}</div></div><div class="pt" style="color:${col}">${sg}</div>`, H.sc(k), `top:${top}px;border-color:${col}`); e.id = nid('tr');
      M.enter('#' + e.id, { at, frames: 10, ease: 'snapSettle', from: { x: -60, opacity: 0 } }); if (end != null) M.hide('#' + e.id, end); };
    const mood = (k, ic, tg, at, off, left = 840, ok = false, top = 560) => { const id = H.moodle(k, ic, tg, at, ok, off, top), m = document.getElementById(id); m.style.left = left + 'px'; m.nextElementSibling.style.left = (left - 35) + 'px'; return id; };
    // 0 — tiros errados
    mood(0, 'pz:Mood_Panicked', "PÂNICO", P(0, 0.12), null, 840, false);
    tag(0, "TIRO ERRADO ✗", RD, P(0, 0.62), null, 800, 36);
    // 1 — níveis do pânico (nomes e textos do jogo)
    mood(1, 'pz:Mood_Panicked', "NERVOSISMO", P(1, 0.22), P(1, 0.30), 840, false);
    mood(1, 'pz:Mood_Panicked', "EM ALERTA", P(1, 0.30), P(1, 0.37), 840, false);
    mood(1, 'pz:Mood_Panicked', "MEDO", P(1, 0.37), P(1, 0.44), 840, false);
    mood(1, 'pz:Mood_Panicked', "TERROR", P(1, 0.44), null, 840, false);
    tag(1, "NÍVEL 2: \"MÃOS TRÊMULAS\"", Y, P(1, 0.52), P(1, 0.76), 800, 34);
    tag(1, "NÍVEL 3:<br>\"TREMORES PELO CORPO INTEIRO\"", RD, P(1, 0.76), null, 800, 32);
    // 2 — mira e corpo a corpo
    mood(2, 'pz:Mood_Panicked', "PÂNICO", P(2, 0.06), null, 840, false);
    mood(2, 'pz:Mood_Sleepy', "CANSAÇO", P(2, 0.14), null, 600, false);
    tag(2, "PONTARIA RUIM = ERRA MAIS", RD, P(2, 0.24), P(2, 0.56), 800, 34);
    tag(2, "3º TIRO: ACERTOU", G, P(2, 0.38), P(2, 0.56), 560, 32);   // v6: no tiro que derruba o zumbi
    tag(2, "CORPO A CORPO: FORÇA E PRECISÃO ↓", RD, P(2, 0.60), P(2, 0.80), 800, 30);
    tag(2, "GOLPE FRACO: ELE NÃO CAI", RD, P(2, 0.80), null, 800, 34);   // v6: junto do 1º golpe do taco (ritmo + leitura sem som)
    // 3 — estresse
    mood(3, 'pz:Mood_Stressed', "TENSÃO", P(3, 0.10), P(3, 0.20), 840, false);
    mood(3, 'pz:Mood_Stressed', "AGITAÇÃO", P(3, 0.20), P(3, 0.28), 840, false);
    mood(3, 'pz:Mood_Stressed', "ESTRESSE", P(3, 0.28), P(3, 0.36), 840, false);
    mood(3, 'pz:Mood_Stressed', "À BEIRA DO<br>COLAPSO", P(3, 0.36), null, 840, false);
    tag(3, "NÍVEL 3: \"MÃOS TRÊMULAS.\"", Y, P(3, 0.55), P(3, 0.78), 800, 34);
    tag(3, "\"IMPOSSÍVEL PENSAR DIREITO\"", RD, P(3, 0.78), null, 800, 34);
    // 4 — Calmantes
    H.items(4, [["Item_PillsBetablocker", "CALMANTES", P(4, 0.10)]], { top: 560, size: 150, left: 120 });
    tag(4, "\"REDUZ O PÂNICO\"", G, P(4, 0.42), null, 800, 36);
    mood(4, 'pz:Mood_Panicked', "PÂNICO ↓", P(4, 0.60), P(4, 0.92), 840, true);
    // 5 — leitura (ranking)
    H.items(5, [["Item_Book", "1º", P(5, 0.42)], ["Item_ComicBook", "2º", P(5, 0.55)], ["Item_Magazine", "3º", P(5, 0.70)]], { top: 560, size: 150, gap: 40 });
    tag(5, "ESTRESSE ↓ · TÉDIO ↓", G, P(5, 0.16), P(5, 0.40), 560, 36);
    // 6 — Fumante
    card(6, 'trait_smoker', 'Fumante', 'devolve pontos', 3, P(6, 0.04), null, 560);
    tag(6, "FUMOU: ESTRESSE ↓ · TRISTEZA ↓", G, P(6, 0.30), P(6, 0.62), 800, 34);
    tag(6, "SEM CIGARRO: TRISTEZA ↑", RD, P(6, 0.62), null, 800, 34);
    // 7 — Corajoso / Covarde / Dessensibilização (ícone + pontos)
    card(7, 'trait_brave', 'Corajoso', 'menos pânico', -4, P(7, 0.06), P(7, 0.72), 560);
    tag(7, "CORAJOSO: MIRA FIRME", G, P(7, 0.20), P(7, 0.38), 905, 36);   // v6: ritmo
    card(7, 'trait_cowardly', 'Covarde', 'muito mais pânico', 2, P(7, 0.38), null, 730);
    card(7, 'trait_desensitized', 'Dessensibilização', 'vem com o Veterano', 0, P(7, 0.72), null, 560);   // v6: no lugar do Corajoso (em 900 cobria o personagem)
    tag(7, "CORAJOSO > COVARDE", G, P(7, 0.46), P(7, 0.72), 905, 36);
    tag(7, "VEM COM O VETERANO", Y, P(7, 0.80), null, 905, 36);
    // 8 — Agorafóbico / Claustrofóbico
    card(8, 'trait_agoraphobic', 'Agorafóbico', 'pânico ao ar livre', 4, P(8, 0.10), P(8, 0.40), 560);   // v5: sai quando entra o 2º (não cobre o personagem)
    card(8, 'trait_claustrophobic', 'Claustrofóbico', 'pânico em lugar fechado pequeno', 4, P(8, 0.40), null, 560);
    mood(8, 'pz:Mood_Panicked', "PÂNICO", P(8, 0.24), P(8, 0.50), 840, false);
    mood(8, 'pz:Mood_Panicked', "PÂNICO", P(8, 0.62), P(8, 0.76), 840, false);
    tag(8, "OS DOIS: +4 PONTOS", Y, P(8, 0.58), P(8, 0.78), 740, 36);   // v6: "devolvem quatro pontos, mas cobram na hora errada"
    tag(8, "NÃO RECOMENDO OS DOIS", RD, P(8, 0.78), null, 740, 36);
    // 9 — CTA
    tag(9, "MIRA FIRME = TIRO NA CABEÇA", G, P(9, 0.05), P(9, 0.78), 560, 34);   // v6
    tag(9, "SALVA E COMENTA", G, P(9, 0.80), null);
    tag(9, "3 TIROS · 3 NA CABEÇA", Y, P(9, 1.45), null, 560, 34);   // v6: na cauda (câmera lenta + recarga), depois da última fala
  }
};
