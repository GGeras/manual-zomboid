#!/usr/bin/env python3
"""fichas.py — gera as fichas de conferência dos modelos do jogo em out/fichas/:
zumbis (frente e costas), personagem principal, veículos e itens (ícones). Rodar depois de mexer em pz.js/assets/pz.
Uso: python3 pipeline/fichas.py [itens: Item_Hammer Item_Nails ...]"""
import subprocess, sys, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT); OUT = 'out/fichas'; os.makedirs(OUT, exist_ok=True)
def shot(q, f, w=1800, h=620): subprocess.run(['node', 'pipeline/shot.mjs', 'pztest.html?' + q, f'{OUT}/{f}', str(w), str(h)], check=True)
shot('z=1&a=0&b=8&v=front&h=3.3&ry=0.45&sp=1.12', 'zumbis_1_frente.png'); shot('z=1&a=8&b=16&v=front&h=3.3&ry=0.45&sp=1.12', 'zumbis_2_frente.png')
shot('z=1&a=0&b=8&v=back&h=3.3&ry=0.45&sp=1.12', 'zumbis_1_costas.png'); shot('z=1&a=8&b=16&v=back&h=3.3&ry=0.45&sp=1.12', 'zumbis_2_costas.png')
shot('me=1&v=front&h=3.2&ry=0.5&sp=1.35', 'personagem.png', 1500, 620); shot('items=1&only=1&v=front&h=1.5', 'itens_3d.png', 900, 420); shot('cars=1&h=10&cry=0.5', 'veiculos.png', 1600, 900); shot('cars=1&h=7&v=front&row=1', 'veiculos_lado.png', 1600, 700)
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + sum([['-i', f'{OUT}/zumbis_{a}_{b}.png'] for a in '12' for b in ('frente', 'costas')], []) + ['-filter_complex', 'vstack=inputs=4', f'{OUT}/zumbis.png'], check=True)
for a in '12':
    for b in ('frente', 'costas'): os.remove(f'{OUT}/zumbis_{a}_{b}.png')
# itens: folha com os ícones pedidos (ou os mais usados)
from PIL import Image, ImageDraw
names = sys.argv[1:] or ['Item_BaseballBat', 'Item_Hammer', 'Item_Nails', 'Item_Plank', 'Item_Garbagebag', 'Item_WaterBottle_Full', 'Item_Pot_Water', 'Item_Petrol', 'Item_Generator', 'Item_ElectronicsScrap', 'Item_Magazine', 'Item_Bandage', 'Item_Axe', 'Item_Crowbar', 'Item_Shotgun', 'Item_ShotgunAmmoBox', 'Item_CanOpener', 'Item_Battery']
idx = set(json.load(open('assets/items/index.json'))); cols = 6; cell = 190
sh = Image.new('RGB', (cols * cell, ((len(names) + cols - 1) // cols) * (cell + 26)), (28, 26, 26)); d = ImageDraw.Draw(sh)
for i, n in enumerate(names):
    x, y = (i % cols) * cell, (i // cols) * (cell + 26)
    if n in idx: im = Image.open(f'assets/items/{n}.png').convert('RGBA').resize((160, 160), Image.NEAREST); sh.paste(im, (x + 15, y + 8), im)
    d.text((x + 8, y + cell - 8), n.replace('Item_', '') + ('' if n in idx else '  (NÃO EXISTE)'), fill=(230, 220, 200) if n in idx else (255, 80, 80))
sh.save(f'{OUT}/itens.png'); print('fichas em', OUT, os.listdir(OUT))
