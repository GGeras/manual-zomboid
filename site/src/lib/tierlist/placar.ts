// Placar da tierlist: a média dos votos de cada item decide a linha (S+ ... D). Puro e testado (tierlist.test.ts).
import { TIERS, VALOR, type ItemTier, type Tier, type VotoTier } from './tipos'

export interface LinhaPlacar { item: ItemTier; media: number | null; tier: Tier | null; votos: number; porTier: Record<Tier, number>; visiveis: Partial<Record<Tier, string[]>>; anonimos: number }

/** média -> tier: arredonda para o tier mais próximo (5,5 ou mais = S+; abaixo de 1,5 = D) */
export function tierDaMedia(m: number): Tier {
  const alvo = Math.min(6, Math.max(1, Math.round(m)))
  return TIERS.find((t) => t.valor === alvo)!.id
}

export function placar(itens: ItemTier[], votos: VotoTier[]): LinhaPlacar[] {
  return itens.map((item) => {
    const meus = votos.filter((v) => v.item === item.id)
    const porTier = Object.fromEntries(TIERS.map((t) => [t.id, 0])) as Record<Tier, number>
    const visiveis: Partial<Record<Tier, string[]>> = {}
    let anonimos = 0
    for (const v of meus) {
      porTier[v.tier]++
      if (v.usuario) (visiveis[v.tier] ??= []).push(v.usuario); else anonimos++
    }
    const media = meus.length ? meus.reduce((s, v) => s + VALOR[v.tier], 0) / meus.length : null
    return { item, media, tier: media == null ? null : tierDaMedia(media), votos: meus.length, porTier, visiveis, anonimos }
  })
}

/** linhas do quadro: S+ ... D (dentro da linha, maior média primeiro; empate: mais votos) + "sem votos" */
export function quadro(linhas: LinhaPlacar[]) {
  const ord = (a: LinhaPlacar, b: LinhaPlacar) => (b.media ?? 0) - (a.media ?? 0) || b.votos - a.votos || a.item.nome.localeCompare(b.item.nome)
  return {
    tiers: TIERS.map((t) => ({ ...t, itens: linhas.filter((l) => l.tier === t.id).sort(ord) })),
    semVotos: linhas.filter((l) => l.tier == null),
  }
}

/** junta os votos do servidor com o voto local da pessoa (o voto dela substitui o que veio do servidor com o mesmo usuário) */
export function comVotoLocal(votos: VotoTier[], meus: Record<string, { tier: Tier; anonimo: boolean } | undefined>, usuario: string | null, slug: string): VotoTier[] {
  const resto = usuario ? votos.filter((v) => v.usuario !== usuario) : votos
  const locais = Object.entries(meus).flatMap(([k, v]) => {
    const [s, item] = k.split('::'); if (s !== slug || !v) return []
    return [{ item, tier: v.tier, usuario: v.anonimo ? null : usuario, criadoEm: new Date().toISOString() }]
  })
  return [...resto, ...locais]
}
