# Lugares de gravação

Regra do Jose (27/11/2026). Vale para todo episódio.

## Regra
- Cada lugar é fixo e reaproveitado. Repetiu tema: **mesmo lugar, melhorado**. Nunca trocar o visual para variar.
- Meta: ficar o mais parecido possível com o jogo.
- É um processo: o lugar evolui episódio a episódio.
- Aprovado pelo Jose = **TRAVADO. Nunca trocar.**

## Como melhorar
- Referência: pasta `media` do jogo ou print do Jose. Sem referência, o detalhe não entra.
- Sprites e modelos originais. Forma genérica é a primeira a sair.
- Um lugar = uma função em `projeto/cenarios.js`. Não alterar código de episódio publicado.
- Mudou o lugar: atualizar o registro (episódio e o que entrou).
- Ao travar: anotar data, commit e foto em `referencias/lugares/`.
- Premissa a confirmar: luz, clima, câmera e personagens seguem o roteiro; cenário e objetos ficam fixos.

## Registro
| lugar | código atual | episódios | status | próximo passo |
|---|---|---|---|---|
| horta | `horta()` (EP25: casa de madeira, cerca de estacas, 4 canteiros com sprites do jogo por estágio e estado, mato, galpão, barril de chuva, compostor, espantalho, capim alto; versão inverno) | 12, 25 | em construção (rodada 1 de fotos enviada 27/11) | ajustes do Jose na foto |
| fazenda | `fazenda()` | 16, 26 | em construção | galinheiro, 2 cochos, balde |
| lago/rio | `sets.js` `river()` (formas genéricas) | 09, 12, 27 | em construção | criar `lago()` com sprites do jogo |
| casa | `casaDentro()` | 14, 15, 17–20, 22–24, 28 | em construção | |
| quarto | `quarto()` | 20, 22, 24, 28 | em construção | |
| rua | `rua()` | 15, 18, 20, 22–24 | em construção | |
| sobrado | `sobrado()` | 17 | em construção | |
| floresta | `floresta()` | 21, 28 | em construção | |

Lugares que só existem em outra cópia do código entram aqui quando chegarem ao repo.
