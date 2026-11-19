#!/usr/bin/env python3
"""Publica um rascunho (prévia) ou um vídeo final no Google Drive PESSOAL e prepara o aviso do Slack.

Uso (na raiz do repo):
  python ferramentas/publicar.py --configurar [--pessoa jose] [--modo drive_desktop|rclone] [--pasta "G:/Meu Drive"] [--remote gdrive:]
  python ferramentas/publicar.py 16 previa      depois de  build.py 16 rascunho
  python ferramentas/publicar.py 16 final       depois de  build.py 16

Modos de envio (escolha um por pessoa, em ferramentas/automacao.local.json):
  drive_desktop  copia para a pasta do Google Drive para computador ("Meu Drive"). O Claude compartilha pelo conector
                 do Google Drive (qualquer pessoa com o link: leitor) e posta o link pelo conector do Slack.
  rclone         envia com o rclone e já cria o link público (rclone link). O Claude só posta no Slack.

Saída: JSON com arquivos, nomes no Drive, links (se houver), canal do Slack e a mensagem pronta (troque {LINK_*}).
"""
import os, re, sys, json, glob, shutil, string, subprocess, datetime, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(RAIZ)
CFG = json.load(open('ferramentas/automacao.json', encoding='utf-8'))
LOCAL = 'ferramentas/automacao.local.json'

def sair(msg): print(json.dumps({'erro': msg}, ensure_ascii=False, indent=1)); sys.exit(1)

def achar_drive_desktop():
    """Procura a pasta do Google Drive para computador (Windows: G:\\Meu Drive; macOS: ~/Library/CloudStorage/GoogleDrive-*)."""
    cands = []
    if os.name == 'nt':
        for L in string.ascii_uppercase[3:]:
            cands += [f'{L}:/Meu Drive', f'{L}:/O meu disco', f'{L}:/My Drive']
    home = os.path.expanduser('~')
    cands += glob.glob(f'{home}/Library/CloudStorage/GoogleDrive-*/Meu Drive') + glob.glob(f'{home}/Library/CloudStorage/GoogleDrive-*/My Drive')
    cands += [f'{home}/Google Drive/Meu Drive', f'{home}/Google Drive/My Drive', f'{home}/Google Drive']
    return next((c for c in cands if os.path.isdir(c)), None)

def configurar(args):
    def opt(n, d=None): return args[args.index(n) + 1] if n in args else d
    pessoa = opt('--pessoa') or input('Seu nome (minúsculas, ex.: jose): ').strip().lower()
    modo = opt('--modo') or ('drive_desktop' if achar_drive_desktop() else 'rclone')
    c = {'pessoa': pessoa, 'modo': modo}
    if modo == 'drive_desktop':
        c['pasta_drive'] = (opt('--pasta') or achar_drive_desktop() or '').replace('\\', '/')
        if not c['pasta_drive'] or not os.path.isdir(c['pasta_drive']): sair('Pasta do Google Drive para computador não encontrada. Instale o app ou use --pasta "G:/Meu Drive".')
    elif modo == 'rclone':
        if not shutil.which('rclone'): sair('rclone não instalado: winget install -e --id Rclone.Rclone  e depois  rclone config  (remote do tipo drive, nome gdrive)')
        c['remote'] = opt('--remote', 'gdrive:')
    else: sair('modo inválido (drive_desktop | rclone)')
    json.dump(c, open(LOCAL, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps({'ok': f'configurado em {LOCAL}', **c}, ensure_ascii=False, indent=1))

def slug_ep(nn):
    r = sorted(glob.glob(f'roteiros/ep{nn}-*.md'))
    if not r: sair(f'roteiros/ep{nn}-*.md não existe')
    return os.path.basename(r[0])[:-3], r[0]

def frontmatter(p):
    m = re.match(r'---\n(.*?)\n---', open(p, encoding='utf-8').read(), re.S)
    return dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M)) if m else {}

def duracao(p):
    try:
        s = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], text=True))
        return f'{int(s // 60)}:{int(s % 60):02d}'
    except Exception: return '?'

def proxima_versao(existentes, base):
    vs = [int(m.group(1)) for n in existentes for m in [re.search(re.escape(base) + r'-v(\d+)\.', n)] if m]
    return max(vs, default=0) + 1

