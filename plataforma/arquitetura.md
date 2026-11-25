# Plataforma — arquitetura

Duas entregas, nesta ordem:
1. **Central** (`plataforma/`): sistema interno do Jose e do sócio.
2. **Site** (`site/`): landing imersiva + Guias (blog oficial) + **Comunidade** (fórum estilo Reddit, com conta própria). Especificação: `plataforma/site.md`.

Plano de etapas e chaves: `plataforma/plano.md`.

## 1. Princípios
- **Cada dado tem um dono.** A Central lê; só edita o que nasce nela.
- **A Central é o lugar de acompanhar o projeto** (decisão de 25/11). O feed ao vivo, as prévias e os finais nascem nela, não no Slack: quem quiser entender o que aconteceu abre a Central. Os avisos do Slack (`publicar.py`, `resumo_push.py`) continuam como estão até a C3 nova substituir.
- **Regra nº 1 vale no site.** Fato do jogo só de `info-validada/`. Post que cita fato fora dela não builda.
- **Segredo nunca no git.** Ficam em Supabase Secrets, GitHub Secrets ou na hospedagem.
- **Custo zero no início.** Tudo em plano grátis; nada pago sem o Jose aprovar.

| dado | dono (fonte da verdade) | Central |
|---|---|---|
| episódio, tema, status, responsável, fatos | repo: cabeçalho de `roteiros/epNN-*.md` | só leitura |
| prévias e finais (link, versão, autor) | `publicar.py` grava direto na Central (C3) | só leitura |
| atualizações do GitHub | GitHub (push/PR) → Central (C3) | só leitura |
| tarefas, notas, relatórios | Supabase | edita |
| métricas dos Shorts | chat de análises (grava no banco) | só leitura |
| notícias do Zomboid | Steam News → fila | aprova / descarta |
| guias (blog oficial) | repo: `site/content/guias/*.mdx` (PR) | — |
| tópicos, comentários, contas da Comunidade | Supabase **`manual-zomboid-comunidade`** (projeto separado) | moderação (S5) |

## 2. Visão geral
```mermaid
flowchart LR
  subgraph PCs["PCs (Jose e sócio)"]
    PUB["publicar.py + Claude"]
    PUSH["git push / PR"]
  end
  PUB --> SLACK[("Slack: 3 canais")]
  PUSH --> GH["GitHub"]

  SLACK -- "Events API" --> F1["Edge Fn slack-eventos"]
  GH -- "Action: sync-repo" --> DB
  F1 --> DB[("Supabase Postgres + Realtime")]
  AN["Chat de análises (Claude)"] -- "conector Supabase" --> DB
  STEAM["Steam News (PZ)"] -- "cron" --> F3["Edge Fn zomboid-noticias"] --> DB

  DB -- "Realtime + RLS (login)" --> CENTRAL["Central (SPA)"]
  DB -- "views públicas (anon)" --> SITE["Site (Next.js)"]
  SITE <--> DBC[("Supabase Comunidade")]
  SITE --> R2[("Cloudflare R2: imagens")]
  RSS["YouTube RSS"] --> SITE
  DISC["Discord widget"] --> SITE
  MDX["site/content/blog"] --> SITE
```

## 3. Central (`plataforma/`)
### Stack
- **App:** Vite + React + TypeScript (SPA estática; servidor = Supabase).
- **UI:** Tailwind com os tokens da marca, componentes próprios estilo HUD, Recharts nos gráficos.
- **Dados:** `@supabase/supabase-js` + TanStack Query; Realtime no feed.
- **Login:** Supabase Auth com **GitHub** (os dois já têm conta). Cadastro fechado: só quem está em `membros`.
- **Hospedagem:** Cloudflare Workers, só arquivos estáticos (grátis). GitHub Action publica a cada push na `main`.

### Telas
| tela | o que mostra |
|---|---|
| **Painel** | episódios por status (quadro), próximas postagens (seg/qua/sex), últimos alertas, tarefas abertas |
| **Episódios** | lista + ficha: status, responsável, build, fatos, prévias (v1, v2...), final + capa, vídeo no YouTube, métricas |
| **Prévias e finais** | linha do tempo de entregas, com player do Drive e filtro por episódio/pessoa |
| **Ao vivo** | feed do projeto em tempo real (prévias, finais, pushes e PRs, tarefas), sem depender do Slack |
| **Métricas** | tabela de `canal/metricas.md` automática, gráficos por vídeo/tema, relatório quinzenal |
| **Tarefas** | quadro a-fazer / fazendo / feito, por pessoa e episódio |
| **Notícias PZ** | fila de patch notes da Steam: resumir em PT-BR, pôr build e fonte, aprovar para o site |

### Pastas
```
plataforma/
  arquitetura.md, plano.md
  app/                    # SPA (Vite)
  supabase/
    migrations/           # SQL versionado (RLS incluso)
    functions/
      slack-eventos/      # recebe eventos do Slack
      zomboid-noticias/   # busca notícias do PZ
  scripts/
    sync_repo.py          # roteiros/ + videos/README.md -> episodios
```

