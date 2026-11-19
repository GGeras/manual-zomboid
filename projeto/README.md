# Manual Zomboid — projeto de produção (v4)

Canal de dicas de Project Zomboid. **Regra absoluta: conteúdo SOBRE O JOGO** (não é sobrevivência real): regras, sons e elementos o mais fiéis possível ao jogo; a regra do jogo manda sempre.
Vídeos 01–06 publicados: **não reeditar**. Padrões completos: docs do Projeto "Project Zomboid" (00 a 06) e a pasta `00 Referencias` do canal.

## Neste repositório
Não há mais zips: código, assets e voz já estão aqui. Instalação e regras: `README.md` e `CLAUDE.md` da raiz.
Os fatos (`pipeline/fatos.json`) são GERADOS a partir de `info-validada/` — nunca edite o json à mão.

## Fluxo de um episódio novo (NN)  — v3 (14/11/2026)
1. **Roteiro**: procurar os fatos em `pipeline/fatos.json` (e a lista `nao_usar`); fato novo → conferir na PZwiki (anotar build B41/B42) e cadastrar. Escrever com tags de emoção. Jose gera a voz (2 versões) → `audio/nN.mp3`.
2. Frases em `audio/nsN.json` → `python3 pipeline/check_vo.py audio/nN.mp3 audio/nsN.json` (tempos `T`/`END` + avisos: tag lida em voz alta, alinhamento fraco, pausa longa). Se avisar alinhamento fraco, corrigir `T` pelas pausas (`silencedetect`).
3. `python3 pipeline/novo_ep.py NN "Nome"` → `epNN.ep.json` + `epNN.html`. Preencher no manifesto: `fatos` (ids), `musica`, `sfx` (um som por ação, no frame do impacto), `capa`, `post`, `roteiro`.
4. Escrever `epNN.cfg.js` (HUD) e `epNN.js` (cenas). Reusar `sets.js` (casa em corte, rio, fogueira, chuva, coletor, itens) e a animação v3 (abaixo).
   - Enquadramento: a câmera olha de +x+z; personagem à esquerda/frente, objeto à direita/atrás. Cenários longe da cidade. Externas de noite: usar `dawn`.
   - Um elemento/número por vez (esconder o anterior com `M.hide`); chips com até ~24 letras.
5. **`python3 pipeline/build.py NN rascunho`** (~5–10 min): fatos + áudio + **inspeção** + **prévia** (meia resolução).
   - `out/Video NN/inspecao/relatorio.txt`: texto sobreposto/estourando, texto na área dos botões do app, personagem fora do quadro ou escondido, trechos sem nada novo (>3 s).
   - `out/Video NN/inspecao/folha.png`: 6 quadros seguidos de cada ação (cada som do jogo = uma ação) para conferir a animação.
   - `out/Video NN/sons.txt`: cada som com cena e frase. `previa.mp4`: mandar ao Jose para aprovar antes do render final.
6. `python3 pipeline/build.py NN` (render ~25 min, em segundo plano, sem `&`) → `video.mp4`, `capa.jpg` + `capa_opcao2.jpg` + `capa_opcao3.jpg`, `instrucoes.txt`, `legendas.srt`.
   - Vídeo anterior nunca é sobrescrito: vai para `versoes/video_vN.mp4`.
7. Copiar para `Manual Zomboid - Post/Final/Video NN - Nome/` no PC do Jose (vídeo publicado: nova versão com sufixo, nunca substituir).

## O que o build padroniza
- Abertura: susto do jogo (0 s) + emblema (0,78 s); narração em 1,3 s; ícone no canto; cartão final de 2,2 s.
- Áudio: voz acima de tudo; música ambiente do jogo a −30 LUFS com queda sob a voz; sons do jogo com queda sob a voz; **som nunca atravessa a troca de cena** (corta com fade; `"livre": true` libera); volume final −14 LUFS.
- Música: `assets/music/aprovadas.json` — o build avisa se a faixa ainda não foi ouvida/aprovada pelo Jose.
- Capa: quadro limpo da cena + EP + título de 3 linhas + gancho + logo, em 3 opções de quadro.
- Publicação: YouTube Shorts, Reels, TikTok + roteiro + legendas `.srt` (subir na plataforma; não queimar no vídeo, os títulos já fazem esse papel).

