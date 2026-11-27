# CLAUDE.md — regras para qualquer Claude que trabalhe neste repositório

Este repo é a fonte única do canal **Manual Zomboid**: YouTube Shorts com dicas de Project Zomboid (Build 42).
Duas pessoas trabalham aqui, cada uma com seu Claude: **Jose** (dono do canal) e o **sócio**.
Leia este arquivo inteiro, depois `README.md` e `COLABORACAO.md`, antes de qualquer trabalho.

## 1. Regra nº 1: nunca inventar dados do jogo
- Todo dado do jogo usado em roteiro, tela, capa ou post vem **só** de `info-validada/`:
  - regra, número, nome de item, habilidade, moodle ou menu;
  - texto de ajuda do jogo.
- Não achou em `info-validada/`? Então **não existe** para você. Não complete com memória, wiki antiga ou "deve ser assim".
- Número só se estiver na tabela. Sem número validado: fale de forma qualitativa ou use barra sem escala.
- Nomes em PT-BR: só os de `info-validada/nomes-ptbr.md`. Exemplos: "Pontaria" (não "Mira"), "Coleta" (não "Forrageamento").
- O que está em `info-validada/_nao-usar.md` é proibido dizer.
- **Não pergunte fatos do jogo ao Jose.** Ou você confirma (seção 3), ou corta a frase.

## 2. Informação validada × rascunho
| | `info-validada/` | `rascunho/` |
|---|---|---|
| O que é | fato conferido, pronto para vídeo | dúvida, fonte velha, ideia, pesquisa em andamento |
| Exigência | build **B42.20+** ou arquivo do jogo + **fonte** escrita | nenhuma |
| Pode ir para vídeo? | **sim** | **nunca** |
| Exemplo | `animais.md`: `ani-cocho` (B42.22, arquivo PTBR do jogo) | `legado-b41.md`, `revalidar-b42-19.md`, `ep20-22-a-revalidar.md` |

- Cada fato é uma linha de tabela: `| id | fato | build | fonte | usado em |`.
- O `projeto/pipeline/fatos.json` é **gerado** dessas tabelas por `python ferramentas/validar.py --gerar`. Nunca edite o json à mão.
- O build (`build.py NN`) **barra** episódio que cita fato fora de `info-validada/`. Isso é proposital.
  - Re-render de episódio antigo com fato em rascunho (ex.: EP12, EP15): revalide o fato primeiro.
- Status do roteiro (cabeçalho de `roteiros/epNN-*.md`): `rascunho → validado → aprovado → final → publicado`.
  - `validado`: todos os fatos estão em `info-validada/`.
  - `aprovado`: o Jose aprovou a prévia.
  - `final`: o vídeo foi renderizado.
  - `publicado`: o vídeo está no ar. **Vídeo publicado não é reeditado.**

## 3. Como um fato vira validado
1. Pesquise nesta ordem:
   1. arquivos do jogo instalado (`...\ProjectZomboid\media`):
      - `scripts/generated/*` para números;
      - `lua/shared/Translate/PTBR/*.json` para nomes e textos;
      - `lua/shared/Sandbox/Apocalypse.lua` para padrões do modo;
   2. web com build **42.20+** no texto (projectzomboid.wiki, pzfans, pindrop).
2. Fontes em conflito = não afirma. Fonte B41 ou sem build = rascunho.
3. Anote em `rascunho/` enquanto pesquisa. Confirmado: mova a linha para `info-validada/<tema>.md`, com build e fonte (arquivo + chave, ou URL + build).
4. Rode `python ferramentas/validar.py --gerar`, depois commit e Pull Request. **Sem code review:** CI verde (`validar`) → quem abriu o PR (ou o Claude dele) faz o merge na hora (decisão do Jose, 23/11). Regras do merge: `COLABORACAO.md`, seção 3.

## 4. Regras do canal (absolutas, do Jose)
1. **Conteúdo SOBRE O JOGO.** Regras, sons e elementos são fiéis ao jogo.
2. **Visual do jogo:**
   - modelos originais (`pz: true`);
   - ícones originais (`projeto/assets/items`, nome `Item_*`);
   - moodles reais (`pz:Mood_*` / `pz:Status_*`);
   - sons e músicas do jogo.
3. **Personagem principal sempre com a mesma roupa** (`PZ.SOBREVIVENTE`): jaqueta verde, camiseta clara, jeans, bota e mochila marrons.
4. **Tela do jogo no vídeo = réplica fiel** de um print real (`referencias/telas-do-jogo/`), com textos de `nomes-ptbr.md`. Sem print, use ícone ou chip, nunca tela inventada.
5. **Rascunho (prévia) antes do render final.** O Jose aprova a prévia.
6. Respostas ao Jose: **poucas palavras, diretas, em blocos, em português.**
7. **Lugares de gravação** (`canal/lugares-de-gravacao.md`): lugar fixo, melhorado a cada episódio com detalhes fiéis ao jogo. Aprovado = travado, nunca trocar. Ler antes de mexer em cenário.

