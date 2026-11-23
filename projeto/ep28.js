// EP 28 — Helicóptero — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('horda', {"n": 8, "light": "dawn"}),  // 0 — Você ouve. Eles também.,
  shot('casa', {}),  // 1 — Uma vez, noite 6 a 9,
  shot('casa', {"sit": 1}),  // 2 — O rádio avisa,
  shot('horda', {"n": 10, "light": "dawn"}),  // 3 — Não dá pra atirar nele,
  shot('correr', {"z": 4, "light": "dawn"}),  // 4 — Te viu? Te segue,
  shot('casa', {}),  // 5 — Das 9h às 18h,
  shot('horda', {"n": 12}),  // 6 — Depois: rua lotada,
  shot('horda', {"n": 6, "light": "dark"}),  // 7 — Tiros ao longe,
  shot('casa', {"dark": 1, "sit": 1}),  // 8 — Dentro de casa, quieto
]);
