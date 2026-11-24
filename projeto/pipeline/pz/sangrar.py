#!/usr/bin/env python3
"""sangrar.py sprite.png [...] — tira a "linha clara" na junta de móveis de 2 ladrilhos (cama): os pixels transparentes do sprite do jogo
vêm brancos (255,255,255,0) e o filtro linear mistura esse branco na borda. Aqui cada pixel transparente recebe a cor do vizinho opaco
(alfa continua 0; o desenho não muda)."""
import sys
import numpy as np
from PIL import Image
for f in sys.argv[1:]:
    a = np.array(Image.open(f).convert('RGBA')).astype(np.float32); rgb, al = a[..., :3], a[..., 3]
    ok = al > 0
    for _ in range(6):
        s = np.zeros_like(rgb); n = np.zeros(al.shape, np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            m = np.roll(np.roll(ok, dy, 0), dx, 1); s += np.roll(np.roll(rgb, dy, 0), dx, 1) * m[..., None]; n += m
        novo = (~ok) & (n > 0); rgb[novo] = s[novo] / n[novo][:, None]; ok = ok | novo
    a[..., :3] = rgb; Image.fromarray(a.astype(np.uint8), 'RGBA').save(f); print('ok', f)
