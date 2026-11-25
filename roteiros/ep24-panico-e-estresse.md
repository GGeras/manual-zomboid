---
ep: 24
tema: Pânico e Estresse
responsavel: jose
status: validado
build: B42.22
fatos: [pan-mira, pan-niveis, pan-corpo, est-niveis, pan-calmante, est-leitura, est-fumante, pan-tracos, pan-tracos-custo, pan-veterano-desens]
video: (sem rascunho ainda)
---

# EP 24 — Pânico e Estresse · ROTEIRO v7 (revisado 24/11/2026)

**Ideia-guia:** Pânico treme a mão na hora; estresse treme a mão por dias — os dois atrapalham a luta.

Regras: selo `BUILD 42.22`; número só o que está nos fatos; nomes exatos do jogo; um elemento por vez.

## Frases (narração v7 — 24/11: blocos mais longos, a pedido do Jose)

**0.** [tenso] "Zumbi chegando, sua mão treme, e o tiro sai torto. Uma bala no chão, outra na cerca, e ele continua vindo."
- VISUAL: 3D: rua no fim da tarde, horda chegando; ele recua mirando a pistola e ERRA (bala no chão, bala na cerca); Mood_Panicked
- FATOS: pan-mira

**1.** [calmo] "Isso é pânico. O moodle tem quatro níveis: Nervosismo, Em Alerta, Medo e Terror. No segundo, o jogo já avisa: mãos trêmulas. No terceiro: tremores pelo corpo inteiro."
- VISUAL: 3D: mira tremendo, zumbis cada vez mais perto; moodle real nos 4 nomes + textos do jogo dos níveis 2 e 3
- FATOS: pan-niveis

**2.** [sério] "Os moodles mexem na chance de acertar o tiro. Cansado, em pânico e com pontaria ruim, você não acerta muitos zumbis. E no corpo a corpo, a força e a precisão também dependem dos moodles."
- VISUAL: 3D: 2 tiros errados e o 3º acerta; depois taco: golpe fraco, zumbi não cai; Mood_Panicked + Mood_Sleepy
- FATOS: pan-mira, pan-corpo

**3.** [calmo] "Estresse é outro moodle. Vai de Tensão, Agitação e Estresse até À Beira do Colapso. No terceiro nível o jogo diz: mãos trêmulas, impossível pensar direito."
- VISUAL: 3D: casa de sobrevivente à noite (lixo, mochilas, janela tapada), sentado na poltrona curvado, mão na cabeça; Mood_Stressed nos 4 nomes
- FATOS: est-niveis

**4.** [confiante] "Pra pânico, existem os Calmantes. A descrição do remédio é direta: reduz o pânico. Vale guardar alguns na mochila."
- VISUAL: 3D: cozinha; pega o frasco e TOMA o Calmante; moodle de pânico sai; Item_PillsBetablocker + texto do jogo
- FATOS: pan-calmante

**5.** [confiante] "Pra estresse, leitura. Ler reduz o estresse e o tédio. O livro tira mais, depois a revista em quadrinhos, depois a revista."
- VISUAL: 3D: lendo o livro na poltrona; ranking Livro > Revista em Quadrinhos > Revista com ícones
- FATOS: est-leitura

**6.** [calmo] "E se o seu personagem é Fumante, o cigarro diminui o estresse e a tristeza. Mas quando fica sem fumar, a tristeza aumenta."
- VISUAL: 3D: fumando na janela (cigarro do jogo na mão, maço na mesa); Item_Cigarette; estresse e tristeza ↓, sem cigarro tristeza ↑
- FATOS: est-fumante

**7.** [calmo] "Na criação, Corajoso custa quatro pontos e entra menos em pânico. Covarde devolve dois pontos, mas entra em pânico muito mais. Corajoso é bem melhor que Covarde, e é o que recomendo. E Dessensibilização, que entra em pânico muito menos, já vem com a profissão Veterano."
- VISUAL: Cartões dos traços com ícone do jogo e pontos: Corajoso −4 (vermelho), Covarde +2 (verde), Dessensibilização 0; 3D: firme × recuando
- FATOS: pan-tracos, pan-tracos-custo

**8.** [tenso] "E cuidado com dois traços. Agorafóbico entra em pânico ao ar livre. Claustrofóbico, em lugar fechado pequeno. Os dois devolvem quatro pontos, mas cobram na hora errada. Eu não recomendo nenhum dos dois, principalmente para quem está começando."
- VISUAL: 3D: rua aberta com horda (Agorafóbico +4) × quarto pequeno e escuro (Claustrofóbico +4); Mood_Panicked
- FATOS: pan-tracos, pan-tracos-custo

**9.** [confiante] "Calma na mão, mira firme, tiro na cabeça."
- VISUAL: 3D: calmo, mira firme, tiro certeiro: zumbi cai; CTA
- FATOS: —

## Arquivos para o vídeo (conferidos no repo em 23/11/2026)

**Ícones e moodles** (`projeto/assets/items` · `assets/moodles`):
- `Mood_Panicked` ✓ moodle
- `Mood_Sleepy` ✓ moodle
- `Mood_Stressed` ✓ moodle
- `Item_PillsBetablocker` ✓
- `Item_Book` ✓
- `Item_ComicBook` ✓
- `Item_Magazine` ✓
- `Item_Cigarette` ✓

**Sons do jogo** (`projeto/assets/sfx`):
- `male_heavybreathpanic` — frase 0 (+0s, -16 dB) ✓
- `stormy9mmFire` — frase 0 (+1.6s, -14 dB) ✓
- `heart` — frase 1 (+0.2s, -18 dB) ✓
- `PZ_Swallowing` — frase 4 (+0.6s, -14 dB) ✓

**Música:** `the_zombie_threat` ✓

**Telas do jogo** (`referencias/telas-do-jogo`):
- tooltip do item Calmantes: **sem print** → usar chip/ícone; print opcional (tirar no jogo em PT-BR)

**Modelos 3D:** `PZ.SOBREVIVENTE` (roupa padrão) · zumbis `PZ.zumbiPZ(i)` variados · S mirando pistola; Z variados; livro/revista ícones

**Manifesto:** `projeto/ep24.ep.json` pronto (roteiro, fatos, sons, música, capa, post). Falta só `ep24.cfg.js` + `ep24.js` (cenas) na hora da prévia.

## Fatos
Todos em `info-validada/` (ver tabela do tema `panico-e-estresse` e os ids citados).
