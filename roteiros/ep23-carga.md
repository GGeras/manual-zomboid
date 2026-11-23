---
ep: 23
tema: Carga e Peso
responsavel: jose
status: validado
build: B42.22
fatos: [carga-niveis, carga-forca, carga-moodles, carga-dano, fad-carga, carga-escalar, carga-equipada, carga-mochilas, carga-correr, carga-tracos]
video: (sem rascunho ainda)
---

# EP 23 — Carga e Peso · ROTEIRO v5 (ideia + dados confirmados, 23/11/2026)

**Ideia-guia:** Peso demais te deixa lento, te impede de correr e até tira vida — a mochila certa, vestida, resolve.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez. **Sem rascunho de vídeo ainda.**

## Frases (narração proposta)

**0.** [sério] "Pegar tudo que vê é o jeito mais rápido de morrer."
- VISUAL: 3D: personagem saqueando, inventário enchendo; Status_HeavyLoad aparece.
- ÍCONES: Status_HeavyLoad
- FATOS: carga-niveis

**1.** [calmo] "Quanto você carrega depende da sua Força e dos seus moodles. Fome, sede, doença e ferimento diminuem o limite."
- VISUAL: Barra de limite encolhendo a cada moodle entrando.
- ÍCONES: Status_Hunger, Status_Thirst, Mood_Ill
- FATOS: carga-forca, carga-moodles

**2.** [tenso] "Passou do limite, aparece o moodle de carga. Ele vai de Carga Pesada até Sobrecarga Extrema. No começo você fica lento. No fim, o próprio jogo avisa: você vai se machucar."
- VISUAL: Moodle real nos 4 nomes; texto do nível 4 em citação; vida descendo devagar.
- ÍCONES: Status_HeavyLoad
- FATOS: carga-niveis, carga-dano

**3.** [calmo] "E peso demais também cansa as costas e dificulta pular cerca."
- VISUAL: Costas acendem (Distensão); cerca alta com ✗.
- ÍCONES: Status_HeavyLoad
- FATOS: fad-carga, carga-escalar

**4.** [confiante] "A solução é mochila. Mas só funciona vestida nas costas: mochila guardada no inventário não reduz nada."
- VISUAL: Split: mochila nas costas ✓ × mochila dentro do inventário ✗.
- ÍCONES: Item_Backpack
- FATOS: carga-equipada

**5.** [animado] "Cada mochila tem capacidade e redução de peso diferentes. A pequena reduz setenta por cento. A militar, a melhor, reduz oitenta e cinco."
- VISUAL: Cards das mochilas com ícones: Pequena 15 / 70%, Trilha 20 / 75%, Grande de Trilha 22 / 80%, Militar 28 / 85%.
- ÍCONES: Item_Backpack, Item_Hiking_Green, Item_AliceBag
- FATOS: carga-mochilas

**6.** [calmo] "Mas mochila volumosa e roupa pesada podem te impedir de correr: é o moodle Movimento Restrito."
- VISUAL: Status_MovementRestricted aparece; personagem tenta correr e anda.
- ÍCONES: Status_MovementRestricted
- FATOS: carga-correr

**7.** [confiante] "Na criação, Musculoso e Forte aumentam a carga. Fraco e Franzino diminuem."
- VISUAL: Chips dos traços com + e −.
- ÍCONES: —
- FATOS: carga-tracos

**8.** [confiante] "Mochila nas costas, só o que precisa, e a corrida continua sua."
- VISUAL: 3D: personagem correndo com mochila militar; CTA.
- ÍCONES: Item_AliceBag
- FATOS: —

## Fatos
Todos em `info-validada/` (ver tabela do tema `carga` e os ids citados).
