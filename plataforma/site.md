# Site — landing, guias e Comunidade

Especificação do site público (`site/`). Leia antes de qualquer etapa S.
Base: skill `manual-zomboid-landing-blog` + decisões do Jose (23/11). Etapas: `plano.md`. Chaves e contas: `configuracao.md`.

## 1. O que é
O site tem três partes, e cada uma tem uma função.

| parte | o que é | quem escreve | regra dos fatos |
|---|---|---|---|
| **Landing** | a vitrine imersiva do canal: abertura 3D, Shorts, temas, Discord, atualizações do PZ | canal | Regra nº 1 |
| **Guias** (blog oficial) | textos que aprofundam os vídeos (`site/content/guias/*.mdx`, por PR) | canal | Regra nº 1: o build barra fato fora de `info-validada/` |
| **Comunidade** | fórum estilo Reddit, **bem mais simples**: a "rede social do Zomboid" | qualquer pessoa com conta | conteúdo do usuário, com o selo "da comunidade, não verificado pelo canal" |

- **Objetivo:** ser o site de Project Zomboid mais imersivo e mais fácil de usar do nicho em PT-BR. Quem entra pela landing vira inscrito, entra no Discord ou posta na Comunidade.
- **O risco nº 1 da Comunidade é ficar vazia.** Ela fica vazia se for difícil de usar ou se não tiver motivo para voltar. Por isso as seções 4 e 5 contam tanto quanto o código.

## 2. Padrão de qualidade (obrigatório em toda etapa)
### Visual e marca
- Marca do canal: `#111111`, `#EFE5CF`, `#FF3D55`, `#8FE04A`, `#FFB020`.
  - Títulos em Inter 900, maiúsculas, espaçamento apertado.
  - Rótulos em monoespaçada negrito (HUD do jogo).
- Atmosfera de Knox County: grão de filme leve, vinheta, lanterna quente contra noite fria. **Nada com cara de template.**
- A Comunidade usa a mesma marca, mas com foco em leitura: fundo escuro calmo, texto `#EFE5CF`, efeitos só na landing.
- Movimento com propósito: cada animação leva ao próximo passo (assistir, ler, postar, entrar no Discord).
- Assets do jogo:
  - imagens, ícones, telas e modelos: liberados;
  - **sons e músicas: não liberados**;
  - arte de fã: só com permissão e crédito;
  - foto de pessoa real: nunca.

### Números que precisam passar (medidos no celular, 4G)
| métrica | meta |
|---|---|
| LCP (maior conteúdo visível) | < 2,5 s |
| INP (resposta ao toque) | < 200 ms |
| CLS (página pulando) | < 0,1 |
| Lighthouse: desempenho, acessibilidade, boas práticas, SEO | ≥ 90 nos quatro |
| JS inicial de uma página da Comunidade | < 150 KB (gzip) |
| postar um tópico com print, do clique ao tópico no ar | < 60 s para quem nunca usou |

- O 3D carrega sob demanda, com imagem de fallback e versão leve para celular fraco. Com `prefers-reduced-motion`, sem 3D pesado e sem scroll animado.
- Acessibilidade: contraste AA, tudo navegável por teclado, texto alternativo em toda imagem (a Comunidade pede o texto ao subir a imagem, com sugestão automática do nome do arquivo).
- Testes antes do PR:
  - celulares Android e iPhone, e desktop;
  - testes de ponta a ponta (Playwright): cadastro, postar com imagem, comentar, votar, denunciar.

### Pronto para entregar
Prévia no ar, prints de celular e desktop, Lighthouse anexado, PR com o que + por quê e a lista do que depende de chave.

