import path from 'node:path'
import type { NextConfig } from 'next'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const nextConfig: NextConfig = {
  // As imagens já saem otimizadas do scripts/copiar-assets.mjs (WebP no tamanho certo).
  images: { unoptimized: true },
  poweredByHeader: false,
  outputFileTracingRoot: path.resolve(import.meta.dirname),
  typedRoutes: false,
}

export default nextConfig
initOpenNextCloudflareForDev()
