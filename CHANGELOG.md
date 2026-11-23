# CHANGELOG — o que cada um adicionou

Formato: `- AAAA-MM-DD · nome · o que entrou`. A linha mais nova fica em cima. Uma linha por entrega.

## 2026-11
- 2026-11-23 · bruno · EP19 FINAL (voz ElevenLabs) + regras 4.5 (iluminação por ambiente) e 4.6 (não atravessar móvel / casa com sentido):
  - Regras 4.5 e 4.6 em `canal/processo/11-regras-roteiro-e-pipeline.md`; `inspect.mjs` mede a luz por ambiente (`window.EP.luz`), acusa personagem atravessando móvel e pé abaixo do piso (medida absoluta), grava `inspecao/sonda.json`.
  - `cenarios.js`: `casaDentro({completa:true})` (batente + porta, rodapé, quadros, relógio, poltrona de leitura com abajur de pé e mesinha) e `luzInterior()` (facho de sol com poeira, poça do abajur, vinheta); novos desenhos do jogo em `assets/tiles` (+ `orient.js`).
  - EP19: senta andando até a frente da poltrona e recuando (sem atravessar), livro com página virando, serrote e martelo com lascas e caixote montado prego a prego, anda da bancada ao caixote (sem teleporte), tempos da voz final, HUD dentro da área segura (painéis de 800 px acima da cabeça).
- 2026-11-23 · bruno · EP18 FINAL (voz ElevenLabs): tempos da voz (tools/align.py agora aceita até 14 trechos por frase), sons retimados (coração casado com a borda vermelha), painel "DOIS TERMÔMETROS" simétrico (termômetros a ±200 px do centro, rótulos e selo centrados), cena 3 com itens/tags acima da cabeça, sem casaco = corpo com braços (textura sem a máscara de braço), sombra das árvores do tamanho da copa.
- 2026-11-22 · bruno · EP17 FINAL (voz ElevenLabs) + regra 4.4 (direção dos elementos):
  - Regra 4.4 em `canal/processo/11-regras-roteiro-e-pipeline.md`; `assets/tiles/orient.js` (direção de cada desenho) + conferência automática em `tiles.js` → `inspect.mjs` (móvel solto/virado, de frente para a parede, cortina/tábua com desenho de outra borda).
  - `casaDentro`: móveis encostados e virados para o cômodo (fogão `_13`, geladeira `_1`, bancada `_45`, pia `_1`, TV `_1`, estante/cômoda na parede N, poltronas na parede W); cortinas das casas com o desenho da borda N. EP14/EP19 ajustados às novas posições.
  - EP17: tempos da voz final (align), sem teleporte depois das barras (recua de costas), cortina certa na janela, desce pela janela de cima do lado oposto aos zumbis e sai agachado (Bob_WalkLowSneak), fim com zumbi correndo (Zombie_Sprint) e o vídeo acaba no toque; HUD dentro da área segura (regra 4.3).
  - `inspect.mjs`: confere o rosto do personagem (modal não cobre a cabeça), ignora entrada animada, roda no Windows (placa de vídeo).
- 2026-11-22 · bruno · EP18 v3 + regra 4.3 (revisão final de harmonia e áreas dos apps):
  - Regra 4.3 em `canal/processo/11-regras-roteiro-e-pipeline.md`; `pipeline/inspect.mjs` agora confere áreas do TikTok/Reels/Shorts (direita, base, topo) para TODOS os elementos, personagem acima da descrição, margem de 40 px, centralização, mesma linha = mesmo tamanho/espaço, blocos colados, quebra de linha em falas/tags laterais, e gera `inspecao/zonas.png`.
  - EP18: take do calor refeito (seca com grama queimada e sombras duras, ar tremendo/miragem, sol estourando com raios, suor, insolação com câmera balançando e tela inclinando, hipertermia com borda vermelha batendo junto do coração e ele cambaleando até a sombra); gancho mostra frio E calor; relâmpago antes do trovão na chuva; sem casaco depois do "TIRA"; modais encolhidos/realinhados para fora da área dos botões; personagem mais alto no quadro.
  - `ep.css`: moodle lateral 30 px para dentro (respiro da borda).
- 2026-11-22 · bruno · EP17 v3 (revisão do Jose): mais zumbis em todos os exemplos (entram pela janela da sala e da cozinha), tábuas por fora com ele do lado de fora, chapa e barras com maçarico + máscara de solda (malhas e animação originais), sobrado fechado com 2º andar de verdade, cortina visível, descida da corda sincronizada e final com ele recuando com medo.
  - `tiles.js`: parede de 2º andar agora aparece (antes ficava invisível) e sem risco entre paredes; `pipeline/pz/add_meshes.py` junta malhas/texturas do jogo.
- 2026-11-20 · bruno · EP14 e EP15 finais refeitos com o padrão novo (revisão do Jose):
  - EP14: cozinha mobiliada + quintal da mesma casa (sprites do jogo), fim do chão piscando verde, animações originais (acender fogo, mexer ajoelhado, comer sentado na cadeira), modais no padrão novo;
  - EP15: ataque na rua (zumbi arranha/morde com as animações do jogo), tratamento sentado na cadeira, sem texto vazando e rótulos sem quebra de linha;
  - inspeção nova: `TEXTO VAZANDO DA CAIXA` e `QUEBRA DE LINHA NO RÓTULO`; cadeira onde se senta (`C.assento`) sem o encosto passar na frente do corpo.
- 2026-11-20 · bruno · Revisão do Jose dos EP16–19 aplicada (v2):
  - cenários com os sprites ORIGINAIS do jogo (`projeto/tiles.js`, `projeto/cenarios.js`, `assets/tiles`): rua, fazenda, casa mobiliada, sobrado;
  - 26 animações originais novas (ler sentado, martelar, acariciar, ordenhar, tosquiar, frio, calor, grito, corda, zumbi entrando pela janela);
  - sons B42 do `ZomboidSound.bank` (`assets/sfx/Jogo B42`); inspeção nova: modal cobrindo o personagem e personagem afundando;
  - regra 4.2 em `canal/processo/11-regras-roteiro-e-pipeline.md`.
- 2026-11-19 · jose · `publicar.py` reconhece a pasta "O meu disco" (Drive em português de Portugal).
- 2026-11-19 · jose · Automação Slack + Drive:
  - `ferramentas/publicar.py` envia prévias e finais ao Drive pessoal, com link público;
  - `ferramentas/resumo_push.py` gera o resumo do GitHub;
  - regra em `canal/processo/automacao-slack-drive.md`, canais em `ferramentas/automacao.json`;
  - modelo de GitHub Action (desligado).
- 2026-11-19 · jose · Repositório criado a partir de `Manual Zomboid - Post` e dos zips v2/v3/v4. Estrutura:
  - `info-validada/`: 56 fatos B42 em 11 temas, `nomes-ptbr.md` e `_nao-usar.md`;
  - `rascunho/`: B41, B42.19, EP20–22, ideias e roteiros antigos;
  - `roteiros/`: EP01–22 e Bases 01;
  - `canal/`, `referencias/`, `projeto/` (pipeline + assets do jogo) e `ferramentas/`.
- 2026-11-19 · jose · Modelos do jogo unidos (animais B42 + pistola M9, escopeta e quedas de tiro do EP11). Fatos de arma de fogo trocados pela versão B42 (`weapon.txt`).
- 2026-11-19 · jose · EP16–19 com roteiro validado. Produção no PC do amigo com GPU (pacote `ManualZomboid-Render-EP16-19`).
