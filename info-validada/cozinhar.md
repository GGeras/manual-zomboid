---
tema: cozinhar
status: validado
atualizado: 2026-11-19
---
# Cozinhar — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| cozinha-agua | Água contaminada: 'Imprópria para consumo. Esterilize em um forno ou sobre o fogo.' Beber quando o aviso sumir | B42.22 | arquivos do jogo do Jose (B42.22): lua/shared/Translate/PTBR/Tooltip.json (Tooltip_item_TaintedWater) | 14 |
| cozinha-carne-crua | Carne crua é perigosa crua (DangerousUncooked) e pode dar Mal-estar; cozinhar antes | B42.22 | arquivos do jogo do Jose (B42.22): scripts/generated/items/food.txt (Steak/Chicken DangerousUncooked = true) + PTBR Moodles_Sick = Mal-estar | 14 |
| cozinha-energia | Fogão elétrico e micro-ondas precisam de energia; a rede cai em semanas no padrão Apocalipse e não volta | B42.22 | arquivos do jogo do Jose (B42.22): lua/shared/Sandbox/Apocalypse.lua (ElecShut/ElecShutModifier 14) + pzfans cooking B42.20.4 | 14 |
| cozinha-fogo-sem-luz | Sem energia: fogueira, lareira e churrasqueira cozinham | B42.22 | pzfans cooking (B42.20.4); lareira confirmada pelo Jose (18/11) | 14 |
| cozinha-panela | Ensopado: panela com água, até 6 ingredientes, cozinha no fogo (Panela de Ensopado) | B42.22 | arquivos do jogo do Jose (B42.22): scripts/generated/evolvedrecipes.txt (Stew MaxItems 6, MinimumWater, Cookable) + PTBR ItemName | 14 |
| cozinha-podre | Comida podre só entra em receita com Culinária 7 e rende pouco | B42.20.4 | pzfans cooking (B42.20.4) + pzwiki Cooking (concorda no nível 7) | 14 |
| cozinha-queimada | Comida que passa do tempo no fogo queima; queimada não serve como ingrediente; tirar quando pronta | B42.20.4 | arquivos do jogo do Jose (B42.22): food.txt (MinutesToCook/MinutesToBurn) + pzfans cooking B42.20.4 | 14 |
