# EP25–33: prompts dos chats

Claude Code no PC, pasta `C:\Users\Geras\manual-zomboid`. **Um chat por vez**: todos mexem nos mesmos arquivos.

| EP | modelo | esforço | lugar |
|---|---|---|---|
| 25 Agricultura | Opus 5.5 | Máximo | horta (novo) |
| 26 Animais | Opus 5.5 | Alto | fazenda (existe) |
| 27 Pesca | Opus 5.5 | Máximo | lago (novo) |
| 28–33 | Opus 5.5 | Alto (Máximo se lugar novo) | ver registro |

## EP25
```
Trabalhe no EP25 (Agricultura).
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/ep25-agricultura.md.
0. Há mudanças sem commit (renumeração, voz do EP26, lugares de gravação): commit e PR próprios. Depois, branch jose/ep25.
1. Valide os fatos nos arquivos do jogo (media) e leve a info-validada/. Frase sem confirmação: me avise antes de cortar, a voz já está gravada.
2. Lugar: crie horta() em cenarios.js só com sprites do jogo (horta cercada atrás de casa rural, canteiros, ferramentas, capim alto fora). Não altere ep12.js.
3. Cenas do roteiro, ícones, sons, check_vo.py.
4. Mostre fotos do lugar (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Todo commit com "Por quê:". Sem Slack/Drive.
```

## EP26
```
Trabalhe no EP26 (Animais).
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/ep26-animais-producao.md.
0. Branch jose/ep26.
1. Valide nos arquivos do jogo e leve a info-validada/: galinheiro sujo (gancho), limpeza, abrigo da área, limite de aves, meses de cria, bezerro, chuva no cocho. Frase sem confirmação: me avise antes de cortar.
2. Lugar: melhore fazenda() sem trocar o que existe: galinheiro, 2 cochos separados, feno, balde, fiéis ao jogo.
3. Cenas do roteiro, animais originais, ícones, sons, check_vo.py. A voz nova já está instalada.
4. Mostre fotos do lugar (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Todo commit com "Por quê:". Sem Slack/Drive.
```

## EP27
```
Trabalhe no EP27 (Pesca).
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/ep27-pesca.md.
0. Branch jose/ep27.
1. Valide todos os fatos nos arquivos do jogo e leve a info-validada/. Frase sem confirmação: me avise antes de cortar, a voz já está gravada.
2. Lugar: crie lago() em cenarios.js só com sprites do jogo (margem, vegetação, mata, mochila, ondulações). Píer e juncos só se existirem no jogo. Não altere ep09.js nem ep12.js.
3. Cenas do roteiro, peixes só em ícone, ícones, sons, check_vo.py.
4. Mostre fotos do lugar (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Todo commit com "Por quê:". Sem Slack/Drive.
```

## EP28–33 (trocar NN)
```
Trabalhe no EPNN.
Leia: CLAUDE.md, canal/lugares-de-gravacao.md, roteiros/epNN-*.md.
0. Branch jose/epNN.
1. Valide os fatos nos arquivos do jogo. Frase sem confirmação: me avise antes de cortar.
2. Use o lugar do registro e melhore; não troque.
3. Cenas, ícones, sons, check_vo.py.
4. Mostre fotos (máx. 2 rodadas) e entregue o .bat da prévia. Não renderize.
Todo commit com "Por quê:". Sem Slack/Drive.
```

EP28 (Tédio): esta pasta não tem a v7. Defina qual cópia vale antes.
