#!/usr/bin/env python3
"""tiles_meta.py <pasta_tiles> — gera <pasta>/meta.js com o retângulo opaco de cada sprite (usado por tiles.js para medir a altura dos objetos)."""
import sys, os, json
from PIL import Image
d = sys.argv[1]; meta = {}
for f in sorted(os.listdir(d)):
    if not f.endswith('.png'): continue
    im = Image.open(os.path.join(d, f)); bb = im.getchannel('A').point(lambda a: 255 if a > 110 else 0).getbbox() or (0, 0, 0, 0)
    meta[f[:-4]] = [*bb, *im.size]
open(os.path.join(d, 'meta.js'), 'w').write('export default ' + json.dumps(meta, separators=(',', ':')) + ';\n')
print(len(meta), 'sprites')
