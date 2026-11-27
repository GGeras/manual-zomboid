# Regras de roteiro e pipeline — formato v4 (a partir do EP13, definido em 18/11/2026)

Vale para todo vídeo novo. Em conflito com docs antigos, este manda no ROTEIRO e na EDIÇÃO.

## 0. REGRA NOVA (18/11, bronca do Jose) — NÃO perguntar wiki ao Jose
- "Ou você sabe e confirma, ou não faz." Claude é o responsável pelos fatos.
- Ordem de fonte (B42.22):
  1. **Arquivos do jogo do Jose** (`media`):
     - `scripts/generated/*`: números (custos, armas, receitas).
     - `lua/shared/Translate/PTBR/*.json`: NOMES em PT-BR (moodles, habilidades, menu, saúde, profissões, traços) e textos de ajuda do jogo.
  2. Web de build 42.20+ (projectzomboid.wiki, pzfans com build no título). Fontes em conflito = não afirmar.
  3. Sem confirmação = a frase SAI do roteiro (não vira pergunta).
- Nomes PT-BR confirmados no jogo (usar estes):
  - Coleta (não "Forrageamento").
  - Distensão Muscular / Leve (painel de saúde).
  - Cansaço Absurdo (nível 4 de sono; níveis: Sonolência, Cansaço, Cansaço Intenso, Cansaço Absurdo).
  - Mau Cheiro · Nervosismo (moodle de pânico) · Triste (infelicidade) · Mal-estar (doente).
  - Barricar (Tábuas / Chapa de Metal / Barras de Metal) · Durabilidade da Barricada.
  - Acariciar (animal) · Herbalista.
  - Pontaria · Recarga · Machados · Força · Culinária.
  - Profissão Personalizada (= antigo Desempregado) · Pontos Disponíveis.
- Custos da criação (character_professions.txt / character_traits.txt):
  - Profissões: Profissão Personalizada +8 (sem bônus), Veterano −8 (Pontaria 2, Recarga 2), Lenhador 0 (Machados 2, Força 1, Manutenção 1)…
  - Traços: Atlético 10, Fumante devolve 3, Surdo 12 etc.
  - O próprio jogo: "positivos e negativos devem ser equilibrados".
- Nunca chamar profissão de "de graça": custo 0 = abre mão dos 8 da Profissão Personalizada.

## 1. Informação
- Versão mais recente primeiro (hoje 42.22). Valor de versão anterior só com selo dizendo isso.
- Só informação com fonte válida. Fonte antiga (B41) ou duvidosa: ignorar.
- **Número só com fonte confirmada.**
  - Sem número confirmado: NÃO falar número; abordar de forma qualitativa.
  - Proibido número inventado, "ilustrativo" ou "aproximado" na fala ou na tela.
- Não precisa ser científico: o objetivo é o leigo entender e agir.
- Todo fato vai para `pipeline/fatos.json`, com build e fonte por fato.

## 2. Estrutura do roteiro
- Um tema central por vídeo, com uma ideia-guia.
- Ordem: **GANCHO → BASE (como o sistema funciona) → EXEMPLO prático → armadilhas/regras → FECHO/CTA**.
- A BASE tem que ser entendida por quem nunca jogou: uma ideia por frase, com o número na tela no mesmo momento.
- Linguagem de leigo: todo termo do jogo é explicado na primeira vez.
- Sem pontas soltas: se cita um efeito, diz a consequência.

## 3. Duração
- Quem manda é a necessidade de explicação, nunca uma meta de tempo.
- Perto de 60 s pode arredondar para 60 s.

## 4. Edição imersiva
- Telas simuladas do jogo, números e barras animados, splits, punch-ins; troca visual a cada 2–3 s.
- Número na tela só se confirmado. Sem número: barras sem escala (ex.: EP17 = barra de vida das barricadas comparando, sem valores).
- Animação: se a ação 3D fica duvidosa, preferir tela simulada/ícone a uma animação ruim.