### Banco (Supabase Postgres)
| tabela | campos principais | quem escreve |
|---|---|---|
| `membros` | user_id, nome, github, papel | Jose (1x) |
| `episodios` | nn, slug, tema, responsavel, status, build, fatos[], youtube_id, commit | `sync_repo.py` |
| `entregas` | ep, tipo (previa/final/capa), versao, link, autor, duracao, slack_ts | `slack-eventos` |
| `alertas` | canal, tipo, texto, autor, slack_ts (único), criado_em | `slack-eventos` |
| `metricas_diarias` | youtube_id, dia, views, retencao_media, inscritos, origem... | chat de análises |
| `relatorios` | periodo, conteudo, criado_por | Central |
| `tarefas` | titulo, ep, responsavel, status, prazo, ordem | Central |
| `noticias_pz` | url, titulo_original, data, build, resumo_ptbr, status, aprovado_por | `zomboid-noticias` + Central |
| views `pub_*` | vídeos publicados, notícias aprovadas | leitura anônima (site) |

- **RLS em tudo.** Membro lê e escreve o que é da Central; funções usam a service role; anônimo só lê `pub_*`.
- **Ligação vídeo ↔ episódio:** campo novo `youtube:` no cabeçalho do roteiro, preenchido ao publicar. O repo continua dono.

### Fluxos
- **Episódios:** push na `main` → GitHub Action roda `sync_repo.py` → upsert em `episodios`.
- **Prévias/finais + Ao vivo (C3, sem Slack):** `publicar.py` e o GitHub (Action no push/PR) gravam direto em `entregas` e `alertas` → Realtime atualiza a tela. O desenho do Slack (`slack-eventos`) foi cancelado em 25/11: a Central faz o mesmo sozinha, sem app do Slack.
- **Métricas:** o chat de análises grava em `metricas_diarias` pelo conector do Supabase. Relatório quinzenal na Central (mesma tabela de `canal/metricas.md`). Futuro: cron com a API do YouTube.
  - Métrica que a API não der (ex.: "viewed vs swiped away"): campo manual, sem inventar.

## 4. Site (`site/`)
Especificação completa, Comunidade e padrão de qualidade: **`plataforma/site.md`** (manda sobre o resumo abaixo). Resumo técnico:
- **Next.js + TypeScript + MDX** no Cloudflare Workers (OpenNext): landing e guias estáticos (rebuild 1x/dia); Comunidade renderizada no servidor.
- **Comunidade:** Supabase próprio (`manual-zomboid-comunidade`), login Discord/Google/e-mail, imagens no Cloudflare R2, Turnstile contra spam.
- **3D:** React Three Fiber + drei + postprocessing, reaproveitando `projeto/assets/pz` e o `PZ.SOBREVIVENTE`. Carrega sob demanda, com imagem de fallback.
- **Movimento:** GSAP + ScrollTrigger, Lenis. `prefers-reduced-motion` desliga.
- **Vídeos:** RSS público do canal no YouTube (sem chave) + lite-youtube-embed.
- **Discord:** convite + widget oficial do servidor.
- **Atualizações do Zomboid:** só notícias **aprovadas** na Central (`pub_noticias`), cada uma com build e fonte.
- **Guias:** `site/content/guias/*.mdx`, cabeçalho com `build`, `fontes`, `video` e `fatos: [ids]`. Checagem no build: todo id existe em `projeto/pipeline/fatos.json`, nenhum termo de `_nao-usar.md`.
- **SEO:** next/og por post, RSS, sitemap, schema.org `VideoObject` e `BlogPosting`.
- **Hospedagem:** Cloudflare (mesma conta da Central); domínio quando o Jose comprar.

### Assets do jogo no site
- Liberado (decisão do Jose, skill do site): imagens, ícones, telas e modelos do jogo.
- **Não liberado:** sons e músicas do jogo. Site sem áudio do jogo.
- Só entra a lista curada (`site/assets.json`), copiada de `projeto/assets` no build. Nunca a pasta inteira.
- O `README.md` diz "nunca publique" os assets: precisa de uma linha com essa exceção (etapa S1).

## 5. Riscos e cuidados
| risco | cuidado |
|---|---|
| Cota do Git LFS (10 GiB/mês) gasta no CI | CI baixa só os arquivos da lista curada (`git lfs pull --include`) + cache |
| Parser das mensagens do Slack quebra se o modelo mudar | parser testado com as mensagens reais; mensagem não reconhecida vira só alerta |
| Supabase grátis pausa sem uso | cron diário mantém ativo; aviso se pausar |
| Dado do jogo errado no site | mesma trava dos vídeos (fatos.json) + revisão por PR |
| Prévia vaza (link "qualquer pessoa com o link") | Central atrás de login; site nunca mostra prévia; Comunidade em outro projeto Supabase |
| Comunidade vazia | fácil de usar (login 1 clique, colar print), tópicos semente, tópico por vídeo, teste com 5 pessoas (`site.md` §4–5) |
| Spam, conteúdo ilegal, menores | Turnstile, limites no banco, denúncia, moderação, termos/LGPD/ECA Digital revisados (`site.md` §5) |
