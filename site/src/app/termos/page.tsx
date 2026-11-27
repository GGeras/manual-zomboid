import type { Metadata } from 'next'
import { PaginaTexto } from '@/componentes/pagina-texto'
import { CONFIG } from '@/config/publico'

export const metadata: Metadata = { title: 'Termos de uso', robots: { index: false } }

export default function Termos() {
  const idade = CONFIG.legal.idadeMinima
  return (
    <PaginaTexto rotulo="Legal" titulo="Termos de" destaque="uso">
      <p>Estes termos valem para o site Manual Zomboid e a Comunidade. Ao criar uma conta você concorda com eles e com as <a href="/comunidade/regras">regras da Comunidade</a>.</p>
      <h2>Quem somos</h2>
      <p>Manual Zomboid é um canal de fã sobre Project Zomboid, sem ligação com a The Indie Stone. Project Zomboid é marca da The Indie Stone.</p>
      <h2>Conta</h2>
      <ul><li>Você entra com Discord, Google ou link por e-mail. Não guardamos senha.</li><li>{idade ? `Idade mínima: ${idade} anos.` : 'A idade mínima será definida antes da abertura.'}</li><li>Uma pessoa, uma conta. Você responde pelo que posta.</li></ul>
      <h2>O que você posta</h2>
      <ul><li>O conteúdo continua seu. Você nos autoriza a exibi-lo no site e a usá-lo nos vídeos do canal com crédito.</li><li>Não poste o que não é seu sem permissão.</li><li>Podemos esconder ou remover conteúdo que quebre as regras ou a lei.</li></ul>
      <h2>Apagar sua conta</h2>
      <p>Você pode apagar a conta quando quiser. O perfil é apagado e seus posts passam a aparecer como &quot;[conta apagada]&quot;.</p>
      <h2>Contato</h2>
      <p>{CONFIG.legal.emailContato ? <>Dúvidas e denúncias: <a href={`mailto:${CONFIG.legal.emailContato}`}>{CONFIG.legal.emailContato}</a>.</> : 'O e-mail de contato será publicado antes da abertura.'}</p>
    </PaginaTexto>
  )
}
