# Manual Zomboid

Base de dados e produção do canal **Manual Zomboid**: YouTube Shorts com dicas de **Project Zomboid (Build 42)**.
Dados validados do jogo, roteiros, padrões do canal, referências e a pipeline que gera os vídeos, num lugar só.

> **Repositório PRIVADO.** Ícones, sons, músicas e modelos são arquivos do jogo (The Indie Stone). Use entre a equipe, nunca publique.

## Estrutura
| pasta | o que tem | formato |
|---|---|---|
| `info-validada/` | fatos do jogo **confirmados** (build + fonte), nomes oficiais PT-BR, lista do que não dizer | Markdown |
| `rascunho/` | o que **não** está confirmado: fatos B41/B42.19, pesquisa dos EP20–22, dúvidas, ideias, roteiros antigos | Markdown |
| `roteiros/` | 1 arquivo por episódio (`epNN-tema.md`) com status e fatos usados | Markdown |
| `canal/` | identidade, capas, zumbis, voz, descrições, checklist, critérios de aceite, métricas, método de produção (`processo/`) | Markdown |
| `referencias/` | marca, estilo, **prints de telas do jogo**, fichas de modelos, capas | imagens (LFS) |
| `projeto/` | pipeline de vídeo + assets do jogo: `assets/items` (ícones), `moodles`, `pz` (modelos/texturas), `sfx` (sons), `music` | código + LFS |
| `ferramentas/` | instalar, rodar, `validar.py`, skill de render `motionmaxxing` | scripts |
| `videos/` | **só links** — vídeos ficam no Google Drive | Markdown |

- Regras para o Claude: **`CLAUDE.md`**.
- Regras de trabalho em dupla: **`COLABORACAO.md`**.
- Histórico: **`CHANGELOG.md`**.

### Informação validada × rascunho
- **Validado** (`info-validada/`): build **B42.20+** ou arquivo do jogo, com fonte escrita. Pode ir para vídeo.
- **Rascunho** (`rascunho/`): todo o resto. Nunca vai para vídeo.
- `python ferramentas/validar.py --gerar` transforma as tabelas validadas no `projeto/pipeline/fatos.json`. O build dos vídeos recusa fato que não esteja lá.

### Status dos roteiros
`rascunho` → `validado` (fatos ok) → `aprovado` (Jose aprovou a prévia) → `final` (renderizado) → `publicado` (no ar; não reeditar).

---

## Criar o repositório (Jose, uma vez) — Windows
1. Instale as ferramentas no PowerShell. Feche e abra o terminal depois.
   ```powershell
   winget install -e --id Git.Git
   winget install -e --id GitHub.cli
   ```
2. Configure o Git e entre no GitHub:
   ```powershell
   git lfs install
   git config --global user.name "Jose"
   git config --global user.email "SEU_EMAIL_DO_GITHUB"
   gh auth login                    # GitHub.com > HTTPS > Login with a web browser
   ```
3. Extraia o zip em `C:\Projetos\manual-zomboid` e suba tudo:
   ```powershell
   cd C:\Projetos\manual-zomboid
   git init -b main
   git add .gitattributes
   git add .
   git lfs ls-files | Measure-Object -Line   # deve dar ~4.800 arquivos no LFS
   git commit -m "inicio: repositorio do Manual Zomboid"
   gh repo create manual-zomboid --private --source . --remote origin --push
   ```
4. Convide o sócio. Ele recebe um e-mail; também dá pelo site: Settings > Collaborators > Add people.
   ```powershell
   gh api -X PUT repos/SEU_USUARIO/manual-zomboid/collaborators/USUARIO_DO_SOCIO -f permission=push
   ```

## Entrar no repositório (sócio)
1. Instale o Git e o GitHub CLI como no passo 1 acima. Rode `git lfs install` e `gh auth login`.
2. Aceite o convite em `https://github.com/SEU_USUARIO/manual-zomboid/invitations`.
3. Clone o repo:
   ```powershell
   gh repo clone SEU_USUARIO/manual-zomboid C:\Projetos\manual-zomboid
   cd C:\Projetos\manual-zomboid
   git lfs pull                       # garante imagens/sons reais (não ponteiros)
   ```
4. Só para quem vai **renderizar vídeo**: `ferramentas\instalar.bat`, depois `ferramentas\rodar.bat teste`.

## Conectar o Claude
- **Claude Code (recomendado):**
  - Abra o terminal na pasta do repo e rode `claude`. Ele lê o `CLAUDE.md` sozinho.
  - Ele lê os arquivos, roda a pipeline e faz commits e PRs.
- **App Claude (desktop) com acesso ao computador:** conecte a pasta `C:\Projetos\manual-zomboid` na conversa.
- **Projeto no claude.ai (só leitura):**
  1. No conhecimento do projeto, clique em "+", escolha GitHub e selecione o repo.
  2. Marque `CLAUDE.md`, `README.md`, `info-validada/`, `roteiros/` e `canal/`.
  3. Use "Sync now" depois de cada mudança.
  - Imagens e sons do LFS não entram por esse caminho.

## Rotina diária
`git pull` → trabalho → `python ferramentas/validar.py` → linha no `CHANGELOG.md` → commit → `git push` (ou PR). Detalhes em `COLABORACAO.md`.

## Cota do Git LFS (GitHub grátis)
- 10 GiB de armazenamento e 10 GiB de download por mês, contados na conta do dono do repo.
- Este repo tem ~330 MB. Cada clone completo gasta isso da cota.
- Vídeo nunca entra: fica no Drive (`videos/README.md`).
