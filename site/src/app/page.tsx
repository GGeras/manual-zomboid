import { Abertura } from '@/componentes/landing/abertura'
import { Olhos } from '@/componentes/landing/olhos'
import { Atualizacoes, DiscordSecao, EmAlta, Guias, Shorts, Temas } from '@/componentes/landing/secoes'
import type { ShortCartao, TemaCartao } from '@/componentes/landing/shorts-temas'
import { TierlistsVitrine } from '@/componentes/tierlist/vitrine'
import { Revelar } from '@/componentes/revelar'
import { SITE_URL, youtube } from '@/config/publico'
import { comunidade } from '@/lib/comunidade/dados'
import { tierlists } from '@/lib/tierlist/dados'
import { dicasDosEpisodios, EPISODIOS, FATOS, guias, TEMAS } from '@/lib/conteudo'
import { discordWidget, noticiasAprovadas, shortsRecentes } from '@/lib/externos'

// Landing estática, refeita a cada build (e a cada hora quando houver cache de revalidação).
export const revalidate = 3600

export default async function Inicio() {
  const [shorts, emAlta, numeros, widget, noticias, listas] = await Promise.all([
    shortsRecentes(), comunidade.topicos({ ordem: 'quente', limite: 5 }), comunidade.contagem(), discordWidget(), noticiasAprovadas(), tierlists.oficiais(),
  ])
  const lista = guias()
  const temaDo = (nn: string | null) => (nn ? TEMAS.find((t) => t.eps.includes(nn)) : undefined)

  // Shorts: cada capa abre o resumo do guia = fatos validados do episódio (ou do tema, nos vídeos antigos sem fatos marcados)
  const shortsCartoes: ShortCartao[] = shorts.lista.map((s, i) => {
    const tema = temaDo(s.nn)
    const doEp = s.nn ? dicasDosEpisodios([s.nn], 6) : []
    return { chave: s.id ?? s.nn ?? String(i), id: s.id, titulo: s.titulo, capa: s.capa, nn: s.nn, tema: tema ? { nome: tema.nome, moodle: tema.moodle, guia: tema.guia } : null, dicas: doEp.length ? doEp : tema ? dicasDosEpisodios(tema.eps, 4) : [] }
  })
  const status = new Map(EPISODIOS.map((e) => [e.nn, e.status]))
  const temas: TemaCartao[] = TEMAS.map((t) => ({
    nome: t.nome, texto: t.texto, moodle: t.moodle, guia: t.guia, videos: t.eps.length, noAr: t.eps.filter((e) => status.get(e) === 'publicado').length,
    dicas: dicasDosEpisodios(t.eps, 8),
    shorts: shorts.lista.filter((s) => s.id && s.capa && s.nn && t.eps.includes(s.nn)).map((s) => ({ id: s.id!, titulo: s.titulo, capa: s.capa! })),
  }))
  const votos = listas.reduce((n, l) => n + l.votos, 0)

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'Manual Zomboid', url: SITE_URL, inLanguage: 'pt-BR',
    publisher: { '@type': 'Organization', name: 'Manual Zomboid', logo: `${SITE_URL}/jogo/logo-icone-512.webp`, sameAs: [youtube.canalUrl].filter(Boolean) },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Abertura fatos={Object.keys(FATOS).length} guias={lista.length} votos={votos} />
      <TierlistsVitrine listas={listas} />
      <Shorts lista={shortsCartoes} fonte={shorts.fonte} />
      <Temas temas={temas} />
      <EmAlta topicos={emAlta} numeros={numeros} />
      <Guias guias={lista} />
      <DiscordSecao widget={widget} />
      <Atualizacoes noticias={noticias} />
      <Revelar />
      <Olhos />
    </>
  )
}
