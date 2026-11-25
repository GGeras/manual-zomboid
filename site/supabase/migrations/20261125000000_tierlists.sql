-- Tierlists da Comunidade (S+ · S · A · B · C · D): votação sem data limite, voto anônimo ou visível, comentários com respostas,
-- sugestões de novas tierlists (que também são votadas). Projeto: manual-zomboid-comunidade. Depende de 20261124000000_comunidade_base.sql.
-- Regras (plataforma/site.md §4, tierlists):
--  - ler o placar não precisa de conta; votar, comentar e sugerir precisam;
--  - QUEM votou só aparece para quem está logado, e só os votos marcados como visíveis. Voto anônimo nunca expõe o usuário,
--    nem para quem está logado (a tabela de votos só mostra os próprios votos; o resto sai pelas views abaixo);
--  - cada pessoa escolhe a visibilidade padrão no 1º voto e muda quando quiser no perfil (perfis.voto_visibilidade).

-- ---------------------------------------------------------------- tabelas
alter table public.perfis add column voto_visibilidade text not null default 'perguntar' check (voto_visibilidade in ('perguntar', 'anonimo', 'visivel'));

create table public.tierlists (
  slug text primary key check (slug ~ '^[a-z0-9-]{3,60}$'),
  titulo text not null check (char_length(titulo) between 5 and 80),
  descricao text not null default '' check (char_length(descricao) <= 400),
  tipo text not null default 'sugestao' check (tipo in ('oficial', 'sugestao')),   -- oficial = do canal (itens de info-validada/)
  autor uuid references public.perfis (id) on delete set null,
  estado text not null default 'publicado' check (estado in ('publicado', 'revisao', 'oculto')),
  apoios int not null default 0,
  comentarios int not null default 0,
  votos int not null default 0,
  criado_em timestamptz not null default now()
);
create table public.tierlist_itens (
  tierlist text not null references public.tierlists (slug) on delete cascade,
  id text not null check (id ~ '^[a-z0-9-]{1,40}$'),
  nome text not null check (char_length(nome) between 1 and 40),
  icone text,                                    -- só nas oficiais: ícone do jogo (assets/items)
  ordem int not null default 0,
  primary key (tierlist, id)
);
create table public.tierlist_votos (
  usuario uuid not null references public.perfis (id) on delete cascade,
  tierlist text not null,
  item text not null,
  tier text not null check (tier in ('S+', 'S', 'A', 'B', 'C', 'D')),
  anonimo boolean not null default true,
  criado_em timestamptz not null default now(),
  primary key (usuario, tierlist, item),
  foreign key (tierlist, item) references public.tierlist_itens (tierlist, id) on delete cascade
);
create index tierlist_votos_item on public.tierlist_votos (tierlist, item);
create table public.tierlist_comentarios (
  id text primary key default lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  tierlist text not null references public.tierlists (slug) on delete cascade,
  pai text references public.tierlist_comentarios (id) on delete cascade,   -- 2 níveis (resposta da resposta não existe)
  autor uuid references public.perfis (id) on delete set null,
  corpo text not null check (char_length(corpo) between 1 and 3000),
  apoios int not null default 0,
  estado text not null default 'publicado' check (estado in ('publicado', 'revisao', 'oculto', 'apagado')),
  criado_em timestamptz not null default now()
);
create index tierlist_comentarios_lista on public.tierlist_comentarios (tierlist, criado_em);
-- "Brabo" em sugestão de tierlist (alvo = 'tl:<slug>') ou em comentário (alvo = 'tc:<id>')
create table public.tierlist_apoios (
  usuario uuid not null references public.perfis (id) on delete cascade,
  alvo text not null check (alvo ~ '^(tl|tc):'),
  primary key (usuario, alvo)
);

-- ---------------------------------------------------------------- RLS
alter table public.tierlists enable row level security;
alter table public.tierlist_itens enable row level security;
alter table public.tierlist_votos enable row level security;
alter table public.tierlist_comentarios enable row level security;
alter table public.tierlist_apoios enable row level security;
create policy "tierlists: publicadas ou minhas ou moderador" on public.tierlists for select using (estado = 'publicado' or autor = auth.uid() or public.eh_moderador());
create policy "tierlists: moderador gerencia" on public.tierlists for update using (public.eh_moderador());
create policy "tierlist_itens: todos leem" on public.tierlist_itens for select using (true);
create policy "tierlist_votos: vejo só os meus" on public.tierlist_votos for select using (usuario = auth.uid());
create policy "tierlist_comentarios: publicado ou meu ou moderador" on public.tierlist_comentarios for select using (estado = 'publicado' or autor = auth.uid() or public.eh_moderador());
create policy "tierlist_comentarios: autor apaga" on public.tierlist_comentarios for update using (autor = auth.uid()) with check (autor = auth.uid() and estado in ('publicado', 'apagado'));
create policy "tierlist_comentarios: moderador muda estado" on public.tierlist_comentarios for update using (public.eh_moderador());
create policy "tierlist_apoios: vejo os meus" on public.tierlist_apoios for select using (usuario = auth.uid());
revoke insert, update, delete on public.tierlists, public.tierlist_itens, public.tierlist_votos, public.tierlist_apoios from anon, authenticated;
revoke insert on public.tierlist_comentarios from anon, authenticated;

