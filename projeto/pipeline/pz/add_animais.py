#!/usr/bin/env python3
"""add_animais.py — animais da B42 COM esqueleto e animações ORIGINAIS do jogo (andar, correr, parado, comer, carinho).
Junta em assets/pz/models.js sem refazer o resto:
  skel['A_cow'|'A_sheep'|'A_hen'|'A_rooster'], mesh['A_cow'...] (malha com pele) e clips 'cow_walk', 'sheep_run', 'hen_idle'...
Uso (na raiz de projeto/):  python pipeline/pz/add_animais.py "<...>/ProjectZomboid/media"
Arquivos usados (pasta media do jogo):
  models_X/Skinned/CowBody.x, Sheep_EweFleece.x, Chicken_Hen.x, Chicken_Cockrel.x
  anims_X/Cow/Cow_*.x, anims_X/Sheep/Sheep_*.x, anims_X/Chicken/Chk_*.x"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__)); import xparse
from convert import skeleton, mesh
from add_clips import clip
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, '..', '..', 'assets', 'pz', 'models.js')
ANIMAIS = {
  'A_cow':     ('CowBody.x',         {'cow_walk': 'Cow/Cow_Walk.x', 'cow_run': 'Cow/Cow_Run.x', 'cow_idle': 'Cow/Cow_Idle01.x', 'cow_eat': 'Cow/Cow_IdleEating01.x', 'cow_pet': 'Cow/Cow_IdlePetting.x'}),
  'A_sheep':   ('Sheep_EweFleece.x', {'sheep_walk': 'Sheep/Sheep_Walk.x', 'sheep_run': 'Sheep/Sheep_Run.x', 'sheep_idle': 'Sheep/Sheep_Idle01.x', 'sheep_eat': 'Sheep/Sheep_IdleEating01.x', 'sheep_pet': 'Sheep/Sheep_IdlePetting.x'}),
  'A_sheared': ('Sheep_EweSheared.x', {}),
  'A_hen':     ('Chicken_Hen.x',     {'hen_walk': 'Chicken/Chk_Walk.x', 'hen_run': 'Chicken/Chk_Run.x', 'hen_idle': 'Chicken/Chk_Idle01.x', 'hen_eat': 'Chicken/Chk_Eating01.x'}),
  'A_rooster': ('Chicken_Cockrel.x', {'rooster_walk': 'Chicken/Chk_Cock_Walk.x', 'rooster_run': 'Chicken/Chk_Cock_Run.x', 'rooster_idle': 'Chicken/Chk_Cock_Idle01.x', 'rooster_eat': 'Chicken/Chk_Cock_Eating01.x'}),
}
if __name__ == '__main__':
    media = sys.argv[1].rstrip('/\\')
    s = open(OUT).read(); M = json.loads(s[s.index('{'):s.rindex('}') + 1]); M.setdefault('clips', {})
    for key, (f, clips) in ANIMAIS.items():
        p = os.path.join(media, 'models_X', 'Skinned', f)
        M['skel'][key] = skeleton(p); M['mesh'][key] = mesh(p)
        m = M['mesh'][key]; print(f"{key:10s} {len(m['pos']) // 3:5d} vértices  {len(m['bones']):3d} ossos  {f}")
        for k, a in clips.items():
            M['clips'][k] = clip(os.path.join(media, 'anims_X', a)); print(f"  clip {k:14s} {M['clips'][k]['n']:4d} quadros  {a}")
    open(OUT, 'w').write('export default ' + json.dumps(M, separators=(',', ':')) + ';\n')
    print('models.js', os.path.getsize(OUT) // 1024, 'KB')
