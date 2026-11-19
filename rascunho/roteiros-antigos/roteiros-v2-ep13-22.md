# Roteiros v2 (60s+) EP13–22 — SUBSTITUÍDOS

```
ROTEIROS v2 · Manual Zomboid · EPs 13–22 · BUILD 42.22 (17: 42.20.4)
Estrutura: GANCHO → BASE (como o sistema funciona) → EXEMPLO prático → armadilhas/regras → FECHO. Duração definida pela explicação (ver regras).

REGRAS DE EDIÇÃO IMERSIVA (valem para todos):
- Telas simuladas do jogo (criação, painel de saúde, receita, menu lateral, termômetro) com ícones e sons de UI originais.
- Números sempre animados (contador rolando, barra enchendo), nunca texto parado.
- Troca visual a cada 2–3 s: 3D ↔ tela simulada ↔ close no ícone.
- Todo conceito: primeiro a base, depois o exemplo. Nada de lista solta.
- Número só com fonte confirmada. Sem número confirmado: falar de forma qualitativa ('um pouco', 'mais devagar'). Nunca número inventado ou 'aproximado'.
- Duração = o necessário para o leigo entender. Pode arredondar levemente para fechar 60 s; nunca encher nem cortar por meta.

======================================================================
VÍDEO 13 · TRAÇOS E PROFISSÕES
Ideia: A tela de criação é uma conta de pontos. Ensinar a conta, montar um build ao vivo, mostrar as armadilhas.
174 palavras · ~81 s estimados

 1. [GANCHO] Seu personagem pode morrer antes do jogo começar. Na tela de criação.
    VISUAL: 3D: personagem cercado → corte seco para TELA DE CRIAÇÃO SIMULADA (layout do jogo, ícones reais)
 2. [BASE] Funciona como uma conta. A profissão custa ou dá pontos. Depois vêm os traços: qualidade custa ponto, defeito devolve.
    VISUAL: Tela: coluna Profissão + coluna Traços; contador de SALDO no canto; setas − (vermelho) / + (verde)
 3. [BASE] E o saldo final não pode ficar negativo. Se ficar, o botão de jogar trava.
    VISUAL: Contador fica vermelho; botão JOGAR acinzenta com cadeado (shake)
 4. [EXEMPLO] Vamos montar um. Lenhador custa zero e já começa com machado nível dois. Saldo: zero.
    VISUAL: Clique simulado em Lenhador; card do machado + barra Machado 2; contador 0. Corte 3D: machado de bombeiro na mão
 5. [EXEMPLO] Quero Aprende Rápido: menos seis. O saldo ficou negativo, o botão travou.
    VISUAL: Contador rola 0 → −6 (vermelho), JOGAR trava
 6. [EXEMPLO] Pra pagar, pego três defeitos baratos: Sede Alta, Leitura Lenta e Estômago Fraco, mais dois cada. Saldo zero: dá pra jogar.
    VISUAL: Cada traço entra com 'pop' + som de UI; contador −6 → −4 → −2 → 0; JOGAR acende verde
 7. [ARMADILHA] O erro clássico é o defeito que devolve muito. Surdo dá doze, mas você não ouve zumbi chegando. Desorganizado dá seis, e sua mochila carrega menos.
    VISUAL: Contador +12 tentador → corte 3D: zumbi chegando pelas costas sem som (áudio abafado); mochila com slots riscados
 8. [REGRA] E tem traço que não combina: Atlético com Fumante, e Forte com Robusto, que são níveis da mesma força.
    VISUAL: Dois cards se chocam e ficam cinza com X
 9. [NOVIDADE] E na quarenta e dois ponto vinte e dois, o Ladrão força porta e janela com pé de cabra com mais sucesso e menos barulho.
    VISUAL: Selo 'NOVO 42.22' + pé de cabra do jogo; 3D porta forçada
10. [FECHO] Monta o seu com saldo zero e manda nos comentários.
    VISUAL: Tela final com saldo 0 e JOGAR verde; CTA

======================================================================
VÍDEO 14 · COZINHAR
Ideia: Responder 3 perguntas na ordem: onde cozinhar, o que precisa ir ao fogo, como não perder a comida. Exemplo: um ensopado do zero.
135 palavras · ~63 s estimados

 1. [GANCHO] Você achou comida. Agora não estraga ela no fogo.
    VISUAL: 3D: mesa com itens do jogo; fumaça preta no corte
 2. [BASE · ONDE] Primeiro, onde cozinhar. Fogão elétrico e micro-ondas precisam de energia, e a luz da cidade cai cedo.
    VISUAL: Ícone de raio pisca e apaga; casa 3D escurece
 3. [BASE · ONDE] Sem luz, sobra fogo de verdade: fogueira, lareira ou churrasqueira.
    VISUAL: 3 cards com ícone do jogo, ✓ verde
 4. [BASE · O QUÊ] Depois, o que vai pro fogo. Carne crua pode te deixar doente. Carne sempre cozinha antes de comer.
    VISUAL: Bife cru → ícone de doença; seta → bife cozido ✓
 5. [EXEMPLO] Vamos fazer um ensopado. Panela com água no fogo. Você pode juntar até seis ingredientes: carne, batata, cebola, cenoura. Tudo vira um prato só.
    VISUAL: TELA DE RECEITA SIMULADA: slots 0/6 → 4/6 com cada item caindo; vira ícone Ensopado
 6. [EXEMPLO] Mas fica de olho: esqueceu no fogo, queima. E comida queimada não serve nem como ingrediente.
    VISUAL: Barra de cozimento simulada passa de 'cozido' para 'queimado'; carimbo QUEIMOU
 7. [REGRA] Comida podre? Só entra em receita com Culinária sete.
    VISUAL: Ícone podre + barra de habilidade Culinária 7
 8. [ÁGUA] E água de rio e de lago vem contaminada. Enche a panela, ferve, e aí bebe.
    VISUAL: 3D rio → panela no fogo; selo CONTAMINADA vira FERVIDA ✓
 9. [FECHO] Cozinhar bem é viver mais. Salva esse vídeo e comenta qual receita você quer ver.
    VISUAL: Prato final; CTA salvar

======================================================================
VÍDEO 15 · MEDICINA
Ideia: Separar as duas infecções (o leigo confunde) e ensinar a ler o painel de saúde: o tipo da ferida diz o tratamento. Exemplo: cortou o braço na janela.
176 palavras · ~82 s estimados

 1. [GANCHO] Arranhão de zumbi raramente te mata. O curativo sujo, sim.
    VISUAL: 3D: arranhão no braço → zoom no curativo encardido
 2. [BASE · INFECÇÕES] Primeiro, existem duas infecções. A zumbi vem do ataque: arranhão tem sete por cento de chance, corte vinte e cinco, e mordida é cem por cento. Essa não tem cura.
    VISUAL: Três cartas com % animando (7 / 25 / 100); a 100% fica vermelha com caveira
 3. [BASE · INFECÇÕES] A outra é a infecção da ferida, que vem da sujeira. Essa você evita e trata.
    VISUAL: Split-screen: ZUMBI (sem cura) × FERIDA (tratável)
 4. [BASE · PAINEL] Toda ferida aparece no painel de saúde, e o tipo diz o que fazer.
    VISUAL: PAINEL DE SAÚDE SIMULADO: silhueta do corpo com parte destacada
 5. [TABELA] Arranhão, corte e queimadura: desinfeta e enfaixa. Ferimento profundo: costura com agulha e linha, e enfaixa. Fratura: tala com tira de pano e tábua ou galho.
    VISUAL: Cada tipo entra como linha da 'tabela' com ícones do jogo
 6. [EXEMPLO] Exemplo: você pulou a janela quebrada sem tirar o vidro, e cortou o braço. No painel aparece vidro na ferida. Tira com a pinça primeiro, senão continua sangrando. Depois desinfeta e enfaixa.
    VISUAL: 3D pulando a janela → painel com ícone de vidro → pinça → álcool → bandagem (passo 1-2-3)
 7. [EXEMPLO] Bala é igual: pinça, desinfeta e enfaixa. Se ficou fundo, costura.
    VISUAL: Mesma sequência trocando o ícone
 8. [CUIDADO] Todo curativo suja com o tempo, e curativo sujo infecciona a ferida. Troca, ou lava e reaproveita.
    VISUAL: Bandagem escurecendo em timelapse; troca
 9. [CUIDADO] Se infeccionar, antibiótico cura. Mas só a infecção da ferida.
    VISUAL: Antibiótico ✓ ferida; ✗ zumbi
10. [FECHO] Mordida, ninguém cura. O resto, você resolve. Salva esse vídeo.
    VISUAL: Carimbo SEM CURA; CTA

======================================================================
VÍDEO 16 · ANIMAIS
Ideia: Um animal precisa de 3 coisas: comida, água e calma. Explicar cada uma e montar um galinheiro como exemplo.
163 palavras · ~76 s estimados

 1. [GANCHO] A versão quarenta e dois trouxe animais de fazenda. E eles morrem fácil.
    VISUAL: 3D cercado; galinha cai de lado
 2. [ONDE] Você acha vaca, ovelha e galinha em fazendas e celeiros, longe da cidade. Pra levar perto, amarra na corda. Pra longe, usa o reboque de animais no carro.
    VISUAL: Mapa simulado: cidade × zona rural com pin; corda 3D; ícone de reboque
 3. [BASE] Animal vivo precisa de três coisas: comida, água e calma.
    VISUAL: 3 barras simuladas sobre o animal: COMIDA / ÁGUA / CALMA
 4. [BASE · COMIDA E ÁGUA] Cocho guarda comida ou água, nunca os dois. Então cada cercado precisa de dois. Sem comida ou água, ele perde vida até morrer.
    VISUAL: Dois cochos com ícones; barras caindo → vida caindo
 5. [BASE · CALMA] Calma é o estresse. Zumbi não ataca animal, mas zumbi por perto estressa. Tiro, grito e gente correndo também. E animal estressado foge.
    VISUAL: Barra ESTRESSE sobe a cada evento (zumbi, tiro, corrida); animal correndo
 6. [EXEMPLO] Exemplo: um galinheiro. Galinhas, um galo e dois cochos. Elas botam ovo. E um galo só já basta pra várias galinhas.
    VISUAL: Montagem do galinheiro passo a passo; ovos aparecendo; galo + '1 = várias'
 7. [REGRA] Vaca e ovelha são diferentes: leite só aparece depois que a fêmea emprenha. Sem macho, sem leite. A ovelha também dá lã.
    VISUAL: Balde de leite com cadeado → abre com 'prenha'; ícone de lã
 8. [BÔNUS] E fazer carinho acalma o animal e ainda tira a sua tristeza.
    VISUAL: Corações; barra de tristeza do jogador desce
 9. [FECHO] Comida, água e calma. Fazenda bem cuidada é comida pra sempre.
    VISUAL: 3 barras cheias; CTA

======================================================================
VÍDEO 17 · BARRICADAS
Ideia: Barricada = vida extra da janela. Mostrar a barra de vida e fazer a conta com tábuas e metal.
151 palavras · ~70 s estimados

 1. [GANCHO] Sua janela é a porta de entrada da horda.
    VISUAL: 3D horda chegando na janela
 2. [BASE] Barricada funciona como vida extra. O zumbi bate, a vida cai, e quando zera, ele entra.
    VISUAL: BARRA DE VIDA DA JANELA simulada caindo a cada batida; zera → vidro estoura
 3. [MATERIAL] Pra barricar com tábua: martelo, tábua e dois pregos por tábua. Marreta não serve. E caixa de pregos fechada não conta: abre antes.
    VISUAL: Ícones do jogo; marreta ✗; caixa fechada ✗ → pregos soltos ✓
 4. [NÚMEROS] Cada tábua aguenta mil. E você põe até quatro de cada lado, dentro e fora.
    VISUAL: Tábua = 1.000; contador de tábuas 1-4 por lado
 5. [EXEMPLO] Faz a conta: quatro tábuas por dentro, quatro mil. Fechou por fora também? Oito mil.
    VISUAL: Barra da janela crescendo 0 → 4.000 → 8.000 com números rolando
 6. [METAL] Chapa de metal aguenta cinco mil sozinha, mas precisa ser soldada, com maçarico e máscara de solda. Barras de metal aguentam três mil e deixam ver lá fora. Só que o zumbi também te vê.
    VISUAL: Comparativo em colunas (tábua / chapa / barras); olhos dos dois lados das barras
 7. [LUZ] À noite, fecha a cortina. Tábua deixa a luz da casa vazar. Chapa de metal, não.
    VISUAL: Casa 3D à noite: luz vazando entre tábuas; cortina fecha
 8. [SAÍDA] E sempre deixa uma saída: corda de lençol presa com prego na janela do segundo andar.
    VISUAL: Corda descendo da janela de cima
 9. [FECHO] Base fechada sem saída é caixão.
    VISUAL: Carimbo; CTA

======================================================================
VÍDEO 18 · FRIO E CALOR
Ideia: O jogo tem dois termômetros: clima e corpo. Explicar o do corpo com um termômetro na tela e dar o exemplo do casaco molhado.
141 palavras · ~66 s estimados

 1. [GANCHO] Frio e calor derrubam seu personagem sem zumbi nenhum.
    VISUAL: 3D neve; personagem curvado
 2. [BASE] O jogo tem dois termômetros: o do clima e o do seu corpo. E quem decide se você fica bem é o do corpo.
    VISUAL: Dois TERMÔMETROS SIMULADOS lado a lado (sem escala numérica); o do corpo ganha destaque
 3. [BASE] A roupa decide quanto o clima mexe nele.
    VISUAL: Roupa como 'escudo' entre os termômetros
 4. [FRIO] Quando o corpo esfria, primeiro suas feridas param de sarar sozinhas. Depois, você luta e corre mais devagar.
    VISUAL: Termômetro do corpo descendo por faixas de cor; ícone do efeito em cada faixa
 5. [FRIO] Se continuar esfriando, vem a hipotermia: quase sem força pra lutar, e sem correr.
    VISUAL: Faixa vermelha; tela gela (filtro azul/vinheta)
 6. [CALOR] O calor também cobra. Primeiro, mais sede e mais cansaço. No extremo, hipertermia: mesmo castigo, e você começa a perder vida.
    VISUAL: Termômetro subindo por faixas; filtro quente; barra de vida caindo
 7. [EXEMPLO] Exemplo: inverno, você sai na chuva de casaco. A roupa molha, e roupa molhada gela o corpo. Volta, troca por roupa seca e veste em camadas.
    VISUAL: 3D chuva → ícone de roupa molhada → termômetro despencando → troca → camadas sobem o termômetro
 8. [VERÃO] No verão, o contrário: tira o casaco e bebe água.
    VISUAL: Casaco sai; garrafa de água
 9. [FECHO] Antes de sair, olha o clima e se veste pra ele.
    VISUAL: CTA

======================================================================
VÍDEO 19 · LIVROS DE HABILIDADE
Ideia: Livro é multiplicador, não nível. Mostrar a conta com um exemplo numérico de Carpintaria.
164 palavras · ~76 s estimados

 1. [GANCHO] Livro de habilidade não te dá nível nenhum.
    VISUAL: Livro abre; barra de nível não mexe (som de erro)
 2. [BASE] Ele multiplica a experiência que você ganha praticando. Sem prática, o livro não faz nada.
    VISUAL: Fórmula na tela: PRÁTICA × LIVRO
 3. [BASE] Cada habilidade tem cinco volumes. O volume um vale do nível zero ao dois, o dois do dois ao quatro, e assim vai até o dez.
    VISUAL: Régua 0-10 dividida em 5 faixas com os 5 livros
 4. [BASE] E o bônus cresce: três vezes no volume um, depois cinco, oito, doze, e dezesseis no volume cinco. Mira, Lâmina Longa e Recarga rendem a metade.
    VISUAL: Multiplicadores sobem em cada faixa; nota ½ para as 3
 5. [EXEMPLO] Exemplo: Carpintaria nível zero. Sem livro, serrar uma tábua te dá um pouco de experiência. Leu o volume um? A mesma tábua rende três vezes mais, até o nível dois.
    VISUAL: 3D serrando; barra de experiência enchendo devagar → com ×3 batendo, enche 3× mais rápido (sem número de XP)
 6. [REGRAS] Leu metade das páginas? Ganha metade do bônus. Pulou volume? Livro muito acima do seu nível falha, e a leitura zera.
    VISUAL: Barra de páginas 50% → ×1,5; livro vol 4 com X
 7. [VELOCIDADE] Pra ler mais rápido: sentado e de óculos de leitura. Leitura Rápida acelera trinta por cento; Leitura Lenta atrasa trinta.
    VISUAL: Cronômetro de leitura encolhendo/crescendo
 8. [DÚVIDA COMUM] E depois de lido, o bônus fica com você. Não precisa carregar o livro.
    VISUAL: Livro sai da mochila; ×3 continua na barra
 9. [FECHO] Lê antes, pratica depois.
    VISUAL: CTA

======================================================================
VÍDEO 20 · SONO
Ideia: Fôlego × cansaço (o leigo confunde), onde dormir e o que impede dormir. Exemplo: uma noite com dor e pânico.
144 palavras · ~67 s estimados

 1. [GANCHO] Dormir mal te mata devagar.
    VISUAL: 3D personagem cambaleando; tela borrando
 2. [BASE] O cansaço sobe o dia inteiro, e vai piorando até Ridiculamente Cansado. Cansado, você erra mais.
    VISUAL: Ícone de status do jogo subindo de nível; golpes errando
 3. [BASE] Sentar e descansar só recupera o fôlego, aquele de correr e lutar. Cansaço, só dormindo.
    VISUAL: DUAS BARRAS SIMULADAS: FÔLEGO enche sentado, CANSAÇO não mexe; dormindo zera
 4. [ONDE] E onde você dorme muda tudo. Cama boa recupera rápido: menos horas dormindo. Banco de carro ou chão: dorme muito mais, e acorda com dor no pescoço.
    VISUAL: Relógio comparando horas: cama × carro × chão; ícone de dor no pescoço
 5. [BLOQUEIOS] Às vezes o jogo nem deixa dormir: zumbi por perto, pânico ou dor forte.
    VISUAL: Botão DORMIR cinza com tooltip simulado
 6. [NOVIDADE] E na quarenta e dois ponto vinte e dois, mau cheiro também bloqueia: fumaça ou cheiro de cadáver por perto.
    VISUAL: Selo NOVO 42.22; ícone de mau cheiro
 7. [EXEMPLO] Exemplo: noite, você está com dor e com medo. Toma analgésico pra dor. Se o pânico ainda não deixa, remédio pra dormir, em dose alta, resolve.
    VISUAL: Passo 1: analgésico → dor some; passo 2: remédio → botão DORMIR libera
 8. [CAFÉ] Café só compra um tempinho. Não substitui a cama.
    VISUAL: Barra de cansaço desce um pouco e volta
 9. [FECHO] Achou uma cama boa, longe de cadáver? Ali é a sua base.
    VISUAL: CTA

======================================================================
VÍDEO 21 · FORRAGEAMENTO
Ideia: O item do mato só aparece no modo de busca, dentro de um círculo. Explicar o círculo e o que o encolhe; exemplo dia × noite.
147 palavras · ~68 s estimados

 1. [GANCHO] O mato tem comida. Você só não está vendo.
    VISUAL: 3D mato vazio → itens 'piscam' por um frame
 2. [BASE] Item do mato não aparece sozinho. Você liga o modo de busca: clica na luneta, no menu da esquerda.
    VISUAL: UI SIMULADA do menu lateral com a luneta; clique
 3. [BASE] Os itens aparecem no chão, dentro de um círculo ao seu redor. Esse círculo começa com três quadrados do chão e chega a dez com Forrageamento no máximo.
    VISUAL: Círculo no chão 3D crescendo 3 → 10; grade de quadrados
 4. [O QUE ENCOLHE] E muita coisa encolhe ele: chuva, neblina, escuro, cansaço e pânico. Correndo, você quase não acha nada. Agachado, acha mais.
    VISUAL: Círculo encolhendo a cada ícone; correndo = mínimo
 5. [EXEMPLO] Exemplo: dia de sol, descansado e agachado: círculo grande. Noite de chuva e cansado: o círculo encolhe muito.
    VISUAL: Split-screen dia × noite com os dois círculos
 6. [O QUE ACHA] Desde o começo dá pra achar galho, pedra e frutinha.
    VISUAL: Ícones do jogo saltando do chão
 7. [VENENO] Mas cuidado: frutinha e cogumelo podem vir envenenados, mesmo iguais a um que você já comeu. Com o traço Herbalista, ou a revista certa, você reconhece o veneno.
    VISUAL: Duas frutinhas iguais, uma ganha caveira; Herbalista revela
 8. [INVERNO] No inverno, a neve esconde a comida.
    VISUAL: Neve cobrindo os ícones
 9. [FECHO] Anda devagar, de dia, e olha o chão.
    VISUAL: CTA

======================================================================
VÍDEO 22 · FADIGA MUSCULAR
Ideia: Cada parte do corpo tem sua própria 'barra' de tensão. Exemplo: 10 zumbis só no machado × alternando golpe e pisão.
145 palavras · ~67 s estimados

 1. [GANCHO] Na versão quarenta e dois, seu braço cansa de bater.
    VISUAL: 3D golpe ficando lento
 2. [BASE] É a fadiga muscular. Cada parte do corpo acumula tensão separado: braço quando você bate, perna quando corre, costas quando carrega peso demais. E cama ruim pega o pescoço.
    VISUAL: SILHUETA DO CORPO SIMULADA com barras por parte acendendo
 3. [EFEITO] Tensão alta deixa você mais lento e dá dor.
    VISUAL: Barra do braço vermelha; ataque em câmera lenta
 4. [ARMA] Arma longa e pesada cansa mais o braço. Curta e leve, menos.
    VISUAL: Machado × taco com barras de enchimento diferentes
 5. [EXEMPLO] Exemplo: dez zumbis, e você só no machado. Golpe atrás de golpe, a barra do braço enche, o ataque fica lento, e o último te pega.
    VISUAL: Contador 10 → 1; barra do braço enchendo; último zumbi agarra
 6. [O CERTO] Agora o certo: derrubou, em vez de outro golpe, pisa. Pisar usa a perna e divide o esforço. E puxa poucos zumbis por vez.
    VISUAL: Mesmo fight: barras de braço e perna dividindo; grupos de 2-3
 7. [ANALGÉSICO] Analgésico alivia a dor, mas não devolve a velocidade. E a tensão continua subindo.
    VISUAL: Dor some, barra continua subindo
 8. [LONGO PRAZO] Força alta e prática com a arma fazem a tensão subir mais devagar.
    VISUAL: Barras de Força/arma subindo; enchimento mais lento
 9. [FECHO] Descansa pra passar. Lutar cansado é morrer cansado.
    VISUAL: CTA
```
