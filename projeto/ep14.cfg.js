// EP 14 — Cozinhar (B42.22) — formato v4 (método do EP13: tela simulada + 3D)
// Fatos conferidos nos arquivos do jogo: evolvedrecipes.txt (Stew MaxItems 6, água), food.txt (Steak DangerousUncooked),
// Sandbox/Apocalypse.lua (luz cai em semanas), PTBR: Mal-estar, Culinária, Panela de Ensopado, tooltip da água contaminada.
const LAB = 'PROJECT ZOMBOID · <b>COZINHA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['Item_CannedPotato', 'Item_Steak', 'Item_Carrots', 'Item_Generator', 'Item_Campfirestones', 'Item_Firewood_Log', 'Item_PropaneTank', 'Item_SteakCooked',
    'Item_Pot_Water', 'Item_Potato', 'Item_Onion', 'Item_PotFull', 'Item_MeatPattyBurnt', 'Item_SteakRotten', 'Item_PotatoRotten', 'Item_Bucket_Water'],
  OFF: 1.3,
  T: [0.0, 3.92, 12.56, 17.3, 24.42, 34.45, 42.03, 51.21, 59.82], END: 62.53,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: 'Achou comida?', b: 'não estraga', col: 'green', aSize: 96, size: 124 },
    { i: 1, a: 'Fogão elétrico', b: 'precisa de luz', aSize: 92, size: 108 },
    { i: 2, a: 'Sem luz?', b: 'fogo de verdade', col: 'green', aSize: 100, size: 108 },
    { i: 3, a: 'Carne crua:', b: 'cozinha antes', aSize: 100, size: 112 },
    { i: 4, a: 'Ensopado:', b: 'até 6 itens', col: 'green', aSize: 100, size: 128 },
    { i: 5, a: 'Queimou?', b: 'não serve', size: 136 },
    { i: 6, a: 'Podre só com', b: 'Culinária 7', aSize: 96, size: 116 },
    { i: 7, a: 'Água suja:', b: 'ferve antes', aSize: 100, size: 120 },
    { i: 8, a: 'Cozinhar bem', b: 'é viver mais', col: 'green', aSize: 100, size: 116 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1290, size: 190, gap: 22 }, o));
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

    // 0 — gancho
    row(0, [['Item_CannedPotato', 'LATA', P(0, .20)], ['Item_Steak', 'CARNE', P(0, .30)], ['Item_Carrots', 'CENOURA', P(0, .40)]], { gap: 50 });
    // 1 — energia: fogão e micro-ondas precisam de luz; rede cai em semanas
    const p1 = panel(1, 'PRECISA DE ENERGIA', C(1) + 2, 'left:90px;top:620px;width:900px;height:700px');
    card(p1, 70, null, 'FOGÃO<br><br>ELÉTRICO', P(1, .14)); card(p1, 520, null, 'MICRO-<br><br>ONDAS', P(1, .22));
    const lb = el('div', null, 'REDE ELÉTRICA', p1, 'position:absolute;left:70px;top:470px;font:800 30px/1 var(--mono);letter-spacing:3px;color:#c9bfa8');
    const br = el('div', 'bar', '<i style="background:#ffd23a"></i>', p1, 'left:70px;top:520px;width:760px'); br.id = nid('b');
    M.kf('#' + br.id + ' i', 'scaleX', [[0, 1], [P(1, .55), 1], [P(1, .82), 0, 'softInOut']]);
    tag(1, 'A REDE CAI EM SEMANAS', Y, P(1, .45), P(1, .82), 1400);
    tag(1, 'SEM ENERGIA ✗', RD, P(1, .84), C(2), 1400);
    // 2 — fogo de verdade
    const p2 = panel(2, 'FOGO DE VERDADE', C(2) + 2, 'left:40px;top:640px;width:1000px;height:520px');
    card(p2, 30, 'Item_Campfirestones', 'FOGUEIRA', P(2, .35)); card(p2, 350, 'Item_Firewood_Log', 'LAREIRA', P(2, .55)); card(p2, 670, 'Item_PropaneTank', 'CHURRASQ.', P(2, .72));
    tag(2, 'SEM LUZ ✓', G, P(2, .86), null, 1300);
    // 3 — carne crua → mal-estar
    row(3, [['Item_Steak', 'CRUA', C(3) + 8]], { size: 240, top: 820, left: 420 });
    H.moodle(3, 'pz:Mood_Ill', 'MAL-ESTAR', P(3, .45));
    row(3, [['Item_SteakCooked', 'COZIDA ✓', P(3, .72)]], { size: 220, top: 1250, left: 430 });
    // 4 — ensopado: panela com água + até 6 ingredientes
    const p4 = panel(4, 'PANELA DE ENSOPADO', C(4) + 2, 'left:90px;top:620px;width:900px;height:640px');
    const pot = el('img', null, null, p4, 'position:absolute;left:330px;top:90px;width:220px;height:220px'); pot.src = './assets/items/Item_Pot_Water.png'; pot.style.imageRendering = 'pixelated';
    const ING = ['Item_Steak', 'Item_Potato', 'Item_Onion', 'Item_Carrots'], times = [P(4, .30), P(4, .37), P(4, .44), P(4, .51)];
    for (let i = 0; i < 6; i++) { const s = el('div', 'slot', '', p4, `left:${45 + i * 140}px;top:350px`);
      if (i < 4) { const im = el('img', null, null, s); im.src = `./assets/items/${ING[i]}.png`; im.id = nid('i'); M.hide('#' + im.id, 0); M.show('#' + im.id, times[i]); M.kf('#' + im.id, 'scale', [[times[i], 1.6], [times[i] + 8, 1, 'snapSettle']]); } }
    [0, 1, 2, 3, 4].forEach(k => { const e = el('div', 'ins', `INGREDIENTES ${k}/6`, p4, `position:absolute;left:0;right:0;top:520px;text-align:center;font:900 46px/1 var(--mono);color:${k ? G : B}`); e.id = nid('n');
      const at = k ? times[k - 1] : C(4) + 4; M.show('#' + e.id, at); if (k < 4) M.hide('#' + e.id, times[k]); });
    tag(4, 'PANELA + ÁGUA', B, P(4, .12), P(4, .28), 1300);
    tag(4, 'LEVA AO FOGO', Y, P(4, .62), P(4, .78), 1300);
    row(4, [['Item_PotFull', 'UM PRATO SÓ', P(4, .80)]], { size: 200, top: 1300, left: 430 });
    // 5 — queimou: barra de cozimento cru → pronto → queimado
    const p5 = panel(5, 'COZINHANDO', C(5) + 2, 'left:90px;top:660px;width:900px;height:420px');
    el('div', 'bar', '', p5, 'left:60px;top:150px;width:780px;height:60px;background:linear-gradient(90deg,#6a6a6a 0 45%,#8fe04a 45% 70%,#1a1412 70% 100%)');
    ['CRU', 'PRONTO', 'QUEIMADO'].forEach((t, i) => el('div', null, t, p5, `position:absolute;top:240px;left:${[70, 400, 640][i]}px;font:800 30px/1 var(--mono);color:${[B, G, RD][i]}`));
    const pt = el('div', null, '', p5, 'position:absolute;top:120px;left:60px;width:10px;height:120px;background:#fff;border-radius:4px;box-shadow:0 0 12px #fff'); pt.id = nid('pt');
    M.kf('#' + pt.id, 'x', [[0, 0], [C(5) + 6, 0], [P(5, .25), 640, 'softInOut'], [P(5, .62), 640], [P(5, .66), 0], [P(5, .82), 440, 'softInOut']]);
    tag(5, 'QUEIMOU ✗', RD, P(5, .22), P(5, .62), 1180);
    H.item(5, 'Item_MeatPattyBurnt', 'NÃO SERVE ✗', P(5, .36), { left: 440, top: 1320, size: 180, off: P(5, .62) });
    tag(5, 'ESPERE O VERDE', G, P(5, .66), P(5, .82), 1300);
    tag(5, 'PRONTO? TIRA DO FOGO ✓', G, P(5, .84), null, 1300);
    // 6 — podre: Culinária 7
    const p6 = panel(6, 'HABILIDADES', C(6) + 2, 'left:60px;top:680px;width:960px;height:360px');
    el('div', null, 'CULINÁRIA', p6, 'position:absolute;left:40px;top:110px;font:900 44px/1 var(--mono)');
    for (let i = 0; i < 10; i++) { const q = el('div', 'sq ins', '', p6, `left:${40 + i * 86}px;top:190px`); q.id = nid('q'); const at = P(6, .25 + i * .045);
      if (i < 7) M.kf('#' + q.id, 'backgroundColor', [[0, 'rgba(255,255,255,.08)'], [at, 'rgba(255,255,255,.08)'], [at + 1, i === 6 ? '#ffb020' : '#8fe04a']]); }
    row(6, [['Item_SteakRotten', 'PODRE', C(6) + 8], ['Item_PotatoRotten', 'PODRE', C(6) + 16]], { size: 170, top: 1110, gap: 60 });
    tag(6, 'NÍVEL 7', Y, P(6, .42), P(6, .78), 1400);
    tag(6, 'RENDE POUCO', Y, P(6, .80), null, 1400);
    // 7 — água contaminada: texto do próprio jogo
    const p7 = panel(7, 'ÁGUA (CONTAMINADA)', C(7) + 2, 'left:90px;top:660px;width:900px;height:420px');
    el('div', 'tip', '<span style="color:#ff3d55">Imprópria para consumo.</span><br>Esterilize em um forno<br>ou sobre o fogo.', p7);
    row(7, [['Item_Bucket_Water', 'RIO / LAGO', C(7) + 8], ['Item_Pot_Water', 'FERVER', P(7, .55)]], { size: 160, top: 1150, gap: 80 });
    tag(7, 'FORNO OU FOGO', Y, P(7, .35), P(7, .62), 1430);
    tag(7, 'AVISO SUMIU = PODE BEBER', G, P(7, .82), null, 1430);
    // 8 — fechamento
    row(8, [['Item_Campfirestones', 'FOGO', C(8) + 6], ['Item_PotFull', 'PANELA', C(8) + 14], ['Item_SteakCooked', 'NA HORA', C(8) + 22]], { size: 160, gap: 90 });
    tag(8, 'SALVA E COMENTA', G, P(8, .60), null, 1560);
  }
};
