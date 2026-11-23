// inspect.mjs — inspeção automática de um episódio, ANTES do render final.
// Uso: node pipeline/inspect.mjs NN
// Saídas em out/Video NN - Nome/inspecao/:
//   relatorio.txt   avisos: texto sobreposto/estourando, área ocupada pelos botões do app, personagem fora do quadro ou escondido, trechos parados
//   folha.png       quadros seguidos de cada ação (sem HUD), para conferir a animação
//   (regra 4.4) direção dos sprites: móvel de lado/solto do canto, cortina/tábua desenhada para outra borda da janela
//   (regra 4.5) luz de acordo com o ambiente (window.EP.luz): brilho, contraste, personagem legível, nada estourado
//   (regra 4.6) personagem atravessando móvel (cadeira, poltrona, mesa, bancada)
//   zonas.png       meio de cada cena COM textos + áreas da interface dos apps (vermelho) e área segura (verde) — regra 4.3
import { createRequire } from 'node:module';
const { chromium } = (() => { const r = createRequire(import.meta.url); try { return r('playwright'); } catch { return r('playwright-core'); } })();
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ep = process.argv[2]; if (!ep) { console.error('uso: node pipeline/inspect.mjs NN'); process.exit(1); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); process.chdir(root);   // fileURLToPath: funciona no Windows (PC com a placa)
const man = JSON.parse(fs.readFileSync(`ep${ep}.ep.json`, 'utf8'));
const out = `out/Video ${ep} - ${man.nome}/inspecao`; fs.mkdirSync(out, { recursive: true });
const STEP = 10 / 30;                      // sonda a cada 10 frames
const LIMIT = +(process.argv[3] || 0);       // opcional: inspeciona só até esse segundo (teste)
// REGRA 4.3 (22/11): áreas cobertas pela interface dos apps (TikTok / Reels / Shorts, tela 1080×1920) — nada importante pode ficar embaixo
//   direita = curtir / comentar / salvar / compartilhar / disco; base = @canal, descrição, música e barra de navegação; topo = abas e busca
const SAFE = [{ n: 'botões curtir/comentar/compartilhar (direita)', x0: 940, x1: 1080, y0: 860, y1: 1720 },
  { n: 'descrição/@canal/música (base)', x0: 0, x1: 1080, y0: 1560, y1: 1920 },
  { n: 'abas e busca do app (topo)', x0: 0, x1: 1080, y0: 0, y1: 190 }];
const MARGEM = 40;
const TXT = process.platform !== 'win32';   // ffmpeg do Windows sem fontconfig cai no drawtext: lá as folhas saem sem os rótulos de tempo                          // nenhum elemento importante encosta na borda da tela (respiro mínimo)
const BOXES = '.ui,.panel,.tw,.chip,.stamp,.pzitem,.card,.mb,.big,.bm,.bml,.moodle,.mtag,.ver';   // elementos que entram na conferência de harmonia
const IMPORTANT = '.chip,.panel,.bar,.bartag,.stamp,.big,.pct,.pzitem';
const TEXT = '.t1,.t2,.chip,.panel,.bartag,.stamp,.big,.pct,.mtag,.pzitem,.ins,.ver';   // .ins = elemento de tela simulada que conta para o ritmo

