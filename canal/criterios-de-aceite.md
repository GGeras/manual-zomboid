# 07 Criterios de Aceite

_(convertido de `00 Referencias/10 Roteiro, Voz e Publicacao/07 Criterios de Aceite.txt`)_

```text
CRITÉRIOS DE ACEITE — um vídeo só é entregue se passar em TODOS (vale do vídeo 11 em diante)

1. FIDELIDADE AO JOGO (regra absoluta)
[ ] Toda regra falada está em pipeline/fatos.json, com fonte e build 42.20+
[ ] Nada da lista "nao_usar"; nada de dica de sobrevivência da vida real
[ ] Personagem, zumbis e veículos são os modelos do jogo (pz: true)
[ ] Personagem principal com a roupa de sempre (jaqueta verde, jeans azul, mochila marrom; taco, salvo quando o tema pede outra arma)
[ ] Zumbis variados (homem/mulher, roupas e cabelos diferentes) — nunca todos iguais, nunca verdes
[ ] Todo item citado aparece com o ícone original do jogo
[ ] Objeto novo (construção, móvel, ferramenta) foi conferido na pasta media do jogo antes de desenhar
[ ] Sons são os do jogo; música é a trilha do jogo

2. ANIMAÇÃO
[ ] Cada ação tem antecipação, impacto e volta (folha de conferência olhada quadro a quadro)
[ ] Objeto na mão fica na mão, na posição certa (nada de cabeça para baixo ou flutuando)
[ ] Pés no chão; ninguém atravessa parede, carro ou outro personagem
[ ] Mão nunca atravessa o corpo ou o rosto
[ ] Arma de duas mãos só na pose do próprio jogo (EP22: `machadoNaMao` em projeto/empunhar.js)
[ ] Ação já aprovada é reutilizada: machado (empunhar.js), remédio (tomar.js)
[ ] Ação nova: 1 foto aprovada antes da prévia; falhou 2 vezes, vira ícone ou tela réplica
[ ] Zumbi cai do lado certo do golpe; corpo no chão não some nem treme sem motivo
[ ] Trocas de animação misturadas, sem salto (EP24)
[ ] Ninguém anda parado nem teleporta; zumbi chega ao alcance no golpe/tiro e cai ali
[ ] Curva correndo com a animação do jogo (sem girar no eixo); levantar e agachar com mistura (EP23)
[ ] Fuga com a horda desde o primeiro quadro (EP23)

3. TELA
[ ] Inspeção rodada antes do final, sem avisos reais (texto sobreposto/cortado, botões e descrição do app, luz de dia >= 95)
[ ] Nada sobre o selo da build (conferir em foto)
[ ] Um lugar por assunto, reconhecível, sem repetir rua; objeto grande só com função (EP23)
[ ] Lista falada: um cartão por nome, com ícone, pontos e efeito (EP23)
[ ] Personagem sempre visível na ação: nada na frente dele, nada cortado na borda
[ ] Móvel e TV inteiros no zoom mais fechado
[ ] Objeto de cenário só onde faz sentido
[ ] Luz da janela e mancha no chão no mesmo sentido do sol
[ ] Um número/elemento por vez; nada parado na tela por mais de 3 segundos
[ ] Dá para entender a dica sem som (título + ação + ícone)

4. SOM
[ ] Relatório de sons conferido: cada som está na cena e na frase certas
[ ] Nenhum som atravessa a troca de cena (só os marcados como "livre")
[ ] Voz acima de tudo; volume final -14 LUFS
[ ] check_vo sem avisos (nenhuma tag lida em voz alta, tempos alinhados)

5. ENTREGA
[ ] Prévia aprovada pelo Jose quando houve dúvida
[ ] Título sem "Project Zomboid" ("sem_sufixo": true, conferido no instrucoes.txt); capa com no máximo 2 linhas
[ ] video.mp4 + 3 capas + instrucoes.txt + legendas.srt na pasta Final
[ ] Vídeo anterior guardado em versoes (nunca sobrescrito)
[ ] Repositório atualizado (branch + PR) e documento do projeto atualizado

O QUE O JOSE CONFERE (Claude não consegue)
[ ] Ouvir: som no momento certo, música combinando
[ ] Se a cena "parece o jogo"
```