## Modelos ORIGINAIS do jogo (v4, 15/11/2026) — obrigatório do vídeo 11 em diante
Regra do Jose: referência sempre da pasta `media` do jogo (`C:\Program Files (x86)\Steam\steamapps\common\ProjectZomboid\media`), quanto mais fiel melhor.
Ligar no cfg do episódio: `window.EP = { pz: true, itens: ['Item_Hammer', ...], ... }`. Sem `pz: true` o engine usa o boneco antigo (vídeos 02–10).
- **Personagens (`pz.js`)**: corpo, cabelo, roupas e mochilas são as malhas e texturas do jogo (`models_X/Skinned`, `textures/Body`, `textures/Clothes`). O esqueleto do jogo (Bip01) copia a cada frame o esqueleto guia do engine, então `pose()`, `strike/shoveAt/stompAt`, `dead`, `sit`, `slump` funcionam igual.
  - `S` = `PZ.SOBREVIVENTE`: MESMA roupa dos vídeos anteriores (jaqueta verde, camiseta clara, jeans azul, bota e mochila marrons, cabelo castanho, taco). Não mudar.
  - `Z[0..15]` = `PZ.zumbiPZ(i)`: 16 modelos base intercalados (`PZ.ZUMBIS`): homens e mulheres; camiseta, regata, camisa, xadrez, vestido, saia, moletom, jaqueta; careca, curto, longo, rabo, coque; com e sem mochila; faca cravada (`knife: 'costas' | 'peito'`).
  - Novo modelo: `humanPZ({ sex, skin, layers: [['clothingjeanstint', '#cor'], ['tshirt_white', '#cor'], 'brownshoes'], masks: ['leftarm','rightarm'] (com jaqueta/moletom), hair, hairColor, wear: [['M_jacket','jacket_white','#cor']], pack: ['M_schoolbag','schoolbag_black'], blood })`.
  - O personagem do jogo é mais fino que o boneco antigo: em cena de ação usar câmera mais perto (`c.cam(..., h <= 5.6)`).
- **Animações originais do jogo** (`media/anims_X/Zombie`, 30 fps): `pose(Z[i], { x, z, ry, clip: ['z_walk', quadro, loop] })`. Disponíveis: `z_walk`, `z_walk2`, `z_idle`, `z_lunge` (ataque), `z_hit` (leva golpe), `z_death` (morte por golpe na cabeça, cai de frente; usar `loop = false` e `quadro = lf - frameDoGolpe`), `z_shovefall` (cai com empurrão). `zWalk()` já usa o andar do jogo sozinho. Com `clip` a pose do engine é ignorada naquele personagem; sem `clip` vale a animação v3. Mais animações: acrescentar em `lista.json -> clips` (nomes em `anims_X/Zombie`, ex.: `Zombie_Bite`, `Zombie_Crawl`, `Zombie_ClimbWindow`, `Zombie_DoorBang`, `Zombie_ShotHeadFallBwd`).
- **Armas do jogo**: taco, martelo, pistola e faca são as malhas originais (`PZ.weapon('w_bat' | 'w_hammer' | 'w_handgun' | 'w_shotgun' | 'w_knife', textura)`: cabo na origem, ponta para +z). `S.bat`, `S.hammer`, `S.gun` já usam. Mão da arma fechada.
- **Veículos**: `car(x, z, cor, ry, 'normal' | 'pickup' | 'taxi')` (frente = +x) — malhas FBX e texturas do jogo; `userData.lm.emissiveIntensity` acende os faróis.
- **Itens**: toda vez que um item é citado, usar a arte original (4.453 ícones em `assets/items`, nomes em `assets/items/index.json`):
  - HUD: `H.item(k, 'Item_Hammer', 'Martelo', at, { left, top, size, off })` ou `H.items(k, [[nome, rótulo, at], ...], { top })`.
  - Cena 3D: `PZ.icon3d('Item_Hammer', .7)` (declarar em `EP.itens`) · modelo 3D do jogo: `PZ.itemModel('gascan' | 'waterbottle' | 'cookingpot')`.
