---
tema: agricultura
status: validado
atualizado: 2026-11-27
---
# Agricultura — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

Arquivos: `lua/server/Farming/` do jogo B42.22 do Jose. Padrão Apocalipse: `PlantGrowingSeasons = true` (`lua/shared/Sandbox/Apocalypse.lua`).

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| agr-meses-plantio | Cada planta tem meses de plantio (Época de Plantio) | B42.22 | arquivos do jogo B42.22 do Jose: farming_vegetableconf_vegetables.lua sowMonth; PTBR Farming.json Farming_Tooltip_InSeason | 31 |
| agr-fora-do-mes | Plantou fora dos meses de plantio: a planta nasce condenada (cursed) e perde mais saúde (multiplicador ×2) | B42.22 | arquivos do jogo B42.22 do Jose: SPlantGlobalObject.lua seed() (not isSowMonth → cursed); SFarmingSystem.lua changeHealth badMultiplier | 31 |
| agr-sem-nov-dez | Nenhuma planta tem novembro ou dezembro nos meses de plantio | B42.22 | arquivos do jogo B42.22 do Jose: sowMonth de todas as plantas em farming_vegetableconf_vegetables.lua e _herbs.lua (meses 2 a 10) | 31 |
| agr-mes-batata | Batata: plantio de fevereiro a abril | B42.22 | arquivos do jogo B42.22 do Jose: farming_vegetableconf_vegetables.lua Potatoes sowMonth {2,3,4} | 31 |
| agr-mes-tomate | Tomate: plantio de abril a junho | B42.22 | arquivos do jogo B42.22 do Jose: farming_vegetableconf_vegetables.lua Tomato sowMonth {4,5,6} | 31 |
| agr-mes-repolho-cenoura | Repolho e cenoura: plantio de fevereiro a julho | B42.22 | arquivos do jogo B42.22 do Jose: farming_vegetableconf_vegetables.lua Cabbages e Carrots sowMonth {2..7} | 31 |
| agr-agua-nivel | Cada planta pede um nível de água no solo (Nível de água na planta) | B42.22 | arquivos do jogo B42.22 do Jose: props waterLvl / waterNeeded; PTBR Farming.json Farming_Water_levels | 31 |
| agr-agua-tomate-cenoura | Tomate pede água alta (70); a cenoura, depois do primeiro estágio, pede bem menos (30) | B42.22 | arquivos do jogo B42.22 do Jose: Tomato waterLvl 70; Carrots waterNeeded 70 (início) e waterLvl 30 (demais estágios); farming_vegetableconf.lua grow() | 31 |
| agr-agua-falta | Água um pouco abaixo: cresce mais devagar; bem abaixo: não cresce e perde saúde | B42.22 | arquivos do jogo B42.22 do Jose: farming_vegetableconf.lua calcWater (−10% atrasa, −30% não cresce, abaixo disso −2); SFarmingSystem.lua changeHealth | 31 |
| agr-chuva | A chuva rega as plantas ao ar livre | B42.22 | arquivos do jogo B42.22 do Jose: SFarmingSystem.lua checkWater (isRaining and exterior) | 31 |
| agr-mato-dobro | Mato (Ervas Daninhas) no quadrado dobra a perda de saúde; somado à planta condenada, o efeito se multiplica | B42.22 | arquivos do jogo B42.22 do Jose: SFarmingSystem.lua changeHealth (hasWeeds → badMultiplier ×2); PTBR Farming_Weeds | 31 |
| agr-mato-doenca | Planta doente com mato dá chance dupla de a doença passar para as plantas vizinhas | B42.22 | arquivos do jogo B42.22 do Jose: SFarmingSystem.lua diseaseClosePlant (hasWeeds → segunda rolagem) | 31 |
| agr-inverno | No inverno, ao ar livre, só as plantas resistentes ao frio escapam; o repolho é uma delas | B42.22 | arquivos do jogo B42.22 do Jose: SFarmingSystem.lua changeHealth (Winter and not coldHardy → cursed); Cabbages coldHardy = true | 31 |
