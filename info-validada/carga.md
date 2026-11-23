---
tema: carga
status: validado
atualizado: 2026-11-23
---
# Carga e peso — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| carga-niveis | Moodle de carga: Carga Pesada, Sobrecarga, Sobrecarga Elevada, Sobrecarga Extrema. Textos: "O peso está deixando seus movimentos mais lentos" (2), "Você mal consegue se mover" (3), "Você vai se machucar carregando tudo isso" (4) | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_HeavyLoad_* | 23 |
| carga-forca | Quanto você carrega depende da Força e dos seus Moodles; itens em mochila EQUIPADA pesam menos; cada mochila tem capacidade e redução de peso diferentes | B42.22 | arquivos do jogo B42.22: SurvivalGuide_weight_distribution_description | 23 |
| carga-equipada | Mochila no inventário (não vestida) não reduz nada; só reduz vestida nas costas | B42.20.4 | projectzomboid.wiki/guides/encumbrance (42.20.4) + arquivos do jogo B42.22: SurvivalGuide_weight_distribution_description | 23 |
| carga-mochilas | Capacidade / redução: Mochila Pequena 15/70%, Bolsa de Viagem 18/65%, Mochila de Trilha 20/75%, Mochila Grande de Trilha 22/80%, Mochila Militar 28/85%; sacola plástica 8/50% (na mão) | B42.22 | arquivos do jogo B42.22: media/scripts/generated/items/container.txt (Capacity, WeightReduction) + ItemName PT-BR | 23 |
| carga-correr | Moodle "Movimento Restrito": roupas pesadas, mochilas volumosas ou itens grandes impedem correr em disparada | B42.22 | arquivos do jogo B42.22: Moodles_CantSprint_lvl1 + desc | 23 |
| carga-tracos | Traços: Musculoso e Forte = maior capacidade de carga; Fraco = menor; Franzino = extremamente baixa | B42.22 | arquivos do jogo B42.22: UI.json UI_trait_strong/stout/feeble/weak desc | 23 |
| carga-dano | Sobrecarga alta faz perder vida aos poucos e cansa mais; sentar ou entrar no carro para o dano | B42.20.4 | projectzomboid.wiki/guides/encumbrance (42.20.4) + arquivos do jogo B42.22: Moodles_HeavyLoad_desc_lvl4 | 23 |
| carga-moodles | Fome, sede, doença, sangramento e ferimento reduzem a capacidade de carga | B42.20.4 | projectzomboid.wiki/guides/encumbrance (42.20.4) + arquivos do jogo B42.22: SurvivalGuide_weight_distribution_description ("depende da Força e dos seus Moodles") | 23 |
| carga-escalar | Muito peso dificulta escalar cercas altas | B42.22 | arquivos do jogo B42.22: SurvivalGuide_climbing_description | 23 |
