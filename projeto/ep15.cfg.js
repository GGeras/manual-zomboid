// EP 15 — Medicina (B42.22) — formato v4 (método do EP13)
// Nomes PT-BR do jogo (IG_UI/ItemName/ContextMenu): Arranhado, Corte, Ferida Profunda, Queimado, Fratura, Cacos de Vidro Alojados, Bala Alojada,
// Curativo Sujo, Infeccionado, Pinça, Agulha, Linha, Tala, Pano, Antibióticos, Frasco de Desinfetante, Lenços Umedecidos com Álcool, Suturar, Colocar Tala.
// Chances da infecção zumbi (7/25/100) e regras de tratamento: pindrop.gg injuries (B42.22).
const LAB = 'PROJECT ZOMBOID · <b>MEDICINA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_Bandage', 'Item_BandageDirty', 'Item_Alcohol', 'Item_AlcoholWipes', 'Item_Antibiotics', 'Item_Needle', 'Item_Thread', 'Item_SutureNeedle', 'Item_Splint', 'Item_Rag', 'Item_Plank', 'Item_Branch', 'Item_Tweezers'],
  OFF: 1.3,
  T: [0.0, 7.57, 16.75, 22.8, 30.75, 38.15, 41.71, 51.51, 57.95, 67.11, 73.28], END: 77.87,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9, lab: LAB }, { at: 10 }],
  titles: [
    { i: 0, a: 'Arranhão', b: 'quase nunca vira', aSize: 100, size: 104 },
    { i: 1, a: 'Duas', b: 'infecções', size: 140 },
    { i: 2, a: 'Infecção', b: 'da ferida', col: 'green', size: 130 },
    { i: 3, a: 'Painel', b: 'de saúde', col: 'green', size: 136 },
    { i: 4, a: 'Cada ferida', b: 'um tratamento', aSize: 96, size: 108 },
    { i: 5, a: 'Fratura:', b: 'tala', size: 150 },
    { i: 6, a: 'Vidro:', b: 'pinça primeiro', aSize: 100, size: 112 },
    { i: 7, a: 'Bala:', b: 'pinça e sutura', aSize: 100, size: 112 },
    { i: 8, a: 'Curativo sujo', b: 'infecciona', aSize: 92, size: 120 },
    { i: 9, a: 'Infeccionou?', b: 'trata', col: 'green', aSize: 96, size: 140 },
    { i: 10, a: 'Mordida', b: 'ninguém cura', aSize: 100, size: 116 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1100) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 860, size: 190, gap: 22 }, o));
    let n = 0; const nid = p => 'k' + p + (n++);
    el('style', null, `
      .ui{position:absolute;background:rgba(16,14,13,.94);border:3px solid rgba(239,229,207,.45);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden;color:var(--bone)}
      .ui .hd{height:66px;font:800 28px/66px var(--mono);letter-spacing:4px;padding-left:24px;background:rgba(239,229,207,.08);border-bottom:2px solid rgba(239,229,207,.25)}
      .ui img{image-rendering:pixelated}
      .card{position:absolute;width:300px;height:330px;text-align:center;font:800 34px/1 var(--mono)}
      .card img{width:150px;height:150px;margin:40px auto 24px;display:block}
      .bar{position:absolute;height:46px;border-radius:8px;background:rgba(255,255,255,.08);border:2px solid rgba(239,229,207,.3);overflow:hidden}
      .bar i{position:absolute;left:0;top:0;bottom:0;width:100%;transform-origin:left center}
      .slot{position:absolute;width:120px;height:120px;border:3px dashed rgba(239,229,207,.35);border-radius:10px}
      .slot img{width:96px;height:96px;margin:9px}
      .sq{position:absolute;width:62px;height:62px;border-radius:6px;background:rgba(255,255,255,.08);border:2px solid rgba(239,229,207,.3)}
      .tip{font:700 40px/1.35 var(--mono);padding:26px 30px}`, document.head);
    const panel = (k, head, at, style) => { const p = el('div', 'ui', head ? `<div class="hd">${head}</div>` : '', H.sc(k), style); p.id = nid('p'); M.enter('#' + p.id, { at, frames: 12, ease: 'snapSettle', from: { y: 100, scale: .92, opacity: 0 } }); return p; };
    const card = (par, x, icon, name, at, col = B) => { const c = el('div', 'card ins', `${icon ? `<img src="./assets/items/${icon}.png">` : ''}<div style="color:${col}">${name}</div>`, par, `left:${x}px;top:80px`); c.id = nid('c'); M.enter('#' + c.id, { at, frames: 8, ease: 'snapSettle', from: { y: 50, opacity: 0 } }); return c.id; };

    const line = (par, y, left, right, colR, at) => { const e = el('div', 'ins', `<span>${left}</span><span style="margin-left:auto;color:${colR}">${right}</span>`, par, `position:absolute;left:30px;right:30px;top:${y}px;display:flex;font:800 38px/1 var(--mono)`); e.id = nid('l'); M.enter('#' + e.id, { at, frames: 8, ease: 'snapSettle', from: { x: 60, opacity: 0 } }); return e.id; };
    // RÉPLICA da janela do personagem, aba Saúde (layout do print do jogo; textos de IG_UI/ContextMenu PTBR 42.22)
    el('style', null, `
      .hp{position:absolute;left:252px;top:470px;width:480px;height:560px;transform:scale(1.2);transform-origin:0 0;background:#080808;border:1px solid #5a5a5a;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;color:#fff}
      .hp .tb{height:26px;border-bottom:1px solid #333;position:relative}
      .hp .tb i{position:absolute;top:4px;width:16px;height:16px;border:1.5px solid #ddd;border-radius:50%;font:700 11px/16px Arial;text-align:center;font-style:normal;color:#ddd}
      .hp .tabs{display:flex;height:28px;border-bottom:1px solid #444}
      .hp .tabs span{padding:0 9px;font-size:13px;line-height:28px;color:#ddd;border-right:1px solid #333}
      .hp .tabs .on{background:#3a3a3a;color:#fff}
      .hp .ex{position:absolute;left:252px;top:70px;width:200px;height:32px;border:2px solid #ddd;font:600 15px/32px Arial;text-align:center}
      .hp .lb{position:absolute;left:252px;font-size:14px;font-weight:600}
      .hp .pt{position:absolute;left:252px;width:214px;background:#2c2c2c;padding:4px 6px 6px;font-size:14px;font-weight:600}
      .hp .pt div{color:#e0405a;padding-left:16px}
      .hp .ft{position:absolute;left:10px;bottom:10px;font-size:12px;color:#ddd}`, document.head);
    const BODY = `<svg width="190" height="390" viewBox="0 0 200 400" style="position:absolute;left:8px;top:76px"><g fill="none" stroke="#f0f0f0" stroke-width="2.6" stroke-linejoin="round">
      <ellipse cx="100" cy="27" rx="16" ry="20"/><path d="M109.0 46.0 C109.2 47.5 107.5 52.3 110.0 55.0 C112.5 57.7 119.0 59.8 124.0 62.0 C129.0 64.2 135.7 65.0 140.0 68.0 C144.3 71.0 147.7 74.0 150.0 80.0 C152.3 86.0 152.7 95.0 154.0 104.0 C155.3 113.0 156.3 124.7 158.0 134.0 C159.7 143.3 162.3 151.3 164.0 160.0 C165.7 168.7 166.5 179.7 168.0 186.0 C169.5 192.3 172.0 193.3 173.0 198.0 C174.0 202.7 174.5 209.3 174.0 214.0 C173.5 218.7 171.8 224.3 170.0 226.0 C168.2 227.7 164.7 227.3 163.0 224.0 C161.3 220.7 161.0 211.7 160.0 206.0 C159.0 200.3 158.5 197.3 157.0 190.0 C155.5 182.7 153.0 170.7 151.0 162.0 C149.0 153.3 146.7 146.3 145.0 138.0 C143.3 129.7 142.2 119.0 141.0 112.0 C139.8 105.0 138.8 96.0 138.0 96.0 C137.2 96.0 137.0 103.0 136.0 112.0 C135.0 121.0 131.7 138.0 132.0 150.0 C132.3 162.0 136.7 171.7 138.0 184.0 C139.3 196.3 140.7 208.7 140.0 224.0 C139.3 239.3 134.7 262.7 134.0 276.0 C133.3 289.3 137.3 290.7 136.0 304.0 C134.7 317.3 126.7 344.0 126.0 356.0 C125.3 368.0 131.7 370.7 132.0 376.0 C132.3 381.3 131.3 386.0 128.0 388.0 C124.7 390.0 114.3 393.3 112.0 388.0 C109.7 382.7 113.3 368.7 114.0 356.0 C114.7 343.3 116.0 325.0 116.0 312.0 C116.0 299.0 115.0 290.0 114.0 278.0 C113.0 266.0 112.3 252.0 110.0 240.0 C107.7 228.0 103.3 206.0 100.0 206.0 C96.7 206.0 92.3 228.0 90.0 240.0 C87.7 252.0 87.0 266.0 86.0 278.0 C85.0 290.0 84.0 299.0 84.0 312.0 C84.0 325.0 85.3 343.3 86.0 356.0 C86.7 368.7 90.3 382.7 88.0 388.0 C85.7 393.3 75.3 390.0 72.0 388.0 C68.7 386.0 67.7 381.3 68.0 376.0 C68.3 370.7 74.7 368.0 74.0 356.0 C73.3 344.0 65.3 317.3 64.0 304.0 C62.7 290.7 66.7 289.3 66.0 276.0 C65.3 262.7 60.7 239.3 60.0 224.0 C59.3 208.7 60.7 196.3 62.0 184.0 C63.3 171.7 67.7 162.0 68.0 150.0 C68.3 138.0 65.0 121.0 64.0 112.0 C63.0 103.0 62.8 96.0 62.0 96.0 C61.2 96.0 60.2 105.0 59.0 112.0 C57.8 119.0 56.7 129.7 55.0 138.0 C53.3 146.3 51.0 153.3 49.0 162.0 C47.0 170.7 44.5 182.7 43.0 190.0 C41.5 197.3 41.0 200.3 40.0 206.0 C39.0 211.7 38.7 220.7 37.0 224.0 C35.3 227.3 31.8 227.7 30.0 226.0 C28.2 224.3 26.5 218.7 26.0 214.0 C25.5 209.3 26.0 202.7 27.0 198.0 C28.0 193.3 30.5 192.3 32.0 186.0 C33.5 179.7 34.3 168.7 36.0 160.0 C37.7 151.3 40.3 143.3 42.0 134.0 C43.7 124.7 44.7 113.0 46.0 104.0 C47.3 95.0 47.7 86.0 50.0 80.0 C52.3 74.0 55.7 71.0 60.0 68.0 C64.3 65.0 71.0 64.2 76.0 62.0 C81.0 59.8 87.5 57.7 90.0 55.0 C92.5 52.3 90.8 47.5 91.0 46.0"/></g></svg>`;
    const MK = { 'Braço Direito': [49, 108], 'Mão Direita': [32, 210], 'Antebraço Esquerdo': [157, 165], 'Coxa Direita': [74, 240] };
    // parts: [[parte, [ferimentos], de, até]]  (de/até = frames em que a linha aparece)
    const healthPanel = (k, at, status, parts) => { const p = el('div', 'hp', `<div class="tb"><i style="left:6px">×</i><i style="left:28px">i</i></div><div class="tabs"><span>Informações</span><span>Habilidades</span><span class="on">Saúde</span><span>Proteção</span><span>Temperatura</span></div>${BODY}
        <div style="position:absolute;left:206px;top:80px;width:20px;height:330px;background:linear-gradient(#fff,#cfcfcf 35%,#5a5a5a 75%,#1a1a1a);border:1px solid #666"></div>
        <svg width="26" height="24" viewBox="0 0 26 24" style="position:absolute;left:203px;top:428px"><path d="M13 22 C2 14 0 8 4 4 C8 0 12 3 13 6 C14 3 18 0 22 4 C26 8 24 14 13 22 Z" fill="#e070a8"/></svg>
        <div class="ex">Exercitar-se</div><div class="lb" style="top:120px">Estado Geral do Corpo</div><div class="lb" style="top:142px;color:#ff7090">${status}</div>
        <div class="ft">Clique com o botão direito para exibir o menu Tratamento</div>`, H.sc(k)); p.id = nid('hp');
      M.enter('#' + p.id, { at, frames: 12, ease: 'snapSettle', from: { y: 80, opacity: 0 } });
      let y = 172; parts.forEach(([part, inj, a, b], pi) => { const e = el('div', 'pt ins', `${part}${inj.map(t => `<div>- ${t}</div>`).join('')}`, p, `top:${y}px`); e.id = nid('pt'); M.hide('#' + e.id, 0); M.show('#' + e.id, a ?? at + 8); if (b) M.hide('#' + e.id, b);
        const [mx, my] = MK[part] || [100, 200]; const m = el('div', null, '', p, `position:absolute;left:${8 + mx * .95 - 6}px;top:${76 + my * .975 - 6}px;width:12px;height:12px;border:2px solid #e0405a;border-radius:50%`); m.id = nid('mk'); M.hide('#' + m.id, 0); M.show('#' + m.id, a ?? at + 8); if (b) M.hide('#' + m.id, b);
        if (!(parts[pi + 1] && parts[pi + 1][0] === part)) y += 30 + inj.length * 20; });
      return p; };
    // 0 — gancho
    tag(0, 'ARRANHÃO DE ZUMBI', B, P(0, .12), P(0, .5), 1000);
    tag(0, 'O PERIGO É A FERIDA', Y, P(0, .55), null, 1000);
    // 1 — infecção zumbi: chance sorteada pelo tipo do ataque
    const p1 = panel(1, 'INFECÇÃO ZUMBI · CHANCE', C(1) + 2, 'left:60px;top:480px;width:960px;height:560px');
    [['ARRANHADO', .07, '7%', P(1, .30)], ['CORTE', .25, '25%', P(1, .45)], ['MORDIDO', 1, '100%', P(1, .60)]].forEach(([t, v, txt, at], i) => {
      line(p1, 110 + i * 150, t, txt, i === 2 ? RD : Y, at);
      const br = el('div', 'bar', `<i style="background:${i === 2 ? RD : Y}"></i>`, p1, `left:30px;top:${160 + i * 150}px;width:900px;height:36px`); br.id = nid('b');
      M.kf('#' + br.id + ' i', 'scaleX', [[0, 0], [at, 0], [at + 14, v, 'softInOut']]); });
    tag(1, 'SEM CURA', RD, P(1, .86), null, 1060);
    // 2 — infecção da ferida
    row(2, [['Item_BandageDirty', 'CURATIVO SUJO', P(2, .35)]], { size: 240, top: 780, left: 420 });
    tag(2, 'ESSA TEM TRATAMENTO', G, P(2, .75), null, 1100);
    // 3 — painel de saúde (tela do corpo)
    healthPanel(3, C(3) + 2, 'Dano leve', [['Antebraço Esquerdo', ['Arranhado'], P(3, .18)], ['Coxa Direita', ['Corte', 'Sangrando'], P(3, .28)], ['Mão Direita', ['Cacos de Vidro Alojados'], P(3, .38)]]);
    tag(3, 'ZUMBI NÃO APARECE', RD, P(3, .50), P(3, .78), 1160);
    tag(3, 'TIPO = TRATAMENTO', G, P(3, .80), null, 1160);
    // 4 — tratamentos
    H.item(4, 'Item_Alcohol', 'DESINFETAR', P(4, .12), { left: 230, top: 800, size: 200, off: P(4, .58) });
    H.item(4, 'Item_Bandage', 'CURATIVO', P(4, .24), { left: 650, top: 800, size: 200, off: P(4, .58) });
    tag(4, 'ARRANHÃO, CORTE, QUEIMA', B, P(4, .30), P(4, .55), 1100);
    H.item(4, 'Item_Needle', 'AGULHA', P(4, .62), { left: 230, top: 800, size: 200 });
    H.item(4, 'Item_Thread', 'LINHA', P(4, .70), { left: 650, top: 800, size: 200 });
    tag(4, 'PROFUNDA: SUTURAR', Y, P(4, .82), null, 1100);
    // 5 — fratura
    row(5, [['Item_Rag', 'PANO', P(5, .25)], ['Item_Plank', 'TÁBUA', P(5, .45)], ['Item_Branch', 'GALHO', P(5, .60)]], { size: 180, gap: 60, top: 820 });
    tag(5, 'COLOCAR TALA', G, P(5, .80), null, 1100);
    // 6 — vidro: pinça primeiro
    healthPanel(6, C(6) + 2, 'Dano muito leve', [['Mão Direita', ['Cacos de Vidro Alojados'], C(6) + 10, P(6, .42)], ['Mão Direita', ['Corte'], P(6, .42) + 1]]);
    H.item(6, 'Item_Tweezers', 'PINÇA', P(6, .30), { left: 850, top: 600, size: 150, off: P(6, .74) });
    tag(6, 'COM VIDRO NÃO FECHA', RD, P(6, .50), P(6, .74), 1160);
    tag(6, 'DESINFETA + CURATIVO', G, P(6, .78), null, 1160);
    // 7 — bala
    healthPanel(7, C(7) + 2, 'Dano leve', [['Braço Direito', ['Bala Alojada'], C(7) + 10, P(7, .40)], ['Braço Direito', ['Ferida Profunda'], P(7, .40) + 1]]);
    H.item(7, 'Item_Tweezers', 'PINÇA', P(7, .22), { left: 850, top: 600, size: 150, off: P(7, .55) });
    tag(7, 'VIRA FERIDA PROFUNDA', Y, P(7, .45), P(7, .62), 1160);
    tag(7, 'SUTURAR + CURATIVO', G, P(7, .66), null, 1160);
    // 8 — curativo sujo
    row(8, [['Item_Bandage', 'LIMPO', C(8) + 8], ['Item_BandageDirty', 'SUJO', P(8, .20)]], { size: 200, gap: 160, top: 800 });
    H.cross(8, P(8, .45), 720, 800);
    tag(8, 'O QUE MAIS INFECCIONA', RD, P(8, .52), P(8, .73), 1100);
    tag(8, 'TROCA OU LAVA', G, P(8, .75), null, 1100);
    // 9 — tratar a infecção da ferida
    row(9, [['Item_Alcohol', 'DESINFETANTE', P(9, .15)], ['Item_AlcoholWipes', 'LENÇO C/ ÁLCOOL', P(9, .28)], ['Item_Antibiotics', 'ANTIBIÓTICOS', P(9, .42)]], { size: 250, gap: 20, top: 800 });
    tag(9, 'SÓ A DA FERIDA', Y, P(9, .75), null, 1110);
    // 10 — mordida
    tag(10, 'MORDIDO = SEM CURA', RD, C(10) + 10, null, 1000);
    tag(10, 'SALVA ESSE VÍDEO', G, P(10, .65), null, 1100);
  }
};
