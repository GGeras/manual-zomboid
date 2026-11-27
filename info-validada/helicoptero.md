---
tema: helicoptero
status: validado
atualizado: 2026-11-23
---
# Helicóptero e eventos — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| heli-config | Modo Apocalipse: Helicóptero = "Uma vez"; Metaevento ("eventos que atraem zumbis, como tiros ao longe") = "Às vezes" | B42.22 | arquivos do jogo B42.22: Sandbox/Apocalypse.lua Helicopter = 2, MetaEvent = 2 + Sandbox.json opções e tooltips | 31 |
| heli-quando | Vem entre a 6ª e a 9ª noite (sorteada no início do mundo), numa janela que abre entre 9h e 18h e dura de 1 a 4 horas | B42.22 | pindrop.gg/project-zomboid/helicopter-event (código do servidor B42, nov/2026) | 31 |
| heli-radio | No dia, o rádio de emergência avisa atividade aérea depois da previsão do tempo | B42.22 | pindrop.gg/project-zomboid/helicopter-event (código do servidor B42, nov/2026) | 31 |
| heli-invisivel | Você não vê nem pode atirar no helicóptero ("Você não pode atirar no helicóptero."); ele procura um jogador num raio grande e os zumbis de uma área enorme ouvem e vão atrás do som | B42.22 | arquivos do jogo B42.22: UI.json UI_quick_tip_joke8 + UI_ServerOptionDesc_Chopper + pindrop.gg/project-zomboid/helicopter-event (código do servidor B42, nov/2026) | 31 |
| heli-segue | Se o helicóptero te vê, ele passa a te seguir — e a horda vem atrás do barulho | B42.22 | confirmado no jogo pelo Jose (B42.22, 23/11/2026) + pindrop.gg/project-zomboid/helicopter-event (código do servidor B42, nov/2026) | 31 |
| heli-depois | Depois do evento, a região da sua base pode estar cheia de zumbis puxados pelo barulho | B42.22 | pindrop.gg/project-zomboid/helicopter-event (código do servidor B42, nov/2026) | 31 |
