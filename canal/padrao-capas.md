# Padrão de capas v5 (oficial desde 22/11/2026, refinado até 25/11)

Vale para YouTube Shorts, Reels e TikTok: 1080x1920 (9:16), JPG. **Substitui o padrão antigo** (3 linhas + quadro do vídeo). A v5 foi aprovada pelo Jose; toda capa nova segue este documento.

## Regras do Jose
- Capa **criada para cada vídeo** (arte própria), não um quadro do vídeo.
- No máximo **2 linhas** de título: linha 1 bege, linha 2 na cor do grupo. Gancho/curiosidade tirado de fala ou fato **validado** do vídeo (`info-validada/`).
- **Número do EP** grande e fácil de ver (canto inferior direito).
- **Personagem atualizado** (modelo do jogo, roupa de sempre: `PZ.SOBREVIVENTE`) + um elemento do tema.
- **Elementos soltos/abstratos** de alto gancho: ícones originais do jogo em pixel ampliado, moodles com fundo, "?", mira, raio, olho riscado, números/chips, quadradinhos.
- **Nada pode sobrepor nada.** Pose sem bug: arma/taco na mão certa, virado para o lado certo, sem mão flutuando.
- **Rapidez:** gerar só o grupo pedido (`ONLY=<GRUPO>`, ~25 s) e mandar logo. Sem `ONLY` refaz todas (~3–5 min).
- Tudo que importa fica no centro (1080x1350): o Instagram corta no feed.

## Grupos de 3, na ordem de PUBLICAÇÃO
- Cada grupo = 3 vídeos seguidos em ordem numérica; cada grupo tem **cor e motivo geométrico próprios** que atravessam as 3 capas (minimalista, leve toque abstrato, ligado ao tema). Não repetir o mesmo motivo (ex.: só círculos) em todos.
- No perfil o post mais novo fica à **esquerda**: na arte contínua, **esquerda = 3º, centro = 2º, direita = 1º** (ex.: ROTINA = 18 | 17 | 16).
- Selo embaixo: nome do grupo + `■□□` (o quadrado cheio é a posição na ordem de publicação).
- Publicar os 3 do grupo seguidos e em ordem numérica. Se a ordem real mudar, refazer os grupos.

| Grupo | Cor | EPs | Motivo |
|---|---|---|---|
| DIA 1 | #FFB020 | 01–03 | sol nascendo no horizonte (arcos, raios, faixas) |
| SOBREVIVA | #4FC3F7 | 04–06 | linha de ECG contínua, um pulso por capa |
| PERIGO | #FF3D55 | 07–09 | fita de alerta diagonal + triângulos com "!" |
| BASE | #8FE04A | 10–12 | grade isométrica + um lote por capa |
| PERSONAGEM | #B388FF | 13–15 | losangos de nível ligados por linha pontilhada |
| ROTINA | #FF8A3D | 16–18 | onda do ciclo do dia (sol nos picos, lua nos vales) |
| HABILIDADES | #2FE3C4 | 19–21 | barra de nível do jogo (10 quadrados): acesos 3/6/10 |
| EP22–24… | nova | | cada grupo novo ganha cor e motivo novos |

## Estilo
- Fundo: degradê escuro da cor do grupo, vinheta, granulado leve, motivo da fileira, poucos quadradinhos de pixel.
- Título: Inter Black (linha 1 ~104 px, linha 2 ~156 px; encolhe até caber). Topo: ícone do canal. Base: logo horizontal.
- Herói: render 3D em 2x, brilho na cor do grupo. Ícones de item em "slot" de inventário; moodles sem slot.

## Capas já publicadas
- Exceção autorizada pelo Jose (23/11): a capa dos vídeos 01–18 foi trocada pela v5. A antiga fica em `versoes/capa_antiga_v1.jpg`. Em regra, entrega anterior nunca é sobrescrita.
- Trocar capa de Reels já publicado é manual, pelo app.

## Entrega
`capa.jpg` (v5) + `capa-v5.jpg` na pasta do vídeo. As capas `capa_opcao2/3` do padrão antigo estão obsoletas.

## Gerador
O gerador (`capas/`, `capa3d.html`, `capa3d.js`) ainda **não está no repo**: sobe pelo PC do Jose (arquivos pesados/LFS). Geração, poses e títulos por episódio: doc 12 do projeto Claude até lá.
