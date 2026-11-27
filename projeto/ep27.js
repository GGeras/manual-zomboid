// EP 27 — Resfriado e Doença — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('rua', {"n": 3, "crouch": 0.6, "light": "dark", "sneeze": 1}),  // 0 — Um espirro e a horda vem,
  shot('chuva', {}),  // 1 — Frio e molhado: resfriado,
  shot('chuva', {"slump": 0.5}),  // 2 — Nariz escorrendo até terrível,
  shot('rua', {"n": 3, "light": "dark", "sneeze": 1}),  // 3 — Espirro atrai zumbi,
  shot('casa', {"hold": 0.6}),  // 4 — Lenço abafa,
  shot('cama', {"slump": 0.6}),  // 5 — Doença: até febre,
  shot('quintal', {}),  // 6 — Cozinha direito,
  shot('casa', {"hold": 0.5}),  // 7 — Corpo limpo,
  shot('casa', {}),  // 8 — Resiliente adoece menos,
  shot('casa', {}),  // 9 — Seco, limpo e com malva
]);
