#!/usr/bin/env python3
"""convert.py — converte os modelos do jogo (.x) em assets/pz/models.js (esqueletos + malhas com pele) e as texturas em assets/pz/tex.js.
Fonte: pasta media do Project Zomboid copiada em SRC. Rodar de novo sempre que adicionar modelos/texturas em LISTA."""
import sys, os, json, base64, numpy as np
sys.path.insert(0, os.path.dirname(__file__)); import xparse
# SRC = pasta com a cópia da mídia do jogo: <SRC>/media/models_X/... e <SRC>/textures/... (como chega pelo PC do Jose)
SRC = os.environ.get('PZ_SRC', '/mnt/user-data/uploads'); MX = SRC + '/media/models_X'; OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'assets', 'pz')
r4 = lambda a: [round(float(x), 4) for x in a]
def skeleton(path):
    r = xparse.parse(path); B = {b['name']: b for b in r['bones']}; m = r['meshes'][0]
    off = {s['bone']: np.array(s['offset']).reshape(4, 4) for s in m['skin']}; W = {}
    def world(n):
        if n in W: return W[n]
        b = B[n]
        if n in off: W[n] = np.linalg.inv(off[n])
        else:
            L = np.array(b['m']).reshape(4, 4); W[n] = L @ world(b['parent']) if b['parent'] else L
        return W[n]
    out = []
    for b in r['bones']:
        if b['name'] in ('Translation_Data', 'Body'): continue
        w = world(b['name']); p = b['parent']; loc = w @ np.linalg.inv(world(p)) if p else w
        out.append({'n': b['name'], 'p': p, 'm': r4(loc.flatten())})
    return out
def mesh(path, static=False):
    r = xparse.parse(path); out = []
    for m in r['meshes']:
        nv = len(m['pos']) // 3; idx = []
        for f in m['faces']:
            for k in range(1, len(f) - 1): idx += [f[0], f[k], f[k + 1]]
        d = {'pos': r4(m['pos']), 'uv': r4(m['uv']) if m['uv'] else None, 'idx': idx}
        if m['nrm'] and len(m['nrm']) == len(m['pos']): d['nrm'] = r4(m['nrm'])
        if m['skin'] and not static:
            names = [s['bone'] for s in m['skin']]; acc = [[] for _ in range(nv)]
            for bi, s in enumerate(m['skin']):
                for i, w in zip(s['idx'], s['w']): acc[i].append((w, bi))
            si = []; sw = []
            for a in acc:
                a = sorted(a, reverse=True)[:4]; t = sum(w for w, _ in a) or 1
                a += [(0, 0)] * (4 - len(a)); si += [b for _, b in a]; sw += [round(w / t, 3) for w, _ in a]
            d.update({'bones': names, 'inv': [r4(s['offset']) for s in m['skin']], 'si': si, 'sw': sw})
        else:
            B = {b['name']: b for b in r['bones']}; M = np.eye(4); n = m['frame']
            while n: M = M @ np.array(B[n]['m']).reshape(4, 4); n = B[n]['parent']
            d['frame'] = r4(M.flatten())
        d['tex'] = m['tex']; out.append(d)
    return out[0] if len(out) == 1 else out
def fbx(path, length=None):
    """FBX ASCII (veículos): uma malha, normais e UV por vértice de polígono. Devolve geometria sem índice, Y para cima."""
    import re
    t = open(path, encoding='latin1').read()
    def arr(name, start=0):
        m = re.compile(r'\b' + name + r': \*\d+ \{\s*a: ([^}]*)\}').search(t, start); return [float(x) for x in m.group(1).replace('\n', '').split(',')], m.end()
    V, e = arr('Vertices'); PI, e = arr('PolygonVertexIndex', e); N, e = arr('Normals', e); UV, e = arr('UV', e); UI, e = arr('UVIndex', e)
    pre = re.search(r'"PreRotation"[^\n]*"",([-\d.e]+),', t[t.index('Model::'):]); zup = pre and abs(float(pre.group(1)) + 90) < 1
    fix = (lambda x, y, z: (x, z, -y)) if zup else (lambda x, y, z: (x, y, z))
    pos = []; nrm = []; uv = []; poly = []
    for k, i in enumerate(PI):
        i = int(i); end = i < 0; vi = -i - 1 if end else i; poly.append((vi, k))
        if end:
            for a in range(1, len(poly) - 1):
                for vi2, k2 in (poly[0], poly[a], poly[a + 1]):
                    pos += fix(*V[vi2 * 3:vi2 * 3 + 3]); nrm += fix(*N[k2 * 3:k2 * 3 + 3]); u = int(UI[k2]); uv += [UV[u * 2], 1 - UV[u * 2 + 1]]
            poly = []
    P = np.array(pos).reshape(-1, 3); mn, mx = P.min(0), P.max(0); c = (mn + mx) / 2; P[:, 0] -= c[0]; P[:, 2] -= c[2]; P[:, 1] -= mn[1]
    ext = mx - mn; k = (length / max(ext[0], ext[2])) if length else 1; P *= k
    return {'pos': r4(P.flatten()), 'nrm': r4(nrm), 'uv': r4(uv), 'idx': list(range(len(P))), 'tex': None, 'frame': None, 'ext': r4(ext * k)}
if __name__ == '__main__':
    L = json.load(open(os.path.join(os.path.dirname(__file__), 'lista.json')))
    models = {'skel': {k: skeleton(MX + '/' + v) for k, v in L['skel'].items()}, 'mesh': {}}
    for k, v in L['mesh'].items():
        st = isinstance(v, list); models['mesh'][k] = mesh(MX + '/' + (v[0] if st else v), static=st)
        mm = models['mesh'][k]; mm = mm if isinstance(mm, dict) else mm[0]
        print(f"{k:22s} verts {len(mm['pos'])//3:5d} tris {len(mm['idx'])//3:5d} bones {len(mm.get('bones', []))} tex {mm['tex']}")
    for k, (f, ln) in L.get('fbx', {}).items():
        models['mesh'][k] = fbx(MX + '/' + f, ln); print(f"{k:22s} tris {len(models['mesh'][k]['idx'])//3:5d} tamanho {models['mesh'][k]['ext']}")
    models['clips'] = {}
    for k, f in L.get('clips', {}).items():
        r = xparse.parse(SRC + '/media/anims_X/Zombie/' + f, anims=True); c = [v for n, v in r['clips'].items() if n != '_tps'][0]; out = {}; nf = 1
        for bn, keys in c.items():
            if bn in ('Translation_Data',) or 0 not in keys: continue
            R = keys[0]; T = keys.get(2, []); nf = max(nf, len(R), len(T))
            out[bn] = {'r': r4(sum([[q[2], q[3], q[4], q[1]] for q in R], [])), 't': r4(sum([t[1:4] for t in T], []))}   # r: x,y,z,w
        models['clips'][k] = {'n': nf, 'b': out}; print(f"clip {k:12s} {nf} quadros, {len(out)} ossos")
    open(OUT + '/models.js', 'w').write('export default ' + json.dumps(models, separators=(',', ':')) + ';\n')
    tex = {}
    for k, v in L['tex'].items(): tex[k] = 'data:image/png;base64,' + base64.b64encode(open(SRC + '/' + v, 'rb').read()).decode()
    open(OUT + '/tex.js', 'w').write('export default ' + json.dumps(tex, separators=(',', ':')) + ';\n')
    print('models.js', os.path.getsize(OUT + '/models.js') // 1024, 'KB | tex.js', os.path.getsize(OUT + '/tex.js') // 1024, 'KB |', len(tex), 'texturas')
