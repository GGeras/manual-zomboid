-- Comunidade v1 (plataforma/site.md §4–6) — projeto Supabase `manual-zomboid-comunidade` (SEPARADO da Central).
-- Aplicada em 28/11 no projeto uzwfsaclfisywijoqppq (sa-east-1).
-- Princípios: RLS em tudo; anônimo lê só o publicado; escrita só por função (limites e anti-spam no banco, o cliente não burla).

create extension if not exists unaccent with schema extensions;

-- busca em português e sem acento
create text search configuration public.portuguese_unaccent (copy = pg_catalog.portuguese);
alter text search configuration public.portuguese_unaccent alter mapping for hword, hword_part, word with extensions.unaccent, portuguese_stem;

-- ---------------------------------------------------------------- tabelas
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  usuario text unique check (usuario ~ '^[a-z0-9_]{3,20}$'),           -- pedido só no 1º post
  nome text not null default '',
  avatar_url text,
  bio text not null default '' check (char_length(bio) <= 280),
  papel text not null default 'usuario' check (papel in ('usuario', 'moderador', 'admin')),
  suspenso_ate timestamptz,
  criado_em timestamptz not null default now()
);

create table public.categorias (
  slug text primary key,
  nome text not null,
  cor text not null,
  ordem int not null,
  descricao text not null default ''
);
insert into public.categorias (slug, nome, cor, ordem, descricao) values
  ('duvida', 'Dúvida', '#FFB020', 1, 'Pergunte. O autor marca a melhor resposta.'),
  ('minha-base', 'Minha base', '#8FE04A', 2, 'Mostre onde você se trancou.'),
  ('como-morri', 'Como morri', '#FF3D55', 3, 'Histórias de quem não voltou.'),
  ('builds', 'Builds e personagem', '#6FB7FF', 4, 'Profissões, traços e planos de personagem.'),
  ('mods', 'Mods', '#C59BFF', 5, 'Workshop, listas e indicações.'),
  ('multiplayer', 'Multiplayer (procuro grupo)', '#3DD6C6', 6, 'Servidores e gente para sobreviver junto.'),
  ('mapa', 'Mapa e rotas', '#FF8A3D', 7, 'Lugares, rotas e pontos de saque.'),
  ('noticias', 'Notícias e patch', '#EFE5CF', 8, 'Atualizações do jogo e o que mudou.'),
  ('off-topic', 'Off-topic', '#A39C8A', 9, 'Tédio também é um moodle.');

create table public.topicos (
  id text primary key default lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  autor uuid references public.perfis (id) on delete set null,         -- conta apagada: "[conta apagada]"
  categoria text not null references public.categorias (slug),
  titulo text not null check (char_length(titulo) between 5 and 120),
  corpo text not null default '' check (char_length(corpo) <= 10000),
  imagens jsonb not null default '[]' check (jsonb_array_length(imagens) <= 10),
  build text, modo text, dia int check (dia between 0 and 9999), episodio text,
  votos int not null default 0,
  comentarios int not null default 0,
  quente double precision not null default 0,
  fixado boolean not null default false,
  travado boolean not null default false,
  resolvido boolean not null default false,
  estado text not null default 'publicado' check (estado in ('publicado', 'revisao', 'oculto', 'apagado')),
  busca tsvector generated always as (to_tsvector('public.portuguese_unaccent', titulo || ' ' || corpo)) stored,
  criado_em timestamptz not null default now(),
  editado_em timestamptz
);
create index topicos_quente on public.topicos (estado, fixado desc, quente desc);
create index topicos_novos on public.topicos (estado, criado_em desc);
create index topicos_categoria on public.topicos (categoria, estado, quente desc);
create index topicos_busca on public.topicos using gin (busca);

create table public.comentarios (
  id text primary key default lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  topico text not null references public.topicos (id) on delete cascade,
  pai text references public.comentarios (id) on delete cascade,      -- 2 níveis no máximo (conferido em comentar())
  autor uuid references public.perfis (id) on delete set null,
  corpo text not null default '' check (char_length(corpo) <= 5000),
  imagens jsonb not null default '[]' check (jsonb_array_length(imagens) <= 4),
  votos int not null default 0,
  melhor boolean not null default false,
  estado text not null default 'publicado' check (estado in ('publicado', 'revisao', 'oculto', 'apagado')),
  criado_em timestamptz not null default now(),
  editado_em timestamptz
);
create index comentarios_topico on public.comentarios (topico, criado_em);

create table public.votos (
  usuario uuid not null references public.perfis (id) on delete cascade,
  topico text references public.topicos (id) on delete cascade,
  comentario text references public.comentarios (id) on delete cascade,
  criado_em timestamptz not null default now(),
  check ((topico is null) <> (comentario is null))
);
create unique index votos_topico on public.votos (usuario, topico) where topico is not null;
create unique index votos_comentario on public.votos (usuario, comentario) where comentario is not null;

