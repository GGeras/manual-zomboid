#!/usr/bin/env python3
"""unpack.py <arquivo.pack> <pasta> [filtro]  — extrai as texturas de um .pack do Project Zomboid (formato PZPK e antigo)."""
import struct, sys, os, io
from PIL import Image
def run(path, out, flt=None, only_list=False):
    d = open(path, 'rb').read(); p = 0
    def i32():
        nonlocal p; v = struct.unpack_from('<i', d, p)[0]; p += 4; return v
    def s():
        nonlocal p; n = i32(); v = d[p:p+n].decode('latin1'); p += n; return v
    v2 = d[:4] == b'PZPK'
    if v2: p = 8
    names = []
    for _ in range(i32()):
        pname = s(); n = i32(); mask = i32(); ents = []
        for _ in range(n):
            nm = s(); ents.append((nm,) + struct.unpack_from('<8i', d, p)); p += 32
        if v2: ln = i32(); png = d[p:p+ln]; p += ln
        else:
            e = d.index(b'\xef\xbe\xad\xde', p); png = d[p:e]; p = e + 4
        img = None
        for nm, x, y, w, h, ox, oy, ow, oh in ents:
            names.append(nm)
            if only_list or (flt and not flt(nm)): continue
            if img is None: img = Image.open(io.BytesIO(png)).convert('RGBA')
            c = Image.new('RGBA', (ow, oh), (0, 0, 0, 0)); c.paste(img.crop((x, y, x + w, y + h)), (ox, oy))
            os.makedirs(out, exist_ok=True); c.save(os.path.join(out, nm + '.png'))
    return names
if __name__ == '__main__':
    pre = sys.argv[3] if len(sys.argv) > 3 else None
    n = run(sys.argv[1], sys.argv[2], (lambda x: x.startswith(pre)) if pre else None)
    print(len(n), 'texturas')
