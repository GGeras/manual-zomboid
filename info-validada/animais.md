---
tema: animais
status: validado
atualizado: 2026-11-19
---
# Animais — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| ani-barulho-atrai | Barulho dos animais atrai zumbis (padrão Apocalipse) | B42.22 | arquivos do jogo B42.22 do Jose: lua/shared/Sandbox/Apocalypse.lua AnimalSoundAttractZombies = true | 16 |
| ani-carinho | Acariciar (ContextMenu_PetAnimal) reduz o estresse do animal | B42 | itemlevel.net + slashskill B42; nome: PTBR ContextMenu_PetAnimal | 16 |
| ani-cocho | Cocho com itens não aceita água ("Os itens devem ser removidos do recipiente para adicionar água."); cocho fica ligado à zona do animal; logo 2 por cercado | B42.22 | arquivos do jogo B42.22 do Jose: Translate/PTBR ContextMenu_FeedingTrough_RemoveItemForWater + IGUI_Animal_TroughLinkedTo + pindrop B42.22.2 | 16 |
| ani-corda | Corda guia o animal; reboque leva longe (menu do jogo: "Colocar Animal no Reboque") | B42.22 | arquivos do jogo B42.22 do Jose: Translate/PTBR ContextMenu_AddAnimalInTrailer + pinehosting B42 | 16 |
| ani-estresse | Zumbi não ataca animal; zumbi perto, tiro, grito e correria estressam; animal estressado/faminto foge da área | B42.22.2 | pindrop.gg animals (B42.22.2) + slashskill B42 | 16 |
| ani-fome | Sem comida ou água o animal perde vida até morrer | B42 | slashskill B42 husbandry + pzwiki Animal | 16 |
| ani-ovo | Galinha bota ovo sem galo; só ovo fecundado choca; um galo atende várias galinhas | B42.22.2 | pindrop.gg animals (B42.22.2) + slashskill B42 | 16 |
| ani-produto | Leite (vaca/ovelha) só alguns dias depois de emprenhar; sem ordenhar seca; lã: Tosquiar com Tesoura de Tosquia | B42.22.2 | pindrop.gg animals + animals/sheep (B42.22.2) + PTBR ContextMenu_Milk/ContextMenu_Shear, ItemName SheepShears | 16 |
| ani-zona | Vaca, ovelha e galinha aparecem em zonas rurais: fazendas, celeiros, longe da cidade | B42.22.2 | pindrop.gg/project-zomboid/animals (B42.22.2) + pinehosting B42 husbandry | 16 |
