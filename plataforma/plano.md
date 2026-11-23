# Plataforma — plano de etapas e chaves

Arquitetura: `plataforma/arquitetura.md`.
Regra: **1 etapa = 1 PR**, com prints, linha no `CHANGELOG.md` e aviso no `#atualizações-projeto`.
Ordem: Central primeiro (C1–C6), depois o site (S1–S6). A S0 (direção de arte) pode ser decidida antes, para não travar.

## Decisões do Jose (antes da C1)
| # | decisão | recomendo | por quê |
|---|---|---|---|
| 1 | hospedagem | **Cloudflare** | grátis com uso comercial, prévia por PR. Vercel grátis é só uso não comercial |
| 2 | login da Central | **GitHub** | os dois já têm conta; nada de e-mail para configurar |
| 3 | métricas | **API própria do YouTube** | dado direto do canal, sem serviço pago no meio. Alternativa: Windsor.ai |
| 4 | banco | **projeto Supabase novo `manual-zomboid`** (São Paulo, grátis) | a org tem 1 projeto ativo de 2 grátis; eu crio pelo conector |

## Central
| etapa | entrega | precisa antes (chave/API) | quem consegue | onde fica |
|---|---|---|---|---|
| **C0** | arquitetura + plano (este PR) | nada | — | — |
| **C1** | Supabase, banco com RLS, login GitHub, casca da Central no ar, Episódios (sync manual) | 1. aprovar projeto Supabase<br>2. **GitHub OAuth App**: Client ID + Client Secret (callback eu passo)<br>3. usuários GitHub do Jose e do sócio<br>4. **conta Cloudflare** + repo conectado no Pages | Jose | 2 → Supabase (Auth > GitHub)<br>4 → painel Cloudflare |
| **C2** | sync automático do repo (Action no push da `main`); campo `youtube:` no roteiro | **GitHub Secrets** `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` | Jose (eu digo onde copiar) | GitHub > Settings > Secrets |
| **C3** | Ao vivo (Slack em tempo real) + Prévias e finais + importação do histórico | **Slack App "Central"** no workspace:<br>• escopos `channels:history`, `channels:read`, `users:read` (canal privado: + `groups:history`)<br>• evento `message.channels` (URL eu passo)<br>• instalar e convidar o bot nos 3 canais<br>→ **Signing Secret** + **Bot Token** | Jose (admin do Slack) | Supabase Secrets |
| **C4** | Tarefas (quadro por pessoa e episódio) | nada | — | — |
| **C5** | Métricas diárias + relatório quinzenal | **Google Cloud**: projeto, YouTube Data API v3 + YouTube Analytics API, tela de consentimento, cliente OAuth (Web) → Client ID + Secret<br>**dono do canal** autoriza 1x (link que eu gero) → refresh token<br>**ID do canal** (UC...) | Jose (dono do canal) | Supabase Secrets |
| **C6** | Notícias PZ: busca na Steam + fila de aprovação na Central | nada (Steam News é público) | — | — |

## Site
| etapa | entrega | precisa antes (chave/API) | quem consegue |
|---|---|---|---|
| **S0** | 2 direções de arte, 1 imagem de referência cada → Jose escolhe | nada | Jose escolhe |
| **S1** | Next.js, marca, blog MDX com trava de fatos, RSS, sitemap, rodapé; exceção de assets no `README.md`; prévia no ar | Cloudflare (mesma da C1) | — |
| **S2** | abertura 3D imersiva + narrativa no scroll + fallback + versão leve | nada | — |
| **S3** | Shorts recentes + Comunidade (Discord) | **ID do canal** (da C5)<br>**Discord**: convite que não expira, widget ligado (Config. do servidor > Widget), **ID do servidor**, regras do servidor | Jose (dono do servidor) |
| **S4** | Atualizações do Zomboid (só aprovadas na Central) | chave pública do Supabase (eu pego) | — |
| **S5** | Lighthouse ≥ 90, teste Android/iPhone/desktop, lançamento | **domínio** (comprar) + DNS na Cloudflare; Cloudflare Web Analytics (grátis, sem cookie) | Jose |
| **S6** | futuro: newsletter, aviso de vídeo novo no Discord | **Resend** (API key + domínio verificado); **webhook do Discord** | Jose |

- Nenhuma chave entra no git nem no chat: cada uma vai direto para Supabase Secrets, GitHub Secrets ou Cloudflare.
- Custo: tudo em plano grátis. Domínio é o único gasto previsto.

## Como cada etapa fecha
1. `python ferramentas/validar.py` com 0 erro(s); testes da etapa passando.
2. Prévia no ar (link da hospedagem).
3. PR com o que + por quê, prints de celular e desktop, e o que ainda depende de chave.
4. Aviso no `#atualizações-projeto`.