## 5. Onde está cada coisa
| pasta | conteúdo |
|---|---|
| `info-validada/` | fatos do jogo validados (1 `.md` por tema), `nomes-ptbr.md`, `_nao-usar.md` |
| `rascunho/` | não validado: fatos B41, B42.19, EP20–22, dúvidas, roteiros antigos, ideias |
| `roteiros/` | 1 arquivo por episódio, com cabeçalho (`ep`, `tema`, `responsavel`, `status`, `fatos`) |
| `canal/` | padrões do canal (marca, capas, zumbis, voz, descrições, checklist, critérios de aceite, métricas); `canal/processo/` = método de produção |
| `referencias/` | imagens de referência: marca, estilo, prints de telas do jogo, fichas dos modelos, capas |
| `projeto/` | pipeline de vídeo (Three.js + render) e assets do jogo (`assets/items`, `moodles`, `pz`, `sfx`, `music`, `logo`). Guia: `projeto/README.md` |
| `ferramentas/` | `instalar.bat`, `rodar.bat`, `env.sh`, `validar.py`, `publicar.py` + `resumo_push.py` (Slack/Drive), skill `motionmaxxing` (render) |
| `videos/` | só links (Drive) — vídeo nunca entra no repo |

## 6. Produzir um vídeo (resumo)
- Método completo: `canal/processo/11-regras-roteiro-e-pipeline.md`, `05-episodios-recentes-e-licoes.md`, `06-animacao-e-modelos.md` e `07-modelos-do-jogo-e-criterios.md`.
- **Modelos aprovados:**
  - `projeto/ep14.*`: painéis simples + 3D;
  - `projeto/ep13.cfg.js`: réplica da tela de criação;
  - `projeto/ep15.cfg.js`: réplica da aba Saúde.
- **Comandos** (Git Bash, na raiz):
  ```bash
  source ferramentas/env.sh
  py3 pipeline/tts_rascunho.py NN                         # voz provisória (Piper)
  py3 pipeline/check_vo.py audio/nNN.mp3 audio/nsNN.json  # voz real do ElevenLabs
  py3 pipeline/build.py NN rascunho                       # prévia + inspeção
  py3 pipeline/build.py NN                                # final
  ```
  O `env.sh` já entra em `projeto/`. Rode o final em segundo plano.
- A saída vai para `projeto/out/` (ignorado pelo git). Depois de cada prévia ou final, faça a seção 8.

## 7. Antes de cada commit
1. `git pull` (comece sempre atualizado).
2. `python ferramentas/validar.py`: tem que terminar com **0 erro(s)**.
3. Uma linha em `CHANGELOG.md`: data, quem e o quê.
4. Commit pequeno, mensagem no padrão de `COLABORACAO.md`.
- Nunca commite vídeo, zip, `projeto/out/` ou segredos. O `.gitignore` já bloqueia.
- Arquivo pesado novo (imagem, som, modelo): confira com `git lfs ls-files` que entrou no LFS.

## 8. Automação Slack + Google Drive (obrigatória)
Regra completa: `canal/processo/automacao-slack-drive.md`. Canais e IDs: `ferramentas/automacao.json`.
- **Prévia renderizada:**
  1. `python ferramentas/publicar.py NN previa`.
  2. Link público pelo conector **Google Drive** (`share_file`, `anyoneWithLink`, leitor).
  3. Mensagem pelo conector **Slack** no `#links-rascunho`.
- **Final renderizado:**
  1. `python ferramentas/publicar.py NN final` (vídeo + capa).
  2. Links públicos dos dois.
  3. Mensagem no `#links-final`.
  4. Link na tabela de `videos/README.md`.
- **Push na `main`, ou PR aceito:**
  1. Antes do push: `BASE=$(git rev-parse origin/main)`.
  2. Depois: `python ferramentas/resumo_push.py $BASE..origin/main`.
  3. Revise (o que — por quê, curto) e envie no `#atualizações-projeto`.
- **PR aberto:** `python ferramentas/resumo_push.py --pr N`, no mesmo canal.
- Os vídeos vão para o **Drive pessoal** de quem renderizou, nunca para o repo. Configuração pessoal: `python ferramentas/publicar.py --configurar`.
- Um aviso por evento. Conector ou Drive falhou: avise a pessoa em uma linha e pare. Não poste em outros canais.
