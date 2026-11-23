-- eh_membro() sai da API pública (aviso 0029 do Supabase): vai para o schema "privado", que o PostgREST não expõe.
-- entrar() continua público de propósito: o app chama depois do login.

create schema if not exists privado;
revoke all on schema privado from public, anon;
grant usage on schema privado to authenticated, service_role;

create function privado.eh_membro() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.membros where user_id = (select auth.uid()));
$$;
revoke all on function privado.eh_membro() from public, anon;
grant execute on function privado.eh_membro() to authenticated;

alter policy "membro lê membros"   on public.membros   using ((select privado.eh_membro()));
alter policy "membro lê episodios" on public.episodios using ((select privado.eh_membro()));
alter policy "membro lê fatos"     on public.fatos     using ((select privado.eh_membro()));
alter policy "membro lê entregas"  on public.entregas  using ((select privado.eh_membro()));
alter policy "membro lê alertas"   on public.alertas   using ((select privado.eh_membro()));

drop function public.eh_membro();
