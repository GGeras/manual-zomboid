// EP 20 — Sono (B42.22) — FINAL v6 (24/11, voz ElevenLabs final: T/END pelas pausas reais; chip da fala 4 em 2 linhas, rótulos sem vazar) · RASCUNHO v4 (24/11, Jose: camas por fala, HUD da fala 4 sem sobrepor) · v3 (24/11, revisão do Bruno; voz provisória Piper — T/END de tts_rascunho.py)
// HUD na área segura (regra 4.3). Traços do final COM ícone e valor (como na criação do personagem; custos de
// media/scripts/generated/characters/character_traits.txt: Sono Leve (insomniac) −6 → dá 6 pontos; Madrugador (needslesssleep) 3 → custa 3).
const LAB = 'PROJECT ZOMBOID · <b>SONO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Mattress", "Item_Pillow", "Item_PillsCaffeine", "Item_PillsSleeping"],
  OFF: 1.3,
  luz: { padrao: 'interior-noite', 2: 'exterior-dia', 7: 'interior-tarde', 9: 'interior-dia' },
  T: [0.0, 2.70, 10.01, 15.91, 20.18, 30.32, 36.80, 43.72, 48.80, 55.29], END: 62.60,
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
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k' + p + (n++);
    const tag = (k, txt, col, at, end, top = 560) => { const id = H.chip(k, txt, at, `left:60px;width:max-content;max-width:760px;white-space:nowrap;text-align:left;top:${top}px;color:${col};font:800 44px/1.15 var(--mono);padding:16px 28px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 660, size: 150, gap: 26 }, o));
    const pop = (id, at, from = { x: 80, opacity: 0 }) => M.enter('#' + id, { at, frames: 9, ease: 'snapSettle', from });
    el('style', null, `.moodle{left:770px;width:150px;height:150px}.mtag{left:700px;width:290px;font-size:28px;line-height:1.35;margin-top:24px}.pzitem b{white-space:nowrap;line-height:1.2}
      .crt{position:absolute;left:140px;width:800px;background:rgba(16,14,13,.95);border:3px solid rgba(239,229,207,.45);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden;color:var(--bone)}
      .crt .hd{height:62px;font:800 26px/62px var(--mono);letter-spacing:4px;padding-left:24px;background:rgba(239,229,207,.08);border-bottom:2px solid rgba(239,229,207,.25)}
      .tl{display:flex;align-items:center;gap:22px;height:118px;padding:0 26px;border-bottom:2px solid rgba(239,229,207,.12)}
      .tl img{width:72px;height:72px;image-rendering:pixelated}
      .tl .nm{font:900 40px/1.1 var(--mono)} .tl .ds{font:600 24px/1.2 var(--mono);color:#c9bfa8;margin-top:6px}
      .tl .v{margin-left:auto;font:900 52px/1 var(--mono)}`, document.head);
    const M0 = (k, ic, txt, at, ok, off, top = 560) => H.moodle(k, ic, txt, at, ok, off, top);
    // 0
    M0(0, 'pz:Mood_Sleepy', "SONO", P(0, 0.15), false, null);
    // 1 — os 4 níveis do moodle
    M0(1, 'pz:Mood_Sleepy', "SONO", P(1, 0.04), false, null);
    tag(1, "MOODLE =<br>ÍCONE DE ESTADO", B, P(1, 0.25), P(1, 0.60));   // v6: explica o termo na 1ª vez (e nada parado > 3 s)
    // v6: os níveis entram com a fala "Ele vai de Sonolência até Cansaço Absurdo" (voz final)
    tag(1, "SONOLÊNCIA", Y, P(1, 0.62), P(1, 0.71));
    tag(1, "CANSAÇO", Y, P(1, 0.71), P(1, 0.77));
    tag(1, "CANSAÇO INTENSO", RD, P(1, 0.77), P(1, 0.83));
    tag(1, "CANSAÇO ABSURDO", RD, P(1, 0.83), null);
    // 2 — enxerga menos e perde força
    M0(2, 'pz:Mood_Sleepy', "SONO", P(2, 0.10), false, null);
    tag(2, "\"O CANSAÇO ESTÁ TIRANDO<br>SUAS FORÇAS\"", B, P(2, 0.48), null);
    // 3 — cadeira: só o fôlego
    M0(3, 'pz:Mood_Exhausted', "FÔLEGO ✓", P(3, 0.40), true, null);
    tag(3, "CANSAÇO, SÓ DORMINDO", RD, P(3, 0.58), null);
    // 4 — onde dorme
    // v6 (Jose: aos 0:34 o chip "CHÃO / CARRO = DOR NO PESCOÇO" vazava da caixa — 29 letras numa linha): 2 linhas, caixa do tamanho do texto
    row(4, [["Item_Mattress", "CAMA BOA", P(4, 0.20)]], { top: 690, left: 120, size: 180 });
    tag(4, "CHÃO / CARRO =<br>MAIS HORAS DORMINDO", RD, P(4, 0.39), P(4, 0.66), 520);
    tag(4, "DOR NO PESCOÇO", RD, P(4, 0.66), null, 520);
    M0(4, 'pz:Mood_Pained', "DOR", P(4, 0.72), false, null, 560);
    row(4, [["Item_Pillow", "TRAVESSEIRO", P(4, 0.84)]], { top: 690, left: 326, size: 180 });
    // 5 — o jogo nem deixa dormir
    tag(5, "ZUMBI PERTO ✗", RD, P(5, 0.32), P(5, 0.51));
    M0(5, 'pz:Mood_Panicked', "PÂNICO", P(5, 0.50), false, P(5, 0.61));
    M0(5, 'pz:Mood_Pained', "DOR", P(5, 0.61), false, P(5, 0.73));
    M0(5, 'pz:Mood_NoxiousSmell', "MAU CHEIRO", P(5, 0.73), false, null);
    // 6 — soníferos, sem álcool
    row(6, [["Item_PillsSleeping", "SONÍFEROS", P(6, 0.12)]], { top: 580 });
    tag(6, "\"AJUDA A PEGAR<br>NO SONO\"", B, P(6, 0.36), P(6, 0.75), 800);   // v6: texto do tooltip do jogo (Tooltip_PillsSleeping)
    row(6, [["Item_BeerBottle", "ÁLCOOL ✗", P(6, 0.76)]], { top: 580, left: 601 });   // v6: ao lado dos soníferos (embaixo cobria o personagem)
    // 7 — cafeína
    row(7, [["Item_PillsCaffeine", "CAFEÍNA", P(7, 0.10)]], { top: 580 });
    tag(7, "NÃO SUBSTITUI A CAMA", RD, P(7, 0.70), null, 800);
    // 8 — exemplo: sonolência → tranca → melhor cama → acorda inteiro
    // v6: chip/ícone junto da fala (Sonolência → tranca → deita na melhor cama → acorda inteiro)
    M0(8, 'pz:Mood_Sleepy', "SONOLÊNCIA", P(8, 0.30), false, P(8, 0.85));
    tag(8, "TRANCA A CASA", B, P(8, 0.49), P(8, 0.61));
    row(8, [["Item_Mattress", "MELHOR CAMA", P(8, 0.62)]], { top: 580, size: 180 });
    tag(8, "ACORDA INTEIRO ✓", G, P(8, 0.85), null, 840);
    // 9 — traços da criação do personagem: ícone, nome, o que faz e o VALOR em pontos
    const cr = el('div', 'crt', `<div class="hd">TRAÇOS · CRIAÇÃO DO PERSONAGEM</div>
      <div class="tl" id="t9a"><img src="./assets/items/trait_insomniac.png"><div><div class="nm">SONO LEVE</div><div class="ds">cansaço sai mais devagar dormindo</div></div><span class="v" id="v9a" style="color:${RD}">+6</span></div>
      <div class="tl" id="t9b"><img src="./assets/items/trait_needslesssleep.png"><div><div class="nm">MADRUGADOR</div><div class="ds">precisa dormir menos</div></div><span class="v" id="v9b" style="color:${G}">−3</span></div>`, H.sc(9), 'top:540px'); cr.id = nid('cr');
    M.enter('#' + cr.id, { at: P(9, 0.04), frames: 12, ease: 'snapSettle', from: { y: 80, opacity: 0, scale: .94 } });
    pop('t9a', P(9, 0.16)); pop('t9b', P(9, 0.50));
    pop('v9a', P(9, 0.32), { scale: 2, opacity: 0 }); pop('v9b', P(9, 0.62), { scale: 2, opacity: 0 });   // v6: o valor em pontos entra depois do nome (ritmo)
    tag(9, "SALVA E COMENTA", G, P(9, 0.80), null, 920);
  }
};
