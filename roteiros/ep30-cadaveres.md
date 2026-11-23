---
ep: 30
tema: Cadáveres e Mau Cheiro
responsavel: jose
status: validado
build: B42.22
fatos: [cad-doenca, cad-moscas, cad-niveis, sono-bloqueio, cad-arrastar, cad-cova, cad-queimar, cad-mascara]
video: (sem rascunho ainda)
---

# EP 30 — Cadáveres e Mau Cheiro · ROTEIRO v5 (ideia + dados confirmados, 23/11/2026)

**Ideia-guia:** Na B42, pilha de corpo deixa doente — enterre, queime ou fique longe.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez. **Sem rascunho de vídeo ainda.**

## Frases (narração proposta)

**0.** [sério] "Os zumbis que você mata continuam te matando."
- VISUAL: 3D: pilha de corpos na porta da base; moscas.
- ÍCONES: Mood_NoxiousSmell
- FATOS: cad-doenca

**1.** [calmo] "Muitos corpos juntos apodrecem e deixam doente. O sinal são as moscas."
- VISUAL: Corpos se acumulando; moscas; Mood_Ill surgindo.
- ÍCONES: Mood_Ill
- FATOS: cad-moscas, cad-doenca

**2.** [tenso] "Aparece o moodle Mau Cheiro. Ele vai até Vapores Mortais: você não consegue respirar, saia daí."
- VISUAL: Moodle real nos 4 nomes; texto do jogo.
- ÍCONES: Mood_NoxiousSmell
- FATOS: cad-niveis

**3.** [calmo] "E com Mau Cheiro você nem consegue dormir."
- VISUAL: Cama com ✗ e Mood_NoxiousSmell.
- ÍCONES: Mood_NoxiousSmell
- FATOS: sono-bloqueio

**4.** [confiante] "Arrasta o corpo para longe. Dá até pra jogar por cima da cerca ou pela janela."
- VISUAL: Personagem arrastando; chip "Pegar Cadáver".
- ÍCONES: —
- FATOS: cad-arrastar

**5.** [confiante] "Com a pá, cava uma cova: cabem cinco corpos em cada uma."
- VISUAL: Item_Shovel; contador 0/5 → 5/5 (texto do jogo).
- ÍCONES: Item_Shovel
- FATOS: cad-cova

**6.** [confiante] "Ou queima: gasolina e uma fonte de fogo. O jogo diz que é melhor pras suas costas."
- VISUAL: Galão + isqueiro; fogo na pilha longe da casa.
- ÍCONES: Item_Petrol, Item_Lighter
- FATOS: cad-queimar

**7.** [calmo] "E máscara protege: de gás, respirador, cirúrgica ou de pó. A de gás precisa de filtro."
- VISUAL: Ícones das máscaras.
- ÍCONES: Item_GasMask, Item_SurgicalMaskBlue, Item_DustMask
- FATOS: cad-mascara

**8.** [confiante] "Matou, limpou."
- VISUAL: CTA.
- ÍCONES: Item_Shovel
- FATOS: —

## Fatos
Todos em `info-validada/` (ver tabela do tema `cadaveres` e os ids citados).
