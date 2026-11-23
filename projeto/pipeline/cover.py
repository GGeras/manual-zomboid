#!/usr/bin/env python3
"""Capa padrão do canal. Uso: python3 pipeline/cover.py NN "pasta de saída"
Lê "capa" do epNN.ep.json: t (segundo da cena), linhas (3 linhas do título), gancho (selo | pcts | seq), ondas."""
import sys, os, json, subprocess, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
SKILL = os.environ.get('SKILL', os.path.expanduser('~/.cache/motionmaxxing'))
ep, out = sys.argv[1], sys.argv[2]; M = json.load(open(f'ep{ep}.ep.json', encoding='utf-8')); c = M['capa']
COR = {'vermelho': '#ff3d55', 'verde': '#8fe04a', 'amarelo': '#ffb020', 'osso': '#efe5cf'}
cor = lambda v: COR.get(v, v)
W = f'covers/_w{ep}'; shutil.rmtree(W, ignore_errors=True); os.makedirs(W)
# 1) quadro limpo da cena (sem textos da HUD)
html = open(f'ep{ep}.html', encoding='utf-8').read().replace('</head>', '<style>#main > :not(#gl){display:none!important}</style></head>', 1)
open(f'_clean{ep}.html', 'w', encoding='utf-8').write(html)
# opções de capa: o quadro escolhido (capa.t) + 2 alternativas (capa.opcoes ou automáticas: momentos de ação em cenas diferentes)
import re
cfg = open(f'ep{ep}.cfg.js', encoding='utf-8').read(); T = json.loads(re.search(r'T: (\[[^\]]*\])', cfg).group(1))
F = [round((t + 1.3) * 30) for t in T]; C = lambda i: F[i] - 3
when = lambda w: float(w) if isinstance(w, (int, float)) else ((C(w['c']) if 'c' in w else F[w['f']]) / 30 + w.get('dt', 0))
alts = list(c.get('opcoes', []))
if len(alts) < 2:
    acts = sorted({round(when(e[1]) + .15, 2) for e in M.get('sfx', []) if not (len(e) > 3 and 'ate' in e[3]) and when(e[1]) > C(3) / 30})
    for a in acts:
        if len(alts) >= 2: break
        if all(abs(a - x) > 4 for x in [c['t']] + alts): alts.append(a)
times = [c['t']] + alts[:2]
subprocess.run(['node', f'{SKILL}/scripts/render.mjs', f'_clean{ep}.html', '--still', ','.join(str(t) for t in times), W], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
pngs = sorted([f for f in os.listdir(W) if f.endswith('.png')], key=lambda f: float(re.findall(r'[\d.]+', f)[0].rstrip('.'))); os.remove(f'_clean{ep}.html')
order = [min(pngs, key=lambda f: abs(float(re.findall(r'[\d.]+', f)[0].rstrip('.')) - t)) for t in times]
for n, bg in enumerate(order):
    # 2) página da capa
    MAXS = [160, 124, 236]
    title = ''.join(f'<div class="ln" data-max="{(l[2] if len(l) > 2 else MAXS[min(i, 2)])}" style="color:{cor(l[1])}">{l[0]}</div>' for i, l in enumerate(c['linhas']))
    g = c.get('gancho', {}); extra = ''
    if c.get('ondas'): extra += '<div class="waves"><i></i><i></i><i></i></div>'
    if g.get('tipo') == 'selo': extra += f'<div class="badge" style="background:{cor(g.get("cor", "rgba(10,8,8,.82)"))}">{g["texto"]}</div>'
    if g.get('tipo') == 'pcts':
        extra += '<div class="pcts">' + ''.join(f'<span style="color:{cor(k)}">{t}</span>' for t, k in g['itens']) + '</div>'
        if g.get('legenda'): extra += f'<div class="badge sm">{g["legenda"]}</div>'
    if g.get('tipo') == 'seq': extra += '<div class="fresh">' + '<em>→</em>'.join(f'<b style="background:{cor(k)}">{t}</b>' for t, k in g['itens']) + '</div>'
    page = f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../../runtime/fonts.css"><link rel="stylesheet" href="../cover.css"></head><body>
    <div id="c"><div class="bg" style="background-image:url({bg});transform:scale({c.get('zoom', 1.15)});background-position:{c.get('pos', '50% 55%')};filter:brightness({c.get('brilho', 1.12)}) saturate(1.1)"></div>
    <div class="tint" style="background:{c.get('tint', 'rgba(0,0,0,.15)')}"></div><div class="shade"></div>
    <img class="logo" src="../../assets/logo/logo-icone-1x1.png"><div class="ep">EP <b>{ep}</b></div>
    <div class="title">{title}</div>{extra}
    <div class="foot"><img src="../../assets/logo/logo-horizontal-3x1.png"></div></div>
    <script>document.fonts.ready.then(() => {{ document.querySelectorAll('.ln').forEach(e => {{ let s = +e.dataset.max; e.style.fontSize = s + 'px'; while (e.offsetWidth > 1000 && s > 60) e.style.fontSize = (s -= 4) + 'px'; }}); document.body.dataset.ok = 1; }});</script></body></html>'''
    open(f'{W}/cover{n}.html', 'w', encoding='utf-8').write(page)
    js = "const {pathToFileURL}=require('url');let pw;try{pw=require('playwright')}catch(e){pw=require('playwright-core')}const {chromium}=pw;(async()=>{const b=await chromium.launch(process.env.PZ_CHROME?{executablePath:process.env.PZ_CHROME}:{});const p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto(pathToFileURL(process.argv[2]).href);await p.waitForSelector('body[data-ok]');await p.waitForTimeout(300);await p.screenshot({path:process.argv[3]});await b.close();})();"
    open(f'{W}/shot.js', 'w').write(js)
    subprocess.run(['node', f'{W}/shot.js', os.path.abspath(f'{W}/cover{n}.html'), os.path.abspath(f'{W}/capa{n}.png')], check=True)
    from PIL import Image
    Image.open(f'{W}/capa{n}.png').convert('RGB').save(os.path.join(out, 'capa.jpg' if n == 0 else f'capa_opcao{n + 1}.jpg'), quality=92)
    print('capa:', os.path.join(out, 'capa.jpg' if n == 0 else f'capa_opcao{n + 1}.jpg'))
