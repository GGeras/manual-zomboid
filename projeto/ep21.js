// EP 21 — Coleta — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('correr', {"walk": 1, "light": "day"}),  // 0 — O mato tem comida,
  shot('rua', {"n": 0, "crouch": 0.6}),  // 1 — Tecla END,
  shot('rua', {"n": 0, "crouch": 0.6}),  // 2 — Raio: 3 até 10,
  shot('chuva', {}),  // 3 — Chuva e escuro encolhem,
  shot('correr', {"walk": 1}),  // 4 — Agachado acha mais,
  shot('correr', {"walk": 1}),  // 5 — Cada lugar tem o seu,
  shot('rua', {"n": 0, "crouch": 0.6}),  // 6 — Frutinha pode envenenar,
  shot('rua', {"n": 0, "crouch": 0.6}),  // 7 — Depende da estação,
  shot('correr', {"walk": 1}),  // 8 — O mato vira mercado
]);
