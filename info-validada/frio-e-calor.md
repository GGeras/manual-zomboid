---
tema: frio-e-calor
status: validado
atualizado: 2026-11-19
---
# Frio e Calor — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| temp-calor | Calor: mais sede ("Você sente mais sede") e cansaço; depois lento; hipertermia perde vida ("O calor está consumindo sua vida") | B42.22 | arquivos do jogo B42.22 do Jose: PTBR Moodles_Hyperthermia_desc_lvl1/lvl4 + pzfans 42.19 | 18 |
| temp-corpo | Moodles de frio/calor seguem a temperatura do corpo; a do ar só empurra | 42.19/B42.20 | pzfans heat moodle (42.19) + build42guide moodles (B42.20) | 18 |
| temp-frio | Frio: cura natural para; depois luta/corrida mais lentas; hipotermia: quase sem ataque, sem correr, perde vida | B42.20 | build42guide moodles (B42.20) + projectzomboid.wiki weather + PTBR Moodles_Hypothermia_desc_lvl4 | 18 |
| temp-moodles | Nomes dos níveis: Um Pouco de Frio, Frio, Congelando, Hipotermia; Calor Desconfortável, Superaquecimento, Insolação, Hipertermia; Úmido, Molhado, Ensopado, Encharcado; Sensação de Frio Leve, Sensação de Frio Desconfortável, Sensação de Frio Congelante, Sensação de Frio Terrível (vento) | B42.22 | arquivos do jogo B42.22 do Jose: lua/shared/Translate/PTBR/Moodles.json | 18 |
| temp-previsao | Rádio (AEBS) e TV dão a previsão do tempo | B42 | projectzomboid.wiki weather-systems (B42) | 18 |
| temp-roupa | Roupa isola e corta vento; molhada perde isolamento; camadas finas somam; no calor tirar camadas, sombra e água | B42 | projectzomboid.wiki clothing-weather (B42) + pzfans 42.19 | 18 |