## 4.2 REGRA DO CENÁRIO, DOS MODAIS E DA ANIMAÇÃO (20/11, revisão do Jose dos EP16–19)
Revisão completa: `canal/processo/revisoes/2026-11-20-ep16-19.md`. Vale para todo vídeo novo.
- **Lugar nunca vazio.** Casa tem móveis, eletrodomésticos e plantas; rua tem casas, árvores, grama, calçada e postes; fazenda tem
  cercados, feno e cocho. Tudo com os **sprites originais do jogo** (`projeto/tiles.js` + `projeto/cenarios.js`, pasta `assets/tiles`).
  - Prontos para usar: `rua(x, z, 'verao'|'inverno'|'chuva')`, `fazenda()`, `casaDentro()`, `sobrado()`.
  - Um lugar por vídeo sempre que der (mesmo lugar do começo ao fim, como pediu o EP19).
- **Clima de verdade.** Frio = neve no chão, neve caindo e bordas geladas (`neve()`, `clima('gelo')`); calor = sol forte de verão
  (`clima('sol')`); chuva = poças no chão (`pocas()`, `chuvaChao()`).
- **Modal nunca cobre o personagem nem a animação.** O personagem fica na faixa de baixo (`camOn(c, x, z, h, .74)`) e os modais na
  faixa de cima (até y ≈ 1260). A inspeção avisa `MODAL COBRINDO O PERSONAGEM`.
- **Modal harmônico:** caixa do tamanho do conteúdo, centrada, elementos grandes, sem sobra de espaço vazio (ex.: "Como levar" do EP16,
  "Clique direito na janela" do EP17).
- **Personagem não afunda no chão** (sentado, em pé, ajoelhado). Sentar só em cadeira do jogo com a animação original
  (Bob_SatChairIn / Bob_SatChair). A inspeção avisa `PERSONAGEM AFUNDANDO NO CHÃO`.
- **Animações originais do jogo** (`pipeline/pz/add_clips.py`, lista em `pipeline/pz/lista.json`): andar, martelar, ler, sentar,
  acariciar, ordenhar, tosquiar, tremer de frio, enxugar o suor, beber, gritar, descer corda; zumbi entrando pela janela (espreme, cai,
  levanta) e batendo. Andar sempre com deslocamento real (`rota()`), nunca "andando no lugar".
  - Item na mão = malha do jogo presa no osso de item (`PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hammer', 'hammer'))`).
  - Sempre conferir a qualidade da animação do personagem principal na folha da inspeção.
- **Texto nunca vaza da caixa** e **rótulo sem quebra de linha** (item, cartão, chip): padronizar o tamanho dos elementos; se não cabe,
  aumentar a caixa de todos ou encurtar o texto. A inspeção avisa `TEXTO VAZANDO DA CAIXA` e `QUEBRA DE LINHA NO RÓTULO`.
- **Sentar em cadeira:** `C.assento(sprite, i, j, { encosto: 'N'|'W' })` (assento baixo + encosto fino), nunca `C.obj`.
- **Sons do jogo B42** extraídos do `ZomboidSound.bank` (pasta `assets/sfx/Jogo B42`): grito "Hey!" do jogador, animais estressados,
  cerca batendo, barricada (tábua/metal), corda de lençol, leitura etc.
- **Fidelidade:** barricadas, cortinas, corda de lençol e móveis são os sprites do jogo, na posição do jogo. A saída de emergência só
  funciona do 2º andar para cima, em janela sem barricada, descendo pela corda.

## 4.3 REVISÃO FINAL: HARMONIA DA TELA E ÁREAS DOS APPS (22/11, pedido do Bruno) — vale para TODO vídeo novo
Antes de qualquer render (rascunho ou final), o vídeo passa por esta revisão. `node pipeline/inspect.mjs NN` confere sozinho e o relatório TEM de sair com 0 avisos.

**A. Nada importante embaixo da interface do TikTok / Reels / Shorts (tela 1080×1920)**
- Direita (curtir, comentar, salvar, compartilhar, disco): x > 940 e y entre 860 e 1720 → nenhum texto, modal, ícone, barra ou moodle ali.
- Base (@canal, descrição, música, barra de navegação): y > 1560 → nenhum elemento de texto, e o **personagem inteiro (até os pés) acima de 1580**.
- Topo (abas "Seguindo / Para você", busca): y < 190 → só a etiqueta pequena do canal, nada que precise ser lido.
- Área segura para o conteúdo = x 40–1040, y 190–1560 (é a moldura verde da folha `zonas.png`).
- Personagem nunca embaixo dos botões da direita. Câmera padrão dos episódios novos: personagem um pouco mais alto (`camOn(..., sy ≈ .67–.70)`), não .74.

