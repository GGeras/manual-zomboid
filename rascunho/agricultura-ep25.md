# Fatos — EP25 Agricultura (rascunho)

Status: rascunho. Motivo: a build exata (B42.20+) não foi confirmada no arquivo; regra manda ficar em rascunho até confirmar.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| agri-agua-minimo | Água abaixo do mínimo: cresce mais devagar; muito abaixo: morre (faixas de 10% e 30% no código) | B42 (confirmar) | media/lua/server/Farming/farming_vegetableconf.lua, calcWater | EP25 |
| agri-doenca | Doença: abaixo de 10 ok; 10 a 30 atrasa; 30 a 60 para de crescer; acima de 60 morre | B42 (confirmar) | farming_vegetableconf.lua, calcDisease | EP25 |
| agri-pragas | Pulgão e lesma: cada 10 pontos tira 1 colheita | B42 (confirmar) | farming_vegetableconf.lua, getVegetablesNumber | EP25 |
| agri-saude | Saúde acima de 50: +1 colheita a cada 10 pontos | B42 (confirmar) | farming_vegetableconf.lua, getVegetablesNumber | EP25 |
| agri-nomes | Nomes PT-BR: Pulgões, Míldio, Regada, Com Sede, Seca, Ressecada, Morrendo | — | media/lua/shared/Translate/PTBR/Farming.json | EP25 |

Não validado (não usar em vídeo): época de plantio por mês (tabela de growing season), prazo de apodrecimento do tomate, efeito do míldio e do composto.
