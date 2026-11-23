// EP 17 — Barricadas (B42.22) — formato v4 (método do EP14: painéis simples + 3D)
// Conferido nos arquivos do jogo B42.22.2: PTBR ContextMenu_Barricade "Barricar (Tábuas)", ContextMenu_BarricadeHealth "Durabilidade da Barricada",
// ItemName: Martelo de Garra, Tábua, Pregos, Caixa de Pregos, Marreta, Maçarico de Solda, Lençol, Corda de Lençol;
// weapon.txt: Marreta (Sledgehammer) sem CanBarricade. SEM números de vida (decisão do Jose): só barras comparando.
// Sem print do menu de clique direito: o nome da opção aparece como chip entre aspas (não finge ser a tela do jogo).
const LAB = 'PROJECT ZOMBOID · <b>BARRICADAS</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_Hammer', 'Item_Plank', 'Item_Nails', 'Item_Sledgehamer', 'Item_NailsBox', 'Item_SheetMetal', 'Item_BlowTorch', 'Item_MetalBar', 'Item_Sheet', 'Item_SheetRope'],
  OFF: 1.3,
  T: [0.0, 2.99, 10.68, 27.32, 33.22, 39.0, 43.68, 51.57, 59.86], END: 63.21,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: 'Sua janela é', b: 'a porta da horda', aSize: 96, size: 104 },
    { i: 1, a: 'Barricada =', b: 'vida extra', col: 'green', aSize: 100, size: 132 },
    { i: 2, a: 'Martelo, tábua', b: 'e pregos', col: 'green', aSize: 92, size: 132 },
    { i: 3, a: 'Até 4 tábuas', b: 'de cada lado', col: 'green', aSize: 100, size: 120 },
    { i: 4, a: 'Chapa de metal', b: 'aguenta mais', col: 'green', aSize: 92, size: 116 },
    { i: 5, a: 'Barras: dá pra', b: 'ver lá fora', col: 'green', aSize: 92, size: 124 },
    { i: 6, a: 'Luz acesa?', b: 'cortina antes', aSize: 100, size: 120 },
    { i: 7, a: 'Sempre deixa', b: 'uma saída', col: 'green', aSize: 100, size: 132 },
    { i: 8, a: 'Base sem saída', b: 'é caixão', aSize: 96, size: 136 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k' + p + (n++);
    const tag = (k, txt, col, at, end, top = 1130) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 880, size: 190, gap: 22 }, o));
    const pop = (id, at, from = { y: 50, opacity: 0 }) => M.enter('#' + id, { at, frames: 8, ease: 'snapSettle', from });
    const span = (id, at, end) => { M.hide('#' + id, 0); M.show('#' + id, at); if (end != null) M.hide('#' + id, end); };
    el('style', null, `
      .ui{position:absolute;background:rgba(16,14,13,.94);border:3px solid rgba(239,229,207,.45);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden;color:var(--bone)}
      .ui .hd{height:66px;font:800 28px/66px var(--mono);letter-spacing:4px;padding-left:24px;background:rgba(239,229,207,.08);border-bottom:2px solid rgba(239,229,207,.25)}
      .ui img{image-rendering:pixelated}
      .card{position:absolute;width:300px;height:330px;text-align:center;font:800 32px/1 var(--mono)}
      .card img{width:150px;height:150px;margin:40px auto 24px;display:block}
      .mb{position:absolute;left:90px;width:900px;height:100px}
      .mb b{position:absolute;left:0;top:0;font:800 30px/1 var(--mono);letter-spacing:2px}
      .mb div{position:absolute;left:0;right:0;top:44px;height:48px;border-radius:8px;background:rgba(13,11,11,.85);border:2px solid rgba(239,229,207,.35);overflow:hidden}
      .mb i{position:absolute;left:0;top:0;bottom:0;width:100%;transform-origin:left center}
      .cnt{position:absolute;width:420px;text-align:center;font:900 64px/1 var(--mono)}
      .cnt small{display:block;font:800 30px/1 var(--mono);letter-spacing:3px;margin-bottom:14px;color:#c9bfa8}`, document.head);
    const panel = (k, head, at, style) => { const p = el('div', 'ui', head ? `<div class="hd">${head}</div>` : '', H.sc(k), style); p.id = nid('p'); M.enter('#' + p.id, { at, frames: 12, ease: 'snapSettle', from: { y: 100, scale: .92, opacity: 0 } }); return p; };
    const card = (par, x, icon, name, at, col = B, y = 80) => { const c = el('div', 'card ins', `${icon ? `<img src="./assets/items/${icon}.png">` : ''}<div style="color:${col}">${name}</div>`, par, `left:${x}px;top:${y}px`); c.id = nid('c'); pop(c.id, at); return c.id; };
    const bar = (k, name, top, at, keys, col = G, par) => { const b = el('div', 'mb ins', `<b style="color:${col}">${name}</b><div><i style="background:${col}"></i></div>`, par || H.sc(k), `top:${top}px`); b.id = nid('mb');
      pop(b.id, at, { x: -80, opacity: 0 }); if (keys) M.kf('#' + b.id + ' i', 'scaleX', keys); return b.id; };
    const DUR = '"DURABILIDADE DA BARRICADA"';

    // 0 — gancho: a janela é a entrada (só 3D + título)
    // 1 — barricada = vida extra: zumbi bate, a barra cai, zerou → entra
    const h1 = [P(1, .30), P(1, .46), P(1, .62)];
    bar(1, DUR, 1130, C(1) + 6, [[0, 1], [h1[0], 1], [h1[0] + 3, .68, 'snapSettle'], [h1[1], .68], [h1[1] + 3, .36, 'snapSettle'], [h1[2], .36], [h1[2] + 3, 0, 'snapSettle']], Y);
    H.item(1, 'Item_Plank', 'TÁBUA', P(1, .12), { left: 445, top: 820, size: 190, off: P(1, .70) });
    h1.forEach((h, i) => { const e = el('div', 'ins', 'BATEU!', H.sc(1), `position:absolute;left:0;right:0;margin:0 auto;width:max-content;top:1050px;font:900 44px/1 var(--mono);color:${RD}`); e.id = nid('bt'); span(e.id, h, i < 2 ? h1[i + 1] : P(1, .70)); M.kf('#' + e.id, 'scale', [[h, 1.5], [h + 6, 1, 'snapSettle']]); });
    tag(1, 'ZEROU = ENTRA ✗', RD, P(1, .72), null, 1000);

    // 2 — o que precisa (inventário) → nome do menu → erros comuns
    const p2 = panel(2, 'NO INVENTÁRIO', C(2) + 2, 'left:40px;top:540px;width:1000px;height:470px');
    card(p2, 20, 'Item_Hammer', 'MARTELO ✓', P(2, .04), G); card(p2, 350, 'Item_Plank', 'TÁBUA ✓', P(2, .10), G); card(p2, 680, 'Item_Nails', 'PREGOS ✓', P(2, .16), G);
    M.hide('#' + p2.id, P(2, .27));
    // CLIQUE DIREITO NA JANELA (v2): caixa do tamanho do conteúdo, centrada, sem sobra (cabeçalho + opção do menu + confirmação)
    const q2 = el('div', 'ui', `<div class="hd" style="padding:0 28px;text-align:center">CLIQUE DIREITO NA JANELA</div><div class="ins" style="font:900 60px/1 var(--mono);color:${Y};text-align:center;padding:34px 36px 20px">"Barricar (Tábuas)"</div>`, H.sc(2), 'left:0;right:0;margin:0 auto;width:max-content;top:600px');
    q2.id = nid('q'); span(q2.id, P(2, .27), P(2, .52));
    const ok2 = el('div', 'ins', 'NA JANELA ✓', q2, `text-align:center;font:800 38px/1 var(--mono);color:${G};padding:0 0 28px`); ok2.id = nid('ok'); span(ok2.id, P(2, .40)); M.enter('#' + q2.id, { at: P(2, .27), frames: 10, ease: 'snapSettle', from: { scale: .9, opacity: 0 } });
    H.item(2, 'Item_Sledgehamer', 'MARRETA ✗', P(2, .54), { left: 130, top: 820, size: 200, off: P(2, .70) });
    M.hide('#' + H.cross(2, P(2, .58), 620, 830), P(2, .70));
    H.item(2, 'Item_NailsBox', 'FECHADA ✗', P(2, .72), { left: 130, top: 820, size: 200, off: P(2, .86) });
    tag(2, 'ABRE ANTES', Y, P(2, .76), P(2, .86), 880);
    H.item(2, 'Item_Nails', 'SOLTOS ✓', P(2, .86), { left: 440, top: 820, size: 200 });

    // 3 — até 4 de cada lado: contadores e a barra crescendo (sem número de vida)
    const p3 = panel(3, 'TÁBUAS NA JANELA', C(3) + 2, 'left:90px;top:560px;width:900px;height:290px');
    [['FORA', 40, .10], ['DENTRO', 440, .50]].forEach(([nm, x, k0]) => { for (let q = 0; q <= 4; q++) {
      const e = el('div', 'cnt ins', `<small>${nm}</small>${q}/4`, p3, `left:${x}px;top:96px;color:${q === 4 ? G : B}`); e.id = nid('n');
      const at = q === 0 ? C(3) + 4 : P(3, k0 + (q - 1) * .09); span(e.id, at, q < 4 ? P(3, k0 + q * .09) : null); } });
    const steps = [[0, .1]]; for (let q = 0; q < 8; q++) { const at = P(3, (q < 4 ? .10 : .50) + (q % 4) * .09); steps.push([at, .1 + (q) * .1125], [at + 3, .1 + (q + 1) * .1125, 'snapSettle']); }
    bar(3, DUR, 880, C(3) + 6, steps, G);

    // 4 — chapa de metal x tábua (só comparação) + maçarico
    bar(4, 'TÁBUA', 700, C(4) + 4, [[0, 0], [C(4) + 4, 0], [P(4, .14), .2, 'softInOut']], B);
    bar(4, 'CHAPA DE METAL', 830, P(4, .22), [[0, 0], [P(4, .22), 0], [P(4, .44), 1, 'softInOut']], G);
    row(4, [['Item_SheetMetal', 'CHAPA DE AÇO', P(4, .30)], ['Item_BlowTorch', 'MAÇARICO', P(4, .62)]], { top: 990, size: 160, gap: 120 });
    tag(4, 'SOLDADA ✓', G, P(4, .72), null, 560);

    // 5 — barras de metal: no meio + dá pra ver lá fora
    bar(5, 'TÁBUA', 560, C(5) + 2, [[0, .2]], B);
    bar(5, 'BARRAS DE METAL', 660, P(5, .08), [[0, 0], [P(5, .08), 0], [P(5, .30), .55, 'softInOut']], Y);
    bar(5, 'CHAPA DE METAL', 760, C(5) + 6, [[0, 1]], G);
    H.item(5, 'Item_MetalBar', 'BARRAS', P(5, .20), { left: 445, top: 880, size: 170 });
    tag(5, 'VÊ LÁ FORA ✓', G, P(5, .62), null, 1130);

    // 6 — noite: luz acesa → zumbi vê e vem; lençol → passa reto
    tag(6, 'LUZ ACESA', Y, P(6, .06), P(6, .30), 600);
    tag(6, 'TE VIU ✗', RD, P(6, .30), P(6, .52), 600);
    H.item(6, 'Item_Sheet', 'LENÇOL ✓', P(6, .54), { left: 445, top: 560, size: 180, off: P(6, .80) });
    tag(6, 'PASSA RETO', G, P(6, .80), null, 600);

    // 7 — saída: corda de lençol presa com martelo e prego em janela SEM barricada, andar de cima
    const p7 = panel(7, 'SAÍDA DE EMERGÊNCIA', C(7) + 2, 'left:40px;top:470px;width:1000px;height:440px');
    card(p7, 20, 'Item_Sheet', 'LENÇOL', P(7, .08)); card(p7, 350, 'Item_SheetRope', 'CORDA DE<br><br>LENÇOL', P(7, .20), G);
    card(p7, 680, 'Item_Hammer', 'MARTELO<br><br>+ PREGO', P(7, .34));
    tag(7, 'JANELA SEM BARRICADA ✓', G, P(7, .52), P(7, .74), 940);
    tag(7, 'ANDAR DE CIMA', Y, P(7, .76), null, 940);

    // 8 — fecho
    tag(8, 'SALVA E COMENTA', G, P(8, .40), null, 1110);
  }
};