**B. Harmonia (tamanho, posição, espaçamento)**
- Respiro mínimo de 40 px até a borda da tela (moodle lateral, rótulos, cartões, tags).
- Bloco largo (> 300 px) que é centralizado fica **exatamente** no centro (folga máx. 14 px). Nada "quase centralizado".
- Itens da mesma linha (cartões, ícones de item) com o mesmo tamanho e o mesmo espaçamento entre si.
- Blocos empilhados com pelo menos 12 px de respiro (nada colado). Modal largo: no máximo 800 px (x 140–940).
- Texto cabe na caixa e em UMA linha (diminui a fonte ou encurta o texto; nunca quebra de linha em rótulo, tag, moodle lateral ou fala).
- Modal nunca cobre o personagem (cabeça incluída): se a tela simulada é grande, ela sobe/encolhe ou a câmera abre.
- Só vale o elemento parado: animação de entrada (escala/opacidade) não conta, mas o estado final tem de estar certo.

**C. Conferência no olho**: abrir `inspecao/zonas.png` (meio de cada cena com os textos e as áreas dos apps pintadas de vermelho) e `inspecao/folha.png` (ações). Se algo importante encosta no vermelho, mexe antes de renderizar.

## 4.4 DIREÇÃO DOS ELEMENTOS (SPRITES E PROPS) — frente, lado, costas (22/11, pedido do Bruno) — vale para TODO cenário
No jogo cada móvel, cortina, tábua e janela tem um desenho para cada direção. Usar o desenho errado deixa o fogão de lado, a cortina atravessada na janela, o móvel no meio da sala. Antes de qualquer rascunho:
- **Móvel que encosta** (fogão, geladeira, bancada, pia, estante, cômoda) fica **colado na parede** e com as **costas para a parede**: na parede N (fundo à direita) usa o desenho com **frente S**; na parede W (fundo à esquerda) o de **frente E**. Linha j = 0 encosta na parede N; coluna i = 0 encosta na parede W.
- **Nenhum móvel de frente para a parede**. Cadeira virada para a mesa; poltrona virada para o cômodo.
- **Cortina, tábua, chapa, barras**: o desenho tem de ser o da **mesma borda** da janela (parede N → desenho da borda N; parede W → borda W). Cortina da janela N: fechada `_26` (azul) / `_10` (branca); aberta `_30` / `_14`.
- **Janela livre**: nada na frente da janela por onde o zumbi entra ou por onde o personagem trabalha.
- **Itens na mão / no corpo** (martelo, maçarico, máscara, garrafa): conferir na `folha.png` que estão virados certo (cabeça do martelo para a frente, máscara no rosto), nunca de costas.
- A tabela `projeto/assets/tiles/orient.js` diz a direção de cada desenho (conferido olhando os 4 desenhos do jogo). Sprite novo entra na tabela antes de ser usado.
- `inspect.mjs` confere sozinho (aviso **DIREÇÃO DO SPRITE**: móvel solto/virado errado, de frente para a parede, cortina/tábua com desenho de outra borda). Relatório tem de dar 0 avisos.

## 4.5 ILUMINAÇÃO DE ACORDO COM O AMBIENTE (23/11, pedido do Bruno) — vale para TODO vídeo novo
A luz é o que faz parecer o jogo e dá imersão. Luz chapada (tudo com a mesma claridade) parece maquete.
- **Cada episódio declara o ambiente** em `epNN.cfg.js`: `window.EP.luz = { padrao: 'interior-tarde', 3: 'exterior-dia' }` (padrão + exceção por cena). Ambientes: `exterior-dia`, `interior-dia`, `interior-tarde`, `interior-noite`, `exterior-noite`, `chuva`.
- **Interior tem fonte de luz visível**: facho de sol entrando pela janela (com poeira no ar) e/ou abajur/luminária acesa com poça de luz no chão e brilho na parede (`luzInterior()` em `cenarios.js`). Cantos mais escuros que o centro (vinheta leve).
- **Tarde = luz quente** (laranja/âmbar); **noite = fria e baixa**, só a fonte acesa ilumina; **dia lá fora = claro e com sombra dura**; **chuva = acinzentado, sem sombra dura**.
- **Personagem sempre legível**: nunca escuro demais nem estourado; se a cena é escura, ele fica perto da fonte de luz.
- **Nada estourado**: no máximo um brilho pequeno (sol, lâmpada); paredes e chão nunca viram branco puro.
- `inspect.mjs` mede a tela em 2 momentos de cada cena e compara com o ambiente declarado (avisos **LUZ ESCURA/CLARA DEMAIS**, **LUZ CHAPADA**, **LUZ ESTOURADA**, **PERSONAGEM ESCURO DEMAIS**). Relatório tem de dar 0 avisos.

