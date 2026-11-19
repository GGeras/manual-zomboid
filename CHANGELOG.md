# CHANGELOG — o que cada um adicionou

Formato: `- AAAA-MM-DD · nome · o que entrou`. A linha mais nova fica em cima. Uma linha por entrega.

## 2026-11
- 2026-11-19 · bruno · `rodar.bat` e `env.sh` detectam a placa de vídeo (dedicada, integrada ou nenhuma) e ajustam `PZ_GPU` e `RENDER_JOBS`; dá para forçar com `PZ_GPU=1` ou `PZ_GPU=0`.
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
