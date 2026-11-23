# Site — landing, Guias e Comunidade

Especificação: `plataforma/site.md`. Chaves: `plataforma/configuracao.md` (seção "Site: onde cada chave entra").

**Prévia no ar:** https://manual-zomboid-site.mundomix.workers.dev (publica sozinho a cada push na `main`, Action `site`).

| pasta / arquivo | o que tem |
|---|---|
| `src/app/` | páginas (Next.js 16): landing, `/guias`, `/comunidade` (feed, categoria, tópico, criar, perfil, regras), termos, privacidade, RSS, sitemap |
| `src/componentes/` | peças visuais (landing, Comunidade, ícones) |
| `src/lib/comunidade/` | dados da Comunidade: `dados.ts` (prévia × Supabase), `cliente-real.ts` (login e escrita, S4), `quente.ts` (ranking), `demo.ts` (exemplos) |
| `content/guias/*.mdx` | Guias (blog oficial). Fato só com `<Fato id="..." />` de `info-validada/` |
| `config.publico.json` | chaves **públicas** (📋). `null` = ainda não configurado; o site mostra "em breve" |
| `integracoes.json` | mapa de cada integração: o que precisa, tipo (público/segredo) e onde mora |
| `assets.json` | lista curada de assets do jogo que o site pode usar (sons e músicas: nunca) |
| `arte/` | renders do canal (modelos do jogo) usados na landing |
| `supabase/migrations/` | banco da Comunidade (projeto `manual-zomboid-comunidade`, ainda **não** aplicado) |

## Rodar
```bash
cd site
npm install
npm run dev        # http://localhost:3000 (copia os assets e gera os dados do repo)
npm test           # ranking, Markdown seguro, trava de fatos
npm run config     # o que já está configurado e o que falta
npm run preview    # build do Worker + runtime da Cloudflare local (http://localhost:8787)
```

## Regras que o build garante
- **Regra nº 1:** `scripts/checar-guias.mjs` barra guia com fato fora de `info-validada/`, termo de `_nao-usar.md` ou build antigo.
- **Assets:** só o que está em `assets.json` é copiado de `projeto/assets` (no CI, só esses saem do LFS).
- **Segredos:** nenhum no site. O que é segredo fica no Supabase ou nos GitHub Secrets (`npm run config` acusa segredo colado no lugar errado).

## Modo prévia da Comunidade
Enquanto `comunidade.supabaseUrl` estiver `null`, a Comunidade roda com tópicos de exemplo e tudo o que a pessoa faz (conta de teste, votos, tópicos com imagem, respostas, denúncias) fica **só no navegador dela**. Quando o projeto Supabase existir: aplicar a migração, preencher a URL e a chave pública em `config.publico.json` e o site passa a usar o banco sozinho.