## 4.6 PERSONAGEM NUNCA ATRAVESSA MÓVEL NEM TELEPORTA; CASA COM SENTIDO (23/11, pedido do Bruno — EP19 00:19 atravessava a cadeira)
- **Sentar**: anda até a **frente** do assento, vira de costas e senta **recuando** para dentro (`s_satchairin`), só depois fica sentado. Nunca aparece já sentado dentro do móvel. Use `C.assento()` (assento + encosto como caixas de colisão).
- **Andar**: caminho contorna os móveis; entre duas ações em lugares diferentes (serrar → pregar) ele **anda** até lá. Nunca teleporta.
- **Ajoelhado / agachado**: a ponta do pé não entra no piso.
- **Casa com sentido**: cada cômodo tem função clara e os móveis do lugar (sala = poltrona de leitura + abajur + mesinha + estante; oficina = bancada + ferramentas); acabamento de construção (rodapé, batente e porta, quadros, relógio, cortina) e luz de acordo com a 4.5. Móveis seguem a 4.4.
- `inspect.mjs` confere sozinho: **PERSONAGEM ATRAVESSANDO MÓVEL** (corpo dentro da caixa de um móvel), **AFUNDANDO NO CHÃO** (pé abaixo do piso, medida absoluta). Grava `inspecao/sonda.json` (posição do personagem na tela em cada momento) para achar o motivo de um aviso. Relatório tem de dar 0 avisos.

## 4.8 JANELA EM TODO BURACO DE PAREDE (25/11, pedido do Jose)
Todo vão aberto na parede de uma casa recebe **janela com caixilho + cortina** (sprites `fixtures_windows_01_16/17` + `fixtures_windows_curtains_01_28/30`). Parede com buraco vazio é erro de ambientação: reprova o take.
- Móvel não flutua: vaso, TV e abajur ficam **em cima** de um móvel (use `dy`); cama inteira, tapete 2×2, sem cadeira solta nem lixo sem lógica.

## 4.7 CONTATO COM AS SUPERFÍCIES — REGRA DEFINITIVA PARA TODOS OS VÍDEOS (23/11, pedido do Bruno)
O personagem **encosta** nas superfícies e fica **sempre por cima delas**: nunca atravessa nada (piso, assento, móvel, parede) e nunca flutua.
- **Medidas do próprio jogo** (animações originais): em pé (`Bob_Idle`) o osso do dedo `Toe0` fica exatamente no chão. Pontos de contato: **sola** = Toe0; **calcanhar** = Foot − 0,10; **joelho** = Calf − 0,05; **nádega** = Pelvis − 0,10.
- **Andando, correndo, agachado, ajoelhado, sentado no chão**: depois de cada pose, `PZ.apoiar(h, alturaDoPiso)` põe o ponto mais baixo do corpo exatamente sobre o piso, quadro a quadro (o joelho do `Bob_IdleHammering_Low` do jogo entrava 10 cm no chão).
- **Sentado na cadeira/sofá/poltrona**: pés no chão e nádega no assento. Assento na altura do jogo (`Bob_SatChair`: nádega a **0,486**) e a pelve no meio da almofada. Senta chegando pela frente (regra 4.6).
- **Sempre por cima**: o móvel em que ele encosta é desenhado antes dele (`móvel.sobrepor(true)`, personagem com `renderOrder 2`): a caixa do sprite nunca corta as pernas. Fora do contato, `sobrepor(false)` (quem passa atrás do móvel some atrás dele).
- **Objetos também**: tábua apoiada no tampo da bancada (altura do sprite), pedaço cortado cai e fica deitado no piso, caixote no chão.
- **Item na mão = modelo do jogo** com o anexo do jogo (`scripts/generated/models_items.txt`): livro lendo = `BookHand.fbx` + `WorldItems/BookRed_New.png` no osso `Bip01_Prop2`, animação `Bob_IdleReadBook` a 0,80 (como em `AnimSets/player/actions/book.xml`); nunca um desenho/ícone de livro.
- **Chão de uma camada só** (24/11, EP21): dois pisos no mesmo lugar (asfalto + grama) piscam no vídeo. Cada lugar tem UM chão; mato = relva do jogo contínua (`floresta()` em `cenarios.js`).
- **Cama do jogo**: duas peças (`furniture_bedding_01_9` cabeceira na borda N + `_8` pé ao sul) com a MESMA altura de colchão (a do desenho); deitado = `PZ.apoiar(S, colchão)` e cama por baixo dele (`sobrepor`).
- **Modo de busca (coleta)** = efeito do jogo (`busca.js`, valores de `ISSearchManager.lua`): fora do raio desfoca, tira cor e escurece, olho em cima da cabeça, marcadores `pinIcon*` nos itens; ele procura olhando em volta (`S.olhar`).
- `inspect.mjs` confere em todo momento: **PERSONAGEM ATRAVESSANDO A SUPERFÍCIE**, **FLUTUANDO**, **NÁDEGA FORA DO ASSENTO**, **ATRAVESSANDO MÓVEL** (quadril, peito, joelhos e pés). `inspecao/sonda.json` guarda a medida de cada momento. Relatório tem de dar 0 avisos.

