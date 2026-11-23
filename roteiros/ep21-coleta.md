---
ep: 21
tema: Coleta
responsavel: jose
status: validado
build: B42.22
fatos: [col-modo, col-raio, col-nivel, col-clima, col-andar, col-onde, col-herbalista, col-estacao, col-foco]
video: (sem rascunho ainda)
---

# EP 21 — Coleta · ROTEIRO v5 (ideia + dados confirmados, 23/11/2026)

**Ideia-guia:** A busca é um círculo ao seu redor — tudo que te atrapalha encolhe o círculo.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez. **Sem rascunho de vídeo ainda.**

## Frases (narração proposta)

**0.** [sério] "O mato tem comida. Você só não está vendo."
- VISUAL: 3D dia: personagem na beira da floresta; frutinha "fantasma" pisca e some.
- ÍCONES: Item_BerryBlue
- FATOS: —

**1.** [calmo] "Abre a janela Investigar Área e ativa o Modo de Busca. Ou só aperta a tecla End."
- VISUAL: Réplica simples do botão "Ativar Modo de Busca" (sem print → chip com o texto do jogo) + tecla END.
- ÍCONES: —
- FATOS: col-modo

**2.** [confiante] "Os itens aparecem no chão, dentro de um círculo ao seu redor. Com a habilidade Coleta no zero, ele tem três quadrados. No nível dez, chega a dez."
- VISUAL: Vista de cima com grade: círculo 3 → 10; galhos e pedras aparecem só dentro dele.
- ÍCONES: Item_Twigs, Item_Rock
- FATOS: col-raio, col-nivel

**3.** [tenso] "Chuva, neblina, neve e escuro encolhem o círculo. Guarda-chuva ajuda na chuva, e à noite leva lanterna."
- VISUAL: Círculo encolhendo a cada ícone; guarda-chuva e lanterna devolvem um pouco.
- ÍCONES: Item_Umbrella, Item_Flashlight
- FATOS: col-clima

**4.** [calmo] "Agachado você acha um pouco mais. E anda enquanto procura: andar em círculo não revela nada novo."
- VISUAL: Agachar → círculo cresce um pouco; seta de trajeto reto ✓ × círculo ✗.
- ÍCONES: —
- FATOS: col-clima, col-andar

**5.** [confiante] "Cada lugar tem o seu: lenha nas florestas, pedras nas estradas, frutas e cogumelos na floresta, e inseto aparece mais à noite."
- VISUAL: Mapa simples com 4 zonas e ícones.
- ÍCONES: Item_Twigs, Item_Rock, Item_BerryBlue
- FATOS: col-onde

**6.** [sério] "Cuidado com frutinha e cogumelo: tem variedade venenosa. O traço Herbalista ajuda a saber quais são seguras."
- VISUAL: Frutinha com ✗ e ✓; chip HERBALISTA.
- ÍCONES: Item_BerryBlue
- FATOS: col-herbalista

**7.** [calmo] "E tudo depende da estação. Quer uma coisa específica? Usa o Foco de Busca."
- VISUAL: Calendário girando; botão "Foco de Busca".
- ÍCONES: —
- FATOS: col-estacao, col-foco

**8.** [confiante] "Dia de sol, agachado e andando: o mato vira mercado."
- VISUAL: 3D: personagem coletando; CTA.
- ÍCONES: Item_BerryBlue
- FATOS: —

## Fatos
Todos em `info-validada/` (ver tabela do tema `coleta` e os ids citados).
