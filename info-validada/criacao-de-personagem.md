---
tema: criacao-de-personagem
status: validado
atualizado: 2026-11-19
---
# Criação de personagem — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| criacao-bonus-xp | Habilidade que começa com bônus (profissão/traço) também ganha experiência mais rápido; mais nível de bônus = mais rápido. Percentuais NÃO usados: tela do jogo mostra +75/+100/+125%, mas a PZwiki (42.13.1) diz que o valor real é outro (bug de exibição). | B42.22 | PTBR IG_UI 'Bônus de XP: +%1' + PZwiki Trait via gamever.io (42.20.4) + pzfans B42 | 13 |
| criacao-pontos-v2 | Criação é conta de pontos (Pontos Disponíveis). Profissão: Desempregado/Profissão Personalizada +8 sem bônus; Veterano −8 com Pontaria 2 e Recarga 2; Lenhador 0 com Machado 2 e Força 1. Traços: Atlético custa 10, Fumante devolve 3, Surdo devolve 12. Texto do jogo: positivos e negativos devem ser equilibrados. | B42.22 | media/scripts/generated/characters/character_professions.txt e character_traits.txt + lua/shared/Translate/PTBR/UI.json (arquivos do jogo do Jose, B42.22) | 13 |