## 4.9 PADRÕES APROVADOS NO EP24 FINAL (26/11, revisão do Jose) — vale para TODO vídeo novo
Referência de código: `projeto/ep24.js`.
- **Objeto só onde faz sentido.** Caixa de correio só junto de casa ou portão (`bairro(C, correio)`). Rua: um padrão de piso, cerca contínua, detalhes que combinam (lixeira, arbusto, capim alto).
- **Móvel inteiro em todo zoom.** Nada cortado por outro móvel, ícone, chip ou borda da tela; conferir no quadro mais fechado da cena. Ao tirar um elemento da frente do móvel, ele não pode ir para a área dos botões (4.3).
- **Luz de janela** (`luzInterior(..., { facho: true })`): um só sentido de sol na cena; a mancha no chão é a projeção do vidro (não começa colada na parede); poeira dentro do facho.
- **Nenhuma troca seca de animação.** Guarda → golpe → guarda, andar → atacar e andar → cair sempre com mistura (`mix`; `taco`, `chega`, `cai`, `corpoACorpo`), com a raiz parada na mistura.
- **Posição contínua.** Uma só conta de posição do começo ao fim da ação. Zumbi só mexe as pernas quando se desloca, chega ao alcance no instante do golpe ou tiro e cai ali. Proibido correr parado ou teleportar.
- **Voz antes do acabamento.** Com a voz final: refazer `T`/`END` e todas as frações de chip, moodle, cartão e som (`check_vo.py`).
- **Roteiro:** efeito que muda o combate é dito para **atirar e bater**, quando houver fonte para os dois. Fecho com recomendação clara e pergunta.
- **Conferência:** fotos paradas dos trechos citados, antes/durante/depois da ação, no máximo 2 rodadas.
- **Post:** título sem "Project Zomboid" (`"sem_sufixo": true` no `epNN.ep.json`). **Capa:** no máximo 2 linhas.

## 4.10 PADRÕES APROVADOS NO EP23 FINAL (26/11, aprovado pelo Jose) — vale para TODO vídeo novo
Referência de código: `projeto/ep23.js`, `ep23.cfg.js` e `cenarios.js` (`centro`, `condominio`, `praca`, `academia`, `estrada`).

Cenário
- **Um lugar por assunto.** O take muda de lugar quando a fala muda de assunto; não repetir a rua do take anterior nem de outro vídeo.
- **Objeto grande só com função.** Carro ou móvel sem papel na cena sai.
- **Lugar reconhecível,** com 3 ou mais elementos do jogo: condomínio (cerca alta de tábuas `fencing_01_8/_9`, grade, estacionamento, prédios); centro (vitrines, avenida, hidrante, caixa de jornal); academia (esteiras, bancos, colchonetes, janelas). Um piso por área (sem xadrez). Tudo aparece no quadro.
- **Print do Jose manda:** usar o sprite igual, tirado dos arquivos do jogo.

