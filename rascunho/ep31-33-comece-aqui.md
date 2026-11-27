# EP25–33: prompts dos chats (31–33 = novos, no fim da fila)

Claude Code no PC, pasta `C:\Users\Geras\manual-zomboid`. **Um chat por vez**: todos mexem nos mesmos arquivos.

| EP | modelo | esforço | lugar |
|---|---|---|---|
| 25–30 | Sonnet 5.5 (Opus se lugar novo) | Médio | ver registro |
| 31 Agricultura | Opus 5.5 | Médio | horta (em construção) |
| 32 Animais | Sonnet 5.5 | Médio | fazenda (existe) |
| 33 Pesca | Opus 5.5 | Médio | lago (novo) |

Subir o esforço só se o mesmo erro voltar duas vezes.

## EP25–30 (trocar NN)
```
Trabalhe no EPNN.
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/epNN-*.md.
0. Branch jose/epNN.
1. Valide os fatos nos arquivos do jogo. Frase sem confirmação: me avise antes de cortar.
2. Use o lugar do registro e melhore; não troque.
3. Cenas, ícones, sons, check_vo.py.
4. Mostre fotos (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Economize tokens: leia só os arquivos citados e os trechos de código necessários; respostas curtas.
Todo commit com "Por quê:". Sem Slack/Drive.
```

EP25 (Tédio): a v9 não está no GitHub (só em C:\Projetos\manual-zomboid). Defina qual cópia vale antes.

## EP31
```
Trabalhe no EP31 (Agricultura).
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/ep31-agricultura.md.
0. Branch jose/ep31.
1. Valide os fatos nos arquivos do jogo (media) e leve a info-validada/. Frase sem confirmação: me avise antes de cortar, a voz já está gravada.
2. Lugar: crie horta() em cenarios.js só com sprites do jogo (horta cercada atrás de casa rural, canteiros, ferramentas, capim alto fora). Não altere ep12.js.
3. Cenas do roteiro, ícones, sons, check_vo.py.
4. Mostre fotos do lugar (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Economize tokens: leia só os arquivos citados e os trechos de código necessários; respostas curtas.
Todo commit com "Por quê:". Sem Slack/Drive.
```

## EP32
```
Trabalhe no EP32 (Animais).
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/ep32-animais-producao.md.
0. Branch jose/ep32.
1. Valide nos arquivos do jogo e leve a info-validada/: galinheiro sujo (gancho), limpeza, abrigo da área, limite de aves, meses de cria, bezerro, chuva no cocho. Frase sem confirmação: me avise antes de cortar.
2. Lugar: melhore fazenda() sem trocar o que existe: galinheiro, 2 cochos separados, feno, balde, fiéis ao jogo.
3. Cenas do roteiro, animais originais, ícones, sons, check_vo.py. A voz nova já está instalada.
4. Mostre fotos do lugar (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Economize tokens: leia só os arquivos citados e os trechos de código necessários; respostas curtas.
Todo commit com "Por quê:". Sem Slack/Drive.
```

## EP33
```
Trabalhe no EP33 (Pesca).
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/ep33-pesca.md.
0. Branch jose/ep33.
1. Valide todos os fatos nos arquivos do jogo e leve a info-validada/. Frase sem confirmação: me avise antes de cortar, a voz já está gravada.
2. Lugar: crie lago() em cenarios.js só com sprites do jogo (margem, vegetação, mata, mochila, ondulações). Píer e juncos só se existirem no jogo. Não altere ep09.js nem ep12.js.
3. Cenas do roteiro, peixes só em ícone, ícones, sons, check_vo.py.
4. Mostre fotos do lugar (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Economize tokens: leia só os arquivos citados e os trechos de código necessários; respostas curtas.
Todo commit com "Por quê:". Sem Slack/Drive.
```
