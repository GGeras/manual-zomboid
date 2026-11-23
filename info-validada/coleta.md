---
tema: coleta
status: validado
atualizado: 2026-11-23
---
# Coleta — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| col-modo | Habilidade "Coleta"; janela "Investigar Área" com "Ativar Modo de Busca"; a tecla End liga/desliga o Modo de Busca | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_perks_Foraging + UI.json UI_investigate_area_window_title, UI_enable_search_mode, UI_quick_tip57 | 21 |
| col-nivel | O nível de Coleta aumenta o raio de busca, a qualidade dos itens e as categorias que dá para achar | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_perks_Coleta_Description + IGUI_SearchMode_Tip_Skill_Text | 21 |
| col-raio | Raio base de busca vai de 3 quadrados (Coleta 0) a 10 (Coleta 10), antes de bônus e penalidades | B42.20 | build42guide.wiki/crafting/build-42-foraging (verificado 42.20) + pzfans foraging (42.19) | 21 |
| col-clima | Neblina, neve, nuvens e chuva atrapalham achar itens; guarda-chuva ajuda na chuva; no escuro é difícil, leve lanterna; agachar dá bônus | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_SearchMode_Tip_Weather_Text, Tip_Darkness_Text, Vision_Effect_Crouching | 21 |
| col-andar | Andar enquanto procura revela mais itens; evite andar em círculos | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_SearchMode_Tip_Finding_Text | 21 |
| col-onde | Lenha nas florestas, pedras nas estradas; frutas silvestres e cogumelos mais comuns em florestas (cogumelo depois da chuva); insetos mais comuns à noite | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_SearchMode_Tip_FirewoodStones/Berries/Mushrooms/Insects_Text | 21 |
| col-herbalista | O traço Herbalista ajuda a identificar as frutas silvestres e cogumelos seguros para comer | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_SearchMode_Tip_Berries_Text e Tip_Mushrooms_Text | 21 |
| col-estacao | Todo item natural depende do mês e da estação do ano | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_SearchMode_Tip_Seasons_Text | 21 |
| col-foco | Foco de Busca aumenta a chance de achar a categoria escolhida | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_SearchMode_Tip_SearchFocus_Text | 21 |
