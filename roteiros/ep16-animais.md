---
ep: 16
tema: Animais
responsavel: jose
status: validado
build: B42.22
fatos: [ani-zona, ani-corda, ani-cocho, ani-fome, ani-estresse, ani-barulho-atrai, ani-ovo, ani-produto, ani-carinho]
video: (link do Drive em videos/LINKS.md)
---

# EP 16 — Animais · ROTEIRO FINAL (v5, 19/11/2026)

**Ideia-guia:** Animal vivo precisa de três coisas: comida, água e calma. Tudo volta para essas três barras.

Regras: selo `BUILD 42.22`; nada de número que não esteja na fala ou nos fatos abaixo; um elemento por vez; chips ≤ 24 letras; nomes EXATOS do jogo entre aspas simples.

Música: `where_is_everyone` (ainda não aprovada pelo Jose — avisar).

## Frases (fala exata = `audio/ns16.json`)

**0.** [sério] "A versão quarenta e dois trouxe animais de fazenda. E se você descuidar, eles morrem."
- VISUAL: 3D: personagem na rua (dawn) + animais 3D do jogo (PZ.animal a_cow/a_sheep/a_hen). Chip 'VERSÃO 42'. Ícones de cabeça entram em leque e viram ícones _Dead (descuido).
- ÍCONES: Item_Head_CowFemale_Brown, Item_Head_Sheep_White, Item_Head_Chicken_Hen, Item_CowBrown_Dead, Item_Chicken_HenBrown_Dead
- SONS: ambientOutsideDayBirds

**1.** [calmo] "Você acha vaca, ovelha e galinha em fazendas e celeiros, longe da cidade. Pra levar perto, amarra na corda. Pra longe, coloca o animal no reboque do carro."
- VISUAL: Mini-mapa sem escala (cidade apaga, FAZENDA acende) → chip 'ZONA RURAL' → split CORDA/PERTO e 'COLOCAR ANIMAL NO REBOQUE' (texto do menu do jogo)/LONGE.
- ÍCONES: Item_Rope, Item_Head_CowFemale_Brown
- SONS: vehicle_engine_1

**2.** [confiante] "Animal vivo precisa de três coisas: comida, água e calma."
- VISUAL: Painel do animal com 3 barras SEM números: COMIDA, ÁGUA, CALMA (volta nas frases 4, 5, 8 e 9). Sem print da janela real de informações do animal = painel simples de barras, NÃO dizer que é a tela do jogo.
- ÍCONES: Item_AnimalFeed, Item_Bucket_Water
- SONS: —

**3.** [calmo] "Comida e água vão no cocho, o comedouro dos animais. Mas cocho com ração não aceita água: o próprio jogo manda tirar os itens antes. Então cada cercado precisa de dois cochos, ligados à área do animal. Sem comida ou água, o animal perde vida até morrer."
- VISUAL: Vista de cima do cercado: cocho com ração; tentar água → ✗ + texto do jogo 'Os itens devem ser removidos do recipiente para adicionar água.' → 2º cocho com água ✓, chip '2 COCHOS' → barra COMIDA zera, VIDA desce, ícone vira _Dead.
- ÍCONES: Item_FeedingTrough, Item_AnimalFeed, Item_Bucket_Water, Item_CowBrown_Dead
- SONS: PZ_PutInBag, waterSplash

**4.** [tenso] "Calma é estresse baixo. Zumbi não ataca animal, mas o barulho do bicho atrai zumbi, e zumbi por perto estressa. Tiro, grito e gente correndo também. E animal estressado foge do cercado."
- VISUAL: Chip 'ZUMBI NÃO ATACA' com zumbi 3D ao fundo → ondas de som saindo do cercado, zumbi vira → barra CALMA cai → chips TIRO · GRITO · CORRIDA (um por vez, com som) → ícone sai pela cerca, carimbo 'FUGIU'.
- ÍCONES: Mood_Stressed (pz:Mood_Stressed)
- SONS: zombierand3, pistol, scream1, PZ_FootSteps_Concrete_01

