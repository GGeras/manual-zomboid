---
ep: 24
tema: Pânico e Estresse
responsavel: jose
status: validado
build: B42.22
fatos: [pan-mira, pan-niveis, pan-corpo, est-niveis, pan-calmante, est-leitura, est-fumante, pan-tracos]
video: (sem rascunho ainda)
---

# EP 24 — Pânico e Estresse · ROTEIRO v5 (ideia + dados confirmados, 23/11/2026)

**Ideia-guia:** Pânico treme a mão na hora; estresse treme a mão por dias — os dois atrapalham a luta.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez. **Sem rascunho de vídeo ainda.**

## Frases (narração proposta)

**0.** [tenso] "Sua mão treme, e o tiro sai torto."
- VISUAL: 3D: personagem mirando, retícula balançando; Mood_Panicked.
- ÍCONES: Mood_Panicked
- FATOS: pan-mira

**1.** [calmo] "Isso é pânico. O moodle vai de Nervosismo até Terror. No segundo nível, o jogo já diz: mãos trêmulas."
- VISUAL: Moodle real nos 4 nomes; texto do jogo.
- ÍCONES: Mood_Panicked
- FATOS: pan-niveis

**2.** [sério] "E os moodles mexem na sua mira e na sua luta: em pânico e cansado, você erra muito mais."
- VISUAL: Retícula aumentando; golpe fraco.
- ÍCONES: Mood_Panicked, Mood_Sleepy
- FATOS: pan-mira, pan-corpo

**3.** [calmo] "Estresse é outro moodle: vai de Tensão até À Beira do Colapso. No terceiro nível: mãos trêmulas, impossível pensar direito."
- VISUAL: Mood_Stressed nos 4 nomes; texto do jogo.
- ÍCONES: Mood_Stressed
- FATOS: est-niveis

**4.** [confiante] "Pra pânico existem os Calmantes: o remédio reduz o pânico."
- VISUAL: Item_PillsBetablocker + tooltip do jogo.
- ÍCONES: Item_PillsBetablocker
- FATOS: pan-calmante

**5.** [confiante] "Pra estresse, leitura: livro tira mais, depois quadrinhos, depois revista. E se for fumante, o cigarro acalma, mas sem ele a tristeza sobe."
- VISUAL: Ranking dos 3 itens de leitura; cigarro com ✓ e ✗.
- ÍCONES: Item_Book, Item_ComicBook, Item_Magazine, Item_Cigarette
- FATOS: est-leitura, est-fumante

**6.** [calmo] "Na criação, Corajoso entra menos em pânico, Covarde muito mais, e Dessensibilização quase nada."
- VISUAL: Chips dos traços.
- ÍCONES: —
- FATOS: pan-tracos

**7.** [tenso] "Cuidado com Agorafóbico e Claustrofóbico: um entra em pânico ao ar livre, o outro em lugar fechado pequeno."
- VISUAL: Split rua × quartinho.
- ÍCONES: Mood_Panicked
- FATOS: pan-tracos

**8.** [confiante] "Calma na mão, tiro na cabeça."
- VISUAL: CTA.
- ÍCONES: —
- FATOS: —

## Fatos
Todos em `info-validada/` (ver tabela do tema `panico-e-estresse` e os ids citados).
