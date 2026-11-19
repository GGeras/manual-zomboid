---
ep: 17
tema: Barricadas
responsavel: jose
status: validado
build: B42.22
fatos: [barr-vida, barr-ferr, barr-lados, barr-ordem, barr-barras-visao, barr-luz, barr-saida]
video: (link do Drive em videos/LINKS.md)
---

# EP 17 — Barricadas · ROTEIRO FINAL (v5, 19/11/2026)

**Ideia-guia:** Barricada = vida extra da janela. O zumbi gasta essa vida batendo; quando zera, ele entra. SEM números de vida (decisão do Jose): só barras comparando.

Regras: selo `BUILD 42.22`; nada de número que não esteja na fala ou nos fatos abaixo; um elemento por vez; chips ≤ 24 letras; nomes EXATOS do jogo entre aspas simples.

Música: `barricading` (ainda não aprovada pelo Jose — avisar).

## Frases (fala exata = `audio/ns17.json`)

**0.** [sério] "Sua janela é a porta de entrada da horda."
- VISUAL: 3D noite (dark/dawn): zumbis andando até a janela de uma casa; punch-in; tremida a cada batida.
- ÍCONES: —
- SONS: thump1, thump2, zombierand3

**1.** [confiante] "Barricada funciona como vida extra. O zumbi bate, a vida cai, e quando zera, ele entra."
- VISUAL: Janela de frente com barra 'DURABILIDADE DA BARRICADA' (nome do jogo) SEM número; cada batida derruba um pedaço; zera → ✗ e zumbi 3D atravessa.
- ÍCONES: Item_Plank
- SONS: thump1, thump2, smashwindow

**2.** [calmo] "Pra barricar com tábua, carrega martelo, tábua e pregos soltos, e clica com o botão direito na janela: Barricar, Tábuas. Marreta grande não serve. E caixa de pregos fechada não conta: abre antes."
- VISUAL: Inventário: Martelo de Garra, Tábua, Pregos ✓ → menu de contexto com 'Barricar (Tábuas)' (texto exato do jogo) → Marreta ✗ (a Marreta Pequena serve; não mostrar ela como erro) → Caixa de Pregos 'FECHADA ✗' → Pregos 'SOLTOS ✓'. NÃO mostrar número de pregos.
- ÍCONES: Item_Hammer, Item_Plank, Item_Nails, Item_Sledgehamer, Item_NailsBox
- SONS: hammernail, PZ_OpenBag

**3.** [confiante] "Cada tábua soma vida. E você põe até quatro de cada lado, dentro e fora."
- VISUAL: Janela em corte DENTRO/FORA: tábuas entram uma a uma (1/4 → 4/4 de cada lado); a barra de durabilidade cresce a cada tábua (sem número).
- ÍCONES: Item_Plank, Item_Hammer
- SONS: hammernail

**4.** [confiante] "Chapa de metal aguenta muito mais que tábua, mas precisa ser soldada com maçarico."
- VISUAL: Comparação de BARRAS sem números: tábua (curta) × chapa de metal (bem maior). Maçarico de Solda entra com faísca. NÃO mostrar máscara de solda.
- ÍCONES: Item_SheetMetal, Item_BlowTorch, Item_Plank
- SONS: hammernail

**5.** [calmo] "Barras de metal ficam no meio do caminho, e deixam ver lá fora."
- VISUAL: Mesma comparação: barra das Barras de Metal entre tábua e chapa (sem números); janela com grade e seta de visão de dentro pra fora ✓. NÃO dizer que o zumbi te vê pelas barras (não confirmado).
- ÍCONES: Item_MetalBar
- SONS: zombierand1

**6.** [tenso] "À noite, antes de acender a luz, fecha a cortina ou pendura um lençol: zumbi que te vê pela janela vem atrás."
- VISUAL: 3D noite: janela acesa, zumbi vira e vem ✗ → lençol cobre a janela ✓ → zumbi passa reto.
- ÍCONES: Item_Sheet
- SONS: lightswitch, zombierand2

**7.** [confiante] "E sempre deixa uma saída: uma corda de lençol, presa com martelo e prego numa janela sem barricada do andar de cima."
- VISUAL: Corte de casa de 2 andares: Lençol ×2 → Corda de Lençol; martelo + prego na janela de cima SEM tábuas ✓; boneco desce do lado oposto aos zumbis.
- ÍCONES: Item_Sheet, Item_SheetRope, Item_Hammer, Item_Nails
- SONS: hammernail

**8.** [sério] "Base fechada sem saída é caixão."
- VISUAL: 3D: casa toda tapada, zumbis em volta, zoom-out lento; CTA.
- ÍCONES: —
- SONS: thump2, Thumpdistant01

## Fatos (todos já em `pipeline/fatos.json`)
| id | fato | build | fonte |
|---|---|---|---|
| barr-vida | Barricada tem durabilidade ("Durabilidade da Barricada"); zumbi bate e gasta; zerou, entra | B42.22 | arquivos do jogo B42.22 do Jose: PTBR ContextMenu_BarricadeHealth + pzfans barricade 42.20.4 |
| barr-ferr | Tábua: martelo (CanBarricade) + tábua + pregos soltos, clique direito "Barricar (Tábuas)"; Marreta NÃO tem CanBarricade (Marreta Pequena tem); caixa de pregos fechada não conta | B42.22 | arquivos do jogo B42.22 do Jose: scripts/generated/items/weapon.txt (Hammer/ClubHammer CanBarricade = true; Sledgehammer sem) + PTBR ContextMenu_Barricade + pzfans 42.20.4 (caixa fechada) |
| barr-lados | Até 4 tábuas por lado, dentro e fora | 42.20.4 | pzfans barricade (42.20.4) + pzfans board-up (42.19) |
| barr-ordem | Chapa de metal aguenta muito mais que tábua; barras de metal ficam no meio; metal é soldado com maçarico (máscara não exigida). SEM números na tela/fala | 42.20.4 | pzfans barricade 42.20.4 (única fonte de valores → só comparação) + PTBR ContextMenu_MetalBarricade/MetalBarBarricade |
| barr-barras-visao | Barras deixam frestas: dá pra ver lá fora | 42.20.4 | pzfans barricade 42.20.4 |
| barr-luz | À noite com luz acesa, fechar cortina/lençol antes: zumbi é atraído por te ver pela janela | 42.21 | pzfans B42 lighting (42.21) |
| barr-saida | Corda de Lençol presa com martelo + prego em janela SEM barricada; 1 por andar | B42.22 | projectzomboid.wiki/guides/sheet-ropes (42.22) + PTBR ItemName SheetRope |
