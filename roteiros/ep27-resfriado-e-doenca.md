---
ep: 27
tema: Resfriado e Doença
responsavel: jose
status: validado
build: B42.22
fatos: [resf-espirro, resf-causa, resf-niveis, resf-lenco, resf-malva, doe-niveis, peso-cozida, doe-capim, doe-limpeza, doe-tracos]
video: (sem rascunho ainda)
---

# EP 27 — Resfriado e Doença · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** Resfriado e doença não são a infecção zumbi — e cada um tem o seu remédio no mato.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [sério] "Um espirro na hora errada e a horda te acha."
- VISUAL: 3D noite: personagem agachado espirra; zumbis viram a cabeça.
- ÍCONES: Item_Tissue
- FATOS: resf-espirro

**1.** [calmo] "Chuva, neve e neblina te deixam molhado e com frio. Ficou assim muito tempo, vem o resfriado."
- VISUAL: Chuva; Status_Wet; moodle de resfriado entrando.
- ÍCONES: Status_Wet, Status_TemperatureLow
- FATOS: resf-causa

**2.** [calmo] "Ele vai de Nariz Escorrendo até Resfriado Terrível: espirro, depois tosse, e você fica lento."
- VISUAL: Moodle nos 4 nomes do jogo (sem ícone próprio → chip).
- ÍCONES: —
- FATOS: resf-niveis

**3.** [tenso] "E espirro e tosse fazem barulho: atraem zumbi."
- VISUAL: 3D: espirro; onda de som saindo do personagem; zumbis virando.
- ÍCONES: —
- FATOS: resf-espirro

**4.** [confiante] "Lenço de papel na mão abafa os dois. E a malva-comum, achada na coleta, alivia o resfriado."
- VISUAL: Item_Tissue + tooltip; Item_CommonMallow + tooltip.
- ÍCONES: Item_Tissue, Item_CommonMallow
- FATOS: resf-lenco, resf-malva

**5.** [sério] "Doença é outro moodle: de Mal-estar até Febre. O jogo avisa: risco crescente de virar comida de rato."
- VISUAL: Mood_Ill nos 4 nomes; texto do jogo.
- ÍCONES: Mood_Ill, Mood_Nauseous
- FATOS: doe-niveis

**6.** [calmo] "Comida estragada ou mal cozida dá intoxicação. Cozinhar reduz o risco, e o capim-limão trata a intoxicação leve."
- VISUAL: Panela; Item_LemonGrass + tooltip.
- ÍCONES: Item_LemonGrass
- FATOS: peso-cozida, doe-capim

**7.** [calmo] "E se lava: corpo sujo aumenta a chance de ferida infeccionar."
- VISUAL: Personagem se lavando com sabão.
- ÍCONES: —
- FATOS: doe-limpeza

**8.** [confiante] "Na criação, Resiliente fica menos doente; Baixa Imunidade, mais."
- VISUAL: Chips dos traços.
- ÍCONES: —
- FATOS: doe-tracos

**9.** [confiante] "Seco, limpo e com malva no bolso."
- VISUAL: CTA.
- ÍCONES: Item_CommonMallow
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Item_Tissue` ✓
- `Status_Wet` ✓ moodle
- `Status_TemperatureLow` ✓ moodle
- `Item_CommonMallow` ✓
- `Mood_Ill` ✓ moodle
- `Mood_Nauseous` ✓ moodle
- `Item_LemonGrass` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `JL_MalePlayer_SneezingHeavy_01` — frase 0 (+0.4s, -12 dB) ✓
- `zombierand3` — frase 0 (+1.2s, -18 dB) ✓
- `ambientOutsideHeavyRain` — frase 1 (+0s, -22 dB) ✓
- `JL_MalePlayer_Coughing_01` — frase 2 (+0.8s, -14 dB) ✓
- `JL_MalePlayer_SneezingLight_01` — frase 3 (+0.2s, -12 dB) ✓
- `zombierand5` — frase 3 (+1.0s, -18 dB) ✓
- `JL_MalePlayer_Muffled_Cough_01` — frase 4 (+0.4s, -14 dB) ✓
- `JL_MalePlayer_Vomiting_01` — frase 5 (+0.6s, -16 dB) ✓

**Música:** `the_inevitable` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- tooltip do Lenço de Papel / Malva-comum: **sem print** → usar chip/ícone; print opcional (tirar no jogo em PT-BR)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S agachado (noite), na chuva, se lavando; Z virando a cabeça; panela PZ.itemModel('cookingpot')

**Manifesto:** `projeto/ep27.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep27.cfg.js` + `ep27.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `resfriado-e-doenca` e os ids citados).
