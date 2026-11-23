# 00 Indice dos Sons

_(convertido de `00 Referencias/06 Sons do Jogo/00 Indice dos Sons.txt`)_

```text
ÍNDICE DOS SONS DO JOGO — MANUAL ZOMBOID  (138 sons)

ORIGEM: arquivos originais do Project Zomboid (Steam\steamapps\common\ProjectZomboid\media\sound).
REGRA: som de coisa do jogo só entra com o som real do jogo. Nunca imitação sintetizada.
USO: só nos vídeos do canal de fã (os sons são da The Indie Stone).

COMO USAR NO VÍDEO (manifesto epNN.ep.json):
  ["nome do arquivo sem extensão", tempo, volume em dB, {opções}]
  ex.: ["zombiebite", {"c": 5, "dt": 0.4}, -10]            mordida 0,4 s depois do corte da frase 5
  ex.: ["fridgehum", {"c": 5}, -24, {"ate": {"c": 6}}]      geladeira em loop até o corte da frase 6
Todo som abaixa sozinho quando a narração está falando.

OBS.: as descrições abaixo vêm do nome do arquivo (o Claude não ouve áudio). Se algum som não for o que diz, avise para corrigir.
FALTAM (não existem como arquivo solto; estão no banco FMOD do jogo): alarme de carro, frigideira/fogão.
       Para esses: gravar no jogo e enviar (como foi feito com o alarme de casa).

[ALARMES]  volume sugerido: -17 a -19 dB em loop
  alarmclock                         10.8s  despertador
  alarme-casa-gravado                 6.6s  alarme de casa (gravado no jogo pelo Jose)
  burgalarm                          19.1s  alarme de casa (arquivo do jogo)
  burgalarmbeep                       0.2s  bipe do alarme de casa
  firealarm                           1.7s  alarme de incêndio
  vehicle_siren_alarm                 5.2s  sirene de viatura (modo alarme)

[AMBIENTE E CLIMA]  volume sugerido: -24 a -28 dB em loop (cama)
  PZ_Fire                            12.0s  fogo
  PZ_Owl_01                           1.5s  coruja
  PZ_WolfHowl_01                      4.0s  uivo
  ambientInsideWindRain              25.4s  dentro de casa, vento e chuva
  ambientOutsideCricketsNight        40.2s  noite com grilos (ambiente)
  ambientOutsideDayBirds             27.9s  dia com pássaros (ambiente)
  ambientOutsideHeavyRain            21.2s  chuva forte (ambiente)
  ambientOutsideWindyNight           49.0s  noite com vento
  campfire                            3.0s  fogueira
  dog1                               19.3s  cachorro latindo
  insanityambient                    12.0s  ambiente de insanidade
  rumbleThunder1                     12.2s  trovão distante
  thunder1                           15.3s  trovão

[ARMAS DE FOGO]  volume sugerido: -9 dB (tiro perto); -16 (distante)
  assaultrifledistant1                2.1s  rajada de fuzil distante
  gaugeshell                          1.6s  cartucho de escopeta
  hunterShot                          4.2s  tiro de rifle de caça
  pistol                              2.2s  tiro de pistola
  pistoldistant1                      3.3s  tiro de pistola distante
  pistoloutside1                      2.2s  tiro de pistola ao ar livre
  pumpaction                          1.4s  escopeta engatilhando
  shotgun                             3.4s  tiro de escopeta
  shotgundistant1                     3.4s  tiro de escopeta distante
  stormy9mmClipLoad                   0.9s  carregador entrando
  stormy9mmFire                       1.4s  tiro de pistola 9mm
  stormy9mmRack                       0.4s  pistola engatilhando
  stormyRifleFire                     2.1s  tiro de rifle
  stormyShotgunFire                   0.8s  tiro de escopeta

[CASA E CONSTRUCAO]  volume sugerido: -13 dB; geladeira em loop -24
  PZ_ChopTree1                        0.5s  machado na árvore
  PZ_FallingTree                      4.5s  árvore caindo
  PZ_Hammer                           2.1s  martelada
  PZ_Saw                              2.0s  serrote
  fridgehum                          44.8s  zumbido da geladeira (loop)
  hammernail                          0.9s  martelo pregando
  lightswitch                         1.0s  interruptor de luz
  scrapingWood                        1.6s  raspando madeira

[COMBATE]  volume sugerido: -12 a -14 dB
  PZ_HeadSmash_01                     1.0s  cabeça esmagada
  PZ_HeadStab_02                      0.5s  facada na cabeça
  Unstuckweapon                       1.7s  arma sendo arrancada do corpo
  batSwing                            0.3s  taco no ar
  bathit                              0.3s  taco acertando
  sledgehammer                        1.2s  marreta
  splat1                              1.2s  esmagar/respingo
  stab1                               3.4s  facada

[EXPLOSOES]  volume sugerido: -10 dB
  bigExplosion                        2.7s  explosão grande
  explode                            60.9s  explosão
  smallExplosion                      1.1s  explosão pequena

[GERADOR E HELICOPTERO]  volume sugerido: gerador -20 (loop); helicóptero -6 com queda quando o personagem se esconde
  chopper1                           31.7s  helicóptero
  chopper2                           45.4s  helicóptero
  chopper3                           44.0s  helicóptero
  generator                           0.5s  gerador funcionando (loop)
  startGenerator                      1.3s  gerador ligando
  startGeneratorFail                  0.4s  gerador falhando ao ligar
  stopGenerator                       3.5s  gerador desligando

[ITENS E COMIDA]  volume sugerido: -16 dB
  PZ_ClothesRipping                   2.1s  rasgando roupa (bandagem)
  PZ_Drinking                         2.2s  bebendo
  PZ_DrinkingFromTap                  2.3s  bebendo da torneira
  PZ_DuctTape                         1.4s  fita adesiva
  PZ_Eating                           2.4s  comendo
  PZ_FoodSlicing                      2.3s  cortando comida
  PZ_GetWater                         1.5s  enchendo de água
  PZ_OpenBag                          0.4s  abrindo mochila
  PZ_PutInBag                         2.8s  guardando na mochila
  PZ_Swallowing                       0.4s  engolindo
  bottlesmash                         1.7s  garrafa quebrando

[PERSONAGEM]  volume sugerido: -17 a -21 dB
  PZ_FootSteps_Concrete_01            0.3s  passo no concreto
  PZ_MaleBeingEaten_Death             7.1s  sobrevivente sendo devorado
  PZ_MaleDeath_01                     1.4s  morte do sobrevivente (masc.)
  PZ_WoodFoot_01                      0.3s  passo na madeira
  PZ_grassFoot_01                     0.2s  passo na grama
  distscream1                         4.3s  grito distante
  heart                               0.5s  batimento do coração
  levelup                             6.9s  subiu de nível
  male_heavybreathpanic              18.4s  respiração de pânico (masc.)
  male_outofbreath_01                 5.5s  respiração cansada (masc.)
  scream1                             2.4s  grito

[PORTAS E JANELAS]  volume sugerido: -12 a -14 dB
  BrokenGlass                         3.3s  vidro quebrando (longo)
  Thumpdistant01                      0.9s  batida distante
  WalkOnBrokenGlass01                 2.0s  pisando em vidro quebrado
  breakdoor                           1.1s  porta arrombada
  chopdoor                            1.0s  porta sendo destruída a machado
  doorclose                           0.7s  porta fechando
  doorlocked                          0.5s  porta trancada
  dooropen                            1.0s  porta abrindo
  lockDoor                            1.3s  trancar porta
  smashwindow                         2.5s  janela sendo quebrada
  thump1                              1.7s  batida em porta/janela
  thump2                              1.7s  batida em porta/janela
  thumpa1                             0.7s  batida em porta (curta)
  thumpsqueak1                        2.1s  batida em porta com rangido
  unlockDoor                          0.9s  destrancar porta
  windowclose                         0.7s  janela fechando
  windowopen                          1.7s  janela abrindo
  wooddoorcreaks                    132.5s  porta de madeira rangendo (longo)

[VEICULOS]  volume sugerido: -14 a -18 dB
  VehicleCrash1                       0.7s  batida de carro
  vehicle_door_close                  0.3s  porta do carro fechando
  vehicle_door_open                   0.6s  porta do carro abrindo
  vehicle_engine_1                    5.2s  motor do carro
  vehicle_failing_to_start            3.8s  carro falhando na partida
  vehicle_horn                        0.0s  buzina
  vehicle_key                         0.6s  chave do carro
  vehicle_siren_wall                 16.1s  sirene de viatura (modo contínuo)
  vehicle_skid                        3.9s  freada/derrapagem
  vehicle_start                       1.3s  carro dando partida
  vehicle_turned_off                  2.3s  carro desligando
  zb_car_idle                         2.4s  motor em marcha lenta

[ZUMBIS]  volume sugerido: -20 a -24 dB (fundo); mordida/arranhão -8 a -13
  PZ_Female_zombie_01                 1.0s  rosnado de zumbi (fem.)
  PZ_Female_zombie_02                 1.0s  rosnado de zumbi (fem.)
  PZ_Female_zombie_Death_01           1.8s  zumbi morrendo (fem.)
  PZ_MaleZombieEating                 5.7s  zumbi comendo
  PZ_MaleZombie_01                    1.9s  rosnado de zumbi (masc.)
  PZ_MaleZombie_02                    2.3s  rosnado de zumbi (masc.)
  PZ_MaleZombie_03                    2.1s  rosnado de zumbi (masc.)
  fzombierand1                        1.0s  gemido de zumbi (fem.)
  fzombierand2                        0.9s  gemido de zumbi (fem.)
  fzombierand3                        2.2s  gemido de zumbi (fem.)
  zombieImpact                        0.7s  impacto no zumbi
  zombie_footstep_m_01                1.1s  passo de zumbi
  zombie_footstep_m_02                0.7s  passo de zumbi
  zombieambient1                    111.6s  horda ao fundo
  zombiebite                          1.3s  mordida de zumbi
  zombieeating                       14.1s  zumbi comendo (longo)
  zombiehit1                          0.5s  golpe do zumbi
  zombiehit2                          0.9s  golpe do zumbi
  zombiehit3                          1.2s  golpe do zumbi
  zombierand1                         1.3s  gemido de zumbi (masc.)
  zombierand2                         1.5s  gemido de zumbi (masc.)
  zombierand3                         1.1s  gemido de zumbi (masc.)
  zombierand4                         1.6s  gemido de zumbi (masc.)
  zombierand5                         1.5s  gemido de zumbi (masc.)
  zombierand6                         2.4s  gemido de zumbi (masc.)
  zombierand7                         2.4s  gemido de zumbi (masc.)
  zombiescratch                       1.7s  arranhão de zumbi
```

