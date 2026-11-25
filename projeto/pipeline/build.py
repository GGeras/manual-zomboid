#!/usr/bin/env python3
"""Manual Zomboid — pipeline de episódio (um comando faz tudo).

Uso:  python3 pipeline/build.py NN [etapas...]
Fluxo recomendado:  1) build.py NN rascunho   (fatos + áudio + inspeção + prévia ~5 min)  ->  Jose aprova  ->  2) build.py NN
Etapas (padrão = todas, nesta ordem):
  fatos   confere os fatos do jogo usados (pipeline/fatos.json)
  audio   susto + narração + transições + música ambiente + sons do jogo  -> audio/finalNN.wav
  render  renderiza a animação (epNN.html)                                 -> rawNN.mp4   (~25 min)
  final   logo (abertura, canto, cartão final) + áudio                     -> out/Video NN - Nome/video.mp4
  check   confere duração, áudio e quadros                                 (look.py)
  capa    quadro limpo da cena + título + gancho + logo                    -> capa.jpg
  post    título e descrições para YouTube, Reels e TikTok + roteiro       -> instrucoes.txt

Entrada: epNN.ep.json (manifesto), epNN.cfg.js, epNN.js, narração em audio/.
"""
import sys, os, re, json, glob, subprocess, shutil
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
SKILL = os.environ.get('SKILL', os.path.expanduser('~/.cache/motionmaxxing'))
SR, FPS, OFF, TAIL = 48000, 30, 1.3, 2.2
ep = sys.argv[1]; stages = sys.argv[2:] or ['fatos', 'audio', 'render', 'final', 'check', 'capa', 'post']
MAN = json.load(open(f'ep{ep}.ep.json', encoding='utf-8'))
cfg = open(f'ep{ep}.cfg.js', encoding='utf-8').read()
T = json.loads(re.search(r'T: (\[[^\]]*\])', cfg).group(1)); END = float(re.search(r'END: ([\d.]+)', cfg).group(1))
SC = re.findall(r'\{ at: (\d+)(, red: true)?', cfg)
F = [round((t + OFF) * FPS) for t in T]; C = lambda i: F[i] - 3
_cd = re.search(r'cauda: (\d+)', cfg); CAUDA = int(_cd.group(1)) if _cd else 24   # quadros depois da última fala (EP.cauda no cfg)
DUR = (round((END + OFF) * FPS) + CAUDA) / FPS; TOTAL = DUR + TAIL
OUT = f'out/Video {ep} - {MAN["nome"]}'; os.makedirs(OUT, exist_ok=True)
run = lambda *a, **k: subprocess.run(list(a), check=True, **k)
db = lambda g: 10 ** (g / 20)

def load(f):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(r, np.float32).reshape(-1, 2).copy()
def find(folder, name):
    hits = [p for p in glob.glob(f'assets/{folder}/**/*', recursive=True) if os.path.splitext(os.path.basename(p))[0].lower() == name.lower()]
    if not hits:
        # rascunho num PC sem os sons novos do personagem (PZ_FALTA_SOM_OK=1, ligado pelo .bat): segue sem o som e avisa. No final nunca.
        if folder == 'sfx' and os.environ.get('PZ_FALTA_SOM_OK') == '1': print(f'AVISO: som "{name}" não está em assets/sfx — rascunho segue SEM ele'); return None
        sys.exit(f'ERRO: "{name}" não existe em assets/{folder} (veja o índice na pasta de referências)')
    return sorted(hits, key=lambda p: p.endswith('.ogg'))[0]
def when(t):  # número = segundos no vídeo final | {"c": i, "dt": s} = corte da frase i | {"f": i, "dt": s} = início da frase i
    if isinstance(t, (int, float)): return float(t)
    return (C(t['c']) if 'c' in t else F[t['f']]) / FPS + t.get('dt', 0)

