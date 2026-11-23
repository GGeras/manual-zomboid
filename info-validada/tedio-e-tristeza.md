---
tema: tedio-e-tristeza
status: validado
atualizado: 2026-11-23
---
# Tédio e tristeza — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| ted-niveis | Tédio: Um Pouco de Tédio, Tédio, Tédio Intenso, Tédio Extremo. Texto 1: "Ocupe-se ou procure alguma distração." | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Bored_* | 25 |
| tri-niveis | Tristeza: Triste, Vontade de Chorar, Desolação, Sem Esperança. Texto 1: "Procure um jeito de esquecer os problemas." | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Unhappy_* | 25 |
| tri-comida | Comida tem atributos Tédio e Tristeza no tooltip; algumas pedem "Cozinhe para remover a penalidade de tristeza" | B42.22 | arquivos do jogo B42.22: Tooltip.json Tooltip_food_Boredom/Unhappiness + Tooltip_food_CookToRemoveUnhappiness | 25 |
| tri-leitura | Livro e Revista em Quadrinhos tiram tédio, estresse e tristeza; Revista tira tédio e estresse | B42.22 | arquivos do jogo B42.22: literature.txt (UnhappyChange, StressChange, BoredomChange) | 25 |
| tri-antidep | Antidepressivos: "Reduz a tristeza durante um período prolongado" (efeito lento, não imediato) | B42.22 | arquivos do jogo B42.22: Tooltip_PillsAntidepressant + ItemName Base.PillsAntiDep | 25 |
