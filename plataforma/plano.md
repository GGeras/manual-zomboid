# Plataforma — plano de etapas e chaves

Arquitetura: `plataforma/arquitetura.md`. Como rodar e configurar: `plataforma/README.md`.
Regra: **1 etapa = 1 PR**, com prints, linha no `CHANGELOG.md` e aviso no `#atualizações-projeto`. **Merge automático**, sem code review (decisão do Jose, 23/11): CI verde → merge.
Ordem: Central primeiro (C1–C6), depois o site (S1–S6). A S0 (direção de arte) pode ser decidida antes, para não travar.

## Decisões do Jose
| # | decisão | escolha |
|---|---|---|
| 1 | hospedagem | **Cloudflare** (Workers, arquivos estáticos) |
| 2 | login da Central | **GitHub**; Central no mesmo repo, em `plataforma/` |
| 3 | métricas | **o chat de análises alimenta o banco**; puxar direto da API do YouTube fica para o futuro (Windsor.ai é pago) |
| 4 | banco | projeto Supabase **`manual-zomboid`** (São Paulo, grátis) — criado |
| 5 | site | landing + Guias (blog oficial) + **Comunidade estilo Reddit, bem mais simples**: conta própria, tópicos com texto e imagens (`site.md`) |

## Central
| etapa | entrega | precisa antes (chave/API) | quem | onde fica |
|---|---|---|---|---|
| **C0** | arquitetura + plano | — | — | — |
| **C1** ✅ código | banco com RLS, login GitHub, Painel, Episódios, ficha; sync automático do repo; publicação automática | ver "Falta para a C1 funcionar" abaixo | Jose | Supabase, GitHub Secrets, Cloudflare |
| **C3** | Ao vivo + Prévias e finais + histórico, **nativos na Central** (sem Slack: decisão de 25/11, tudo que o Slack faria a Central faz sozinha) | nada (usa o `SUPABASE_SECRET_KEY` que já está nos GitHub Secrets) | — | — |
| **C4** | Tarefas (quadro por pessoa e episódio) | nada | — | — |
| **C5** | Métricas + relatório quinzenal: tabelas e o formato que o chat de análises usa para gravar | o chat de análises com o conector do Supabase | Jose | — |
| **C6** | Notícias PZ: busca na Steam + fila de aprovação | nada (Steam News é público) | — | — |

### Falta para a C1 funcionar (passo a passo no `plataforma/README.md`)
1. **GitHub OAuth App** → Client ID + Client Secret no Supabase (Authentication > Providers > GitHub).
2. **Cloudflare**: API Token ("Edit Cloudflare Workers") + Account ID → GitHub Secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.
3. **Supabase secret key** → GitHub Secret `SUPABASE_SECRET_KEY` (sync do repo).
4. Endereço da Central (sai no 1º deploy) → Supabase (Authentication > URL Configuration).
5. **Usuário GitHub do sócio** → eu libero no banco.

## Site
Especificação completa (landing, guias, **Comunidade estilo Reddit**, padrão de qualidade): `plataforma/site.md`.

| etapa | entrega | precisa antes (chave/API) | quem |
|---|---|---|---|
| **S0** | 2 direções de arte (1 imagem cada) + nome da Comunidade → Jose escolhe | nada | Jose escolhe |
| **S1** ✅ | Next.js no Cloudflare (OpenNext), marca, landing sem 3D, Guias MDX com trava de fatos, RSS, sitemap, rodapé; exceção de assets no `README.md`; prévia no ar | Cloudflare (mesma da C1) | — |
| **S2** ✅ | abertura 3D: **horda com os zumbis e animações originais do jogo** que seguem o mouse/dedo; cada zumbi-tópico leva a um caminho (Tierlists, Comunidade, Discord, Guias, Shorts); olhos no escuro pela página; fallback estático e versão leve | nada | — |
| **S3** ✅ | Shorts recentes (capa → modal com resumo conferido) + temas clicáveis + Discord (widget, convite, atalhos dos canais) | ✅ ID do canal e Discord recebidos (25/11) | — |
| **S4** 🟡 interface pronta em modo prévia (`site/`), migração do banco escrita; falta ligar as chaves | **Comunidade v1**: contas (Discord, Google, e-mail), tópicos com texto + imagens, comentários, voto, melhor resposta, categorias, busca, perfil, denúncia, moderação, anti-spam, termos e privacidade; teste com 5 pessoas | projeto Supabase `manual-zomboid-comunidade`; **domínio**; OAuth Discord e Google; Turnstile; R2; Resend (SMTP) | Jose |
| **S4b** 🟡 interface pronta em modo prévia | **Tierlists**: 3 oficiais (S+ a D), voto sem data limite, anônimo ou com nome (padrão no perfil), quem votou (só logado), comentários com respostas, sugestões da comunidade votáveis | migração `20261125000000_tierlists.sql` (junto com a S4) | — |
| **S5** | **Comunidade v2**: sino, menções, tópico automático por vídeo, aviso no Discord, painel de moderação na Central, selos | webhook do Discord | Jose |
| **S6** | Atualizações do Zomboid (só aprovadas na Central) | nada | — |
| **S7** | lançamento: Lighthouse ≥ 90, Android/iPhone/desktop, Web Analytics, 15–20 tópicos semente | Cloudflare Web Analytics | Jose + Bruno |
| **S8** | futuro: newsletter, bot do Discord | Resend (já existe); bot do Discord | Jose |

- Nenhuma chave entra no git nem no chat: vai direto para Supabase, GitHub Secrets ou Cloudflare.
- Custo: tudo em plano grátis. Domínio é o único gasto previsto. O R2 pede cartão cadastrado na Cloudflare, mas é grátis até 10 GB.

## Como cada etapa fecha
1. `python ferramentas/validar.py` com 0 erro(s); testes da etapa passando.
2. Prévia no ar (link da hospedagem).
3. PR com o que + por quê, prints de celular e desktop, e o que ainda depende de chave.
4. CI verde → merge automático (outros PRs abertos entram antes, na ordem em que foram abertos, sem sobrepor o que já está na main).
5. Aviso no `#atualizações-projeto`.
