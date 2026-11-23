# CHANGELOG — o que cada um adicionou

Formato: `- AAAA-MM-DD · nome · o que entrou`. A linha mais nova fica em cima. Uma linha por entrega.

## 2026-11
- 2026-11-23 · jose · Central C1 (`plataforma/`): banco Supabase com RLS, login GitHub, Painel, Episódios e ficha; sync automático do repo e publicação no Cloudflare (`.github/workflows/central*.yml`).
- 2026-11-23 · jose · Plataforma: arquitetura e plano de etapas da Central e do site, com as chaves de cada etapa (`plataforma/arquitetura.md`, `plataforma/plano.md`).
- 2026-11-23 · jose · Rascunho v2 EP20–30: zumbis à vista nas cenas de rua, cama nas cenas de sono, Coleta no mato (não no asfalto), casa pegando fogo + zumbi em chamas, personagem enquadrado na pilha de corpos, moodle maior e fora da área dos botões; `inspect.mjs` corrigido no Windows.
- 2026-11-23 · jose · Rascunho automático EP20–30: `auto3d.js` (tomadas 3D), `ep20–30.cfg.js/.js/.html`, `pipeline/rascunho_auto.py` (voz Piper → tempos → prévia) e `ferramentas/rascunhos-20-30.bat` (roda os 11 de uma vez).
- 2026-11-23 · jose · Roteiros EP20–30 v6: 5 fatos novos (perna ao correr, espirro atrai, helicóptero segue, areia/água apagam, doença = quantidade+decomposição+tempo); manifestos `ep20–30.ep.json` prontos; seção "Arquivos para o vídeo" em cada roteiro; 26 vozes/sons B42 do personagem (espirro, tosse, suspiros, fogo); cenas antigas EP20–22 → `rascunho/projeto-antigo/`.
- 2026-11-23 · jose · Roteiros EP20–30 (ideia + dados confirmados, sem rascunho de vídeo):
  - EP20–22 revisados nos arquivos do jogo;
  - EP23–30 novos: Carga, Pânico e Estresse, Tédio e Tristeza, Fome e Peso, Resfriado e Doença, Helicóptero, Fogo, Cadáveres;
  - 83 fatos novos em `info-validada/`, `nomes-ptbr.md` ampliado;
  - o que não foi confirmado está em `rascunho/ep20-30-nao-confirmados.md`.
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
