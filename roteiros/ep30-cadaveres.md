---
ep: 30
tema: Cadáveres e Mau Cheiro
responsavel: jose
status: validado
build: B42.22
fatos: [cad-doenca, cad-combinacao, cad-moscas, cad-niveis, sono-bloqueio, cad-arrastar, cad-cova, cad-queimar, fogo-apagar, cad-mascara]
video: (sem rascunho ainda)
---

# EP 30 — Cadáveres e Mau Cheiro · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** Na B42, pilha de corpo deixa doente — enterre, queime ou fique longe.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [sério] "Os zumbis que você mata continuam te matando."
- VISUAL: 3D: pilha de corpos na porta da base; moscas.
- ÍCONES: Mood_NoxiousSmell
- FATOS: cad-doenca

**1.** [calmo] "A doença vem de três coisas juntas: quantos corpos, o quanto já apodreceram, e quanto tempo você fica perto. Não tem número mágico."
- VISUAL: Três chips somando: QUANTIDADE + DECOMPOSIÇÃO + TEMPO → Mood_Ill.
- ÍCONES: Mood_Ill
- FATOS: cad-combinacao

**2.** [sério] "O sinal de perigo são as moscas zumbindo."
- VISUAL: Pilha com moscas; Mood_Ill surgindo.
- ÍCONES: Mood_Ill
- FATOS: cad-moscas, cad-doenca

**3.** [tenso] "Aparece o moodle Mau Cheiro. Ele vai até Vapores Mortais: você não consegue respirar, saia daí."
- VISUAL: Moodle real nos 4 nomes; texto do jogo.
- ÍCONES: Mood_NoxiousSmell
- FATOS: cad-niveis

**4.** [calmo] "E com Mau Cheiro você nem consegue dormir."
- VISUAL: Cama com ✗ e Mood_NoxiousSmell.
- ÍCONES: Mood_NoxiousSmell
- FATOS: sono-bloqueio

**5.** [confiante] "Arrasta o corpo para longe. Dá até pra jogar por cima da cerca ou pela janela."
- VISUAL: Personagem arrastando; chip "Pegar Cadáver".
- ÍCONES: —
- FATOS: cad-arrastar

**6.** [confiante] "Com a pá, cava uma cova: cabem cinco corpos em cada uma."
- VISUAL: Item_Shovel; contador 0/5 → 5/5 (texto do jogo).
- ÍCONES: Item_Shovel
- FATOS: cad-cova

**7.** [confiante] "Ou queima: gasolina e uma fonte de fogo, longe da casa e com saco de areia por perto. O jogo diz que é melhor pras suas costas."
- VISUAL: Galão + isqueiro; fogo na pilha longe da casa; Item_Sandbag ao lado.
- ÍCONES: Item_Petrol, Item_Lighter, Item_Sandbag
- FATOS: cad-queimar, fogo-apagar

**8.** [calmo] "E máscara protege: de gás, respirador, cirúrgica ou de pó. A de gás precisa de filtro."
- VISUAL: Ícones das máscaras.
- ÍCONES: Item_GasMask, Item_SurgicalMaskBlue, Item_DustMask
- FATOS: cad-mascara

**9.** [confiante] "Matou, limpou."
- VISUAL: CTA.
- ÍCONES: Item_Shovel
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Mood_NoxiousSmell` ✓ moodle
- `Mood_Ill` ✓ moodle
- `Item_Shovel` ✓
- `Item_Petrol` ✓
- `Item_Lighter` ✓
- `Item_Sandbag` ✓
- `Item_GasMask` ✓
- `Item_SurgicalMaskBlue` ✓
- `Item_DustMask` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `JL_MalePlayer_Coughing_02` — frase 3 (+0.5s, -14 dB) ✓
- `shoveling` — frase 6 (+0.3s, -14 dB) ✓
- `player_use_lighter_01` — frase 7 (+0.5s, -12 dB) ✓
- `PZ_Fire` — frase 7 (+1.0s, -16 dB) ✓

**Música:** `they_were_once_here` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- menu "Pegar Cadáver", "Cavar Covas", "Enterrar Cadáver (x/5)": **sem print** → usar chip/ícone; print opcional (tirar no jogo em PT-BR)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S arrastando corpo, com pá, galão PZ.itemModel('gascan'); pilha de Z caídos

**Manifesto:** `projeto/ep30.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep30.cfg.js` + `ep30.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `cadaveres` e os ids citados).
