// EP 22 — Fadiga Muscular — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('golpe', {}),  // 0 — Seu braço cansa de bater,
  shot('casa', {"sit": 1}),  // 1 — Distensão muscular,
  shot('correr', {}),  // 2 — Braço, perna e costas,
  shot('pisao', {}),  // 3 — Pisão cansa menos,
  shot('golpe', {}),  // 4 — Força e habilidade,
  shot('casa', {"sit": 1, "hold": 0.6}),  // 5 — Analgésico não cura,
  shot('casa', {"crouch": 0.7}),  // 6 — Exercício tem preço,
  shot('golpe', {}),  // 7 — Divide o esforço
]);
