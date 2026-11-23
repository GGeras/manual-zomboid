// inspect.mjs — inspeção automática de um episódio, ANTES do render final.
// Uso: node pipeline/inspect.mjs NN
// Saídas em out/Video NN - Nome/inspecao/:
//   relatorio.txt   avisos: texto sobreposto/estourando, área ocupada pelos botões do app, personagem fora do quadro ou escondido, trechos parados
//   folha.png       quadros seguidos de cada ação (sem HUD), para conferir a animação
import { createRequire } from 'node:module';
const { chromium } = (() => { const r = createRequire(import.meta.url); try { return r('playwright'); } catch { return r('playwright-core'); } })();
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ep = process.argv[2]; if (!ep) { console.error('uso: node pipeline/inspect.mjs NN'); process.exit(1); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); process.chdir(root);
const man = JSON.parse(fs.readFileSync(`ep${ep}.ep.json`, 'utf8'));
const out = `out/Video ${ep} - ${man.nome}/inspecao`; fs.mkdirSync(out, { recursive: true });
const STEP = 10 / 30;                      // sonda a cada 10 frames
const LIMIT = +(process.argv[3] || 0);       // opcional: inspeciona só até esse segundo (teste)
const SAFE = [{ n: 'botões do app (direita)', x0: 955, x1: 1080, y0: 880, y1: 1620 }, { n: 'legenda/nome do canal (base)', x0: 0, x1: 1080, y0: 1700, y1: 1920 }];
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
let lastNew = 0, prevIds = new Set(), prevCut = -1;
for (let t = 0; t < dur; t += STEP) {
  await page.evaluate(t => window.__seek(t), t);
  const r = await page.evaluate(({ TEXT, IMPORTANT, SAFE }) => {
    const vis = el => { let e = el; while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .08) return false; e = e.parentElement; } return true; };
    const items = [...document.querySelectorAll(TEXT)].filter(vis).map(e => { const b = e.getBoundingClientRect(); return { id: e.id || e.className, txt: (e.innerText || '').trim().slice(0, 28), b: [b.left, b.top, b.right, b.bottom], imp: e.matches(IMPORTANT), el: e }; }).filter(i => i.b[2] - i.b[0] > 4 && i.b[3] - i.b[1] > 4);
    const res = { over: [], wide: [], safe: [], ids: items.map(i => i.id + ':' + i.txt) };
    for (let a = 0; a < items.length; a++) {
      const A = items[a];
      if (A.b[0] < -2 || A.b[2] > 1082) res.wide.push(A.txt);
      if (A.imp) SAFE.forEach(z => { const ix = Math.min(A.b[2], z.x1) - Math.max(A.b[0], z.x0), iy = Math.min(A.b[3], z.y1) - Math.max(A.b[1], z.y0); if (ix > 20 && iy > 20) res.safe.push(A.txt + ' → ' + z.n); });
      for (let b = a + 1; b < items.length; b++) { const B = items[b]; if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
        const ix = Math.min(A.b[2], B.b[2]) - Math.max(A.b[0], B.b[0]), iy = Math.min(A.b[3], B.b[3]) - Math.max(A.b[1], B.b[1]);
        const small = Math.min((A.b[2] - A.b[0]) * (A.b[3] - A.b[1]), (B.b[2] - B.b[0]) * (B.b[3] - B.b[1]));
        if (ix > 0 && iy > 0 && ix * iy > small * .12) res.over.push(A.txt + ' × ' + B.txt); } }
    res.p = window.__probe();
    // regra da revisão 2026-11-20: modal nunca cobre o personagem (2 dos 3 pontos do corpo dentro de uma caixa de texto/tela simulada)
    res.cover = []; const S = res.p && res.p.S;
    if (S) { const pts = S.scr.map(([x, y]) => [x * 1080, y * 1920]);
      [...document.querySelectorAll('.ui,.aw,.tw,.chip,.pzitem,.mb,.moodle,.stamp,.big,.ins,.panel')].filter(vis).forEach(e => { const b = e.getBoundingClientRect(); if (b.width > 1000 && b.height > 1500) return;
        const n = pts.filter(([x, y]) => x > b.left && x < b.right && y > b.top && y < b.bottom).length; if (n >= 2) res.cover.push((e.innerText || e.className).trim().slice(0, 28)); }); }
    return res;
  }, { TEXT, IMPORTANT, SAFE });
  r.over.forEach(m => add(t, 'TEXTO SOBREPOSTO: ' + m));
  r.wide.forEach(m => add(t, 'TEXTO ESTOURA A TELA: ' + m));
  r.safe.forEach(m => add(t, 'ÁREA DOS BOTÕES DO APP: ' + m));
  const p = r.p && r.p.S;
  if (p && t > 1.35) { const c = p.scr[1]; if (c[0] < .04 || c[0] > .96 || c[1] < .2 || c[1] > .98) add(t, 'PERSONAGEM FORA DO QUADRO');
    if (p.hid >= 2) add(t, 'PERSONAGEM ESCONDIDO atrás de algo (' + p.hid + '/3 pontos)');
    if (p.feet != null && p.feet < -.07 && p.y < .05) add(t, 'PERSONAGEM AFUNDANDO NO CHÃO (pés ' + p.feet.toFixed(2) + ')');
    [...new Set(r.cover)].forEach(m => add(t, 'MODAL COBRINDO O PERSONAGEM: ' + m)); }
  const ids = new Set(r.ids); let fresh = false; ids.forEach(i => { if (!prevIds.has(i)) fresh = true; }); prevIds = ids;
  if (fresh) lastNew = t; else if (t - lastNew > 3.2 && t > 2) { add(t, 'NADA NOVO NA TELA há mais de 3 s (ritmo)'); lastNew = t; }
}
// junta avisos repetidos em faixas de tempo
const merged = []; warn.sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[0] - b[0]);
for (const [t, m] of warn) { const L = merged[merged.length - 1]; if (L && L.m === m && t - L.t1 <= STEP * 1.6) L.t1 = t; else merged.push({ m, t0: t, t1: t }); }
merged.sort((a, b) => a.t0 - b.t0);
const fmt = s => s.toFixed(1).padStart(5) + 's';
const lines = merged.map(w => `${fmt(w.t0)}${w.t1 > w.t0 ? ' a ' + fmt(w.t1) : '        '}  ${w.m}`);
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
await browser.close();
if (rows.length) {
  const list = rows.flatMap(r => r[1]);
  const lab = rows.map(([a], i) => `drawtext=text='${a.toFixed(1)}s':x=8:y=${i * 260 + 8}:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.6`).join(',');
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...list.flatMap(f => ['-i', f]), '-filter_complex',
    list.map((_, i) => `[${i}]scale=180:260[v${i}]`).join(';') + ';' + list.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${list.length}:layout=` +
    list.map((_, i) => `${(i % 6) * 180}_${Math.floor(i / 6) * 260}`).join('|') + (lab ? ',' + lab : ''), `${out}/folha.png`]);
}
fs.rmSync(out + '/q', { recursive: true, force: true });
fs.writeFileSync(`${out}/relatorio.txt`, `INSPEÇÃO — episódio ${ep} (${man.nome})\n${merged.length} aviso(s)\n\n` + (lines.join('\n') || 'Nenhum problema encontrado.') + '\n');
console.log(`inspeção: ${merged.length} aviso(s) -> ${out}/relatorio.txt | folha: ${rows.length} ações -> ${out}/folha.png`);
