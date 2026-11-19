---
ep: 20
tema: Sono
responsavel: jose
status: rascunho
build: B42.22
fatos: [sono-niveis, sono-descanso, sono-cama, sono-bloqueio, sono-remedio, sono-cafe]
video: (link do Drive em videos/LINKS.md)
---

# EP 20 — Sono  (estimativa: 55s)

Ideia-guia: **cansaço só sai dormindo — e onde/como você dorme muda tudo.**
Selo: `BUILD 42.22`. Contagem de níveis do moodle Cansado: fontes divergem → **não citar número** (nem na tela).

## Fatos conferidos
| id (fatos.json ou novo) | fato | status | fonte (URL) + build |
|---|---|---|---|
| sono-niveis | Moodle de cansaço piora em níveis até "Ridiculamente Cansado" (quantidade de níveis diverge entre fontes). Efeito confirmado: golpe corpo a corpo perde muita força a cada nível e a visão/percepção encolhe. "Erra mais" genérico não confirmado para corpo a corpo (só mira de arma de fogo) | CORRIGIR | https://pzwiki.net/wiki/Tired (B42 unstable 42.0.2: dano corpo a corpo cai por nível, cone de visão encolhe) + https://pzfans.com/ProjectZomboidB42Moodles/ (42.21: dano corpo a corpo cai por nível; mira de arma piora) + https://pzfans.com/moodle_mayhem_surviving_pzs_status_alerts_no_zombie_bs/ (42.19: "melee damage and FOV collapse") |
| sono-descanso | Descansar sentado recupera fôlego (Endurance), não cansaço; cansaço só dormindo | OK | https://projectzomboid.wiki/guides/sleep-rest/ (42.22) |
| sono-cama | Cama boa encurta o sono; banco de carro/cama ruim alonga; chão alonga muito; superfície ruim pode dar dor no pescoço | OK (fonte do pescoço atualizada) | https://projectzomboid.wiki/guides/sleep-rest/ (42.22) + https://gamers.wiki/en/games/project-zomboid/guides/project-zomboid-build-42-sleep-quality-beds-wake-ups (42.20.2: dor no pescoço em superfície ruim/banco de carro/chão) |
| sono-travesseiro | Travesseiro melhora a qualidade da cama e reduz chance de dor no pescoço | NOVO | https://projectzomboid.wiki/guides/sleep-rest/ (42.22) + gamers.wiki (42.20.2, URL acima) + notas 42.22.2 https://patched.gg/games/project-zomboid/42222-stable-released (correção: travesseiro em cama de casal conta para qualidade) |
| sono-bloqueio | Zumbi perto, pânico e dor forte impedem dormir; 42.22.2: moodle Mau Cheiro (fumaça tóxica ou cheiro de cadáver) desativa a opção de dormir até passar | OK ("fumaça" → "fumaça tóxica") | https://projectzomboid.wiki/guides/sleep-rest/ (42.22) + https://patched.gg/games/project-zomboid/42222-stable-released (42.22.2 stable, 09/11/2026: "Bad Smell now disables sleeping") |
| sono-remedio | Analgésico resolve quando só a dor bloqueia; remédio para dormir em dose alta passa por cima de dor/pânico | OK | https://projectzomboid.wiki/guides/sleep-rest/ (42.22) |
| sono-cafe | Café e comprimidos só dão uma janela curta extra; não substituem a cama | OK | https://projectzomboid.wiki/guides/sleep-rest/ (42.22) + https://pzfans.com/ProjectZomboidB42Moodles/ (42.21) |

## Frases (narração final)
1. "Dormir mal te mata devagar."
   - TELA: 3D — personagem principal na casa simples com janela, luz escuro | título: **Dormir mal** / **mata devagar**
   - 0–1s: punch-in no rosto do personagem, luz escuro. 1–2s: ícone Mood_Sleepy entra pulsando na lateral direita.
   - ÍCONES: Mood_Sleepy  SONS: ambientOutsideCricketsNight (Ambiente e Clima)

2. "O cansaço sobe o dia inteiro. Ele aparece como um ícone na lateral da tela, o moodle, e vai piorando até Ridiculamente Cansado. Cansado, você bate mais fraco e enxerga menos."  [⚠ "erra mais" trocado: fontes B42 confirmam dano corpo a corpo menor e visão menor, não "erra mais" no corpo a corpo; + explicação de moodle]
   - TELA: tela simulada — barra de moodles na lateral | título: **Cansaço sobe** / **o dia todo**
   - 0–2s: relógio do dia passando (sol → noite, luz dia → escuro) com o Mood_Sleepy ficando mais vermelho em etapas (sem número de níveis, sem contador).
   - 2–4s: seta + legenda "MOODLE = ícone de estado"; o moodle mostra o nome "RIDICULAMENTE CANSADO" ao chegar no fim.
   - 4–6s: split ✗: personagem golpeando com machado de bombeiro, número de dano some/encolhe (sem valor numérico, só barra encolhendo); cone de visão escurecendo nas bordas (vinheta).
   - ÍCONES: Mood_Sleepy, Item_Axe  SONS: batSwing (Combate), zombiehit1 (Combate)

3. "Sentar e descansar só recupera o fôlego, aquele de correr e lutar. Cansaço, só dormindo."
   - TELA: split comparação | título: **Descansar ≠** / **dormir**
   - 0–2s: lado esquerdo "SENTAR": Mood_Exhausted (fôlego) sumindo ✓. 2–3s: Mood_Sleepy continua ✗.
   - 3–5s: lado direito "DORMIR": Item_Mattress + Mood_Sleepy sumindo ✓.
   - ÍCONES: Mood_Exhausted, Mood_Sleepy, Item_Mattress  SONS: male_outofbreath_01 (Personagem)

4. "E onde você dorme muda tudo. Cama boa recupera rápido: menos horas dormindo. Banco de carro ou chão: dorme mais horas, e pode acordar com dor no pescoço."  [⚠ "dorme muito mais / acorda com dor" → "dorme mais horas / pode acordar com dor": dor no pescoço é chance, não certeza]
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

6. "E na quarenta e dois ponto vinte e dois, mau cheiro também bloqueia: com fumaça tóxica ou cheiro de cadáver por perto, a opção de dormir fica travada."  [⚠ "fumaça" → "fumaça tóxica" (fonte fala em gases/fumes, não fumaça comum); deixa claro o efeito: opção travada]
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

9. "Achou uma cama boa, com travesseiro, longe de cadáver? Ali é a sua base."  [⚠ + "com travesseiro": travesseiro melhora a cama e reduz dor no pescoço (fecha a ponta da frase 4)]
   - TELA: 3D — casa simples com janela, luz amanhecer, personagem principal | título: **Cama boa** / **= sua base**
   - 0–2s: Item_Mattress + Item_Pillow entram com ✓. 2–3s: luz vira amanhecer, Mood_Sleepy some.
   - ÍCONES: Item_Mattress, Item_Pillow  SONS: ambientOutsideDayBirds (Ambiente e Clima)

## Pendências para o Jose confirmar
- O ícone `Mood_NoxiousSmell` é o mesmo moodle "Mau Cheiro" que trava o sono na 42.22.2? (sim/não)
- Nome em PT-BR no jogo do último nível é "Ridiculamente Cansado"? (sim/não)

> **RASCUNHO** (v4): falta aplicar o método atual (doc `canal/processo/11-regras-roteiro-e-pipeline.md`).
