// EP 25 — Agricultura (B42.22) — RASCUNHO v1 (27/11): tempos da voz ElevenLabs (n25.mp3). Fatos: info-validada/agricultura.md.
// Meses de plantio (sowMonth): batata 2–4, tomate 4–6, repolho e cenoura 2–7; nenhuma planta tem 11 e 12. Água: tomate 70, cenoura 30 depois do 1º estágio.
const LAB = 'PROJECT ZOMBOID · <b>AGRICULTURA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Seeds_Potato", "Item_Potato", "Item_Tomato", "Item_Cabbage", "Item_Carrots", "Item_Radish", "Item_WateringCan", "Item_Seeds_Generic"],
  OFF: 1.3,
  luz: { padrao: 'exterior-dia', 7: 'chuva' },
  T: [0.0, 5.83, 9.72, 14.39, 18.75, 25.56, 30.07, 35.63, 43.38, 47.49, 53.54, 58.11], END: 63.76,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9, lab: LAB }, { at: 10, lab: LAB }, { at: 11 }],
  titles: [
    { i: 0, a: "Sua horta", b: "vai morrer", aSize: 110, size: 120 },
    { i: 1, a: "Época de", b: "Plantio", col: 'green', aSize: 110, size: 120 },
    { i: 2, a: "Fora do mês:", b: "condenada", aSize: 100, size: 120 },
    { i: 3, a: "Nov e dez:", b: "nenhuma", aSize: 110, size: 120 },
    { i: 4, a: "Cada uma", b: "no seu mês", col: 'yellow', aSize: 110, size: 112 },
    { i: 5, a: "Agora é", b: "água", col: 'green', aSize: 110, size: 128 },
    { i: 6, a: "Tomate × cenoura", b: "", aSize: 100, size: 110 },
    { i: 7, a: "Faltou", b: "água", aSize: 110, size: 128 },
    { i: 8, a: "Mato:", b: "perda em dobro", aSize: 110, size: 104 },
    { i: 9, a: "Doença", b: "se espalha", aSize: 110, size: 120 },
    { i: 10, a: "Inverno:", b: "só o resistente", aSize: 110, size: 100 },
    { i: 11, a: "Batata ou", b: "repolho?", col: 'green', aSize: 110, size: 120 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', Y = '#ffb020', B = '#efe5cf', DIM = '#4a4a40';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k25' + p + (n++);
    const tag = (k, txt, col, at, end, top = 800, fs = 36) => { const id = H.chip(k, txt, at, `left:60px;width:max-content;max-width:960px;white-space:nowrap;text-align:left;top:${top}px;color:${col};font:800 ${fs}px/1.15 var(--mono);padding:14px 24px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const MES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    el('style', null, `.cal{position:absolute;left:60px;width:960px;display:grid;grid-template-columns:120px repeat(12,1fr);gap:5px;align-items:center;background:rgba(14,14,12,.78);border:2px solid #6a6a5a;border-radius:12px;padding:14px 16px;font-family:var(--mono)}
      .cal img{width:96px;height:96px;image-rendering:pixelated}.cal b{display:block;text-align:center;font:800 20px/1 var(--mono);padding:14px 0;border-radius:6px;color:#151510}
      .cal .x{position:relative}.cal .x:after{content:'';position:absolute;left:-4px;right:-4px;top:50%;height:5px;background:${RD};transform:rotate(-24deg)}
      .barra{position:absolute;left:60px;width:960px;background:rgba(14,14,12,.78);border:2px solid #6a6a5a;border-radius:12px;padding:16px 22px;font:800 30px/1.2 var(--mono);color:${B};display:grid;grid-template-columns:110px 1fr;gap:18px;align-items:center}
      .barra img{width:96px;height:96px;image-rendering:pixelated}.barra .tr{height:34px;background:#2a2a24;border-radius:6px;overflow:hidden}.barra .tr i{display:block;height:100%;transform-origin:left}`, document.head);
    // calendário (faixa de 12 meses). on = meses de plantio; cores: verde = plantio, vermelho = mês aceso como errado, cinza = fora
    const cal = (k, ic, on, at, end, top, o = {}) => { const e = el('div', 'cal', (ic ? `<img src="assets/items/${ic}.png">` : '<span></span>') + MES.map((m, i) => {
        const bg = on.includes(i + 1) ? G : (o.err === i + 1 ? RD : DIM), cl = o.risca && o.risca.includes(i + 1) ? 'x' : ''; return `<b class="${cl}" style="background:${bg};color:${bg === DIM ? '#9a9a88' : '#151510'}">${m}</b>`; }).join(''), H.sc(k), `top:${top}px`);
      e.id = nid('cal'); M.enter('#' + e.id, { at, frames: 9, ease: 'snapSettle', from: { x: -60, opacity: 0 } }); if (end != null) M.hide('#' + e.id, end); return e.id; };
    // barra simples sem escala (regra 1: sem número validado na tela = barra sem número)
    const barra = (k, ic, nome, keys, col, at, end, top) => { const id = nid('bi'); const e = el('div', 'barra', `<img src="assets/items/${ic}.png"><div>${nome}<div class="tr"><i id="${id}" style="background:${col};width:100%"></i></div></div>`, H.sc(k), `top:${top}px`);
      e.id = nid('br'); M.enter('#' + e.id, { at, frames: 9, ease: 'snapSettle', from: { y: 30, opacity: 0 } }); M.kf('#' + id, 'scaleX', keys); if (end != null) M.hide('#' + e.id, end); return id; };
    const ALL = [2, 3, 4, 5, 6, 7, 8, 9, 10];   // meses que aparecem em alguma planta
    // 0 — gancho
    tag(0, "PLANTA MORRENDO", RD, P(0, 0.15), P(0, 0.55), 1250, 36);
    cal(0, null, [], P(0, 0.62), null, 560);
    tag(0, "O CALENDÁRIO", Y, P(0, 0.80), null, 760, 36);
    // 1 — Época de Plantio
    H.item(1, 'Item_Seeds_Potato', 'SEMENTES', P(1, 0.08), { left: 120, top: 560 });
    cal(1, 'Item_Potato', [2, 3, 4], P(1, 0.45), null, 760);
    tag(1, "MESES CERTOS", G, P(1, 0.75), null, 1250, 34);
    // 2 — fora do mês: condenada, saúde cai
    cal(2, 'Item_Potato', [2, 3, 4], P(2, 0.02), null, 560, { err: 8 });
    tag(2, "CONDENADA", RD, P(2, 0.40), null, 760, 40);
    barra(2, 'Item_Potato', 'SAÚDE', [[P(2, 0.45), 1], [P(2, 0.95), .25, 'softInOut']], RD, P(2, 0.42), null, 900);
    // 3 — novembro e dezembro: nenhuma planta
    cal(3, null, ALL, P(3, 0.10), null, 560, { risca: [11, 12] });
    tag(3, "NOV · DEZ: NENHUMA PLANTA", RD, P(3, 0.40), null, 1250, 34);
    // 4 — cartões no instante de cada nome
    cal(4, 'Item_Potato', [2, 3, 4], P(4, 0.02), null, 520);
    tag(4, "ÉPOCA DE PLANTIO", G, P(4, 0.85), null, 1160, 34);
    cal(4, 'Item_Tomato', [4, 5, 6], P(4, 0.24), null, 680);
    cal(4, 'Item_Cabbage', [2, 3, 4, 5, 6, 7], P(4, 0.50), null, 840);
    cal(4, 'Item_Carrots', [2, 3, 4, 5, 6, 7], P(4, 0.66), null, 1000);
    tag(4, "VERDE = PODE PLANTAR", G, P(4, 0.92), null, 1250, 32);
    // 5 — água: regador e barra de água subindo
    H.item(5, 'Item_WateringCan', 'REGADOR', P(5, 0.08), { left: 120, top: 560 });
    tag(5, "CADA PLANTA, UM NÍVEL", B, P(5, 0.75), null, 1250, 34);
    barra(5, 'Item_Cabbage', 'NÍVEL DE ÁGUA', [[P(5, 0.45), .15], [P(5, 0.92), .85, 'softInOut']], '#4aa8ff', P(5, 0.40), null, 760);
    // 6 — tomate cheio × cenoura baixa (sem número)
    barra(6, 'Item_Tomato', 'TOMATE: SOLO BEM MOLHADO', [[P(6, 0.05), .1], [P(6, 0.35), .9, 'softInOut']], '#4aa8ff', P(6, 0.02), null, 560);
    tag(6, "NO FIM DO CRESCIMENTO", Y, P(6, 0.70), null, 1250, 32);
    tag(6, "SEM ENCHARCAR", G, P(6, 0.92), null, 1350, 32);
    barra(6, 'Item_Carrots', 'CENOURA: AGUENTA MAIS SECO', [[P(6, 0.50), .1], [P(6, 0.80), .4, 'softInOut']], '#4aa8ff', P(6, 0.46), null, 740);
    // 7 — falta de água → saúde cai → chuva enche
    barra(7, 'Item_Carrots', 'ÁGUA', [[P(7, 0.02), .55], [P(7, 0.45), .08, 'softInOut'], [P(7, 0.66), .08], [P(7, 0.95), .85, 'softInOut']], '#4aa8ff', P(7, 0.02), null, 560);
    tag(7, "UM POUCO: ATRASA", Y, P(7, 0.10), P(7, 0.28), 760, 34);
    tag(7, "MUITO: PARA E PERDE SAÚDE", RD, P(7, 0.28), P(7, 0.62), 760, 32);
    tag(7, "CHUVA REGA O QUE ESTÁ AO AR LIVRE", G, P(7, 0.66), null, 760, 30);
    // 8 — mato: perda ×2
    tag(8, "ERVAS DANINHAS", Y, P(8, 0.06), P(8, 0.45), 560, 36);
    tag(8, "CONDENADA + MATO: PERDA ×2", RD, P(8, 0.45), null, 560, 34);
    // 9 — doença passa para o vizinho
    tag(9, "DOENÇA + MATO:", RD, P(9, 0.15), null, 560, 34);
    tag(9, "CHANCE DUPLA DE PASSAR", RD, P(9, 0.45), null, 660, 34);
    // 10 — inverno
    tag(10, "INVERNO LÁ FORA", B, P(10, 0.05), P(10, 0.50), 560, 36);
    tag(10, "RESISTE AO FRIO", G, P(10, 0.62), null, 760, 36);
    H.item(10, 'Item_Cabbage', 'REPOLHO', P(10, 0.55), { left: 120, top: 560 });
    // 11 — CTA
    H.items(11, [["Item_Potato", "BATATA", P(11, 0.55)], ["Item_Cabbage", "REPOLHO", P(11, 0.62)]], { top: 560, size: 170, gap: 60 });
    tag(11, "COMENTA AÍ", G, P(11, 0.80), null, 800, 36);
  }
};