## 3. Landing (estrutura)
Quem chega no site vem do Instagram, Facebook, TikTok ou YouTube: **não repetir "assista os Shorts"** no topo (decisão de 25/11). O topo mostra o que só existe aqui.
1. **Abertura (horda 3D):** noite de Knox County com os **zumbis e as animações originais do jogo** (`site/src/componentes/landing/horda/`, dados recortados de `projeto/assets/pz` por `scripts/gerar-zumbis.mjs`). Imersão: cada zumbi anda de um dos 4 jeitos do jogo (velocidade medida no próprio clip, sem pé patinando) e vira a cabeça para o ponteiro; sem ponteiro, a horda vaga; um zumbi bate no sedã abandonado do jogo e outro está caído e levanta quando o ponteiro chega; 2 golpes seguidos derrubam (z_death) e ele levanta de novo (z_getup); estrada, pinheiros, névoa baixa, lanterna que falha e farol do carro piscando; placas só com o título (a linha aparece no foco) e nunca uma por cima da outra.
   - Os zumbis seguem o mouse (ou o dedo), dão o bote quando alcançam e levam golpe no clique; a lanterna segue o ponteiro.
   - **Cada caminho é um zumbi** com a placa do tópico na cabeça: Tierlists, Comunidade, Discord, Guias, Shorts. A placa é um link de verdade (teclado e leitor de tela).
   - Carrega depois da página aparecer; sem WebGL, com movimento reduzido ou economia de dados: noite estática + cartões dos caminhos. Celular: palco embaixo do texto, menos zumbis.
   - Botões: Votar nas tierlists, Entrar no Discord.
2. **Tierlists da comunidade:** as 3 oficiais com o placar ao vivo (S+, S, A) e o convite para sugerir.
3. **Shorts recentes:** a **capa oficial** de cada vídeo (`referencias/capas/oficiais/epNN.jpg` → WebP no build; sem capa oficial, a miniatura do YouTube); o clique abre uma modal com o player e o **resumo do guia** (fatos de `info-validada/` com "✓ Conferido · build · ver fonte").
4. **O que você aprende:** cada tema abre uma modal com dicas diretas (fatos validados) e os vídeos do tema.
- **Olhos no escuro:** pares de olhos aparecem nas margens enquanto a pessoa rola, piscam e somem (somem rápido se o ponteiro chegar perto). Discreto, só na landing.
5. **Em alta na Comunidade:** 3 a 5 tópicos quentes, ao vivo. É o que mostra que o site tem gente.
6. **Guias:** os últimos posts oficiais, com o vídeo no topo.
7. **Discord:** convite, widget, atalhos dos canais (Jogar junto, Dicas e truques, Bases, Regras) e regras.
8. **Atualizações do Zomboid:** só as notícias aprovadas na Central, cada uma com build e fonte.
9. **Rodapé:** redes, contato, termos, privacidade e "Canal de fã, sem ligação com a The Indie Stone."

## 4. Comunidade — produto
### Princípios (o que faz as pessoas usarem)
1. **Ler sem conta. Conta em 1 clique.**
   - Entrar com **Discord** (o público do nicho já tem), **Google** ou link por e-mail. Sem senha.
   - O nome de usuário é pedido uma vez, só no primeiro post.
2. **Postar é tão fácil quanto mandar print no Discord.**
   - Colar (Ctrl+V) um print direto no texto.
   - Arrastar imagens ou abrir a câmera no celular.
   - Até 10 imagens por post.
   - O navegador comprime para WebP (máx. 2048 px) antes de enviar, então print do F12 da Steam sobe em segundos.
3. **Pouca coisa, bem-feita.** Sem chat, sem DM, sem seguidores, sem "karma" complicado na v1.
4. **Motivo para voltar:** resposta no seu tópico avisa você (sino no site; e-mail e Discord opcionais).
5. **Tom do canal:** textos de interface curtos e com humor de sobrevivente. Exemplos:
   - estado vazio: "Nenhum sobrevivente postou aqui ainda. Seja o primeiro.";
   - erro: "A conexão caiu como a energia no dia 7. Tente de novo."

