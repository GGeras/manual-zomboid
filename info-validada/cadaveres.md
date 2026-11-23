---
tema: cadaveres
status: validado
atualizado: 2026-11-23
---
# Cadáveres e mau cheiro — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| cad-niveis | Moodle novo: Mau Cheiro, Odor Horrível, Fedor Insuportável, Vapores Mortais ("Você não consegue respirar. Saia daqui!") | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_NoxiousSmell_* | 30 |
| cad-doenca | "Cadáveres demais em uma área causam Doença." Não fique muito tempo perto: afaste-se, enterre, queime ou use máscara | B42.22 | arquivos do jogo B42.22: SurvivalGuide_burn_corpse_description + SurvivalGuide_bad_smells_description | 30 |
| cad-moscas | Só vira perigo com muitos corpos juntos; o sinal são moscas zumbindo | B42.20 | build42guide.wiki/survival/build-42-corpse-sickness (reconferido 42.20) | 30 |
| cad-arrastar | Segure a tecla perto do cadáver para arrastar ("Pegar Cadáver"); dá para jogar por cima da cerca ou pela janela | B42.22 | arquivos do jogo B42.22: SurvivalGuide_burn_corpse_description + ContextMenu_Grab_Corpse/ThrowCorpseOverFence/ThrowCorpseThroughWindow | 30 |
| cad-cova | Pá: "Cavar Covas"; cada cova recebe 5 cadáveres ("Enterrar Cadáver (x/5)") e depois "Fechar Cova" | B42.22 | arquivos do jogo B42.22: ContextMenu_DigGraves/BuryCorpse/FillGrave + ItemName Base.Shovel | 30 |
| cad-queimar | Queimar com gasolina e uma fonte de fogo ("Queimar Cadáver") ou "Colocar cadáver na fogueira" — "melhor para suas costas" | B42.22 | arquivos do jogo B42.22: SurvivalGuide_burn_corpse_description + ContextMenu_Burn_Corpse/CampfireCorpse | 30 |
| cad-mascara | Máscara de Gás, Respirador Semifacial, Máscara Cirúrgica e Máscara de Pó têm proteção contra a doença dos cadáveres (máscara de gás e respirador usam filtro) | B42.22 | arquivos do jogo B42.22: clothing.txt CorpseSicknessDefense + ItemName (Sem Filtro) | 30 |
| cad-config | Modo Apocalipse: impacto de cadáveres em decomposição "Normal" (afeta saúde e estado emocional); cadáveres somem em 216 horas (9 dias) e soltam larvas | B42.22 | arquivos do jogo B42.22: Apocalypse.lua DecayingCorpseHealthImpact = 3, HoursForCorpseRemoval = 216 + Sandbox tooltips | 30 |
| cad-carro | Porta-malas cabe "um cadáver ou dois" | B42.22 | arquivos do jogo B42.22: SurvivalGuide_vehicle_storage_description | 30 |
