---
ep: 20
tema: Sono
responsavel: jose
status: validado
build: B42.22
fatos: [sono-niveis, sono-descanso, sono-cama, sono-travesseiro, sono-bloqueio, sono-remedio, sono-cafe]
video: (link do Drive em videos/LINKS.md)
---

# EP 20 — Sono  (estimativa: 55s) · v5 validado

Ideia-guia: **cansaço só sai dormindo — e onde/como você dorme muda tudo.**
Selo: `BUILD 42.22`. Nomes dos níveis: `nomes-ptbr.md` (Sonolência · Cansaço · Cansaço Intenso · Cansaço Absurdo).

## Fatos (todos em `info-validada/sono.md`)
| id | fato usado |
|---|---|
| sono-niveis | 4 níveis até Cansaço Absurdo; dano corpo a corpo cai a cada nível |
| sono-descanso | descansar recupera fôlego, não cansaço |
| sono-cama | cama boa encurta; banco de carro/chão alonga; pode dar dor no pescoço |
| sono-travesseiro | travesseiro melhora a cama e reduz chance de dor no pescoço |
| sono-bloqueio | zumbi perto, pânico, dor forte; 42.22.2: Mau Cheiro trava dormir |
| sono-remedio | analgésico p/ dor; remédio p/ dormir em dose alta vence dor e pânico |
| sono-cafe | café só compra tempo |

Cortado (sem fonte 42.20+): "enxerga menos" (ver `rascunho/ep20-22-a-revalidar.md`).

## Frases (narração final)
1. "Dormir mal te mata devagar."
   - TELA: 3D — personagem principal na casa simples com janela, luz escuro | título: **Dormir mal** / **mata devagar**
   - 0–1s: punch-in no rosto do personagem, luz escuro. 1–2s: ícone Mood_Sleepy entra pulsando na lateral direita.
   - ÍCONES: Mood_Sleepy  SONS: ambientOutsideCricketsNight (Ambiente e Clima)

2. "O cansaço sobe o dia inteiro. Ele aparece como um ícone na lateral da tela, o moodle, e vai piorando até Cansaço Absurdo. Quanto mais cansado, mais fraco você bate."  [v5: nome PT-BR do jogo; "enxerga menos" cortado (sem fonte 42.20+)]
   - TELA: tela simulada — barra de moodles na lateral | título: **Cansaço sobe** / **o dia todo**
   - 0–2s: relógio do dia passando (sol → noite, luz dia → escuro) com o Mood_Sleepy ficando mais vermelho em etapas (sem número de níveis, sem contador).
   - 2–4s: seta + legenda "MOODLE = ícone de estado"; o moodle mostra o nome "CANSAÇO ABSURDO" ao chegar no fim.
   - 4–6s: split ✗: personagem golpeando com machado de bombeiro, barra de dano encolhendo a cada nível (sem valor numérico).
   - ÍCONES: Mood_Sleepy, Item_Axe  SONS: batSwing (Combate), zombiehit1 (Combate)

3. "Sentar e descansar só recupera o fôlego, aquele de correr e lutar. Cansaço, só dormindo."
   - TELA: split comparação | título: **Descansar ≠** / **dormir**
   - 0–2s: lado esquerdo "SENTAR": Mood_Exhausted (fôlego) sumindo ✓. 2–3s: Mood_Sleepy continua ✗.
   - 3–5s: lado direito "DORMIR": Item_Mattress + Mood_Sleepy sumindo ✓.
   - ÍCONES: Mood_Exhausted, Mood_Sleepy, Item_Mattress  SONS: male_outofbreath_01 (Personagem)

