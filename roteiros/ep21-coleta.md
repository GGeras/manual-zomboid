---
ep: 21
tema: Coleta
responsavel: jose
status: validado
build: B42.22
fatos: [col-raio, col-penal, col-inicio, col-veneno, col-inverno]
video: (link do Drive em videos/LINKS.md)
---

# EP 21 — Coleta  (estimativa: 45s) · v5 validado

Ideia-guia: **a busca é um círculo ao seu redor — tudo que te atrapalha encolhe o círculo.**
Selo: `BUILD 42.22`. Habilidade = **Coleta** (`nomes-ptbr.md`), nunca "Forrageamento".

## Fatos (todos em `info-validada/coleta.md`)
| id | fato usado |
|---|---|
| col-raio | raio de busca 3 (Coleta 0) → 10 (Coleta 10), valor base |
| col-penal | escuro e pânico encolhem muito; correr anula a busca; agachado +10% |
| col-inicio | lenha e pedra desde a Coleta 0 |
| col-veneno | frutinha e cogumelo podem ter veneno; risco cai com a Coleta; Herbalista identifica |
| col-inverno | inverno: bem menos comida; neve reduz chance de planta e frutinha |

Cortado (sem fonte 42.20+ ou conflito; ver `rascunho/ep20-22-a-revalidar.md`): luneta/painel "Investigar Área", chuva/neblina/neve/cansaço no raio, frutinha no nível 0, veneno "igual por fora", revista de Herbalista.

## Frases (narração final)
1. "O mato tem comida. Você só não está vendo."
   - TELA: 3D — rua da cidade, luz dia, personagem principal parado na beira do mato | título: **O mato tem** / **comida**
   - 0–1s: punch-in no chão. 1–2s: contorno de Item_BerryBlue "fantasma" piscando e sumindo.
   - ÍCONES: Item_BerryBlue  SONS: ambientOutsideDayBirds (Ambiente e Clima)

2. "Quando você liga a busca, os itens aparecem no chão, dentro de um círculo ao seu redor. Esse círculo começa com três quadrados do chão e chega a dez com a Coleta, a habilidade de busca, no máximo."  [v5: corte da luneta (sem fonte 42.20+); "Forrageamento" → "Coleta"]
   - TELA: painel simples (não é réplica de tela do jogo) — vista de cima, grade de quadrados com personagem no centro | título: **Círculo de busca** / **3 → 10**
   - 0–2s: círculo aparece; Item_Firewood_Log e Item_Rock surgem só dentro dele.
   - 2–4s: chip "COLETA 0" → raio "3"; anima até "COLETA 10" → raio "10". Selo pequeno "VALOR BASE".
   - ÍCONES: Item_Firewood_Log, Item_Rock  SONS: levelup (Personagem)

3. "E tem coisa que encolhe ele: escuro e pânico encolhem muito. Correndo, a busca não funciona. Agachado, o círculo cresce um pouco."  [v5: chuva/neblina/cansaço cortados (só fonte 42.19)]
   - TELA: mesma vista de cima | título: **Escuro e pânico** / **encolhem o círculo**
   - 0–2s: tela escurece → círculo encolhe; Mood_Panicked entra → círculo encolhe mais (sem números).
   - 2–3s: personagem correndo → círculo some ✗. 3–4s: agachado → círculo cresce um pouco ✓.
   - ÍCONES: Mood_Panicked  SONS: PZ_grassFoot_01 (Personagem)

4. "Exemplo: de dia, calmo e agachado: círculo grande. À noite, em pânico: o círculo quase some."
   - TELA: split comparação | título: **Mesmo lugar,** / **círculo diferente**
   - 0–2s: esquerda — luz dia, círculo grande cheio de ícones ✓.
   - 2–4s: direita — luz escuro + Mood_Panicked, círculo pequeno, quase vazio ✗.
   - ÍCONES: Item_Firewood_Log, Item_Rock, Mood_Panicked  SONS: ambientOutsideDayBirds → ambientOutsideCricketsNight (Ambiente e Clima)

5. "Desde o começo, com Coleta zero, já dá pra achar lenha e pedra."  [v5: "frutinha" cortada (fontes em conflito)]
   - TELA: close de ícones (quadro de inventário) | título: **Desde a** / **Coleta zero**
   - 0–2s: Item_Firewood_Log e Item_Rock entram em fila com chip "COLETA 0".
   - ÍCONES: Item_Firewood_Log, Item_Rock  SONS: PZ_PutInBag (Itens e Comida)

6. "Mas cuidado: frutinha e cogumelo podem vir envenenados. Quanto mais Coleta, menor o risco. E com o traço Herbalista, você reconhece o veneno."  [v5: "igual a um que já comeu" e revista cortados (só fonte 42.19)]
   - TELA: tela simulada — inventário | título: **Frutinha e cogumelo** / **podem ter veneno**
   - 0–2s: Item_MushroomGeneric1 e Item_BerryGeneric1 entram; um ganha ✗ vermelho + Mood_Ill pisca.
   - 2–4s: barra "COLETA" subindo, ✗ fica menor (sem números).
   - 4–6s: trait_herbalist entra; o item ruim ganha etiqueta "VENENOSO".
   - ÍCONES: Item_MushroomGeneric1, Item_BerryGeneric1, trait_herbalist, Mood_Ill  SONS: PZ_Eating (Itens e Comida)

7. "No inverno, o mato tem bem menos comida, e a neve atrapalha ainda mais."
   - TELA: vista de cima com chão branco | título: **Inverno =** / **pouca comida**
   - 0–2s: chão fica branco, ícones de frutinha e cogumelo somem um a um.
   - ÍCONES: Item_BerryGeneric1, Item_MushroomGeneric1  SONS: ambientOutsideWindyNight (Ambiente e Clima)

8. "Anda devagar, de dia, calmo, e olha o chão."
   - TELA: 3D — rua da cidade, luz dia, personagem principal andando devagar | título: **Devagar, de dia,** / **olhando o chão**
   - 0–2s: círculo de busca sobreposto em volta do personagem; ícones aparecendo ✓.
   - ÍCONES: Item_BerryBlue, Item_Firewood_Log  SONS: PZ_grassFoot_01 (Personagem)

> **VALIDADO** (23/11/2026): todos os fatos em `info-validada/coleta.md`. Próximo passo: prévia para o Jose aprovar.
