// EP 18 — Frio e Calor (B42.22) — formato v4 (método do EP14 + réplica da aba Temperatura)
// RÉPLICA da janela do personagem, aba "Temperatura": layout do print B42 (assets/prints/aba_temperatura_en.png),
// textos PT-BR do jogo (IG_UI.json: IGUI_XP_Info/Skills/Health/Protection, IGUI_Temperature, IGUI_Temp_CoreTemp "Temperatura Central",
// IGUI_Temp_BodyHeat "Produção de Calor Corporal", IGUI_Temp_Cold/Normal/Hot, IGUI_Temp_Low/Med/High, IGUI_Temp_SkinTemperature,
// IGUI_Temp_BodyResponse, IGUI_Temp_Insulation, IGUI_Temp_AdvView). Moodles: Moodles.json (Hypothermia/Hyperthermia/Wet/Windchill).
// SEM números de temperatura (nem fala, nem tela).
const LAB = 'PROJECT ZOMBOID · <b>FRIO E CALOR</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_JacketPaddedGeneric', 'Item_WinterHatBlack', 'Item_ScarfGeneric', 'Item_Bandage', 'Item_Axe', 'Item_Longjohns', 'Item_Sweater_Black', 'Item_WaterBottle_Full', 'Item_Radio'],
  OFF: 1.3,
  T: [0.0, 5.12, 12.72, 20.79, 27.1, 34.57, 44.12, 56.64, 66.11, 69.61, 76.83], END: 83.02,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9, lab: LAB }, { at: 10 }],
  titles: [
    { i: 0, a: 'Frio e calor', b: 'matam sem zumbi', aSize: 100, size: 104 },
    { i: 1, a: 'Quem manda é', b: 'o corpo', col: 'green', aSize: 100, size: 136 },
    { i: 2, a: 'Moodle forte', b: 'é pior', aSize: 100, size: 136 },
    { i: 3, a: 'A roupa é', b: 'o controle', col: 'green', aSize: 100, size: 132 },
    { i: 4, a: 'Esfriou?', b: 'não sara', aSize: 100, size: 136 },
    { i: 5, a: 'Hipotermia:', b: 'perde vida', aSize: 100, size: 132 },
    { i: 6, a: 'Calor', b: 'também cobra', aSize: 100, size: 124 },
    { i: 7, a: 'Roupa molhada', b: 'gela o corpo', aSize: 92, size: 120 },
    { i: 8, a: 'Roupa seca', b: 'em camadas', col: 'green', aSize: 100, size: 128 },
    { i: 9, a: 'No verão:', b: 'sombra e água', col: 'green', aSize: 100, size: 116 },
    { i: 10, a: 'Ouve a', b: 'previsão', col: 'green', aSize: 100, size: 136 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020', BL = '#5aa9ff';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k' + p + (n++);
    const tag = (k, txt, col, at, end, top = 1130, fs = 50) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 ${fs}px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 900, size: 190, gap: 22 }, o));
    const pop = (id, at, from = { y: 50, opacity: 0 }) => M.enter('#' + id, { at, frames: 8, ease: 'snapSettle', from });
    const span = (id, at, end) => { M.hide('#' + id, 0); M.show('#' + id, at); if (end != null) M.hide('#' + id, end); };
    el('style', null, `
      .ui{position:absolute;background:rgba(16,14,13,.94);border:3px solid rgba(239,229,207,.45);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden;color:var(--bone)}
      .ui .hd{height:66px;font:800 28px/66px var(--mono);letter-spacing:4px;padding-left:24px;background:rgba(239,229,207,.08);border-bottom:2px solid rgba(239,229,207,.25)}
      .ui img{image-rendering:pixelated}
      .card{position:absolute;width:240px;height:330px;text-align:center;font:800 32px/1 var(--mono)}
      .card img{width:150px;height:150px;margin:40px auto 24px;display:block}
      .gt{font:700 36px/1.35 var(--mono);padding:24px 28px}
      .mb{position:absolute;left:140px;width:800px;height:100px}
      .mb b{position:absolute;left:0;top:0;font:800 30px/1 var(--mono);letter-spacing:2px}
      .mb div{position:absolute;left:0;right:0;top:44px;height:48px;border-radius:8px;background:rgba(13,11,11,.85);border:2px solid rgba(239,229,207,.35);overflow:hidden}
      .mb i{position:absolute;left:0;top:0;bottom:0;width:100%;transform-origin:left center}
      .th{position:absolute;width:150px;height:340px;border-radius:75px;border:4px solid rgba(239,229,207,.55);background:rgba(13,11,11,.85);overflow:hidden}
      .th i{position:absolute;left:0;right:0;bottom:0;height:100%;transform-origin:center bottom}
      .bm{position:absolute;left:0;right:0;margin:0 auto;width:230px;height:230px}
      .bm>*{position:absolute;left:0;top:0;width:100%;height:100%}
      .bm .bg{left:12px;top:12px;width:206px;height:206px;border-radius:50%}
      .bm img{image-rendering:pixelated}
      .bml{position:absolute;left:0;right:0;margin:0 auto;width:max-content;font:900 48px/1 var(--mono)}
      .tw{position:absolute;left:288px;top:490px;width:480px;height:620px;transform:scale(1.05);transform-origin:0 0;background:#0b0b0b;border:1px solid #5a5a5a;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;color:#fff}
      .tw .tb{height:24px;border-bottom:1px solid #333;position:relative}
      .tw .tb i{position:absolute;top:4px;width:15px;height:15px;border:1.5px solid #ddd;border-radius:50%;font:700 10px/15px Arial;text-align:center;font-style:normal;color:#ddd}
      .tw .tabs{display:flex;height:28px;border-bottom:1px solid #444}
      .tw .tabs span{padding:0 9px;font-size:13px;line-height:28px;color:#ddd;border-right:1px solid #333}
      .tw .tabs .on{background:#3a3a3a;color:#fff}
      .tw .bx{position:absolute;left:232px;top:68px;width:236px;height:440px;border:1px solid #6a6a6a}
      .tw .tt{position:absolute;left:0;right:0;text-align:center;font-size:13px;font-weight:700}
      .tw .gb{position:absolute;left:12px;right:12px;height:12px;border:1px solid #777;background:linear-gradient(90deg,#1426ff,#16c8c8 35%,#2fd02f 50%,#e8e816 70%,#ff2a12)}
      .tw .gl{position:absolute;left:12px;right:12px;display:flex;justify-content:space-between;font-size:11px;color:#bbb}
      .tw .mk{position:absolute;width:3px;height:18px;background:#fff;box-shadow:0 0 6px #fff}
      .tw .bt{position:absolute;left:30px;right:30px;height:20px;border:1px solid #888;background:#000;text-align:center;font-size:12px;line-height:20px}
      .tw .hl{position:absolute;border:2px solid ${Y};border-radius:3px;box-shadow:0 0 10px rgba(255,176,32,.6)}`, document.head);
    const panel = (k, head, at, style) => { const p = el('div', 'ui', head ? `<div class="hd">${head}</div>` : '', H.sc(k), style); p.id = nid('p'); M.enter('#' + p.id, { at, frames: 12, ease: 'snapSettle', from: { y: 100, scale: .92, opacity: 0 } }); return p; };
    const card = (par, x, icon, name, at, col = B, y = 80) => { const c = el('div', 'card ins', `${icon ? `<img src="./assets/items/${icon}.png">` : ''}<div style="color:${col}">${name}</div>`, par, `left:${x}px;top:${y}px`); c.id = nid('c'); pop(c.id, at); return c.id; };
    const mbar = (k, name, top, at, keys, col = G) => { const b = el('div', 'mb ins', `<b style="color:${col}">${name}</b><div><i style="background:${col}"></i></div>`, H.sc(k), `top:${top}px`); b.id = nid('mb');
      pop(b.id, at, { x: -80, opacity: 0 }); if (keys) M.kf('#' + b.id + ' i', 'scaleX', keys); return b.id; };
    // moodle grande do jogo com o nome do nível mudando: names = [[at, 'Nome', corDoFundo], ...]
    const bigMood = (k, icon, names, top = 1080, end) => { const m = el('div', 'bm', `<i class="bg" style="background:${names[0][2]}"></i><img src="./assets/moodles/${icon}.png"><img src="./assets/moodles/_Moodles_BGoutline.png">`, H.sc(k), `top:${top}px`); m.id = nid('bm');
      M.enter('#' + m.id, { at: names[0][0], frames: 9, ease: 'crashIn', from: { scale: 2.2 } }); M.kf('#' + m.id + ' .bg', 'backgroundColor', [[0, names[0][2]], ...names.map(([a, , c]) => [a, c])]); if (end != null) M.hide('#' + m.id, end);
      names.forEach(([a, txt, c], i) => { const l = el('div', 'bml ins', txt, H.sc(k), `top:${top + 262}px;color:${B}`); l.id = nid('ml'); span(l.id, a, i + 1 < names.length ? names[i + 1][0] : end); M.kf('#' + l.id, 'scale', [[a, 1.4], [a + 7, 1, 'snapSettle']]); M.kf('#' + m.id, 'scale', [[a, 1.18], [a + 7, 1, 'snapSettle']]); });
      return m.id; };
    // fundo do moodle no jogo: verde = bom; vermelho mais forte = pior
    const LV = ['#c9a1a1', '#c96a6a', '#b8323e', '#8e0f1f'];
    const BODYF = (fill) => `<svg width="190" height="390" viewBox="0 0 200 400" style="position:absolute;left:16px;top:84px"><g fill="${fill}" stroke="#f0f0f0" stroke-width="2.6" stroke-linejoin="round">
      <ellipse cx="100" cy="27" rx="16" ry="20"/><path d="M109.0 46.0 C109.2 47.5 107.5 52.3 110.0 55.0 C112.5 57.7 119.0 59.8 124.0 62.0 C129.0 64.2 135.7 65.0 140.0 68.0 C144.3 71.0 147.7 74.0 150.0 80.0 C152.3 86.0 152.7 95.0 154.0 104.0 C155.3 113.0 156.3 124.7 158.0 134.0 C159.7 143.3 162.3 151.3 164.0 160.0 C165.7 168.7 166.5 179.7 168.0 186.0 C169.5 192.3 172.0 193.3 173.0 198.0 C174.0 202.7 174.5 209.3 174.0 214.0 C173.5 218.7 171.8 224.3 170.0 226.0 C168.2 227.7 164.7 227.3 163.0 224.0 C161.3 220.7 161.0 211.7 160.0 206.0 C159.0 200.3 158.5 197.3 157.0 190.0 C155.5 182.7 153.0 170.7 151.0 162.0 C149.0 153.3 146.7 146.3 145.0 138.0 C143.3 129.7 142.2 119.0 141.0 112.0 C139.8 105.0 138.8 96.0 138.0 96.0 C137.2 96.0 137.0 103.0 136.0 112.0 C135.0 121.0 131.7 138.0 132.0 150.0 C132.3 162.0 136.7 171.7 138.0 184.0 C139.3 196.3 140.7 208.7 140.0 224.0 C139.3 239.3 134.7 262.7 134.0 276.0 C133.3 289.3 137.3 290.7 136.0 304.0 C134.7 317.3 126.7 344.0 126.0 356.0 C125.3 368.0 131.7 370.7 132.0 376.0 C132.3 381.3 131.3 386.0 128.0 388.0 C124.7 390.0 114.3 393.3 112.0 388.0 C109.7 382.7 113.3 368.7 114.0 356.0 C114.7 343.3 116.0 325.0 116.0 312.0 C116.0 299.0 115.0 290.0 114.0 278.0 C113.0 266.0 112.3 252.0 110.0 240.0 C107.7 228.0 103.3 206.0 100.0 206.0 C96.7 206.0 92.3 228.0 90.0 240.0 C87.7 252.0 87.0 266.0 86.0 278.0 C85.0 290.0 84.0 299.0 84.0 312.0 C84.0 325.0 85.3 343.3 86.0 356.0 C86.7 368.7 90.3 382.7 88.0 388.0 C85.7 393.3 75.3 390.0 72.0 388.0 C68.7 386.0 67.7 381.3 68.0 376.0 C68.3 370.7 74.7 368.0 74.0 356.0 C73.3 344.0 65.3 317.3 64.0 304.0 C62.7 290.7 66.7 289.3 66.0 276.0 C65.3 262.7 60.7 239.3 60.0 224.0 C59.3 208.7 60.7 196.3 62.0 184.0 C63.3 171.7 67.7 162.0 68.0 150.0 C68.3 138.0 65.0 121.0 64.0 112.0 C63.0 103.0 62.8 96.0 62.0 96.0 C61.2 96.0 60.2 105.0 59.0 112.0 C57.8 119.0 56.7 129.7 55.0 138.0 C53.3 146.3 51.0 153.3 49.0 162.0 C47.0 170.7 44.5 182.7 43.0 190.0 C41.5 197.3 41.0 200.3 40.0 206.0 C39.0 211.7 38.7 220.7 37.0 224.0 C35.3 227.3 31.8 227.7 30.0 226.0 C28.2 224.3 26.5 218.7 26.0 214.0 C25.5 209.3 26.0 202.7 27.0 198.0 C28.0 193.3 30.5 192.3 32.0 186.0 C33.5 179.7 34.3 168.7 36.0 160.0 C37.7 151.3 40.3 143.3 42.0 134.0 C43.7 124.7 44.7 113.0 46.0 104.0 C47.3 95.0 47.7 86.0 50.0 80.0 C52.3 74.0 55.7 71.0 60.0 68.0 C64.3 65.0 71.0 64.2 76.0 62.0 C81.0 59.8 87.5 57.7 90.0 55.0 C92.5 52.3 90.8 47.5 91.0 46.0"/></g></svg>`;
    const SKIN = { cold: '#2236ff', cool: '#3a8ad8', ok: '#36c63a', warm: '#e0c020', hot: '#ff3a12' };
    // RÉPLICA aba Temperatura: core = [[at, posição 0..1 (frio→quente), cor do corpo]]
    const tempWin = (k, at, core, end) => { const w = el('div', 'tw', `<div class="tb"><i style="left:6px">×</i><i style="left:26px">i</i></div>
        <div class="tabs"><span>Informações</span><span>Habilidades</span><span>Saúde</span><span>Proteção</span><span class="on">Temperatura</span></div>
        <div class="bx"><div class="tt" style="top:8px">Temperatura Central</div><div class="gb" style="top:30px"></div><div class="gl" style="top:46px"><span>Frio</span><span>Normal</span><span>Quente</span></div>
        <div class="tt" style="top:72px">Produção de Calor Corporal</div><div class="gb" style="top:94px;background:linear-gradient(90deg,#1426ff,#2fd02f 50%,#ff2a12)"></div><div class="gl" style="top:110px"><span>Baixo</span><span>Médio</span><span>Alto</span></div>
        <div class="bt" style="top:146px;color:${Y}">Temperatura da Pele</div><div class="bt" style="top:176px">Resposta do Corpo</div><div class="bt" style="top:206px">Isolamento</div></div>
        <div class="tt" style="top:520px;font-size:15px">Temperatura da Pele</div><div class="gb" style="top:545px"></div><div class="gl" style="top:561px"><span>Frio</span><span>Normal</span><span>Quente</span></div>
        <div class="bt" style="top:584px;left:12px;right:12px">Alternar para Visão Avançada</div>`, H.sc(k)); w.id = nid('tw');
      M.enter('#' + w.id, { at, frames: 12, ease: 'snapSettle', from: { y: 80, opacity: 0 } }); if (end != null) M.hide('#' + w.id, end);
      Object.entries(SKIN).forEach(([nm, col]) => { const b = el('div', null, BODYF(col), w, 'position:absolute;left:0;top:0'); b.id = nid('bd'); M.hide('#' + b.id, 0);
        core.forEach(([a, , c], i) => { if (c === nm) { M.show('#' + b.id, a); const nx = core[i + 1]; if (nx && nx[2] !== nm) M.hide('#' + b.id, nx[0]); } }); });
      const mk = el('div', 'mk', '', w, 'top:95px;left:244px'); mk.id = nid('mk'); const mk2 = el('div', 'mk', '', w, 'top:542px;left:12px'); mk2.id = nid('mk');
      const kx = W => core.map(([a, x], i) => i ? [a + 18, x * W, 'softInOut'] : [0, x * W]); M.kf('#' + mk.id, 'x', kx(210)); M.kf('#' + mk2.id, 'x', kx(452));
      const hl = el('div', 'hl', '', w, 'left:236px;top:72px;width:226px;height:48px'); hl.id = nid('hl'); span(hl.id, at + 10); M.kf('#' + hl.id, 'opacity', [[at + 10, 0], [at + 14, 1], [at + 26, .5, 'softInOut'], [at + 38, 1, 'softInOut']]);
      return w.id; };

    // 0 — gancho
    H.moodle(0, 'pz:Status_TemperatureLow', 'FRIO', P(0, .16), false, P(0, .50) - 3);
    H.moodle(0, 'pz:Status_TemperatureHot', 'CALOR', P(0, .50) + 3);
    tag(0, 'SEM ZUMBI NENHUM', Y, P(0, .74), null, 1000);

    // 1 — dois termômetros: clima e corpo; quem decide é o do corpo
    const p1 = panel(1, 'DOIS TERMÔMETROS', C(1) + 2, 'left:140px;top:480px;width:800px;height:610px');
    [['CLIMA', 140, BL, .06], ['CORPO', 510, G, .20]].forEach(([nm, x, col, k0], i) => { const t = el('div', 'th ins', `<i style="background:${col}"></i>`, p1, `left:${x}px;top:110px`); t.id = nid('th'); pop(t.id, P(1, k0));
      const l = el('div', 'ins', nm, p1, `position:absolute;left:${x - 75}px;width:300px;top:470px;text-align:center;font:900 46px/1 var(--mono);color:${col}`); l.id = nid('tl'); pop(l.id, P(1, k0));
      M.kf('#' + t.id + ' i', 'scaleY', i ? [[0, .55], [P(1, .45), .55], [P(1, .62), .44, 'softInOut']] : [[0, .55], [P(1, .30), .55], [P(1, .45), .12, 'softInOut']]); });
    const ar = el('div', 'ins', '→ EMPURRA →', p1, `position:absolute;left:280px;width:240px;top:250px;text-align:center;font:800 28px/1 var(--mono);color:${Y}`); ar.id = nid('ar'); span(ar.id, P(1, .45), P(1, .70));
    const ck = el('div', 'ins', 'QUEM DECIDE ✓', p1, `position:absolute;left:370px;width:430px;top:545px;text-align:center;font:900 36px/1 var(--mono);color:${G}`); ck.id = nid('ck'); pop(ck.id, P(1, .72));

    // 2 — moodle = ícone de estado na lateral; quanto mais forte, pior (nomes do jogo)
    H.moodle(2, 'pz:Status_TemperatureLow', 'NA LATERAL', C(2) + 4, false, P(2, .28));
    tag(2, 'MOODLE = ÍCONE DE ESTADO', B, P(2, .10), P(2, .28), 900, 42);
    bigMood(2, 'Status_TemperatureLow', [[P(2, .30), 'Um Pouco de Frio', LV[0]], [P(2, .46), 'Frio', LV[1]], [P(2, .62), 'Congelando', LV[2]], [P(2, .78), 'Hipotermia', LV[3]]], 640);
    tag(2, 'MAIS FORTE = PIOR', RD, P(2, .82), null, 1010);

    // 3 — roupa: cada peça segura calor e corta o vento
    row(3, [['Item_JacketPaddedGeneric', 'CASACO', P(3, .08)], ['Item_WinterHatBlack', 'GORRO', P(3, .16)], ['Item_ScarfGeneric', 'CACHECOL', P(3, .24)]], { top: 860, size: 170, gap: 90 });
    tag(3, 'SEGURA CALOR ✓', G, P(3, .36), P(3, .60), 1110);
    H.moodle(3, 'pz:Status_Windchill', 'VENTO FRIO', P(3, .55));
    tag(3, 'CORTA O VENTO ✓', G, P(3, .62), null, 1110);

    // 4 — esfriou: ferida não sara; depois luta e corrida mais lentas (réplica: Temperatura Central indo pro frio)
    tempWin(4, C(4) + 2, [[0, .5, 'ok'], [P(4, .06), .22, 'cool']], P(4, .30));
    H.item(4, 'Item_Bandage', 'NÃO SARA ✗', P(4, .31), { left: 430, top: 820, size: 220, off: P(4, .58) });
    H.item(4, 'Item_Axe', 'LUTA LENTA', P(4, .62), { left: 430, top: 700, size: 220 });
    tag(4, 'CORRE MAIS DEVAGAR', RD, P(4, .78), null, 1060);

    // 5 — hipotermia: sem correr, quase sem ataque, perde vida
    bigMood(5, 'Status_TemperatureLow', [[C(5) + 4, 'Hipotermia', LV[3]]], 560);
    tag(5, 'SEM CORRER', RD, P(5, .30), P(5, .48), 900);
    tag(5, 'QUASE SEM ATAQUE', RD, P(5, .48), P(5, .64), 900);
    mbar(5, 'VIDA', 990, P(5, .66), [[0, 1], [P(5, .70), 1], [P(5, .98), .35, 'softInOut']], RD);
    H.moodle(5, 'pz:Mood_Pained', 'DOR', P(5, .74));

    // 6 — calor: sede e cansaço → lento → hipertermia perde vida (nomes e textos do jogo)
    bigMood(6, 'Status_TemperatureHot', [[C(6) + 4, 'Calor Desconfortável', LV[0]], [P(6, .42), 'Superaquecimento', LV[1]], [P(6, .56), 'Insolação', LV[2]], [P(6, .70), 'Hipertermia', LV[3]]], 520);
    const t6 = el('div', 'ui gt ins', '"Você sente mais sede."', H.sc(6), 'left:140px;top:860px;width:800px;text-align:center'); t6.id = nid('t'); span(t6.id, P(6, .10), P(6, .24));
    row(6, [['Item_WaterBottle_Full', 'SEDE', P(6, .24)]], { top: 900, size: 130, off: P(6, .42) });
    H.moodle(6, 'pz:Mood_Sleepy', 'CANSAÇO', P(6, .30), false, P(6, .56));
    tag(6, 'MAIS LENTO', RD, P(6, .46), P(6, .70), 900);
    const t6b = el('div', 'ui gt ins', '"O calor está consumindo sua vida."', H.sc(6), `left:140px;top:860px;width:800px;text-align:center;font-size:31px;color:${RD}`); t6b.id = nid('t'); span(t6b.id, P(6, .74), P(6, .86));
    mbar(6, 'VIDA', 860, P(6, .86), [[0, 1], [P(6, .87), 1], [P(6, .99), .4, 'softInOut']], RD);

    // 7 — exemplo: inverno, chuva, casaco molhado gela o corpo
    H.item(7, 'Item_JacketPaddedGeneric', 'CASACO', P(7, .06), { left: 445, top: 760, size: 190, off: P(7, .22) });
    bigMood(7, 'Status_Wet', [[P(7, .22), 'Úmido', LV[0]], [P(7, .34), 'Molhado', LV[1]], [P(7, .46), 'Ensopado', LV[2]], [P(7, .58), 'Encharcado', LV[3]]], 640, P(7, .72));
    mbar(7, '"TEMPERATURA CENTRAL"', 880, P(7, .72), [[0, .5], [P(7, .74), .5], [P(7, .96), .15, 'softInOut']], BL);
    tag(7, 'PERDE O CALOR ✗', RD, P(7, .78), null, 1030);

    // 8 — em casa: roupa seca, em camadas
    const p8 = panel(8, 'TROCA A ROUPA', C(8) + 2, 'left:140px;top:520px;width:800px;height:430px');
    card(p8, 20, 'Item_Longjohns', 'CEROULA', P(8, .14), G); card(p8, 280, 'Item_Sweater_Black', 'SUÉTER', P(8, .34), G); card(p8, 540, 'Item_JacketPaddedGeneric', 'CASACO SECO', P(8, .54), G);
    tag(8, 'CAMADAS ✓', G, P(8, .72), null, 1000);

    // 9 — verão: tira camadas, sombra, água
    H.item(9, 'Item_JacketPaddedGeneric', 'TIRA ✗', P(9, .06), { left: 445, top: 760, size: 180, off: P(9, .34) });
    tag(9, 'FICA NA SOMBRA', G, P(9, .36), P(9, .56), 900);
    H.item(9, 'Item_WaterBottle_Full', 'BEBE ÁGUA', P(9, .56), { left: 445, top: 760, size: 180 });
    H.moodle(9, 'pz:Status_Thirst', 'SEM SEDE', P(9, .80), true);

    // 10 — previsão no rádio; CTA
    H.item(10, 'Item_Radio', 'PREVISÃO', C(10) + 4, { left: 445, top: 760, size: 190 });
    tag(10, 'VESTE PRA ELA', G, P(10, .30), P(10, .58), 1040);
    tag(10, 'SALVA E COMENTA', G, P(10, .60), null, 1040);
  }
};
