// EP 12 — Agricultura e pesca (B42): 5 regras da horta + o minigame da vara.
const LAB = n => `PROJECT ZOMBOID · HORTA <b>0${n}</b>/05`;
window.EP = {
  pz: true,
  itens: ['Item_TZ_SeedpackTomatoes', 'Item_Cabbage', 'Item_Kale', 'Item_Garlic', 'Item_WateringCan', 'Item_Fertilizer', 'Item_Compost', 'Item_Mildew', 'Item_TZ_GardeningSprayCan', 'Item_Milk',
    'Item_Tomato', 'Item_TomatoRotten', 'Item_FishingRod', 'Item_FishHook', 'Item_Worm', 'Item_FishingRodBreak', 'Item_Fish_BassLargemouth', 'Item_TinCanEmpty'],
  OFF: 1.3,
  T: [0.00, 2.00, 5.40, 6.91, 8.86, 11.55, 16.28, 17.95, 20.94, 22.75, 26.70, 28.17, 29.93, 33.60, 35.06, 37.11, 39.57, 41.12, 43.23, 46.91, 48.90, 51.11, 55.51, 57.71, 59.71], END: 61.00,
  scenes: [{ at: 0 }, { at: 2, lab: LAB(1) }, { at: 6, lab: LAB(2) }, { at: 9, lab: LAB(3) }, { at: 12, lab: LAB(4) }, { at: 14, lab: LAB(5) },
    { at: 16, lab: 'PROJECT ZOMBOID · <b>PESCA</b>' }, { at: 18, lab: 'PROJECT ZOMBOID · <b>PESCA</b>' }, { at: 21, lab: 'PROJECT ZOMBOID · <b>PESCA</b>' }, { at: 23 }],
  titles: [
    { i: 0, a: 'Sua horta', b: 'vai morrer', size: 140 },
    { i: 1, a: 'A culpa não é', b: 'dos zumbis', col: 'bone', aSize: 96, size: 124 },
    { i: 2, a: 'Um:', b: 'respeite o mês', size: 116 },
    { i: 3, a: 'Cada semente', b: 'tem sua época', col: 'green', aSize: 96, size: 112 },
    { i: 4, a: 'Fora da época?', b: 'nasce condenada', aSize: 92, size: 104 },
    { i: 5, a: 'Inverno: só', b: 'as resistentes', col: 'green', aSize: 96, size: 108 },
    { i: 6, a: 'Dois: água', b: 'nunca no zero', aSize: 100, size: 112 },
    { i: 7, a: 'Brotou e secou?', b: 'morreu na hora', aSize: 88, size: 104 },
    { i: 8, a: 'A chuva', b: 'rega por você', col: 'green', size: 112 },
    { i: 9, a: 'Três: um fertilizante', b: 'por estágio', aSize: 80, size: 120 },
    { i: 10, a: 'Dois?', b: 'machuca a planta', size: 104 },
    { i: 11, a: 'Composto:', b: 'pode à vontade', col: 'green', size: 108 },
    { i: 12, a: 'Quatro: míldio', b: 'mata sozinho', aSize: 96, size: 116 },
    { i: 13, a: 'Spray de leite', b: 'resolve', col: 'green', aSize: 96, size: 140 },
    { i: 14, a: 'Cinco:', b: 'colha na hora', size: 120 },
    { i: 15, a: 'Tomate esquecido', b: 'apodrece', aSize: 88, size: 140 },
    { i: 16, a: 'Agora,', b: 'a pesca', col: 'green', size: 150 },
    { i: 17, a: 'Sem isca:', b: 'só lixo', size: 150 },
    { i: 18, a: 'Mordeu? Puxe', b: 'fora do vermelho', aSize: 96, size: 100 },
    { i: 19, a: 'Linha frouxa:', b: 'o peixe foge', aSize: 96, size: 112 },
    { i: 20, a: 'Vermelho demais:', b: 'linha arrebenta', aSize: 88, size: 104 },
    { i: 21, a: 'Madrugada ou', b: 'fim da tarde', col: 'green', aSize: 96, size: 116 },
    { i: 22, a: 'Barulho espanta', b: 'por horas', aSize: 92, size: 132 },
    { i: 23, a: 'Comida que cresce', b: 'não acaba', col: 'green', aSize: 84, size: 132 },
    { i: 24, a: 'Lata', b: 'acaba', size: 160 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const tag = (k, txt, col, at, end, top = 1480) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 50px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const it = (k, n, t, at, left, end, o = {}) => { const id = H.item(k, n, t, at, Object.assign({ left, top: 1300, size: 180 }, o)); if (end != null) M.hide('#' + id, end); return id; };
    const G = '#8fe04a', RD = '#ff3d55', Y = '#ffb020', B = '#efe5cf';
    // 0 — horta secando
    H.bar(0, 'SAÚDE DA HORTA', [[0, .9], [C(0) + 10, .9], [C(1), .15, 'softInOut']], { color: G, colorKeys: [[C(0) + 10, G], [C(0) + 40, Y], [C(1), RD]], text: '' });
    // 1 — mês certo / fora da época / inverno
    it(1, 'Item_TZ_SeedpackTomatoes', 'TOMATE', C(3) + 6, 450, F[4]);
    tag(1, 'MÊS CERTO ✓', G, C(3) + 16, F[4], 1560);
    M.hide('#' + H.stamp(1, 'CONDENADA', F[4] + 40, 1430), C(5));
    tag(1, '❄ INVERNO', '#bfe4ff', C(5) + 4, null, 1250);
    H.items(1, [['Item_Cabbage', 'REPOLHO', C(5) + 30], ['Item_Kale', 'COUVE', C(5) + 46], ['Item_Garlic', 'ALHO', C(5) + 62]], { top: 1360, size: 170 });
    // 2 — água
    it(2, 'Item_WateringCan', 'REGADOR', C(6) + 8, 450, C(7));
    H.bar(2, 'ÁGUA', [[0, .8], [C(6) + 40, .8], [F[7] + 40, 0, 'softIn'], [C(8) + 6, 0], [C(8) + 50, 1, 'softInOut']], { color: '#6fb6e6', colorKeys: [[C(7), '#6fb6e6'], [F[7] + 30, RD], [C(8) + 10, '#6fb6e6']], text: '' });
    M.hide('#' + H.stamp(2, 'MORREU', F[7] + 46, 1430), C(8));
    tag(2, 'CHUVA REGA ✓', G, C(8) + 20, null);
    // 3 — fertilizante
    it(3, 'Item_Fertilizer', '1X ✓', F[9] + 40, 150);
    it(3, 'Item_Fertilizer', '2X ✗', C(10) + 6, 450, null);
    it(3, 'Item_Compost', 'COMPOSTO', C(11) + 6, 750);
    H.bar(3, 'VIDA DA PLANTA', [[0, .8], [F[9] + 40, .8], [F[9] + 52, 1], [C(10) + 14, 1], [C(10) + 26, .75]], { color: G, colorKeys: [[C(10) + 14, G], [C(10) + 26, Y], [C(11) + 10, Y], [C(11) + 24, G]], text: '' });
    // 4 — míldio / spray de leite
    M.hide('#' + it(4, 'Item_Mildew', 'MÍLDIO', C(12) + 30, 150), F[12] + 58);
    M.hide('#' + H.stamp(4, 'MATA SOZINHO', F[12] + 60, 1430), C(13));
    H.items(4, [['Item_TZ_GardeningSprayCan', 'SPRAY', C(13) + 4], ['Item_Milk', 'LEITE', C(13) + 12]], { top: 1300, size: 180, left: 450 });
    tag(4, 'CURADO ✓', G, C(13) + 30, null, 1560);
    // 5 — colher na hora
    it(5, 'Item_Tomato', 'COLHIDO ✓', C(14) + 30, 300, C(15));
    it(5, 'Item_TomatoRotten', '~1 SEMANA', C(15) + 30, 450);
    M.hide('#' + H.stamp(5, 'PODRE', F[15] + 40, 1560), null);
    // 6 — isca
    it(6, 'Item_FishingRod', 'VARA', C(16) + 6, 450, C(17));
    it(6, 'Item_FishHook', 'SEM ISCA', C(17) + 6, 250);
    H.cross(6, C(17) + 20, 250, 1290);
    it(6, 'Item_Worm', 'MINHOCA', F[17] + 30, 650);
    tag(6, 'ISCA ✓', G, F[17] + 40, null, 1560);
    // 7 — minigame de tensão: zona vermelha no fim da barra
    const sec = H.sc(7); H.el('div', null, '', sec, 'position:absolute;left:760px;top:1654px;width:160px;height:56px;background:rgba(255,61,85,.35);border-left:4px solid #ff3d55;z-index:3');
    H.bar(7, 'TENSÃO DA LINHA', [[0, 0], [C(18) + 20, 0], [C(18) + 40, .55], [C(18) + 70, .62], [C(18) + 90, .5], [C(19) + 4, .5], [C(19) + 20, .05], [C(20), .05], [C(20) + 16, .95], [F[20] + 30, 1]],
      { color: G, colorKeys: [[C(19) + 4, G], [C(19) + 18, Y], [C(20) + 4, Y], [C(20) + 14, RD]], text: '' });
    tag(7, 'SEGURE O CLIQUE = PUXA', B, C(18) + 10, C(19), 1480);
    tag(7, 'FROUXA: FUGIU', Y, C(19) + 24, C(20), 1480);
    it(7, 'Item_FishingRodBreak', 'ARREBENTOU', F[20] + 34, 450, null, { top: 1150 });
    // 8 — horário / barulho
    tag(8, '04h–07h · 18h–21h', B, C(21) + 6, F[21] + 100, 1250);
    it(8, 'Item_Fish_BassLargemouth', 'PEGOU ✓', F[21] + 104, 450, C(22));
    M.hide('#' + H.stamp(8, 'PEIXE SUMIU', C(22) + 24, 1430), null);
    // 9 — horta x lata
    it(9, 'Item_TinCanEmpty', 'LATA VAZIA', C(24) + 4, 450);
  }
};
