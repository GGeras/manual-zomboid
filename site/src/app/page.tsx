import { Abertura } from '@/componentes/landing/abertura'
import { Atualizacoes, DiscordSecao, EmAlta, Guias, Shorts, Temas } from '@/componentes/landing/secoes'
import { Revelar } from '@/componentes/revelar'
import { SITE_URL, youtube } from '@/config/publico'
import { comunidade } from '@/lib/comunidade/dados'
import { EPISODIOS, FATOS, guias } from '@/lib/conteudo'
import { discordWidget, noticiasAprovadas, shortsRecentes } from '@/lib/externos'

// Landing estática, refeita a cada build (e a cada hora quando houver cache de revalidação).
export const revalidate = 3600

export default async function Inicio() {
  const [shorts, emAlta, numeros, widget, noticias] = await Promise.all([
    shortsRecentes(), comunidade.topicos({ ordem: 'quente', limite: 5 }), comunidade.contagem(), discordWidget(), noticiasAprovadas(),
  ])
  const lista = guias()
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'Manual Zomboid', url: SITE_URL, inLanguage: 'pt-BR',
    publisher: { '@type': 'Organization', name: 'Manual Zomboid', logo: `${SITE_URL}/jogo/logo-icone-512.webp`, sameAs: [youtube.canalUrl].filter(Boolean) },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Abertura shortsNoAr={EPISODIOS.filter((e) => e.status === 'publicado').length} fatos={Object.keys(FATOS).length} guias={lista.length} />
      <Shorts {...shorts} />
      <Temas />
      <EmAlta topicos={emAlta} numeros={numeros} />
      <Guias guias={lista} />
      <DiscordSecao widget={widget} />
      <Atualizacoes noticias={noticias} />
      <Revelar />
    </>
  )
}
