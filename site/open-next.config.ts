// Cache das páginas estáticas direto dos arquivos publicados (sem R2 por enquanto).
// Quando o R2 estiver ligado (configuracao.md §8), trocar pelo r2-incremental-cache.
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache, enableCacheInterception: true })
