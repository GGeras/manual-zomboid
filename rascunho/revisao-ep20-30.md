---
status: rascunho
atualizado: 2026-11-23
---
# Revisão EP20–30: o que falta e onde buscar no jogo

`media/` = pasta do jogo instalado (B42.22) no PC do Jose. Termo de busca = `grep -ri "<termo>"` na pasta indicada.
Achou: mover a linha para `info-validada/<tema>.md` com arquivo + chave → `validar.py --gerar` → PR.

## Já resolvido por `nomes-ptbr.md` (aplicar nos roteiros)
| ep | no roteiro hoje | correto |
|---|---|---|
| 20 | "Ridiculamente Cansado" | **Cansaço Absurdo** |
| 20 | "mau cheiro" (nome do moodle) | **Mau Cheiro** ✅ |
| 21 | "Forrageamento" | **Coleta** |
| 22 | "Tensão Muscular" | **Distensão Muscular / Leve** (feito no PR #13) |

## EP20 — Sono (6 fatos em rascunho)
| fato | o que confirmar | onde (media/) | termo de busca |
|---|---|---|---|
| sono-niveis | cansado = dano corpo a corpo e visão menores | `lua/shared/Translate/PTBR/Moodles.json` (texto de ajuda) | `Tired` |
| sono-cama | qualidade da cama muda horas de sono; dor no pescoço | `lua/` (ação de dormir) + `Translate/PTBR` | `bedType`, `goodBed`, `badBed`, `Neck` |
| sono-bloqueio | Mau Cheiro trava dormir (42.22.2) | `lua/` + `Translate/PTBR/IG_UI.json` | `NoxiousSmell`, `CantSleep` |
| sono-remedio | remédio para dormir; nome PT-BR | `scripts/generated/items` + `Translate/PTBR/ItemName.json` | `SleepingTablets`, `PillsSleepingTablets` |
| sono-cafe | cafeína só adia | `scripts/generated/items` | `Coffee`, `FatigueChange` |
| sono-descanso | sentado não tira cansaço | `lua/` | `Rest`, `fatigue` |
| ícone | `Mood_NoxiousSmell` = Mau Cheiro? | `Translate/PTBR/Moodles.json` | `NoxiousSmell` |

## EP21 — Coleta (6 fatos só B42.19 → todos revalidar)
| fato | o que confirmar | onde (media/) | termo de busca |
|---|---|---|---|
| forr-raio | raio por nível (número!) | `lua/client/Foraging` ou `lua/shared/Foraging` | `radius`, `getVisionRadius` |
| forr-penal | chuva, neblina, escuro, cansaço, pânico, correr, agachado | mesmos arquivos | `penalty`, `Sneak`, `Running` |
| forr-modo | nome do botão/painel em PT-BR | `Translate/PTBR/IG_UI.json` | `Foraging`, `Search` |
| forr-inicio | itens do nível 0 | `lua/shared/Foraging/*` | `skill = 0` |
| forr-veneno | veneno em frutinhas/cogumelos; Herbalista | `scripts/generated/items` + `Foraging` | `Poison`, `Herbalist` |
| forr-neve | inverno/neve reduzem comida | `lua/shared/Foraging/*` | `snow`, `month`, `winter` |
| ícone | revista do Herbalista = `Item_Magazine_Herbal1`? | `scripts/generated/items/literature.txt` + `ItemName.json` | `Herbalist` |

## EP22 — Distensão Muscular (PR #13)
| fato | o que confirmar | onde (media/) | termo de busca |
|---|---|---|---|
| fad-mecanica | acumula por parte; lentidão; dor | `lua/` | `MuscleStrain`, `Stiffness` |
| fad-partes | braço/costas/pescoço; perna ao correr? | `lua/` | `Stiffness`, `Neck`, `Torso` |
| fad-arma | peso da arma aumenta o acúmulo | `lua/` + `scripts/generated/items/weapons*` | `Weight`, `Stiffness` |
| fad-pisao | pisão custa menos | `lua/` | `Stomp` |
| fad-analgesico | remédio tira dor, não a distensão | `lua/` | `Painkiller`, `Stiffness` |
| fad-reduz | Força e nível da arma reduzem | `lua/` | `Strength`, `Stiffness` |
| fad-dicas | descanso recupera; fator do sandbox | `lua/shared/Sandbox/Apocalypse.lua` | `MuscleStrain` |
| nome | remédio pra dor; moodle de dor | `Translate/PTBR/ItemName.json`, `Moodles.json` | `Painkiller`, `Pain` |
| peso | Marreta × Martelo de Garra | `scripts/generated/items` | `Sledgehammer`, `Hammer` |

## EP23–30
Não existe roteiro, tema nem fato. Falta definir a pauta (Jose).

## Fontes tentadas sem sucesso (23/11)
- Repositório oficial de traduções `TheIndieStone/ProjectZomboidTranslations`: último commit 2023 (B41) → não vale.
- Espelho público dos arquivos B42 no GitHub: não encontrado.