def main():
    a = sys.argv[1:]
    if not a or a[0] in ('-h', '--help'): print(__doc__); return
    if a[0] == '--configurar': return configurar(a)
    if len(a) < 2 or a[1] not in ('previa', 'final'): sair('uso: publicar.py NN previa|final')
    if not os.path.exists(LOCAL): sair('rode antes: python ferramentas/publicar.py --configurar')
    L = json.load(open(LOCAL, encoding='utf-8'))
    nn, tipo = a[0].zfill(2), a[1]
    slug, rot = slug_ep(nn); fm = frontmatter(rot)
    pasta = (glob.glob(f'projeto/out/Video {nn} - *') + glob.glob(f'projeto/out/Video {int(nn)} - *'))
    if not pasta: sair(f'projeto/out/Video {nn} - ... não existe: rode o build antes')
    pasta = pasta[0]
    if tipo == 'previa':
        itens = [('video', f'{pasta}/previa.mp4', f'{slug}-previa', '.mp4')]
        sub, canal = CFG['drive']['rascunhos'], CFG['slack']['rascunhos']
    else:
        itens = [('video', f'{pasta}/video.mp4', f'{slug}-final', '.mp4'), ('capa', f'{pasta}/capa.jpg', f'{slug}-capa', '.jpg')]
        sub, canal = CFG['drive']['finais'], CFG['slack']['finais']
    for _, p, _, _ in itens:
        if not os.path.exists(p): sair(f'{p} não existe: rode o build antes')
    destino_rel = f"{CFG['drive']['pasta_raiz']}/{sub}"

    # versão: olha o que já existe no destino
    if L['modo'] == 'drive_desktop':
        dest_dir = f"{L['pasta_drive']}/{destino_rel}"; os.makedirs(dest_dir, exist_ok=True); existentes = os.listdir(dest_dir)
    else:
        r = subprocess.run(['rclone', 'lsf', f"{L['remote']}{destino_rel}"], capture_output=True, text=True); existentes = r.stdout.split()
    v = proxima_versao(existentes, itens[0][2])

    out = []
    for kind, src, base, ext in itens:
        nome = f'{base}-v{v}{ext}'; reg = {'tipo': kind, 'nome': nome, 'pasta_drive': destino_rel, 'link': None}
        if L['modo'] == 'drive_desktop':
            shutil.copy2(src, f'{dest_dir}/{nome}'); reg['local'] = f'{dest_dir}/{nome}'
        else:
            alvo = f"{L['remote']}{destino_rel}/{nome}"
            subprocess.run(['rclone', 'copyto', src, alvo], check=True)
            reg['link'] = subprocess.check_output(['rclone', 'link', alvo], text=True).strip()   # cria "qualquer pessoa com o link: leitor"
        out.append(reg)

    # dados para a mensagem
    audio = f'projeto/audio/n{int(nn)}.mp3'; al = audio + '.align.json'
    voz = 'real (ElevenLabs)' if os.path.exists(al) and os.path.exists(audio) and os.path.getmtime(al) >= os.path.getmtime(audio) - 5 else 'provisória (Piper)'
    dur = duracao(itens[0][1]); quem = L['pessoa'].capitalize(); tema = fm.get('tema', slug)
    if tipo == 'previa':
        msg = (f"🎬 **Rascunho EP{nn} — {tema}** · v{v} · por {quem}\n"
               f"▶️ [Assistir prévia]({{LINK_VIDEO}}) · {dur} · voz {voz}\n"
               f"• O que mudou: {{RESUMO_1_LINHA}}\n• Revisar: {{PONTO_DE_ATENCAO}}")
    else:
        titulo = ''
        ins = f'{pasta}/instrucoes.txt'
        if os.path.exists(ins):
            t = open(ins, encoding='utf-8-sig').read(); m = re.search(r'T[ÍI]TULO:?\s*\n?(.+)', t); titulo = m.group(1).strip() if m else ''
        msg = (f"✅ **Final EP{nn} — {tema}** · v{v} · por {quem}\n"
               f"▶️ [Vídeo final]({{LINK_VIDEO}}) · {dur} · 🖼️ [Capa]({{LINK_CAPA}})\n"
               + (f"• Título: {titulo}\n" if titulo else '') +
               "• Checagens: inspeção 0 avisos · −14 LUFS · critérios de aceite ok\n• Próximo passo: {PROXIMO_PASSO}")
    for r in out:
        if r['link']: msg = msg.replace('{LINK_VIDEO}' if r['tipo'] == 'video' else '{LINK_CAPA}', r['link'])
    res = {'ep': nn, 'tipo': tipo, 'versao': v, 'modo': L['modo'], 'pessoa': L['pessoa'], 'arquivos': out,
           'slack_canal': canal, 'mensagem': msg, 'quando': datetime.datetime.now().isoformat(timespec='seconds'),
           'proximo': ('Conector Google Drive: search_files (title = nome, owner = me) -> share_file(role reader, permissionId anyoneWithLink) -> link; '
                       'depois conector Slack: slack_send_message no canal acima.') if L['modo'] == 'drive_desktop' else 'Conector Slack: slack_send_message no canal acima.'}
    hist = f'{pasta}/publicacao.json'
    h = json.load(open(hist, encoding='utf-8')) if os.path.exists(hist) else []
    json.dump(h + [res], open(hist, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(json.dumps(res, ensure_ascii=False, indent=1))

if __name__ == '__main__': main()
