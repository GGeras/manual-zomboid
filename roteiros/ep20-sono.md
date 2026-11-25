---
ep: 20
tema: Sono
responsavel: jose
status: final
build: B42.22
fatos: [sono-niveis, sono-efeito, sono-descanso, sono-cama, sono-travesseiro, sono-bloqueio, sono-remedio, sono-cafeina, sono-tracos]
video: final v6 renderizado em 24/11 (voz ElevenLabs final, 66,9 s) — link do Drive entra quando os 5 sons do personagem estiverem no repo
---

# EP 20 — Sono · ROTEIRO v6 (revisado 23/11/2026)

**Ideia-guia:** O cansaço só sai dormindo — e onde e como você dorme muda tudo.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração proposta)

**0.** [sério] "Dormir mal te mata devagar."
- VISUAL: 3D noite (dawn): personagem bocejando na sala; moodle Mood_Sleepy pulsa na lateral.
- ÍCONES: Mood_Sleepy
- FATOS: sono-niveis

**1.** [calmo] "O sono aparece como um moodle, o ícone de estado na lateral da tela. Ele vai de Sonolência até Cansaço Absurdo."
- VISUAL: Moodle real crescendo nos 4 nomes do jogo, um por vez.
- ÍCONES: Mood_Sleepy
- FATOS: sono-niveis

**2.** [tenso] "Cansado, você enxerga menos e perde força: o próprio jogo diz que o cansaço tira suas forças."
- VISUAL: Vinheta escurecendo a visão + barra de força encolhendo (sem número); texto do jogo em citação.
- ÍCONES: Mood_Sleepy
- FATOS: sono-efeito, sono-niveis

**3.** [calmo] "Sentar numa cadeira só recupera o fôlego. Cansaço, só dormindo."
- VISUAL: Split: cadeira → Mood_Exhausted some ✓ | Mood_Sleepy fica ✗; cama → Mood_Sleepy some ✓.
- ÍCONES: Mood_Exhausted, Mood_Sleepy, Item_Mattress
- FATOS: sono-descanso

**4.** [confiante] "E onde você dorme muda tudo. Cama boa recupera mais rápido. Chão e banco de carro: você dorme mais horas e pode acordar com dor no pescoço. Travesseiro ajuda um pouco."
- VISUAL: Comparação Cama boa / Chão / Banco de carro com barras de horas sem número; travesseiro entra na cama.
- ÍCONES: Item_Mattress, Item_Pillow, Mood_Pained
- FATOS: sono-cama, sono-travesseiro

**5.** [tenso] "Às vezes o jogo nem deixa dormir: zumbi por perto, pânico, dor forte, ou mau cheiro de corpos."
- VISUAL: Chips aparecendo um por vez com ✗ sobre a cama: ZUMBI · PÂNICO · DOR · MAU CHEIRO.
- ÍCONES: Mood_Panicked, Mood_Pained, Mood_NoxiousSmell
- FATOS: sono-bloqueio

**6.** [calmo] "Pra isso existem os comprimidos soníferos: ajudam a pegar no sono com dor ou ansiedade. Só não mistura remédio com álcool."
- VISUAL: Ícone dos soníferos + texto do tooltip do jogo; bebida riscada ao lado.
- ÍCONES: Item_PillsSleeping
- FATOS: sono-remedio

**7.** [sério] "Pílula de cafeína dá um pico de energia, mas é só um empurrão. Não substitui a cama."
- VISUAL: Item_PillsCaffeine → barra sobe um pouco e volta a cair.
- ÍCONES: Item_PillsCaffeine
- FATOS: sono-cafeina

**8.** [confiante] "Exemplo: noite chegando, você já está com Sonolência. Tranca a casa, deita na melhor cama, e acorda inteiro."
- VISUAL: 3D: personagem fecha porta, deita; amanhecer; moodle some ✓.
- ÍCONES: Mood_Sleepy, Item_Mattress
- FATOS: sono-cama, sono-descanso

**9.** [confiante] "Na criação, o traço Sono Leve faz o cansaço sair mais devagar; Madrugador dorme menos. Durma bem, lute melhor."
- VISUAL: Chips dos traços + CTA.
- ÍCONES: —
- FATOS: sono-tracos

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Mood_Sleepy` ✓ moodle
- `Mood_Exhausted` ✓ moodle
- `Item_Mattress` ✓
- `Item_Pillow` ✓
- `Mood_Pained` ✓ moodle
- `Mood_Panicked` ✓ moodle
- `Mood_NoxiousSmell` ✓ moodle
- `Item_PillsSleeping` ✓
- `Item_PillsCaffeine` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `JL_MalePlayer_SleepingNoises_01` — frase 0 (+0.3s, -20 dB) ✓
- `doorclose` — frase 8 (+0.4s, -16 dB) ✓

**Música:** `low` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- nenhuma tela necessária (só ícones, moodles e 3D)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S (bocejo, deitar), cama/colchão; banco de carro: car(...)

**Manifesto:** `projeto/ep20.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep20.cfg.js` + `ep20.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `sono` e os ids citados).
