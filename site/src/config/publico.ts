// Configuração pública do site (config.publico.json). Nada aqui é segredo.
import json from '../../config.publico.json'

type T = string | null
export interface ConfigPublica {
  site: { url: T; dominioImagens: T }
  youtube: { canalId: T; handle: T }
  discord: { servidorId: T; convite: T; appId?: T; canais?: Partial<Record<'jogarJunto' | 'dicas' | 'bases' | 'regras', string>> }
  redes: { instagram: T; tiktok: T; facebook: T }
  comunidade: { supabaseUrl: T; supabaseChavePublica: T; turnstileSiteKey: T }
  central: { supabaseUrl: string; supabaseChavePublica: string }
  legal: { emailContato: T; idadeMinima: number | null }
}
const cfg = json as unknown as ConfigPublica
export const CONFIG = cfg
export const SITE_URL = (cfg.site.url ?? 'https://manual-zomboid-site.mundomix.workers.dev').replace(/\/$/, '')
export const REPO_URL = 'https://github.com/GGeras/manual-zomboid'

export const youtube = {
  ativo: Boolean(cfg.youtube.canalId),
  canalUrl: cfg.youtube.handle ? `https://www.youtube.com/@${cfg.youtube.handle.replace(/^@/, '')}` : cfg.youtube.canalId ? `https://www.youtube.com/channel/${cfg.youtube.canalId}` : null,
  shortsUrl: cfg.youtube.canalId ? `https://www.youtube.com/channel/${cfg.youtube.canalId}/shorts` : null,
  rss: cfg.youtube.canalId ? `https://www.youtube.com/feeds/videos.xml?channel_id=${cfg.youtube.canalId}` : null,
}
/** Perfis nas redes (só URL completa; null = não aparece em /links nem no rodapé). */
export const redes = {
  instagram: cfg.redes?.instagram ?? null,
  tiktok: cfg.redes?.tiktok ?? null,
  facebook: cfg.redes?.facebook ?? null,
}
export const discord = {
  ativo: Boolean(cfg.discord.convite),
  convite: cfg.discord.convite,
  widget: cfg.discord.servidorId ? `https://discord.com/api/guilds/${cfg.discord.servidorId}/widget.json` : null,
  /** link direto para um canal (abre no app do Discord; quem ainda não entrou no servidor vê o convite primeiro) */
  canal: (c: 'jogarJunto' | 'dicas' | 'bases' | 'regras') => (cfg.discord.servidorId && cfg.discord.canais?.[c] ? `https://discord.com/channels/${cfg.discord.servidorId}/${cfg.discord.canais[c]}` : null),
}
/** Comunidade "de verdade" só quando o projeto Supabase dela existir. Até lá: modo prévia (dados de exemplo, nada salvo no servidor). */
export const comunidadeAtiva = Boolean(cfg.comunidade.supabaseUrl && cfg.comunidade.supabaseChavePublica)
