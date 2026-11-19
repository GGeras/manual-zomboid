---
ep: 21
tema: Coleta
responsavel: jose
status: rascunho
build: B42.22
fatos: [forr-modo, forr-raio, forr-penal, forr-inicio, forr-veneno, forr-neve]
video: (link do Drive em videos/LINKS.md)
---

# EP 21 — Forrageamento  (estimativa: 55s)

Ideia-guia: **a busca é um círculo ao seu redor — tudo que te atrapalha encolhe o círculo.**
Selo: `BUILD 42.22` (valores do raio vêm de fontes 42.19/42.20; nenhuma fonte 42.21+ contradiz).

## Fatos conferidos
| id (fatos.json ou novo) | fato | status | fonte (URL) + build |
|---|---|---|---|
| forr-modo | Ícone de luneta no menu da esquerda abre o painel "Investigar Área"; lá você liga o Modo de Busca; os itens aparecem como ícones no chão dentro do raio | CORRIGIR (luneta abre o painel; o modo é ligado nele) | https://pzfans.com/project-zomboid-foraging-guide/ (42.19) |
| forr-raio | Raio base = 3 quadrados no Forrageamento 0 até 10 no nível 10, antes de bônus/penalidades | OK | https://pzfans.com/project-zomboid-foraging-guide/ (42.19: 3 + 7×nível/10) + https://build42guide.wiki/crafting/build-42-foraging (verificado 42.20: "3–10 tiles base") |
| forr-penal | Chuva, neblina, neve, escuro, cansaço e pânico encolhem o raio; correr (sprint) praticamente anula a busca; agachado dá bônus pequeno | CORRIGIR (agachado = bônus pequeno, não "acha mais" genérico) | https://pzfans.com/project-zomboid-foraging-guide/ (42.19: sneak ×1,10; correr penaliza) + https://build42guide.wiki/crafting/build-42-foraging (42.20: "sprint kills search mode"; pânico corta forte) |
| forr-inicio | Galhos, pedras e frutinhas já aparecem no Forrageamento 0 | OK | https://pzfans.com/project-zomboid-foraging-guide/ (42.19) + https://build42guide.wiki/crafting/build-42-foraging (42.20: lenha e pedras no 0) |
| forr-veneno | Veneno sorteado a cada item em frutinhas genéricas e cogumelos (igual na aparência, pode ser diferente); conhecimento de Herbalista (traço na criação ou revista) mostra o veneno; nível de Forrageamento reduz o risco | OK (detalhe: algumas frutinhas, como amora e mirtilo, são sempre seguras) | https://pzfans.com/project-zomboid-foraging-guide/ (42.19) + https://pzfans.com/find-out-which-berries-are-poisonous-and-how-to-avoid-them/ (42.19) + https://build42guide.wiki/crafting/build-42-foraging (42.20) |
| forr-neve | Inverno tem bem menos comida no mato e a neve reduz a chance de achar comida | CORRIGIR (inverno + neve, não só neve) | https://pzfans.com/project-zomboid-foraging-guide/ (42.19) + https://build42guide.wiki/crafting/build-42-foraging (42.20: no inverno a maioria das frutinhas/cogumelos some) |

## Frases (narração final)
1. "O mato tem comida. Você só não está vendo."
   - TELA: 3D — rua da cidade, luz dia, personagem principal parado na beira do mato | título: **O mato tem** / **comida**
   - 0–1s: punch-in no chão. 1–2s: contorno de Item_BerryBlue "fantasma" piscando e sumindo.
   - ÍCONES: Item_BerryBlue  SONS: ambientOutsideDayBirds (Ambiente e Clima)

2. "Item do mato não aparece sozinho. Você clica na luneta, no menu da esquerda, e liga o modo de busca."  [⚠ a luneta abre o painel; o modo de busca é ligado nele]
   - TELA: tela simulada — menu lateral esquerdo do jogo + painel "Investigar Área" | título: **Liga o modo** / **de busca**
   - 0–2s: menu lateral entra; cursor vai até o ícone de luneta (ícone desenhado, não há asset de luneta) e clica.
   - 2–4s: painel abre, cursor clica em "MODO DE BUSCA" → fica verde ✓.
   - ÍCONES: — (luneta desenhada)  SONS: PZ_OpenBag (Itens e Comida) como clique de UI

3. "Os itens aparecem no chão, dentro de um círculo ao seu redor. Esse círculo começa com três quadrados do chão e chega a dez com Forrageamento, a habilidade de busca, no máximo."  [⚠ + explica "Forrageamento = habilidade de busca"]
   - TELA: tela simulada — vista de cima, grade de quadrados do chão com personagem no centro | título: **Círculo de busca** / **3 → 10**
   - 0–2s: círculo aparece; ícones Item_Twigs e Item_Rock surgem só dentro dele.
   - 2–4s: contador "FORRAGEAMENTO 0" → raio "3"; anima até "FORRAGEAMENTO 10" → raio "10" (números confirmados). Selo pequeno "VALOR BASE".
   - ÍCONES: Item_Twigs, Item_Rock  SONS: levelup (Personagem)

