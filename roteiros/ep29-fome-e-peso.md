---
ep: 29
tema: Fome e Peso do Corpo
responsavel: jose
status: validado
build: B42.22
fatos: [peso-calorias, fome-niveis, peso-dieta, peso-sistema, peso-tracos, peso-cozida, peso-inverno]
video: (sem rascunho ainda)
---

# EP 29 — Fome e Peso do Corpo · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** Fome e peso são duas contas diferentes: a fome é o moodle, o peso são as calorias.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [sério] "Você pode comer o dia inteiro e mesmo assim emagrecer."
- VISUAL: 3D: personagem comendo alface; balança descendo.
- ÍCONES: Status_Hunger
- FATOS: peso-calorias

**1.** [calmo] "A fome é um moodle: de Fome Leve até Morrendo de Fome. E ela tira suas forças."
- VISUAL: Moodle real nos 4 nomes.
- ÍCONES: Status_Hunger
- FATOS: fome-niveis

**2.** [confiante] "Mas o peso do corpo depende das calorias. Caldo, fruta e legume matam a fome e quase não engordam. Manteiga, banha, chocolate e carne gorda engordam."
- VISUAL: Split comida leve × calórica com ícones; balança.
- ÍCONES: Item_BerryBlue, Item_Butter, Item_Lard
- FATOS: peso-calorias

**3.** [sério] "O próprio jogo avisa: sem dieta balanceada, você ganha ou perde peso."
- VISUAL: Texto do jogo em citação.
- ÍCONES: —
- FATOS: peso-dieta, peso-sistema

**4.** [tenso] "Abaixo do Peso: pouca força, pouca resistência, mais lesão. Acima do Peso: corre mais devagar e cansa rápido."
- VISUAL: Barra de peso com as faixas e os nomes dos traços do jogo.
- ÍCONES: —
- FATOS: peso-tracos

**5.** [calmo] "Cozinhar ajuda: comida cozida é mais nutritiva e segura a fome por mais tempo."
- VISUAL: Panela no fogo; barra de saciedade maior.
- ÍCONES: —
- FATOS: peso-cozida

**6.** [calmo] "E no inverno você gasta mais. Bem alimentado aguenta melhor o frio."
- VISUAL: Neve; personagem comendo; termômetro estável.
- ÍCONES: Status_TemperatureLow
- FATOS: peso-inverno

**7.** [confiante] "Fome é o alarme. Caloria é o combustível."
- VISUAL: CTA.
- ÍCONES: —
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Status_Hunger` ✓ moodle
- `Item_BerryBlue` ✓
- `Item_Butter` ✓
- `Item_Lard` ✓
- `Status_TemperatureLow` ✓ moodle

**Sons do jogo** (`projeto/assets/sfx`):
- `PZ_Eating` — frase 0 (+0.3s, -14 dB) ✓
- `PZ_FoodSlicing` — frase 5 (+0.3s, -14 dB) ✓
- `BH_MalePlayer_FreezingShivers_01` — frase 6 (+0.3s, -14 dB) ✓

**Música:** `what_was_lost` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- nenhuma tela necessária (só ícones, moodles e 3D)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S comendo; panela PZ.itemModel('cookingpot'); neve

**Manifesto:** `projeto/ep29.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep29.cfg.js` + `ep29.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `fome-e-peso` e os ids citados).
