# CHANGELOG — o que cada um adicionou

Formato: `- AAAA-MM-DD · nome · o que entrou`. A linha mais nova fica em cima. Uma linha por entrega.

## 2026-11
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
- 2026-11-21 · jose · EP16 v3 (revisão do Jose): animais com esqueleto e animações originais do jogo (andar, correr, comer, carinho), de frente e sem patinar; galinheiro do jogo + 2 cochos no cercado C; ordenha colada na vaca com balde; tosquia troca para a ovelha tosquiada.
- 2026-11-21 · jose · EP16: voz final do ElevenLabs (82 s, silêncio inicial cortado), tempos das cenas pelas pausas reais; ajustes de sobreposição no gancho e no card TIRO.
