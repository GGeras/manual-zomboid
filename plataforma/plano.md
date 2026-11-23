# Plataforma — plano de etapas e chaves

Arquitetura: `plataforma/arquitetura.md`. Como rodar e configurar: `plataforma/README.md`.
Regra: **1 etapa = 1 PR**, com prints, linha no `CHANGELOG.md` e aviso no `#atualizações-projeto`.
Ordem: Central primeiro (C1–C6), depois o site (S1–S6). A S0 (direção de arte) pode ser decidida antes, para não travar.

## Decisões do Jose
| # | decisão | escolha |
|---|---|---|
| 1 | hospedagem | **Cloudflare** (Workers, arquivos estáticos) |
| 2 | login da Central | **GitHub**; Central no mesmo repo, em `plataforma/` |
| 3 | métricas | **o chat de análises alimenta o banco**; puxar direto da API do YouTube fica para o futuro (Windsor.ai é pago) |
| 4 | banco | projeto Supabase **`manual-zomboid`** (São Paulo, grátis) — criado |

## Central
| etapa | entrega | precisa antes (chave/API) | quem | onde fica |
|---|---|---|---|---|
| **C0** | arquitetura + plano | — | — | — |
| **C1** ✅ código | banco com RLS, login GitHub, Painel, Episódios, ficha; sync automático do repo; publicação automática | ver "Falta para a C1 funcionar" abaixo | Jose | Supabase, GitHub Secrets, Cloudflare |
| **C3** | Ao vivo (Slack em tempo real) + Prévias e finais + histórico | **Slack App "Central"**: escopos `channels:history`, `channels:read`, `users:read` (canal privado: + `groups:history`); evento `message.channels` (URL eu passo); bot nos 3 canais → **Signing Secret** + **Bot Token** | Jose (admin do Slack) | Supabase Secrets |
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
| etapa | entrega | precisa antes (chave/API) | quem |
|---|---|---|---|
| **S0** | 2 direções de arte, 1 imagem de referência cada → Jose escolhe | nada | Jose escolhe |
| **S1** | Next.js, marca, blog MDX com trava de fatos, RSS, sitemap, rodapé; exceção de assets no `README.md`; prévia no ar | Cloudflare (mesma da C1) | — |
| **S2** | abertura 3D imersiva + narrativa no scroll + fallback + versão leve | nada | — |
| **S3** | Shorts recentes + Comunidade (Discord) | **ID do canal** do YouTube (UC...)<br>**Discord**: convite que não expira, widget ligado, **ID do servidor**, regras | Jose |
| **S4** | Atualizações do Zomboid (só aprovadas na Central) | nada (chave pública do Supabase já existe) | — |
| **S5** | Lighthouse ≥ 90, teste Android/iPhone/desktop, lançamento | **domínio** + DNS na Cloudflare; Cloudflare Web Analytics | Jose |
| **S6** | futuro: newsletter, aviso de vídeo novo no Discord | **Resend** (API key + domínio); **webhook do Discord** | Jose |

- Nenhuma chave entra no git nem no chat: vai direto para Supabase, GitHub Secrets ou Cloudflare.
- Custo: tudo em plano grátis. Domínio é o único gasto previsto.

## Como cada etapa fecha
1. `python ferramentas/validar.py` com 0 erro(s); testes da etapa passando.
2. Prévia no ar (link da hospedagem).
3. PR com o que + por quê, prints de celular e desktop, e o que ainda depende de chave.
4. Aviso no `#atualizações-projeto`.
