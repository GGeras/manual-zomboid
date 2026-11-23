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

## 6. Discord (etapas S3, S4 e integração futura)
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

### 6.3 App do Discord (login na Comunidade na S4; bot no futuro)
- [ ] https://discord.com/developers/applications > **New Application** > `Manual Zomboid`.
- [ ] 📋 General Information: **Application ID** e **Public Key**.
- [ ] Bot > **Reset Token** > 🔒 → Supabase > Edge Functions > Secrets > `DISCORD_BOT_TOKEN`.
- [ ] Bot > Privileged Gateway Intents: deixe **tudo desligado** por enquanto.
- [ ] OAuth2 > URL Generator:
  - scopes: `bot` e `applications.commands`;
  - permissions: View Channels, Send Messages, Embed Links, Read Message History.
  - Abra a URL gerada e adicione o bot ao servidor.

## 7. Domínio (antes da etapa S4)
A Comunidade precisa do domínio: login com Google, imagens (`img.<dominio>`) e anti-spam dependem dele.
- [ ] Comprar o domínio (sugestão: Cloudflare > Domain Registration, preço de custo). 📋 Mande o nome.
- [ ] Se comprar fora da Cloudflare: Cloudflare > Add a domain > troque os nameservers no registrador.
- [ ] Cloudflare > **Web Analytics**: ligar para o domínio (grátis, sem cookie).

## 8. Comunidade: contas, imagens e anti-spam (etapa S4)
Especificação: `plataforma/site.md`.
- [ ] **Projeto Supabase novo** `manual-zomboid-comunidade` (separado da Central, grátis). Diga "pode criar" ao Claude: ele cria pelo conector.
  - O plano grátis permite 2 projetos ativos. Se já tiver outro, avise.
- [ ] **Login com Discord** (usa o mesmo app do 6.3):
  - Developer Portal > OAuth2 > Redirects > adicionar `https://<ref-do-projeto-comunidade>.supabase.co/auth/v1/callback` (o Claude passa o `<ref>`).
  - 📋 Client ID e 🔒 Client Secret → Supabase (projeto comunidade) > Authentication > Providers > **Discord**.
- [ ] **Login com Google**:
  - Google Cloud > APIs & Services > **OAuth consent screen**: External, nome "Manual Zomboid", e-mail de suporte, logo, domínio do site, links de privacidade e termos (o Claude cria as páginas na S4).
  - Credentials > Create OAuth client ID > Web application > redirect: o mesmo `.../auth/v1/callback`.
  - 📋 Client ID e 🔒 Client Secret → Supabase (projeto comunidade) > Providers > **Google**.
- [ ] **E-mail de login (Resend)**: o e-mail padrão do Supabase só manda poucos por hora. Em produção, precisa de SMTP próprio.
  - Conta em https://resend.com (grátis até 3.000/mês) > Domains > Add domain > autorize a Cloudflare a criar os registros DNS.
  - 🔒 API Key → Supabase (projeto comunidade) > Authentication > Emails > **SMTP Settings**: host `smtp.resend.com`, porta 465, usuário `resend`, senha = a API key, remetente `nao-responda@<dominio>`.
- [ ] **Anti-spam (Cloudflare Turnstile)**: Cloudflare > Turnstile > Add widget > domínio do site > modo Managed.
  - 📋 Site Key: manda no chat.
  - 🔒 Secret Key → Supabase (projeto comunidade) > Authentication > Attack Protection > **CAPTCHA** > Turnstile.
- [ ] **Imagens (Cloudflare R2)**: Cloudflare > R2 > ativar.
  - Pede cartão cadastrado, mas é grátis até 10 GB e sem custo de banda.
  - Depois avise: o Claude cria o bucket e liga `img.<dominio>`.
  - Confira se o token `CLOUDFLARE_API_TOKEN` tem a permissão **Workers R2 Storage: Edit**. Se não tiver, edite o token e adicione.
- [ ] **Regras e lei**:
  - 📋 e-mail de contato para privacidade e denúncias;
  - 📋 idade mínima;
  - 📋 lista de moderadores (usuário do Discord).
  - O Claude escreve termos, privacidade e regras. **Recomendado:** um advogado revisar (público tem menores: ECA Digital e LGPD).
- [ ] **Teste com 5 pessoas** do Discord antes de abrir: o Claude prepara o roteiro do teste; você chama as pessoas.

## 9. Newsletter e bot do Discord (etapa S8, futuro)
- [ ] Newsletter: usa o mesmo Resend. 🔒 Uma API key nova ("Sending access") → Supabase > Edge Functions > Secrets > `RESEND_API_KEY`.
- [ ] Bot do Discord: item 6.3.

---

## Resumo: o que mandar no chat × o que colar direto
| item | tipo | vai para |
|---|---|---|
| Slack Bot Token, Signing Secret | 🔒 | Supabase Edge Functions Secrets |
| Discord webhooks, Bot Token | 🔒 | Supabase Edge Functions Secrets |
| Resend API key | 🔒 | Supabase (SMTP do projeto comunidade; Edge Functions Secrets na newsletter) |
| Client Secret do Discord e do Google (login) | 🔒 | Supabase comunidade > Authentication > Providers |
| Turnstile Secret Key | 🔒 | Supabase comunidade > Attack Protection |
| Client ID do Discord e do Google, Turnstile Site Key | 📋 | chat |
| contato, idade mínima, moderadores | 📋 | chat |
| ID do canal do YouTube | 📋 | chat |
| ID do servidor, IDs dos canais, convite do Discord | 📋 | chat |
| Application ID e Public Key do Discord | 📋 | chat |
| domínio | 📋 | chat |

## Para o Claude do Bruno (colar no início da conversa)
> Você é o dev da plataforma do Manual Zomboid. Leia, nesta ordem: `CLAUDE.md`, `plataforma/plano.md`, `plataforma/arquitetura.md`, `plataforma/site.md` (site, Comunidade estilo Reddit e padrão de qualidade), `plataforma/README.md` e `plataforma/configuracao.md`. Use a skill `manual-zomboid-landing-blog` no site. A Central (C1) está no ar. Siga o plano: C3 (Slack ao vivo + prévias e finais), C4 (tarefas), C5 (métricas), C6 (notícias PZ), depois o site (S0 a S8). O `site.md` manda: a Comunidade só vale se for muito fácil de usar. 1 etapa = 1 PR, merge automático com o CI verde. Itens já configurados: [cole aqui os 📋 e diga quais 🔒 já estão colados].
