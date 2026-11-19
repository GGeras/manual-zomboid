---
ep: 22
tema: Fadiga Muscular
responsavel: jose
status: rascunho
build: B42.22
fatos: [fad-mecanica, fad-arma, fad-partes, fad-analgesico, fad-reduz, fad-dicas]
video: (link do Drive em videos/LINKS.md)
---

# EP 22 — Fadiga Muscular  (estimativa: 55s)

Ideia-guia: **cada parte do corpo tem seu próprio cansaço — luta inteligente divide o esforço.**
Selo: `BUILD 42.22`. Nenhum número na tela (as fórmulas que existem são de builds antigas/inconsistentes).

## Fatos conferidos
| id (fatos.json ou novo) | fato | status | fonte (URL) + build |
|---|---|---|---|
| fad-mecanica | Fadiga (tensão) muscular acumula por parte do corpo ao golpear e ao carregar peso demais; aparece no painel de saúde por parte; deixa mais lento e dá dor | OK | https://pzfans.com/ProjectZomboidB42MuscleStrain (42.20.4: linhas "Muscle Strain" no painel de saúde; braço tira capacidade de luta, perna tira velocidade) + https://projectzomboid.wiki/guides/muscle-strain/ (B42, atualizado 14/11/2026: dor sobe, dor alta deixa o ataque lento) |
| fad-partes | Golpear: braços; peso demais: costas/tronco; cama ruim: pescoço. **Correr → perna: sem fonte 42.20+** (só guia de jan/2025, B42.0) | CORRIGIR (remover "perna quando corre") | https://projectzomboid.wiki/guides/muscle-strain/ (B42 2026: braços; costas/tronco ao carregar) + https://pzfans.com/ProjectZomboidB42MuscleStrain (42.20.4) + https://gamers.wiki/en/games/project-zomboid/guides/project-zomboid-build-42-sleep-quality-beds-wake-ups (42.20.2: superfície ruim dá dor no pescoço) |
| fad-arma | Arma mais pesada cansa mais. **"Longa/curta" sem fonte recente** (só B42.0) | CORRIGIR (só peso) | https://build42guide.wiki/survival/build-42-combat (verificado 42.21/42.22 pré: custo do golpe cresce com o peso da arma) + https://projectzomboid.wiki/guides/muscle-strain/ (B42 2026: "heavier weapons… load more") |
| fad-pisao | Pisar em zumbi caído custa menos esforço que um golpe e divide o esforço (braço e às vezes perna) | NOVO | https://build42guide.wiki/survival/build-42-combat (42.21/42.22 pré: pisão tem custo baixo fixo) + https://projectzomboid.wiki/guides/muscle-strain/ (B42 2026: pisões = braços e às vezes pernas) + https://pzfans.com/ProjectZomboidB42MuscleStrain (42.20.4: pisões/empurrões em caídos poupam golpes) |
| fad-analgesico | Analgésico tira a dor, mas não apaga a tensão, que continua acumulando. "Não devolve a velocidade" só tem fonte B42.0 | CORRIGIR (tirar "não devolve a velocidade") | https://projectzomboid.wiki/guides/muscle-strain/ (B42 2026: "blunt the moodle; do not erase the underlying strain") + https://gameluster.com/project-zomboid-build-42-guide-muscle-strain/ (B42.0, apoio) |
| fad-reduz | Força alta e nível da habilidade da arma reduzem o acúmulo | OK | https://pzfans.com/ProjectZomboidB42MuscleStrain (42.20.4) + https://build42guide.wiki/survival/build-42-combat (42.21/42.22 pré) |
| fad-dicas | Lutar com poucos por vez (golpe que pega vários cansa mais); descanso/sono recupera, sem tempo fixo; fator ajustável no sandbox | OK | https://pzfans.com/ProjectZomboidB42MuscleStrain (42.20.4) + https://projectzomboid.wiki/guides/muscle-strain/ (B42 2026) + https://build42guide.wiki/survival/build-42-combat |

## Frases (narração final)
1. "Na versão quarenta e dois, seu braço cansa de bater."
   - TELA: 3D — personagem principal com machado de bombeiro na mão, rua da cidade, luz dia | título: **Seu braço** / **cansa de bater**
   - 0–1s: golpe; selo "BUILD 42.22". 1–2s: punch-in no braço, tremida leve.
   - ÍCONES: Item_Axe  SONS: batSwing (Combate)

2. "É a fadiga muscular. Cada parte do corpo acumula tensão separado, e o painel de saúde mostra onde: braço quando você bate, costas quando carrega peso demais. E dormir em cama ruim pega o pescoço."  [⚠ removido "perna quando corre" (sem fonte 42.20+); + explica onde ver: painel de saúde]
   - TELA: tela simulada — painel de saúde (silhueta do corpo + lista de partes) | título: **Cada parte** / **cansa sozinha**
   - 0–2s: painel entra; silhueta neutra.
   - 2–4s: braços acendem laranja + linha "BRAÇO — TENSÃO MUSCULAR" (com Item_Axe ao lado).
   - 4–6s: costas acendem + Status_HeavyLoad; 6–7s: pescoço acende + Item_Mattress com ✗.
   - ÍCONES: Item_Axe, Status_HeavyLoad, Item_Mattress  SONS: PZ_PutInBag (Itens e Comida)

