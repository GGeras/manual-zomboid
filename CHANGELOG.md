# CHANGELOG — o que cada um adicionou

Formato: `- AAAA-MM-DD · nome · o que entrou`. A linha mais nova fica em cima. Uma linha por entrega.

## 2026-11
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
