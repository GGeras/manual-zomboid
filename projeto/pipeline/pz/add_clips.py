#!/usr/bin/env python3
"""add_clips.py — junta animações ORIGINAIS do jogo (.x de media/anims_X) em assets/pz/models.js sem refazer o resto.
Uso (na raiz do repo):  python pipeline/pz/add_clips.py "<...>/ProjectZomboid/media"   [--todos = refaz os que já existem]
Lê a seção "clips" de pipeline/pz/lista.json. Cada clip: "nome": "Zombie_Walk.x" (pasta Zombie) ou "Bob/Bob_IdleReadBook.x"."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__)); import xparse
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '..', '..', 'assets', 'pz', 'models.js')
r4 = lambda a: [round(float(x), 4) for x in a]
def clip(path):
    r = xparse.parse(path, anims=True); c = [v for n, v in r['clips'].items() if n != '_tps'][0]; out = {}; nf = 1
    for bn, keys in c.items():
        if bn in ('Translation_Data',) or 0 not in keys: continue
        R = keys[0]; T = keys.get(2, []); nf = max(nf, len(R), len(T))
        out[bn] = {'r': r4(sum([[q[2], q[3], q[4], q[1]] for q in R], [])), 't': r4(sum([t[1:4] for t in T], []))}
    return {'n': nf, 'b': out}
if __name__ == '__main__':
    media = sys.argv[1]; L = json.load(open(os.path.join(HERE, 'lista.json'), encoding='utf-8'))
    s = open(OUT).read(); M = json.loads(s[s.index('{'):s.rindex('}') + 1]); M.setdefault('clips', {})
    for k, f in L.get('clips', {}).items():
        if k in M['clips'] and '--todos' not in sys.argv: continue
        M['clips'][k] = clip(os.path.join(media, 'anims_X', f if '/' in f else 'Zombie/' + f)); print(f"clip {k:16s} {M['clips'][k]['n']:4d} quadros  {f}")
    open(OUT, 'w').write('export default ' + json.dumps(M, separators=(',', ':')) + ';\n')
    print('models.js', os.path.getsize(OUT) // 1024, 'KB ·', len(M['clips']), 'clips')