4. "E muita coisa encolhe ele: chuva, neblina, escuro, cansaço e pânico. Correndo, a busca quase não acha nada. Agachado, acha um pouco mais."  [⚠ "agachado, acha mais" → "um pouco mais" (bônus pequeno)]
   - TELA: mesma vista de cima | título: **Tudo isso** / **encolhe o círculo**
   - 0–3s: ícones entram um a um e o círculo encolhe a cada um (sem números): Item_Umbrella (chuva), névoa cinza, escurecer, Mood_Sleepy, Mood_Panicked.
   - 3–4s: personagem correndo → círculo quase some ✗. 4–5s: agachado → círculo cresce um pouco ✓.
   - ÍCONES: Item_Umbrella, Mood_Sleepy, Mood_Panicked  SONS: ambientOutsideHeavyRain (Ambiente e Clima), PZ_grassFoot_01 (Personagem)

5. "Exemplo: dia de sol, descansado e agachado: círculo grande. Noite de chuva e cansado: o círculo encolhe muito."
   - TELA: split comparação | título: **Mesmo lugar,** / **círculo diferente**
   - 0–2s: esquerda — luz dia, círculo grande cheio de ícones ✓.
   - 2–4s: direita — luz escuro + chuva + Mood_Sleepy, círculo pequeno, quase vazio ✗.
   - ÍCONES: Item_BerryBlue, Item_Twigs, Item_Rock, Mood_Sleepy  SONS: ambientOutsideDayBirds → ambientOutsideHeavyRain (Ambiente e Clima)

6. "Desde o começo dá pra achar galho, pedra e frutinha."
   - TELA: close de ícones (quadro de inventário) | título: **Desde o** / **nível zero**
   - 0–2s: Item_Twigs, Item_Rock, Item_BerryBlack entram em fila com selo "NÍVEL 0".
   - ÍCONES: Item_Twigs, Item_Rock, Item_BerryBlack  SONS: PZ_PutInBag (Itens e Comida)

7. "Mas cuidado: frutinha e cogumelo podem vir envenenados, mesmo iguais a um que você já comeu. Com o traço Herbalista, ou a revista certa, você reconhece o veneno."
   - TELA: tela simulada — inventário | título: **Igual por fora,** / **veneno por dentro**
   - 0–2s: dois Item_MushroomGeneric1 idênticos lado a lado; um ganha ✓, o outro ✗ vermelho.
   - 2–4s: Mood_Ill pisca sobre o ✗.
   - 4–6s: trait_herbalist + Item_Magazine_Herbal1 entram; o cogumelo ruim ganha etiqueta "VENENOSO".
   - ÍCONES: Item_MushroomGeneric1, Item_BerryGeneric1, trait_herbalist, Item_Magazine_Herbal1, Mood_Ill  SONS: PZ_Eating (Itens e Comida)
   - OBS: não usar Item_BerryBlue/Item_BerryBlack no exemplo de veneno (amora e mirtilo são sempre seguros, segundo a fonte).

8. "No inverno, o mato tem bem menos comida, e a neve atrapalha ainda mais."  [⚠ "a neve esconde a comida" → inverno + neve (fonte: inverno corta a maior parte da comida; neve reduz a chance)]
   - TELA: vista de cima com chão branco | título: **Inverno =** / **pouca comida**
   - 0–2s: chão fica branco, ícones de comida somem um a um; Item_Twigs continua ✓ (lenha segue aparecendo).
   - ÍCONES: Item_Twigs, Item_BerryBlue  SONS: ambientOutsideWindyNight (Ambiente e Clima)

9. "Anda devagar, de dia, e olha o chão."
   - TELA: 3D — rua da cidade, luz dia, personagem principal andando devagar | título: **Devagar, de dia,** / **olhando o chão**
   - 0–2s: círculo de busca sobreposto em volta do personagem; ícones aparecendo ✓.
   - ÍCONES: Item_BerryBlue, Item_Twigs  SONS: PZ_grassFoot_01 (Personagem)

## Pendências para o Jose confirmar
- No jogo em PT-BR a habilidade se chama "Forrageamento"? (sim/não)
- O ícone `Item_Magazine_Herbal1` é a revista que ensina Herbalista na 42.22 (a fonte cita a revista "Sobrevivência na Natureza")? Se não, mostrar só o traço. (sim/não)

> **RASCUNHO** (v4): falta aplicar o método atual (doc `canal/processo/11-regras-roteiro-e-pipeline.md`).
