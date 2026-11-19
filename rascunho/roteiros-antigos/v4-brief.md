# Brief — roteiro visual v4 (Manual Zomboid)

Canal de Shorts de dicas de Project Zomboid para LEIGOS. Conteúdo fiel ao jogo. Versão alvo: **B42.22** (mais recente). Idioma: português do Brasil.

## Sua tarefa (por episódio)
1. Ler o roteiro v2 aprovado: `audio/roteiros_v2.json` (chave = número do ep, valor = lista de frases da narração).
2. **Conferir cada fato** do roteiro com fonte atual (B42.x, de preferência 42.20+). Usar WebSearch/WebFetch.
   - Fontes boas: notas de patch oficiais (projectzomboid.com / Steam), pzwiki.net (B42), pzfans.com com versão indicada, projectzomboid.wiki.
   - Ignorar fontes de B41 ou sem versão, a menos que confirmem algo que não mudou e outra fonte B42 concorde.
   - Fatos já levantados ficam em `pipeline/fatos.json` (`fatos[id] = {texto, build, fonte, eps}`) — reconferir os do seu ep.
3. Escrever o **roteiro visual** frase a frase (o que aparece na tela a cada 2–3 s).
4. **NÃO editar** `pipeline/fatos.json`, `audio/*`, `epNN.cfg.js`, `epNN.js`, `epNN.ep.json`, nem nada fora de `roteiros/v4/`. Só criar arquivos em `roteiros/v4/`.

## Regras absolutas de conteúdo
- **Números só com fonte confirmada.** Sem número confirmado: falar de forma vaga/qualitativa. Nunca número inventado, "ilustrativo" ou "aproximado" — vale para narração E para o que aparece na tela.
- Se um fato do roteiro v2 estiver errado, duvidoso ou desatualizado: marcar `⚠` e propor a frase corrigida (sem número se não houver fonte).
- Estrutura: GANCHO → BASE (explica o conceito antes das dicas) → EXEMPLO → armadilhas/regras → FECHO. Sem lista solta, sem ponta solta.
- Todo termo do jogo é explicado na primeira vez (ex.: "moodle = ícone de estado na lateral da tela").
- Duração definida só pela necessidade de entendimento (60s+ é ok). Nunca encher linguiça.
- Não clonar voz de pessoa real. Personagem principal tem roupa fixa (não descrever outra roupa).

## Regras de edição (imersiva)
- Mudança visual a cada 2–3 s: telas simuladas do jogo (inventário, criação de personagem, menu de contexto do clique direito, painel de saúde, barra de moodles), números e barras animados, split de comparação, ícones do jogo, selos ✓/✗.
- Elementos/ícones/sons SÓ do jogo. Verificar se existem:
  - ícones de itens: `assets/items/<Nome>.png` (4454 arquivos; ex.: `Item_Axe`, `Item_Crowbar`, `trait_*`, `profession_*`). Use `ls assets/items | grep -i <termo>` para achar o nome exato.
  - moodles: `assets/moodles/*.png` (38).
  - sons: `assets/sfx/<categoria>/...` (nome do arquivo sem extensão).
- 3D disponível: personagem principal, zumbis andando, rua da cidade, casa simples com janela, luz dia/amanhecer/escuro/vermelho, machado de bombeiro na mão, ícone 3D de item na mão. Cena 3D nova e complexa = risco de bug → prefira tela simulada.
- Referência do formato (piloto aprovado em produção): `ep13.cfg.js` (tela de criação simulada com cursor, saldo animado, botão travando) e `audio/roteiros_v2.json["13"]`.

## Formato de saída — `roteiros/v4/epNN.md`
```
# EP NN — <tema>  (estimativa: XXs)
## Fatos conferidos
| id (fatos.json ou novo) | fato | status (OK / CORRIGIR / REMOVER / NOVO) | fonte (URL) + build |
## Frases (narração final)
1. "<frase>"  [se mudou do v2: ⚠ motivo]
   - TELA: <cena 3D ou tela simulada> | título (2 linhas curtas)
   - 0–2s: ...  2–4s: ...   (eventos na ordem da fala)
   - ÍCONES: Item_X, trait_Y (nomes exatos que existem em assets)  SONS: nome (pasta)
...
## Pendências para o Jose confirmar
- (só o que não deu para confirmar com fonte; pergunta curta de sim/não)
```
E também `roteiros/v4/epNN.fatos.json` com os fatos novos/corrigidos no mesmo formato de `pipeline/fatos.json` (`{"id": {texto, build, fonte, eps}}`).

No fim, responda com um resumo curto: por episódio, quantas frases mudaram, fatos corrigidos/removidos, e as pendências.
