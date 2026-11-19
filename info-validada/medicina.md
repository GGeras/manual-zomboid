---
tema: medicina
status: validado
atualizado: 2026-11-19
---
# Medicina — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| med-antibiotico | Infecção da ferida: desinfetante, lenço com álcool e antibiótico reduzem (somam); nada cura a infecção zumbi | B42.22 | pindrop.gg/project-zomboid/injuries (B42, 06/11/2026) + pzfans.com/first-aid (42.19) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-bala | Bala alojada: tirar com pinça; a retirada deixa ferimento profundo → costurar e enfaixar | B42.22 | pindrop.gg/project-zomboid/injuries (B42, 06/11/2026) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-chance | Infecção zumbi (Knox), padrão: arranhão 7%, corte 25%, mordida 100%; sorteada uma vez, na hora do ferimento; sem cura | B42.22 | pindrop.gg/project-zomboid/injuries (arquivos do servidor B42, 06/11/2026) + pzwiki.net/wiki/Zombie_virus (B41, mesmos valores) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-fratura | Fratura: tala pronta ou tira de pano + tábua ou galho; com tala cura bem mais rápido (não é instantâneo) | B42.22 | pindrop.gg/project-zomboid/injuries (B42, 06/11/2026) + pzfans.com/first-aid (42.19) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-knox-painel | A infecção zumbi não aparece no painel de saúde | B42.22 | pindrop.gg/project-zomboid/injuries (arquivos do servidor B42, 06/11/2026) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-limpa | Arranhão, corte e queimadura: enfaixar; desinfetar reduz a chance de infecção; queimadura precisa de curativo novo de tempos em tempos | B42.22 | pindrop.gg/project-zomboid/injuries (B42, 06/11/2026) + pzfans.com/first-aid (42.19) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-profundo | Ferimento profundo: costurar com agulha de sutura ou agulha e linha, e enfaixar; sem costura, só com bandagem fecha devagar | B42.22 | pindrop.gg/project-zomboid/injuries (B42, 06/11/2026) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-sujo | Curativo sujo é o fator que mais aumenta a chance de infecção da ferida; trocar, ou limpar com água e reusar (42.21: máquina de lavar também limpa) | B42.22 | pindrop.gg/project-zomboid/injuries (B42, 06/11/2026) + pzfans.com/first-aid (42.19) + notas 42.21 (patched.gg) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-tipos | Tipos de ferida: arranhão, corte, mordida, ferimento profundo, vidro alojado, bala alojada, queimadura, fratura | B42.22 | pindrop.gg/project-zomboid/injuries (arquivos do servidor B42, 06/11/2026) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
| med-vidro | Vidro alojado: tirar com pinça; com o vidro lá a ferida não fecha; depois enfaixar ou costurar | B42.22 | pindrop.gg/project-zomboid/injuries (B42, 06/11/2026) + pzfans.com/first-aid (42.19) + nomes PT-BR: lua/shared/Translate/PTBR (IG_UI/ItemName/ContextMenu) do jogo B42.22 | 15 |
