---
ep: 22
tema: Fadiga Muscular
responsavel: jose
status: validado
build: B42.22
fatos: [fad-nome, fad-perna, fad-carga, fad-arma, fad-pisao, fad-reduz, fad-analgesico, fad-exercicio]
video: (sem rascunho ainda)
---

# EP 22 — Fadiga Muscular · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** Cada parte do corpo tem seu próprio cansaço — luta inteligente divide o esforço.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [sério] "Na versão quarenta e dois, seu braço cansa de bater."
- VISUAL: 3D: golpe com machado; punch-in no braço.
- ÍCONES: Item_Axe
- FATOS: —

**1.** [calmo] "Isso é a Distensão Muscular. Ela aparece no painel de saúde, na parte do corpo que cansou."
- VISUAL: Réplica da aba Saúde (healthPanel do EP15) com "Distensão Muscular Leve" no braço → "Distensão Muscular".
- ÍCONES: —
- FATOS: fad-nome

**2.** [confiante] "Bater cansa o braço. Correr cansa as pernas. E carregar peso demais cansa as costas."
- VISUAL: Silhueta do corpo: braço acende (golpe), pernas acendem (corrida), costas acendem com Status_HeavyLoad — um por vez.
- ÍCONES: Item_Axe, Status_HeavyLoad
- FATOS: fad-perna, fad-carga

**3.** [calmo] "Arma pesada cansa mais. Pisar em zumbi caído cansa menos que um golpe."
- VISUAL: Marreta barra grande × pisão barra pequena (sem números).
- ÍCONES: Item_Sledgehammer2
- FATOS: fad-arma, fad-pisao

**4.** [confiante] "Força alta e nível na habilidade da arma diminuem a distensão."
- VISUAL: Barras de Força e Machados subindo; distensão encolhendo.
- ÍCONES: —
- FATOS: fad-reduz

**5.** [sério] "Analgésico tira a dor, mas a distensão continua lá."
- VISUAL: Mood_Pained some com o analgésico; texto "Distensão Muscular" continua.
- ÍCONES: Item_PillsPainkiller, Mood_Pained
- FATOS: fad-analgesico

**6.** [tenso] "E se exercitar demais tem preço: o jogo avisa que no dia seguinte você vai sentir dores terríveis."
- VISUAL: Personagem fazendo flexão; amanhecer; Mood_Pained.
- ÍCONES: Mood_Pained
- FATOS: fad-exercicio

**7.** [confiante] "Golpe, pisão, caminhada, descanso. Divide o esforço e o corpo aguenta."
- VISUAL: 3D: sequência golpe → pisão; CTA.
- ÍCONES: Item_Axe
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Item_Axe` ✓
- `Status_HeavyLoad` ✓ moodle
- `Item_Sledgehammer2` ✓
- `Item_PillsPainkiller` ✓
- `Mood_Pained` ✓ moodle

**Sons do jogo** (`projeto/assets/sfx`):
- `bathit` — frase 0 (+0.5s, -14 dB) ✓
- `male_outofbreath_01` — frase 2 (+1.2s, -16 dB) ✓
- `JL_MalePlayer_ExerciseGrunts_01` — frase 6 (+0.3s, -16 dB) ✓

**Música:** `maybe_we_can_win_this` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- aba Saúde com "Distensão Muscular": `aba-saude-ferido.png` ✓

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S com machado (golpe, pisão), corrida; Z caído; healthPanel do ep15.cfg.js

**Manifesto:** `projeto/ep22.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep22.cfg.js` + `ep22.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `fadiga-muscular` e os ids citados).
