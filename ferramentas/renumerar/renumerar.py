#!/usr/bin/env python3
"""Renumera EP25-30 para 28-33 e instala os novos EP25-27. Nada é apagado.
Uso: python renumerar.py [--simular]   (fica em ferramentas/renumerar/ dentro do repo)"""
import os, re, sys, glob, shutil, subprocess, time
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(os.path.dirname(AQUI))
NOVOS = os.path.join(AQUI, 'novos'); SIM = '--simular' in sys.argv; os.chdir(RAIZ)
NUMS = range(30, 24, -1)
def padroes(n):
    return [f'projeto/ep{n}.*', f'projeto/audio/n{n}.*', f'projeto/audio/ns{n}.json', f'projeto/audio/final{n}.wav',
            f'projeto/raw{n}.*', f'projeto/log{n}.txt', f'projeto/log{n}_*.txt', f'projeto/out/rascunho{n}.log',
            f'projeto/out/Video {n} - *', f'roteiros/ep{n}-*.md', f'ferramentas/*ep{n}-*', f'ferramentas/*ep{n}.*']
def novo_nome(p, n):
    d, b = os.path.split(p)
    return os.path.join(d, re.sub(rf'(?<!\d){n}(?!\d)', str(n + 3), b, count=1))
def troca(t, n):
    m = str(n + 3)
    t = re.sub(rf'(\b(?:ep|EP|Ep)[ -]?|Episódio |Video |audio/ns?|\bns?|\bfinal|\braw|\blog|\brascunho-ep){n}(?!\d)', lambda g: g.group(1) + m, t)
    t = re.sub(rf'(?m)^(ep: ){n}\b', lambda g: g.group(1) + m, t)
    return re.sub(rf'("num": ")({n})(")', lambda g: g.group(1) + m + g.group(3), t)

if not os.path.isdir('projeto') or not os.path.isdir('roteiros'): sys.exit('ERRO: rode de dentro do repositório (ferramentas/renumerar).')
if glob.glob('roteiros/ep28-tedio*') or glob.glob('roteiros/ep33-*'): sys.exit('Já foi renumerado. Nada a fazer.')
if not glob.glob('roteiros/ep25-tedio*') or glob.glob('roteiros/ep3[123]-*') or glob.glob('projeto/ep3[123].*'): sys.exit('ERRO: estrutura diferente da esperada. Nada foi alterado.')
itens = []
for n in NUMS:
    achados = sorted({p for g in padroes(n) for p in glob.glob(g)})
    itens += [(n, p, novo_nome(p, n)) for p in achados]
destinos = {os.path.normpath(a) for _, a, _ in itens}
for _, a, b in itens:
    if os.path.exists(b) and os.path.normpath(b) not in destinos: sys.exit(f'ERRO: destino já existe: {b}. Nada foi alterado.')
for n, a, b in itens: print(f'{a}  ->  {os.path.basename(b)}')
print(len(itens), 'itens')
if SIM: sys.exit(0)

bkp = f'projeto/out/bkp-renumeracao-{time.strftime("%Y%m%d-%H%M%S")}'
for _, a, _ in itens:
    if os.path.isfile(a) and os.path.getsize(a) < 30 * 2**20:
        os.makedirs(os.path.join(bkp, os.path.dirname(a)), exist_ok=True); shutil.copy2(a, os.path.join(bkp, a))
shutil.copytree('info-validada', os.path.join(bkp, 'info-validada'))
for n, a, b in itens:                      # de 30 para 25: o destino está sempre livre
    os.rename(a, b)
    if os.path.isfile(b) and b.endswith(('.js', '.json', '.html', '.md', '.bat', '.txt', '.py')) and not b.endswith('.events.json'):
        raw = open(b, 'rb').read()
        try: t = raw.decode('utf-8')
        except UnicodeDecodeError: print('AVISO: texto não alterado:', b); continue
        open(b, 'wb').write(troca(t, n).encode('utf-8'))
for f in glob.glob('info-validada/*.md'):  # coluna "usado em"
    linhas = open(f, 'rb').read().decode('utf-8').split('\n')
    for i, l in enumerate(linhas):
        c = l.split('|')
        if l.startswith('|') and len(c) >= 7:
            c[-2] = re.sub(r'(?<![\d.])(2[5-9]|30)(?![\d.])', lambda g: str(int(g.group(1)) + 3), c[-2]); linhas[i] = '|'.join(c)
    open(f, 'wb').write('\n'.join(linhas).encode('utf-8'))
for d, _, arqs in os.walk(NOVOS):
    for x in arqs:
        o = os.path.join(d, x); dst = os.path.relpath(o, NOVOS)
        if os.path.exists(dst): print('AVISO: já existe, não sobrescrevi:', dst); continue
        os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.move(o, dst); print('novo:', dst)
r = subprocess.run([sys.executable, 'ferramentas/validar.py', '--gerar'], env=dict(os.environ, PYTHONUTF8='1'))
print('\nPRONTO. Cópia de segurança em', bkp, '| validar.py:', 'ok' if r.returncode == 0 else 'ver erros acima')
