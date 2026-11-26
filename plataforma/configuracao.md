# Plataforma — configuração manual (Jose)

O que só o Jose pode fazer: criar contas, gerar chaves e ligar plataformas.
Fez um item? Marque `[x]` e avise o Claude (o seu ou o do Bruno). Ele segue daí.

**Regra das chaves**
- 🔒 **Segredo**: cole direto no lugar indicado (Supabase, GitHub ou Cloudflare). **Nunca no chat, no Slack ou no git.**
- 📋 **Público** (ID, link de convite, nome): pode mandar no chat.

Etapas (C3, S3...): `plataforma/plano.md`.

## Próximos passos, em ordem (atualizado 25/11)
1. 🔒 **Trocar os segredos do Discord que foram parar num .txt** (bot token e os 2 webhooks): §6.2 e §6.3. Depois de trocar, cole os novos só no Supabase.
2. 📋 Escrever o **#regras** do Discord e mandar o resumo (o site mostra em "Discord").
3. §1 e §2 (fechar a Central e dar acesso ao Claude do Bruno), se ainda faltar.
4. §7 Domínio → §8 Comunidade (projeto Supabase, logins, anti-spam, imagens). Com isso a Comunidade e as **tierlists** saem do modo prévia.
5. §4 Métricas e §9 quando chegar a etapa.

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

## 3. ~~Slack: feed ao vivo~~ (cancelado em 25/11)
Não precisa mais criar app no Slack. Tudo que essa etapa faria (feed ao vivo, prévias e finais, histórico) a **Central faz sozinha** (etapa C3 nova, `plano.md`): fica num lugar só e é mais fácil entender o que aconteceu no projeto.
- Nada a configurar. Se já criou o app `Central` no Slack, pode apagar.
- Os avisos que o `publicar.py` e o `resumo_push.py` mandam no Slack continuam funcionando como hoje.

## 4. Métricas (etapa C5)
- [ ] No chat de análises: conector **Supabase** ligado, com acesso ao projeto `manual-zomboid`.
- Nada mais. O formato das tabelas sai na C5.

## 5. YouTube (etapas S3 e futuro)
- [x] 📋 **ID do canal**: `UClX3FcUESD8WJe9sxF-T8VA` (no site desde 25/11: Shorts recentes com capa e resumo)
- [ ] 📋 (opcional) **@ do canal** (ex.: `@manualzomboid`): o botão "Ver o canal" passa a usar o endereço bonito.
- [ ] (Futuro: métricas automáticas, grátis) Google Cloud > novo projeto > ativar **YouTube Data API v3** e **YouTube Analytics API**. Não gere chave ainda: o Claude diz qual tipo quando chegar lá.

## 6. Discord (etapas S3, S4 e integração futura)
### 6.1 Servidor (para o site)
- [x] Modo desenvolvedor ligado.
- [x] 📋 **ID do servidor**: `1574466784935940106`
- [x] **Widget do servidor** ativado (o site mostra "N online agora").
- [x] 📋 **Convite**: https://discord.gg/gxsn9SYPFu (confira se está como Expirar: **Nunca**, Usos: **Sem limite**)
- [x] 📋 IDs dos canais (viram atalhos na seção Discord do site): Jogar junto `1574880090465112114` · Dicas e truques `1574878469727195336` · Bases `1574878536626344087` · Regras `1574877331527303229`
- [ ] Canal **#regras** com as regras escritas → 📋 mande o resumo (hoje o site mostra um rascunho).

### 6.2 Avisos automáticos (simples, sem bot)
Um webhook por canal que recebe aviso (vídeo novo, post novo no blog, notícia do PZ aprovada).
- [x] Webhooks criados: **Anúncios** e **Vídeos**.
- [ ] ⚠️ **Gerar de novo**: as URLs foram escritas num `.txt` e passadas no chat, então valem como vazadas (quem tem a URL posta no canal). Configurações do canal > Integrações > Webhooks > abra o webhook > **Excluir** e crie outro (ou "Copiar URL" de um novo).
- [ ] 🔒 URL nova → Supabase (projeto `manual-zomboid`, da Central) > Edge Functions > Secrets:
  - `DISCORD_WEBHOOK_ANUNCIOS` (canal de anúncios)
  - `DISCORD_WEBHOOK_VIDEOS` (canal de vídeos novos)