Ação
- **Fuga:** horda desde o primeiro quadro, vinda de mais de um lado (EP23: 16 zumbis), sem objeto no caminho deles.
- **Curva correndo:** nunca girar o boneco no próprio eixo. Trajeto calculado antes, a cabeça olha primeiro, curva do jogo (`s_runturn90l/r`) misturada à corrida, passo medido pela distância.
- **Levantar, agachar, sentar:** `seq()` com mistura suave (levantar ≈ 26 quadros).
- **Escalada que falha:** `Bob_ClimbFence_Start → Loop → Fail`; câmera acompanha; corte na queda com a horda chegando.
- **Passos:** som do piso certo, no quadro em que o pé toca.

Tela
- **Lista falada** (características, itens): um cartão por nome, no instante da palavra, com ícone original, nome do jogo, pontos (verde ganha, vermelho gasta) e efeito. Grade 2×2. Valor só de `info-validada/`.
- **Selo da build livre:** nada em x ≥ 840, y 515–565. A inspeção não acusa; conferir em foto.
- **Painel no meio da tela:** os pés continuam até y 1580.
- **Exterior de dia:** brilho ≥ 95.

Entrega
- **Inspeção antes do final** (`rascunho` ou `inspecao` no menu); o Claude lê o `relatorio.txt`. "Flutuando" só é aceito em corrida ou escalada conferida em foto.
- **Post:** `"sem_sufixo": true` e título sem "Project Zomboid"; conferir no `instrucoes.txt`.

## 4.1 REGRA DAS TELAS (18/11, pedido do Jose) — tela do jogo = RÉPLICA
- Toda tela/menu do jogo que aparece no vídeo é **réplica fiel da tela real**: mesmo layout, mesmas colunas, cores, fonte simples do jogo, botões e ordem dos elementos.
  - Nada de painel genérico "estilo jogo".
- **Referência obrigatória:** print da tela real (do Jose, ou print online da B42) antes de montar.
  - Sem print = não inventar a tela; usar ícone/chip.
- **Textos:** sempre dos arquivos PT-BR da 42.22 (`Translate/PTBR`), mesmo que o print seja em inglês ou de tradução antiga (ex.: "Estado Geral do Corpo", não "Estado Corporal").
- **Valores:** só os do jogo (custos, nomes, bônus dos arquivos).
- **Celular (9:16):**
  - A tela larga é montada no tamanho real (ex.: 1650×865) e a câmera aproxima na coluna/linha que a voz cita (punch-in/pan suave).
  - Visão geral só no começo e no fecho.
  - Número importante ganha um espelho grande embaixo, no mesmo estilo do jogo (ex.: "Pontos Disponíveis").
- O cursor do jogo clica no que a voz fala, no frame em que o valor muda.
- Prontas (reusar):
  - Criação "SELECIONE PROFISSÃO E TRAÇOS": `ep13.cfg.js` (classes `.gv/.gm/.oc/.tr/.pm`, câmera `CAM`, `pickT`, `skills`).
  - Janela do personagem, aba **Saúde**: `ep15.cfg.js` → `healthPanel(k, at, status, [[parte, [ferimentos], de, até]])`.
    - Tem abas Informações/Habilidades/Saúde/Proteção/Temperatura, corpo, barra, coração, Exercitar-se e o rodapé do menu Tratamento.
    - Fundo opaco.
- Faltam prints para: aba Habilidades (EP14/EP19), aba Temperatura (EP18), menu de contexto/Barricar (EP17) e receitas.
  - Pedir print ao Jose ou buscar print online da B42 antes de montar.

## 5. Pipeline

**Quem renderiza é o usuário**, no PC com placa de vídeo, pelo menu `ferramentas/manual.bat`. O Claude prepara arquivos e áudio, faz as fotos de conferência e lê o relatório.

1. Pesquisa (ordem do item 0) → `fatos.json`.
2. Roteiro com coluna VISUAL por frase → Jose aprova.
3. Rascunho com voz provisória (Piper) + telas réplica → prévia cedo.
4. Jose revisa → `prompt_elevenlabs.txt` → vozes → `check_vo.py` → final.