4. "E onde você dorme muda tudo. Cama boa recupera rápido: menos horas dormindo. Banco de carro ou chão: dorme mais horas, e pode acordar com dor no pescoço."
   - TELA: tela simulada — 3 linhas de comparação (estilo inventário) | título: **Onde você dorme** / **muda tudo**
   - 0–2s: linha "CAMA BOA" (Item_Mattress) + barra de horas curta ✓ verde.
   - 2–4s: linha "BANCO DE CARRO" (só texto, sem ícone) barra longa; linha "CHÃO" barra mais longa ✗ (barras sem números).
   - 4–6s: Mood_Pained pisca ao lado de "PESCOÇO".
   - ÍCONES: Item_Mattress, Mood_Pained  SONS: alarmclock (Alarmes)

5. "Às vezes o jogo nem deixa dormir: zumbi por perto, pânico ou dor forte."
   - TELA: tela simulada — menu de contexto do clique direito na cama com "Dormir" acinzentado | título: **Às vezes não** / **deixa dormir**
   - 0–1s: cursor clica na cama, menu abre, "DORMIR" cinza com cadeado.
   - 1–2s: zumbi andando no 3D atrás da janela (luz escuro). 2–3s: Mood_Panicked. 3–4s: Mood_Pained.
   - ÍCONES: Mood_Panicked, Mood_Pained  SONS: zombierand3 (Zumbis), thump1 (Portas e Janelas)

6. "E na quarenta e dois ponto vinte e dois, mau cheiro também bloqueia: com fumaça tóxica ou cheiro de cadáver por perto, a opção de dormir fica travada."  
   - TELA: tela simulada — mesmo menu, agora com tooltip | título: **Novo na 42.22** / **mau cheiro trava**
   - 0–2s: selo "BUILD 42.22" + ícone Mood_NoxiousSmell entra na barra de moodles.
   - 2–4s: menu "DORMIR" cinza + tooltip "MAU CHEIRO" ✗.
   - ÍCONES: Mood_NoxiousSmell  SONS: PZ_MaleZombieEating (Zumbis) baixo, só ambiência

7. "Exemplo: noite, você está com dor e com medo. Toma analgésico pra dor. Se o pânico ainda não deixa, remédio pra dormir, em dose alta, resolve."
   - TELA: tela simulada — inventário + barra de moodles | título: **Dor e medo** / **na hora de dormir**
   - 0–2s: Mood_Pained + Mood_Panicked na lateral; "DORMIR" travado.
   - 2–4s: cursor arrasta Item_PillsPainkiller → Mood_Pained some ✓; "DORMIR" continua travado (pânico).
   - 4–6s: Item_PillsSleeping com chip "DOSE ALTA" (sem número de comprimidos) → cadeado abre ✓.
   - ÍCONES: Item_PillsPainkiller, Item_PillsSleeping, Mood_Pained, Mood_Panicked  SONS: PZ_Swallowing (Itens e Comida)

8. "Café só compra um tempinho. Não substitui a cama."
   - TELA: split | título: **Café não** / **é cama**
   - 0–1s: Item_InstantCoffee, Mood_Sleepy clareia um pouco. 1–3s: volta a escurecer; ✗ sobre o café, ✓ sobre Item_Mattress.
   - ÍCONES: Item_InstantCoffee, Mood_Sleepy, Item_Mattress  SONS: PZ_Drinking (Itens e Comida)

9. "Achou uma cama boa, com travesseiro, longe de cadáver? Ali é a sua base."  
   - TELA: 3D — casa simples com janela, luz amanhecer, personagem principal | título: **Cama boa** / **= sua base**
   - 0–2s: Item_Mattress + Item_Pillow entram com ✓. 2–3s: luz vira amanhecer, Mood_Sleepy some.
   - ÍCONES: Item_Mattress, Item_Pillow  SONS: ambientOutsideDayBirds (Ambiente e Clima)

## Pendência visual (não é fato do jogo)
- Conferir no PTBR/Moodles.json que o ícone `Mood_NoxiousSmell` é o do moodle "Mau Cheiro". Se não for, usar só o chip "MAU CHEIRO".

> **VALIDADO** (23/11/2026): todos os fatos em `info-validada/sono.md`. Próximo passo: prévia para o Jose aprovar.
