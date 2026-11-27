// EP 32 — Fogo e Incêndio — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('fogo', {"s": 1}),  // 0 — Fogão esquecido queima tudo,
  shot('fogo', {}),  // 1 — O fogo se espalha,
  shot('casa', {}),  // 2 — Desliga o fogão,
  shot('fogo', {"z": 1}),  // 3 — Zumbi em chamas espalha,
  shot('fogo', {"s": 1, "hold": 0.8}),  // 4 — Extintor: apagar fogo,
  shot('fogo', {"s": 1, "hold": 0.6}),  // 5 — Areia também apaga,
  shot('quintal', {}),  // 6 — 3 pedras, até 8 horas,
  shot('quintal', {"sit": 1}),  // 7 — Extintor sempre perto
]);
