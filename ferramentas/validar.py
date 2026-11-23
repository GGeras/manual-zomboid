#!/usr/bin/env python3
"""Confere o repositório antes de cada commit e gera projeto/pipeline/fatos.json a partir de info-validada/.

Uso (na raiz do repo):
  python ferramentas/validar.py           confere tudo (erro se o fatos.json estiver desatualizado)
  python ferramentas/validar.py --gerar   regera o fatos.json a partir das tabelas de info-validada/ e confere
"""
import os, re, sys, json, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(RAIZ)
JSON = 'projeto/pipeline/fatos.json'
STATUS = ['rascunho', 'validado', 'aprovado', 'final', 'publicado']
BUILD_OK = re.compile(r'(B?42(\.(2\d|19/B42\.2\d)[\d.]*)?)(\s*\+.*)?|42\.19/B42\.2\d')   # B42, B42.20+, 42.20+ (B42.19 = rascunho)
LFS_EXT = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.wav', '.ogg', '.mp3', '.pdf', '.onnx', '.x', '.fbx', '.glb', '.psd', '.ttf', '.otf', '.woff', '.woff2'}
PROIBIDO = {'.mp4', '.mov', '.mkv', '.avi', '.zip', '.rar', '.7z'}
TEXTO = ('info-validada', 'roteiros', 'rascunho', 'canal', 'referencias', 'videos')
erros, avisos = [], []

def tabelas(path):
    """Linhas das tabelas markdown: devolve listas de células, com o cabeçalho de cada tabela."""
    head, out = None, []
    for ln in open(path, encoding='utf-8'):
        ln = ln.rstrip('\n')
        if not ln.startswith('|'): head = None; continue
        cells = [c.strip().replace('\\|', '|') for c in re.split(r'(?<!\\)\|', ln.strip())[1:-1]]
        if head is None: head = [c.lower() for c in cells]; continue
        if set(''.join(cells)) <= set('-: '): continue
        out.append(dict(zip(head, cells)))
    return out

def ler_validados():
    fatos, nao = {}, {}
    for f in sorted(os.listdir('info-validada')):
        if not f.endswith('.md'): continue
        p = f'info-validada/{f}'
        for row in tabelas(p):
            if f == '_nao-usar.md':
                nao[row['id']] = row.get('o que não dizer', '')
                continue
            if 'id' not in row or 'fato' not in row: continue
            i = row['id']
            if i in fatos: erros.append(f'{p}: id repetido "{i}"')
            if not row.get('fonte'): erros.append(f'{p}: "{i}" sem fonte')
            if not BUILD_OK.fullmatch(row.get('build', '')): erros.append(f'{p}: "{i}" build "{row.get("build")}" não é B42.20+ (mova para rascunho/)')
            fatos[i] = {'texto': row['fato'], 'build': row['build'], 'fonte': row['fonte'],
                        'eps': [e.strip() for e in row.get('usado em', '').split(',') if e.strip()]}
    return fatos, nao

def ids_rascunho():
    ids = set()
    for base, _, files in os.walk('rascunho'):
        for f in files:
            if f.endswith('.md'): ids |= {r['id'] for r in tabelas(os.path.join(base, f)) if 'id' in r}
    return ids

def frontmatter(p):
    t = open(p, encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---', t, re.S)
    return dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M)) if m else None

fatos, nao = ler_validados()
rasc = ids_rascunho()
for i in sorted(set(fatos) & rasc): avisos.append(f'"{i}" está em info-validada E em rascunho: apague de um dos dois')

# fatos.json gerado
novo = {'_ajuda': 'GERADO por ferramentas/validar.py a partir de info-validada/*.md. NÃO edite à mão. Todo roteiro lista em epNN.ep.json -> "fatos" só ids daqui.',
        'fatos': dict(sorted(fatos.items())), 'nao_usar': nao}
atual = json.load(open(JSON, encoding='utf-8')) if os.path.exists(JSON) else None
if '--gerar' in sys.argv:
    json.dump(novo, open(JSON, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(f'gerado: {JSON} ({len(fatos)} fatos, {len(nao)} proibidos)')
elif atual != novo: erros.append(f'{JSON} desatualizado: rode  python ferramentas/validar.py --gerar')

# roteiros
for f in sorted(os.listdir('roteiros')):
    if not f.endswith('.md'): continue
    fm = frontmatter(f'roteiros/{f}')
    if not fm: erros.append(f'roteiros/{f}: sem cabeçalho (--- ep/tema/responsavel/status/fatos ---)'); continue
    st = fm.get('status', '')
    if st not in STATUS: erros.append(f'roteiros/{f}: status "{st}" inválido ({", ".join(STATUS)})')
    if not fm.get('responsavel'): erros.append(f'roteiros/{f}: falta "responsavel"')
    ids = [x.strip() for x in fm.get('fatos', '').strip('[]').split(',') if x.strip()]
    falta = [x for x in ids if x not in fatos]
    if falta and st in ('validado', 'aprovado'): erros.append(f'roteiros/{f} ({st}): fatos fora de info-validada: {falta}')
    elif falta and st in ('final', 'publicado'): avisos.append(f'roteiros/{f} ({st}): usa fatos antigos/rascunho {falta} (ok se já publicado; revalidar antes de reusar)')

# nomes e arquivos
def nome_ok(n):
    if n in ('README.md',) or n.startswith('_'): n = n.lstrip('_')
    return n == 'README.md' or (n == unicodedata.normalize('NFKD', n).encode('ascii', 'ignore').decode() and re.fullmatch(r'[a-z0-9][a-z0-9.-]*', n))
for base in TEXTO:
    for d, dirs, files in os.walk(base):
        for n in dirs + files:
            if not nome_ok(n): erros.append(f'nome fora do padrão: {os.path.join(d, n)} (minúsculas, sem acento/espaço, hífen)')
for d, dirs, files in os.walk('.'):
    dirs[:] = [x for x in dirs if x not in ('.git', 'node_modules', '__pycache__', '.next', '.open-next', '.wrangler')]
    for n in files:
        p = os.path.join(d, n); ext = os.path.splitext(n)[1].lower(); sz = os.path.getsize(p)
        if ext in PROIBIDO: erros.append(f'{p}: vídeo/zip não vai no repo (Drive + videos/LINKS.md)')
        elif sz > 50 * 2**20 and ext not in LFS_EXT: erros.append(f'{p}: {sz >> 20} MB fora do LFS')

for a in avisos: print('AVISO:', a)
for e in erros: print('ERRO:', e)
print(f'{len(fatos)} fatos validados · {len(rasc)} em rascunho · {len(erros)} erro(s) · {len(avisos)} aviso(s)')
sys.exit(1 if erros else 0)
