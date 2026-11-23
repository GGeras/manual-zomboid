// EP 21 — Coleta — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('mato', {"crouch": 0.2}),  // 0 — O mato tem comida,
  shot('mato', {"still": 1}),  // 1 — Tecla END,
  shot('mato', {}),  // 2 — Raio: 3 até 10,
  shot('chuva', {}),  // 3 — Chuva e escuro encolhem,
  shot('mato', {"crouch": 0.8}),  // 4 — Agachado acha mais,
  shot('mato', {}),  // 5 — Cada lugar tem o seu,
  shot('mato', {"still": 1, "crouch": 0.8, "hold": 0.6}),  // 6 — Frutinha pode envenenar,
  shot('mato', {"light": "dawn"}),  // 7 — Depende da estação,
  shot('mato', {"crouch": 0.6}),  // 8 — O mato vira mercado
]);
