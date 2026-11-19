# Manual Zomboid — episódios recentes (modelos do método aprovado) e lições

Padrão de qualidade:
- sons do jogo sincronizados com cada ação;
- música baixa;
- um elemento por vez na tela;
- animação v3;
- prévias conferidas antes do render.

Do EP13 em diante vale o formato v4 (doc 11).

## 13 — Traços e Profissões (final, 63,7 s) — APROVADO
- **Roteiro (13 frases):**
  - conta de pontos;
  - Profissão Personalizada +8 sem bônus;
  - Veterano −8 com Pontaria e Recarga;
  - Lenhador 0 com Machados e Força;
  - o bônus também acelera a experiência (sem percentual, porque as fontes divergem);
  - Atlético custa 10; Fumante devolve 3;
  - Surdo devolve 12, mas não ouve zumbi;
  - CTA.
- **Visual:** RÉPLICA da tela "SELECIONE PROFISSÃO E TRAÇOS".
  - Tamanho real 1650×865.
  - A câmera aproxima na coluna citada e o cursor clica.
  - Espelho "Pontos Disponíveis" embaixo.
  - 3D só no gancho, no Surdo e no CTA.
- v1 reprovado: explicação ruim, animação duvidosa e "Lenhador de graça".

## 14 — Cozinhar (final, 66,8 s) — APROVADO
- **Visual:** painéis simples feitos antes da regra de réplica; o Jose aprovou assim. São o melhor modelo para os EP16–19.
  - energia;
  - cards de fogo;
  - panela com 6 espaços;
  - barra cru/pronto/queimado;
  - habilidade;
  - tooltip da água com o texto do jogo.
- 3D: fogueira no quintal, panela do jogo e vapor.

## 15 — Medicina (final, 82,2 s) — APROVADO
- **Visual:** RÉPLICA da janela do personagem, aba Saúde (`healthPanel`). As feridas mudam na hora do tratamento.
- Final em 3D (zumbi mordendo) em vez de tela vermelha.

## Lições de produção
- check_vo pode errar o fim da narração: confira com `silencedetect`.
- Chips centrais com mais de ~24 letras estouram a largura e entram na área dos botões: encurte.
- Capa:
  - `capa.t` + `capa.opcoes` com 3 momentos diferentes (senão saem 3 capas iguais);
  - a capa esconde o HUD, então escolha momento com 3D bom.
- Enquadre com o personagem de lado para a câmera. Cenários extras longe da cidade. Noite = `dawn`.
- Render em segundo plano: nunca `&`; use a opção de segundo plano com timeout longo.
- Arma de fogo: no `S.spine` + IK (`reach`); `flashAt` 9–12.
- Mande a PRÉVIA DE RASCUNHO cedo.
- Sons por FRAÇÃO da frase. Recalcule quando a voz final chegar: a voz do ElevenLabs é mais curta que a provisória.
- Corrigir só um trecho: `render.mjs epNN.html tail.mp4 --from X --to D` + concat com `rawNN.mp4` (trim 0:X) + `build.py NN audio final check post`.
- Limitador do áudio em 0.84 (true peak abaixo de −1 dBTP). Já está no build.
- Campos `capa` e `post` do `epNN.ep.json` precisam estar preenchidos antes do final (para 16–19 já estão; falta só `capa.t`/`opcoes`).
- A classe `.t` colide com o CSS do ep-core: em telas réplica use outro nome (`.gt`).

## Erros antigos (não repetir)
- Objeto na mão sem rotação YXZ vira de cabeça para baixo.
- Personagem tapando o objeto da ação.
- Cenário sobre rua/calçada ou atrás de árvore.
- Som atravessando a troca de cena; som longo sem `trim`.
- Números um em cima do outro: um elemento por vez.
- Zumbi não é verde.
- Não editar `engine.js` / `ep-core.js` / `sets.js` com um build rodando: a etapa de capa recarrega a página e pega o código novo.
