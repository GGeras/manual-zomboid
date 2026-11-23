// EP 23 — Carga e Peso — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('casa', {"hold": 0.6}),  // 0 — Pegar tudo te mata,
  shot('casa', {}),  // 1 — Força e moodles,
  shot('correr', {"walk": 1, "slump": 0.6}),  // 2 — Sobrecarga: te machuca,
  shot('correr', {"walk": 1, "slump": 0.5}),  // 3 — Costas e cercas,
  shot('casa', {}),  // 4 — Mochila nas costas,
  shot('casa', {}),  // 5 — Militar: reduz 85%,
  shot('correr', {"walk": 1}),  // 6 — Movimento restrito,
  shot('casa', {}),  // 7 — Forte carrega mais,
  shot('correr', {}),  // 8 — Só o que precisa
]);