const browser = await chromium.launch({ ...(process.env.PZ_CHROME ? { executablePath: process.env.PZ_CHROME } : {}), args: process.env.PZ_GPU ? ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] : ['--allow-file-access-from-files', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; page.on('pageerror', e => errs.push(String(e)));
await page.goto(pathToFileURL(path.resolve(`ep${ep}.html`)).href);
await page.waitForFunction(() => typeof window.__seek === 'function' && typeof window.__probe === 'function', null, { timeout: 60000 });
await page.evaluate(async () => { if (window.__ready) await window.__ready; await document.fonts.ready; });
const dur = LIMIT || await page.evaluate(() => window.__DUR || 40);

const warn = []; const add = (t, msg) => warn.push([t, msg]);
// regra 4.4: direção dos sprites (móvel virado/solto, cortina ou tábua no lado errado da janela) — conferido na montagem das cenas
for (const m of await page.evaluate(() => window.__ORIENT ? window.__ORIENT() : [])) add(0, 'DIREÇÃO DO SPRITE: ' + m);
const PROBE = [];
let lastNew = 0, prevIds = new Set(), prevCut = -1, prevH = new Set();
for (let t = 0; t < dur; t += STEP) {
  await page.evaluate(t => window.__seek(t), t);
  const r = await page.evaluate(({ TEXT, IMPORTANT, SAFE, MARGEM, BOXES }) => {
    const vis = el => { let e = el; while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .08) return false; e = e.parentElement; } return true; };
    const parado = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (+cs.opacity < .98) return false;
      if (cs.transform && cs.transform !== 'none') { const m = cs.transform.match(/matrix\(([^)]+)\)/); if (m) { const v = m[1].split(',').map(Number); if (Math.abs(Math.hypot(v[0], v[1]) - 1) > .01 || Math.abs(Math.hypot(v[2], v[3]) - 1) > .01) return false; } } } return true; };
    const items = [...document.querySelectorAll(TEXT)].filter(vis).map(e => { const b = e.getBoundingClientRect(); return { id: e.id || e.className, txt: (e.innerText || '').trim().slice(0, 28), b: [b.left, b.top, b.right, b.bottom], imp: e.matches(IMPORTANT), el: e }; }).filter(i => i.b[2] - i.b[0] > 4 && i.b[3] - i.b[1] > 4);
    const res = { over: [], wide: [], safe: [], ids: items.map(i => i.id + ':' + i.txt) };
    for (let a = 0; a < items.length; a++) {
      const A = items[a];
      if (A.b[0] < -2 || A.b[2] > 1082) res.wide.push(A.txt);
      if (A.imp) SAFE.forEach(z => { const ix = Math.min(A.b[2], z.x1) - Math.max(A.b[0], z.x0), iy = Math.min(A.b[3], z.y1) - Math.max(A.b[1], z.y0); if (ix > 20 && iy > 20) res.safe.push(A.txt + ' → ' + z.n); });
      for (let b = a + 1; b < items.length; b++) { const B = items[b]; if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        if (!parado(A.el) || !parado(B.el)) continue;   // entrada animada (pop/escala) não conta; o estado parado é conferido na sondagem seguinte
        const ix = Math.min(A.b[2], B.b[2]) - Math.max(A.b[0], B.b[0]), iy = Math.min(A.b[3], B.b[3]) - Math.max(A.b[1], B.b[1]);
        const small = Math.min((A.b[2] - A.b[0]) * (A.b[3] - A.b[1]), (B.b[2] - B.b[0]) * (B.b[3] - B.b[1]));
        if (ix > 0 && iy > 0 && ix * iy > small * .12) res.over.push(A.txt + ' × ' + B.txt); } }
    res.p = window.__probe();
    // regra da revisão 2026-11-20: modal nunca cobre o personagem (2 dos 3 pontos do corpo dentro de uma caixa de texto/tela simulada)
    res.cover = []; const S = res.p && res.p.S;
    if (S) { const pts = S.scr.map(([x, y]) => [x * 1080, y * 1920]);
      [...document.querySelectorAll('.ui,.aw,.tw,.chip,.pzitem,.mb,.moodle,.stamp,.big,.ins,.panel')].filter(vis).forEach(e => { const b = e.getBoundingClientRect(); if (b.width > 1000 && b.height > 1500) return;
        if (!parado(e)) return; const den = ([x, y]) => x > b.left && x < b.right && y > b.top && y < b.bottom;
        const n = pts.slice(0, 3).filter(den).length; if (n >= 2 || (pts[3] && den(pts[3]))) res.cover.push((e.innerText || e.className).trim().slice(0, 28)); }); }   // 2 pontos do corpo OU o topo da cabeça
    // regra da revisão 2026-11-20 (EP14/15): texto NUNCA vaza da caixa; rótulo de item/cartão/chip sem quebra de linha (padroniza o tamanho)
    res.leak = []; res.wrap = []; const BOX = '.pzitem,.chip,.card,.ui,.aw,.tw,.hp,.pt,.stamp,.bm,.ex,.bt,.slot,.mtag';
    const tw = document.createTreeWalker(document.getElementById('main') || document.body, NodeFilter.SHOW_TEXT);
    for (let nd = tw.nextNode(); nd; nd = tw.nextNode()) { if (!nd.textContent.trim()) continue; const pe = nd.parentElement; if (!pe || !vis(pe)) continue;
      const box = pe.closest(BOX); if (!box) continue; const rg = document.createRange(); rg.selectNodeContents(nd); const rs = [...rg.getClientRects()].filter(r => r.width > 1); if (!rs.length) continue;
      const B = box.getBoundingClientRect(); const out = rs.some(r => r.left < B.left - 2 || r.right > B.right + 2 || r.top < B.top - 2 || r.bottom > B.bottom + 2);
      if (out) res.leak.push(nd.textContent.trim().slice(0, 28));
      if (pe.matches('.pzitem b,.card div,.chip,.gt,.mtag') && !pe.innerHTML.includes('<br') && new Set(rs.map(r => Math.round(r.top))).size > 1) res.wrap.push(nd.textContent.trim().slice(0, 28)); }
    // REGRA 4.3 — harmonia: margem da tela, centralização, mesma linha = mesmo tamanho e mesmo espaçamento, respiro entre blocos
    res.edge = []; res.cen = []; res.row = []; res.gap = []; res.tight = [];
    // só confere elemento PARADO (fora da animação de entrada/pulso): escala 1 e opacidade cheia nele e nos pais (parado(), lá em cima)
    const bx = [...document.querySelectorAll(BOXES)].filter(vis).map(e => { const b = e.getBoundingClientRect(); return { e, b, txt: (e.innerText || e.className).trim().replace(/\s+/g, ' ').slice(0, 26) }; })
      .filter(o => o.b.width > 8 && o.b.height > 8 && o.b.width < 1060 && o.b.bottom > 0 && o.b.top < 1920 && parado(o.e));
    bx.forEach(o => { const { b } = o, top = !o.e.parentElement.closest(BOXES); if (top && (b.left < MARGEM - 1 || b.right > 1080 - MARGEM + 1)) res.edge.push(o.txt);
      if (top && !o.e.matches(IMPORTANT)) SAFE.forEach(z => { const ix = Math.min(b.right, z.x1) - Math.max(b.left, z.x0), iy = Math.min(b.bottom, z.y1) - Math.max(b.top, z.y0); if (ix > 20 && iy > 20) res.safe.push(o.txt + ' → ' + z.n); });
      const dx = Math.abs((b.left + b.right) / 2 - 540); if (b.width > 300 && dx > 14 && dx < 110 && !o.e.parentElement.closest(BOXES)) res.cen.push(o.txt); });
    const pid = new Map(); const rowsOf = sel => { const g = new Map(); bx.filter(o => o.e.matches(sel)).forEach(o => { const p = o.e.parentElement; if (!pid.has(p)) pid.set(p, pid.size); const k = pid.get(p) + ':' + Math.round(o.b.top / 8); g.set(k, [...(g.get(k) || []), o]); }); return [...g.values()].filter(a => a.length > 1); };
    rowsOf('.pzitem,.card').forEach(a => { a.sort((p, q) => p.b.left - q.b.left);
      if (Math.max(...a.map(o => o.b.width)) - Math.min(...a.map(o => o.b.width)) > 6 || Math.max(...a.map(o => o.b.height)) - Math.min(...a.map(o => o.b.height)) > 6) res.row.push(a.map(o => o.txt).join(' | '));
      const gs = a.slice(1).map((o, i) => o.b.left - a[i].b.right); if (gs.length > 1 && Math.max(...gs) - Math.min(...gs) > 8) res.gap.push(a.map(o => o.txt).join(' | ')); });
    for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) { const A = bx[i], B = bx[j]; if (A.e.contains(B.e) || B.e.contains(A.e)) continue;
      const ox = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left); if (ox < Math.min(A.b.width, B.b.width) * .3) continue;
      const g = Math.max(A.b.top, B.b.top) - Math.min(A.b.bottom, B.b.bottom); if (g >= 0 && g < 12) res.tight.push(A.txt + ' / ' + B.txt); }
    return res;
  }, { TEXT, IMPORTANT, SAFE, MARGEM, BOXES });
  r.over.forEach(m => add(t, 'TEXTO SOBREPOSTO: ' + m));
  r.wide.forEach(m => add(t, 'TEXTO ESTOURA A TELA: ' + m));
  r.safe.forEach(m => add(t, 'ÁREA DOS BOTÕES DO APP: ' + m));
  [...new Set(r.leak)].forEach(m => add(t, 'TEXTO VAZANDO DA CAIXA: ' + m));
  [...new Set(r.wrap)].forEach(m => add(t, 'QUEBRA DE LINHA NO RÓTULO (padronizar): ' + m));
  // harmonia: só vale o que fica parado na tela (aparece em 2 sondagens seguidas = não é animação de entrada)
  const H2 = [['edge', 'ENCOSTADO NA BORDA DA TELA (< ' + MARGEM + 'px): '], ['cen', 'QUASE CENTRALIZADO (alinhar no centro): '], ['row', 'TAMANHOS DIFERENTES NA MESMA LINHA: '],
    ['gap', 'ESPAÇAMENTO DESIGUAL NA LINHA: '], ['tight', 'BLOCOS COLADOS (respiro < 12px): ']];
  const nowH = new Set(); H2.forEach(([k, lab]) => new Set(r[k]).forEach(m => { const key = lab + m; nowH.add(key); if (prevH.has(key)) add(t, key); })); prevH = nowH;
  const p = r.p && r.p.S;
  if (p) PROBE.push({ t: +t.toFixed(2), scr: p.scr.map(q => [Math.round(q[0] * 1080), Math.round(q[1] * 1920)]), piso: p.piso, assento: p.assento });   // depuração: posição do personagem na tela
  if (p && t > 1.35) { const c = p.scr[1]; if (c[0] < .04 || c[0] > .96 || c[1] < .2 || c[1] > .98) add(t, 'PERSONAGEM FORA DO QUADRO');
    if (p.hid >= 2) add(t, 'PERSONAGEM ESCONDIDO atrás de algo (' + p.hid + '/3 pontos)');
    (p.atravessa || []).forEach(n => add(t, 'PERSONAGEM ATRAVESSANDO MÓVEL: ' + n + ' (regra 4.6)'));
    // regra 4.3: o corpo inteiro fica ACIMA da descrição/@canal do app (pés estimados pelo tamanho do tronco na tela)
    { const ny = p.scr[0][1] * 1920, hy = p.scr[2][1] * 1920, fy = hy + (hy - ny) * 1.25; if (fy > SAFE[1].y0 + 20) add(t, 'PERSONAGEM NA ÁREA DA DESCRIÇÃO DO APP (pés em ' + Math.round(fy / 40) * 40 + 'px; máx ' + (SAFE[1].y0 + 20) + ')');
      if (p.scr[1][0] * 1080 > SAFE[0].x0 && p.scr[1][1] * 1920 > SAFE[0].y0 && p.scr[1][1] * 1920 < SAFE[0].y1) add(t, 'PERSONAGEM EMBAIXO DOS BOTÕES DO APP (direita)'); }
    // regra 4.7: contato com a superfície (quando a cena declara o apoio com PZ.apoiar): nem afunda nem flutua; sentado, a nádega no assento
    if (p.piso != null) { if (p.piso < -.02) add(t, 'PERSONAGEM ATRAVESSANDO A SUPERFÍCIE (' + Math.round(-p.piso * 100) + ' cm abaixo — regra 4.7)');
      else if (p.piso > .03) add(t, 'PERSONAGEM FLUTUANDO (' + Math.round(p.piso * 100) + ' cm acima da superfície — regra 4.7)');
      if (p.assento != null && Math.abs(p.assento) > .04) add(t, 'NÁDEGA FORA DO ASSENTO (' + (p.assento > 0 ? Math.round(p.assento * 100) + ' cm acima' : Math.round(-p.assento * 100) + ' cm dentro') + ' — regra 4.7)'); }
    else if (p.feet != null && p.feet + p.y < -.05) add(t, 'PERSONAGEM AFUNDANDO NO CHÃO (pés ' + (p.feet + p.y).toFixed(2) + ' abaixo do piso)');   // medida absoluta: o que o espectador vê
    [...new Set(r.cover)].forEach(m => add(t, 'MODAL COBRINDO O PERSONAGEM: ' + m)); }
  const ids = new Set(r.ids); let fresh = false; ids.forEach(i => { if (!prevIds.has(i)) fresh = true; }); prevIds = ids;
  if (fresh) lastNew = t; else if (t - lastNew > 3.2 && t > 2) { add(t, 'NADA NOVO NA TELA há mais de 3 s (ritmo)'); lastNew = t; }
}
if (errs.length) lines.unshift('ERROS NA PÁGINA:', ...errs.map(e => '  ' + e), '');