## Personagem — vozes B42 (extraídas em 23/11/2026 do `media/sound/banks/ZomboidSoundMP.bank`, B42.22)
Pasta `projeto/assets/sfx/Personagem`. Voz masculina JL (BH onde JL não tem).
```
  BH_MalePlayer_FreezingShivers_01     1.7s
  BH_MalePlayer_FreezingShivers_02     2.6s
  BH_MalePlayer_PainLoopFire_01       11.0s
  BH_MalePlayer_PainLoopFire_02       12.3s
  BH_MalePlayer_SubtleBoredSigh_01     1.4s
  BH_MalePlayer_SubtleBoredSigh_02     1.4s
  BH_MalePlayer_SubtleReliefSigh_01    1.2s
  BH_MalePlayer_SubtleReliefSigh_02    2.3s
  BH_MalePlayer_SubtleSadSigh_01       1.2s
  BH_MalePlayer_SubtleSadSigh_02       1.8s
  JL_MalePlayer_Coughing_01            1.4s
  JL_MalePlayer_Coughing_02            1.6s
  JL_MalePlayer_ExerciseGrunts_01      1.2s
  JL_MalePlayer_ExerciseGrunts_02      1.3s
  JL_MalePlayer_Muffled_Cough_01       1.4s
  JL_MalePlayer_Muffled_Cough_02       1.8s
  JL_MalePlayer_PainFromBite_01        1.4s
  JL_MalePlayer_PainFromBite_02        1.5s
  JL_MalePlayer_SleepingNoises_01     14.5s
  JL_MalePlayer_SleepingNoises_02     16.4s
  JL_MalePlayer_SneezingHeavy_01       1.2s
  JL_MalePlayer_SneezingHeavy_02       1.1s
  JL_MalePlayer_SneezingLight_01       0.7s
  JL_MalePlayer_SneezingLight_02       0.4s
  JL_MalePlayer_Vomiting_01            2.1s
  JL_MalePlayer_Vomiting_02            2.1s
  explosives_fire_flesh_01            10.0s
  player_on_fire_start_01              1.3s
  player_use_lighter_01                0.4s
```
Sons de extintor, moscas, rádio e páginas não estão nos arquivos soltos nem no MP.bank; devem estar no `ZomboidSound.bank` (735 MB, acima do limite de cópia remota): extrair no PC se precisar.
