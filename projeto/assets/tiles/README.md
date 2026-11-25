# assets/tiles — sprites ORIGINAIS do Project Zomboid (B42.22)

Extraídos de `media/texturepacks/Tiles2x.pack` e `Tiles2x.floor.pack` com `pipeline/pz/unpack.py`.
Só ficam aqui os sprites que os episódios e a abertura do site (lista `TILES` em `site/scripts/gerar-zumbis.mjs`) usam (lista: `node pipeline/pz/tiles_usados.mjs 16 17 18 19`).
`meta.js` (retângulo opaco de cada sprite) é gerado por `python pipeline/pz/tiles_meta.py projeto/assets/tiles` — não editar à mão.

Para adicionar um sprite novo:
1. `python pipeline/pz/unpack.py "<jogo>/media/texturepacks/Tiles2x.pack" saida/ prefixo_do_sprite` (ou `Tiles2x.floor.pack` para pisos);
2. copie só os PNG que vai usar para esta pasta;
3. rode `tiles_meta.py` de novo.

Como são usados: `tiles.js` pinta cada sprite numa forma 3D simples (parede, caixa, chão) com a projeção da câmera do engine,
que é a mesma do jogo (2:1, 30°). Assim o cenário fica igual ao do jogo e o personagem 3D entra na frente/atrás certo.
