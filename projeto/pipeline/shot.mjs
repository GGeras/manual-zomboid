// shot.mjs <pagina.html[?query]> <saida.png> [largura altura]  — tira uma foto do canvas de uma página do projeto
import { createRequire } from 'node:module'; const { chromium } = (() => { const r = createRequire(import.meta.url); try { return r('playwright'); } catch { return r('playwright-core'); } })();
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const [page0, out, W = 1600, H = 900] = process.argv.slice(2); const [file, query] = page0.split('?');
const b = await chromium.launch({ ...(process.env.PZ_CHROME ? { executablePath: process.env.PZ_CHROME } : {}), args: process.env.PZ_GPU ? ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] : ['--allow-file-access-from-files', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: +W, height: +H } }); const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(path.resolve(file)).href + (query ? '?' + query : ''));
try { await p.waitForFunction(() => window.__done === true, null, { timeout: 90000 }); } catch (e) { errs.push('timeout'); }
if (errs.length) console.log(errs.slice(0, 8).join('\n'));
const data = await p.evaluate(() => document.querySelector('canvas').toDataURL('image/png')); fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64')); await b.close();
