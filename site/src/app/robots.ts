import type { MetadataRoute } from 'next'
import { CONFIG, SITE_URL, comunidadeAtiva } from '@/config/publico'

export default function robots(): MetadataRoute.Robots {
  // Sem domínio próprio ainda (prévia em workers.dev): não indexar. Com o domínio, libera.
  if (!CONFIG.site.url) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/comunidade/novo', '/comunidade/entrar/', ...(comunidadeAtiva ? [] : ['/comunidade'])] }, sitemap: `${SITE_URL}/sitemap.xml` }
}
