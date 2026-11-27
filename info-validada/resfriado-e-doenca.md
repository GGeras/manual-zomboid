---
tema: resfriado-e-doenca
status: validado
atualizado: 2026-11-23
---
# Resfriado e doença — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| resf-niveis | Resfriado: Nariz Escorrendo, Resfriado, Resfriado Forte, Resfriado Terrível — espirros, depois tosse, "você se sente mal e com os movimentos lentos" (3) | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_HasACold_* | 30 |
| resf-causa | Chuva, neve e neblina podem deixar você congelando ou molhado — "Não pegue um resfriado!"; ficar molhado ou com frio por muito tempo traz o resfriado | B42.22 | arquivos do jogo B42.22: SurvivalGuide_seasons_and_weather_description + pzfans sickness guide (42.19) + supercraft cure-sickness (arquivos B42 stable) | 30 |
| resf-lenco | Lenço de Papel: "Equipe para abafar espirros e tosses" | B42.22 | arquivos do jogo B42.22: Tooltip_tissue_tooltip + ItemName Base.Tissue | 30 |
| resf-espirro | Espirro e tosse fazem barulho e atraem zumbis; o Lenço de Papel equipado abafa os dois | B42.22 | confirmado no jogo pelo Jose (B42.22, 23/11/2026) + arquivos do jogo B42.22: Tooltip_tissue_tooltip | 30 |
| resf-malva | Malva-comum: "Coma para aliviar sintomas de resfriado e gripe" (achada na Coleta) | B42.22 | arquivos do jogo B42.22: Tooltip_Mallow + ItemName Base.CommonMallow | 30 |
| doe-niveis | Doença: Mal-estar, Náusea, Doença, Febre ("Risco crescente de virar comida de rato") | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Sick_* | 30 |
| doe-capim | Capim-limão: "Coma para tratar intoxicação alimentar leve." | B42.22 | arquivos do jogo B42.22: Tooltip_LemonGrass + ItemName Base.LemonGrass | 30 |
| doe-tracos | Resiliente: menor propensão a doenças (e zumbificação mais lenta); Baixa Imunidade: maior propensão (e mais rápida) | B42.22 | arquivos do jogo B42.22: UI.json UI_trait_resilient/pronetoillness desc | 30 |
| doe-limpeza | Corpo sujo aumenta a chance de infecção em ferimentos; Sabão limpa melhor | B42.22 | arquivos do jogo B42.22: SurvivalGuide_clean_self_description | 30 |