### O que existe na v1 (etapa S4)
| recurso | como funciona |
|---|---|
| **Tópico** | título (até 120 caracteres) + texto (Markdown simples, barra de formatação, prévia) + até 10 imagens + **categoria** (obrigatória) |
| **Campos do Zomboid** (opcionais, viram etiquetas) | **build** (lista: B42.x), **modo**, **dia sobrevivido**, **episódio relacionado** (liga ao vídeo do canal). Nomes dos modos só depois de entrarem em `info-validada/nomes-ptbr.md`; até lá, a lista fica vazia |
| **Categorias** (fixas, cor de HUD) | Dúvida · Minha base · Como morri (histórias) · Builds e personagem · Mods · Multiplayer (procuro grupo) · Mapa e rotas · Notícias e patch · Off-topic |
| **Comentários** | 2 níveis no máximo (resposta e resposta da resposta): legível no celular. Texto + até 4 imagens |
| **Voto** | só **positivo** ("Brabo" 👊). Sem voto negativo: comunidade pequena morre com negatividade |
| **Melhor resposta** | em "Dúvida", o autor marca a resposta que resolveu. Ela aparece logo abaixo da pergunta, com selo verde |
| **Ordenar** | Em alta (votos + recência) · Novos · Top da semana · Sem resposta |
| **Busca** | título e texto, em português e sem acento (Postgres full-text `portuguese` + `unaccent`), com filtro por categoria e build |
| **Perfil** | avatar (do Discord ou Google), nome, bio curta, tópicos e comentários, data de entrada |
| **Editar e apagar** | o autor edita (fica "editado") e apaga o que é dele |
| **Denunciar** | botão em todo post, com motivo. 3 denúncias escondem o post até um moderador ver |
| **Links** | link do YouTube vira player leve; link da Steam ou do Workshop vira cartão |
| **SEO** | cada tópico é uma página real (renderizada no servidor), com imagem de compartilhamento própria. Perguntas do Google trazem gente |

### Tierlists (etapa S4b)
Votação do jogo em formato tierlist (S+ · S · A · B · C · D): visual, fácil de entender e dá vontade de participar.
| recurso | como funciona |
|---|---|
| **Oficiais do canal** | 3 por enquanto: melhor arma corpo a corpo, melhor mochila, traços que valem os pontos. Itens = nomes de `info-validada/nomes-ptbr.md` (Regra nº 1) |
| **Voto** | por item, de S+ a D; sem data limite; a média decide a linha. Ler não precisa de conta; votar precisa |
| **Anônimo ou com nome** | escolhido a cada voto. No 1º voto a pessoa escolhe o padrão (sempre anônimo, sempre com nome ou perguntar); muda quando quiser no perfil, com opção de aplicar aos votos antigos |
| **Quem votou** | só para quem está logado: nomes por tier + "N votos anônimos". Voto anônimo nunca expõe o usuário (nem no banco: a tabela só mostra os próprios votos) |
| **Comentários** | estilo rede social: comentar, responder (2 níveis), Brabo 👊 |
| **Sugestões** | qualquer pessoa sugere uma tierlist nova (título + 2 a 30 itens). A sugestão também é votada (tiers + Brabo). Selo "da comunidade, não verificada pelo canal". As mais apoiadas viram oficiais (nomes conferidos antes) |
| **Banco** | `site/supabase/migrations/20261125000000_tierlists.sql` (tabelas, RLS, views `tierlist_placar` e `tierlist_votantes`, funções de voto) |

### Fica para a v2 (etapa S5)
- Sino de notificações em tempo real.
- E-mail de resumo semanal (opcional).
- Menção `@usuario`.
- **Tópico automático por vídeo**: Short novo publicado abre "Discussão: EPxx", com o vídeo no topo e link na descrição do YouTube.
- Aviso no Discord dos tópicos em alta (webhook).
- Painel de moderação na Central.
- Selos simples:
  - "Sobrevivente" (1º post);
  - "Veterano" (30 dias);
  - "Resolveu" (10 melhores respostas).

### Não fazer (nem na v2)
Chat, mensagem privada, voto negativo, seguidores, sub-fóruns criados por usuário, vídeo hospedado no site (só link do YouTube), áudio do jogo.

## 5. Comunidade — começo e moderação
### Para não nascer vazia
- Antes de abrir, Jose e Bruno postam 15 a 20 tópicos reais (dúvidas dos comentários do canal, "Como morri", bases).
- Cada Short novo leva para a Comunidade: tópico do episódio + link na descrição + aviso no Discord.
- Tópico fixo semanal, por exemplo "Como você morreu essa semana?" e "Mostre sua base".
- Teste com 5 pessoas do Discord antes do lançamento: tarefa "crie um tópico com print". Mede o tempo; corrige o que travar.

