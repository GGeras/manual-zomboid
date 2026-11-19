#!/usr/bin/env python3
"""Confere a narração antes de montar o vídeo. Uso: python3 pipeline/check_vo.py audio/nNN.mp3 audio/nsNN.json
Avisa: frase bem mais longa que o esperado (voz leu uma tag como "[sério]" ou repetiu), pausa longa, alinhamento ruim."""
import sys, subprocess, re, json
mp3, ns = sys.argv[1], sys.argv[2]
r = subprocess.run([sys.executable, 'tools/align.py', mp3, ns], capture_output=True, text=True).stdout
head = json.loads(r.splitlines()[0]); avisos = []
if head['cost'] > 1.0: avisos.append(f"alinhamento fraco (custo {head['cost']}): conferir os tempos com as pausas do áudio")
if head['maxgap'] > 1.2: avisos.append(f"pausa longa de {head['maxgap']}s no meio da fala")
for l in r.splitlines()[1:]:
    m = re.match(r'\s*([\d.]+)-\s*([\d.]+) det=\s*(\d+) exp=\s*(\d+) (.*)', l)
    if not m: continue
    a, b, det, exp, txt = float(m[1]), float(m[2]), int(m[3]), int(m[4]), m[5]
    if det > exp * 1.4 + 2: avisos.append(f"{a:5.2f}s '{txt[:40]}': {det} sílabas ouvidas para {exp} esperadas -> tag lida em voz alta ou palavra repetida?")
    if b - a > exp * .32 + .8: avisos.append(f"{a:5.2f}s '{txt[:40]}': lenta demais ({b - a:.1f}s)")
print(r.strip()); print('\n' + ('\n'.join('AVISO: ' + x for x in avisos) if avisos else 'Narração OK.'))
