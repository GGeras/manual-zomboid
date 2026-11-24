// EP 22 — Fadiga Muscular (B42.22) — RASCUNHO v3 (24/11, Jose): machado em todas as cenas (ícone = arma na mão),
// réplica do painel de saúde (mesma do EP15) com "Distensão Muscular Leve" → "Distensão Muscular" no Braço Direito,
// textos fora da área do personagem e dos botões do app. T/END vêm da voz provisória (tts_rascunho.py) no PC.
const LAB = 'PROJECT ZOMBOID · <b>FADIGA MUSCULAR</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Axe", "Item_PillsPainkiller"],
  OFF: 1.3,
  luz: { padrao: 'exterior-dia', 5: 'interior-tarde', 6: 'interior-dia' },
  T: [0, 4.5, 11, 19, 26, 31, 37, 43], END: 50,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7 }],
  titles: [
    { i: 0, a: "Seu braço", b: "cansa de bater", aSize: 110, size: 100 },
    { i: 1, a: "Distensão", b: "muscular", aSize: 110, size: 128 },
    { i: 2, a: "Braço, perna", b: "e costas", aSize: 96, size: 128 },
    { i: 3, a: "Pisão", b: "cansa menos", col: 'green', aSize: 110, size: 128 },
    { i: 4, a: "Força e", b: "habilidade", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Analgésico", b: "não cura", aSize: 110, size: 128 },
    { i: 6, a: "Exercício", b: "tem preço", aSize: 110, size: 128 },
    { i: 7, a: "Divide", b: "o esforço", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k' + p + (n++);
    const tag = (k, txt, col, at, end, top = 560, fs = 42) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:820px;white-space:nowrap;text-align:center;top:${top}px;color:${col};font:800 ${fs}px/1.15 var(--mono);padding:16px 28px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 640, size: 150, gap: 26, left: 120 }, o));
    el('style', null, '.moodle{left:770px;width:150px;height:150px}.mtag{left:660px;width:370px;font-size:28px;margin-top:30px}', document.head);
    // RÉPLICA da janela do personagem, aba Saúde (layout do print do jogo; textos de IG_UI/ContextMenu PTBR 42.22)
    el('style', null, `
      .hp{position:absolute;left:180px;top:540px;width:480px;height:440px;transform:scale(1.5);transform-origin:0 0;background:#080808;border:1px solid #5a5a5a;font-family:'Noto Sans','DejaVu Sans',Arial,sans-serif;color:#fff}
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
    // 0 — o machado na mão = o ícone
    row(0, [["Item_Axe", "MACHADO DE BOMBEIRO", P(0, 0.30)]]);
    // 1 — painel de saúde: distensão no braço que bateu
    healthPanel(1, C(1) + 2, '', [['Braço Direito', ['Distensão Muscular Leve'], P(1, .30), P(1, .62)], ['Braço Direito', ['Distensão Muscular'], P(1, .62)]]);
    // 2 — braço · pernas · costas
    tag(2, "BATER → BRAÇO", RD, P(2, 0.06), P(2, 0.30));
    tag(2, "CORRER → PERNAS", Y, P(2, 0.33), P(2, 0.64));
    H.moodle(2, 'pz:Status_HeavyLoad', "PESO → COSTAS", P(2, 0.66), false, null, 560);
    // 3 — arma pesada · pisão
    row(3, [["Item_Axe", "ARMA PESADA", P(3, 0.10)]]);
    tag(3, "PISÃO = MENOS ESFORÇO", G, P(3, 0.50), null);
    // 4 — força e habilidade da arma
    tag(4, "FORÇA ↑", G, P(4, 0.12), P(4, 0.38));
    tag(4, "MACHADOS ↑", G, P(4, 0.38), P(4, 0.64));
    tag(4, "DISTENSÃO ↓", G, P(4, 0.64), null);
    // 5 — analgésico: a dor sai, a distensão fica (no painel)
    row(5, [["Item_PillsPainkiller", "ANALGÉSICO", P(5, 0.08)]], { top: 1180 });
    H.moodle(5, 'pz:Mood_Pained', "DOR ✓", P(5, 0.30), true, P(5, 0.50), 560);
    healthPanel(5, P(5, 0.50), '', [['Braço Direito', ['Distensão Muscular'], P(5, 0.56)]]);
    // 6 — exercício
    tag(6, "\"DORES TERRÍVEIS NO DIA SEGUINTE\"", B, P(6, 0.14), null, 560, 34);
    H.moodle(6, 'pz:Mood_Pained', "DOR", P(6, 0.50), false, null, 640);
    // 7 — divide o esforço
    tag(7, "GOLPE · PISÃO · CAMINHADA · DESCANSO", G, P(7, 0.06), P(7, 0.70), 560, 32);
    tag(7, "SALVA E COMENTA", G, P(7, 0.72), null);
  }
};
