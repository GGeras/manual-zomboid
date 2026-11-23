-- Central · C1: membros, episódios, fatos, entregas e alertas.
-- Regra: RLS em tudo. Só membro logado lê. Escrita só pelo service_role (sync do repo e funções).

-- ---------- membros ----------
create table public.membros (
  id         smallint generated always as identity primary key,
  nome       text not null,
  github     text not null unique,            -- login do GitHub (só exibição)
  github_id  bigint not null unique,          -- id numérico do GitHub: é ele que libera o acesso
  papel      text not null default 'socio' check (papel in ('dono', 'socio')),
  user_id    uuid unique references auth.users (id) on delete set null,
  criado_em  timestamptz not null default now()
);

-- membro logado?
create function public.eh_membro() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.membros where user_id = (select auth.uid()));
$$;

-- chamado pelo app depois do login: liga a conta ao membro pelo id do GitHub
-- (o id vem de auth.identities, que o usuário não consegue editar)
create function public.entrar() returns public.membros
language plpgsql volatile security definer set search_path = '' as $$
declare
  gid bigint;
  m   public.membros;
begin
  select i.provider_id::bigint into gid
    from auth.identities i
   where i.user_id = (select auth.uid()) and i.provider = 'github'
   limit 1;
  if gid is null then return null; end if;
  update public.membros set user_id = (select auth.uid())
   where github_id = gid and (user_id is null or user_id = (select auth.uid()))
  returning * into m;
  return m;
end $$;

revoke all on function public.eh_membro() from public, anon;
revoke all on function public.entrar() from public, anon;
grant execute on function public.eh_membro() to authenticated;
grant execute on function public.entrar() to authenticated;

-- ---------- episodios (fonte: roteiros/*.md · escrito por plataforma/scripts/sync_repo.py) ----------
create table public.episodios (
  slug            text primary key,             -- ep16-animais | bases-01-quartel-rosewood
  ep              text not null,                -- 16 | bases-01
  numero          int,                          -- 16 (null fora da série principal)
  serie           text not null default 'shorts' check (serie in ('shorts', 'bases')),
  tema            text not null,
  responsavel     text,
  status          text not null check (status in ('rascunho', 'validado', 'aprovado', 'final', 'publicado')),
  build           text,
  fatos           text[] not null default '{}',
  titulo          text,                         -- título do YouTube (seção Publicação do roteiro)
  youtube_id      text,
  arquivo         text not null,                -- roteiros/ep16-animais.md
  commit_sha      text,
  sincronizado_em timestamptz not null default now()
);

-- ---------- fatos (fonte: projeto/pipeline/fatos.json) ----------
create table public.fatos (
  id    text primary key,
  texto text not null,
  build text,
  fonte text,
  eps   text[] not null default '{}'
);

-- ---------- entregas: prévias e finais (fonte: Slack, etapa C3) ----------
create table public.entregas (
  id          uuid primary key default gen_random_uuid(),
  slug        text references public.episodios (slug) on update cascade on delete set null,
  ep          text not null,
  tipo        text not null check (tipo in ('previa', 'final')),
  versao      int,
  link_video  text,
  link_capa   text,
  autor       text,
  duracao     text,
  resumo      text,
  slack_canal text,
  slack_ts    text unique,
  criado_em   timestamptz not null default now()
);
create index entregas_slug_idx on public.entregas (slug, criado_em desc);

-- ---------- alertas: feed ao vivo do Slack (etapa C3) ----------
create table public.alertas (
  id        uuid primary key default gen_random_uuid(),
  canal     text not null,                    -- links-rascunho | links-final | atualizacoes-projeto
  canal_id  text not null,
  tipo      text not null default 'outro' check (tipo in ('previa', 'final', 'github', 'pr', 'outro')),
  texto     text not null,
  autor     text,
  link      text,
  slack_ts  text not null,
  criado_em timestamptz not null default now(),
  unique (canal_id, slack_ts)
);
create index alertas_criado_idx on public.alertas (criado_em desc);

-- ---------- RLS ----------
alter table public.membros   enable row level security;
alter table public.episodios enable row level security;
alter table public.fatos     enable row level security;
alter table public.entregas  enable row level security;
alter table public.alertas   enable row level security;

create policy "membro lê membros"   on public.membros   for select to authenticated using ((select public.eh_membro()));
create policy "membro lê episodios" on public.episodios for select to authenticated using ((select public.eh_membro()));
create policy "membro lê fatos"     on public.fatos     for select to authenticated using ((select public.eh_membro()));
create policy "membro lê entregas"  on public.entregas  for select to authenticated using ((select public.eh_membro()));
create policy "membro lê alertas"   on public.alertas   for select to authenticated using ((select public.eh_membro()));

revoke all on public.membros, public.episodios, public.fatos, public.entregas, public.alertas from anon;
revoke insert, update, delete, truncate on public.membros, public.episodios, public.fatos, public.entregas, public.alertas from authenticated;
grant select on public.membros, public.episodios, public.fatos, public.entregas, public.alertas to authenticated;
grant all on public.membros, public.episodios, public.fatos, public.entregas, public.alertas to service_role;

-- ---------- Realtime (feed ao vivo) ----------
alter publication supabase_realtime add table public.alertas, public.entregas, public.episodios;

-- ---------- membros iniciais ----------
insert into public.membros (nome, github, github_id, papel) values ('Jose', 'GGeras', 104459038, 'dono');
