---
ep: 22
tema: Fadiga Muscular
responsavel: jose
status: validado
build: B42.22
fatos: [fad-nome, fad-carga, fad-arma, fad-pisao, fad-reduz, fad-analgesico, fad-exercicio]
video: (sem rascunho ainda)
---

# EP 22 — Fadiga Muscular · ROTEIRO v5 (ideia + dados confirmados, 23/11/2026)

**Ideia-guia:** Cada parte do corpo tem seu próprio cansaço — luta inteligente divide o esforço.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez. **Sem rascunho de vídeo ainda.**

## Frases (narração proposta)

**0.** [sério] "Na versão quarenta e dois, seu braço cansa de bater."
- VISUAL: 3D: golpe com machado; punch-in no braço.
- ÍCONES: Item_Axe
- FATOS: —

**1.** [calmo] "Isso é a Distensão Muscular. Ela aparece no painel de saúde, na parte do corpo que cansou."
- VISUAL: Réplica da aba Saúde (healthPanel do EP15) com "Distensão Muscular Leve" no braço → "Distensão Muscular".
- ÍCONES: —
- FATOS: fad-nome

**2.** [confiante] "Bater cansa o braço. E carregar peso demais cansa as costas."
- VISUAL: Braço acende; depois costas acendem com Status_HeavyLoad.
- ÍCONES: Item_Axe, Status_HeavyLoad
- FATOS: fad-carga

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

**7.** [confiante] "Golpe, pisão, descanso. Divide o esforço e o braço aguenta."
- VISUAL: 3D: sequência golpe → pisão; CTA.
- ÍCONES: Item_Axe
- FATOS: —

## Fatos
Todos em `info-validada/` (ver tabela do tema `fadiga-muscular` e os ids citados).
