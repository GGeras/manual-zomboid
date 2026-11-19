---
tema: livros-de-habilidade
status: validado
atualizado: 2026-11-19
---
# Livros de Habilidade — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| livro-acima | Livro muito acima do nível não funciona; livro de faixa já passada não serve | B42.22 | pindrop.gg skills/carpentry (B42 06/11/2026) | 19 |
| livro-exemplo | Construir coisas de Carpintaria dá XP de Carpintaria | B42.22 | pindrop.gg skills/carpentry (142 receitas dão XP) | 19 |
| livro-mult | Multiplicadores ×3/×5/×8/×12/×16; Pontaria, Recarga e Lâminas Longas ×1,5/×2,5… | B42.22 | arquivos do jogo B42.22 do Jose: lua/server/XpSystem/XPSystem_SkillBook.lua (maxMultiplier1..5) | 19 |
| livro-nivel | Livro não dá nível; multiplica a XP ganha praticando na faixa do volume; o bônus fica no personagem | B42.22 | pindrop.gg skills (arquivos B42 06/11/2026) | 19 |
| livro-parcial | Cada 10% das páginas = 10% do multiplicador | B42.22 | pindrop.gg skills/carpentry (B42 06/11/2026) + pzfans 42.19 | 19 |
| livro-velocidade | Tempo de leitura: Leitura Dinâmica ×0,7 (−30%); Leitura Lenta ×1,3 (+30%); Óculos de Leitura ×0,9 (−10%); sentado ×0,9 (−10%) | B42.22 | arquivos do jogo B42.22 do Jose: lua/shared/TimedActions/ISReadABook.lua + PTBR UI_trait_FastReader/SlowReader, ItemName Glasses_Reading | 19 |
| livro-volumes | 5 volumes por habilidade, 2 níveis cada (BookCarpentry1: LvlSkillTrained 1, NumLevelsTrained 2); nomes Carpintaria I…V | B42.22 | arquivos do jogo B42.22 do Jose: scripts/generated/items/literature.txt + PTBR ItemName BookCarpentry1-5 | 19 |
