---
status: rascunho
---
# EP20–30 — o que NÃO foi confirmado (fora dos roteiros)

Revisão de 23/11/2026: arquivos do jogo (B42.22) primeiro, depois web 42.20+. O que está aqui **não pode ir para vídeo** até ter fonte.

| id | afirmação | por que ficou fora |
|---|---|---|
| sono-ridiculamente | "Ridiculamente Cansado" | nome errado: no jogo é **Cansaço Absurdo** (Moodles.json) |
| sono-erra-mais | cansado "erra mais" no corpo a corpo | fontes falam de força e percepção, não de acerto corpo a corpo |
| col-forrageamento | "Forrageamento" | nome errado: no jogo é **Coleta** |
| col-veneno-sorteio | veneno sorteado por unidade; nível de Coleta reduz o risco | só fonte 42.19 (pzfans); o jogo só diz que Herbalista identifica |
| fad-arma-longa | arma longa cansa mais que curta | sem fonte 42.20+; confirmado só o peso |
| fad-velocidade | analgésico "não devolve a velocidade" | só fonte B42.0 |
| carga-formula | capacidade = ~8 por nível de Força / 50 de limite | números de calculadora da comunidade, fonte diz para conferir no jogo |
| est-vira-tristeza | estresse longo vira tristeza; tédio vira tristeza | só fontes 42.19 / sem build |
| tri-lentidao | tristeza deixa as ações mais lentas | fontes 42.19 se contradizem |
| pan-diminui-dias | pânico diminui com os dias sobrevividos | fonte sem build |
| fogo-correr | correr apaga fogo no corpo | só fóruns B41 |
| cad-mascara-bloqueia | máscara de gás com filtro bloqueia 100% | conflita com os arquivos (todas as máscaras têm a mesma proteção 25) |


## Resolvidos em 23/11/2026
- `fad-perna`, `resf-espirro`, `heli-segue`: confirmados pelo Jose no jogo (B42.22) → `info-validada/`.
- `fogo-apagar` (areia/cascalho/terra/água): projectzomboid.wiki 42.20.4 → `info-validada/fogo.md`.
- `cad-combinacao`: doença = quantidade + decomposição + tempo (Jose + wiki 42.20.4). Número fixo de corpos → `_nao-usar.md`.