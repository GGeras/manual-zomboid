#!/usr/bin/env python3
"""Render em pedaços (paralelo + à prova de travamento) — Manual Zomboid.

Por quê: o Chrome trava depois de ~900 quadros seguidos (visto no ep13, sempre no mesmo ponto).
Cada pedaço abre um Chrome novo; pedaços rodam em paralelo; pedaço travado é morto e refeito.

Uso:  python3 pipeline/render_par.py ep13.html saida.mp4 [--audio a.wav] [--jobs N] [--chunk 12] [opções do render.mjs...]
Variáveis: RENDER_JOBS (padrão = metade dos núcleos, mín 1), SKILL (pasta do motionmaxxing).
"""
import sys, os, re, json, time, shutil, subprocess, threading, tempfile
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILL = os.environ.get('SKILL', os.path.expanduser('~/.cache/motionmaxxing'))
STALL = 420          # segundos sem progresso = travou
TRIES = 3

def main():
    a = sys.argv[1:]; html, out = a[0], a[1]; rest = a[2:]
    def pop(k, d=None):
        if k in rest: i = rest.index(k); v = rest[i + 1]; del rest[i:i + 2]; return v
        return d
    audio = pop('--audio'); chunk = float(pop('--chunk', '12'))
    jobs = int(pop('--jobs', os.environ.get('RENDER_JOBS', max(1, (os.cpu_count() or 2) // 2))))
    fps = float(rest[rest.index('--fps') + 1]) if '--fps' in rest else 30.0
    dur = duration(html)
    # cortes em quadros inteiros
    nf = round(dur * fps); step = max(1, round(chunk * fps))
    parts = [(s / fps, min(nf, s + step) / fps) for s in range(0, nf, step)]
    tmp = tempfile.mkdtemp(prefix='rpar_', dir=os.path.dirname(os.path.abspath(out)) or '.')
    log = open(os.path.splitext(out)[0] + '.render.log', 'w', encoding='utf-8'); lk = threading.Lock()
    def say(m):
        with lk: log.write(m + '\n'); log.flush(); print(m, flush=True)
    say(f'render em {len(parts)} pedaços de {chunk:.0f}s, {jobs} em paralelo, {dur:.1f}s total')
    t0 = time.time()
    def one(i):
        f0, f1 = parts[i]; seg = os.path.join(tmp, f'p{i:03d}.mp4')
        for k in range(TRIES):
            cmd = ['node', f'{SKILL}/scripts/render.mjs', html, seg, '--from', f'{f0:.6f}', '--to', f'{f1:.6f}'] + rest
            lf = os.path.join(tmp, f'p{i:03d}.log'); fh = open(lf, 'w')
            p = subprocess.Popen(cmd, stdout=fh, stderr=subprocess.STDOUT, cwd=ROOT, **({'creationflags': 0x200} if os.name == 'nt' else {'start_new_session': True}))
            last = time.time(); size = 0
            while p.poll() is None:
                time.sleep(3); s = os.path.getsize(lf)
                if s != size: size, last = s, time.time()
                elif time.time() - last > STALL:
                    say(f'  pedaço {i} travou (tentativa {k + 1}) — reiniciando'); kill(p); break
            fh.close()
            if p.returncode == 0 and os.path.exists(seg): say(f'  pedaço {i + 1}/{len(parts)} ok ({f0:.0f}-{f1:.0f}s)  {time.time() - t0:.0f}s'); return seg
        raise SystemExit(f'ERRO: pedaço {i} falhou {TRIES}x — veja {lf}')
    with ThreadPoolExecutor(jobs) as ex: segs = list(ex.map(one, range(len(parts))))
    lst = os.path.join(tmp, 'lista.txt')
    open(lst, 'w').write(''.join(f"file '{os.path.abspath(s).replace(os.sep, '/')}'\n" for s in segs))
    cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst]
    if audio: cmd += ['-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-af', 'apad', '-t', f'{dur:.3f}']   # nunca -shortest: áudio velho cortaria o vídeo
    subprocess.run(cmd + ['-c:v', 'copy', '-movflags', '+faststart', out], check=True)
    ev = segs[0] + '.events.json'
    if os.path.exists(ev): shutil.copy(ev, out + '.events.json')
    shutil.rmtree(tmp, ignore_errors=True)
    say(f'pronto: {out}  ({time.time() - t0:.0f}s)')

def duration(html):   # igual ao ep-core.js: DUR = (round((END+OFF)*30)+24)/30
    ep = re.search(r'ep(\w+)\.html', html).group(1)
    cfg = open(os.path.join(ROOT, f'ep{ep}.cfg.js'), encoding='utf-8').read()
    END = float(re.search(r'END: ([\d.]+)', cfg).group(1)); m = re.search(r'OFF: ?([\d.]+)', cfg)
    OFF = float(m.group(1)) if m else 0.3
    return (round((END + OFF) * 30) + 24) / 30

def kill(p):   # mata o node e o Chrome filho dele
    try:
        if os.name == 'nt': subprocess.run(['taskkill', '/F', '/T', '/PID', str(p.pid)], capture_output=True)
        else: import signal; os.killpg(os.getpgid(p.pid), signal.SIGKILL)
    except Exception: pass
    try: p.wait(10)
    except Exception: pass

if __name__ == '__main__': main()
