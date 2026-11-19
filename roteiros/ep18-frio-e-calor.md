---
ep: 18
tema: Frio e Calor
responsavel: jose
status: validado
build: B42.22
fatos: [temp-corpo, temp-moodles, temp-frio, temp-calor, temp-roupa, temp-previsao]
video: (link do Drive em videos/LINKS.md)
---

# EP 18 — Frio e Calor · ROTEIRO FINAL (v5, 19/11/2026)

**Ideia-guia:** Quem manda é a temperatura do CORPO; a roupa é o controle. SEM números de temperatura (nem fala, nem tela).

Regras: selo `BUILD 42.22`; nada de número que não esteja na fala ou nos fatos abaixo; um elemento por vez; chips ≤ 24 letras; nomes EXATOS do jogo entre aspas simples.

Música: `the_inevitable` (ainda não aprovada pelo Jose — avisar).

## Frases (fala exata = `audio/ns18.json`)

**0.** [sério] "Frio e calor derrubam seu personagem sem zumbi nenhum."
- VISUAL: 3D: personagem na rua (dark/dawn) com vento; moodle pz:Status_TemperatureLow pisca.
- ÍCONES: Status_TemperatureLow
- SONS: ambientOutsideWindyNight

**1.** [calmo] "O jogo tem dois termômetros: o do clima e o do seu corpo. E quem decide se você fica bem é o do corpo."
- VISUAL: Split: termômetro CLIMA e termômetro CORPO, SEM números; o do clima 'empurra' o do corpo; o do CORPO ganha ✓.
- ÍCONES: —
- SONS: —

**2.** [confiante] "Quando o corpo sai do normal, aparece um moodle, que é o ícone de estado na lateral da tela. Quanto mais forte o moodle, pior."
- VISUAL: Moodle real na lateral (H.moodle com pz:Status_TemperatureLow) com os 4 nomes do jogo em sequência: Um Pouco de Frio → Frio → Congelando → Hipotermia.
- ÍCONES: Status_TemperatureLow, Status_TemperatureHot
- SONS: —

**3.** [calmo] "A roupa decide quanto o clima mexe nele: cada peça segura calor e corta o vento."
- VISUAL: Personagem 3D (roupa fixa, NÃO trocar) + ícones de peças de inverno; setas de vento; moodle pz:Status_Windchill ('Sensação de Frio').
- ÍCONES: Item_JacketPaddedGeneric, Item_WinterHatBlack, Item_ScarfGeneric, Status_Windchill
- SONS: ambientOutsideWindyNight

**4.** [sério] "Quando o corpo esfria, primeiro suas feridas param de sarar sozinhas. Depois, você luta e corre mais devagar."
- VISUAL: Termômetro do corpo na faixa FRIO; curativo com cura parada ✗ 'NÃO SARA'; depois 'MAIS LENTO' (luta/corrida).
- ÍCONES: Status_TemperatureLow, Item_Bandage, Item_Axe
- SONS: ambientOutsideWindyNight

**5.** [tenso] "Se continuar esfriando, vem a hipotermia, o corpo gelado demais: quase sem força pra lutar, sem correr, e você começa a perder vida."
- VISUAL: Termômetro no fundo (HIPOTERMIA, nome do moodle nível 4); chips 'SEM CORRER' e 'QUASE SEM ATAQUE'; barra de vida sem número descendo; coração.
- ÍCONES: Status_TemperatureLow, Mood_Pained
- SONS: heart

**6.** [sério] "O calor também cobra. Primeiro, mais sede e mais cansaço. Depois, fica lento como no frio. No extremo, hipertermia, o corpo quente demais: o mesmo castigo, perdendo vida."
- VISUAL: Termômetro sobe: Calor Desconfortável (texto do jogo: 'Você sente mais sede') → Superaquecimento → Insolação → Hipertermia (texto do jogo: 'O calor está consumindo sua vida'); sede + cansaço; vida descendo.
- ÍCONES: Status_TemperatureHot, Status_Thirst, Mood_Sleepy
- SONS: male_outofbreath_01, heart

**7.** [calmo] "Exemplo: inverno, você sai na chuva de casaco. A roupa molha, e roupa molhada perde o calor e gela o corpo."
- VISUAL: 3D chuva; moodle pz:Status_Wet com os nomes do jogo (Úmido → Molhado → Ensopado → Encharcado); termômetro do corpo desce.
- ÍCONES: Item_JacketPaddedGeneric, Status_Wet, Status_TemperatureLow
- SONS: ambientOutsideHeavyRain

**8.** [confiante] "Volta pra casa, troca por roupa seca e veste em camadas."
- VISUAL: Inventário: casaco MOLHADO sai ✗; ceroula → suéter → casaco entram em camadas ✓; Status_Wet some; termômetro volta ao normal.
- ÍCONES: Item_Longjohns, Item_Sweater_Black, Item_JacketPaddedGeneric, Status_Wet
- SONS: PZ_PutInBag

**9.** [calmo] "No verão, o contrário: tira as camadas, fica na sombra e bebe água pra matar a sede."
- VISUAL: 3D de dia; casaco sai ✗; garrafa d'água + som de beber; Status_Thirst some.
- ÍCONES: Item_JacketPaddedGeneric, Item_WaterBottle_Full, Status_Thirst
- SONS: ambientOutsideDayBirds, PZ_Drinking

**10.** [confiante] "Antes de sair, ouve a previsão do tempo no rádio e se veste pra ela."
- VISUAL: Rádio com ondas 'PREVISÃO' → personagem 3D saindo pela porta; CTA.
- ÍCONES: Item_Radio
- SONS: doorclose

## Fatos (todos já em `pipeline/fatos.json`)
| id | fato | build | fonte |
|---|---|---|---|
| temp-corpo | Moodles de frio/calor seguem a temperatura do corpo; a do ar só empurra | 42.19/B42.20 | pzfans heat moodle (42.19) + build42guide moodles (B42.20) |
| temp-moodles | Nomes dos níveis: Um Pouco de Frio, Frio, Congelando, Hipotermia; Calor Desconfortável, Superaquecimento, Insolação, Hipertermia; Úmido, Molhado, Ensopado, Encharcado; Sensação de Frio (vento) | B42.22 | arquivos do jogo B42.22 do Jose: lua/shared/Translate/PTBR/Moodles.json |
| temp-frio | Frio: cura natural para; depois luta/corrida mais lentas; hipotermia: quase sem ataque, sem correr, perde vida | B42.20 | build42guide moodles (B42.20) + projectzomboid.wiki weather + PTBR Moodles_Hypothermia_desc_lvl4 |
| temp-calor | Calor: mais sede ("Você sente mais sede") e cansaço; depois lento; hipertermia perde vida ("O calor está consumindo sua vida") | B42.22 | arquivos do jogo B42.22 do Jose: PTBR Moodles_Hyperthermia_desc_lvl1/lvl4 + pzfans 42.19 |
| temp-roupa | Roupa isola e corta vento; molhada perde isolamento; camadas finas somam; no calor tirar camadas, sombra e água | B42 | projectzomboid.wiki clothing-weather (B42) + pzfans 42.19 |
| temp-previsao | Rádio (AEBS) e TV dão a previsão do tempo | B42 | projectzomboid.wiki weather-systems (B42) |
