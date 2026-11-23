// Dados de EXEMPLO da Comunidade (modo prévia), usados enquanto o projeto Supabase `manual-zomboid-comunidade` não existe.
// Regra nº 1: nenhuma afirmação sobre o jogo aqui fora do que está em info-validada/ (as respostas citam o fato e o guia).
// Os tópicos reais de lançamento são escritos pelo Jose e pelo Bruno (site.md §5).
import type { Comentario, Perfil, Topico } from './tipos'

const P = (usuario: string, nome: string, papel: Perfil['papel'] = 'usuario', bio = ''): Perfil =>
  ({ usuario, nome, avatar: null, bio, papel, criadoEm: '2026-11-01T12:00:00Z' })

export const PERFIS: Record<string, Perfil> = {
  manualzomboid: P('manualzomboid', 'Manual Zomboid', 'admin', 'O canal. Dicas de Project Zomboid em 60 segundos.'),
  lanterna_fraca: P('lanterna_fraca', 'Lanterna Fraca', 'usuario', 'Sempre esqueço a pilha.'),
  tabua_e_prego: P('tabua_e_prego', 'Tábua e Prego', 'moderador', 'Barricada primeiro, pergunta depois.'),
  dona_marta: P('dona_marta', 'Dona Marta', 'usuario', 'Jogo devagar e sobrevivo.'),
  zumbi_educado: P('zumbi_educado', 'Zumbi Educado'),
  pedro_sem_sono: P('pedro_sem_sono', 'Pedro', 'usuario', 'Insônia no jogo e na vida.'),
  carol_cozinha: P('carol_cozinha', 'Carol'),
  joao_dia7: P('joao_dia7', 'João', 'usuario', 'Nunca passei do dia 7. Ainda.'),
  bia_radio: P('bia_radio', 'Bia', 'usuario', 'Procurando grupo pra multiplayer.'),
}

type SemAutor<T> = Omit<T, 'autor'> & { autor: string }
const H = 3600e3

/** horas atrás -> ISO. Calculado na hora (não no carregamento do módulo: no Worker o relógio do escopo global é fixo). */
const ha = (agora: number, h: number) => new Date(agora - h * H).toISOString()

type NovoTopico = Partial<SemAutor<Topico>> & Pick<SemAutor<Topico>, 'id' | 'autor' | 'categoria' | 'titulo' | 'corpo'> & { h: number }
type NovoComentario = Partial<SemAutor<Comentario>> & Pick<SemAutor<Comentario>, 'id' | 'topico' | 'autor' | 'corpo'> & { h: number }

