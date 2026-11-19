#!/usr/bin/env python3
"""Voz provisória (Piper pt-BR) para rascunho antes do ElevenLabs. Uso: tts_rascunho.py NN  (lê audio/nsNN.json)
Gera audio/nNN.mp3 e imprime T/END para o cfg. Trocar pela voz real depois e refazer os tempos com check_vo.py."""
import sys, json, subprocess, os, wave, tempfile
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
n = int(sys.argv[1]); V = 'tools/voices/pt-br-edresson-low.onnx'
fr = json.load(open(f'audio/ns{n}.json')); tmp = tempfile.mkdtemp(prefix=f'tts{n}_').replace(os.sep, '/'); SIL = f'{tmp}/sil.wav'
T, t, parts = [], 0.0, []
for i, s in enumerate(fr):
    w = f'{tmp}/{i:02d}.wav'
    subprocess.run([sys.executable, '-m', 'piper', '-m', V, '--length-scale', '0.92', '-f', w], input=s.encode(), check=True, capture_output=True)
    d = wave.open(w).getnframes() / wave.open(w).getframerate(); T.append(round(t, 2)); t += d + .35; parts.append(w)
open(f'{tmp}/l.txt', 'w').write(''.join(f"file '{p}'\nfile '{SIL}'\n" for p in parts))
sr = wave.open(parts[0]).getframerate()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'anullsrc=r={sr}:cl=mono', '-t', '0.35', SIL], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{tmp}/l.txt', '-ar', '44100', '-b:a', '160k', f'audio/n{n}.mp3'], check=True)
print('T:', json.dumps(T), 'END:', round(t, 2))
