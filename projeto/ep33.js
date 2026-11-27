// EP 33 — Cadáveres e Mau Cheiro — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('pilha', {"s": 1}),  // 0 — O zumbi morto ainda mata,
  shot('pilha', {"s": 1, "slump": 0.3}),  // 1 — Quantidade + tempo,
  shot('pilha', {}),  // 2 — Moscas = perigo,
  shot('pilha', {"s": 1, "slump": 0.5}),  // 3 — Vapores mortais,
  shot('cama', {"slump": 0.3}),  // 4 — Nem dormir,
  shot('pilha', {"s": 1, "hold": 0.7}),  // 5 — Arrasta pra longe,
  shot('pilha', {"s": 1, "hold": 0.8}),  // 6 — Cova: 5 corpos,
  shot('quintal', {"fk": 1.6}),  // 7 — Ou queima,
  shot('pilha', {"s": 1}),  // 8 — Máscara protege,
  shot('pilha', {"s": 1, "hold": 0.8}),  // 9 — Matou, limpou
]);
