#!/usr/bin/env python3
"""Monta o resumo de uma atualização do GitHub para o canal #atualizações-projeto.

Uso (na raiz do repo, logo depois do push na main):
  python ferramentas/resumo_push.py BASE..HEAD                  # BASE = origin/main ANTES do push
  python ferramentas/resumo_push.py BASE..HEAD --webhook        # JSON {"text": ...} para webhook do Slack (GitHub Action)
  python ferramentas/resumo_push.py --pr 12                     # aviso curto de PR aberto (precisa do gh)

Cada commit vira um item: "o que" = assunto do commit; "por quê" = linha "Por quê: ..." do corpo do commit.
"""
import os, re, sys, json, subprocess
from collections import Counter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(RAIZ)
CFG = json.load(open('ferramentas/automacao.json', encoding='utf-8'))
URL = CFG['github']
git = lambda *a: subprocess.check_output(['git', *a], text=True, encoding='utf-8').strip()

def pr(num):
    d = json.loads(subprocess.check_output(['gh', 'pr', 'view', str(num), '--json', 'title,url,author,body'], text=True))
    pq = re.search(r'(?im)^\s*por qu[eê]\s*:\s*(.+)$', d.get('body') or '')
    print(f"🔀 **PR aberto** · {d['title']} · por {d['author']['login']}\n"
          + (f"• Por quê: {pq.group(1).strip()}\n" if pq else '') + f"• Revisar: [{d['url']}]({d['url']})")

def resumo(rng, webhook=False):
    sep = '\x1e'
    log = git('log', '--no-merges', f'--format=%H%x1f%an%x1f%s%x1f%b{sep}', rng)
    commits = [c.strip('\n').split('\x1f') for c in log.split(sep) if c.strip()]
    if not commits: print('(nenhum commit novo)'); return
    autores = sorted({c[1] for c in commits})
    files = [l for l in git('diff', '--name-only', rng.replace('..', '...', 1) if '...' not in rng else rng).splitlines() if l]
    areas = Counter(f.split('/')[0] if '/' in f else 'raiz' for f in files)
    b, h = rng.split('..')[0], rng.split('..')[-1]
    comp = f"{URL}/compare/{git('rev-parse', '--short', b)}...{git('rev-parse', '--short', h)}"
    B = (lambda s: f'*{s}*') if webhook else (lambda s: f'**{s}**')
    link = (lambda t, u: f'<{u}|{t}>') if webhook else (lambda t, u: f'[{t}]({u})')
    linhas = [f"🔧 {B('Atualização no GitHub')} · {', '.join(autores)} · {len(commits)} commit(s) na main"]
    for _, _, assunto, corpo in commits[:8]:
        pq = re.search(r'(?im)^\s*por qu[eê]\s*:\s*(.+)$', corpo or '')
        linhas.append(f"• {assunto}" + (f" — _{pq.group(1).strip()}_" if pq else ' — _(sem "Por quê:" no commit)_'))
    if len(commits) > 8: linhas.append(f'• … e mais {len(commits) - 8} commit(s)')
    linhas.append('📁 ' + ' · '.join(f'{k} {v}' for k, v in areas.most_common()) + f" · {link('ver diferenças', comp)}")
    txt = '\n'.join(linhas)
    print(json.dumps({'text': txt}, ensure_ascii=False) if webhook else txt)

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a or a[0] in ('-h', '--help'): print(__doc__)
    elif a[0] == '--pr': pr(a[1])
    else: resumo(a[0], '--webhook' in a)
