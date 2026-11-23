// EP 20 — Sono — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('cama', {"slump": 0.5}),  // 0 — Dormir mal te mata devagar,
  shot('cama', {"slump": 0.3}),  // 1 — 4 níveis de sono,
  shot('golpe', {"slump": 0.5, "light": "dawn"}),  // 2 — Cansado: menos força,
  shot('casa', {"sit": 1}),  // 3 — Cadeira: só o fôlego,
  shot('cama', {}),  // 4 — Cama boa recupera mais,
  shot('rua', {"n": 3, "light": "dark"}),  // 5 — O jogo nem deixa dormir,
  shot('cama', {"hold": 0.6}),  // 6 — Soníferos ajudam,
  shot('casa', {"hold": 0.6}),  // 7 — Cafeína: só um empurrão,
  shot('cama', {}),  // 8 — Tranca e deita,
  shot('casa', {}),  // 9 — Durma bem, lute melhor
]);
