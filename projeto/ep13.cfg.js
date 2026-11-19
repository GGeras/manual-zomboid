// EP 13 — Traços e profissões (B42.22) — FORMATO v4 (piloto): base → exemplo → armadilhas, com tela de criação simulada
const LAB = 'PROJECT ZOMBOID · <b>CRIAÇÃO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ['profession_lumberjack', 'profession_veteran2', 'trait_athletic', 'trait_smoker', 'trait_deaf', 'Item_Axe'],
  OFF: 1.3,
  T: [0.0, 5.35, 9.07, 11.04, 18.03, 23.33, 28.67, 35.55, 40.54, 44.22, 47.63, 53.17, 55.99], END: 59.36,
  // cena 1 = tela de criação simulada (frases 1 a 8); valores = arquivos do jogo (character_professions/traits.txt, B42.22)
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 10 }, { at: 11, lab: LAB }, { at: 12 }],
  titles: [
    { i: 0, a: 'Perde o jogo', b: 'antes de jogar', aSize: 96, size: 112 },
    { i: 1, a: 'Conta de pontos', b: 'começa no zero', col: 'green', aSize: 88, size: 104 },
    { i: 2, a: 'A profissão', b: 'mexe no saldo', aSize: 96, size: 112 },
    { i: 3, a: 'Desempregado', b: '+8 livres', col: 'green', aSize: 92, size: 140 },
    { i: 4, a: 'Veterano', b: 'tira 8', aSize: 100, size: 150 },
    { i: 5, a: 'Lenhador', b: 'fica no zero', aSize: 100, size: 120 },
    { i: 6, a: 'Bônus também', b: 'acelera a XP', col: 'green', aSize: 96, size: 112 },
    { i: 7, a: 'Traço bom', b: 'gasta ponto', aSize: 100, size: 124 },
    { i: 8, a: 'Traço ruim', b: 'devolve ponto', col: 'green', aSize: 100, size: 112 },
    { i: 9, a: 'O bom se paga', b: 'com o ruim', aSize: 92, size: 120 },
    { i: 10, a: 'Ponto fácil', b: 'cobra caro', aSize: 100, size: 128 },
    { i: 11, a: 'Ruim que não', b: 'te atrapalha', col: 'green', aSize: 96, size: 116 },
    { i: 12, a: 'Segue', b: 'o canal' }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    // tempo dentro da frase i (0..1) — escala junto quando a voz final mudar o tamanho da frase
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    const tag = (k, txt, col, at, end, top = 1560) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 1290, size: 200, gap: 22 }, o));
    let n = 0; const id = p => 'cc' + p + (n++);

    // ---------- estilo da tela de criação simulada ----------
    el('style', null, `
      .cc{position:absolute;left:40px;top:560px;width:1000px;height:900px;background:rgba(16,14,13,.94);border:3px solid rgba(239,229,207,.45);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7);overflow:hidden}
      .cc .hd{height:74px;font:800 30px/74px var(--mono);letter-spacing:4px;padding-left:28px;color:var(--bone);background:rgba(239,229,207,.08);border-bottom:2px solid rgba(239,229,207,.25)}
      .cc .col{position:absolute;top:96px;width:466px}
      .cc .ch{font:800 26px/1 var(--mono);letter-spacing:3px;color:#c9bfa8;padding:0 0 12px 6px;border-bottom:2px solid rgba(239,229,207,.18);margin-bottom:8px}
      .cc .r{position:absolute;left:0;width:466px;height:86px;display:flex;align-items:center;gap:16px;padding:0 16px;border-radius:6px;font:700 31px/1 var(--mono);color:var(--bone)}
      .cc .r img{width:64px;height:64px;image-rendering:pixelated}
      .cc .r .v{margin-left:auto;font:900 36px/1 var(--mono)}
      .cc .ft{position:absolute;left:0;right:0;bottom:0;height:170px;border-top:2px solid rgba(239,229,207,.25);background:rgba(0,0,0,.35)}
      .cc .sl{position:absolute;left:30px;top:30px;font:800 26px/1 var(--mono);letter-spacing:3px;color:#c9bfa8}
      .cc .sv{position:absolute;left:30px;top:66px;width:300px;font:900 84px/1 var(--mono)}
      .cc .go{position:absolute;right:30px;top:34px;width:380px;height:104px;border-radius:12px;font:900 52px/104px "Inter";text-align:center;color:#0d0b0b;letter-spacing:2px}
      .cc .lk{position:absolute;right:30px;top:34px;width:380px;height:104px;border-radius:12px;background:#4a4644;color:#9a948c;font:900 46px/104px "Inter";text-align:center;letter-spacing:2px}`, document.head);

    tag(0, 'TELA DE CRIAÇÃO', B, P(0, .45), null, 1500);
    // ---------- CENA 1: frases 1–8 — RÉPLICA da tela "SELECIONE PROFISSÃO E TRAÇOS" do jogo (layout do print; textos/custos dos arquivos 42.22) ----------
    const s1 = H.sc(1);
    el('style', null, `
      .gv{position:absolute;left:0;top:545px;width:1080px;height:820px;overflow:hidden;background:#000;border-top:2px solid #333;border-bottom:2px solid #333}
      .gm{position:absolute;left:0;top:0;width:1650px;height:865px;background:#0a0a0a;transform-origin:0 0;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;color:#fff}
      .gm .gt{position:absolute;font-weight:700;font-size:15px;color:#fff}
      .gm .bx{position:absolute;border:1px solid #3c3c3c;background:rgba(18,18,18,.92);overflow:hidden}
      .gm .oc{position:absolute;left:0;right:0;height:30px;display:flex;align-items:center;gap:10px;padding-left:8px;font-size:14px;color:#e8e8e8;border-bottom:1px solid #202020}
      .gm .oc img{width:26px;height:26px;image-rendering:pixelated}
      .gm .tr{position:absolute;left:0;right:0;height:22px;display:flex;align-items:center;gap:8px;padding:0 10px 0 8px;font-size:13.5px;border-bottom:1px solid #1c1c1c}
      .gm .tr img{width:18px;height:18px;image-rendering:pixelated}
      .gm .tr .c{margin-left:auto}
      .gm .sh{position:absolute;left:8px;font-size:14px;color:#7dff6a}
      .gm .bt{position:absolute;top:836px;height:20px;border:1px solid #777;font:700 11px/20px Arial;text-align:center;color:#fff}
      .pm{position:absolute;left:0;top:1370px;width:1080px;height:84px;background:#0a0a0a;border-bottom:2px solid #333;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif}
      .pm .l{position:absolute;right:150px;top:22px;font:700 34px/40px Arial;color:#fff}
      .pm .v{position:absolute;right:40px;top:16px;width:100px;text-align:right;font:700 46px/52px Arial}`, document.head);
    const gv = el('div', 'gv', '', s1); gv.id = 'gv'; M.enter('#gv', { at: C(1) + 2, frames: 10, ease: 'snapSettle', from: { opacity: 0, scale: .96 } });
    const gm = el('div', 'gm', '', gv); gm.id = 'gm';
    const T = (txt, l, t, st = '') => el('div', 'gt', txt, gm, `left:${l}px;top:${t}px;${st}`);
    T('SELECIONE PROFISSÃO E TRAÇOS', 0, 8, 'width:1650px;text-align:center'); el('div', 'bt', 'INFO', gm, 'left:1590px;top:6px;width:48px');
    T('Profissão', 6, 32); T('Traços Disponíveis', 553, 32); T('Traços Escolhidos', 1100, 32);
    // coluna 1: profissões (Profissão Personalizada primeiro; resto em ordem alfabética)
    const OC = [['Profissão Personalizada', null], ['Alfaiate', 'profession_tailor'], ['Bombeiro', 'profession_fireofficer2'], ['Carpinteiro', 'profession_hammer2'], ['Chapista', 'profession_burgerflipper'], ['Chef', 'profession_chef2'],
      ['Eletricista', 'profession_electrician'], ['Enfermeiro', 'profession_nurse'], ['Engenheiro', 'profession_engineer'], ['Fazendeiro', 'profession_farmer2'], ['Ferreiro', 'profession_smither'], ['Guarda Florestal', 'profession_parkranger2'],
      ['Guia de Pesca', 'profession_fisher2'], ['Ladrão', 'profession_burglar2'], ['Lenhador', 'profession_lumberjack'], ['Mecânico', 'profession_mechanic'], ['Médico', 'profession_doctor2'], ['Pecuarista', 'profession_rancher'],
      ['Pedreiro', 'profession_constructionworker2'], ['Personal Trainer', 'profession_fitnessinstructor'], ['Policial', 'profession_policeofficer2'], ['Segurança', 'profession_securityguard2'], ['Soldador', 'profession_metalworker'], ['Técnico', 'profession_repairman2'], ['Veterano', 'profession_veteran2']];
    const occ = el('div', 'bx', '', gm, 'left:6px;top:52px;width:538px;height:760px');
    const OR = OC.map(([n, ic], i) => { const r = el('div', 'oc', `${ic ? `<img src="./assets/items/${ic}.png">` : '<span style="width:26px"></span>'}<span>${n}</span>`, occ, `top:${i * 30}px`); r.id = id('oc'); return r.id; });
    // coluna 2: traços disponíveis (bons em verde com custo −, ruins em vermelho com +), visão rolada como no jogo
    el('div', 'gt', 'Descrição', gm, 'left:556px;top:54px;font-size:11px;font-weight:400'); el('div', 'gt', 'Custo', gm, 'left:1060px;top:54px;font-size:11px;font-weight:400');
    const GOOD = [['Ginasta', 'trait_gymnast', 5], ['Trilheiro', 'trait_hiker', 5], ['Aprendiz Rápido', 'trait_fastlearner', 6], ['Audição Aguçada', 'trait_keenhearing', 6], ['Brigão', 'trait_brawler', 6], ['Cicatrização Rápida', 'trait_fasthealer', 6],
      ['Em Forma', 'trait_fit', 6], ['Ex-Escoteiro', 'trait_formerscout', 6], ['Forte', 'trait_stout', 6], ['Casca Grossa', 'trait_thickskinned', 8], ['Caçador', 'trait_hunter', 8], ['Habilidoso', 'trait_handy', 8], ['Atlético', 'trait_athletic', 10], ['Musculoso', 'trait_strong', 10]];
    const BAD = [['Ruim de Volante', null, 1], ['Desajeitado', 'trait_allthumbs', 2], ['Desastrado', 'trait_clumsy', 2], ['Covarde', 'trait_cowardly', 2], ['Sedento', 'trait_highthirst', 2], ['Miopia', 'trait_shortsighted', 2], ['Leitura Lenta', 'trait_slowreader', 2],
      ['Estômago Fraco', 'trait_weakstomach', 2], ['Metabolismo Lento', 'trait_weightgain', 2], ['Metabolismo Acelerado', 'trait_weightloss', 2], ['Cicatrização Lenta', 'trait_slowhealer', 3], ['Fumante', 'trait_smoker', 3], ['Agorafóbico', 'trait_agoraphobic', 4], ['Claustrofóbico', 'trait_claustrophobic', 4]];
    const gl = el('div', 'bx', '', gm, 'left:553px;top:68px;width:540px;height:356px'), bl = el('div', 'bx', '', gm, 'left:553px;top:452px;width:540px;height:356px');
    el('div', 'bt', 'Adicionar Traço >', gm, 'left:1020px;top:428px;width:72px;font-size:8px;color:#888;border-color:#444');
    const TR = (par, list, good) => list.map(([n, ic, c], i) => { const col = good ? '#6ee05a' : '#ff4a4a'; const r = el('div', 'tr', `${ic ? `<img src="./assets/items/${ic}.png">` : '<span style="width:18px"></span>'}<span style="color:${col}">${n}</span><span class="c" style="color:${col}">${good ? '-' : '+'}${c}</span>`, par, `top:${i * 25}px`); r.id = id('tr'); return r.id; });
    const GR = TR(gl, GOOD, true), BR = TR(bl, BAD, false);
    // coluna 3: traços escolhidos + habilidades principais
    el('div', 'gt', 'Descrição', gm, 'left:1103px;top:54px;font-size:11px;font-weight:400'); el('div', 'gt', 'Custo', gm, 'left:1612px;top:54px;font-size:11px;font-weight:400');
    const ch = el('div', 'bx', '', gm, 'left:1100px;top:68px;width:545px;height:356px');
    T('Habilidades Principais', 1100, 436, 'font-size:13px'); const ms = el('div', 'bx', '', gm, 'left:1100px;top:452px;width:545px;height:356px');
    const skills = (list, at, end) => list.forEach(([n, lv], i) => { const r = el('div', 'tr', `<span style="color:#6ee05a">${n}</span><span class="c" style="letter-spacing:2px;color:#6ee05a">${'█'.repeat(lv)}</span>`, ms, `top:${4 + i * 25}px`); r.id = id('ms'); M.hide('#' + r.id, 0); M.show('#' + r.id, at); if (end) M.hide('#' + r.id, end); });
    // rodapé do jogo
    el('div', 'bt', 'VOLTAR', gm, 'left:6px;width:52px;background:#a01818;border-color:#c33'); el('div', 'bt', '[--Selecione para carregar--]', gm, 'left:64px;width:160px;font-weight:400;text-align:left;padding-left:6px');
    el('div', 'bt', 'SALVAR', gm, 'left:232px;width:32px;background:#1d6b1d'); el('div', 'bt', 'REDEFINIR TRAÇOS', gm, 'left:1430px;width:80px'); el('div', 'bt', 'ALEATÓRIO', gm, 'left:1516px;width:60px'); el('div', 'bt', 'PRÓXIMO', gm, 'left:1582px;width:62px;background:#1d6b1d');
    T('Pontos Disponíveis', 1480, 815, 'font-size:13px');
    // tempos dos cliques (frame em que o saldo muda)
    const kDes = P(3, .62), kVet = P(4, .30), kLen = P(5, .25), kAtl = P(7, .62), kFum = P(8, .55);
    const SALDO = [[C(1) + 2, '0', '#ffffff'], [kDes, '8', '#6ee05a'], [kVet, '-8', '#ff4a4a'], [kLen, '0', '#ffffff'], [kAtl, '-10', '#ff4a4a'], [kFum, '-7', '#ff4a4a']];
    // valor dentro da tela do jogo + espelho grande embaixo (para ler no celular quando a câmera aproxima)
    const pm = el('div', 'pm', '<div class="l">Pontos Disponíveis</div>', s1); pm.id = 'pm'; M.enter('#pm', { at: C(1) + 6, frames: 8, ease: 'snapSettle', from: { opacity: 0 } });
    SALDO.forEach(([at, t, col], j) => { [[gm, 'position:absolute;left:1620px;top:815px;font:700 13px Arial;color:' + col], [pm, '']].forEach(([par, st], q) => {
      const e = el('div', q ? 'v ins' : '', t, par, q ? 'color:' + col : st); e.id = id('sv'); M.hide('#' + e.id, 0); M.show('#' + e.id, at);
      if (q && j) M.kf('#' + e.id, 'scale', [[at, 1.5], [at + 8, 1, 'snapSettle']]); if (j + 1 < SALDO.length) M.hide('#' + e.id, SALDO[j + 1][0]); }); });
    // seleção (cor laranja-escuro do jogo) e transferência dos traços para "Traços Escolhidos"
    const SEL = 'rgba(122,62,22,.95)', HOV = 'rgba(122,62,22,.55)', N0 = 'rgba(0,0,0,0)';
    M.kf('#' + OR[0], 'backgroundColor', [[0, N0], [kDes, N0], [kDes + 1, SEL], [kVet, SEL], [kVet + 1, N0]]);
    M.kf('#' + OR[24], 'backgroundColor', [[0, N0], [kVet, N0], [kVet + 1, SEL], [kLen, SEL], [kLen + 1, N0]]);
    M.kf('#' + OR[14], 'backgroundColor', [[0, N0], [kLen, N0], [kLen + 1, SEL]]);
    skills([['Pontaria', 2], ['Recarga', 2]], kVet + 1, kLen); skills([['Machados', 2], ['Força', 1], ['Manutenção', 1]], kLen + 1);
    const pickT = (rid, at, n, ic, c, slot) => { M.kf('#' + rid, 'backgroundColor', [[0, N0], [at - 14, N0], [at - 13, HOV], [at, HOV], [at + 1, N0]]); M.hide('#' + rid, at + 1);
      const good = c < 0, col = good ? '#6ee05a' : '#ff4a4a'; const r = el('div', 'tr', `<img src="./assets/items/${ic}.png"><span style="color:${col}">${n}</span><span class="c" style="color:${col}">${c > 0 ? '+' : ''}${c}</span>`, ch, `top:${slot * 25}px`); r.id = id('ct'); M.hide('#' + r.id, 0); M.show('#' + r.id, at + 1); };
    pickT(GR[12], kAtl, 'Atlético', 'trait_athletic', -10, 0); pickT(BR[11], kFum, 'Fumante', 'trait_smoker', 3, 1);
    // câmera dentro da tela: visão geral → coluna Profissão (linha certa) → Traços Disponíveis → Traços Escolhidos / Habilidades → visão geral
    const SO = 1080 / 1650, OV = [0, (820 - 865 * SO) / 2, SO], Z = 1.95, VH = 820;
    const at = (colX, ny) => [-(colX * Z) + 12, Math.min(0, Math.max(VH - 865 * Z, VH / 2 - ny * Z)), Z];
    const rowY = i => 52 + i * 30 + 15;
    const CAM = [[C(1), OV], [P(2, .20), OV], [P(2, .45), at(6, rowY(5))], [P(3, .40), at(6, rowY(5))], [P(4, .02), at(6, rowY(5))], [P(4, .16), at(6, rowY(20))], [P(4, .55), at(6, rowY(20))], [P(4, .66), at(1100, 520)],
      [P(5, .02), at(1100, 520)], [P(5, .12), at(6, rowY(14))], [P(5, .45), at(6, rowY(14))], [P(5, .56), at(1100, 520)], [P(7, .08), at(1100, 520)], [P(7, .20), at(553, 68 + 12 * 25)], [P(7, .70), at(553, 68 + 12 * 25)], [P(7, .80), at(1100, 160)],
      [P(8, .05), at(1100, 160)], [P(8, .16), at(553, 452 + 11 * 25)], [P(8, .62), at(553, 452 + 11 * 25)], [P(8, .72), at(1100, 160)], [P(9, .04), at(1100, 160)], [P(9, .18), OV]];
    ['x', 'y', 'scale'].forEach((p, q) => M.kf('#gm', p, CAM.map(([f, v], j) => j ? [f, v[q], 'softInOut'] : [f, v[q]])));
    // cursor do jogo (dentro da tela, acompanha o zoom)
    const cu = el('div', null, '<svg width="22" height="30" viewBox="0 0 40 55"><path d="M2 2 L2 44 L13 34 L21 52 L28 49 L20 31 L36 31 Z" fill="#fff" stroke="#000" stroke-width="3"/></svg>', gm, 'position:absolute;left:0;top:0;z-index:5'); cu.id = 'gcu';
    const ckeys = [[C(2), 300, 600, 1, 0], [kDes - 8, 160, rowY(0), 1, 0], [kVet - 8, 120, rowY(24), 1, 0], [kLen - 8, 140, rowY(14), 1, 0], [kAtl - 16, 700, 68 + 12 * 25 + 11, 1, 0], [kAtl - 6, 1050, 438, 1, 0], [kFum - 16, 700, 452 + 11 * 25 + 11, 1, 0], [kFum - 6, 1050, 438, 1, 0], [P(9, .1), 1300, 700, 1, 0]];
    M.cursor('#gcu', { keys: ckeys, ease: 'glide', hideAt: C(10) });
    [[kDes, OR[0]], [kVet, OR[24]], [kLen, OR[14]]].forEach(([f, r]) => M.press('#gcu', '#' + r, { at: f, frames: 3 }));
    // chips (um por vez, abaixo do espelho de pontos)
    tag(1, 'SALDO COMEÇA EM 0', B, P(1, .55), C(2), 1490);
    tag(1, 'MUDA O SALDO', G, P(2, .55), C(3), 1490);
    tag(1, 'PROF. PERSONALIZADA', B, P(3, .25), P(3, .78), 1490);
    tag(1, 'SEM BÔNUS', B, P(3, .80), C(4), 1490);
    tag(1, 'PONTARIA · RECARGA', G, P(4, .70), C(5), 1490);
    tag(1, 'MACHADOS · FORÇA', G, P(5, .60), C(6), 1490);
    tag(1, 'APRENDE MAIS RÁPIDO', G, P(6, .30), P(6, .62), 1490);
    tag(1, 'MAIS BÔNUS = MAIS RÁPIDO', Y, P(6, .66), C(7), 1490);
    tag(1, 'AINDA FALTAM 7', RD, P(8, .80), C(9), 1490);
    tag(1, 'BOM = PAGO COM RUIM', Y, P(9, .30), null, 1490);
    // ---------- CENA 2: frase 9 — Surdo (3D: zumbi chega pelas costas) ----------
    row(2, [['trait_deaf', 'SURDO +12', C(10) + 6]], { size: 220, top: 1190, left: 140 });
    tag(2, 'NÃO OUVE O ZUMBI', RD, P(10, .55), null, 1470);
    // ---------- CENA 3: frase 10 — escolha consciente ----------
    row(3, [['trait_smoker', 'FUMANTE', C(11) + 8], ['trait_deaf', 'SURDO', C(11) + 20]], { size: 190, gap: 240, top: 1150 });
    H.cross(3, P(11, .55), 700, 1140);
    tag(3, 'SÓ O QUE NÃO ATRAPALHA', G, P(11, .70), null, 1470);
    // ---------- CENA 4: frase 11 — fechamento ----------
    H.follow(4, C(12) + 4);
    tag(4, 'MONTE O SEU', G, P(12, .55), null, 1330);
  }
};