**5.** [animado] "Exemplo: um galinheiro. Galinhas, um galo e dois cochos, um de ração e um de água. Galinha bota ovo mesmo sem galo. O galo serve pra fecundar: só ovo fecundado vira pintinho. E um galo só já basta pra várias galinhas."
- VISUAL: Cercado do galinheiro (vista de cima ou 3D com PZ.animal a_hen/a_rooster): 4 galinhas + galo + 2 cochos → ovo 'SEM GALO ✓' → linha galo→ovo vira pintinho 'FECUNDADO = PINTINHO' → linhas do galo para as galinhas '1 GALO = VÁRIAS'.
- ÍCONES: Item_Chicken_HenWhite, Item_Chicken_HenBrown, Item_Chicken_RoosterBrown, Item_FeedingTrough, Item_Egg, Item_Chicken_Chick
- SONS: ambientOutsideDayBirds

**6.** [calmo] "Vaca e ovelha são diferentes: o leite só aparece alguns dias depois que a fêmea emprenha. Sem macho, sem leite. E se ninguém ordenha, o leite seca. A ovelha também dá lã: é só tosquiar com a tesoura de tosquia."
- VISUAL: Linha do tempo SEM números: MACHO + FÊMEA → PRENHA → 'alguns dias' → balde de leite ✓ ('ORDENHAR', nome do menu) → sem macho ✗ → 'NÃO ORDENHOU = SECA' → ovelha + tesoura → lã ('TOSQUIAR').
- ÍCONES: Item_Head_CowMale_Brown, Item_Head_CowFemale_Brown, Item_Bucket_Milk, Item_Head_Sheep_White, Item_SheepShears, Item_WoolRaw
- SONS: PZ_GetWater

**7.** [calmo] "E acariciar acalma o animal."
- VISUAL: Cursor no menu de contexto com a opção 'Acariciar' (nome do jogo) → barra CALMA sobe ✓. NÃO dizer que tira a tristeza do personagem (não confirmado).
- ÍCONES: Item_Head_Sheep_White
- SONS: —

**8.** [confiante] "Comida, água e calma. Fazenda bem cuidada é comida pra sempre."
- VISUAL: 3D: personagem + animais (dawn); as 3 barras cheias; ovo, leite e lã em fila com ✓; CTA.
- ÍCONES: Item_Egg, Item_Bucket_Milk, Item_WoolRaw
- SONS: ambientOutsideDayBirds

## Fatos (todos já em `pipeline/fatos.json`)
| id | fato | build | fonte |
|---|---|---|---|
| ani-zona | Vaca, ovelha e galinha aparecem em zonas rurais: fazendas, celeiros, longe da cidade | B42.22.2 | pindrop.gg/project-zomboid/animals (B42.22.2) + pinehosting B42 husbandry |
| ani-corda | Corda guia o animal; reboque leva longe (menu do jogo: "Colocar Animal no Reboque") | B42.22 | arquivos do jogo B42.22 do Jose: Translate/PTBR ContextMenu_AddAnimalInTrailer + pinehosting B42 |
| ani-cocho | Cocho com itens não aceita água ("Os itens devem ser removidos do recipiente para adicionar água."); cocho fica ligado à zona do animal; logo 2 por cercado | B42.22 | arquivos do jogo B42.22 do Jose: Translate/PTBR ContextMenu_FeedingTrough_RemoveItemForWater + IGUI_Animal_TroughLinkedTo + pindrop B42.22.2 |
| ani-fome | Sem comida ou água o animal perde vida até morrer | B42 | slashskill B42 husbandry + pzwiki Animal |
| ani-estresse | Zumbi não ataca animal; zumbi perto, tiro, grito e correria estressam; animal estressado/faminto foge da área | B42.22.2 | pindrop.gg animals (B42.22.2) + slashskill B42 |
| ani-barulho-atrai | Barulho dos animais atrai zumbis (padrão Apocalipse) | B42.22 | arquivos do jogo B42.22 do Jose: lua/shared/Sandbox/Apocalypse.lua AnimalSoundAttractZombies = true |
| ani-ovo | Galinha bota ovo sem galo; só ovo fecundado choca; um galo atende várias galinhas | B42.22.2 | pindrop.gg animals (B42.22.2) + slashskill B42 |
| ani-produto | Leite (vaca/ovelha) só alguns dias depois de emprenhar; sem ordenhar seca; lã: Tosquiar com Tesoura de Tosquia | B42.22.2 | pindrop.gg animals + animals/sheep (B42.22.2) + PTBR ContextMenu_Milk/ContextMenu_Shear, ItemName SheepShears |
| ani-carinho | Acariciar (ContextMenu_PetAnimal) reduz o estresse do animal | B42 | itemlevel.net + slashskill B42; nome: PTBR ContextMenu_PetAnimal |
