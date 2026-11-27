// capa.mjs <saida.jpg|png> [query]  — rode dentro de projeto/ : tira a foto 1080x1920 da capa20.html
import { createRequire } from 'node:module'; const { chromium } = (() => { const r = createRequire(import.meta.url); try { return r('playwright'); } catch { return r('playwright-core'); } })();
import path from 'node:path'; import { pathToFileURL } from 'node:url';
const [out, q = ''] = process.argv.slice(2);
const b = await chromium.launch({ ...(process.env.PZ_CHROME ? { executablePath: process.env.PZ_CHROME } : {}), args: process.env.PZ_GPU ? ['--allow-file-access-from-files', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'] : ['--allow-file-access-from-files', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); const errs = [];
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(pathToFileURL(path.resolve('capa20.html')).href + q);
try { await p.waitForFunction(() => window.__done === true, null, { timeout: 90000 }); } catch (e) { errs.push('timeout esperando o 3D'); }
await p.waitForTimeout(800);
await p.screenshot({ path: out, ...(out.endsWith('.jpg') ? { type: 'jpeg', quality: 94 } : {}) });
if (errs.length) console.log(errs.slice(0, 6).join('\n')); await b.close();
