---
tema: barricadas
status: validado
atualizado: 2026-11-19
---
# Barricadas — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| barr-barras-visao | Barras deixam frestas: dá pra ver lá fora | 42.20.4 | pzfans barricade 42.20.4 | 17 |
| barr-ferr | Tábua: martelo (CanBarricade) + tábua + pregos soltos, clique direito "Barricar (Tábuas)"; Marreta NÃO tem CanBarricade (Marreta Pequena tem); caixa de pregos fechada não conta | B42.22 | arquivos do jogo B42.22 do Jose: scripts/generated/items/weapon.txt (Hammer/ClubHammer CanBarricade = true; Sledgehammer sem) + PTBR ContextMenu_Barricade + pzfans 42.20.4 (caixa fechada) | 17 |
| barr-lados | Até 4 tábuas por lado, dentro e fora | 42.20.4 | pzfans barricade (42.20.4) + pzfans board-up (42.19) | 17 |
| barr-luz | À noite com luz acesa, fechar cortina/lençol antes: zumbi é atraído por te ver pela janela | 42.21 | pzfans B42 lighting (42.21) | 17 |
| barr-ordem | Chapa de metal aguenta muito mais que tábua; barras de metal ficam no meio; metal é soldado com maçarico (máscara não exigida). SEM números na tela/fala | 42.20.4 | pzfans barricade 42.20.4 (única fonte de valores → só comparação) + PTBR ContextMenu_MetalBarricade/MetalBarBarricade | 17 |
| barr-saida | Corda de Lençol presa com martelo + prego em janela SEM barricada; 1 por andar | B42.22 | projectzomboid.wiki/guides/sheet-ropes (42.22) + PTBR ItemName SheetRope | 17 |
| barr-vida | Barricada tem durabilidade ("Durabilidade da Barricada"); zumbi bate e gasta; zerou, entra | B42.22 | arquivos do jogo B42.22 do Jose: PTBR ContextMenu_BarricadeHealth + pzfans barricade 42.20.4 | 17 |