create table public.denuncias (
  id bigint generated always as identity primary key,
  topico text references public.topicos (id) on delete cascade,
  comentario text references public.comentarios (id) on delete cascade,
  motivo text not null check (char_length(motivo) between 3 and 300),
  autor uuid not null default auth.uid() references public.perfis (id) on delete cascade,
  estado text not null default 'aberta' check (estado in ('aberta', 'procedente', 'improcedente')),
  resolvido_por uuid references public.perfis (id),
  criado_em timestamptz not null default now(),
  check ((topico is null) <> (comentario is null))
);
create unique index denuncias_uma_por_pessoa on public.denuncias (autor, coalesce(topico, ''), coalesce(comentario, ''));

create table public.notificacoes (
  id bigint generated always as identity primary key,
  para uuid not null references public.perfis (id) on delete cascade,
  tipo text not null check (tipo in ('resposta', 'melhor', 'mencao')),
  topico text references public.topicos (id) on delete cascade,
  comentario text references public.comentarios (id) on delete cascade,
  lida boolean not null default false,
  criado_em timestamptz not null default now()
);
create index notificacoes_para on public.notificacoes (para, lida, criado_em desc);

create table public.moderacao_log (
  id bigint generated always as identity primary key,
  quem uuid references public.perfis (id),
  acao text not null,
  alvo text not null,
  motivo text,
  quando timestamptz not null default now()
);

create table public.palavras_bloqueadas (termo text primary key);

-- ---------------------------------------------------------------- funções auxiliares
create function public.papel_atual() returns text language sql stable security definer set search_path = '' as $$
  select papel from public.perfis where id = auth.uid()
$$;
create function public.eh_moderador() returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(public.papel_atual() in ('moderador', 'admin'), false)
$$;

-- nota "Em alta" (Reddit antigo; site/src/lib/comunidade/quente.ts faz a mesma conta)
create function public.nota_quente(votos int, criado timestamptz) returns double precision language sql immutable as $$
  select log(greatest(votos, 1)) + extract(epoch from criado - timestamptz '2026-01-01 00:00:00+00') / 45000
$$;

create function public.tem_palavra_bloqueada(t text) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.palavras_bloqueadas p where extensions.unaccent(lower(t)) like '%' || extensions.unaccent(lower(p.termo)) || '%')
$$;

-- conta nova: perfil criado no 1º login, com nome e avatar do Discord/Google
create function public.novo_perfil() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfis (id, nome, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''), new.raw_user_meta_data ->> 'avatar_url');
  return new;
end $$;
create trigger novo_perfil after insert on auth.users for each row execute function public.novo_perfil();

create function public.conferir_autor() returns public.perfis language plpgsql stable security definer set search_path = '' as $$
declare p public.perfis;
begin
  select * into p from public.perfis where id = auth.uid();
  if p.id is null then raise exception 'sem_conta'; end if;
  if p.suspenso_ate is not null and p.suspenso_ate > now() then raise exception 'suspenso'; end if;
  return p;
end $$;

create function public.tem_link(t text) returns boolean language sql immutable as $$ select t ~* 'https?://' $$;

-- ---------------------------------------------------------------- escrita (só por função)
create function public.definir_usuario(novo text) returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.perfis set usuario = novo where id = auth.uid() and usuario is null;
  if not found then raise exception 'usuario_ja_definido'; end if;
end $$;

create function public.criar_topico(dados jsonb) returns text language plpgsql security definer set search_path = '' as $$
declare p public.perfis := public.conferir_autor(); novo text; hoje int; limite int; conta_nova boolean; v_corpo text := coalesce(dados ->> 'corpo', '');
begin
  if p.usuario is null then raise exception 'sem_usuario'; end if;
  conta_nova := p.criado_em > now() - interval '24 hours';
  select count(*) into hoje from public.topicos where autor = p.id and criado_em > now() - interval '24 hours';
  limite := case when conta_nova then 3 else 10 end;
  if hoje >= limite then raise exception 'limite_topicos'; end if;
  if conta_nova and public.tem_link(v_corpo) then raise exception 'links_conta_nova'; end if;
  insert into public.topicos (autor, categoria, titulo, corpo, imagens, build, modo, dia, episodio, estado, quente)
  values (p.id, dados ->> 'categoria', trim(dados ->> 'titulo'), v_corpo, coalesce(dados -> 'imagens', '[]'), dados ->> 'build', dados ->> 'modo',
          (dados ->> 'dia')::int, dados ->> 'episodio',
          case when public.tem_palavra_bloqueada((dados ->> 'titulo') || ' ' || v_corpo) then 'revisao' else 'publicado' end,
          public.nota_quente(1, now()))
  returning id into novo;
  insert into public.votos (usuario, topico) values (p.id, novo); -- o autor já dá Brabo no próprio tópico (como no Reddit)
  return novo;
