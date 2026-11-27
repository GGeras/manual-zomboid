import type { Metadata } from 'next'
import { PaginaTexto } from '@/componentes/pagina-texto'
import { CONFIG } from '@/config/publico'

export const metadata: Metadata = { title: 'Privacidade', robots: { index: false } }

export default function Privacidade() {
  return (
    <PaginaTexto rotulo="Legal" titulo="Privacidade">
      <p>Coletamos o mínimo para a Comunidade funcionar, de acordo com a LGPD.</p>
      <h2>O que guardamos</h2>
      <ul><li>Da conta: nome de usuário, nome e foto do Discord ou Google, e-mail (para o login).</li><li>O que você posta: tópicos, respostas, imagens, votos e denúncias.</li><li>Registros técnicos de acesso pelo tempo exigido pelo Marco Civil da Internet.</li></ul>
      <h2>O que não fazemos</h2>
      <ul><li>Não vendemos dados. Não usamos cookies de propaganda.</li><li>As imagens que você sobe são recomprimidas no seu navegador: dados escondidos (como a localização da foto) são apagados antes do envio.</li><li>A medição de visitas é sem cookie (Cloudflare Web Analytics).</li></ul>
      <h2>Onde fica</h2>
      <p>Banco de dados no Supabase e imagens no Cloudflare R2.</p>
      <h2>Seus direitos</h2>
      <p>Você pode ver, corrigir e apagar seus dados, e apagar a conta a qualquer momento. {CONFIG.legal.emailContato ? <>Pedidos: <a href={`mailto:${CONFIG.legal.emailContato}`}>{CONFIG.legal.emailContato}</a>.</> : 'O e-mail para pedidos será publicado antes da abertura.'}</p>
    </PaginaTexto>
  )
}