-- ---------------------------------------------------------------- leitura pública (views)
-- placar: quantos votos cada item tem em cada tier (sem ninguém identificado). Todo mundo lê.
create view public.tierlist_placar with (security_invoker = false) as
  select v.tierlist, v.item, v.tier, count(*)::int as votos
  from public.tierlist_votos v join public.tierlists t on t.slug = v.tierlist and t.estado = 'publicado'
  group by v.tierlist, v.item, v.tier;
grant select on public.tierlist_placar to anon, authenticated;

-- quem votou: só votos VISÍVEIS, e só para quem está logado. Voto anônimo entra apenas na contagem (anonimos).
create view public.tierlist_votantes with (security_invoker = false) as
  select v.tierlist, v.item, v.tier, p.usuario, p.nome, p.avatar_url, v.criado_em
  from public.tierlist_votos v join public.perfis p on p.id = v.usuario
  where not v.anonimo and p.usuario is not null;
revoke all on public.tierlist_votantes from anon;
grant select on public.tierlist_votantes to authenticated;

-- ---------------------------------------------------------------- escrita (só por função)
create function public.tl_contar(p_slug text) returns void language sql security definer set search_path = '' as $$
  update public.tierlists set
    votos = (select count(*) from public.tierlist_votos where tierlist = p_slug),
    comentarios = (select count(*) from public.tierlist_comentarios where tierlist = p_slug and estado = 'publicado'),
    apoios = (select count(*) from public.tierlist_apoios where alvo = 'tl:' || p_slug)
  where slug = p_slug;
$$;

-- p_tier null = tirar o voto. p_anonimo null = usa a preferência do perfil (e 'perguntar' = anônimo, por segurança).
create function public.votar_tier(p_tierlist text, p_item text, p_tier text, p_anonimo boolean default null) returns void language plpgsql security definer set search_path = '' as $$
declare p public.perfis := public.conferir_autor(); anon boolean;
begin
  if not exists (select 1 from public.tierlists where slug = p_tierlist and estado = 'publicado') then raise exception 'tierlist_inexistente'; end if;
  if p_tier is null then delete from public.tierlist_votos where usuario = p.id and tierlist = p_tierlist and item = p_item;
  else
    anon := coalesce(p_anonimo, p.voto_visibilidade <> 'visivel');
    insert into public.tierlist_votos (usuario, tierlist, item, tier, anonimo) values (p.id, p_tierlist, p_item, p_tier, anon)
    on conflict (usuario, tierlist, item) do update set tier = excluded.tier, anonimo = excluded.anonimo, criado_em = now();
  end if;
  perform public.tl_contar(p_tierlist);
end $$;

create function public.definir_visibilidade_voto(p_valor text, p_aplicar_aos_antigos boolean default false) returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.perfis set voto_visibilidade = p_valor where id = auth.uid();
  if p_aplicar_aos_antigos and p_valor <> 'perguntar' then update public.tierlist_votos set anonimo = (p_valor = 'anonimo') where usuario = auth.uid(); end if;
end $$;

-- sugestão de tierlist (da comunidade, não verificada pelo canal): dados = { titulo, descricao, itens: [nome, ...] } (2 a 30 itens)
create function public.sugerir_tierlist(dados jsonb) returns text language plpgsql security definer set search_path = '' as $$
declare p public.perfis := public.conferir_autor(); base text; novo text; n int := 0; nome text; hoje int;
begin
  if p.usuario is null then raise exception 'sem_usuario'; end if;
  select count(*) into hoje from public.tierlists where autor = p.id and criado_em > now() - interval '24 hours';
  if hoje >= 3 then raise exception 'limite_topicos'; end if;
  if jsonb_array_length(coalesce(dados -> 'itens', '[]')) not between 2 and 30 then raise exception 'itens_fora_do_limite'; end if;
  base := trim(both '-' from regexp_replace(lower(extensions.unaccent(dados ->> 'titulo')), '[^a-z0-9]+', '-', 'g'));
  novo := left(base, 48) || '-' || lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 5));
  insert into public.tierlists (slug, titulo, descricao, tipo, autor, estado)
  values (novo, trim(dados ->> 'titulo'), coalesce(dados ->> 'descricao', ''), 'sugestao', p.id,
          case when public.tem_palavra_bloqueada((dados ->> 'titulo') || ' ' || coalesce(dados ->> 'descricao', '') || ' ' || (dados -> 'itens')::text) then 'revisao' else 'publicado' end);
  for nome in select trim(value) from jsonb_array_elements_text(dados -> 'itens') loop
    n := n + 1;
    insert into public.tierlist_itens (tierlist, id, nome, ordem) values (novo, 'i' || n, left(nome, 40), n);
  end loop;
  insert into public.tierlist_apoios (usuario, alvo) values (p.id, 'tl:' || novo);
  perform public.tl_contar(novo);
  return novo;
