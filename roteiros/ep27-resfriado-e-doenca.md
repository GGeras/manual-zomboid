---
ep: 27
tema: Resfriado e Doença
responsavel: jose
status: validado
build: B42.22
fatos: [resf-niveis, resf-causa, resf-lenco, resf-malva, doe-niveis, peso-cozida, doe-capim, doe-limpeza, doe-tracos]
video: (sem rascunho ainda)
---

# EP 27 — Resfriado e Doença · ROTEIRO v5 (ideia + dados confirmados, 23/11/2026)

**Ideia-guia:** Resfriado e doença não são a infecção zumbi — e cada um tem o seu remédio no mato.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez. **Sem rascunho de vídeo ainda.**

## Frases (narração proposta)

**0.** [sério] "Um espirro na hora errada e a horda te acha."
- VISUAL: 3D noite: personagem agachado espirra; zumbis viram a cabeça.
- ÍCONES: Item_Tissue
- FATOS: resf-niveis

**1.** [calmo] "Chuva, neve e neblina te deixam molhado e com frio. Ficou assim muito tempo, vem o resfriado."
- VISUAL: Chuva; Status_Wet; moodle de resfriado entrando.
- ÍCONES: Status_Wet, Status_TemperatureLow
- FATOS: resf-causa

**2.** [calmo] "Ele vai de Nariz Escorrendo até Resfriado Terrível: espirro, depois tosse, e você fica lento."
- VISUAL: Moodle nos 4 nomes do jogo (sem ícone próprio → chip).
- ÍCONES: —
- FATOS: resf-niveis

**3.** [confiante] "Lenço de papel na mão abafa espirro e tosse. E a malva-comum, achada na coleta, alivia o resfriado."
- VISUAL: Item_Tissue + tooltip; Item_CommonMallow + tooltip.
- ÍCONES: Item_Tissue, Item_CommonMallow
- FATOS: resf-lenco, resf-malva

**4.** [sério] "Doença é outro moodle: de Mal-estar até Febre. O jogo avisa: risco crescente de virar comida de rato."
- VISUAL: Mood_Ill nos 4 nomes; texto do jogo.
- ÍCONES: Mood_Ill, Mood_Nauseous
- FATOS: doe-niveis

**5.** [calmo] "Comida estragada ou mal cozida dá intoxicação. Cozinhar reduz o risco, e o capim-limão trata a intoxicação leve."
- VISUAL: Panela; Item_LemonGrass + tooltip.
- ÍCONES: Item_LemonGrass
- FATOS: peso-cozida, doe-capim

**6.** [calmo] "E se lava: corpo sujo aumenta a chance de ferida infeccionar."
- VISUAL: Personagem se lavando com sabão.
- ÍCONES: —
- FATOS: doe-limpeza

**7.** [confiante] "Na criação, Resiliente fica menos doente; Baixa Imunidade, mais."
- VISUAL: Chips dos traços.
- ÍCONES: —
- FATOS: doe-tracos

**8.** [confiante] "Seco, limpo e com malva no bolso."
- VISUAL: CTA.
- ÍCONES: Item_CommonMallow
- FATOS: —

## Fatos
Todos em `info-validada/` (ver tabela do tema `resfriado-e-doenca` e os ids citados).
