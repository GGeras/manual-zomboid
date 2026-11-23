import type { Metadata } from 'next'
import { PaginaTexto } from '@/componentes/pagina-texto'

export const metadata: Metadata = { title: 'Regras da Comunidade', description: 'As regras da Comunidade Manual Zomboid: curtas, claras e pensadas para todo mundo sobreviver junto.' }

export default function Regras() {
  return (
    <PaginaTexto rotulo="Comunidade" titulo="Regras de" destaque="sobrevivência" rascunho>
      <p>A Comunidade é para quem joga Project Zomboid trocar ideia em português. Poucas regras, levadas a sério.</p>
      <h2>1. Respeito</h2>
      <ul><li>Zoeira sim, ofensa não. Nada de xingamento, preconceito, assédio ou ameaça.</li><li>Critique a ideia, não a pessoa. Todo mundo já morreu no dia 1.</li></ul>
      <h2>2. Poste no lugar certo</h2>
      <ul><li>Escolha a categoria que combina. Pergunta vai em Dúvida; história de morte em Como morri.</li><li>Título que diz do que se trata. &quot;Ajuda&quot; não diz nada.</li><li>Resolveu sua dúvida? Marque a melhor resposta: ajuda quem chegar depois.</li></ul>
      <h2>3. Nada de spam</h2>
      <ul><li>Sem propaganda, link repetido ou divulgação fora de contexto.</li><li>Contas novas só postam links depois do primeiro dia.</li></ul>
      <h2>4. Imagens</h2>
      <ul><li>Prints e fotos do jogo: à vontade. Descreva a imagem quando subir (o site sugere um texto).</li><li>Arte ou print de outra pessoa: só com crédito e permissão.</li><li>Nada de conteúdo adulto, violento fora do jogo, ilegal, ou dados pessoais (seus ou de outros).</li></ul>
      <h2>5. Fatos do jogo</h2>
      <p>O que se posta aqui é da comunidade, <strong>não verificado pelo canal</strong>. Os fatos conferidos no arquivo do jogo ficam nos <a href="/guias">Guias</a>. Viu informação errada? Responda com a fonte. Errar não é crime; espalhar mentira de propósito é.</p>
      <h2>6. Moderação</h2>
      <ul><li>Use o botão <strong>Denunciar</strong>. Com 3 denúncias o post fica escondido até um moderador ver.</li><li>Moderadores podem esconder, travar, fixar e suspender. Toda ação fica registrada.</li><li>Discordou de uma decisão? Fale com a moderação no Discord.</li></ul>
    </PaginaTexto>
  )
}
