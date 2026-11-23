#!/usr/bin/env python3
"""add_meshes.py — junta malhas e texturas ORIGINAIS do jogo em assets/pz/models.js e tex.js sem refazer o resto.
Uso (na raiz do repo):  python pipeline/pz/add_meshes.py "<...>/ProjectZomboid/media"   [--todos = refaz as que já existem]
Lê as seções "mesh" e "tex" de pipeline/pz/lista.json (malha estática = lista com 1 caminho, ex.: ["Blowtorch.x"])."""
import sys, os, json, base64
sys.path.insert(0, os.path.dirname(__file__)); import convert
HERE = os.path.dirname(os.path.abspath(__file__)); PZ = os.path.join(HERE, '..', '..', 'assets', 'pz')
def load(p): s = open(p).read(); return json.loads(s[s.index('{'):s.rindex('}') + 1])
def save(p, d): open(p, 'w').write('export default ' + json.dumps(d, separators=(',', ':')) + ';\n')
if __name__ == '__main__':
    media = sys.argv[1]; L = json.load(open(os.path.join(HERE, 'lista.json'), encoding='utf-8')); todos = '--todos' in sys.argv
    M = load(os.path.join(PZ, 'models.js')); T = load(os.path.join(PZ, 'tex.js'))
    for k, v in L['mesh'].items():
        if k in M['mesh'] and not todos: continue
        st = isinstance(v, list); M['mesh'][k] = convert.mesh(os.path.join(media, 'models_X', v[0] if st else v), static=st); print('malha', k)
    for k, v in L['tex'].items():
        if k in T and not todos: continue
        T[k] = 'data:image/png;base64,' + base64.b64encode(open(os.path.join(media, v), 'rb').read()).decode(); print('textura', k)   # v = 'textures/...' (dentro de media)
    save(os.path.join(PZ, 'models.js'), M); save(os.path.join(PZ, 'tex.js'), T)
    print('models.js', os.path.getsize(os.path.join(PZ, 'models.js')) // 1024, 'KB · tex.js', os.path.getsize(os.path.join(PZ, 'tex.js')) // 1024, 'KB')
