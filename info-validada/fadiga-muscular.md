---
tema: fadiga-muscular
status: validado
atualizado: 2026-11-23
---
# Distensão muscular — fatos validados (B42)

Nome no painel de saúde em PT-BR: **Distensão Muscular / Leve** (`nomes-ptbr.md`). Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| fad-mecanica | Distensão muscular acumula por parte do corpo ao golpear e ao carregar peso; aparece por parte no painel de saúde; dá dor, e dor alta deixa o ataque lento | B42.20.4 | pzfans.com/ProjectZomboidB42MuscleStrain (Build 42.20.4: "tracked per body area", "Swinging weapons and carrying heavy loads apply it") + projectzomboid.wiki/guides/muscle-strain (14/11/2026: "It feeds Pain", "High Pain slows attacks") | 22 |
| fad-partes | Golpear pesa nos braços; carregar peso demais pesa nas costas/tronco | B42.21 | projectzomboid.wiki/guides/muscle-strain (14/11/2026: "arms", "back/torso strain while over-encumbered") + pzfans (42.20.4: braços) + build42guide.wiki/survival/build-42-combat (42.21/42.22: braço/antebraço) | 22 |
| fad-arma | Arma mais pesada causa mais distensão | B42.21 | build42guide.wiki/survival/build-42-combat (Verified on 42.21 stable & 42.22 Pre-Release: custo = 60% do peso da arma + …) + projectzomboid.wiki/guides/muscle-strain ("Heavier weapons ... load more") | 22 |
| fad-pisao | Em zumbi caído, pisar ou empurrar poupa golpes cheios | B42.20.4 | pzfans.com/ProjectZomboidB42MuscleStrain (42.20.4: "Stomps and shoves on downed or isolated zombies reduce empty full-power swings") + build42guide.wiki/survival/build-42-combat (42.21: pisão com custo fixo) | 22 |
| fad-analgesico | Analgésico tira a dor, mas não apaga a distensão | B42 | projectzomboid.wiki/guides/muscle-strain (14/11/2026, página cita 42.22: "Painkillers blunt the moodle; they do not erase the underlying strain") | 22 |
| fad-reduz | Força alta e nível da habilidade da arma reduzem o acúmulo | B42.21 | build42guide.wiki/survival/build-42-combat (42.21/42.22) + pzfans (42.20.4: "Strength reduces muscle strain") + projectzomboid.wiki/guides/muscle-strain | 22 |
| fad-dicas | Golpe que pega vários zumbis cansa mais: lute com poucos por vez; descanso e sono recuperam, sem tempo fixo; fator ajustável no sandbox | B42.21 | build42guide.wiki/survival/build-42-combat (42.21: "2× for two zombies, 3× for three") + pzfans (42.20.4: "no fixed 'N hours' timer", Muscle Strain Factor) + projectzomboid.wiki/guides/muscle-strain | 22 |
