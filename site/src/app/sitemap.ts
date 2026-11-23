import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/config/publico'
import { CATEGORIAS } from '@/lib/comunidade/categorias'
import { comunidade } from '@/lib/comunidade/dados'
import { guias } from '@/lib/conteudo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topicos = await comunidade.topicos({ ordem: 'novos', limite: 500 })
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/guias`, changeFrequency: 'weekly', priority: 0.8 },
    ...guias().map((g) => ({ url: `${SITE_URL}/guias/${g.slug}`, lastModified: g.data, priority: 0.8 })),
    { url: `${SITE_URL}/comunidade`, changeFrequency: 'hourly', priority: 0.8 },
    ...CATEGORIAS.map((c) => ({ url: `${SITE_URL}/comunidade/c/${c.slug}`, changeFrequency: 'daily' as const, priority: 0.5 })),
    ...topicos.map((t) => ({ url: `${SITE_URL}/comunidade/t/${t.id}`, lastModified: t.editadoEm ?? t.criadoEm, priority: 0.6 })),
    { url: `${SITE_URL}/comunidade/regras`, priority: 0.3 },
  ]
}
