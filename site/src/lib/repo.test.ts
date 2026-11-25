import { describe, expect, it } from 'vitest'
import { episodioDoVideo } from './repo'

// Títulos reais do canal (RSS) -> episódio: a capa oficial e o resumo do modal dependem disso.
describe('episodioDoVideo', () => {
  const casos: [string, string | undefined][] = [
    ['Coleta no Project Zomboid: ache comida no mato (B42)', '21'],
    ['Como cozinhar sem estragar a comida (B42)', '14'],
    ['Como lutar corpo a corpo sem morrer', '08'],
    ['Sono: como descansar de verdade (B42)', '20'],
    ['Livros de habilidade: como funcionam de verdade (B42)', '19'],
    ['Frio e calor: como não morrer de clima (B42)', '18'],
    ['Barricadas: como fechar a base sem virar caixão (B42)', '17'],
    ['Animais de fazenda: como não deixar morrer (B42)', '16'],
    ['Medicina: arranhão, vidro, bala e infecção (B42)', '15'],
    ['Como montar o personagem sem errar (B42)', '13'],
    ['Horta e pesca no Project Zomboid: 5 regras + o minigame da vara (B42)', '12'],
    ['Arma de fogo no Project Zomboid: 5 regras pra não chamar a horda', '11'],
    ['Gerador: 5 regras pra não morrer (nem explodir a base)', '10'],
    ['Sua água vai acabar: 5 regras pra não morrer de sede', '09'],
    ['A MELHOR BASE do Project Zomboid na Build 42? Quartel de Bombeiros de Rosewood #shorts', undefined],
  ]
  it.each(casos)('%s -> EP %s', (titulo, nn) => expect(episodioDoVideo(null, titulo)?.nn).toBe(nn))
})
