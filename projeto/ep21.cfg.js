// EP 21 — Coleta (B42.22) — RASCUNHO v3 (24/11, revisão do Bruno; voz provisória Piper — T/END de tts_rascunho.py)
// HUD na área segura (regra 4.3: painéis de 800 px em x 140–940, acima do personagem). Janela "Investigar Área" = réplica da janela do jogo
// (ISSearchWindow.lua + ui/foraging/zoneForest.png + textos do jogo em PT-BR: Foco de Busca / Sem Foco de Busca / Ativar Modo de Busca).
const LAB = 'PROJECT ZOMBOID · <b>COLETA</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_BerryBlue", "Item_Flashlight2", "Item_Rock", "Item_Twigs", "Item_Umbrella"],
  OFF: 1.3,
  luz: { padrao: 'exterior-dia', 3: 'chuva' },
  T: [0.0, 3.65, 10.88, 23.02, 33.61, 40.44, 50.32, 58.24, 64.7], END: 68.89,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8 }],
  titles: [
    { i: 0, a: "O mato", b: "tem comida", col: 'green', aSize: 110, size: 128 },
    { i: 1, a: "Tecla", b: "END", col: 'green', aSize: 110, size: 128 },
    { i: 2, a: "Raio: 3", b: "até 10", aSize: 110, size: 128 },
    { i: 3, a: "Chuva e escuro", b: "encolhem", aSize: 96, size: 128 },
    { i: 4, a: "Agachado", b: "acha mais", col: 'green', aSize: 110, size: 128 },
    { i: 5, a: "Cada lugar", b: "tem o seu", aSize: 110, size: 128 },
    { i: 6, a: "Frutinha", b: "pode envenenar", aSize: 110, size: 100 },
    { i: 7, a: "Depende da", b: "estação", col: 'yellow', aSize: 110, size: 128 },
    { i: 8, a: "O mato", b: "vira mercado", col: 'green', aSize: 110, size: 128 }
  ],
  extras(H) {
    const { F, C, M, el } = H, G = '#8fe04a', RD = '#ff3d55', B = '#efe5cf', Y = '#ffb020';
    const P = (i, k) => Math.round(C(i) + k * ((i + 1 < F.length ? F[i + 1] : window.__VO_END) - F[i]));
    let n = 0; const nid = p => 'k' + p + (n++);
    const tag = (k, txt, col, at, end, top = 560, fs = 44) => { const id = H.chip(k, txt, at, `left:0;right:0;margin:0 auto;width:max-content;max-width:800px;white-space:nowrap;text-align:center;top:${top}px;color:${col};font:800 ${fs}px/1.15 var(--mono);padding:16px 28px;border-color:${col}`); if (end != null) M.hide('#' + id, end); return id; };
    const row = (k, list, o = {}) => H.items(k, list, Object.assign({ top: 660, size: 150, gap: 26 }, o));
    const pop = (id, at, from = { y: 40, opacity: 0 }) => M.enter('#' + id, { at, frames: 8, ease: 'snapSettle', from });
    const span = (id, at, end) => { M.hide('#' + id, 0); M.show('#' + id, at); if (end != null) M.hide('#' + id, end); };
    el('style', null, `
      .iw{position:absolute;left:140px;top:520px;width:800px;background:#1b1b1b;border:2px solid #5a5a5a;border-radius:4px;box-shadow:0 24px 70px rgba(0,0,0,.75);font-family:Arial,Helvetica,sans-serif;color:#e8e8e8;overflow:visible}
      .iw .tb{height:46px;line-height:46px;text-align:center;font-size:26px;background:linear-gradient(#3a3a3a,#262626);border-bottom:2px solid #555;position:relative}
      .iw .tb i{position:absolute;top:9px;width:28px;height:28px;border-radius:50%;border:2px solid #cfcfcf;font:700 18px/26px Arial;text-align:center;font-style:normal}
      .iw .zn{position:relative;height:230px;background:linear-gradient(#5d6f86 0%,#8aa0b5 60%,#a9b7c2 100%);overflow:hidden}
      .iw .zn img.z{position:absolute;left:0;bottom:0;width:800px;height:191px;image-rendering:pixelated;filter:brightness(0)}
      .iw .zn .sol{position:absolute;right:120px;top:26px;width:46px;height:46px;border-radius:50%;background:#fff6c8;box-shadow:0 0 30px #fff1a0}
      .iw .zn .q{position:absolute;left:16px;bottom:16px;width:40px;height:40px;border-radius:50%;border:3px solid #e8e8e8;font:700 26px/36px Arial;text-align:center;color:#e8e8e8;background:rgba(0,0,0,.35)}
      .iw .zn img.eye{position:absolute;right:18px;bottom:14px;width:70px;height:39px;image-rendering:pixelated}
      .iw .fo{display:flex;align-items:center;gap:16px;padding:16px 16px 0}
      .iw .fo b{font-weight:400;font-size:26px;white-space:nowrap}
      .iw .cb{flex:1;height:50px;border:2px solid #8a8a8a;background:#121212;font-size:25px;line-height:46px;padding-left:16px;position:relative}
      .iw .cb:after{content:'▼';position:absolute;right:14px;top:0;font-size:22px}
      .iw .bt{margin:14px 16px 16px;height:52px;border:2px solid #8a8a8a;background:#2a2a2a;text-align:center;font-size:25px;line-height:48px}
      .iw .dd{position:absolute;left:170px;right:16px;top:332px;background:#101010;border:2px solid #8a8a8a;font-size:24px;z-index:3}
      .iw .dd div{height:44px;line-height:44px;padding-left:16px}
      .cur{position:absolute;width:34px;height:46px;z-index:5;clip-path:polygon(0 0,0 80%,24% 62%,42% 100%,56% 94%,40% 58%,74% 58%);background:#fff;filter:drop-shadow(2px 3px 2px rgba(0,0,0,.8))}
      .tr{position:absolute;left:140px;width:800px;height:96px;display:flex;align-items:center;gap:22px;padding:0 24px;box-sizing:border-box;background:rgba(16,14,13,.94);border:3px solid rgba(239,229,207,.45);border-radius:10px;font:800 40px/1 var(--mono);color:var(--bone)}
      .tr img{width:64px;height:64px;image-rendering:pixelated}
      .tr span.v{margin-left:auto}`, document.head);
    // janela Investigar Área (como no jogo); foco = texto do seletor
    const janela = (k, at, end, foco = 'Sem Foco de Busca') => { const w = el('div', 'iw', `<div class="tb"><i style="left:12px">×</i><i style="left:50px">i</i>Investigar Área</div>
        <div class="zn"><div class="sol"></div><img class="z" src="./assets/ui/foraging/zoneForest.png"><div class="q">?</div><img class="eye" src="./assets/ui/foraging/eyeconOff.png"></div>
        <div class="fo"><b>Foco de Busca</b><div class="cb">${foco}</div></div><div class="bt">Ativar Modo de Busca</div>`, H.sc(k)); w.id = nid('iw');
      M.enter('#' + w.id, { at, frames: 10, ease: 'snapSettle', from: { y: 80, opacity: 0, scale: .94 } }); if (end != null) M.hide('#' + w.id, end); return w; };
    const cursor = (k, keys) => { const c = el('div', 'cur', '', H.sc(k)); c.id = nid('cu'); M.kf('#' + c.id, 'x', keys.map(([f, x]) => [f, x])); M.kf('#' + c.id, 'y', keys.map(([f, , y]) => [f, y])); return c; };
    // traço como na criação do personagem: ícone, nome e custo
    const traco = (k, ic, nome, custo, col, at, top) => { const t = el('div', 'tr', `<img src="./assets/items/${ic}.png"><span>${nome}</span><span class="v" style="color:${col}">${custo}</span>`, H.sc(k), `top:${top}px`); t.id = nid('tr'); pop(t.id, at, { x: 80, opacity: 0 }); return t; };

    row(0, [["Item_BerryBlue", "?", P(0, 0.30)]], { top: 600 });
    // 1 — abre a janela, clica em Ativar Modo de Busca (vira Desativar), fecha; tecla END
    const w1 = janela(1, P(1, .04), P(1, .62)); const bt = w1.querySelector('.bt');
    const ck = el('div', null, '', bt); ck.id = nid('ck'); ck.style.cssText = 'position:absolute;inset:0'; bt.style.position = 'relative';
    const on1 = el('div', null, 'Desativar Modo de Busca', bt, 'position:absolute;inset:0;background:#3d5a2a;opacity:0'); on1.id = nid('on'); M.kf('#' + on1.id, 'opacity', [[P(1, .43), 0], [P(1, .44), 1]]);
    M.kf('#' + w1.id + ' .eye', 'opacity', [[P(1, .43), 1], [P(1, .44), 0]]);
    cursor(1, [[P(1, .10), 980, 1240], [P(1, .30), 560, 920], [P(1, .41), 540, 900], [P(1, .43), 536, 896], [P(1, .60), 536, 896], [P(1, .62), 1200, 900]]);
    tag(1, "TECLA END", Y, P(1, .66), null);
    // 2 — raio: Coleta 0 = 3 quadrados, nível 10 = 10
    tag(2, "COLETA 0 → 3 QUADRADOS", Y, P(2, 0.10), P(2, 0.58));
    tag(2, "COLETA 10 → 10 QUADRADOS", G, P(2, 0.60), null);
    // 3 — clima e escuro encolhem
    tag(3, "CHUVA · NEBLINA · NEVE · ESCURO", RD, P(3, 0.10), null, 560, 34);
    row(3, [["Item_Umbrella", "GUARDA-CHUVA", P(3, 0.50)], ["Item_Flashlight2", "LANTERNA", P(3, 0.70)]], { top: 680 });
    // 4 — agachado / andar em círculo
    tag(4, "AGACHADO ✓", G, P(4, 0.12), P(4, 0.53));
    tag(4, "ANDAR EM CÍRCULO ✗", RD, P(4, 0.55), null);
    // 5 — cada lugar tem o seu (mesma ordem dos marcadores no mato)
    row(5, [["Item_Twigs", "FLORESTA", P(5, 0.08)], ["Item_Rock", "ESTRADA", P(5, 0.28)], ["Item_BerryBlue", "FLORESTA", P(5, 0.48)], ["Item_Cricket", "À NOITE", P(5, 0.70)]], { top: 560, size: 140 });
    // 6 — frutinha pode envenenar; Herbalista ajuda a reconhecer o que é seguro (sem número: não validado em info-validada)
    row(6, [["Item_BerryBlue", "VENENOSA?", P(6, 0.15)]], { top: 560, size: 150 });
    row(6, [["trait_herbalist", "HERBALISTA RECONHECE", P(6, 0.55)]], { top: 780, size: 140 });
    // 7 — estação + Foco de Busca: abre o seletor e escolhe Frutas Silvestres
    tag(7, "MÊS E ESTAÇÃO", Y, P(7, 0.02), P(7, 0.22));
    const w7 = janela(7, P(7, .24), null); const cb = w7.querySelector('.cb');
    const sel = el('div', null, 'Frutas Silvestres', cb, 'position:absolute;inset:0;padding-left:16px;background:#121212;opacity:0'); sel.id = nid('se'); M.kf('#' + sel.id, 'opacity', [[P(7, .66), 0], [P(7, .67), 1]]);
    const dd = el('div', 'dd', ['Sem Foco de Busca', 'Frutas Silvestres', 'Cogumelos', 'Lenha', 'Pedras', 'Insetos'].map((t, i) => `<div style="${i === 1 ? 'background:#3a4f6a' : ''}">${t}</div>`).join(''), w7); dd.id = nid('dd');
    span(dd.id, P(7, .44), P(7, .66));
    cursor(7, [[P(7, .26), 980, 1200], [P(7, .40), 900, 870], [P(7, .44), 900, 870], [P(7, .56), 500, 920], [P(7, .66), 500, 920], [P(7, .70), 1100, 1100]]);
    tag(8, "SALVA E COMENTA", G, P(8, 0.40), null, 560);
  }
};
