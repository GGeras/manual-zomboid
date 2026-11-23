// EP 19 — Livros de Habilidade (B42.22) — formato v4 (método do EP14: painéis simples + 3D)
// Conferido nos arquivos do jogo B42.22.2: XPSystem_SkillBook.lua (×3/×5/×8/×12/×16; Pontaria, Lâminas Longas e Recarga = metade),
// ISReadABook.lua (cada 10% das páginas = 10% do bônus; Leitura Dinâmica ×0,7; Leitura Lenta ×1,3; Óculos de Leitura ×0,9; sentado ×0,9),
// literature.txt (BookCarpentry1: LvlSkillTrained 1, NumLevelsTrained 2), PTBR: Carpintaria I…V, Óculos de Leitura, Leitura Dinâmica/Lenta.
// Sem print da aba Habilidades: linha de habilidade como painel simples (NÃO é a tela do jogo).
const LAB = 'PROJECT ZOMBOID · <b>LIVROS</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_Book8', 'Item_Hammer', 'Item_Plank', 'Item_GlassesReading'],
  OFF: 1.3,
  T: [0.0, 2.92, 11.15, 19.46, 26.28, 29.78, 41.53, 44.66, 51.63, 61.62, 65.65], END: 68.6,   // voz final ElevenLabs (23/11 19:45, 67,71 s; 👍 até o fim) — tools/align.py
  luz: { padrao: 'interior-tarde' },   // regra 4.5: fim de tarde dentro de casa (sol pelas janelas + abajur)
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9, lab: LAB }, { at: 10 }],
  titles: [
    { i: 0, a: 'Livro não', b: 'dá nível', aSize: 104, size: 140 },
    { i: 1, a: 'Livro multiplica', b: 'a prática', col: 'green', aSize: 88, size: 128 },
    { i: 2, a: '5 volumes,', b: '2 níveis cada', col: 'green', aSize: 104, size: 116 },
    { i: 3, a: 'O bônus', b: 'cresce', col: 'green', aSize: 104, size: 140 },
    { i: 4, a: 'Algumas rendem', b: 'a metade', aSize: 88, size: 132 },
    { i: 5, a: 'Volume I:', b: '3× mais rápido', col: 'green', aSize: 104, size: 112 },
    { i: 6, a: 'Metade lida,', b: 'metade do bônus', col: 'yellow', aSize: 100, size: 104 },
    { i: 7, a: 'Pulou volume?', b: 'não funciona', aSize: 96, size: 124 },
    { i: 8, a: 'Lê mais', b: 'rápido', col: 'green', aSize: 104, size: 140 },
    { i: 9, a: 'O bônus', b: 'fica com você', col: 'green', aSize: 104, size: 116 },
    { i: 10, a: 'Lê antes,', b: 'pratica depois', col: 'green', aSize: 104, size: 112 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020', GR = '#6d675c';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k' + p + (n++);
    const tag = (k, txt, col, at, end, top = 1130) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const pop = (id, at, from = { y: 50, opacity: 0 }) => M.enter('#' + id, { at, frames: 8, ease: 'snapSettle', from });
    const span = (id, at, end) => { M.hide('#' + id, 0); M.show('#' + id, at); if (end != null) M.hide('#' + id, end); };
    el('style', null, `
      .ui{position:absolute;background:rgba(16,14,13,.94);border:3px solid rgba(239,229,207,.45);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden;color:var(--bone)}
      .ui .hd{height:66px;font:800 28px/66px var(--mono);letter-spacing:4px;padding-left:24px;background:rgba(239,229,207,.08);border-bottom:2px solid rgba(239,229,207,.25)}
      .ui img,.bk img{image-rendering:pixelated}
      .sq{position:absolute;width:56px;height:56px;border-radius:6px;background:rgba(255,255,255,.08);border:2px solid rgba(239,229,207,.3)}
      .xb{position:absolute;height:40px;border-radius:8px;background:rgba(255,255,255,.08);border:2px solid rgba(239,229,207,.3);overflow:hidden}
      .xb i{position:absolute;left:0;top:0;bottom:0;width:100%;transform-origin:left center;background:${G}}
      .rl{position:absolute;font:800 28px/1 var(--mono);color:#c9bfa8;text-align:center;width:70px}
      .bk{position:absolute;width:128px;text-align:center;font:800 22px/1.1 var(--mono)}
      .bk img{width:84px;height:84px;display:block;margin:0 auto 8px}
      .mul{position:absolute;width:128px;text-align:center;font:900 46px/1 var(--mono);color:${Y}}
      .big{position:absolute;left:0;right:0;margin:0 auto;width:max-content;font:900 150px/1 var(--mono)}
      .ln{position:absolute;left:170px;right:170px;display:flex;font:800 40px/1 var(--mono)}`, document.head);
    const panel = (k, head, at, style) => { const p = el('div', 'ui', head ? `<div class="hd">${head}</div>` : '', H.sc(k), style); p.id = nid('p'); M.enter('#' + p.id, { at, frames: 12, ease: 'snapSettle', from: { y: 100, scale: .92, opacity: 0 } }); return p; };
    // linha de habilidade (painel simples): 10 quadrados + barra de experiência SEM números
    const skillRow = (par, top, lit, xpKeys) => { el('div', null, 'CARPINTARIA', par, `position:absolute;left:40px;top:${top}px;font:900 40px/1 var(--mono)`);
      for (let i = 0; i < 10; i++) el('div', 'sq', '', par, `left:${40 + i * 74}px;top:${top + 60}px;${i < lit ? 'background:' + G : ''}`);
      const b = el('div', 'xb ins', '<i></i>', par, `left:40px;top:${top + 136}px;width:722px`); b.id = nid('xb'); M.kf('#' + b.id + ' i', 'scaleX', xpKeys); return b.id; };
    // régua de níveis 0..10 com os 5 volumes (faixas de 2 níveis)
    const ruler = (par, top) => { el('div', null, '', par, `position:absolute;left:60px;top:${top + 40}px;width:660px;height:6px;background:rgba(239,229,207,.5)`);
      for (let i = 0; i <= 10; i++) { el('div', null, '', par, `position:absolute;left:${60 + i * 66 - 2}px;top:${top + 28}px;width:4px;height:30px;background:rgba(239,229,207,.7)`); el('div', 'rl', String(i), par, `left:${60 + i * 66 - 35}px;top:${top - 10}px`); } };
    const ROM = ['I', 'II', 'III', 'IV', 'V'], BX = v => 60 + v * 132 + 2;   // regra 4.3: régua e livros dentro do painel de 800 px
    const book = (par, v, top, at, col = B, id0) => { const e = el('div', 'bk ins', `<img src="./assets/items/Item_Book8.png"><span style="color:${col}">VOL. ${ROM[v]}</span>`, par, `left:${BX(v)}px;top:${top}px`); e.id = id0 || nid('bk'); pop(e.id, at, { y: -60, opacity: 0 }); return e.id; };

    // 0 — gancho: livro não dá nível
    H.item(0, 'Item_Book8', 'CARPINTARIA I', P(0, .10), { left: 440, top: 700, size: 200 });
    tag(0, 'NÍVEL +0 ✗', RD, P(0, .50), null, 990);

    // 1 — multiplica a experiência ganha praticando; sem prática, nada
    const p1 = panel(1, 'HABILIDADE', C(1) + 2, 'left:140px;top:520px;width:800px;height:280px');
    skillRow(p1, 90, 0, [[0, .04], [P(1, .30), .04], [P(1, .52), .7, 'softInOut']]);
    tag(1, 'XP = ENCHE O NÍVEL', B, P(1, .12), P(1, .28), 830);
    H.item(1, 'Item_Hammer', 'PRATICANDO ✓', P(1, .30), { left: 230, top: 830, size: 200, off: P(1, .58) });
    H.item(1, 'Item_Book8', '× LIVRO', P(1, .40), { left: 650, top: 830, size: 200, off: P(1, .58) });
    tag(1, 'SEM PRÁTICA = NADA', RD, P(1, .64), null, 830);
    const st1 = el('div', 'ins', 'BARRA PARADA', p1, `position:absolute;right:40px;top:30px;font:800 28px/1 var(--mono);color:${RD}`); st1.id = nid('st'); span(st1.id, P(1, .82));

    // 2 — 5 volumes, 2 níveis cada (Carpintaria I…V)
    const p2 = panel(2, 'CARPINTARIA I … V', C(2) + 2, 'left:140px;top:520px;width:800px;height:360px');
    ruler(p2, 110);
    for (let v = 0; v < 5; v++) book(p2, v, 220, P(2, .10 + v * .17));
    tag(2, 'CADA UM = 2 NÍVEIS', Y, P(2, .30), P(2, .62), 900);

    // 3 — bônus: ×3 ×5 ×8 ×12 ×16 (arquivo do jogo)
    const p3 = panel(3, 'BÔNUS DE EXPERIÊNCIA', C(3) + 2, 'left:140px;top:520px;width:800px;height:420px');
    ruler(p3, 110); for (let v = 0; v < 5; v++) { const b = el('div', 'bk', `<img src="./assets/items/Item_Book8.png"><span>VOL. ${ROM[v]}</span>`, p3, `left:${BX(v)}px;top:200px`); }
    ['×3', '×5', '×8', '×12', '×16'].forEach((m, v) => { const e = el('div', 'mul ins', m, p3, `left:${BX(v)}px;top:340px`); e.id = nid('mu'); pop(e.id, P(3, .08 + v * .17), { scale: 2, opacity: 0 }); });

    // 4 — Pontaria, Lâminas Longas e Recarga rendem a metade
    const b4 = el('div', 'big ins', '×3', H.sc(4), `top:560px;color:${Y}`); b4.id = nid('b'); span(b4.id, C(4) + 2, P(4, .22));
    const b4b = el('div', 'big ins', '×1,5', H.sc(4), `top:560px;color:${RD}`); b4b.id = nid('b'); span(b4b.id, P(4, .22)); M.kf('#' + b4b.id, 'scale', [[P(4, .22), 1.4], [P(4, .22) + 7, 1, 'snapSettle']]);
    [['PONTARIA', .36], ['LÂMINAS LONGAS', .52], ['RECARGA', .68]].forEach(([t, k], i) => { const e = el('div', 'ln ins', `<span>${t}</span><span style="margin-left:auto;color:${RD}">½</span>`, H.sc(4), `top:${750 + i * 80}px`); e.id = nid('l'); pop(e.id, P(4, k), { x: 60, opacity: 0 }); });

    // 5 — exemplo: sem livro × volume I (mesma construção, ×3), vale até o nível 2
    const p5 = panel(5, 'MESMA CONSTRUÇÃO', C(5) + 2, 'left:140px;top:500px;width:800px;height:420px');
    [['SEM LIVRO', 100, .10, .20, .12], ['VOLUME I', 240, .40, .52, .36]].forEach(([nm, y, k0, k1, to]) => {
      const l = el('div', 'ins', nm, p5, `position:absolute;left:40px;top:${y}px;font:900 40px/1 var(--mono);color:${nm === 'VOLUME I' ? G : B}`); l.id = nid('l'); pop(l.id, P(5, k0 - .04));
      const b = el('div', 'xb ins', '<i></i>', p5, `left:40px;top:${y + 60}px;width:560px`); b.id = nid('xb'); pop(b.id, P(5, k0 - .04));
      M.kf('#' + b.id + ' i', 'scaleX', [[0, 0], [P(5, k0), 0], [P(5, k1), to, 'snapSettle']]);
      const h = el('img', null, null, p5, `position:absolute;left:640px;top:${y + 20}px;width:110px;height:110px;image-rendering:pixelated`); h.src = './assets/items/Item_Hammer.png'; });
    const u5 = el('div', 'ins', 'UM POUCO', p5, `position:absolute;left:330px;top:106px;font:800 30px/1 var(--mono);color:#c9bfa8`); u5.id = nid('u'); pop(u5.id, P(5, .22));
    const x5 = el('div', 'ins', '×3', p5, `position:absolute;left:330px;top:232px;font:900 56px/1 var(--mono);color:${Y}`); x5.id = nid('x'); pop(x5.id, P(5, .58), { scale: 2, opacity: 0 });
    tag(5, 'VALE ATÉ O NÍVEL 2', Y, P(5, .76), null, 940);

    // 6 — metade das páginas = metade do bônus
    const p6 = panel(6, null, C(6) + 2, 'left:140px;top:560px;width:800px;height:330px');
    el('div', null, '"PÁGINAS LIDAS"', p6, 'position:absolute;left:40px;top:40px;font:900 38px/1 var(--mono)');
    const b6 = el('div', 'xb ins', '<i style="background:#ffb020"></i>', p6, 'left:40px;top:100px;width:714px'); b6.id = nid('xb'); M.kf('#' + b6.id + ' i', 'scaleX', [[0, 0], [P(6, .08), 0], [P(6, .40), .5, 'softInOut']]);
    const m6 = el('div', 'ins', '×3', p6, `position:absolute;left:0;right:0;top:190px;text-align:center;font:900 90px/1 var(--mono);color:${G}`); m6.id = nid('m'); span(m6.id, P(6, .10), P(6, .50));
    const m6b = el('div', 'ins', '×1,5', p6, `position:absolute;left:0;right:0;margin:0 auto;width:max-content;top:190px;font:900 90px/1 var(--mono);color:${Y}`); m6b.id = nid('m'); span(m6b.id, P(6, .50)); M.kf('#' + m6b.id, 'scale', [[P(6, .50), 1.4], [P(6, .50) + 7, 1, 'snapSettle']]);

    // 7 — volume muito acima não funciona; volume já passado não serve
    const p7 = panel(7, 'SEU NÍVEL', C(7) + 2, 'left:140px;top:520px;width:800px;height:380px');
    ruler(p7, 110);
    const me = el('div', 'ins', '▼ VOCÊ', p7, `position:absolute;top:40px;left:${60 + 66 - 30}px;font:900 30px/1 var(--mono);color:${G}`); me.id = nid('me');
    M.kf('#' + me.id, 'x', [[0, 0], [P(7, .50), 0], [P(7, .58), 4 * 66, 'softInOut']]);
    const v3 = book(p7, 2, 220, P(7, .14), B); M.kf('#' + v3, 'x', [[P(7, .22), 0], [P(7, .22) + 2, -14], [P(7, .22) + 4, 14], [P(7, .22) + 6, -10], [P(7, .22) + 8, 0]]);
    tag(7, 'MUITO ACIMA ✗', RD, P(7, .26), P(7, .50), 930);
    M.hide('#' + v3, P(7, .50));
    const v1 = book(p7, 0, 220, P(7, .62), GR); M.kf('#' + v1, 'opacity', [[P(7, .70), 1], [P(7, .76), .45]]);
    tag(7, 'NÃO SERVE MAIS', RD, P(7, .72), null, 930);

    // 8 — ler mais rápido (um elemento por vez)
    H.item(8, 'Item_GlassesReading', 'ÓCULOS −10%', P(8, .06), { left: 430, top: 760, size: 220, off: P(8, .30) });
    tag(8, 'SENTADO −10%', G, P(8, .30), P(8, .50), 900);
    H.item(8, 'trait_fastreader', 'LEITURA DINÂMICA<br>−30%', P(8, .50), { left: 430, top: 640, size: 220, off: P(8, .74) });
    H.item(8, 'trait_slowreader', 'LEITURA LENTA<br>+30%', P(8, .76), { left: 430, top: 640, size: 220 });

    // 9 — depois de lido, o bônus fica
    H.item(9, 'Item_Book8', 'GUARDOU', P(9, .06), { left: 445, top: 800, size: 190, off: P(9, .38) });
    const p9 = panel(9, 'HABILIDADE', P(9, .38), 'left:140px;top:520px;width:800px;height:280px');
    skillRow(p9, 90, 0, [[0, .3]]);
    const k9 = el('div', 'ins', '×3 ✓', p9, `position:absolute;left:600px;top:84px;font:900 50px/1 var(--mono);color:${G}`); k9.id = nid('k'); pop(k9.id, P(9, .50), { scale: 2, opacity: 0 });
    tag(9, 'SEM CARREGAR O LIVRO', G, P(9, .64), null, 830);

    // 10 — fecho
    tag(10, 'SALVA E COMENTA', G, P(10, .25), null, 540);
  }
};