### 6.3 App do Discord (login na Comunidade na S4; bot no futuro)
- [ ] https://discord.com/developers/applications > **New Application** > `Manual Zomboid`.
- [x] 📋 **Application ID**: `1575043022515609712` (é o Client ID do login com Discord na §8) · **Public Key**: `c07d1f3ebd244a3178fe76cdb853924b6ca98dfc3642445e6f8477c26411a580`
- [ ] ⚠️ Bot > **Reset Token**: o token atual foi escrito num `.txt` e passado no chat. Gere outro (o antigo para de funcionar na hora) e cole 🔒 só em Supabase > Edge Functions > Secrets > `DISCORD_BOT_TOKEN`.
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

## Site: onde cada chave entra (estrutura pronta)
O site já está no ar em modo prévia: https://manual-zomboid-site.mundomix.workers.dev. Cada chave abaixo liga uma parte sozinha, sem mexer no código.
- 📋 **Públicas** → `site/config.publico.json` (mande no chat; o Claude preenche e abre o PR).
- 🔒 **Segredos** → o site **não guarda nenhum**. Todos ficam no Supabase (comunidade) ou nos GitHub Secrets (deploy, já feitos).
- Conferir o que falta: `cd site && npm run config` (também acusa segredo colado no lugar errado).

| campo em `config.publico.json` | vem de (seção) | o que liga no site |
|---|---|---|
| `youtube.canalId` ✅, `youtube.handle` | §5 | Shorts com a capa de cada vídeo e a modal com o resumo conferido |
| `discord.convite`, `discord.servidorId` ✅ | §6.1 | botão "Entrar no Discord", contador de online (widget) e o zumbi "Discord" da abertura |
| `discord.canais.*`, `discord.appId` ✅ | §6.1, §6.3 | atalhos para Jogar junto, Dicas e truques, Bases e Regras |
| `redes.instagram`, `redes.tiktok`, `redes.facebook` | — | URL completa do perfil: aparece em `/links` e no rodapé (vazio = escondido) |
| `site.url` ✅ (`https://manualzomboid.site`), `site.dominioImagens` | §7 | domínio, SEO liberado (hoje o `robots` bloqueia indexação) e `img.<dominio>` |
| `comunidade.supabaseUrl`, `comunidade.supabaseChavePublica` | §8 | sai do modo prévia: contas, posts, votos e **tierlists** de verdade |
| `comunidade.turnstileSiteKey` | §8 | anti-spam no cadastro e no 1º post |
| `legal.emailContato`, `legal.idadeMinima` | §8 | termos e privacidade |

§5 e §6.1 já estão no site (25/11): a landing está completa. Falta §7 + §8 para abrir a Comunidade e as tierlists.

---

## Resumo: o que mandar no chat × o que colar direto
| item | tipo | vai para |
|---|---|---|
| Discord webhooks (anúncios, vídeos), Bot Token | 🔒 | Supabase Edge Functions Secrets (Central) |
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
> Você é o dev da plataforma do Manual Zomboid. Leia, nesta ordem: `CLAUDE.md`, `plataforma/plano.md`, `plataforma/arquitetura.md`, `plataforma/site.md` (site, Comunidade estilo Reddit e padrão de qualidade), `plataforma/README.md` e `plataforma/configuracao.md`. Use a skill `manual-zomboid-landing-blog` no site. A Central (C1) está no ar. Siga o plano: C3 (ao vivo + prévias e finais, nativo na Central, sem Slack), C4 (tarefas), C5 (métricas), C6 (notícias PZ), depois o site (S0 a S8). O `site.md` manda: a Comunidade só vale se for muito fácil de usar. 1 etapa = 1 PR, merge automático com o CI verde. Itens já configurados: [cole aqui os 📋 e diga quais 🔒 já estão colados].