def st_audio():
    N = int(TOTAL * SR); z = lambda: np.zeros((N, 2), np.float32)
    def put(buf, x, t, g=1.0):
        s = int(t * SR); e = min(N, s + len(x))
        if s < N and e > s: buf[s:e] += x[:e - s] * g
    base, vo, sfx, mus = z(), z(), z(), z()
    put(base, load('assets/base/scare.wav'), 0)
    put(vo, load(MAN['vo']), OFF, db(MAN.get('vo_db', 0)))
    W, B = load('assets/base/whoosh.wav'), load('assets/base/boom.wav')
    for k, (at, red) in enumerate(SC):
        if k == 0: continue
        t = C(int(at)) / FPS; put(base, W, t - .12, .22)
        if red: put(base, B, t, .35)
    put(base, B, DUR, .32)                                    # batida do cartão final
    CUTS_S = [C(int(at)) / FPS for k, (at, red) in enumerate(SC) if k]
    REL = []; ns = MAN['vo'].replace('audio/n', 'audio/ns').rsplit('.', 1)[0] + '.json'; FRASES = json.load(open(ns, encoding='utf-8')) if os.path.exists(ns) else []
    for e in MAN.get('sfx', []):                               # ["nome", tempo, dB, {opções}]
        fp = find('sfx', e[0])
        if fp is None: continue
        x = load(fp); x /= (np.abs(x).max() + 1e-9); t = when(e[1]); o = e[3] if len(e) > 3 else {}
        if 'trim' in o: x = x[int(o['trim'][0] * SR):int(o['trim'][1] * SR)]
        if 'ate' in o:                                         # repete em loop até o tempo "ate"
            L = max(1, int((when(o['ate']) - t) * SR)); x = np.tile(x, (L // len(x) + 2, 1))[:L]
        elif not o.get('livre'):                               # trava de segurança: som não atravessa a troca de cena (use "livre": true para permitir)
            nxt = min([c for c in CUTS_S if c > t + .05] + [TOTAL]); L = int((nxt - t + .12) * SR)
            if len(x) > L: x = x[:L]; o = dict(o, fout=max(o.get('fout', .05), .25))
        x = x.copy(); fi, fo = int(o.get('fin', .01) * SR), int(o.get('fout', .05) * SR)
        if fi: x[:fi] *= np.linspace(0, 1, fi)[:, None]
        if fo and fo < len(x): x[-fo:] *= np.linspace(1, 0, fo)[:, None]
        put(sfx, x, t, db(e[2]))
        k = max([i for i, (at, red) in enumerate(SC) if C(int(at)) / FPS <= t] or [0]); fr = max([i for i in range(len(T)) if F[i] / FPS <= t + .05] or [0])
        REL.append(f'{t:6.2f}s  cena {k:<2} frase {fr:<2}  {e[0]:<26} {e[2]:>4} dB  {len(x) / SR:4.1f}s   "{FRASES[fr][:44] if fr < len(FRASES) else ""}"')
    open(f'{OUT}/sons.txt', 'w', encoding='utf-8').write('SONS DO JOGO — quando toca, em qual cena e frase\n\n' + '\n'.join(REL) + '\n')
    apr = json.load(open('assets/music/aprovadas.json', encoding='utf-8')) if os.path.exists('assets/music/aprovadas.json') else {}
    if MAN.get('musica') and apr.get(MAN['musica'], {}).get('status') != 'aprovada': print(f'AVISO: música "{MAN["musica"]}" ainda não foi ouvida/aprovada pelo Jose (assets/music/aprovadas.json)')
    if MAN.get('musica'):                                      # cama de música ambiente do jogo, nivelada e abaixo da voz
        idx = json.load(open('assets/music/index.json')); name = MAN['musica']
        x = load(find('music', name)); x = x[int(MAN.get('musica_inicio', 0) * SR):]
        g = db(MAN.get('musica_lufs', -30) - idx[name]['lufs'])
        L = N - int(OFF * SR); x = np.tile(x, (L // len(x) + 2, 1))[:L].copy()
        fi, fo = int(1.5 * SR), int(1.8 * SR); x[:fi] *= np.linspace(0, 1, fi)[:, None]; x[-fo:] *= np.linspace(1, 0, fo)[:, None]
        put(mus, x, OFF, g)
    else:
        d = load('assets/base/drone.wav'); d = np.tile(d, (N // len(d) + 2, 1))[:N]
        tt = np.arange(N) / SR; mus = d * (np.clip(np.minimum((tt - OFF) / 1.5, (TOTAL - tt) / 1.0), 0, 1)[:, None] * .10)
    env = np.abs(vo).max(1); k = int(.12 * SR); env = np.convolve(env, np.ones(k) / k, 'same'); talk = np.clip((env - .02) / .12, 0, 1)
    mix = base + vo + sfx * (1 - talk * .55)[:, None] + mus * (1 - talk * .40)[:, None]
    m = float(np.abs(mix).max())
    if m > .95: mix *= .95 / m
    tmp = f'audio/_pre{ep}.wav'
    run('ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', tmp, input=mix.astype(np.float32).tobytes())
    lufs = lambda f: float(re.findall(r'I:\s+(-?[\d.]+) LUFS', subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr)[-1])
    g = MAN.get('alvo_lufs', -14) - lufs(tmp)                  # volume padrão das plataformas (-14 LUFS), com limitador
    run('ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'volume={g:.2f}dB,alimiter=limit=0.84:level=false', '-ar', str(SR), f'audio/final{ep}.wav'); os.remove(tmp)
    print(f'audio: {TOTAL:.2f}s  volume final {lufs(f"audio/final{ep}.wav"):.1f} LUFS (ganho {g:+.1f} dB)  música={MAN.get("musica") or "drone"}  sons={len(MAN.get("sfx", []))}')

def st_render():
    run(sys.executable, 'pipeline/render_par.py', f'ep{ep}.html', f'raw{ep}.mp4', '--preset', 'medium', '--crf', '17', '--grain', '0.025',
        stdout=open(f'log{ep}.txt', 'w'), stderr=subprocess.STDOUT)
    print('render: ok')

def st_previa():   # rascunho rápido (meia resolução, 15 fps) para aprovar antes do render final
    run(sys.executable, 'pipeline/render_par.py', f'ep{ep}.html', f'{OUT}/previa.mp4', '--scale', '0.5', '--fps', '15', '--preset', 'veryfast', '--crf', '28',
        '--audio', f'audio/final{ep}.wav', stdout=open(f'log{ep}_previa.txt', 'w'), stderr=subprocess.STDOUT)
    print('prévia:', f'{OUT}/previa.mp4')

def st_inspecao():
    run('node', 'pipeline/inspect.mjs', ep)

def st_fatos():   # todo episódio novo precisa dizer quais fatos do jogo usa (pipeline/fatos.json) e de onde vieram
    base = json.load(open('pipeline/fatos.json', encoding='utf-8')); ids = MAN.get('fatos', [])
    falta = [i for i in ids if i not in base['fatos']]
    if not ids: print('AVISO: manifesto sem "fatos" (ids de pipeline/fatos.json) — confira as regras do roteiro antes de gerar a voz')
    if falta: sys.exit(f'ERRO: fatos sem cadastro/fonte em pipeline/fatos.json: {falta}')
    for i in ids: f = base['fatos'][i]; print(f'  fato {i}: {f["texto"]}  [{f["build"]}]  fonte: {f["fonte"]}')
    # fidelidade visual: episódio novo usa os modelos do jogo (EP.pz) e todo item citado usa o ícone original
    import re
    cfg = open(f'ep{ep}.cfg.js', encoding='utf-8').read() if os.path.exists(f'ep{ep}.cfg.js') else ''; js = open(f'ep{ep}.js', encoding='utf-8').read() if os.path.exists(f'ep{ep}.js') else ''
    if int(ep) >= 11 and not re.search(r'\bpz:\s*true', cfg): print('AVISO: cfg sem "pz: true" — personagens, zumbis e veículos devem ser os modelos do jogo (pz.js)')
    idx = set(json.load(open('assets/items/index.json'))) if os.path.exists('assets/items/index.json') else set()
    usados = sorted(set(re.findall(r"Item_\w+", cfg + js))); ruins = [n for n in usados if idx and n not in idx]
    if ruins: sys.exit(f'ERRO: ícone de item não existe em assets/items: {ruins} (procure o nome certo em assets/items/index.json)')
    decl = re.search(r'itens:\s*\[([^\]]*)\]', cfg); decl = set(re.findall(r"Item_\w+", decl.group(1))) if decl else set()
    falta3d = [n for n in set(re.findall(r"icon3d\(\s*['\"](Item_\w+)", js)) if n not in decl]
    if falta3d: sys.exit(f'ERRO: ícones usados na cena 3D precisam estar em EP.itens no cfg: {falta3d}')
    if usados: print('  itens do jogo:', ', '.join(usados))

def st_final():
    if not os.path.isdir('assets/logo/intro'): run(sys.executable, 'pipeline/logo_frames.py')
    if os.path.exists(f'{OUT}/video.mp4'):                    # guarda a versão anterior (nunca sobrescreve)
        os.makedirs(f'{OUT}/versoes', exist_ok=True); n = len(os.listdir(f'{OUT}/versoes')) + 1; shutil.move(f'{OUT}/video.mp4', f'{OUT}/versoes/video_v{n}.mp4')
    D = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'raw{ep}.mp4']))
    fc = (f"[0:v]tpad=stop_mode=clone:stop_duration={TAIL}[v0];[v0][1:v]overlay=36:36:enable='between(t,{OFF},{D})'[v1];"
          "[v1][3:v]overlay=eof_action=pass[v2];[v2][2:v]overlay=eof_action=pass,format=yuv420p[v]")
    run('ffmpeg', '-loglevel', 'error', '-y', '-i', f'raw{ep}.mp4', '-i', 'assets/logo/icone-132.png',
        '-framerate', '30', '-itsoffset', str(D), '-i', 'assets/logo/outro/%03d.png',
        '-framerate', '30', '-itsoffset', '0.78', '-i', 'assets/logo/intro/%03d.png', '-i', f'audio/final{ep}.wav',
        '-filter_complex', fc, '-map', '[v]', '-map', '4:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-r', '30',
        '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', f'{OUT}/video.mp4')
    print('final:', f'{OUT}/video.mp4')

def st_check():
    r = subprocess.run([sys.executable, f'{SKILL}/scripts/look.py', f'{OUT}/video.mp4', '--expect', f'{TOTAL:.2f}', '--expect-audio'], capture_output=True, text=True)
    print('\n'.join((r.stdout + r.stderr).strip().splitlines()[-9:]))

def st_capa():
    run(sys.executable, 'pipeline/cover.py', ep, OUT)

def st_post():
    run(sys.executable, 'pipeline/post.py', ep, OUT)

ST = {'fatos': st_fatos, 'audio': st_audio, 'previa': st_previa, 'inspecao': st_inspecao, 'render': st_render, 'final': st_final, 'check': st_check, 'capa': st_capa, 'post': st_post}
if stages == ['rascunho']: stages = ['fatos', 'audio', 'inspecao', 'previa']   # passo 1: conferir antes de gastar 25 min de render
for s in stages: ST[s]()
