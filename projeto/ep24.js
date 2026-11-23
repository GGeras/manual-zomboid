// EP 24 — Pânico e Estresse — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('rua', {"n": 3, "aim": 1, "light": "dawn"}),  // 0 — Mão treme, tiro torto,
  shot('rua', {"n": 3, "aim": 1, "light": "dawn"}),  // 1 — Nervosismo até Terror,
  shot('golpe', {"slump": 0.4}),  // 2 — Pânico e cansaço: erra mais,
  shot('casa', {"sit": 1, "slump": 0.3}),  // 3 — Estresse também,
  shot('casa', {"hold": 0.6}),  // 4 — Calmantes reduzem o pânico,
  shot('casa', {"sit": 1, "hold": 0.7}),  // 5 — Leitura acalma,
  shot('rua', {"n": 3, "light": "dawn"}),  // 6 — Corajoso ou Covarde?,
  shot('casa', {"slump": 0.3}),  // 7 — Rua ou quartinho,
  shot('rua', {"n": 1, "aim": 1}),  // 8 — Calma na mão, tiro na cabeça
]);
