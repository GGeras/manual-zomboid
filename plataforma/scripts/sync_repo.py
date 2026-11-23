#!/usr/bin/env python3
"""Sincroniza o repo com a Central (Supabase): roteiros/*.md -> episodios, projeto/pipeline/fatos.json -> fatos.

O repo é o dono desses dados; a Central só lê. Só biblioteca padrão.

Uso (na raiz do repo):
  python plataforma/scripts/sync_repo.py --json     # mostra o que seria enviado
  python plataforma/scripts/sync_repo.py --sql      # SQL de upsert (para rodar no SQL Editor ou pelo conector)
  python plataforma/scripts/sync_repo.py            # envia pela API (GitHub Action)
      precisa de SUPABASE_URL e SUPABASE_SECRET_KEY no ambiente (nunca no git)
"""
import os, re, sys, json, glob, subprocess, datetime, urllib.request, urllib.parse

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STATUS = ('rascunho', 'validado', 'aprovado', 'final', 'publicado')


def frontmatter(texto):
    m = re.match(r'---\n(.*?)\n---', texto, re.S)
    return dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M)) if m else None


def lista(v):
    return [x.strip() for x in (v or '').strip().strip('[]').split(',') if x.strip()]


def vazio(v):
    v = (v or '').strip()
    return None if not v or v.startswith('(') else v


def titulo(texto):
    m = re.search(r'^TÍTULO:\s*\n\s*(.+?)\s*$', texto, re.M)
    return m.group(1) if m else None


def episodio(caminho, agora, sha):
    texto = open(caminho, encoding='utf-8').read()
    fm = frontmatter(texto)
    if fm is None:
        raise ValueError(f'{caminho}: sem cabeçalho')
    slug = os.path.basename(caminho)[:-3]
    ep = fm.get('ep', '').strip()
    status = fm.get('status', '').strip()
    if status not in STATUS:
        raise ValueError(f'{caminho}: status "{status}" inválido')
    return {
        'slug': slug,
        'ep': ep,
        'numero': int(ep) if ep.isdigit() else None,
        'serie': 'bases' if slug.startswith('bases-') else 'shorts',
        'tema': fm.get('tema', '').strip() or slug,
        'responsavel': vazio(fm.get('responsavel')),
        'status': status,
        'build': vazio(fm.get('build')),
        'fatos': lista(fm.get('fatos')),
        'titulo': titulo(texto),
        'youtube_id': vazio(fm.get('youtube')),
        'arquivo': os.path.relpath(caminho, RAIZ).replace(os.sep, '/'),
        'commit_sha': sha,
        'sincronizado_em': agora,
    }


def ler(raiz=RAIZ):
    agora = datetime.datetime.now(datetime.timezone.utc).isoformat()
    try:
        sha = subprocess.check_output(['git', '-C', raiz, 'rev-parse', 'HEAD'], text=True).strip()
    except Exception:
        sha = None
    eps = [episodio(p, agora, sha) for p in sorted(glob.glob(os.path.join(raiz, 'roteiros', '*.md')))]
    fj = json.load(open(os.path.join(raiz, 'projeto', 'pipeline', 'fatos.json'), encoding='utf-8'))
    fatos = [{'id': k, 'texto': v.get('texto', ''), 'build': v.get('build'), 'fonte': v.get('fonte'),
              'eps': v.get('eps', [])} for k, v in sorted(fj['fatos'].items())]
    return eps, fatos


def sql(eps, fatos):
    def bloco(tabela, chave, linhas):
        dados = json.dumps(linhas, ensure_ascii=False)
        tag = '$sync$'
        assert tag not in dados
        cols = list(linhas[0].keys())
        sets = ', '.join(f'{c} = excluded.{c}' for c in cols if c != chave)
        chaves = ', '.join(f"'{l[chave]}'" for l in linhas)
        return (f'insert into public.{tabela} ({", ".join(cols)})\n'
                f'select {", ".join(cols)} from jsonb_populate_recordset(null::public.{tabela}, {tag}{dados}{tag}::jsonb)\n'
                f'on conflict ({chave}) do update set {sets};\n'
                f'delete from public.{tabela} where {chave} not in ({chaves});\n')
    return 'begin;\n' + bloco('episodios', 'slug', eps) + bloco('fatos', 'id', fatos) + 'commit;\n'


def enviar(eps, fatos):
    url = os.environ.get('SUPABASE_URL')
    chave = os.environ.get('SUPABASE_SECRET_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    if not url or not chave:
        sys.exit('faltou SUPABASE_URL e SUPABASE_SECRET_KEY no ambiente')
    cab = {'apikey': chave, 'Content-Type': 'application/json'}
    if chave.startswith('eyJ'):  # chave antiga (JWT) também vai no Authorization
        cab['Authorization'] = f'Bearer {chave}'

    def req(metodo, caminho, corpo=None, extra=None):
        r = urllib.request.Request(f'{url.rstrip("/")}/rest/v1/{caminho}', method=metodo,
                                   data=json.dumps(corpo).encode() if corpo is not None else None,
                                   headers={**cab, **(extra or {})})
        with urllib.request.urlopen(r, timeout=30) as resp:
            return resp.status

    for tabela, chave_pk, linhas in (('episodios', 'slug', eps), ('fatos', 'id', fatos)):
        req('POST', f'{tabela}?on_conflict={chave_pk}', linhas, {'Prefer': 'resolution=merge-duplicates,return=minimal'})
        ids = ','.join('"%s"' % l[chave_pk] for l in linhas)
        req('DELETE', f'{tabela}?{chave_pk}=not.in.({urllib.parse.quote(ids, safe=",")})', extra={'Prefer': 'return=minimal'})
        print(f'{tabela}: {len(linhas)} sincronizados')


if __name__ == '__main__':
    eps, fatos = ler()
    if '--json' in sys.argv:
        print(json.dumps({'episodios': eps, 'fatos': fatos}, ensure_ascii=False, indent=1))
    elif '--sql' in sys.argv:
        print(sql(eps, fatos))
    else:
        enviar(eps, fatos)