- **Trazer mais coisa do jogo** (`pipeline/pz/`): copiar os arquivos da pasta `media` (pedir acesso à pasta no PC), acrescentar em `lista.json` e rodar `python3 pipeline/pz/convert.py` (malhas `.x`/FBX + texturas -> `assets/pz`). Ícones: `python3 pipeline/pz/unpack.py UI2.pack assets/items Item_`. Onde procurar: `models_X/` (malhas), `textures/` (peles, roupas, veículos), `texturepacks/UI2.pack` (ícones), `clothing/clothingItems/*.xml` (qual malha/textura cada roupa usa), `sound/`, `ui/`.
- **Fichas de conferência**: `python3 pipeline/fichas.py` -> `out/fichas/` (zumbis, personagem, veículos, itens). Bancada: `node pipeline/shot.mjs "pztest.html?z=1&a=0&b=8" foto.png`.
- Exemplo completo: `ep90.*` = episódio 08 com os modelos do jogo (só para teste; não publicar).
- O build confere: `pz: true` (aviso), ícone inexistente (erro), ícone 3D fora de `EP.itens` (erro).

## Animação de personagens (v3, 14/11/2026) — usar sempre nas cenas de ação
Ações com antecipação, impacto, parada no golpe e recuperação. Tudo em `engine.js` (`ACT`, `zDead`). Exemplo completo: `ep08.js`.
- Sobrevivente (`pose(S, {...})`): `guard: 1` (pose de combate) · `swing: strike(lf, frameDoImpacto)` (golpe a duas mãos; chamar `swoosh(S, fase)` para o rastro) · `shove: shoveAt(lf, hit)` (empurrão) · `stomp: stompAt(lf, hit)` (pisão; o pé cai ~0,5 à frente) · `sit: 0..1` (senta no chão) · `slump: 0..1` (cansado, com respiração ofegante).
- Zumbi: `dead: frames desde o golpe` + `deadStyle` 0 de costas / 1 girando de lado / 2 de bruços (cabeça estala, joelhos cedem, cai acelerando, quica, membros se espalham; cai para trás de onde está virado, ~0,6 de recuo) · `flinch: frames` + `flinchDist` (tranco sem morrer) · `jolt: frames` (corpo no chão levando pisão) · `attack: fase 0..1` (agarra com os dois braços e abre a boca).
- Efeitos: `hitFx(x, y, z, idade, slot)` estrela + clarão no impacto · `burst(x, y, z, idade, n, seed, direção)` sangue (direção = para onde o golpe vai) · `c.shake(idade, força)`.
- Distância para o taco acertar a cabeça: zumbi a 1,45 do sobrevivente. Sentado: virar o personagem de lado para a câmera (`ry` ≈ 2,25).
- Conferir sempre em tira de quadros seguidos (um a cada 1–2 frames) antes de renderizar.

## Pastas
- `engine.js` (mundo 3D e personagens), `ep-core.js` (HUD/títulos), `ep3d.js` (runner), `ep.css`, `runtime/`.
- `assets/sfx/<categoria>/` sons do jogo · `assets/music/` trilhas do jogo + `index.json` · `assets/moodles/` · `assets/logo/` · `assets/base/`.
- `pipeline/` build.py, cover.py, post.py, novo_ep.py, logo_frames.py · `covers/cover.css` · `tools/align.py`.
- `epzs.*` gera a ficha de zumbis (`node $SKILL/scripts/render.mjs cleanzs.html --still 1 pasta`).
- `ep02`–`ep06`: episódios publicados (referência de código; não refazer).

## Atualizar o zip de código (sempre que mudar algo)
```
zip -q -9 -r projeto-manual-zomboid-v3-codigo.zip README.md engine.js pz.js pztest.html pztest.js ep-core.js ep.css ep3d.js sets.js mkhtml.py mixn.py ep[0-9][0-9].cfg.js ep[0-9][0-9].js ep*.ep.json epzs.cfg.js epzs.js pipeline tools assets/music/index.json assets/music/aprovadas.json
zip -q -9 -r projeto-manual-zomboid-v4-jogo.zip assets/pz assets/items     # só quando mudar modelos/ícones
```
Áudios novos (`audio/nN.mp3`, `audio/nsN.json`) também entram no zip quando forem de episódio novo.
