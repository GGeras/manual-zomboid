// EP 29 — Fome e Peso do Corpo — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('quintal', {"hold": 0.6}),  // 0 — Come e emagrece,
  shot('casa', {"slump": 0.4}),  // 1 — Fome tira suas forças,
  shot('quintal', {"hold": 0.6}),  // 2 — Peso = calorias,
  shot('casa', {}),  // 3 — Dieta balanceada,
  shot('correr', {"slump": 0.3}),  // 4 — Peso errado cobra caro,
  shot('quintal', {}),  // 5 — Cozida sacia mais,
  shot('chuva', {"slump": 0.3}),  // 6 — Inverno gasta mais,
  shot('quintal', {"hold": 0.6}),  // 7 — Fome é alarme, caloria é combustível
]);
