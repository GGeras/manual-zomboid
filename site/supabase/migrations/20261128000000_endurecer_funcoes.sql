-- Só quem está logado chama as funções de escrita; funções internas e de gatilho não ficam expostas na API.
revoke execute on function
  public.criar_topico(jsonb), public.comentar(text, text, text, jsonb), public.votar(text, text, boolean), public.marcar_melhor(text), public.definir_usuario(text),
  public.votar_tier(text, text, text, boolean), public.definir_visibilidade_voto(text, boolean), public.sugerir_tierlist(jsonb), public.comentar_tierlist(text, text, text), public.apoiar_tierlist(text, boolean),
  public.conferir_autor(), public.tem_palavra_bloqueada(text), public.tl_contar(text),
  public.novo_perfil(), public.contar_votos(), public.contar_comentarios(), public.denuncia_esconde(), public.log_moderacao()
  from public, anon, authenticated;
grant execute on function
  public.criar_topico(jsonb), public.comentar(text, text, text, jsonb), public.votar(text, text, boolean), public.marcar_melhor(text), public.definir_usuario(text),
  public.votar_tier(text, text, text, boolean), public.definir_visibilidade_voto(text, boolean), public.sugerir_tierlist(jsonb), public.comentar_tierlist(text, text, text), public.apoiar_tierlist(text, boolean)
  to authenticated;
alter function public.nota_quente(int, timestamptz) set search_path = '';
alter function public.tem_link(text) set search_path = '';
alter function public.marcar_editado() set search_path = '';
alter function public.marcar_editado_c() set search_path = '';
