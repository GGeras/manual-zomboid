# Manual Zomboid — Modelos do jogo (v4) e critérios de aceite (15/11/2026)

**Validade:** do **vídeo 11 em diante**. Os vídeos 01–10 ficam como estão.

## Regra do Jose (fidelidade visual)
- "Quanto mais fiel à estética e ao jogo, melhor."
- A referência vem **sempre da pasta `media` do jogo** (`...\steamapps\common\ProjectZomboid\media`). O Jose joga a **B42**.
- Antes de desenhar qualquer objeto novo (item, móvel, construção, veículo, roupa), procurar o original lá e usar o arquivo do jogo.
- Desenhar à mão só o que o jogo não tem como arquivo solto, copiando a aparência de um print do jogo.
- **O personagem principal mantém a mesma roupa e cores:** jaqueta verde, camiseta clara, jeans azul, bota e mochila marrons, cabelo castanho curto, taco.

## O que já é original do jogo (`pz.js` + `assets/pz` + `assets/items`)
Ligar no cfg do episódio: `window.EP = { pz: true, itens: ['Item_Hammer', ...], ... }`.

- **Personagens**
  - Corpo, cabelos, jaqueta, moletom e mochilas são as malhas do jogo.
  - Peles e roupas são as texturas do jogo, em camadas.
  - O esqueleto do jogo copia a cada frame o esqueleto guia do engine, então a animação v3 funciona sem mudança (doc 06).
  - `S` = `PZ.SOBREVIVENTE`.
  - `Z[i]` = `PZ.zumbiPZ(i)`: 16 modelos base variados (homens e mulheres, roupas, cabelos, mochila, faca cravada; peles de zumbi do jogo, níveis 1–3).
  - O personagem do jogo é mais fino que o boneco antigo. Em ação, câmera mais perto (`h <= 5.6`).
- **Veículos:** `car(x, z, cor, ry, 'normal' | 'pickup' | 'taxi')`.
- **Animais B42:** `PZ.animal('a_cow' | 'a_sheep' | 'a_hen' | 'a_rooster')`. São malhas do jogo em pose de repouso, com cores aproximadas.
- **Animais B42 animados (use estes):** `PZ.animalPZ('A_cow' | 'A_sheep' | 'A_sheared' | 'A_hen' | 'A_rooster', escala)` + `PZ.animalClip(obj, 'cow_walk', quadro)`.
  - Malhas com esqueleto e animações ORIGINAIS (`anims_X/Cow`, `Sheep`, `Chicken`): `_walk`, `_run`, `_idle`, `_eat`, `_pet` (vaca/ovelha). Gerado por `pipeline/pz/add_animais.py`.
  - Frente do animal = +z. A malha do jogo olha para -z; o `PZ.animal` antigo ficava de costas.
  - Para não patinar: quadro da animação = distância andada ÷ velocidade natural (`NAT` em `ep16.js`, medida no pé) × 30.
- **Itens**
  - 4.453 ícones originais (32×32, do `UI2.pack`) em `assets/items` (lista em `assets/items/index.json`).
  - **Todo item citado no vídeo aparece com o ícone original.**
  - HUD: `H.item` / `H.items`. Cena 3D: `PZ.icon3d`.
  - Modelos 3D do jogo: `PZ.itemModel('gascan' | 'waterbottle' | 'cookingpot')`.
- **Moodles reais:** `assets/moodles`, usar com `'pz:Nome'` (ex.: `pz:Status_TemperatureLow`).

## Critérios de aceite (um vídeo só é entregue se passar em todos)
1. **Fidelidade**
   - Toda regra falada está em `fatos.json`, com fonte e build.
   - `pz: true`.
   - Personagem com a roupa de sempre.
   - Zumbis variados (nunca iguais, nunca verdes).
   - Todo item citado com ícone original.
   - Sons e música do jogo.
2. **Animação**
   - Antecipação, impacto e volta, conferidos na folha de quadros.
   - Objeto na mão na posição certa.
   - Pés no chão; ninguém atravessa nada; zumbi cai do lado certo.
3. **Tela**
   - Relatório de inspeção sem avisos.
   - Personagem sempre visível na ação.
   - Um elemento por vez; nada parado por mais de 3 s.
   - Dá para entender sem som.
4. **Som**
   - `sons.txt` conferido: som na cena e na frase certas.
   - Nenhum som atravessa a troca de cena sem `livre`. Explosão e trovão pedem `livre`.
   - Volume final −14 LUFS.
   - `check_vo` sem avisos.
5. **Entrega**
   - Prévia aprovada.
   - `video.mp4` + 3 capas + `instrucoes.txt` + `legendas.srt`.
   - Versão anterior em `versoes/`.

O build já barra:
- fato sem cadastro;
- ícone inexistente;
- ícone 3D fora de `EP.itens`;
- e avisa quando falta `pz: true`.

## Detalhes técnicos
- Itens estáticos usam escala x negativa, para o texto ficar legível.
- O modelo fica espelhado de propósito: a mão da arma no lado +x.
- Trazer mais coisa do jogo: `pipeline/pz/add.py` / `convert.py` / `unpack.py`. Precisa da pasta `media` do jogo instalada.