// folha de conferência: quadros seguidos (sem HUD) em volta de cada som do jogo (cada som = uma ação)
const OFF = 1.3, cfg = fs.readFileSync(`ep${ep}.cfg.js`, 'utf8');
const T = JSON.parse(cfg.match(/T: (\[[^\]]*\])/)[1]); const F = T.map(x => Math.round((x + OFF) * 30)); const C = i => F[i] - 3;
const when = w => typeof w === 'number' ? w : ((w.c != null ? C(w.c) : F[w.f]) / 30 + (w.dt || 0));
const acts = [...new Set((man.sfx || []).filter(e => !(e[3] && e[3].ate)).map(e => +when(e[1]).toFixed(2)))].sort((a, b) => a - b)
  .filter((t, i, a) => (i === 0 || t - a[i - 1] > .5) && t < dur).slice(0, 14);
fs.rmSync(out + '/q', { recursive: true, force: true }); fs.mkdirSync(out + '/q');
let n = 0; const rows = [];
for (const a of acts) { const row = []; for (const d of [-.3, -.13, 0, .1, .23, .4]) { const t = Math.max(0, a + d);
  const f = `${out}/q/${String(n++).padStart(3, '0')}.jpg`;
  const data = await page.evaluate(async t => { await window.__seek(t); const c = document.querySelector('canvas'); const k = document.createElement('canvas'); k.width = 450; k.height = 650;
    k.getContext('2d').drawImage(c, c.width * 90 / 1080, c.height * 330 / 1920, c.width * 900 / 1080, c.height * 1300 / 1920, 0, 0, 450, 650); return k.toDataURL('image/jpeg', .75); }, t);
  fs.writeFileSync(f, Buffer.from(data.split(',')[1], 'base64')); row.push(f); } rows.push([a, row]); }
