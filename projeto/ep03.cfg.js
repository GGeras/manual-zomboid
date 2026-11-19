// EP 03 — Barulho: o que atrai a horda (roteiro corrigido)
const LAB = n => `PROJECT ZOMBOID · BARULHO <b>0${n}</b>/05`;
window.EP = {
  OFF: 1.3,
  T: [0.00, 2.57, 5.47, 6.92, 9.19, 12.26, 13.58, 15.16, 19.55, 20.76, 23.64, 25.12, 27.35, 29.24, 31.01, 33.37, 36.57, 38.80, 43.50, 44.62], END: 46.25,
  scenes: [{ at: 0 }, { at: 1, red: true }, { at: 2, lab: LAB(1) }, { at: 5, lab: LAB(2) }, { at: 8, lab: LAB(3) }, { at: 10, lab: LAB(4) }, { at: 13, lab: LAB(5) }, { at: 16, lab: LAB(5) }, { at: 17, lab: LAB(5) }, { at: 18 }],
  titles: [
    { i: 0, a: 'Esse som', b: 'chama a horda' },
    { i: 2, a: 'Um:', b: 'tiro' }, { i: 3, a: 'Ouvido de', b: 'muito longe' }, { i: 4, a: 'Arma de fogo', b: 'só em emergência', col: 'green', size: 100 },
    { i: 5, a: 'Dois:', b: 'alarme de casa', size: 108 }, { i: 6, a: 'Algumas casas', b: 'têm alarme', col: 'bone' }, { i: 7, a: 'Arrombou?', b: 'a sirene toca' },
    { i: 8, a: 'Três:', b: 'alarme de carro', size: 104 }, { i: 9, a: 'Quebrar o vidro', b: 'pode disparar' },
    { i: 10, a: 'Quatro:', b: 'gerador' }, { i: 11, a: 'Barulho', b: 'sem parar' }, { i: 12, a: 'Longe de onde', b: 'você dorme', col: 'green' },
    { i: 13, a: 'Cinco:', b: 'helicóptero', size: 116 }, { i: 14, a: 'Aparece entre', b: 'dia 6 e dia 9', col: 'bone', size: 112 }, { i: 15, a: 'Te viu na rua?', b: 'ele te segue' },
    { i: 16, a: 'Fique em casa', b: 'antes dele chegar', col: 'green', size: 96 },
    { i: 17, a: 'Já te viu?', b: 'fuja da base', col: 'green' },
    { i: 18, a: 'Segue', b: 'o canal' }, { i: 19, a: 'Silêncio é', b: 'sobrevivência', col: 'green', size: 100 }
  ],
  extras(H) {
    const { F, C, M } = H;
    H.words(1, 'E você provavelmente', C(1), 'top:470px;font-size:80px;color:var(--blk)');
    H.words(1, 'já fez isso', C(1) + 22, 'top:570px;font-size:104px;color:var(--blk)');
    H.big(1, '?', F[1] + 40, 'top:760px;font-size:560px;color:var(--bone)');
    H.moodle(2, 'sound', 'BARULHO', C(2) + 14);
    H.stamp(2, 'EMERGÊNCIA', C(4) + 10, 1430, true);
    H.moodle(3, 'siren', 'ALARME', C(7) + 4);
    H.moodle(4, 'car', 'ALARME', C(9) + 14);
    H.moodle(5, 'gen', 'CONSTANTE', C(10) + 16);
    H.chip(5, 'BASE ⟷ GERADOR: LONGE ✓', C(12) + 8, 'left:230px;top:1490px;color:var(--green)');
    H.moodle(6, 'heli', 'SÓ SE OUVE', C(13) + 14);
    H.chip(6, 'EVENTO: DIA 6 – 9 · DE DIA', C(14) + 6, 'left:230px;top:1490px;color:var(--bone)');
    M.hide('#' + H.chip(6, 'TE SEGUINDO', C(15) + 30, 'left:400px;top:1560px;color:var(--red2)'), 1e6);
    H.check(7, C(16) + 24);
    H.chip(8, 'LONGE DA BASE ✓', Math.round(C(17) + 30), 'left:330px;top:1490px;color:var(--green)');
    H.follow(9, C(18) + 4);
    H.moodle(9, 'sneak', 'FURTIVO', C(19) + 6);
  }
};
