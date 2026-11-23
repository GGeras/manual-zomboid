---
ep: 22
tema: Fadiga Muscular
responsavel: jose
status: validado
build: B42.22
fatos: [fad-mecanica, fad-partes, fad-arma, fad-pisao, fad-analgesico, fad-reduz, fad-dicas]
video: (link do Drive em videos/LINKS.md)
---

# EP 22 — Fadiga Muscular  (estimativa: 50s) · v5 validado

Ideia-guia: **cada parte do corpo tem seu próprio cansaço — luta inteligente divide o esforço.**
Selo: `BUILD 42.22`. Nenhum número na tela. Nome no jogo (painel de saúde): **"Distensão Muscular" / "Leve"** (`nomes-ptbr.md`); na fala, "distensão muscular".

## Fatos (todos em `info-validada/fadiga-muscular.md`)
| id | fato usado |
|---|---|
| fad-mecanica | acumula por parte do corpo ao golpear e carregar peso; painel de saúde por parte; dá dor; dor alta deixa o ataque lento |
| fad-partes | golpear: braços; peso demais: costas/tronco |
| fad-arma | arma mais pesada causa mais |
| fad-pisao | em zumbi caído, pisar/empurrar poupa golpes cheios |
| fad-analgesico | analgésico tira a dor, não apaga a distensão |
| fad-reduz | Força alta e nível da habilidade da arma reduzem o acúmulo |
| fad-dicas | golpe que pega vários cansa mais; descanso/sono recupera, sem tempo fixo |

Cortado (sem fonte 42.20+; ver `rascunho/ep20-22-a-revalidar.md`): perna ao correr, pescoço por cama ruim, arma longa × curta, "pisar cansa menos" (comparação direta), "não devolve a velocidade".

## Frases (narração final)
1. "Na versão quarenta e dois, seu braço cansa de bater."
   - TELA: 3D — personagem principal com machado de bombeiro na mão, rua da cidade, luz dia | título: **Seu braço** / **cansa de bater**
   - 0–1s: golpe; selo "BUILD 42.22". 1–2s: punch-in no braço, tremida leve.
   - ÍCONES: Item_Axe  SONS: batSwing (Combate)

2. "É a distensão muscular. Cada parte do corpo acumula separado, e o painel de saúde mostra onde: braço quando você bate, costas quando carrega peso demais."  [v5: nome PT-BR "Distensão Muscular"; pescoço cortado]
   - TELA: réplica da aba Saúde (modelo `projeto/ep15.cfg.js`, print `referencias/telas-do-jogo/aba-saude-*.png`) | título: **Cada parte** / **cansa sozinha**
   - 0–2s: aba Saúde entra; silhueta neutra.
   - 2–4s: braço acende + linha "Distensão Muscular" (com Item_Axe ao lado).
   - 4–6s: costas acendem + Status_HeavyLoad.
   - ÍCONES: Item_Axe, Status_HeavyLoad  SONS: PZ_PutInBag (Itens e Comida)

3. "Ela dá dor. E com dor alta, seu ataque fica lento."  [v5: "mais lento" genérico → ataque lento com dor alta (fonte 2026)]
   - TELA: split | título: **Dor deixa** / **o ataque lento**
   - 0–2s: Mood_Pained entra na lateral; barra de velocidade do golpe encolhendo (sem números).
   - ÍCONES: Mood_Pained  SONS: male_outofbreath_01 (Personagem)

4. "Arma pesada cansa mais o braço. Leve, menos."
   - TELA: comparação lado a lado (quadros de inventário) | título: **Pesada cansa** / **mais**
   - 0–1s: Item_Sledgehammer2 + barra grande ✗. 1–3s: Item_HuntingKnife + barra pequena ✓ (barras sem escala).
   - ÍCONES: Item_Sledgehammer2, Item_HuntingKnife  SONS: sledgehammer (Combate), stab1 (Combate)

5. "Exemplo: um grupo grande de zumbis, e você só no machado. Golpe que pega vários cansa ainda mais. A distensão do braço sobe, a dor vem, o ataque fica lento, e o último te pega."
   - TELA: 3D — zumbis andando, personagem com machado de bombeiro, luz vermelho no fim | título: **Golpe atrás** / **de golpe**
   - 0–2s: vários zumbis chegando. 2–4s: golpes em sequência; mini aba Saúde no canto: braço passa de "Distensão Muscular Leve" → "Distensão Muscular".
   - 4–6s: Mood_Pained; animação do golpe desacelera; último zumbi agarra; luz vermelho.
   - ÍCONES: Item_Axe, Mood_Pained  SONS: batSwing, zombiehit2 (Combate), zombiebite (Zumbis)

6. "Agora o certo: derrubou? Pisa, em vez de gastar outro golpe cheio. E puxa poucos zumbis por vez."  [v5: "pisar cansa menos e divide o esforço" → "poupa golpe cheio" (o que a fonte 42.20.4 diz)]
   - TELA: 3D + chips | título: **Derrubou?** / **Pisa**
   - 0–2s: golpe derruba o zumbi (corte seco antes da queda); chip "PISAR" + ✓.
   - 2–4s: vista simplificada: um zumbi por vez vindo ✓; grupo grande ✗.
   - ÍCONES: Item_Axe  SONS: PZ_HeadSmash_01 (Combate)

7. "Analgésico tira a dor, mas a distensão continua lá."  [v5: "e continua subindo" cortado (fonte só diz que não apaga)]
   - TELA: tela simulada — inventário + mini aba Saúde | título: **Analgésico** / **não cura distensão**
   - 0–2s: cursor usa Item_PillsPainkiller → Mood_Pained some ✓.
   - 2–4s: na aba Saúde, linha "Distensão Muscular" do braço continua acesa ✗.
   - ÍCONES: Item_PillsPainkiller, Mood_Pained  SONS: PZ_Swallowing (Itens e Comida)

8. "Força alta e prática com a arma fazem a distensão subir mais devagar."
   - TELA: painel simples (sem print da aba Habilidades) | título: **Força e prática** / **seguram a distensão**
   - 0–2s: trait_strong entra; linha "Força" com barra subindo (sem número). 2–4s: Item_Axe + linha "Machados" subindo; barra de distensão sobe mais devagar ✓.
   - ÍCONES: trait_strong, Item_Axe  SONS: levelup (Personagem)

9. "Descansa pra passar. Lutar cansado é morrer cansado."
   - TELA: 3D — casa simples com janela, luz amanhecer, personagem principal sentado/parado | título: **Descansa** / **antes de lutar**
   - 0–2s: mini aba Saúde no canto: linhas de distensão apagando aos poucos (sem timer). 2–3s: corte seco para preto com o título.
   - ÍCONES: —  SONS: heart (Personagem)

> **VALIDADO** (23/11/2026): todos os fatos em `info-validada/fadiga-muscular.md`. Próximo passo: prévia para o Jose aprovar.