// REGRA 4.3 — folha zonas.png: o vídeo COM textos no meio de cada cena, com as áreas da interface dos apps pintadas por cima (conferência no olho)
{ const Tz = JSON.parse(cfg.match(/T: (\[[^\]]*\])/)[1]), ENDz = +((cfg.match(/END: ([\d.]+)/) || [0, dur])[1]);
  const shots = []; fs.mkdirSync(out + '/z', { recursive: true });
  // REGRA 4.5 — luz de acordo com o ambiente (window.EP.luz = { padrao: 'interior-tarde', 7: 'exterior-noite' }): brilho médio, contraste
  // (a luz vem de algum lugar), personagem legível e nada estourado. Medido no quadro 3D (sem textos), em 2 pontos de cada cena.
  const LUZ = { 'exterior-dia': [95, 185, 55], 'interior-dia': [75, 170, 60], 'interior-tarde': [60, 150, 90], 'interior-noite': [25, 100, 90], 'exterior-noite': [20, 90, 70], 'chuva': [45, 130, 60] };
  const luzCfg = await page.evaluate(() => (window.EP && window.EP.luz) || {});
  for (let i = 0; i < Tz.length; i++) { const amb = luzCfg[i] || luzCfg.padrao, end = (i + 1 < Tz.length ? Tz[i + 1] : ENDz);
    for (const q of [.35, .75]) { const tl = Math.min(dur - .05, Tz[i] + OFF + (end - Tz[i]) * q);
      const m = await page.evaluate(async t => { await window.__seek(t); const c = document.querySelector('canvas'), k = document.createElement('canvas'); k.width = 270; k.height = 480; const x = k.getContext('2d');
        x.drawImage(c, 0, 0, 270, 480); const d = x.getImageData(0, 0, 270, 480).data, Y = []; for (let p = 0; p < d.length; p += 4) Y.push(.2126 * d[p] + .7152 * d[p + 1] + .0722 * d[p + 2]);
        const so = [...Y].sort((a, b) => a - b), pr = window.__probe && window.__probe().S; let cy = null;
        if (pr) { const xs = pr.scr.map(s => s[0] * 270), ys = pr.scr.map(s => s[1] * 480), x0 = Math.max(0, Math.min(...xs) - 10 | 0), x1 = Math.min(269, Math.max(...xs) + 10 | 0), y0 = Math.max(0, Math.min(...ys) - 8 | 0), y1 = Math.min(479, Math.max(...ys) + 30 | 0);
          let sm = 0, n = 0; for (let yy = y0; yy <= y1; yy++) for (let xx = x0; xx <= x1; xx++) { sm += Y[yy * 270 + xx]; n++; } cy = n ? sm / n : null; }
        return { mean: Y.reduce((a, b) => a + b, 0) / Y.length, p5: so[so.length * .05 | 0], p95: so[so.length * .95 | 0], clip: Y.filter(v => v >= 250).length / Y.length, cy }; }, tl);
      const tag = `cena ${i}${amb ? ' (' + amb + ')' : ''}`;
      if (amb && LUZ[amb]) { const [lo, hi, ct] = LUZ[amb];
        if (m.mean < lo) add(tl, `LUZ ESCURA DEMAIS para ${amb}: brilho ${m.mean | 0} (mín ${lo}) — ${tag}`);
        if (m.mean > hi) add(tl, `LUZ CLARA DEMAIS para ${amb}: brilho ${m.mean | 0} (máx ${hi}) — ${tag}`);
        if (m.p95 - m.p5 < ct) add(tl, `LUZ CHAPADA (sem fonte de luz/contraste): ${(m.p95 - m.p5) | 0} (mín ${ct}) — ${tag}`); }
      if (m.clip > .03) add(tl, `LUZ ESTOURADA: ${(m.clip * 100).toFixed(1)}% branco puro — ${tag}`);
      if (m.cy != null && m.cy < 45) add(tl, `PERSONAGEM ESCURO DEMAIS (brilho ${m.cy | 0}, mín 45) — ${tag}`); } }
  for (let i = 0; i < Tz.length; i++) { const tt = Math.min(dur - .05, Tz[i] + OFF + ((i + 1 < Tz.length ? Tz[i + 1] : ENDz) - Tz[i]) * .7); await page.evaluate(t => window.__seek(t), tt);
    const f = `${out}/z/${String(i).padStart(2, '0')}.png`; await page.screenshot({ path: f }); shots.push([tt, f]); }
  const box = (z, c) => `drawbox=x=${z.x0}:y=${z.y0}:w=${z.x1 - z.x0}:h=${z.y1 - z.y0}:color=${c}@0.38:t=fill`;
  const ov = SAFE.map(z => box(z, 'red')).join(',') + `,drawbox=x=${MARGEM}:y=190:w=${1080 - 2 * MARGEM}:h=1370:color=lime@0.9:t=4`;
  const cols = Math.min(6, shots.length), list = shots.map(s => s[1]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...list.flatMap(f => ['-i', f]), '-filter_complex',
    list.map((_, i) => `[${i}]${ov},scale=270:480${TXT ? `,drawtext=text='${shots[i][0].toFixed(1)}s':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6` : ''}[v${i}]`).join(';') + ';' +
    list.map((_, i) => `[v${i}]`).join('') + (list.length > 1 ? `xstack=inputs=${list.length}:layout=` + list.map((_, i) => `${(i % cols) * 270}_${Math.floor(i / cols) * 480}`).join('|') + ':fill=black' : 'null'), `${out}/zonas.png`]);
  fs.rmSync(out + '/z', { recursive: true, force: true }); }