end $$;

create function public.comentar_tierlist(p_tierlist text, p_corpo text, p_pai text default null) returns text language plpgsql security definer set search_path = '' as $$
declare p public.perfis := public.conferir_autor(); novo text; hora int;
begin
  if p.usuario is null then raise exception 'sem_usuario'; end if;
  if not exists (select 1 from public.tierlists where slug = p_tierlist and estado = 'publicado') then raise exception 'tierlist_inexistente'; end if;
  if p_pai is not null and exists (select 1 from public.tierlist_comentarios where id = p_pai and pai is not null) then raise exception 'nivel_maximo'; end if;
  select count(*) into hora from public.tierlist_comentarios where autor = p.id and criado_em > now() - interval '1 hour';
  if hora >= 30 then raise exception 'limite_comentarios'; end if;
  if p.criado_em > now() - interval '24 hours' and public.tem_link(p_corpo) then raise exception 'links_conta_nova'; end if;
  insert into public.tierlist_comentarios (tierlist, pai, autor, corpo, estado)
  values (p_tierlist, p_pai, p.id, p_corpo, case when public.tem_palavra_bloqueada(p_corpo) then 'revisao' else 'publicado' end)
  returning id into novo;
  perform public.tl_contar(p_tierlist);
  return novo;
end $$;

create function public.apoiar_tierlist(p_alvo text, ligar boolean) returns void language plpgsql security definer set search_path = '' as $$
declare p public.perfis := public.conferir_autor();
begin
  if ligar then insert into public.tierlist_apoios (usuario, alvo) values (p.id, p_alvo) on conflict do nothing;
  else delete from public.tierlist_apoios where usuario = p.id and alvo = p_alvo; end if;
  if p_alvo like 'tl:%' then perform public.tl_contar(substr(p_alvo, 4));
  else update public.tierlist_comentarios set apoios = (select count(*) from public.tierlist_apoios where alvo = p_alvo) where id = substr(p_alvo, 4); end if;
end $$;

revoke execute on function public.votar_tier(text, text, text, boolean), public.definir_visibilidade_voto(text, boolean), public.sugerir_tierlist(jsonb),
  public.comentar_tierlist(text, text, text), public.apoiar_tierlist(text, boolean), public.tl_contar(text) from anon;
revoke execute on function public.tl_contar(text) from authenticated;

-- ---------------------------------------------------------------- as 3 oficiais do canal (nomes de info-validada/nomes-ptbr.md)
insert into public.tierlists (slug, titulo, descricao, tipo) values
  ('armas-corpo-a-corpo', 'Melhor arma corpo a corpo', 'Qual arma você leva quando a horda chega? Vote em cada uma.', 'oficial'),
  ('mochilas', 'Melhor mochila', 'Espaço, peso e onde achar: qual mochila merece as suas costas?', 'oficial'),
  ('tracos', 'Traços que valem os pontos', 'Na criação de personagem, quais traços você sempre pega?', 'oficial');
insert into public.tierlist_itens (tierlist, id, nome, icone, ordem) values
  ('armas-corpo-a-corpo', 'machado-de-bombeiro', 'Machado de Bombeiro', 'Item_Axe', 1),
  ('armas-corpo-a-corpo', 'marreta', 'Marreta', 'Item_Sledgehamer', 2),
  ('armas-corpo-a-corpo', 'martelo-de-garra', 'Martelo de Garra', 'Item_Hammer', 3),
  ('armas-corpo-a-corpo', 'pa', 'Pá', 'Item_Shovel', 4),
  ('armas-corpo-a-corpo', 'marreta-pequena', 'Marreta Pequena', null, 5),
  ('armas-corpo-a-corpo', 'pa-de-corte', 'Pá de Corte', null, 6),
  ('mochilas', 'mochila-militar', 'Mochila Militar', 'Item_AliceBag', 1),
  ('mochilas', 'mochila-grande-de-trilha', 'Mochila Grande de Trilha', 'Item_BigHiking_Green', 2),
  ('mochilas', 'mochila-de-trilha', 'Mochila de Trilha', 'Item_Hiking_Green', 3),
  ('mochilas', 'bolsa-de-viagem', 'Bolsa de Viagem', 'Item_Duffelbag', 4),
  ('mochilas', 'mochila-pequena', 'Mochila Pequena', 'Item_Backpack_Black', 5),
  ('tracos', 'corajoso', 'Corajoso', null, 1),
  ('tracos', 'dessensibilizacao', 'Dessensibilização', null, 2),
  ('tracos', 'forte', 'Forte', null, 3),
  ('tracos', 'musculoso', 'Musculoso', null, 4),
  ('tracos', 'resiliente', 'Resiliente', null, 5),
  ('tracos', 'sono-leve', 'Sono Leve', null, 6),
  ('tracos', 'madrugador', 'Madrugador', null, 7),
  ('tracos', 'leitura-dinamica', 'Leitura Dinâmica', null, 8),
  ('tracos', 'herbalista', 'Herbalista', null, 9);