end $$;

create function public.comentar(p_topico text, p_corpo text, p_pai text, p_imagens jsonb default '[]') returns text language plpgsql security definer set search_path = '' as $$
declare p public.perfis := public.conferir_autor(); t public.topicos; novo text; hora int;
begin
  if p.usuario is null then raise exception 'sem_usuario'; end if;
  select * into t from public.topicos where id = p_topico and estado = 'publicado';
  if t.id is null then raise exception 'topico_inexistente'; end if;
  if t.travado then raise exception 'travado'; end if;
  if p_pai is not null and exists (select 1 from public.comentarios where id = p_pai and pai is not null) then raise exception 'nivel_maximo'; end if;
  select count(*) into hora from public.comentarios where autor = p.id and criado_em > now() - interval '1 hour';
  if hora >= 30 then raise exception 'limite_comentarios'; end if;
  if p.criado_em > now() - interval '24 hours' and public.tem_link(p_corpo) then raise exception 'links_conta_nova'; end if;
  insert into public.comentarios (topico, pai, autor, corpo, imagens, estado)
  values (p_topico, p_pai, p.id, coalesce(p_corpo, ''), coalesce(p_imagens, '[]'), case when public.tem_palavra_bloqueada(p_corpo) then 'revisao' else 'publicado' end)
  returning id into novo;
  -- aviso para quem recebeu a resposta (sino na S5)
  insert into public.notificacoes (para, tipo, topico, comentario)
  select distinct x, 'resposta', p_topico, novo from (values (t.autor), ((select autor from public.comentarios where id = p_pai))) v(x) where x is not null and x <> p.id;
  return novo;
end $$;

create function public.votar(p_topico text, p_comentario text, ligar boolean) returns void language plpgsql security definer set search_path = '' as $$
declare p public.perfis := public.conferir_autor();
begin
  if ligar then insert into public.votos (usuario, topico, comentario) values (p.id, p_topico, p_comentario) on conflict do nothing;
  else delete from public.votos where usuario = p.id and topico is not distinct from p_topico and comentario is not distinct from p_comentario;
  end if;
end $$;

create function public.marcar_melhor(p_comentario text) returns void language plpgsql security definer set search_path = '' as $$
declare c public.comentarios; t public.topicos;
begin
  select * into c from public.comentarios where id = p_comentario;
  select * into t from public.topicos where id = c.topico;
  if t.autor is distinct from auth.uid() or t.categoria <> 'duvida' or c.pai is not null then raise exception 'sem_permissao'; end if;
  update public.comentarios set melhor = (id = p_comentario) where topico = t.id and pai is null;
  update public.topicos set resolvido = true where id = t.id;
  if c.autor is not null and c.autor <> t.autor then insert into public.notificacoes (para, tipo, topico, comentario) values (c.autor, 'melhor', t.id, c.id); end if;
end $$;

-- ---------------------------------------------------------------- contadores e nota (gatilhos)
create function public.contar_votos() returns trigger language plpgsql security definer set search_path = '' as $$
declare d int := case when tg_op = 'INSERT' then 1 else -1 end; r public.votos := coalesce(new, old);
begin
  if r.topico is not null then
    update public.topicos set votos = votos + d, quente = public.nota_quente(votos + d, criado_em) where id = r.topico;
  else
    update public.comentarios set votos = votos + d where id = r.comentario;
  end if;
  return null;
end $$;
create trigger contar_votos after insert or delete on public.votos for each row execute function public.contar_votos();

create function public.contar_comentarios() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.topicos t set comentarios = (select count(*) from public.comentarios c where c.topico = t.id and c.estado = 'publicado')
  where t.id = coalesce(new.topico, old.topico);
  return null;
end $$;
create trigger contar_comentarios after insert or delete or update of estado on public.comentarios for each row execute function public.contar_comentarios();

-- 3 denúncias escondem o post até um moderador ver
create function public.denuncia_esconde() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.topico is not null and (select count(*) from public.denuncias where topico = new.topico and estado = 'aberta') >= 3 then
    update public.topicos set estado = 'oculto' where id = new.topico and estado = 'publicado';
  elsif new.comentario is not null and (select count(*) from public.denuncias where comentario = new.comentario and estado = 'aberta') >= 3 then
    update public.comentarios set estado = 'oculto' where id = new.comentario and estado = 'publicado';
  end if;
  return null;
