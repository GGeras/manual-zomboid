// EP 16 — Animais (B42.22) — formato v4 (método do EP14: painéis simples + 3D; réplica da janela do animal)
// Réplica "Informações do Animal": layout do print B42 (assets/prints/janela_animal_en.png) e textos PT-BR do jogo
// (IG_UI.json: IGUI_AnimalType, IGUI_AnimalBreed, IGUI_char_Sex, IGUI_char_Age, IGUI_XP_Health, IGUI_Animal_Appearance,
//  IGUI_Animal_Stress, IGUI_Animal_ZoneName + valores Saudável/Morrendo/Bem Alimentado/Sem Sede/Morrendo de Fome/
//  Morrendo de Sede/Calmo/Estressado). Sem botões de debug (Alterar/Definir idade) e sem números de debug.
const LAB = 'PROJECT ZOMBOID · <b>ANIMAIS</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_Head_CowFemale_Brown', 'Item_Head_Sheep_White', 'Item_Head_Chicken_Hen', 'Item_CowBrown_Dead', 'Item_Chicken_HenBrown_Dead', 'Item_Rope',
    'Item_AnimalFeed', 'Item_Bucket_Water', 'Item_FeedingTrough', 'Item_Chicken_HenWhite', 'Item_Chicken_HenBrown', 'Item_Chicken_RoosterBrown', 'Item_Egg',
    'Item_Chicken_Chick', 'Item_Head_CowMale_Brown', 'Item_Bucket_Milk', 'Item_SheepShears', 'Item_WoolRaw', 'Item_HandGun'],
  OFF: 1.3,
  T: [0.0, 7.85, 17.44, 20.79, 35.25, 45.49, 59.89, 72.47, 74.55], END: 78.73,   // voz final ElevenLabs (Jhony Tygas), tempos pelas pausas reais
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: 'Animais da B42', b: 'podem morrer', aSize: 92, size: 120 },
    { i: 1, a: 'Fazenda, longe', b: 'da cidade', col: 'green', aSize: 92, size: 124 },
    { i: 2, a: 'Animal precisa', b: 'de 3 coisas', col: 'green', aSize: 92, size: 124 },
    { i: 3, a: 'Ração e água:', b: 'dois cochos', aSize: 96, size: 124 },
    { i: 4, a: 'Zumbi não ataca,', b: 'mas estressa', aSize: 88, size: 120 },
    { i: 5, a: 'Galinha bota', b: 'sem galo', col: 'green', aSize: 100, size: 132 },
    { i: 6, a: 'Sem macho,', b: 'sem leite', aSize: 100, size: 132 },
    { i: 7, a: 'Acariciar', b: 'acalma', col: 'green', aSize: 100, size: 132 },
    { i: 8, a: 'Comida, água', b: 'e calma', col: 'green', aSize: 100, size: 132 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020', GR = 'rgba(255,255,255,.5)';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k' + p + (n++);
    const tag = (k, txt, col, at, end, top = 1150) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 860, size: 190, gap: 22 }, o));
    const pop = (id, at, from = { y: 50, opacity: 0 }) => M.enter('#' + id, { at, frames: 8, ease: 'snapSettle', from });
    const span = (id, at, end) => { M.hide('#' + id, 0); M.show('#' + id, at); if (end != null) M.hide('#' + id, end); };
    el('style', null, `
      .ui{position:absolute;background:rgba(16,14,13,.94);border:3px solid rgba(239,229,207,.45);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden;color:var(--bone)}
      .ui .hd{height:66px;font:800 28px/66px var(--mono);letter-spacing:4px;padding-left:24px;background:rgba(239,229,207,.08);border-bottom:2px solid rgba(239,229,207,.25)}
      .ui img,.aw img{image-rendering:pixelated}
      .card{position:absolute;width:300px;height:330px;text-align:center;font:800 34px/1 var(--mono)}
      .card img{width:150px;height:150px;margin:40px auto 24px;display:block}
      .mb{position:absolute;left:90px;width:900px;height:96px}
      .mb b{position:absolute;left:0;top:0;font:800 30px/1 var(--mono);letter-spacing:3px}
      .mb div{position:absolute;left:0;right:0;top:42px;height:44px;border-radius:8px;background:rgba(13,11,11,.8);border:2px solid rgba(239,229,207,.35);overflow:hidden}
      .mb i{position:absolute;left:0;top:0;bottom:0;width:100%;transform-origin:left center}
      .aw{position:absolute;left:20px;width:1040px;background:rgba(18,17,15,.95);border:2px solid #5d5d5d;box-shadow:0 20px 60px rgba(0,0,0,.7);color:#fff;font-family:Inter,Arial,sans-serif;overflow:hidden}
      .aw .tb{height:46px;background:#232220;border-bottom:2px solid #4a4a4a;position:relative}
      .aw .tb s{position:absolute;top:8px;width:28px;height:28px;border:2px solid #ddd;border-radius:50%;font:700 18px/26px Inter;text-align:center;text-decoration:none;color:#ddd}
      .aw .av{position:absolute;left:24px;top:76px;width:190px;height:190px;border:2px solid #9a9a9a;background:linear-gradient(#8e8e8e,#2f2f2f);display:flex;align-items:center;justify-content:center}
      .aw .nm{position:absolute;left:250px;top:66px;font:500 40px/1.2 Inter;border-bottom:2px solid #888;padding-bottom:6px}
      .aw .rn{position:absolute;left:740px;top:70px;background:#000;border:1px solid #333;font:600 26px/44px Inter;padding:0 22px}
      .aw .r{position:absolute;left:0;width:420px;text-align:right;font:500 27px/1 Inter;color:#fff}
      .aw .v{position:absolute;left:436px;font:500 27px/1 Inter;color:${GR};white-space:nowrap}
      .hl{position:absolute;left:226px;width:800px;height:44px;border:3px solid ${Y};border-radius:6px;box-shadow:0 0 18px rgba(255,176,32,.5)}
      .gt{font:700 36px/1.35 var(--mono);padding:24px 28px}
      .mapb{position:absolute;border-radius:6px}
      .wave{position:absolute;border:5px solid ${B};border-radius:50%;opacity:0}`, document.head);
    const panel = (k, head, at, style) => { const p = el('div', 'ui', head ? `<div class="hd">${head}</div>` : '', H.sc(k), style); p.id = nid('p'); M.enter('#' + p.id, { at, frames: 12, ease: 'snapSettle', from: { y: 100, scale: .92, opacity: 0 } }); return p; };
    const card = (par, x, icon, name, at, col = B, y = 80) => { const c = el('div', 'card ins', `${icon ? `<img src="./assets/items/${icon}.png">` : ''}<div style="color:${col}">${name}</div>`, par, `left:${x}px;top:${y}px`); c.id = nid('c'); pop(c.id, at); return c.id; };
    const img = (par, icon, style) => { const e = el('img', null, null, par, 'position:absolute;image-rendering:pixelated;' + style); e.src = `./assets/items/${icon}.png`; e.id = nid('im'); return e.id; };
    // barras "espelho" grandes (sem números): COMIDA / ÁGUA / CALMA
    const mirror = (k, name, top, at, keys, col = G) => { const b = el('div', 'mb ins', `<b style="color:${col}">${name}</b><div><i style="background:${col}"></i></div>`, H.sc(k), `top:${top}px`); b.id = nid('mb');
      pop(b.id, at, { x: -80, opacity: 0 }); if (keys) M.kf('#' + b.id + ' i', 'scaleX', keys); return b.id; };
    // RÉPLICA da janela "Informações do Animal" (B42): vals = { saude:[[at,txt],...], apar:[...], atit:[...] }
    const ROWS = [['Tipo', 'Vaca'], ['Raça', 'Angus'], ['Sexo', 'Fêmea'], ['Idade', 'Adulto'], ['Saúde', 'saude'], ['Aparência', 'apar'], ['Atitude', 'atit'], ['Zona de Criação', 'Fazenda']];
    const RY = i => 150 + i * 46;
    const awin = (k, at, top, vals, o = {}) => { const w = el('div', 'aw', `<div class="tb"><s style="left:12px">✕</s><s style="left:52px">i</s></div>
      <div class="av"><img src="./assets/items/${o.av || 'Item_Head_CowFemale_Brown'}.png" style="width:130px;height:130px"></div><div class="nm">${o.nome || 'Vaca'}</div><div class="rn">Renomear</div>`, H.sc(k), `top:${top}px;height:${o.h || 540}px`); w.id = nid('aw');
      M.enter('#' + w.id, { at, frames: 12, ease: 'snapSettle', from: { y: 120, scale: .9, opacity: 0 } });
      ROWS.forEach(([lab, v], i) => { el('div', 'r', lab, w, `top:${RY(i)}px`);
        if (!vals[v]) { el('div', 'v', v, w, `top:${RY(i)}px`); return; }
        vals[v].forEach(([t0, txt, col], j) => { const e = el('div', 'v ins', txt, w, `top:${RY(i)}px` + (col ? `;color:${col}` : '')); e.id = nid('v'); span(e.id, t0, j + 1 < vals[v].length ? vals[v][j + 1][0] : null); }); });
      return w; };
    const hl = (w, row, at, end) => { const h = el('div', 'hl', '', w, `top:${RY(row) - 10}px`); h.id = nid('hl'); span(h.id, at, end); M.kf('#' + h.id, 'opacity', [[at, 0], [at + 4, 1], [at + 14, .55, 'softInOut'], [at + 24, 1, 'softInOut']]); return h.id; };

    // 0 — gancho: animais da B42; descuidou, morreram
    tag(0, 'VERSÃO 42', Y, P(0, .08), P(0, .30), 1000);
    const h0 = row(0, [['Item_Head_CowFemale_Brown', 'VACA', P(0, .32)], ['Item_Head_Sheep_White', 'OVELHA', P(0, .41)], ['Item_Head_Chicken_Hen', 'GALINHA', P(0, .50)]], { gap: 46, off: P(0, .74) });
    row(0, [['Item_CowBrown_Dead', 'MORTA', P(0, .76)], ['Item_Chicken_HenBrown_Dead', 'MORTA', P(0, .84)]], { gap: 80 });

    // 1 — onde achar (mapa sem escala) e como levar (corda / reboque)
    const p1 = panel(1, 'ONDE ACHAR', C(1) + 2, 'left:90px;top:470px;width:900px;height:560px');
    const city = el('div', null, '', p1, 'position:absolute;left:60px;top:110px;width:330px;height:300px'); city.id = nid('cy');
    [[0, 0, 90, 80], [110, 0, 70, 120], [200, 20, 110, 70], [0, 110, 140, 70], [160, 140, 80, 90], [260, 110, 60, 130], [30, 200, 100, 80]].forEach(([x, y, w, h]) => el('div', 'mapb', '', city, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:#8d877a`));
    el('div', 'ins', 'CIDADE', p1, `position:absolute;left:60px;top:440px;width:330px;text-align:center;font:800 36px/1 var(--mono);color:${B}`);
    const farm = el('div', null, '', p1, 'position:absolute;left:520px;top:150px;width:320px;height:260px'); farm.id = nid('fm');
    [[0, 0, 150, 110, '#6d8a3a'], [170, 0, 150, 110, '#7f9a44'], [0, 130, 150, 110, '#7f9a44'], [190, 140, 110, 90, '#9a3a2a']].forEach(([x, y, w, h, c]) => el('div', 'mapb', '', farm, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c}`));
    const fl = el('div', 'ins', 'FAZENDA', p1, `position:absolute;left:520px;top:440px;width:320px;text-align:center;font:900 40px/1 var(--mono);color:${G}`); fl.id = nid('fl');
    span(fl.id, P(1, .14));
    M.kf('#' + city.id, 'opacity', [[0, 1], [P(1, .12), 1], [P(1, .20), .22, 'softInOut']]);
    M.kf('#' + farm.id, 'scale', [[0, 1], [P(1, .12), 1], [P(1, .18), 1.12, 'snapSettle'], [P(1, .24), 1, 'softInOut']]);
    tag(1, 'ZONA RURAL', G, P(1, .26), P(1, .44), 1060);
    M.hide('#' + p1.id, P(1, .44));
    // COMO LEVAR (v2): duas colunas iguais, centradas, ícones grandes e sem sobra de espaço
    const p1b = panel(1, 'COMO LEVAR', P(1, .45), 'left:110px;top:470px;width:860px;height:560px');
    el('div', null, '', p1b, 'position:absolute;left:428px;top:96px;width:4px;height:410px;background:rgba(239,229,207,.22)');
    const colL = el('div', 'ins', `<img src="./assets/items/Item_Rope.png" style="width:200px;height:200px;image-rendering:pixelated;display:block;margin:0 auto"><div style="font:900 50px/1 var(--mono);margin-top:14px">CORDA</div>`, p1b, 'position:absolute;left:0;width:430px;top:96px;text-align:center'); colL.id = nid('cl'); pop(colL.id, P(1, .50));
    const pl = el('div', 'ins', 'PERTO', p1b, `position:absolute;left:115px;width:200px;top:448px;text-align:center;font:900 40px/1 var(--mono);color:${G};border:3px solid ${G};border-radius:10px;padding:14px 0`); pl.id = nid('pl'); pop(pl.id, P(1, .58));
    const colR = el('div', 'ins', `<div style="width:200px;height:200px;margin:0 auto;display:flex;align-items:center;justify-content:center">${H.svgIcon('car', 190)}</div><div style="font:900 50px/1 var(--mono);margin-top:14px">REBOQUE</div>`, p1b, 'position:absolute;left:430px;width:430px;top:96px;text-align:center'); colR.id = nid('rb'); pop(colR.id, P(1, .70));
    const q1 = el('div', 'ins', '"Colocar Animal no Reboque"', p1b, `position:absolute;left:450px;width:390px;top:372px;text-align:center;font:700 25px/1.25 var(--mono);color:${Y}`); q1.id = nid('q'); pop(q1.id, P(1, .78));
    const pg = el('div', 'ins', 'LONGE', p1b, `position:absolute;left:545px;width:200px;top:448px;text-align:center;font:900 40px/1 var(--mono);color:${G};border:3px solid ${G};border-radius:10px;padding:14px 0`); pg.id = nid('pg'); pop(pg.id, P(1, .88));

    // 2 — base: comida, água e calma (réplica da janela do animal + espelhos)
    const w2 = awin(2, C(2) + 2, 520, { saude: [[0, 'Saudável']], apar: [[0, 'Bem Alimentado, Sem Sede']], atit: [[0, 'Calmo']] });
    hl(w2, 5, P(2, .18), P(2, .62)); hl(w2, 6, P(2, .62));
    mirror(2, 'COMIDA', 1072, P(2, .18)); mirror(2, 'ÁGUA', 1162, P(2, .40)); mirror(2, 'CALMA', 1252, P(2, .64));

    // 3 — cocho: ração OU água; dois cochos ligados à zona; sem comida/água morre
    const p3 = panel(3, 'CERCADO (VISTO DE CIMA)', C(3) + 2, 'left:90px;top:460px;width:900px;height:640px');
    el('div', null, '', p3, 'position:absolute;left:40px;top:100px;width:820px;height:420px;border:6px dashed #8a6a42;border-radius:8px;background:rgba(90,120,60,.25)');
    const zl = el('div', 'ins', 'ZONA DE CRIAÇÃO', p3, `position:absolute;left:80px;top:130px;font:800 28px/1 var(--mono);letter-spacing:2px;color:#c9bfa8`); zl.id = nid('z'); span(zl.id, P(3, .66));
    const t1 = img(p3, 'Item_FeedingTrough', 'left:150px;top:230px;width:220px;height:220px'); pop(t1, P(3, .06), { scale: 1.6, opacity: 0 });
    const c1 = el('div', 'ins', 'COCHO', p3, 'position:absolute;left:150px;top:455px;width:220px;text-align:center;font:800 30px/1 var(--mono)'); c1.id = nid('c'); span(c1.id, P(3, .06), P(3, .14));
    const f1 = img(p3, 'Item_AnimalFeed', 'left:200px;top:160px;width:120px;height:120px'); span(f1, P(3, .14)); M.kf('#' + f1, 'y', [[P(3, .14), -60], [P(3, .19), 0, 'snapSettle']]);
    const r1 = el('div', 'ins', 'RAÇÃO ✓', p3, `position:absolute;left:150px;top:455px;width:220px;text-align:center;font:800 30px/1 var(--mono);color:${G}`); r1.id = nid('c'); span(r1.id, P(3, .19));
    const bw = img(p3, 'Item_Bucket_Water', 'left:560px;top:240px;width:150px;height:150px'); span(bw, P(3, .26), P(3, .50)); M.kf('#' + bw, 'x', [[P(3, .26), 0], [P(3, .32), -330, 'softInOut']]);
    const aq = el('div', 'ins', 'E A ÁGUA?', p3, `position:absolute;left:520px;top:455px;width:300px;text-align:center;font:800 30px/1 var(--mono);color:${Y}`); aq.id = nid('aq'); span(aq.id, P(3, .26), P(3, .43));
    const tip = el('div', 'ui gt ins', `<span style="color:${RD}">✗</span> Os itens devem ser removidos do recipiente para adicionar água.`, H.sc(3), 'left:90px;top:1110px;width:900px'); tip.id = nid('tp'); span(tip.id, P(3, .34), P(3, .52)); M.kf('#' + tip.id, 'scale', [[P(3, .34), 1.15], [P(3, .34) + 8, 1, 'snapSettle']]);
    const xx = el('div', 'ins', '✗', p3, `position:absolute;left:330px;top:150px;font:900 120px/1 Inter;color:${RD}`); xx.id = nid('x'); span(xx.id, P(3, .43), P(3, .52));
    const t2 = img(p3, 'Item_FeedingTrough', 'left:560px;top:230px;width:220px;height:220px'); pop(t2, P(3, .52), { scale: 1.6, opacity: 0 });
    const w2b = img(p3, 'Item_Bucket_Water', 'left:615px;top:160px;width:110px;height:110px'); span(w2b, P(3, .56));
    const r2 = el('div', 'ins', 'ÁGUA ✓', p3, `position:absolute;left:560px;top:455px;width:220px;text-align:center;font:800 30px/1 var(--mono);color:${G}`); r2.id = nid('c'); span(r2.id, P(3, .57));
    tag(3, '2 COCHOS', G, P(3, .60), P(3, .74), 1120);
    const lk = el('div', 'ins', '"Ligado à zona" ✓', p3, `position:absolute;left:0;right:0;top:560px;text-align:center;font:800 34px/1 var(--mono);color:${Y}`); lk.id = nid('lk'); span(lk.id, P(3, .67));
    M.hide('#' + p3.id, P(3, .74));
    const w3 = awin(3, P(3, .74), 520, { saude: [[0, 'Saudável'], [P(3, .86), 'Morrendo', RD]], apar: [[0, 'Bem Alimentado, Sem Sede'], [P(3, .79), 'Morrendo de Fome, Morrendo de Sede', RD]], atit: [[0, 'Calmo']] });
    hl(w3, 5, P(3, .79), P(3, .86)); hl(w3, 4, P(3, .86));
    M.hide('#' + mirror(3, 'COMIDA E ÁGUA', 1072, P(3, .76), [[0, 1], [P(3, .79), 1], [P(3, .85), 0, 'softInOut']], RD), P(3, .91));
    H.item(3, 'Item_CowBrown_Dead', 'MORREU', P(3, .92), { left: 455, top: 1080, size: 160 });

    // 4 — calma: zumbi não ataca; barulho atrai; tiro/grito/correria estressam; estressado foge
    tag(4, 'ZUMBI NÃO ATACA', Y, P(4, .04), P(4, .22), 980);
    for (let i = 0; i < 3; i++) { const wv = el('div', 'wave', '', H.sc(4), 'left:440px;top:900px;width:200px;height:200px'); wv.id = nid('wv');
      const a = P(4, .24) + i * 8; M.kf('#' + wv.id, 'opacity', [[0, 0], [a, .9], [a + 30, 0, 'softLand'], [a + 31, 0]]); M.kf('#' + wv.id, 'scale', [[0, .3], [a, .3], [a + 30, 2.6, 'softLand']]); }
    tag(4, 'BARULHO ATRAI ZUMBI', RD, P(4, .26), P(4, .40), 1150);
    H.moodle(4, 'pz:Mood_Stressed', 'ESTRESSE', P(4, .40), false, P(4, .84));
    mirror(4, 'CALMA', 1020, P(4, .42), [[0, 1], [P(4, .44), 1], [P(4, .54), .55, 'softInOut'], [P(4, .64), .35, 'softInOut'], [P(4, .74), .12, 'softInOut']], Y);
    H.item(4, 'Item_HandGun', 'TIRO', P(4, .54), { left: 140, top: 590, size: 180, off: P(4, .64) });
    tag(4, 'GRITO', RD, P(4, .64), P(4, .74), 880);
    tag(4, 'CORRIDA', RD, P(4, .74), P(4, .84), 880);
    H.stamp(4, 'FUGIU', P(4, .86), 860);

    // 5 — galinheiro: galinha bota sem galo; galo fecunda (pintinho); 1 galo, várias galinhas
    row(5, [['Item_Chicken_HenWhite', 'GALINHA', P(5, .06)], ['Item_Chicken_HenBrown', 'GALINHA', P(5, .12)], ['Item_Chicken_RoosterBrown', 'GALO', P(5, .18)]], { gap: 40, off: P(5, .30), top: 800 });
    row(5, [['Item_FeedingTrough', 'RAÇÃO', P(5, .22)], ['Item_FeedingTrough', 'ÁGUA', P(5, .26)]], { gap: 80, off: P(5, .30), top: 1040, size: 150 });
    H.item(5, 'Item_Egg', 'OVO', P(5, .33), { left: 445, top: 820, size: 190, off: P(5, .52) });
    tag(5, 'SEM GALO ✓', G, P(5, .40), P(5, .52), 1110);
    const p5 = panel(5, 'SÓ OVO FECUNDADO CHOCA', P(5, .52), 'left:40px;top:560px;width:1000px;height:420px');
    card(p5, 30, 'Item_Chicken_RoosterBrown', 'GALO', P(5, .55)); card(p5, 350, 'Item_Egg', 'FECUNDADO', P(5, .61)); card(p5, 670, 'Item_Chicken_Chick', 'PINTINHO', P(5, .68), G);
    M.hide('#' + p5.id, P(5, .78));
    const p5b = panel(5, null, P(5, .78), 'left:90px;top:560px;width:900px;height:380px');
    img(p5b, 'Item_Chicken_RoosterBrown', 'left:370px;top:30px;width:160px;height:160px');
    ['Item_Chicken_HenWhite', 'Item_Chicken_HenBrown', 'Item_Chicken_HenWhite', 'Item_Chicken_HenBrown'].forEach((h, i) => { const e = img(p5b, h, `left:${70 + i * 200}px;top:220px;width:120px;height:120px`); pop(e, P(5, .80) + i * 4, { scale: 1.8, opacity: 0 }); });
    tag(5, '1 GALO = VÁRIAS', G, P(5, .86), null, 1010);

    // 6 — leite (macho + fêmea → prenha → alguns dias → ordenhar; sem macho não; sem ordenha seca) e lã
    const p6 = panel(6, 'LEITE', C(6) + 2, 'left:40px;top:470px;width:1000px;height:560px');
    card(p6, 20, 'Item_Head_CowMale_Brown', 'MACHO', P(6, .05)); card(p6, 340, 'Item_Head_CowFemale_Brown', 'FÊMEA', P(6, .10));
    const pr = el('div', 'ins', 'PRENHA', p6, `position:absolute;left:680px;top:170px;width:290px;text-align:center;font:900 46px/1 var(--mono);color:${Y}`); pr.id = nid('pr'); pop(pr.id, P(6, .17));
    const ad = el('div', 'ins', '→ alguns dias →', p6, `position:absolute;left:0;right:0;top:440px;text-align:center;font:800 40px/1 var(--mono);color:#c9bfa8`); ad.id = nid('ad'); pop(ad.id, P(6, .24));
    M.hide('#' + p6.id, P(6, .32));
    H.item(6, 'Item_Bucket_Milk', 'LEITE ✓', P(6, .32), { left: 430, top: 720, size: 220, off: P(6, .64) });
    tag(6, '"ORDENHAR"', G, P(6, .37), P(6, .46), 1060);
    H.item(6, 'Item_Head_CowFemale_Brown', 'SEM MACHO', P(6, .46), { left: 90, top: 740, size: 190, off: P(6, .55) });
    M.hide('#' + H.cross(6, P(6, .49), 640, 760), P(6, .55));
    tag(6, 'NÃO ORDENHOU = SECA', RD, P(6, .56), P(6, .64), 1060);
    const p6b = panel(6, 'LÃ', P(6, .66), 'left:40px;top:500px;width:1000px;height:470px');
    card(p6b, 20, 'Item_Head_Sheep_White', 'OVELHA', P(6, .68)); card(p6b, 350, 'Item_SheepShears', 'TESOURA DE<br><br>TOSQUIA', P(6, .74)); card(p6b, 680, 'Item_WoolRaw', 'LÃ ✓', P(6, .84), G);
    tag(6, '"TOSQUIAR"', G, P(6, .80), null, 1010);

    // 7 — acariciar acalma (sem print do menu de contexto: chip com o nome do jogo)
    tag(7, '"ACARICIAR"', Y, C(7) + 4, null, 900);
    mirror(7, 'CALMA', 1040, P(7, .30), [[0, .2], [P(7, .40), .2], [P(7, .80), 1, 'softInOut']]);

    // 8 — fechamento: os produtos e CTA
    row(8, [['Item_Egg', 'OVO ✓', C(8) + 6], ['Item_Bucket_Milk', 'LEITE ✓', C(8) + 14], ['Item_WoolRaw', 'LÃ ✓', C(8) + 22]], { size: 170, gap: 70, top: 860 });
    tag(8, 'SALVA E COMENTA', G, P(8, .55), null, 1120);
  }
};
