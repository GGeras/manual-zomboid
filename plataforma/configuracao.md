# Plataforma — configuração manual (Jose)

O que só o Jose pode fazer: criar contas, gerar chaves e ligar plataformas.
Fez um item? Marque `[x]` e avise o Claude (o seu ou o do Bruno). Ele segue daí.

**Regra das chaves**
- 🔒 **Segredo**: cole direto no lugar indicado (Supabase, GitHub ou Cloudflare). **Nunca no chat, no Slack ou no git.**
- 📋 **Público** (ID, link de convite, nome): pode mandar no chat.

Etapas (C3, S3...): `plataforma/plano.md`.

---

## 0. Já feito
- [x] Supabase `manual-zomboid` criado
- [x] Login com GitHub (OAuth App → Supabase)
- [x] `SUPABASE_SECRET_KEY`, `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` nos GitHub Secrets
- [x] Central no ar: https://manual-zomboid-central.mundomix.workers.dev
- [x] Bruno: colaborador do repo (write) e membro da Central

## 1. Fechar a Central (5 min)
- [ ] **Supabase > Authentication > URL Configuration**
  - Site URL: `https://manual-zomboid-central.mundomix.workers.dev`
  - Redirect URLs: o mesmo endereço e `http://localhost:5173`
- [ ] **Supabase > Authentication > Sign In / Providers > Email**: desligue (ninguém entra por e-mail).
- [ ] Teste: entre na Central com o GitHub. Peça ao Bruno para entrar também.

## 2. Acesso do Claude do Bruno (antes de passar a vez)
Sem isso, o Claude do Bruno não consegue mexer no banco nem publicar.
- [ ] **Supabase > Organization > Team > Invite member**: e-mail do Bruno, papel **Developer** (ou Owner).
- [ ] Bruno conecta, no Claude dele: **Supabase**, **Slack**, **GitHub** e **Google Drive** (claude.ai > Settings > Connectors).
- [ ] **Cloudflare** (opcional): Manage Account > Members > Invite, e-mail do Bruno. O deploy já roda pela Action; isso é só para ele ver os logs.

## 3. Slack: feed ao vivo (etapa C3)
- [ ] https://api.slack.com/apps > **Create New App** > From scratch > nome `Central` > workspace do canal.
- [ ] **OAuth & Permissions > Bot Token Scopes**:
  - `channels:history`
  - `channels:read`
  - `users:read`
  - `groups:history` e `groups:read` (só se algum dos 3 canais for privado)
- [ ] **Install to Workspace** > Allow.
- [ ] 🔒 **Bot User OAuth Token** (`xoxb-...`) → Supabase > Edge Functions > Secrets > `SLACK_BOT_TOKEN`
- [ ] 🔒 **Basic Information > Signing Secret** → Supabase > Edge Functions > Secrets > `SLACK_SIGNING_SECRET`
- [ ] Nos 3 canais (`#links-rascunho`, `#links-final`, `#atualizações-projeto`), digite `/invite @Central`.
- [ ] **Depois** que o Claude publicar a função `slack-eventos`:
  - Event Subscriptions > ligar.
  - Request URL: `https://tephnuzsuoamhfukeqsi.supabase.co/functions/v1/slack-eventos`
  - Subscribe to bot events: `message.channels` (e `message.groups` se houver canal privado).
  - Save. O Slack pede para reinstalar o app: aceite.

## 4. Métricas (etapa C5)
- [ ] No chat de análises: conector **Supabase** ligado, com acesso ao projeto `manual-zomboid`.
- Nada mais. O formato das tabelas sai na C5.

## 5. YouTube (etapas S3 e futuro)
- [ ] 📋 **ID do canal** (`UC...`): https://www.youtube.com/account_advanced
- [ ] (Futuro: métricas automáticas, grátis) Google Cloud > novo projeto > ativar **YouTube Data API v3** e **YouTube Analytics API**. Não gere chave ainda: o Claude diz qual tipo quando chegar lá.

