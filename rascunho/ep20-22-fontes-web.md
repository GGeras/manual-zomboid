# EP20–22 — versão com fontes web (PR #12)

O PR #12 validou os fatos do EP20–22 em paralelo, com fontes web B42.20+. A main já tinha a v6, validada nos **arquivos do jogo B42.22** (`info-validada/sono.md`, `coleta.md`, `fadiga-muscular.md`).
No merge (23/11) ficou a v6 da main, para não sobrepor fatos e roteiros já aceitos. A versão do PR #12 está guardada aqui, **não validada**.
- Quer usar algum? Confira a fonte, mova a linha para `info-validada/` com um id novo e rode `python ferramentas/validar.py --gerar`.
- "Mesmo id na main": o id existe na main com outro texto. Fontes diferentes dizendo coisas diferentes = não afirma (CLAUDE.md, seção 3).

## sono

| ref (PR #12) | fato | build | fonte | mesmo id na main |
|---|---|---|---|---|
| sono-niveis | Moodle de cansaço tem 4 níveis (Sonolência · Cansaço · Cansaço Intenso · Cansaço Absurdo); a cada nível o dano corpo a corpo cai | B42.21 | pzfans.com/ProjectZomboidB42Moodles (Build 42.21, 31/10/2026: "Drowsy → Tired → Very Tired → Ridiculously Tired", dano ×0,5/×0,2/×0,1/×0,05) + nomes em nomes-ptbr.md (PTBR B42.22) | sim |
| sono-descanso | Descansar recupera fôlego (Endurance), não cansaço; cansaço sai dormindo | B42.20.2 | projectzomboid.wiki/guides/sleep-rest (atualizado 12/11/2026, cita 42.22+) + gamers.wiki build-42-sleep-quality-beds-wake-ups (Stable 42.20.2) | sim |
| sono-cama | Cama boa encurta o sono; cama ruim/banco de carro alonga; chão alonga ainda mais; superfície improvisada pode dar dor no pescoço | B42.20.2 | projectzomboid.wiki/guides/sleep-rest (12/11/2026) + gamers.wiki build-42-sleep-quality-beds-wake-ups (Stable 42.20.2: "neck pain") | sim |
| sono-travesseiro | Travesseiro melhora a qualidade da cama e reduz a chance de dor no pescoço | B42.20.2 | gamers.wiki build-42-sleep-quality-beds-wake-ups (Stable 42.20.2) + projectzomboid.wiki/guides/sleep-rest (12/11/2026) | sim |
| sono-bloqueio | Zumbi perto, pânico ou dor forte impedem dormir; desde 42.22.2, o moodle Mau Cheiro (fumaça tóxica ou cheiro de cadáver) desativa a opção de dormir | B42.22.2 | patched.gg 42.22.2 (09/11/2026: "sleep option is disabled ... while the Bad Smell moodle is active") + projectzomboid.wiki/guides/sleep-rest ("Build 42.22+") | sim |
| sono-remedio | Analgésico resolve quando só a dor bloqueia; remédio para dormir em dose alta passa por cima de dor e pânico | B42.22 | projectzomboid.wiki/guides/sleep-rest (12/11/2026, página cita Build 42.22+) | sim |
| sono-cafe | Café só dá uma janela curta extra; não substitui a cama | B42.22 | projectzomboid.wiki/guides/sleep-rest (12/11/2026, cita 42.22+) + pzfans B42 moodles (42.21: café tira um pouco do cansaço) | não |

## coleta

| ref (PR #12) | fato | build | fonte | mesmo id na main |
|---|---|---|---|---|
| col-raio | Na busca, os itens aparecem num raio ao seu redor: 3 quadrados na Coleta 0 até 10 na Coleta 10 (valor base, antes de bônus) | B42.20 | build42guide.wiki/crafting/build-42-foraging (Verified on 42.20: "3–10 tiles base, +0.7 por nível") + pzfans foraging guide (42.19, apoio: 3 + 7×nível/10) | sim |
| col-penal | Escuro e pânico encolhem muito o raio; correr anula a busca; agachado dá bônus pequeno (+10%) | B42.20 | build42guide.wiki/crafting/build-42-foraging (42.20: "darkness ... 1.5 tiles", "panic ... 95%", "sprint kills search mode", "sneak +10%") + pzfans foraging guide (42.19, apoio) | não |
| col-inicio | Lenha e pedra aparecem desde a Coleta 0 | B42.20 | build42guide.wiki/crafting/build-42-foraging (42.20: "Firewood & Stones at 0") + pzfans foraging guide (42.19, apoio) | não |
| col-veneno | Frutinhas e cogumelos podem vir envenenados; o risco cai com o nível de Coleta; o conhecimento de Herbalista identifica o veneno | B42.20 | build42guide.wiki/crafting/build-42-foraging (42.20: "risk falls by 5% per foraging level, ... Herbalist knowledge detects poison") + pzfans foraging guide (42.19, apoio) | não |
| col-inverno | No inverno o mato tem bem menos comida (frutinhas e cogumelos quase somem) e a neve reduz a chance de achar planta e frutinha | B42.20 | build42guide.wiki/crafting/build-42-foraging (42.20: inverno "most berries, mushrooms ... unfindable"; neve "berries −10, plants −50") + projectzomboid.wiki/guides/foraging (28/09/2026: "Winter foraging yields are minimal") | não |

## fadiga-muscular

| ref (PR #12) | fato | build | fonte | mesmo id na main |
|---|---|---|---|---|
| fad-mecanica | Distensão muscular acumula por parte do corpo ao golpear e ao carregar peso; aparece por parte no painel de saúde; dá dor, e dor alta deixa o ataque lento | B42.20.4 | pzfans.com/ProjectZomboidB42MuscleStrain (Build 42.20.4: "tracked per body area", "Swinging weapons and carrying heavy loads apply it") + projectzomboid.wiki/guides/muscle-strain (14/11/2026: "It feeds Pain", "High Pain slows attacks") | não |
| fad-partes | Golpear pesa nos braços; carregar peso demais pesa nas costas/tronco | B42.21 | projectzomboid.wiki/guides/muscle-strain (14/11/2026: "arms", "back/torso strain while over-encumbered") + pzfans (42.20.4: braços) + build42guide.wiki/survival/build-42-combat (42.21/42.22: braço/antebraço) | não |
| fad-arma | Arma mais pesada causa mais distensão | B42.21 | build42guide.wiki/survival/build-42-combat (Verified on 42.21 stable & 42.22 Pre-Release: custo = 60% do peso da arma + …) + projectzomboid.wiki/guides/muscle-strain ("Heavier weapons ... load more") | sim |
| fad-pisao | Em zumbi caído, pisar ou empurrar poupa golpes cheios | B42.20.4 | pzfans.com/ProjectZomboidB42MuscleStrain (42.20.4: "Stomps and shoves on downed or isolated zombies reduce empty full-power swings") + build42guide.wiki/survival/build-42-combat (42.21: pisão com custo fixo) | sim |
| fad-analgesico | Analgésico tira a dor, mas não apaga a distensão | B42 | projectzomboid.wiki/guides/muscle-strain (14/11/2026, página cita 42.22: "Painkillers blunt the moodle; they do not erase the underlying strain") | sim |
| fad-reduz | Força alta e nível da habilidade da arma reduzem o acúmulo | B42.21 | build42guide.wiki/survival/build-42-combat (42.21/42.22) + pzfans (42.20.4: "Strength reduces muscle strain") + projectzomboid.wiki/guides/muscle-strain | sim |
| fad-dicas | Golpe que pega vários zumbis cansa mais: lute com poucos por vez; descanso e sono recuperam, sem tempo fixo; fator ajustável no sandbox | B42.21 | build42guide.wiki/survival/build-42-combat (42.21: "2× for two zombies, 3× for three") + pzfans (42.20.4: "no fixed 'N hours' timer", Muscle Strain Factor) + projectzomboid.wiki/guides/muscle-strain | não |
