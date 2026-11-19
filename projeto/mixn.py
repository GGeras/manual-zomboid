# mix de episódio: susto (0s) + VO (OFF) + whoosh nos cortes + boom na tela vermelha + drone baixo
import sys, re, json, subprocess, numpy as np
ep, vo, gain_db = sys.argv[1], sys.argv[2], float(sys.argv[3])
SR = 48000
cfg = open(f'ep{ep}.cfg.js').read()
T = json.loads(re.search(r'T: (\[[^\]]*\])', cfg).group(1)); END = float(re.search(r'END: ([\d.]+)', cfg).group(1)); OFF = 1.3
sc = re.findall(r'\{ at: (\d+)(, red: true)?', cfg)
F = [round((t + OFF) * 30) for t in T]; C = lambda i: F[i] - 3
DUR = (round((END + OFF) * 30) + 24) / 30
def load(f):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(r, np.float32).reshape(-1, 2).copy()
N = int(DUR * SR); out = np.zeros((N, 2), np.float32)
def add(x, t, g):
    s = int(t * SR); e = min(N, s + len(x)); out[s:e] += x[:e - s] * g
add(load('audio/scare.wav'), 0, 1.0)
add(load(vo), OFF, 10 ** (gain_db / 20))
W = load('audio/whoosh.wav'); B = load('audio/boom.wav')
for k, (at, red) in enumerate(sc):
    if k == 0: continue
    t = C(int(at)) / 30
    add(W, t - .12, .22)
    if red: add(B, t, .35)
dr = load('audio/drone.wav'); dr = np.tile(dr, (int(np.ceil(N / len(dr))) + 1, 1))[:N]
env = np.clip(np.minimum((np.arange(N) / SR - OFF) / 1.5, (DUR - np.arange(N) / SR) / 1.0), 0, 1)[:, None]
out += dr * env * .10
m = np.abs(out).max()
if m > .95: out *= .95 / m
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', f'audio/mix{ep}n.wav'], input=out.tobytes())
print(ep, 'dur', round(DUR, 2), 'peak', round(float(m), 3))
