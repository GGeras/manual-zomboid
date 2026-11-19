#!/usr/bin/env python3
"""xparse.py — lê um modelo .x (texto) do Project Zomboid e devolve esqueleto + malha (com pesos de pele).
Uso: python3 xparse.py modelo.x saida.json   | como módulo: parse(path) -> dict"""
import re, sys, json
TOK = re.compile(r'"[^"]*"|[{};,]|[^\s{};,]+')
def parse(path, anims=False):
    txt = open(path, encoding='latin1').read()
    txt = re.sub(r'//[^\n]*|#[^\n]*', '', txt)
    t = TOK.findall(txt); n = len(t); p = 0
    bones = []; meshes = []; clips = {}
    def skip_block():
        nonlocal p; d = 1
        while d: 
            c = t[p]; p += 1
            if c == '{': d += 1
            elif c == '}': d -= 1
    def nums(k, conv=float):
        nonlocal p; out = []
        while len(out) < k:
            c = t[p]; p += 1
            if c in ';,': continue
            out.append(conv(c))
        return out
    def eat_sep():
        nonlocal p
        while t[p] in ';,': p += 1
    def mesh(name, parent):
        nonlocal p
        nv = nums(1, int)[0]; pos = nums(nv * 3); eat_sep()
        nf = nums(1, int)[0]; faces = []
        for _ in range(nf):
            k = nums(1, int)[0]; faces.append(nums(k, int))
        eat_sep()
        m = {'name': name, 'frame': parent, 'pos': pos, 'faces': faces, 'uv': None, 'nrm': None, 'nfaces': None, 'skin': [], 'tex': None}
        while t[p] != '}':
            kind = t[p]; p += 1
            nm = None
            if t[p] != '{': nm = t[p]; p += 1
            p += 1
            if kind == 'MeshTextureCoords':
                k = nums(1, int)[0]; m['uv'] = nums(k * 2); eat_sep(); assert t[p] == '}'; p += 1
            elif kind == 'MeshNormals':
                k = nums(1, int)[0]; m['nrm'] = nums(k * 3); eat_sep(); f = nums(1, int)[0]; nfc = []
                for _ in range(f): kk = nums(1, int)[0]; nfc.append(nums(kk, int))
                m['nfaces'] = nfc; eat_sep(); assert t[p] == '}'; p += 1
            elif kind == 'SkinWeights':
                bn = t[p].strip('"'); p += 1; eat_sep(); k = nums(1, int)[0]; idx = nums(k, int); eat_sep(); w = nums(k); eat_sep(); off = nums(16); eat_sep()
                m['skin'].append({'bone': bn, 'idx': idx, 'w': w, 'offset': off}); assert t[p] == '}'; p += 1
            elif kind == 'MeshMaterialList':
                d = 1
                while d:
                    c = t[p]; p += 1
                    if c == '{': d += 1
                    elif c == '}': d -= 1
                    elif c == 'TextureFilename': p += 1; m['tex'] = t[p].strip('"'); 
            else: skip_block()
        p += 1; meshes.append(m)
    def frame(parent):
        nonlocal p
        name = t[p]; p += 2
        b = {'name': name, 'parent': parent, 'm': [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]}; bones.append(b)
        while t[p] != '}':
            kind = t[p]; p += 1
            if kind == 'Frame': frame(name)
            elif kind == 'FrameTransformMatrix':
                p += 1; b['m'] = nums(16); eat_sep(); assert t[p] == '}'; p += 1
            elif kind == 'Mesh':
                nm = None
                if t[p] != '{': nm = t[p]; p += 1
                p += 1; mesh(nm, name)
            else:
                if t[p] != '{': p += 1
                p += 1; skip_block()
        p += 1
    def animset():
        nonlocal p
        name = t[p]; p += 2; clip = {}
        while t[p] != '}':
            assert t[p] == 'Animation', t[p]; p += 1
            if t[p] != '{': p += 1
            p += 1; bone = None; keys = {}
            while t[p] != '}':
                if t[p] == '{': bone = t[p + 1]; p += 3; continue
                if t[p] == 'AnimationKey':
                    p += 1
                    if t[p] != '{': p += 1
                    p += 1; typ = nums(1, int)[0]; k = nums(1, int)[0]; arr = []
                    for _ in range(k):
                        tm = nums(1, int)[0]; c = nums(1, int)[0]; arr.append([tm] + nums(c)); eat_sep()
                    keys[typ] = arr; eat_sep(); assert t[p] == '}', t[p]; p += 1
                else:
                    p += 1
                    if t[p] != '{': p += 1
                    p += 1; skip_block()
            p += 1
            if bone: clip[bone] = keys
        p += 1; clips[name] = clip
    while p < n:
        c = t[p]; p += 1
        if c == 'template': p += 2; skip_block()
        elif c == 'Frame': frame(None)
        elif c == 'Mesh':
            nm = None
            if t[p] != '{': nm = t[p]; p += 1
            p += 1; mesh(nm, None)
        elif c == 'AnimationSet':
            if anims: animset()
            else: p += 2; skip_block()
        elif c == 'AnimTicksPerSecond': p += 1; clips['_tps'] = nums(1, int)[0]; eat_sep(); p += 1
        elif c in ('xof', '0303txt', '0032', 'Header'):
            if c == 'Header': p += 1; skip_block()
    return {'bones': bones, 'meshes': meshes, 'clips': clips}
if __name__ == '__main__':
    r = parse(sys.argv[1]); json.dump(r, open(sys.argv[2], 'w'))
