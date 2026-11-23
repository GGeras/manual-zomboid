---
ep: 21
tema: Coleta
responsavel: jose
status: validado
build: B42.22
fatos: [col-modo, col-raio, col-nivel, col-clima, col-andar, col-onde, col-herbalista, col-estacao, col-foco]
video: (sem rascunho ainda)
---

# EP 21 — Coleta · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** A busca é um círculo ao seu redor — tudo que te atrapalha encolhe o círculo.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

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
- ÍCONES: Item_Umbrella, Item_Flashlight2
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

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Item_BerryBlue` ✓
- `Item_Twigs` ✓
- `Item_Rock` ✓
- `Item_Umbrella` ✓
- `Item_Flashlight2` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `ambientOutsideDayBirds` — frase 0 (+0s, -24 dB) ✓
- `ambientOutsideLightRainWoods` — frase 3 (+0s, -18 dB) ✓
- `PZ_grassFoot_01` — frase 4 (+0.3s, -16 dB) ✓

**Música:** `where_is_everyone` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- janela "Investigar Área" / botão "Ativar Modo de Busca": **sem print** → usar chip/ícone; print opcional (tirar no jogo em PT-BR)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S agachado/andando na floresta; ícones 3D no chão (PZ.icon3d)

**Manifesto:** `projeto/ep21.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep21.cfg.js` + `ep21.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `coleta` e os ids citados).
