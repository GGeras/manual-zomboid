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
- **Sons do jogo B42** extraídos do `ZomboidSound.bank` (pasta `assets/sfx/Jogo B42`): grito "Hey!" do jogador, animais estressados,
  cerca batendo, barricada (tábua/metal), corda de lençol, leitura etc.
- **Fidelidade:** barricadas, cortinas, corda de lençol e móveis são os sprites do jogo, na posição do jogo. A saída de emergência só
  funciona do 2º andar para cima, em janela sem barricada, descendo pela corda.

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
1. Pesquisa (ordem do item 0) → `fatos.json`.
2. Roteiro com coluna VISUAL por frase → Jose aprova.
3. Rascunho com voz provisória (Piper) + telas réplica → prévia cedo.
4. Jose revisa → `prompt_elevenlabs.txt` → vozes → `check_vo.py` → final.
