---
ep: 28
tema: Tédio e Tristeza
responsavel: jose
status: validado
build: B42.22
fatos: [ted-niveis, tri-niveis, tri-leitura, tri-comida, tri-comida-bons, est-fumante, tri-antidep]
video: (sem rascunho ainda)
---

# EP 28 — Tédio e Tristeza · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** Tédio e tristeza são moodles de verdade — e o jogo te dá as ferramentas pra tirar os dois.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [sério] "No apocalipse, até ficar entediado é perigoso."
- VISUAL: 3D: personagem parado na janela; Mood_Bored.
- ÍCONES: Mood_Bored
- FATOS: ted-niveis

**1.** [calmo] "O tédio vai de Um Pouco de Tédio até Tédio Extremo. O jogo já avisa: ocupe-se ou procure alguma distração."
- VISUAL: Moodle real nos 4 nomes; texto do jogo.
- ÍCONES: Mood_Bored
- FATOS: ted-niveis

**2.** [sério] "A tristeza é outro moodle: vai de Triste até Sem Esperança."
- VISUAL: Mood_Sad nos 4 nomes.
- ÍCONES: Mood_Sad
- FATOS: tri-niveis

**3.** [confiante] "Leitura tira os dois: livro e revista em quadrinhos tiram tédio e tristeza; revista tira tédio."
- VISUAL: Cards de leitura com ícones de efeito (sem números).
- ÍCONES: Item_Book, Item_ComicBook, Item_Magazine
- FATOS: tri-leitura

**4.** [calmo] "Comida também conta: ensopado, sorvete e croissant tiram tristeza. E tem comida que só funciona depois de cozida."
- VISUAL: 3D: floresta, fogueira, panela de ensopado, come a tigela; ícones Panela de Ensopado, Sorvete, Croissant (tristeza ↓) + chip "Cozinhe para remover a penalidade".
- ÍCONES: Item_Pot_Forged_Stew, Item_Icecream, Item_Croissant
- FATOS: tri-comida, tri-comida-bons

**5.** [calmo] "Fumante fica triste sem cigarro. E o antidepressivo reduz a tristeza devagar, ao longo de vários dias."
- VISUAL: Cigarro; Item_PillsAntidepressant com barra caindo devagar.
- ÍCONES: Item_Cigarette, Item_PillsAntidepressant
- FATOS: est-fumante, tri-antidep

**6.** [confiante] "Base com livros, comida boa e cozida, e o humor segura."
- VISUAL: CTA.
- ÍCONES: Item_Book
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Mood_Bored` ✓ moodle
- `Mood_Sad` ✓ moodle
- `Item_Book` ✓
- `Item_ComicBook` ✓
- `Item_Magazine` ✓
- `Item_Cigarette` ✓
- `Item_PillsAntidepressant` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `BH_MalePlayer_SubtleBoredSigh_01` — frase 0 (+0.5s, -14 dB) ✓
- `BH_MalePlayer_SubtleSadSigh_01` — frase 2 (+0.3s, -14 dB) ✓
- `PZ_Eating` — frase 4 (+0.4s, -16 dB) ✓
- `BH_MalePlayer_SubtleReliefSigh_01` — frase 6 (+0.3s, -14 dB) ✓

**Música:** `saying_goodbye` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- tooltip de comida com Tédio e Tristeza: **sem print** → usar chip/ícone; print opcional (tirar no jogo em PT-BR)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S parado na janela, lendo; ícones de leitura e comida

**Manifesto:** `projeto/ep28.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep28.cfg.js` + `ep28.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `tedio-e-tristeza` e os ids citados).