await browser.close();
if (rows.length) {
  const list = rows.flatMap(r => r[1]);
  const lab = !TXT ? '' : rows.map(([a], i) => `drawtext=text='${a.toFixed(1)}s':x=8:y=${i * 260 + 8}:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.6`).join(',');
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...list.flatMap(f => ['-i', f]), '-filter_complex',
    list.map((_, i) => `[${i}]scale=180:260[v${i}]`).join(';') + ';' + list.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${list.length}:layout=` +
    list.map((_, i) => `${(i % 6) * 180}_${Math.floor(i / 6) * 260}`).join('|') + (lab ? ',' + lab : ''), `${out}/folha.png`]);
}
fs.rmSync(out + '/q', { recursive: true, force: true });
// junta avisos repetidos em faixas de tempo
const merged = []; warn.sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[0] - b[0]);
for (const [t, m] of warn) { const L = merged[merged.length - 1]; if (L && L.m === m && t - L.t1 <= STEP * 1.6) L.t1 = t; else merged.push({ m, t0: t, t1: t }); }
merged.sort((a, b) => a.t0 - b.t0);
const fmt = s => s.toFixed(1).padStart(5) + 's';
const lines = merged.map(w => `${fmt(w.t0)}${w.t1 > w.t0 ? ' a ' + fmt(w.t1) : '        '}  ${w.m}`);
fs.writeFileSync(`${out}/sonda.json`, JSON.stringify(PROBE));
fs.writeFileSync(`${out}/relatorio.txt`, `INSPEÇÃO — episódio ${ep} (${man.nome})\n${merged.length} aviso(s)\n\n` + (lines.join('\n') || 'Nenhum problema encontrado.') + '\n');
console.log(`inspeção: ${merged.length} aviso(s) -> ${out}/relatorio.txt | folha: ${rows.length} ações -> ${out}/folha.png`);
