#!/usr/bin/env python3
"""Textos de publicação por plataforma. Uso: python3 pipeline/post.py NN "pasta de saída"
Lê "post" do epNN.ep.json: titulo, gancho, pontos (lista), pergunta, tags (extras, sem #)."""
import sys, os, json, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
ep, out = sys.argv[1], sys.argv[2]; M = json.load(open(f'ep{ep}.ep.json', encoding='utf-8')); p = M['post']
tags = ['projectzomboid', 'zomboid'] + p.get('tags', [])
h = lambda l: ' '.join('#' + t for t in l)
yt_t = f"{p['titulo']} | Project Zomboid"
pts = p.get('pontos', [])
yt = f"""{p['gancho']}
{chr(10).join(f'{i + 1}. {x}' for i, x in enumerate(pts))}

Inscreva-se no Manual Zomboid: dicas rápidas de Project Zomboid, com as regras reais do jogo.
Jogo: https://projectzomboid.com
Canal de fã, sem ligação com a The Indie Stone.

{h(tags[:4] + ['shorts'])}"""
ig = f"""{p['gancho']}

{chr(10).join('▪ ' + x for x in pts)}

{p['pergunta']} Comenta aí 👇
Salva pra não esquecer e manda pra quem joga com você.

Canal de fã, não oficial.
.
{h(tags[:6] + ['jogosdesobrevivencia', 'gamerbr'])}"""
tk = f"""{p['gancho']} {p['pergunta']}
{h(tags[:3] + ['jogosdesobrevivencia', 'gamerbr'])}"""
roteiro = re.sub(r'\[[^\]]*\]\s*', '', M.get('roteiro', '')).strip()
warn = []
if len(yt_t) > 100: warn.append(f'título do YouTube com {len(yt_t)} caracteres (máx. 100)')
if len(ig.split(chr(10))[0]) > 125: warn.append('gancho passa de 125 caracteres (o Instagram corta)')
if len(tk.split(chr(10))[0]) > 150: warn.append('legenda do TikTok passa de 150 caracteres')
txt = f"""PUBLICAÇÃO — Vídeo {ep} — {M['nome']}
Arquivos: video.mp4 + capa.jpg (mesmos arquivos nas 3 plataformas)

==================== YOUTUBE SHORTS ====================
TÍTULO:
{yt_t}

DESCRIÇÃO:
{yt}

==================== INSTAGRAM REELS ====================
LEGENDA:
{ig}

CAPA: usar capa.jpg (texto principal fica dentro do quadrado central do feed).

==================== TIKTOK ====================
LEGENDA:
{tk}

CAPA: escolher o quadro do título dentro do app (ou enviar capa.jpg).

==================== ROTEIRO (narração) ====================
{roteiro}

==================== TEXTO PARA O ELEVENLABS (com emoções) ====================
{M.get('roteiro', '').strip()}
Voz: Jhony Tygas - Natural Mature | Eleven v4 | velocidade 1.00 | estabilidade 40 | similaridade 75
"""
open(os.path.join(out, 'instrucoes.txt'), 'w', encoding='utf-8-sig', newline='\r\n').write(txt)
print('post:', os.path.join(out, 'instrucoes.txt'), '| AVISOS: ' + '; '.join(warn) if warn else '')

# legendas (.srt) para subir no YouTube/TikTok: acessibilidade e busca, sem poluir a tela
import re
ns = M['vo'].replace('audio/n', 'audio/ns').rsplit('.', 1)[0] + '.json'
if os.path.exists(ns):
    fr = json.load(open(ns, encoding='utf-8')); cfg = open(f'ep{ep}.cfg.js', encoding='utf-8').read()
    T = json.loads(re.search(r'T: (\[[^\]]*\])', cfg).group(1)); END = float(re.search(r'END: ([\d.]+)', cfg).group(1))
    ts = lambda x: f'{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{int(x % 60):02d},{int(round(x % 1 * 1000)) % 1000:03d}'
    blocks = []
    for i, t in enumerate(T):
        a, b = t + 1.3, (T[i + 1] if i + 1 < len(T) else END) + 1.3 - .05
        blocks.append(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{fr[i] if i < len(fr) else ""}\n')
    open(os.path.join(out, 'legendas.srt'), 'w', encoding='utf-8').write('\n'.join(blocks))
    print('legendas:', os.path.join(out, 'legendas.srt'))
