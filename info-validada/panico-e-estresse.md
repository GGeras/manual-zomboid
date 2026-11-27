---
tema: panico-e-estresse
status: validado
atualizado: 2026-11-23
---
# Pânico e estresse — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| pan-niveis | Pânico: Nervosismo, Em Alerta, Medo, Terror. Textos: "Mãos trêmulas" (2), "Tremores pelo corpo inteiro" (3) | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Panic_* | 24 |
| est-niveis | Estresse: Tensão, Agitação, Estresse, À Beira do Colapso. Texto nível 3: "Mãos trêmulas. Impossível pensar direito." | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Stress_* | 24 |
| pan-mira | Os Moodles mexem na chance de acertar o tiro: sobrevivente cansado e em pânico, com péssima pontaria, não acerta muitos zumbis. Existe a opção "Multiplicador dos Moodles na Pontaria" | B42.22 | arquivos do jogo B42.22: SurvivalGuide_entrie4moreinfo + Sandbox.json Sandbox_FirearmMoodleMultiplier | 24 |
| pan-corpo | No corpo a corpo, força e precisão dependem das habilidades e dos Humores (moodles) | B42.22 | arquivos do jogo B42.22: SurvivalGuide_entrie3moreinfo | 24 |
| pan-tracos | Traços: Corajoso (menos pânico), Covarde (muito mais), Dessensibilização (muito menos e ignora desconforto), Agorafóbico (pânico ao ar livre), Claustrofóbico (em ambientes internos pequenos) | B42.22 | arquivos do jogo B42.22: UI.json UI_trait_brave/cowardly/Desensitized/agoraphobic/claustro desc | 24 |
| pan-calmante | Calmantes: "Reduz o pânico" | B42.22 | arquivos do jogo B42.22: Tooltip_PillsBetablocker + ItemName Base.PillsBeta | 24 |
| est-fumante | Fumante: estresse e tristeza diminuem depois de fumar; a tristeza aumenta quando fica sem fumar | B42.22 | arquivos do jogo B42.22: UI.json UI_trait_SmokerDesc | 24, 28 |
| est-leitura | Ler reduz estresse e tédio: Livro mais que Revista em Quadrinhos, que vale mais que Revista | B42.22 | arquivos do jogo B42.22: scripts/generated/items/literature.txt (StressChange, BoredomChange) + Tooltip_literature_* | 24, 28 |
| pan-tracos-custo | Pontos na criação: Corajoso custa 4; Covarde devolve 2; Dessensibilização 0 (custo 0 no arquivo); Agorafóbico devolve 4; Claustrofóbico devolve 4 | B42.22 | arquivos do jogo B42.22: media/scripts/generated/characters/character_traits.txt (Cost: brave 4, cowardly -2, desensitized 0, agoraphobic -4, claustrophobic -4) | 24 |
| pan-veterano-desens | A profissão Veterano (custo −8) concede o traço Dessensibilização já na criação (não se escolhe à parte) | B42.22 | arquivos do jogo B42.22: media/scripts/generated/characters/character_professions.txt (base:veteran, GrantedTraits = base:desensitized); lua/shared/Translate/PTBR/UI.json UI_prof_Veteran = "Veterano" | 24 |