function brutos(agora: number) {
  const t = ({ h, ...o }: NovoTopico): SemAutor<Topico> => ({
    imagens: [], build: null, dia: null, episodio: null, votos: 1, comentarios: 0, fixado: false, travado: false, resolvido: false,
    criadoEm: ha(agora, h), editadoEm: null, ...o,
  })
  const c = ({ h, ...o }: NovoComentario): SemAutor<Comentario> => ({
    pai: null, imagens: [], votos: 0, melhor: false, criadoEm: ha(agora, h), editadoEm: null, ...o,
  })
  const topicos = [
    t({ id: 'como-voce-morreu-essa-semana', autor: 'manualzomboid', categoria: 'como-morri', h: 30, votos: 41, fixado: true,
      titulo: 'Tópico da semana: como você morreu essa semana?',
      corpo: 'Toda semana a gente abre este tópico. Conte como foi, com print se tiver.\n\nAs melhores histórias podem virar Short no canal (com crédito).' }),
    t({ id: 'mordida-sempre-infecta', autor: 'joao_dia7', categoria: 'duvida', h: 5, votos: 23, resolvido: true, build: 'B42.22', episodio: '04',
      titulo: 'Mordida sempre infecta ou ainda tem chance?',
      corpo: 'Levei uma mordida no braço e fiquei esperando o pior. Tem chance de escapar? E arranhão, quanto conta?' }),
    t({ id: 'primeira-base-mais-de-um-mes', autor: 'dona_marta', categoria: 'minha-base', h: 9, votos: 37, build: 'B42.22', dia: 34,
      titulo: 'Minha primeira base que passou de um mês',
      corpo: 'Casa de esquina, cerca em volta e tudo trancado no térreo. Demorei muito pra ter coragem de sair de casa.\n\nAceito críticas (com educação, por favor).',
      imagens: [{ url: '/jogo/cena-inverno-1080.webp', alt: 'Sobrevivente de jaqueta verde parado na calçada coberta de neve, ao lado de uma placa de pare e uma cerca branca', w: 1080, h: 1920 }] }),
    t({ id: 'dormir-com-zumbi-perto', autor: 'pedro_sem_sono', categoria: 'duvida', h: 14, votos: 12, resolvido: true, build: 'B42.22',
      titulo: 'Por que meu personagem não consegue dormir?',
      corpo: 'Clico na cama e nada. Ele está cansado, a cama é boa. O que eu estou fazendo errado?' }),
    t({ id: 'esqueci-a-lanterna', autor: 'lanterna_fraca', categoria: 'como-morri', h: 3, votos: 18,
      titulo: 'Fui buscar remédio de noite e esqueci a lanterna',
      corpo: 'Não preciso dizer como terminou. Fica o aviso: confere a mochila antes de sair.' }),
    t({ id: 'pilha-de-corpos-no-quintal', autor: 'carol_cozinha', categoria: 'como-morri', h: 26, votos: 29, build: 'B42.22',
      titulo: 'Deixei a pilha de corpos no quintal "pra depois"',
      corpo: 'O moodle foi de Mau Cheiro até Vapores Mortais e eu achando que era só cheiro. Agora a pá mora no meu inventário.',
      imagens: [{ url: '/jogo/cena-barricada-1080.webp', alt: 'Zumbis forçando a porta de uma casa bege enquanto o sobrevivente desce pela janela com uma corda de lençol', w: 1080, h: 1920 }] }),
    t({ id: 'procuro-grupo-fim-de-semana', autor: 'bia_radio', categoria: 'multiplayer', h: 7, votos: 6,
      titulo: 'Procuro grupo pra começar do zero (noite e fim de semana)',
      corpo: 'Jogo à noite, fim de semana mais. Tenho microfone, sou paciente e não saio correndo pra saquear sozinha. Alguém?' }),
    t({ id: 'mods-que-voces-nao-largam', autor: 'zumbi_educado', categoria: 'mods', h: 40, votos: 9,
      titulo: 'Vocês jogam com mod ou puro?',
      corpo: 'Estou na primeira run e fiquei na dúvida se começo puro pra aprender o jogo ou se já instalo uns mods.' }),
    t({ id: 'qual-som-te-da-medo', autor: 'tabua_e_prego', categoria: 'off-topic', h: 52, votos: 15,
      titulo: 'Qual som do jogo mais te dá medo?',
      corpo: 'O meu: silêncio total depois de uma noite barulhenta.' }),
    t({ id: 'ler-livro-antes', autor: 'joao_dia7', categoria: 'duvida', h: 1.5, votos: 2, build: 'B42.22',
      titulo: 'Vale a pena ler livro de habilidade antes de praticar?',
      corpo: 'Achei uns livros numa estante. Leio agora ou deixo pra quando for usar a habilidade?' }),
    t({ id: 'primeira-profissao', autor: 'pedro_sem_sono', categoria: 'builds', h: 60, votos: 11,
      titulo: 'Qual personagem vocês montam na primeira run?',
      corpo: 'Quero algo que aguente erro de iniciante. Montam pensando em combate ou em base?' }),
    t({ id: 'rota-sem-centro', autor: 'lanterna_fraca', categoria: 'mapa', h: 80, votos: 7,
      titulo: 'Vocês atravessam a cidade ou dão a volta?',
      corpo: 'Toda vez que corto caminho pelo centro dá ruim. Qual a lógica de vocês pra escolher rota?' }),
    t({ id: 'atualizacao-o-que-acharam', autor: 'zumbi_educado', categoria: 'noticias', h: 100, votos: 5,
      titulo: 'O que vocês acharam da última atualização?',
      corpo: 'Joguei pouco ainda. O que mudou na run de vocês?' }),
  ]
  const comentarios = [
    c({ id: 'c1', topico: 'mordida-sempre-infecta', autor: 'tabua_e_prego', h: 4.5, votos: 19, melhor: true,
      corpo: 'O canal conferiu isso (B42.22, padrão do jogo): arranhão 7%, corte 25%, mordida 100%. O sorteio é uma vez só, na hora do ferimento, e não tem cura.\n\nTem o guia completo: [Ferimentos: o que cada um pede](/guias/ferimentos-e-infeccao).' }),
    c({ id: 'c2', topico: 'mordida-sempre-infecta', autor: 'joao_dia7', pai: 'c1', h: 4.2, votos: 3, corpo: 'Ou seja, era hora de fazer o testamento. Valeu!' }),
    c({ id: 'c3', topico: 'mordida-sempre-infecta', autor: 'dona_marta', h: 4, votos: 4, corpo: 'E não adianta olhar o painel de saúde esperando aviso: a infecção zumbi não aparece lá.' }),
    c({ id: 'c4', topico: 'dormir-com-zumbi-perto', autor: 'dona_marta', h: 13, votos: 9, melhor: true,
      corpo: 'Zumbi perto, pânico e dor forte impedem dormir. E desde a 42.22.2 o moodle Mau Cheiro também bloqueia. Tem corpo perto da casa?\n\nGuia: [Sono: como dormir sem morrer](/guias/sono).' }),
    c({ id: 'c5', topico: 'dormir-com-zumbi-perto', autor: 'pedro_sem_sono', pai: 'c4', h: 12, votos: 2, corpo: 'TINHA. Três no quintal. Resolvido, obrigado!' }),
    c({ id: 'c6', topico: 'primeira-base-mais-de-um-mes', autor: 'tabua_e_prego', h: 8, votos: 6, corpo: 'Esquina é boa pra ver quem chega. Bonita a base!' }),
    c({ id: 'c7', topico: 'primeira-base-mais-de-um-mes', autor: 'carol_cozinha', h: 6, votos: 3, corpo: 'Um mês é muito pra primeira. Parabéns, dona Marta.' }),
    c({ id: 'c8', topico: 'pilha-de-corpos-no-quintal', autor: 'manualzomboid', h: 24, votos: 12,
      corpo: 'Clássico. Enterrar (cada cova recebe 5) ou queimar resolve. Guia: [Cadáveres: o cheiro que mata](/guias/cadaveres).' }),
    c({ id: 'c9', topico: 'como-voce-morreu-essa-semana', autor: 'joao_dia7', h: 20, votos: 8, corpo: 'Dia 7. De novo. Fui pegar uma lata de comida no carro e esqueci a porta da casa aberta.' }),
    c({ id: 'c10', topico: 'como-voce-morreu-essa-semana', autor: 'lanterna_fraca', h: 18, votos: 5, corpo: 'Ver meu tópico. Lanterna. Sempre a lanterna.' }),
    c({ id: 'c11', topico: 'procuro-grupo-fim-de-semana', autor: 'zumbi_educado', h: 6, votos: 2, corpo: 'Eu topo! Sábado à noite?' }),
    c({ id: 'c12', topico: 'mods-que-voces-nao-largam', autor: 'dona_marta', h: 38, votos: 4, corpo: 'Comecei puro e não me arrependo. Aprende o jogo primeiro, depois mexe.' }),
    c({ id: 'c13', topico: 'qual-som-te-da-medo', autor: 'carol_cozinha', h: 50, votos: 7, corpo: 'Helicóptero. Sempre helicóptero.' }),
    c({ id: 'c14', topico: 'qual-som-te-da-medo', autor: 'joao_dia7', h: 49, votos: 3, pai: 'c13', corpo: 'Esse som é o fim da paz.' }),
    c({ id: 'c15', topico: 'primeira-profissao', autor: 'tabua_e_prego', h: 58, votos: 5, corpo: 'Base. Quem tem onde dormir em paz aprende o resto com calma.' }),
    c({ id: 'c16', topico: 'rota-sem-centro', autor: 'bia_radio', h: 70, votos: 2, corpo: 'Dou a volta sempre. Demora mais, mas eu chego.' }),
  ]
  for (const tp of topicos) tp.comentarios = comentarios.filter((x) => x.topico === tp.id).length
  return { topicos, comentarios }
}

export function dadosDemo(agora = Date.now()): { topicos: Topico[]; comentarios: Comentario[] } {
  const { topicos, comentarios } = brutos(agora)
  return {
    topicos: topicos.map((x) => ({ ...x, autor: PERFIS[x.autor] })),
    comentarios: comentarios.map((x) => ({ ...x, autor: PERFIS[x.autor] })),
  }
}
