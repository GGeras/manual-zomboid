---
tema: sono
status: validado
atualizado: 2026-11-23
---
# Sono — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| sono-niveis | Moodle de sono tem 4 níveis: Sonolência, Cansaço, Cansaço Intenso, Cansaço Absurdo. Textos: "O cansaço está tirando suas forças" (2), "Você mal consegue pensar direito" (3) | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Tired_lvl1-4 + _desc | 20 |
| sono-efeito | Cansaço e exaustão limitam severamente a percepção e as capacidades | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/SurvivalGuide.json SurvivalGuide_rest_description | 20 |
| sono-descanso | Descansar numa cadeira recupera o fôlego; o cansaço (sono) só sai dormindo; cama confortável dá o melhor resultado | B42.22 | arquivos do jogo B42.22: SurvivalGuide_rest_description + Moodles_Endurance_desc_lvl1 + projectzomboid.wiki/guides/sleep-rest (42.22) | 20 |
| sono-cama | Cama boa encurta o sono; banco de carro e chão alongam; superfície ruim pode dar dor/distensão no pescoço. Tipos de cama no jogo: Ruim, Médio, Bom (com ou sem Travesseiro) | B42.22 | projectzomboid.wiki/guides/sleep-rest (42.22) + arquivos do jogo B42.22: Tooltip.json Tooltip_BedType_* | 20 |
| sono-travesseiro | Travesseiro na cama aumenta levemente o Conforto ao Dormir | B42.22 | arquivos do jogo B42.22: Tooltip.json Tooltip_item_Pillow | 20 |
| sono-bloqueio | Zumbi perto, pânico e dor forte impedem dormir; desde a 42.22.2 o moodle Mau Cheiro também bloqueia dormir | B42.22.2 | projectzomboid.wiki/guides/sleep-rest (42.22) + notas 42.22.2 (patched.gg/games/project-zomboid/42222-stable-released) | 20, 30 |
| sono-remedio | Comprimidos Soníferos: "Ajuda a pegar no sono. Útil em momentos de ansiedade ou quando há dor." Não misturar remédio com álcool | B42.22 | arquivos do jogo B42.22: Tooltip_PillsSleeping + SurvivalGuide_rest_description | 20 |
| sono-cafeina | Pílulas de Cafeína: "Dá um pico de energia e reduz a fadiga" — só um alívio curto, não substitui dormir | B42.22 | arquivos do jogo B42.22: Tooltip_Vitamins + ItemName Base.PillsVitamins + projectzomboid.wiki/guides/sleep-rest (42.22) | 20 |
| sono-tracos | Traços: Sono Leve (o cansaço cai mais devagar dormindo), Madrugador (precisa dormir menos), Dorminhoco (precisa dormir mais) | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/UI.json UI_trait_Insomniac/LessSleep/MoreSleep | 20 |
