# Plataforma — Central

Sistema interno do Jose e do sócio. Arquitetura: `arquitetura.md`. Etapas: `plano.md`.

**Endereço:** https://manual-zomboid-central.mundomix.workers.dev (entrar com o GitHub; acesso liberado para Jose e Bruno).

| pasta | o que tem |
|---|---|
| `app/` | a Central (Vite + React + TypeScript), publicada no Cloudflare |
| `supabase/migrations/` | banco (SQL versionado, com RLS). Já aplicado no projeto `manual-zomboid` |
| `scripts/sync_repo.py` | lê `roteiros/` e `fatos.json` e grava no banco |

- Banco: Supabase `manual-zomboid` (`tephnuzsuoamhfukeqsi`, São Paulo).
- Endereço e chave **pública** do Supabase estão em `app/src/config.ts`. A segurança é o RLS: só quem está em `membros` lê.
- Os dados de episódios e fatos são do **repo**. A Central só mostra. Mudou um roteiro? Push na `main` → a Action `central-sync` atualiza o banco.

## Rodar no seu PC
```bash
cd plataforma/app
npm install
npm run dev        # http://localhost:5173
npm test
```

## Configurar (Jose, uma vez)
1. **Login com GitHub**
   1. GitHub > Settings > Developer settings > OAuth Apps > New OAuth App.
      - Homepage URL: o endereço da Central (passo 3), ou `http://localhost:5173` por enquanto.
      - Authorization callback URL: `https://tephnuzsuoamhfukeqsi.supabase.co/auth/v1/callback`
   2. Gere o Client Secret.
   3. Supabase > Authentication > Sign In / Providers > **GitHub**: ligue e cole Client ID + Client Secret.
   4. Recomendado: no mesmo lugar, desligue **Email** (ninguém entra por e-mail).
2. **Sync do repo**
   1. Supabase > Project Settings > API Keys > Secret keys > crie uma (`sb_secret_...`).
   2. GitHub > repo > Settings > Secrets and variables > Actions > New secret: `SUPABASE_SECRET_KEY`.
   3. Actions > `central-sync` > Run workflow (primeira carga dos fatos).
3. **Publicação no Cloudflare**
   1. Cloudflare > My Profile > API Tokens > Create Token > modelo **Edit Cloudflare Workers**.
   2. Copie também o **Account ID** (página inicial da conta, barra lateral).
   3. GitHub Secrets: `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.
   4. Actions > `central` > Run workflow. O log mostra o endereço: `https://manual-zomboid-central.<sua-conta>.workers.dev`.
4. **Endereço no Supabase**: Authentication > URL Configuration.
   - Site URL: o endereço do passo 3.
   - Redirect URLs: o mesmo endereço e `http://localhost:5173`.
5. **Sócio**: mande o usuário GitHub dele. O acesso é pelo id numérico do GitHub (não muda se ele trocar o nome).

## Liberar ou tirar acesso
No SQL Editor do Supabase (ou peça ao Claude):
```sql
-- id numérico: https://api.github.com/users/<usuario>  (campo "id")
insert into public.membros (nome, github, github_id, papel) values ('Nome', 'usuario', 123456, 'socio');
delete from public.membros where github = 'usuario';
```