### Moderação e segurança
- **Papéis:** usuário · moderador · admin (Jose e Bruno). Moderador esconde, trava, fixa e suspende.
- **Anti-spam:**
  - Cloudflare Turnstile no cadastro e no 1º post;
  - limites no banco: conta nova (< 24 h) faz 3 tópicos/dia, depois 10; 30 comentários/hora;
  - links só depois do 1º dia de conta.
- **Filtro de palavras** (lista no banco): o post vai para revisão em vez de publicar.
- **Imagens:** só imagem (jpeg, png, webp, gif), máx. 8 MB antes de comprimir. Os metadados (EXIF, localização) são apagados na compressão.
- **Log de moderação:** quem fez o quê e quando.
- **Regras da Comunidade:** página própria + resumo no editor no 1º post.
- **Lei (Brasil):**
  - termos de uso;
  - política de privacidade (LGPD);
  - botão "apagar minha conta" (apaga perfil; posts viram "[conta apagada]");
  - idade mínima.
  - O público tem menores: conferir as obrigações do ECA Digital (Lei 15.211/2025) e do Marco Civil (guarda de registros) com um advogado antes de abrir. O Claude escreve os rascunhos; o Jose aprova.

## 6. Comunidade — técnico
### Stack
- **Next.js + TypeScript** no **Cloudflare Workers** (adaptador OpenNext). Landing e guias estáticos; páginas da Comunidade renderizadas no servidor com cache curto.
- **Supabase: projeto novo `manual-zomboid-comunidade`**, separado da Central.
  - Por quê: o público nunca fica no mesmo banco das prévias e dos dados internos. Um erro de regra não vaza nada da Central.
  - O site lê as views públicas da Central (`pub_videos`, `pub_noticias`) com a chave pública dela.
- **Login:** Supabase Auth com Discord, Google e link por e-mail (SMTP do Resend). CAPTCHA Turnstile ligado no Auth.
- **Imagens: Cloudflare R2.** Grátis até 10 GB, sem custo de banda. O Worker do site confere o login, recebe a imagem já comprimida e grava no R2. Endereço: `img.<dominio>`.
- **Tempo real:** Supabase Realtime só para o sino e os contadores. A lista de tópicos não precisa.

### Banco (projeto `manual-zomboid-comunidade`)
| tabela | campos principais |
|---|---|
| `perfis` | id (= auth.uid), usuario (único, 3–20, `a-z0-9_`), nome, avatar_url, bio, papel (`usuario`/`moderador`/`admin`), suspenso_ate, criado_em |
| `categorias` | slug, nome, cor, ordem, descricao |
| `topicos` | id, autor, categoria, titulo, corpo, imagens jsonb (url, alt, w, h), build, modo, dia, episodio, votos, comentarios, quente (nota), fixado, travado, estado (`publicado`/`revisao`/`oculto`/`apagado`), busca tsvector, criado_em, editado_em |
| `comentarios` | id, topico, pai (1 nível), autor, corpo, imagens, votos, melhor, estado, criado_em, editado_em |
| `votos` | usuario, topico ou comentario (único por pessoa) |
| `denuncias` | alvo, motivo, autor, estado, resolvido_por |
| `notificacoes` | para, tipo (`resposta`/`melhor`/`mencao`), alvo, lida |
| `moderacao_log` | quem, acao, alvo, motivo, quando |
| `palavras_bloqueadas` | termo |

- **RLS em tudo:**
  - anônimo lê só o que está publicado;
  - o autor escreve o que é dele;
  - moderador muda o `estado`.
- Contadores (`votos`, `comentarios`) e a nota "quente" são atualizados por trigger. Fórmula da nota (a do Reddit antigo): `log10(max(votos,1)) + segundos_desde_2026-01-01(criado_em) / 45000`.
- Limites de postagem por função no banco: o cliente não consegue burlar.

## 7. Como medir se deu certo (Cloudflare Web Analytics + consultas no banco)
| métrica | meta inicial (3 meses) |
|---|---|
| visitantes que criam conta | ≥ 3 % |
| contas que postam algo em 7 dias | ≥ 30 % |
| tópicos novos por semana | ≥ 20 |
| tópicos com resposta em 24 h | ≥ 70 % |
| quem volta em 7 dias | ≥ 25 % |

Os números entram no relatório quinzenal da Central (C5).