## 6. Discord (etapa S3 e integração futura)
### 6.1 Servidor (para o site)
- [ ] Discord > Configurações do usuário > Avançado > **Modo desenvolvedor**: ligar (para copiar IDs).
- [ ] 📋 **ID do servidor**: botão direito no ícone do servidor > Copiar ID do servidor.
- [ ] **Configurações do servidor > Widget > Ativar widget do servidor**. Em "Canal de convite", escolha o canal de boas-vindas.
- [ ] 📋 **Convite que não expira**: botão direito no canal de boas-vindas > Convidar pessoas > Editar link > Expirar: **Nunca**, Usos: **Sem limite**. Copie o link.
- [ ] Canal **#regras** com as regras escritas (o site mostra um resumo).
- [ ] 📋 IDs dos canais que vão receber avisos (ex.: `#novos-videos`, `#novidades-do-zomboid`): botão direito > Copiar ID do canal.

### 6.2 Avisos automáticos (simples, sem bot)
Um webhook por canal que recebe aviso (vídeo novo, post novo no blog, notícia do PZ aprovada).
- [ ] Configurações do canal > Integrações > Webhooks > **Novo webhook** > nome `Manual Zomboid` > Copiar URL.
- [ ] 🔒 URL do webhook → Supabase > Edge Functions > Secrets:
  - `DISCORD_WEBHOOK_VIDEOS` (canal de vídeos novos)
  - `DISCORD_WEBHOOK_NOTICIAS` (canal de novidades)

### 6.3 Bot (integração futura: comandos, cargos, ler o servidor)
- [ ] https://discord.com/developers/applications > **New Application** > `Manual Zomboid`.
- [ ] 📋 General Information: **Application ID** e **Public Key**.
- [ ] Bot > **Reset Token** > 🔒 → Supabase > Edge Functions > Secrets > `DISCORD_BOT_TOKEN`.
- [ ] Bot > Privileged Gateway Intents: deixe **tudo desligado** por enquanto.
- [ ] OAuth2 > URL Generator:
  - scopes: `bot` e `applications.commands`;
  - permissions: View Channels, Send Messages, Embed Links, Read Message History.
  - Abra a URL gerada e adicione o bot ao servidor.

## 7. Domínio e lançamento do site (etapa S5)
- [ ] Comprar o domínio (sugestão: Cloudflare > Domain Registration, preço de custo). 📋 Mande o nome.
- [ ] Se comprar fora da Cloudflare: Cloudflare > Add a domain > troque os nameservers no registrador.
- [ ] Cloudflare > **Web Analytics**: ligar para o domínio (grátis, sem cookie).

## 8. Newsletter (etapa S6, futuro)
- [ ] Conta em https://resend.com (grátis até 3.000 e-mails/mês).
- [ ] Domains > Add domain > os registros DNS: a Cloudflare adiciona sozinha se você autorizar.
- [ ] 🔒 API Keys > Create (permissão "Sending access") → Supabase > Edge Functions > Secrets > `RESEND_API_KEY`.

---

## Resumo: o que mandar no chat × o que colar direto
| item | tipo | vai para |
|---|---|---|
| Slack Bot Token, Signing Secret | 🔒 | Supabase Edge Functions Secrets |
| Discord webhooks, Bot Token | 🔒 | Supabase Edge Functions Secrets |
| Resend API key | 🔒 | Supabase Edge Functions Secrets |
| ID do canal do YouTube | 📋 | chat |
| ID do servidor, IDs dos canais, convite do Discord | 📋 | chat |
| Application ID e Public Key do Discord | 📋 | chat |
| domínio | 📋 | chat |

## Para o Claude do Bruno (colar no início da conversa)
> Você é o dev da plataforma do Manual Zomboid. Leia `CLAUDE.md`, `plataforma/plano.md`, `plataforma/arquitetura.md`, `plataforma/README.md` e `plataforma/configuracao.md`. A Central (C1) está no ar. Siga o plano: C3 (Slack ao vivo + prévias e finais), C4 (tarefas), C5 (métricas), C6 (notícias PZ), depois o site (S0 a S6, skill `manual-zomboid-landing-blog`). 1 etapa = 1 PR, merge automático com o CI verde. Itens já configurados: [cole aqui os 📋 e diga quais 🔒 já estão no Supabase].
