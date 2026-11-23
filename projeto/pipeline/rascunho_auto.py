#!/usr/bin/env python3
"""Rascunho automático de um episódio: voz provisória (Piper) -> tempos no cfg -> build.py NN rascunho.
Uso: python pipeline/rascunho_auto.py NN
Entrada: audio/nsNN.json (frases), epNN.cfg.js, epNN.js, epNN.ep.json. Saída: out/Video NN - Nome/previa.mp4"""
import sys, os, re, subprocess, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
n = sys.argv[1]
r = subprocess.run([sys.executable, 'pipeline/tts_rascunho.py', n], capture_output=True, text=True)
if r.returncode: sys.exit('ERRO na voz provisória:\n' + r.stderr[-1500:])
m = re.search(r'T: (\[[^\]]*\]) END: ([\d.]+)', r.stdout)
if not m: sys.exit('ERRO: tts_rascunho não devolveu T/END:\n' + r.stdout[-800:])
T, END = json.loads(m.group(1)), float(m.group(2))
cfg = open(f'ep{n}.cfg.js', encoding='utf-8').read()
cfg = re.sub(r'T: \[[^\]]*\], END: [\d.]+', f'T: {json.dumps(T)}, END: {END}', cfg, count=1)
open(f'ep{n}.cfg.js', 'w', encoding='utf-8').write(cfg)
print(f'EP{n}: voz provisória {END:.1f}s, {len(T)} frases')
rc = subprocess.run([sys.executable, 'pipeline/build.py', n, 'fatos', 'audio', 'previa']).returncode
if rc: sys.exit(rc)
subprocess.run([sys.executable, 'pipeline/build.py', n, 'inspecao'])   # relatório de inspeção (não barra a prévia)
