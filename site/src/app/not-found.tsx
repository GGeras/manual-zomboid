import Link from 'next/link'
import { Jogo } from '@/componentes/icones'

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <span className="moodle size-20"><Jogo nome="moodles/Mood_Zombified" tamanho={64} className="size-14" /></span>
      <p className="hud mt-8 text-sangue">Erro 404</p>
      <h1 className="titulo mt-3 text-5xl">Essa página <span className="text-sangue">virou zumbi.</span></h1>
      <p className="mt-4 text-osso-2">O endereço não existe mais, ou nunca existiu.</p>
      <div className="mt-8 flex gap-3"><Link href="/" className="botao botao-sangue">Voltar ao início</Link><Link href="/comunidade" className="botao botao-contorno">Comunidade</Link></div>
    </div>
  )
}
