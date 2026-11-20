// tiles_usados.mjs — abre cada episódio e lista os sprites do jogo que ele usa (para copiar só esses para assets/tiles).
// Uso: node pipeline/pz/tiles_usados.mjs 16 17 18 19   → imprime um nome por linha
import { createRequire } from 'node:module'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const { chromium } = (() => { const r = createRequire(import.meta.url); try { return r('playwright'); } catch { return r('playwright-core'); } })();
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..'); process.chdir(root);
const b = await chromium.launch({ ...(process.env.PZ_CHROME ? { executablePath: process.env.PZ_CHROME } : {}), args: ['--allow-file-access-from-files'] });
const all = new Set();
for (const ep of process.argv.slice(2)) { const p = await b.newPage(); await p.goto(pathToFileURL(path.resolve(`ep${ep}.html`)).href);
  await p.waitForFunction(() => typeof window.__TILE_NAMES === 'function', null, { timeout: 60000 }).catch(() => {}); (await p.evaluate(() => window.__TILE_NAMES ? window.__TILE_NAMES() : [])).forEach(n => all.add(n)); await p.close(); }
await b.close(); console.log([...all].sort().join('\n'));
