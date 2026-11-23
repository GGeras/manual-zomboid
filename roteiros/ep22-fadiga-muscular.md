---
ep: 22
tema: Fadiga Muscular
responsavel: jose
status: rascunho
build: B42.22
fatos: [combate-empurrao, fad-mecanica, fad-partes, fad-arma, fad-pisao, fad-analgesico, fad-reduz, fad-dicas]
video: (link do Drive em videos/LINKS.md)
---

# EP 22 — Fadiga Muscular (v5, estimativa ~55 s)

Ideia-guia: **cada parte do corpo cansa sozinha — luta inteligente divide o esforço.**
Selo: `BUILD 42.22`. Nenhum número na fala nem na tela (só barras sem escala).
Nome no jogo: **Distensão Muscular** (painel de saúde, `nomes-ptbr.md`). Não usar "tensão" nem "fadiga" na tela.

> ⛔ **Bloqueado para build.** Só `combate-empurrao` e o nome "Distensão Muscular / Leve" estão em `info-validada/`.
> Os fatos `fad-*` (pesquisa v4, corrigida) estão em `rascunho/`. Frase marcada ⛔ só vai para vídeo depois do PR de validação.
> Fato que não validar: **a frase sai**, não vira pergunta.

## Roteiro

### GANCHO
**1.** [acusando] "Dá pra se machucar sem nenhum zumbi encostar em você."
- FATO: ⛔ fad-mecanica
- VISUAL (0–3 s):
  - 0–1 s: 3D — `PZ.SOBREVIVENTE` golpeando no ar, rua, luz dia; selo BUILD 42.22.
  - 1–2 s: punch-in no braço; tremida leve.
  - 2–3 s: título **Machucado** / **sem mordida**.
- ÍCONES: Item_Axe · SONS: batSwing (Combate)

### BASE
**2.** [explicando] "Na aba Saúde, a ficha do corpo do personagem, aparece: Distensão Muscular. É o músculo cansado de tanto esforço."
- FATO: ✅ nome (`nomes-ptbr.md`: Saúde, Distensão Muscular / Leve) · ⛔ fad-mecanica (significado)
- VISUAL (réplica `ep15.cfg.js` → `healthPanel`, print `aba-saude-ferido.png`):
  - 0–2 s: janela do personagem abre; câmera na aba **Saúde**.
  - 2–4 s: punch-in na linha "Braço Direito — Distensão Muscular / Leve"; braço acende na silhueta.
  - 4–5 s: título **Distensão** / **Muscular**.
- ÍCONES: — · SONS: clique de UI

**3.** "Cada parte cansa separado: o braço quando você bate, as costas quando carrega peso demais, e o pescoço quando dorme em cama ruim."
- FATO: ⛔ fad-partes (sem perna/corrida: sem fonte 42.20+)
- VISUAL (mesma réplica, sem textos de nível além de "Leve"):
  - 0–2 s: braço acende + Item_Axe ao lado.
  - 2–4 s: costas acendem + Status_HeavyLoad.
  - 4–6 s: pescoço acende + Item_Mattress com ✗.
- ÍCONES: Item_Axe, Status_HeavyLoad, Item_Mattress · SONS: PZ_PutInBag

**4.** "Quanto mais distensão, mais lento fica o seu golpe, e vem a dor."
- FATO: ⛔ fad-mecanica
- VISUAL (split, sem números):
  - 0–2 s: esquerda: barra sem escala "esforço" subindo; direita: golpe 3D em câmera lenta.
  - 2–3 s: Mood_Pained entra na coluna de moodles (só ícone; nome PT-BR não validado).
- ÍCONES: Mood_Pained · SONS: male_outofbreath_01

**5.** "E arma pesada cansa mais o braço."
- FATO: ⛔ fad-arma (só peso; comprimento sem fonte recente)
- VISUAL (chips, sem tela de inventário — falta print):
  - 0–1,5 s: Item_Sledgehammer2 (chip "Marreta") + barra sem escala grande ✗.
  - 1,5–3 s: Item_Hammer (chip "Martelo de Garra") + barra pequena ✓.
- ⚠ Peso relativo Marreta × Martelo de Garra: conferir em `scripts/generated/items` (pesquisador).
- ÍCONES: Item_Sledgehammer2, Item_Hammer · SONS: sledgehammer, PZ_Hammer

### EXEMPLO
**6.** [tenso] "Exemplo: um grupo de zumbis, e você só no golpe. O braço vai distendendo, o ataque fica lento, e o último te pega."
- FATO: ⛔ fad-mecanica
- VISUAL (3D):
  - 0–2 s: vários zumbis chegando (sem número na fala/tela).
  - 2–4 s: golpes em sequência; mini painel Saúde no canto, braço passa de "Leve" para cor mais forte (sem texto de nível novo).
  - 4–6 s: golpe desacelera; último zumbi agarra; luz vermelha.
