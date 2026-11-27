# CLAUDE.md — regras do repo Manual Zomboid

Fonte única do canal **Manual Zomboid** (Shorts de Project Zomboid, Build 42). Jose (dono) e Bruno (sócio), cada um com seu Claude.
Ler este arquivo, `README.md` e `COLABORACAO.md` antes de trabalhar.

## 1. Nunca inventar dados do jogo
- Todo dado do jogo (regra, número, item, habilidade, moodle, menu, texto de ajuda) vem **só** de `info-validada/`. Não achou = não existe.
- Número só se estiver na tabela; sem número: qualitativo ou barra sem escala.
- Nomes PT-BR só de `info-validada/nomes-ptbr.md`. `info-validada/_nao-usar.md` é proibido.
- Não perguntar fatos do jogo ao Jose: confirma (seção 3) ou corta a frase.

## 2. Validado × rascunho
- `info-validada/`: fato com build **B42.20+** ou arquivo do jogo + fonte. Pode ir para vídeo.
- `rascunho/`: dúvida, B41, sem build, ideia. **Nunca** vai para vídeo.
- Linha de fato: `| id | fato | build | fonte | usado em |`. `projeto/pipeline/fatos.json` é gerado por `python ferramentas/validar.py --gerar` (nunca editar à mão). O `build.py` barra fato fora de `info-validada/`.
- Status do roteiro: `rascunho → validado → aprovado → final → publicado`. Publicado não é reeditado.

## 3. Validar um fato
1. Fonte: arquivos do jogo (`media/scripts/generated` números; `lua/shared/Translate/PTBR` nomes; `lua/shared/Sandbox/Apocalypse.lua` padrões) → web com build 42.20+.
2. Conflito = não afirma. B41 ou sem build = rascunho.
3. Confirmado: mover para `info-validada/<tema>.md` com build e fonte → `validar.py --gerar` → PR. CI `validar` verde → quem abriu faz o merge (sem code review).

## 4. Regras do canal (Jose)
1. Conteúdo **sobre o jogo**, fiel em regras, sons e elementos.
2. Visual original: modelos (`pz: true`), ícones `Item_*`, moodles `pz:Mood_*`/`pz:Status_*`, sons e músicas do jogo.
3. Personagem sempre igual (`PZ.SOBREVIVENTE`): jaqueta verde, camiseta clara, jeans, bota e mochila marrons.
4. Tela do jogo = réplica de print real (`referencias/telas-do-jogo/`) com textos de `nomes-ptbr.md`; sem print, ícone ou chip.
5. Prévia antes do final; o Jose aprova a prévia.
6. Respostas: poucas palavras, diretas, em blocos, em português.
7. Faça só o que foi pedido.
8. Render sempre pelo `.bat` (`ferramentas/rodar.bat` ou o do episódio): ele ajusta ao hardware. Não chamar `build.py` direto para render nem fixar GPU/jobs.
9. Capas: v5, `canal/padrao-capas.md`.
10. Depois de cada trabalho: CHANGELOG + docs do que mudou. Entregue nunca é sobrescrito: anterior vai para `versoes/`.
11. Gancho, texto por rede, horário e temas: `canal/regras-conteudo-redes.md` (REGRA obriga; INDICATIVO orienta). Roteiro, capa, post e ideias leem só esse doc.
12. **Lugares de gravação** (`canal/lugares-de-gravacao.md`): lugar fixo, melhorado a cada episódio com detalhes fiéis ao jogo. Aprovado = travado, nunca trocar. Ler antes de mexer em cenário.

### Economia de tokens e voz
- Render não gasta token: não checar. Um chat por 1–2 vídeos. Pedir arquivos do PC pelo nome.
- Roteiro está em `roteiros/epNN-*.md` e `projeto/epNN.ep.json` (campo `roteiro` = prompt do ElevenLabs): não pedir ao Jose.
- Voz: Jhony Tygas – Natural Mature, Eleven v4, velocidade 1.00, estabilidade 45, similaridade 75. Não clonar. Provisória: Piper (`tts_rascunho.py`).

## 5. Pastas
| pasta | conteúdo |
|---|---|
| `info-validada/` | fatos validados, `nomes-ptbr.md`, `_nao-usar.md` |
| `rascunho/` | não validado |
| `roteiros/` | 1 por episódio (cabeçalho `ep`, `tema`, `responsavel`, `status`, `fatos`) |
| `canal/` | padrões do canal; `canal/processo/` = método de produção |
| `referencias/` | prints de telas, marca, fichas de modelos, capas |
| `projeto/` | pipeline (Three.js + render) e assets do jogo. Guia: `projeto/README.md` |
| `ferramentas/` | `instalar.bat`, `rodar.bat`, `env.sh`, `validar.py`, skill `motionmaxxing` |
| `videos/` | só a tabela de status; vídeo nunca entra no repo |

## 6. Produzir um vídeo
- Método: `canal/processo/11-regras-roteiro-e-pipeline.md`, `05-…`, `06-…`, `07-…`.
- Modelos: `projeto/ep14.*` (painéis + 3D), `ep13.cfg.js` (tela de criação), `ep15.cfg.js` (aba Saúde).
- Git Bash na raiz: `source ferramentas/env.sh`, depois `py3 pipeline/tts_rascunho.py NN` (voz provisória) e `py3 pipeline/check_vo.py audio/nNN.mp3 audio/nsNN.json` (voz real). Prévia e final: pelo `.bat`. Saída em `projeto/out/` (fora do git).

## 7. Antes de cada commit
1. `git pull`. 2. `python ferramentas/validar.py` com **0 erro(s)**. 3. Linha no `CHANGELOG.md`. 4. Commit no padrão de `COLABORACAO.md`.
- Nunca commitar vídeo, zip, `projeto/out/` ou segredos. Arquivo pesado novo: conferir `git lfs ls-files`.
