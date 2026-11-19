---
ep: 19
tema: Livros de Habilidade
responsavel: jose
status: validado
build: B42.22
fatos: [livro-nivel, livro-volumes, livro-mult, livro-parcial, livro-acima, livro-velocidade, livro-exemplo]
video: (link do Drive em videos/LINKS.md)
---

# EP 19 — Livros de Habilidade · ROTEIRO FINAL (v5, 19/11/2026)

**Ideia-guia:** Livro não dá nível: livro MULTIPLICA a experiência que você ganha praticando.

Regras: selo `BUILD 42.22`; nada de número que não esteja na fala ou nos fatos abaixo; um elemento por vez; chips ≤ 24 letras; nomes EXATOS do jogo entre aspas simples.

Música: `where_is_everyone` (ainda não aprovada pelo Jose — avisar).

## Frases (fala exata = `audio/ns19.json`)

**0.** [sério] "Livro de habilidade não te dá nível nenhum."
- VISUAL: 3D: personagem com livro (PZ.icon3d 'Item_Book8' na mão = ícone do livro de Carpintaria I no jogo); barra de nível parada; 'NÍVEL +0' ✗.
- ÍCONES: Item_Book8
- SONS: PZ_OpenBag

**1.** [confiante] "Ele multiplica a experiência, que é o que enche sua barra de nível, mas só a que você ganha praticando. Sem prática, o livro não faz nada."
- VISUAL: Linha CARPINTARIA com quadrados de nível e barra de experiência SEM números (sem print da aba Habilidades = painel simples, não chamar de tela do jogo); martelo → barra enche; sem martelo → parada 'SEM PRÁTICA = NADA'.
- ÍCONES: Item_Book8, Item_Hammer
- SONS: PZ_Hammer

**2.** [calmo] "Cada habilidade tem cinco volumes. O volume um vale do nível zero ao dois, o dois do dois ao quatro, e assim vai até o dez."
- VISUAL: Régua de níveis 0–10 com 5 livros encaixando em faixas de 2 níveis (nomes do jogo: Carpintaria I … V).
- ÍCONES: Item_Book8
- SONS: PZ_PutInBag

**3.** [animado] "E o bônus cresce: três vezes no volume um, depois cinco, oito, doze, e dezesseis no volume cinco."
- VISUAL: ×3, ×5, ×8, ×12, ×16 acendem um por vez sobre os livros (números CONFIRMADOS no arquivo do jogo).
- ÍCONES: Item_Book8
- SONS: —

**4.** [calmo] "Pontaria, Lâminas Longas e Recarga rendem a metade."
- VISUAL: ×3 → ×1,5 riscado; rótulos PONTARIA / LÂMINAS LONGAS / RECARGA com '½' (só texto, sem ícone de arma).
- ÍCONES: —
- SONS: —

**5.** [confiante] "Exemplo: Carpintaria nível zero. Sem livro, cada coisa que você constrói te dá um pouco de experiência. Leu o volume um? A mesma construção rende três vezes mais, até você chegar no nível dois."
- VISUAL: Split SEM LIVRO × VOLUME I: mesmo martelo; barra sobe pouco × 3 vezes mais ('×3', sem números de XP); bônus vale até o nível 2.
- ÍCONES: Item_Hammer, Item_Plank, Item_Book8
- SONS: hammernail, levelup

**6.** [calmo] "Leu metade das páginas? Ganha metade do bônus."
- VISUAL: Barra 'PÁGINAS LIDAS' até a metade; ×3 vira ×1,5.
- ÍCONES: Item_Book8
- SONS: —

**7.** [tenso] "Pulou volume? Livro muito acima do seu nível não funciona. E livro de um nível que você já passou não serve mais."
- VISUAL: Régua: personagem no nível 1; Volume III tenta encaixar ✗ (tremida); personagem no 5; Volume I fica cinza 'NÃO SERVE'.
- ÍCONES: Item_Book8
- SONS: —

**8.** [confiante] "Pra ler mais rápido: sentado e de óculos de leitura, cada um corta dez por cento do tempo. O traço Leitura Dinâmica corta trinta por cento; Leitura Lenta soma trinta."
- VISUAL: Óculos de Leitura '−10%' ✓, sentado '−10%' ✓; trait_fastreader 'LEITURA DINÂMICA −30%' (verde); trait_slowreader 'LEITURA LENTA +30%' (vermelho). Um elemento por vez.
- ÍCONES: Item_GlassesReading, trait_fastreader, trait_slowreader
- SONS: —

**9.** [calmo] "E depois de lido, o bônus fica com você. Não precisa carregar o livro."
- VISUAL: Livro sai da mochila; o '×3' continua na linha de Carpintaria ✓.
- ÍCONES: Item_Book8
- SONS: PZ_PutInBag

**10.** [confiante] "Lê antes, pratica depois."
- VISUAL: 3D: personagem troca o livro pelo martelo; CTA.
- ÍCONES: Item_Book8, Item_Hammer
- SONS: PZ_Hammer

## Fatos (todos já em `pipeline/fatos.json`)
| id | fato | build | fonte |
|---|---|---|---|
| livro-nivel | Livro não dá nível; multiplica a XP ganha praticando na faixa do volume; o bônus fica no personagem | B42.22 | pindrop.gg skills (arquivos B42 06/11/2026) |
| livro-volumes | 5 volumes por habilidade, 2 níveis cada (BookCarpentry1: LvlSkillTrained 1, NumLevelsTrained 2); nomes Carpintaria I…V | B42.22 | arquivos do jogo B42.22 do Jose: scripts/generated/items/literature.txt + PTBR ItemName BookCarpentry1-5 |
| livro-mult | Multiplicadores ×3/×5/×8/×12/×16; Pontaria, Recarga e Lâminas Longas ×1,5/×2,5… | B42.22 | arquivos do jogo B42.22 do Jose: lua/server/XpSystem/XPSystem_SkillBook.lua (maxMultiplier1..5) |
| livro-parcial | Cada 10% das páginas = 10% do multiplicador | B42.22 | pindrop.gg skills/carpentry (B42 06/11/2026) + pzfans 42.19 |
| livro-acima | Livro muito acima do nível não funciona; livro de faixa já passada não serve | B42.22 | pindrop.gg skills/carpentry (B42 06/11/2026) |
| livro-velocidade | Tempo de leitura: Leitura Dinâmica ×0,7 (−30%); Leitura Lenta ×1,3 (+30%); Óculos de Leitura ×0,9 (−10%); sentado ×0,9 (−10%) | B42.22 | arquivos do jogo B42.22 do Jose: lua/shared/TimedActions/ISReadABook.lua + PTBR UI_trait_FastReader/SlowReader, ItemName Glasses_Reading |
| livro-exemplo | Construir coisas de Carpintaria dá XP de Carpintaria | B42.22 | pindrop.gg skills/carpentry (142 receitas dão XP) |