- ÍCONES: Item_Axe · SONS: batSwing, zombiehit2, zombiebite

**7.** [virada] "O certo: empurra pra derrubar e pisa no caído. Pisar não gasta a arma e cansa menos que outro golpe."
- FATO: ✅ combate-empurrao · ⛔ fad-pisao
- VISUAL:
  - 0–2 s: 3D — empurrão derruba o zumbi; chip "ESPAÇO = EMPURRAR".
  - 2–4 s: chip "PISAR" + ✓; ícone da arma com durabilidade parada.
  - 4–6 s: mini painel: braço quase não sobe ✓.
- ÍCONES: Item_Axe · SONS: PZ_HeadSmash_01

**8.** "E puxa poucos por vez: golpe que pega vários cansa mais."
- FATO: ⛔ fad-dicas
- VISUAL (vista de cima simplificada):
  - 0–1,5 s: um zumbi por vez ✓.
  - 1,5–3 s: bolo de zumbis + barra sobe rápido ✗.
- ÍCONES: — · SONS: zombie (Zumbis)

### ARMADILHAS
**9.** [alerta] "Armadilha: remédio pra dor tira a dor, mas a distensão continua lá, e continua subindo."
- FATO: ⛔ fad-analgesico · ⚠ nome PT-BR do Item_PillsPainkiller não está em `nomes-ptbr.md` (por isso "remédio pra dor", sem nome)
- VISUAL:
  - 0–2 s: Item_PillsPainkiller usado → Mood_Pained some ✓.
  - 2–4 s: réplica Saúde: linha "Distensão Muscular" continua, braço mais forte ✗.
- ÍCONES: Item_PillsPainkiller, Mood_Pained · SONS: PZ_Swallowing

**10.** "O que segura é Força alta e prática com a arma: a habilidade dela, tipo Machados. As duas fazem a distensão subir mais devagar."
- FATO: ✅ nomes (Força, Machados) · ⛔ fad-reduz
- VISUAL (chips — aba Habilidades sem print):
  - 0–2 s: chip "Força" + barra de nível subindo (sem número).
  - 2–4 s: chip "Machados" + Item_Axe; barra de distensão ao lado sobe mais devagar ✓.
- ÍCONES: trait_strong, Item_Axe · SONS: levelup

### FECHO
**11.** [firme] "Passa descansando e dormindo. Lutar com o braço cansado é morrer cansado."
- FATO: ⛔ fad-dicas (recupera com descanso, sem tempo fixo)
- VISUAL:
  - 0–2 s: 3D — casa, luz amanhecer, personagem parado; mini painel com linhas apagando aos poucos (sem timer).
  - 2–3 s: corte seco para preto; título **Descansa** / **antes de lutar**; CTA.
- ÍCONES: — · SONS: heart

## Termos explicados na 1ª vez
| termo | onde |
|---|---|
| aba Saúde | frase 2 ("a ficha do corpo do personagem") |
| Distensão Muscular | frase 2 ("músculo cansado de esforço") |
| empurrar | frase 7 (tela: tecla ESPAÇO) |
| habilidade da arma | frase 10 ("prática com a arma… tipo Machados") |

## Pendências do pesquisador (validar → `info-validada/` por PR)
| id | o que precisa | fonte já levantada (v4) |
|---|---|---|
| fad-mecanica | acumula por parte ao golpear e carregar peso; deixa lento; dá dor | pzfans 42.20.4 + projectzomboid.wiki muscle-strain (B42 2026) |
| fad-partes | braço = golpe; costas = peso; pescoço = cama ruim | idem + gamers.wiki sono (42.20.2) |
| fad-arma | arma mais pesada cansa mais | build42guide combat (42.21/42.22) + projectzomboid.wiki |
| fad-pisao | pisão cansa menos que golpe | build42guide + projectzomboid.wiki + pzfans 42.20.4 |
| fad-analgesico | remédio tira a dor, não a distensão | projectzomboid.wiki (B42 2026) |
| fad-reduz | Força e nível da habilidade da arma reduzem o acúmulo | pzfans 42.20.4 + build42guide |
| fad-dicas | poucos por vez; descanso/sono recupera, sem tempo fixo | pzfans 42.20.4 + projectzomboid.wiki |
| nome | PT-BR de Item_PillsPainkiller e de Mood_Pained (`Translate/PTBR`) | — |
| peso | Marreta × Martelo de Garra (`scripts/generated/items`) | — |
