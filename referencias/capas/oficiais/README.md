# Capas oficiais dos Shorts

Capa final de cada episódio publicado (1080×1920), a mesma que vai para o YouTube. Nome: `epNN.jpg`.

- O site usa daqui: `site/scripts/copiar-assets.mjs` gera `public/jogo/capas/epNN-{360,720}.webp` e os Shorts mostram esta capa no lugar da miniatura do YouTube.
- Episódio sem arquivo aqui: o site cai na miniatura do YouTube.
- Nova capa: adicione `epNN.jpg` (entra no LFS sozinha) e faça o push; o deploy do site pega na hora.
- Quando havia mais de uma versão no pacote recebido (EP17 e EP18), ficou a versão 2.
