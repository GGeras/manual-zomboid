# Colaboração (Jose + sócio)

## 1. Nomes de arquivos
- **Minúsculas, sem acento, sem espaço, palavras com hífen.** Ex.: `frio-e-calor.md`, `aba-saude-ferido.png`.
- **Episódio:** `epNN-tema`, com NN de 2 dígitos. Ex.: `roteiros/ep20-sono.md`.
- **Série gravada:** `bases-NN-local`. Ex.: `bases-02-hospital-muldraugh`.
- **Fato:** id `tema-assunto` com prefixo do tema. Ex.: `ani-cocho`, `barr-luz`, `temp-roupa`. Fica em `info-validada/<tema>.md`.
- **Print de tela do jogo:** `referencias/telas-do-jogo/<tela>-<detalhe>.png`. Ex.: `menu-barricar.png`.
- **Arquivos do jogo e da pipeline mantêm o nome original:** `Item_*`, `Mood_*`, `PZ_*`, `epNN.cfg.js`, `epNN.ep.json`. O código procura por esses nomes.
- `python ferramentas/validar.py` aponta nome fora do padrão.

## 2. Quem faz o quê (evita conflito)
- **Um dono por episódio:** campo `responsavel:` no cabeçalho de `roteiros/epNN-*.md`.
  - Só o dono mexe nos arquivos daquele episódio: `roteiros/epNN-*`, `projeto/epNN.*`, `projeto/audio/*NN*`.
  - Antes de começar um episódio, mude o `responsavel` e faça commit **na hora** (marca o episódio como seu).
- **Arquivos compartilhados**, que pedem cuidado:
  - `info-validada/*.md`: só por Pull Request (merge automático com o CI verde);
  - `projeto/engine.js`, `sets.js`, `ep-core.js`, `pz.js`, `pipeline/*`: avise o outro antes;
  - `canal/*`.
- **Nunca edite** `projeto/pipeline/fatos.json`: ele é gerado por `validar.py --gerar`.

## 3. Fluxo (branch → PR → main)
```bash
git switch main && git pull                 # 1. começa atualizado
git switch -c jose/ep20-sono                # 2. branch: <seu-nome>/<assunto>
# ... trabalha ...
python ferramentas/validar.py               # 3. 0 erros
git add -A && git commit -m "roteiro(ep20): fatos de sono validados"
git push -u origin jose/ep20-sono           # 4. sobe a branch
gh pr create --fill                         # 5. abre o Pull Request
```
6. **Sem code review** (decisão do Jose, 23/11): o CI `validar` roda sozinho no PR. Verde → quem abriu o PR (ou o Claude dele) faz o merge na hora. Vermelho → corrige antes.
   - Vários PRs abertos: merge na ordem em que foram abertos.
   - Conflito: fica o que já está na `main`; o que é novo entra junto (união). Nada aceito antes é sobrescrito. O que sobrar em dúvida vai para `rascunho/`.
7. Merge com **Squash and merge**. Na mensagem do squash, mantenha a linha `Por quê:`. Depois apague a branch e volte para a main:
   ```bash
   git switch main && git pull
   ```
- **Commit direto na `main`** só para coisa pequena e sua: CHANGELOG, link de vídeo, ajuste no seu próprio roteiro.
- Fato novo e código compartilhado sempre via PR.

## 4. Mensagens de commit
`tipo(escopo): o que mudou`, no presente e curto. **No corpo, sempre uma linha `Por quê: ...`.** Ela registra o motivo da mudança:
```bash
git commit -m "fato(animais): adiciona ani-cocho" -m "Por quê: evita mostrar água no mesmo cocho da ração"
```

| tipo | uso | exemplo |
|---|---|---|
| `fato` | info-validada / rascunho | `fato(animais): adiciona ani-cocho` |
| `roteiro` | roteiros/ | `roteiro(ep20): status validado` |
| `video` | cenas, manifesto, sons de um ep | `video(ep16): cena do galinheiro` |
| `pipeline` | motor, scripts | `pipeline: corrige limitador de áudio` |
| `ref` | referencias/, canal/ | `ref: print do menu Barricar` |
| `docs` | README, CLAUDE, COLABORACAO | `docs: regra de nomes` |

## 5. Conflitos
- **Prevenir:**
  - `git pull` antes de começar e antes do push;
  - commits pequenos;
  - um dono por episódio;
  - PR curto (1 assunto).
- **Aconteceu?**
  - Rode `git pull --rebase`.
  - Texto: o arquivo mostra `<<<<<<<` / `>>>>>>>`. Mantenha as duas partes certas, apague as marcas, depois `git add <arquivo>` e `git rebase --continue`.
  - Imagem ou som (LFS): escolha uma versão com `git checkout --theirs <arquivo>` (a do outro) ou `--ours` (a sua). Depois `git add` e continue.
  - Conflito em `fatos.json`: ignore e rode `python ferramentas/validar.py --gerar` (ele é refeito das tabelas).
  - Travou: `git rebase --abort` volta como estava. Peça ajuda ao seu Claude com a saída de `git status`.
- O `CHANGELOG.md` junta as linhas dos dois sozinho (`merge=union` no `.gitattributes`).

## 6. CHANGELOG
- Uma linha por entrega, a mais nova em cima, dentro do mês.
- Formato: `- AAAA-MM-DD · nome · o que entrou (pasta/arquivo)`.