3. "Tensão alta deixa você mais lento e dá dor."
   - TELA: split | título: **Mais lento** / **e com dor**
   - 0–2s: barra de velocidade do golpe encolhendo (sem números); Mood_Pained entra na lateral.
   - ÍCONES: Mood_Pained  SONS: male_outofbreath_01 (Personagem)

4. "Arma pesada cansa mais o braço. Leve, menos."  [⚠ "longa e pesada / curta e leve" → só peso (comprimento sem fonte recente)]
   - TELA: comparação lado a lado (quadros de inventário) | título: **Pesada cansa** / **mais**
   - 0–1s: Item_Sledgehammer2 + barra de tensão grande ✗. 1–3s: Item_HuntingKnife + barra pequena ✓ (barras sem escala).
   - ÍCONES: Item_Sledgehammer2, Item_HuntingKnife  SONS: sledgehammer (Combate), stab1 (Combate)

5. "Exemplo: um grupo grande de zumbis, e você só no machado. Golpe atrás de golpe, a tensão do braço sobe, o ataque fica lento, e o último te pega."  [⚠ "dez zumbis" → "um grupo grande" (sem número ilustrativo); "barra do braço" → "tensão do braço" (o painel mostra texto por parte, não barra)]
   - TELA: 3D — zumbis andando, personagem com machado de bombeiro, luz vermelho no fim | título: **Golpe atrás** / **de golpe**
   - 0–2s: vários zumbis chegando. 2–4s: golpes em sequência; mini painel de saúde no canto: braço passa de "TENSÃO LEVE" → "TENSÃO" (laranja → vermelho).
   - 4–6s: animação do golpe desacelera; último zumbi agarra; luz vermelho.
   - ÍCONES: Item_Axe  SONS: batSwing, zombiehit2 (Combate), zombiebite (Zumbis)

6. "Agora o certo: derrubou, em vez de outro golpe, pisa. Pisar cansa menos que golpear e divide o esforço. E puxa poucos zumbis por vez."  [⚠ "Pisar usa a perna" → "cansa menos que golpear e divide o esforço" (fonte 2026: pisão pesa no braço e às vezes na perna, com custo menor)]
   - TELA: tela simulada — painel de saúde + ícones de ação | título: **Derrubou?** / **Pisa**
   - 0–2s: 3D — golpe derruba o zumbi (corte seco antes da queda, sem cena nova de zumbi caído); chip "PISAR" + ✓.
   - 2–4s: no painel, tensão do braço para de subir e o esforço se divide (braço sobe pouco) ✓.
   - 4–6s: vista simplificada: um zumbi por vez vindo, ✓; grupo grande, ✗.
   - ÍCONES: Item_Axe  SONS: PZ_HeadSmash_01 (Combate)

7. "Analgésico tira a dor, mas a tensão continua lá, e continua subindo."  [⚠ tirado "não devolve a velocidade" (só fonte B42.0); mantido o que a fonte 2026 confirma]
   - TELA: tela simulada — inventário + painel de saúde | título: **Analgésico** / **não cura tensão**
   - 0–2s: cursor usa Item_PillsPainkiller → Mood_Pained some ✓.
   - 2–4s: no painel, linha "TENSÃO MUSCULAR" do braço continua acesa e fica mais forte ✗.
   - ÍCONES: Item_PillsPainkiller, Mood_Pained  SONS: PZ_Swallowing (Itens e Comida)

8. "Força alta e prática com a arma fazem a tensão subir mais devagar."  [⚠ leve: "prática com a arma" mantido, a tela explica = nível da habilidade daquela arma]
   - TELA: tela simulada — painel de habilidades | título: **Força e prática** / **seguram a tensão**
   - 0–2s: trait_strong entra; linha "FORÇA" com barra de nível subindo (sem número). 2–4s: Item_Axe + linha "MACHADO" (habilidade da arma) subindo; barra de tensão sobe mais devagar ✓.
   - ÍCONES: trait_strong, Item_Axe  SONS: levelup (Personagem)

9. "Descansa pra passar. Lutar cansado é morrer cansado."
   - TELA: 3D — casa simples com janela, luz amanhecer, personagem principal sentado/parado | título: **Descansa** / **antes de lutar**
   - 0–2s: painel de saúde no canto: linhas de tensão apagando aos poucos (sem timer). 2–3s: corte seco para preto com o título.
   - ÍCONES: —  SONS: heart (Personagem)

## Pendências para o Jose confirmar
- Na 42.22, correr dá tensão na perna? (sim/não — se sim, volta "perna quando corre" na frase 2)
- No painel de saúde em PT-BR, o texto é "Tensão Muscular"? (sim/não — se não, usar o nome que aparece)
- Arma longa cansa mais que curta, mesmo com o mesmo peso? (sim/não — sem fonte recente)

> **RASCUNHO** (v4): falta aplicar o método atual (doc `canal/processo/11-regras-roteiro-e-pipeline.md`).
