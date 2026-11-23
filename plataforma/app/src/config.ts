// Endereço e chave PÚBLICA do Supabase (vão para o navegador de qualquer jeito).
// A segurança está no banco: RLS só libera dados para quem está em `membros`.
// Chave secreta (service role) nunca entra aqui.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://tephnuzsuoamhfukeqsi.supabase.co'
export const SUPABASE_CHAVE_PUBLICA = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_I47KkhnRvLrfDjow0yZv3w_IFZS-S1H'

export const REPO_URL = 'https://github.com/GGeras/manual-zomboid'