end $$;
create trigger denuncia_esconde after insert on public.denuncias for each row execute function public.denuncia_esconde();

-- editar marca "editado"; só autor (texto) ou moderador (estado/fixar/travar)
create function public.marcar_editado() returns trigger language plpgsql as $$
begin
  if new.titulo is distinct from old.titulo or new.corpo is distinct from old.corpo then new.editado_em := now(); end if;
  return new;
end $$;
create trigger topicos_editado before update on public.topicos for each row execute function public.marcar_editado();
create function public.marcar_editado_c() returns trigger language plpgsql as $$
begin
  if new.corpo is distinct from old.corpo then new.editado_em := now(); end if;
  return new;
end $$;
create trigger comentarios_editado before update on public.comentarios for each row execute function public.marcar_editado_c();

create function public.log_moderacao() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if public.eh_moderador() and (new.estado is distinct from old.estado or (tg_table_name = 'topicos' and (new.fixado is distinct from old.fixado or new.travado is distinct from old.travado))) then
    insert into public.moderacao_log (quem, acao, alvo) values (auth.uid(), tg_table_name || ':' || coalesce(new.estado, ''), new.id);
  end if;
  return new;
end $$;
create trigger topicos_log after update on public.topicos for each row execute function public.log_moderacao();
create trigger comentarios_log after update on public.comentarios for each row execute function public.log_moderacao();

-- ---------------------------------------------------------------- RLS
alter table public.perfis enable row level security;
alter table public.categorias enable row level security;
alter table public.topicos enable row level security;
alter table public.comentarios enable row level security;
alter table public.votos enable row level security;
alter table public.denuncias enable row level security;
alter table public.notificacoes enable row level security;
alter table public.moderacao_log enable row level security;
alter table public.palavras_bloqueadas enable row level security;

create policy "perfis: todos leem" on public.perfis for select using (true);
create policy "perfis: dono edita nome e bio" on public.perfis for update using (id = auth.uid()) with check (id = auth.uid() and papel = (select papel from public.perfis where id = auth.uid()) and suspenso_ate is not distinct from (select suspenso_ate from public.perfis where id = auth.uid()));
create policy "perfis: moderador suspende" on public.perfis for update using (public.eh_moderador());
create policy "perfis: dono apaga a conta" on public.perfis for delete using (id = auth.uid());

create policy "categorias: todos leem" on public.categorias for select using (true);

create policy "topicos: publicado ou meu ou moderador" on public.topicos for select using (estado = 'publicado' or autor = auth.uid() or public.eh_moderador());
create policy "topicos: autor edita" on public.topicos for update using (autor = auth.uid() and not travado) with check (autor = auth.uid() and estado in ('publicado', 'apagado'));
create policy "topicos: moderador muda estado" on public.topicos for update using (public.eh_moderador());

create policy "comentarios: publicado ou meu ou moderador" on public.comentarios for select using (estado = 'publicado' or autor = auth.uid() or public.eh_moderador());
create policy "comentarios: autor edita" on public.comentarios for update using (autor = auth.uid()) with check (autor = auth.uid() and estado in ('publicado', 'apagado'));
create policy "comentarios: moderador muda estado" on public.comentarios for update using (public.eh_moderador());

create policy "votos: vejo os meus" on public.votos for select using (usuario = auth.uid());
create policy "denuncias: crio as minhas" on public.denuncias for insert with check (autor = auth.uid());
create policy "denuncias: moderador vê e resolve" on public.denuncias for all using (public.eh_moderador());
create policy "notificacoes: as minhas" on public.notificacoes for select using (para = auth.uid());
create policy "notificacoes: marco como lida" on public.notificacoes for update using (para = auth.uid());
create policy "moderacao_log: moderador lê" on public.moderacao_log for select using (public.eh_moderador());
create policy "palavras: moderador gerencia" on public.palavras_bloqueadas for all using (public.eh_moderador());

-- inserts só pelas funções (security definer): ninguém insere direto em topicos/comentarios/votos
revoke insert on public.topicos, public.comentarios, public.votos from anon, authenticated;
revoke execute on function public.criar_topico(jsonb), public.comentar(text, text, text, jsonb), public.votar(text, text, boolean), public.marcar_melhor(text), public.definir_usuario(text) from anon;

-- números públicos da Comunidade (landing e lateral)
create view public.comunidade_numeros with (security_invoker = false) as
  select (select count(*) from public.topicos where estado = 'publicado') as topicos,
         (select count(*) from public.comentarios where estado = 'publicado') as comentarios,
         (select count(*) from public.perfis where usuario is not null) as pessoas;
grant select on public.comunidade_numeros to anon, authenticated;

-- tempo real só para o sino (S5)
alter publication supabase_realtime add table public.notificacoes;
