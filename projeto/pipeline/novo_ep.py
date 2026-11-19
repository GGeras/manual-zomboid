#!/usr/bin/env python3
"""Cria o esqueleto de um episódio novo. Uso: python3 pipeline/novo_ep.py 07 "Carros" """
import sys, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
ep, nome = sys.argv[1], sys.argv[2]
man = {
 "_ajuda": "Preencha e rode: python3 pipeline/build.py %s   | tempos: numero = segundos no video final, {\"c\": i, \"dt\": s} = corte da frase i, {\"f\": i} = inicio da frase i" % ep,
 "num": ep, "nome": nome,
 "vo": f"audio/n{int(ep)}.mp3", "vo_db": 1.5,
 "musica": "where_is_everyone", "musica_lufs": -30,
 "_musicas": "calmo: where_is_everyone, what_was_lost, they_were_once_here, alone, low, long_ambient | tenso: the_zombie_threat, wwl_tense, the_inevitable | acao: chase, run, the_horde | trabalho: barricading, work_fast | triste: saying_goodbye, piano",
 "sfx": [["zombierand1", {"c": 0, "dt": 1.0}, -21], ["zombiebite", {"c": 5, "dt": 0.4}, -10]],
 "_sfx": "[\"nome do arquivo sem extensao\", tempo, volume em dB, {trim:[ini,fim], ate: tempo (loop), fin, fout}] - nomes no indice de sons",
 "capa": {"t": 10.0, "zoom": 1.15, "pos": "50% 55%", "tint": "rgba(0,0,0,.15)",
          "linhas": [["LINHA 1", "osso"], ["LINHA 2", "osso"], ["PALAVRA", "vermelho"]],
          "gancho": {"tipo": "selo", "texto": "GANCHO CURTO", "cor": "#e0263f"}},
 "_capa": "gancho.tipo: selo {texto, cor} | pcts {itens:[[texto,cor]], legenda} | seq {itens:[[texto,cor]]} ; ondas: true desenha ondas de som ; cores: vermelho verde amarelo osso",
 "post": {"titulo": "Titulo buscavel (ate ~75 caracteres)", "gancho": "Frase de gancho (ate 125 caracteres).",
          "pontos": ["ponto 1", "ponto 2", "ponto 3", "ponto 4", "ponto 5"], "pergunta": "Pergunta para comentarios?",
          "tags": ["pzdicas", "projectzomboidbr", "dicasdejogos", "survivalgame"]},
 "roteiro": "[sério] Texto da narração com as tags de emoção do ElevenLabs..."
}
f = f'ep{ep}.ep.json'
if os.path.exists(f): sys.exit(f + ' já existe')
json.dump(man, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
os.system(f'{sys.executable} mkhtml.py {ep}')
print('criado:', f, f'ep{ep}.html', '| faltam: ep%s.cfg.js (tempos/títulos/HUD) e ep%s.js (cenas 3D) - copie de um episódio parecido' % (ep, ep))
