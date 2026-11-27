---
ep: 29
tema: Fogo e Incêndio
responsavel: jose
status: validado
build: B42.22
fatos: [fogo-fogao, fogo-espalha, fogo-pessoas, fogo-extintor, fogo-apagar, fogo-fogueira, fogo-combustivel]
video: (sem rascunho ainda)
---

# EP 29 — Fogo e Incêndio · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** O fogo se espalha sozinho — cozinhar esquecendo o fogão já queimou muita base.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [sério] "Um fogão esquecido aceso pode queimar sua base inteira."
- VISUAL: 3D: cozinha; chama no fogão passando para a parede.
- ÍCONES: —
- FATOS: fogo-fogao, fogo-espalha

**1.** [calmo] "No modo Apocalipse, o fogo se espalha depois que começa."
- VISUAL: Chip PROPAGAÇÃO DO FOGO: LIGADA; chamas passando de quadrado em quadrado.
- ÍCONES: —
- FATOS: fogo-espalha

**2.** [tenso] "O próprio jogo avisa: desliga o fogão quando terminar, a menos que queira cozinhar sua casa também."
- VISUAL: Fogão aceso; texto do jogo em citação.
- ÍCONES: —
- FATOS: fogo-fogao

**3.** [sério] "Gente e zumbi pegam fogo. E zumbi em chamas espalha o fogo por onde anda."
- VISUAL: Zumbi em chamas andando para a casa; status "Em Chamas".
- ÍCONES: —
- FATOS: fogo-pessoas

**4.** [confiante] "O extintor apaga incêndio em construção e em pessoa. Clica com o botão direito: Apagar Fogo."
- VISUAL: Item_Extinguisher + tooltip; chip "Apagar Fogo".
- ÍCONES: Item_Extinguisher
- FATOS: fogo-extintor

**5.** [calmo] "Sem extintor? Saco de areia, de cascalho ou de terra também apagam. E água, mas de balde: um gole de garrafa não adianta."
- VISUAL: Ícones dos 3 sacos ✓; balde ✓; garrafa ✗.
- ÍCONES: Item_Sandbag, Item_Gravelbag, Item_Bucket_Water, Item_WaterBottle
- FATOS: fogo-apagar

**6.** [calmo] "Fogueira, na quarenta e dois, é com três pedras, pelo menu de construção. E ela guarda no máximo oito horas de combustível."
- VISUAL: Três pedras formando fogueira; barra de combustível até 8h.
- ÍCONES: Item_Rock
- FATOS: fogo-fogueira, fogo-combustivel

**7.** [confiante] "Fogueira longe da casa, fogão desligado e um extintor ou saco de areia sempre perto."
- VISUAL: CTA.
- ÍCONES: Item_Extinguisher
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Item_Extinguisher` ✓
- `Item_Sandbag` ✓
- `Item_Gravelbag` ✓
- `Item_Bucket_Water` ✓
- `Item_WaterBottle` ✓
- `Item_Rock` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `PZ_Fire` — frase 0 (+0.3s, -16 dB) ✓
- `player_on_fire_start_01` — frase 3 (+0.3s, -14 dB) ✓
- `BH_MalePlayer_PainLoopFire_01` — frase 3 (+0.9s, -16 dB) ✓
- `campfire` — frase 6 (+0.3s, -16 dB) ✓

**Música:** `the_zombie_threat` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- menu "Apagar Fogo" + cursor de área: **sem print** → usar chip/ícone; print opcional (tirar no jogo em PT-BR)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S com extintor; Z em chamas; fogueira de pedras; PZ.itemModel('waterbottle')

**Manifesto:** `projeto/ep29.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep29.cfg.js` + `ep29.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `fogo` e os ids citados).
