---
ep: 31
tema: Helicóptero
responsavel: jose
status: validado
build: B42.22
fatos: [heli-invisivel, heli-config, heli-quando, heli-radio, heli-segue, heli-depois]
video: (sem rascunho ainda)
---

# EP 31 — Helicóptero · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** Um dia, um helicóptero invisível chama todos os zumbis da região — saiba quando e se prepare.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [tenso] "Você vai ouvir um helicóptero. E todo zumbi da região também."
- VISUAL: 3D: céu (sem helicóptero visível), sombra/som; zumbis virando.
- ÍCONES: —
- FATOS: heli-invisivel

**1.** [calmo] "No modo Apocalipse, ele vem uma vez só. Em algum dia entre a sexta e a nona noite."
- VISUAL: Calendário com noites 6–9 destacadas; chip "UMA VEZ".
- ÍCONES: —
- FATOS: heli-config, heli-quando

**2.** [confiante] "No dia, o rádio de emergência avisa atividade aérea. Escuta a previsão de manhã."
- VISUAL: Item_Radio com ondas; chip "ATIVIDADE AÉREA".
- ÍCONES: Item_Radio
- FATOS: heli-radio

**3.** [sério] "Você nunca vê o helicóptero, e nem dá pra atirar nele. Ele procura um jogador, e o barulho puxa zumbi de uma área enorme."
- VISUAL: Mapa: círculo grande; setas de zumbis convergindo; texto do jogo "Você não pode atirar no helicóptero."
- ÍCONES: —
- FATOS: heli-invisivel

**4.** [tenso] "E se ele te vê, ele te segue. E a horda vem junto."
- VISUAL: Mapa: ponto do personagem correndo; círculo do helicóptero acompanhando; setas de zumbis atrás.
- ÍCONES: —
- FATOS: heli-segue

**5.** [calmo] "Ele aparece de dia, entre nove da manhã e seis da tarde, e fica de uma a quatro horas."
- VISUAL: Relógio 9h–18h com janela destacada.
- ÍCONES: —
- FATOS: heli-quando

**6.** [tenso] "Depois que ele vai embora, a região da sua base pode estar cheia de zumbi."
- VISUAL: 3D: rua lotada.
- ÍCONES: —
- FATOS: heli-depois

**7.** [calmo] "E tem outros eventos que chamam zumbi, como tiros ao longe. No Apocalipse, eles acontecem às vezes."
- VISUAL: Chip METAEVENTO · "ÀS VEZES".
- ÍCONES: —
- FATOS: heli-config

**8.** [confiante] "Ouviu o rádio? Fica dentro de casa, quieto e trancado, e espera passar."
- VISUAL: CTA.
- ÍCONES: Item_Radio
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Item_Radio` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `chopper1` — frase 0 (+0s, -16 dB) ✓
- `chopper2` — frase 3 (+0s, -18 dB) ✓
- `chopper3` — frase 4 (+0s, -16 dB) ✓
- `zombierand1` — frase 4 (+1.0s, -18 dB) ✓
- `zombieambient1` — frase 6 (+0s, -18 dB) ✓

**Música:** `wwl_tense` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- nenhuma tela necessária (só ícones, moodles e 3D)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S dentro de casa/correndo na rua; Z em multidão; mapa simples; ícone Item_Radio

**Manifesto:** `projeto/ep31.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep31.cfg.js` + `ep31.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `helicoptero` e os ids citados).
