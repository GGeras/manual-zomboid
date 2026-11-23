// EP 25 — Tédio e Tristeza — cenas 3D do rascunho automático (auto3d.js). Uma tomada por frase.
import { run } from './ep3d.js';
import { shot } from './auto3d.js';
run([
  shot('casa', {"slump": 0.4}),  // 0 — Até o tédio é perigoso,
  shot('casa', {"sit": 1, "slump": 0.3}),  // 1 — Ocupe-se ,
  shot('casa', {"dark": 1, "sit": 1, "slump": 0.6}),  // 2 — Triste até sem esperança,
  shot('casa', {"sit": 1, "hold": 0.7}),  // 3 — Leitura tira os dois,
  shot('quintal', {}),  // 4 — Olha o tooltip,
  shot('casa', {"sit": 1, "hold": 0.6}),  // 5 — Antidepressivo: devagar,
  shot('casa', {"sit": 1, "hold": 0.7}),  // 6 — Livro e comida boa
]);
