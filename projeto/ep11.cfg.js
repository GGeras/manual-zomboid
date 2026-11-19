// EP 11 — Armas de fogo: 5 regras (B42, valores do arquivo de armas do jogo).
const LAB = n => `PROJECT ZOMBOID · ARMAS DE FOGO <b>0${n}</b>/05`;
window.EP = {
  pz: true,
  itens: ['Item_HandGun3', 'Item_Firearm_PumpShotgun', 'Item_PistolAmmo', 'Item_ShotgunAmmo', 'Item_BerettaClip', 'Item_BaseballBat'],
  OFF: 1.3,
  T: [0.00, 2.38, 4.31, 7.64, 9.12, 11.28, 13.23, 16.53, 17.81, 20.45, 22.20, 24.94, 27.32, 29.57, 32.00, 33.23, 35.52, 36.96, 38.30, 40.40, 41.33], END: 44.09,
  scenes: [{ at: 0 }, { at: 1 }, { at: 2 }, { at: 3, lab: LAB(1) }, { at: 6, lab: LAB(1) }, { at: 7, lab: LAB(2) }, { at: 10, lab: LAB(3) }, { at: 12, lab: LAB(4) },
    { at: 14, lab: LAB(5) }, { at: 17, lab: 'PROJECT ZOMBOID · <b>ARMA TRAVA</b>' }, { at: 19 }],
  titles: [
    { i: 0, a: 'Um tiro resolve', b: 'um zumbi', col: 'bone', aSize: 96, size: 124 },
    { i: 1, a: 'E chama', b: 'todos os outros', aSize: 100, size: 110 },
    { i: 2, a: '5 regras pra', b: 'arma de fogo', size: 116 },
    { i: 3, a: 'Um:', b: 'barulho' },
    { i: 4, a: 'Pistola:', b: '100 quadrados', size: 112 },
    { i: 5, a: 'Escopeta:', b: '200 quadrados', size: 112 },
    { i: 6, a: 'Todo zumbi', b: 'no raio vem', size: 120 },
    { i: 7, a: 'Dois:', b: 'munição certa', size: 112 },
    { i: 8, a: 'Pistola:', b: '9mm no pente', col: 'green', size: 116 },
    { i: 9, a: 'Escopeta:', b: 'cartucho', col: 'green', size: 128 },
    { i: 10, a: 'Três: encha', b: 'os pentes antes', aSize: 96, size: 104 },
    { i: 11, a: 'Escopeta: um', b: 'cartucho por vez', aSize: 96, size: 100 },
    { i: 12, a: 'Quatro: recarregue', b: 'longe deles', aSize: 84, size: 124 },
    { i: 13, a: 'Na recarga', b: 'eles te agarram', size: 108 },
    { i: 14, a: 'Cinco:', b: 'mire na cabeça', size: 112 },
    { i: 15, a: 'Pontaria', b: 'aumenta o acerto', col: 'green', aSize: 100, size: 100 },
    { i: 16, a: 'Pânico', b: 'atrapalha', size: 136 },
    { i: 17, a: 'A arma', b: 'pode travar', size: 130 },
    { i: 18, a: 'Leve uma', b: 'reserva', col: 'green', size: 140 },
    { i: 19, a: 'Segue', b: 'o canal' },
    { i: 20, a: 'Sobreviver', b: 'ao barulho...', aSize: 100, size: 120 }
  ],
  extras(H) {
    const { F, C, M } = H;
    const tag = (k, txt, col, at, end, top = 1480) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;top:${top}px;color:${col};font:800 54px/1 var(--mono);padding:18px 34px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const big = (k, txt, col, at, end, top = 1330) => { const id = H.big(k, txt, at, `top:${top}px;left:110px;right:auto;width:auto;text-align:left;font-size:150px;letter-spacing:-5px;color:${col};text-shadow:0 8px 0 rgba(0,0,0,.55),0 0 30px #000`, { scale: 1.5, blur: 10 }); if (end != null) M.hide('#' + id, end); return id; };
    // 0 — o tiro
    tag(0, '1 TIRO = 1 ZUMBI', '#8fe04a', C(0) + 36, null, 1500);
    // 1 — chama todos
    H.moodle(1, 'pz:Mood_Panicked', 'PÂNICO', C(1) + 24);
    // 2 — as duas armas do vídeo
    H.items(2, [['Item_HandGun3', 'Pistola M9', C(2) + 8], ['Item_Firearm_PumpShotgun', 'Escopeta', C(2) + 16]], { top: 1330 });
    // 3 — raio do som
    big(3, '100', '#ffb020', F[4] + 22, C(5) + 2);
    big(3, '200', '#ff3d55', F[5] + 18, null);
    tag(3, 'QUADRADOS DE SOM', '#efe5cf', F[4] + 28, null, 1520);
    // 4 — todos vêm
    tag(4, 'ELES OUVEM E VÊM', '#ff3d55', C(6) + 16, null, 1500);
    H.vig('rgba(120,0,10,.5)', [[0, 0], [C(6), 0], [C(6) + 30, .6, 'softInOut'], [C(7) - 1, .6], [C(7), 0]]);
    // 5 — munição certa
    M.hide('#' + H.item(5, 'Item_HandGun3', 'Pistola', F[8] + 4, { left: 150, top: 1320 }), C(9));
    M.hide('#' + H.item(5, 'Item_PistolAmmo', '9mm', F[8] + 18, { left: 465, top: 1320 }), C(9));
    M.hide('#' + H.item(5, 'Item_BerettaClip', 'Pente', F[8] + 34, { left: 780, top: 1320 }), C(9));
    H.item(5, 'Item_Firearm_PumpShotgun', 'Escopeta', F[9] + 4, { left: 300, top: 1320 });
    H.item(5, 'Item_ShotgunAmmo', 'Cartucho', F[9] + 16, { left: 630, top: 1320 });
    // 6 — pente cheio / um cartucho por vez
    M.hide('#' + H.item(6, 'Item_BerettaClip', 'Pente', C(10) + 8, { left: 120, top: 1300, size: 130 }), C(11));
    const L10 = F[11] - F[10];
    tag(6, 'PENTE 0/15', '#ff3d55', C(10) + 14, C(10) + Math.round(L10 * .55), 1340);
    tag(6, 'PENTE 15/15 ✓', '#8fe04a', C(10) + Math.round(L10 * .55) + 1, C(11), 1340);
    const sh = H.item(6, 'Item_ShotgunAmmo', 'Cartucho', C(11) + 6, { left: 120, top: 1300, size: 130 });
    const L11 = F[12] - F[11];
    [1, 2, 3, 4, 5].forEach(n => { const at = C(11) + 10 + Math.round((n - 1) * (L11 - 24) / 5); const id = tag(6, `${n}/5`, n === 5 ? '#8fe04a' : '#efe5cf', at, n < 5 ? at + Math.round((L11 - 24) / 5) - 1 : null, 1340); });
    // 7 — recarregue longe / na recarga te agarram
    M.hide('#' + tag(7, 'LONGE ✓', '#8fe04a', C(12) + 20, C(13)), C(13));
    H.vig('rgba(120,0,10,.6)', [[0, 0], [C(13) + 20, 0], [C(13) + 34, .7, 'softInOut'], [C(14) - 1, .7], [C(14), 0]]);
    tag(7, 'PERTO DEMAIS', '#ff3d55', C(13) + 30, null, 1500);
    // 8 — mira / pontaria / pânico
    tag(8, 'NA CABEÇA ✓', '#8fe04a', C(14) + 34, C(15));
    tag(8, '+4 ACERTO POR NÍVEL', '#8fe04a', C(15) + 10, C(16));
    H.moodle(8, 'pz:Mood_Panicked', 'PÂNICO', C(16) + 6);
    tag(8, 'ERROU A CABEÇA', '#ff3d55', C(16) + 30, null, 1500);
    // 9 — trava / reserva
    M.hide('#' + H.stamp(9, 'TRAVOU', C(17) + 18, 1430), C(18));
    H.item(9, 'Item_BaseballBat', 'Reserva', C(18) + 8, { left: 120, top: 1300, size: 130 });
    tag(9, 'CORPO A CORPO ✓', '#8fe04a', C(18) + 36, null, 1500);
    // 10 — CTA
    H.follow(10, C(19) + 4);
  }
};
