// Dados do repo que valem no servidor E no navegador (sem fs): episódios e temas. (Os fatos ficam em conteudo.ts: só servidor, para não pesar no navegador.)
import episodiosJson from '@/gerado/episodios.json'

export interface Episodio { nn: string; slug: string; tema: string; status: string; titulo: string | null; youtube: string | null }
export const EPISODIOS = episodiosJson as Episodio[]
export const episodio = (nn: string | null | undefined) => EPISODIOS.find((e) => e.nn === nn)
export const noAr = (nn: string) => episodio(nn)?.status === 'publicado'

/** Temas do canal para a seção "O que você aprende". Agrupamento do canal (não é dado do jogo). */
export const TEMAS: { nome: string; texto: string; moodle: string; eps: string[]; guia?: string }[] = [
  { nome: 'Primeiros dias', texto: 'O que fazer (e não fazer) quando tudo começa.', moodle: 'moodles/Mood_Panicked', eps: ['01', '02'] },
  { nome: 'Barulho e furtividade', texto: 'Passar sem ser visto e não chamar a horda.', moodle: 'moodles/Mood_Scared', eps: ['03', '05', '28'] },
  { nome: 'Saúde e ferimentos', texto: 'Cada ferida pede um tratamento.', moodle: 'moodles/Status_Bleeding', eps: ['04', '15', '27'], guia: 'ferimentos-e-infeccao' },
  { nome: 'Comida e água', texto: 'Comer, beber e cozinhar sem passar mal.', moodle: 'moodles/Status_Hunger', eps: ['06', '09', '14', '26'] },
  { nome: 'Base e sobrevivência', texto: 'Energia, barricadas, fogo e limpeza.', moodle: 'moodles/Mood_NoxiousSmell', eps: ['10', '17', '29', '30'], guia: 'cadaveres' },
  { nome: 'Combate e armas', texto: 'Brigar só quando precisa, do jeito certo.', moodle: 'moodles/Status_InjuredMajor', eps: ['08', '11'] },
  { nome: 'Corpo e mente', texto: 'Sono, cansaço, estresse, tédio.', moodle: 'moodles/Mood_Sleepy', eps: ['20', '22', '24', '25'], guia: 'sono' },
  { nome: 'Mundo e recursos', texto: 'Carros, plantação, animais, coleta, peso.', moodle: 'moodles/Status_HeavyLoad', eps: ['07', '12', '13', '16', '18', '19', '21', '23'] },
]
