---
tema: fogo
status: validado
atualizado: 2026-11-23
---
# Fogo e incêndio — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| fogo-espalha | Modo Apocalipse: "Propagação do Fogo" ligada — o incêndio se espalha depois de iniciado | B42.22 | arquivos do jogo B42.22: Sandbox/Apocalypse.lua FireSpread = true + Sandbox_FireSpread_tooltip | 29 |
| fogo-fogao | O jogo avisa: desligue o fogão/eletrodoméstico quando terminar, "a menos que queira cozinhar sua casa também" | B42.22 | arquivos do jogo B42.22: SurvivalGuide_entrie8moreinfo | 29 |
| fogo-extintor | Extintor: "Apaga incêndios. Extingue as chamas em construções e pessoas." Menu: "Apagar Fogo" | B42.22 | arquivos do jogo B42.22: Tooltip_Extinguisher + ContextMenu_ExtinguishFire | 29 |
| fogo-apagar | Também apagam fogo: saco de areia, de cascalho ou de terra, e água em volume (um gole de garrafa não basta) | B42.20.4 | projectzomboid.wiki/guides/corpse-disposal (42.20.4) + arquivos do jogo B42.22: drainable.txt Base.Sandbag/Gravelbag/Dirtbag | 29, 30 |
| fogo-pessoas | Gente e zumbi pegam fogo (status "Em Chamas"); zumbi em chamas espalha fogo mesmo com a propagação entre quadrados desligada | B42.22 | arquivos do jogo B42.22: IG_UI IGUI_StatsAndBody_IsOnFire + UI.json UI_ServerOption_NoFireSpread_tooltip | 29 |
| fogo-fogueira | Na B42 a fogueira é feita com 3 Pedras pelo Menu de Construção | B42.22 | arquivos do jogo B42.22: ContextMenu_CampfireKit_tooltip | 29 |
| fogo-combustivel | Modo Apocalipse: fogueira e fogão a lenha guardam no máximo 8 horas de combustível | B42.22 | arquivos do jogo B42.22: Apocalypse.lua MaximumFireFuelHours = 8 + Sandbox_MaximumFireFuelHours_tooltip | 29 |
