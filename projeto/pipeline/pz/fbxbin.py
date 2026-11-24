#!/usr/bin/env python3
"""fbxbin.py — lê FBX BINÁRIO do jogo (WorldItems/*.fbx: mochilas e itens no chão) e devolve a mesma geometria do convert.fbx (ASCII).
Só lê: Vertices, PolygonVertexIndex, Normals, UV/UVIndex da primeira Geometry. Uso: from fbxbin import fbx_bin; d = fbx_bin(path, comprimento_m)"""
import struct, zlib, numpy as np

def _nodes(b, off, ver, end):
    out = []
    while off < end:
        if ver >= 7500: eo, np_, pl = struct.unpack_from('<QQQ', b, off); off += 24
        else: eo, np_, pl = struct.unpack_from('<III', b, off); off += 12
        nl = b[off]; off += 1
        if eo == 0: break
        name = b[off:off + nl].decode('latin1'); off += nl; props = []; p = off
        for _ in range(np_):
            t = chr(b[p]); p += 1
            if t in 'YCILFD':
                fmt = {'Y': '<h', 'C': '<?', 'I': '<i', 'L': '<q', 'F': '<f', 'D': '<d'}[t]; props.append(struct.unpack_from(fmt, b, p)[0]); p += struct.calcsize(fmt)
            elif t in 'fdlibc':
                n, enc, cl = struct.unpack_from('<III', b, p); p += 12; raw = b[p:p + cl]; p += cl
                if enc == 1: raw = zlib.decompress(raw)
                dt = {'f': '<f4', 'd': '<f8', 'l': '<i8', 'i': '<i4', 'b': '<i1', 'c': '<u1'}[t]; props.append(np.frombuffer(raw, dt, n))
            elif t in 'SR':
                n = struct.unpack_from('<I', b, p)[0]; p += 4; props.append(b[p:p + n]); p += n
            else: raise ValueError('tipo FBX ' + t)
        kids = _nodes(b, off + pl, ver, eo) if off + pl < eo else []
        out.append((name, props, kids)); off = eo
    return out

def _find(nodes, name):
    for n in nodes:
        if n[0] == name: return n
    return None

def fbx_bin(path, length=None, up_z=None):
    b = open(path, 'rb').read(); assert b[:18] == b'Kaydara FBX Binary', path
    ver = struct.unpack_from('<I', b, 23)[0]; top = _nodes(b, 27, ver, len(b))
    objs = _find(top, 'Objects')[2]; g = _find(objs, 'Geometry')[2]
    V = _find(g, 'Vertices')[1][0].astype(float); PI = _find(g, 'PolygonVertexIndex')[1][0]
    ln = _find(g, 'LayerElementNormal'); N = _find(ln[2], 'Normals')[1][0].astype(float); nmap = bytes(_find(ln[2], 'MappingInformationType')[1][0]).decode()
    lu = _find(g, 'LayerElementUV'); UV = _find(lu[2], 'UV')[1][0].astype(float); ui = _find(lu[2], 'UVIndex'); UI = ui[1][0] if ui else None
    umap = bytes(_find(lu[2], 'MappingInformationType')[1][0]).decode()
    # eixo: os itens do jogo vêm em Z para cima (Blender/3ds) quando a maior extensão vertical está em Z
    P0 = V.reshape(-1, 3); ext0 = P0.max(0) - P0.min(0)
    zup = up_z if up_z is not None else False
    fix = (lambda x, y, z: (x, z, -y)) if zup else (lambda x, y, z: (x, y, z))
    pos, nrm, uv, poly = [], [], [], []
    for k, i in enumerate(PI):
        i = int(i); end = i < 0; vi = -i - 1 if end else i; poly.append((vi, k))
        if end:
            for a in range(1, len(poly) - 1):
                for vi2, k2 in (poly[0], poly[a], poly[a + 1]):
                    pos += fix(*V[vi2 * 3:vi2 * 3 + 3]); nk = k2 if nmap == 'ByPolygonVertex' else vi2; nrm += fix(*N[nk * 3:nk * 3 + 3])
                    u = (int(UI[k2]) if UI is not None else k2) if umap == 'ByPolygonVertex' else vi2; uv += [UV[u * 2], 1 - UV[u * 2 + 1]]
            poly = []
    P = np.array(pos).reshape(-1, 3); mn, mx = P.min(0), P.max(0); c = (mn + mx) / 2; P[:, 0] -= c[0]; P[:, 2] -= c[2]; P[:, 1] -= mn[1]
    ext = mx - mn; k = (length / max(ext)) if length else 1; P *= k
    r4 = lambda a: [round(float(x), 4) for x in a]
    return {'pos': r4(P.flatten()), 'nrm': r4(nrm), 'uv': r4(uv), 'idx': list(range(len(P))), 'tex': None, 'frame': None, 'ext': r4(ext * k)}

if __name__ == '__main__':
    import sys
    for p in sys.argv[1:]:
        d = fbx_bin(p); print(p.split('/')[-1], 'tris', len(d['idx']) // 3, 'ext', d['ext'])
