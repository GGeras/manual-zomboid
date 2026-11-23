---
tema: resfriado-e-doenca
status: validado
atualizado: 2026-11-23
---
# Resfriado e doença — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| resf-niveis | Resfriado: Nariz Escorrendo, Resfriado, Resfriado Forte, Resfriado Terrível — espirros, depois tosse, "você se sente mal e com os movimentos lentos" (3) | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_HasACold_* | 27 |
| resf-causa | Chuva, neve e neblina podem deixar você congelando ou molhado — "Não pegue um resfriado!"; ficar molhado ou com frio por muito tempo traz o resfriado | B42.22 | arquivos do jogo B42.22: SurvivalGuide_seasons_and_weather_description + pzfans sickness guide (42.19) + supercraft cure-sickness (arquivos B42 stable) | 27 |
| resf-lenco | Lenço de Papel: "Equipe para abafar espirros e tosses" | B42.22 | arquivos do jogo B42.22: Tooltip_tissue_tooltip + ItemName Base.Tissue | 27 |
| resf-malva | Malva-comum: "Coma para aliviar sintomas de resfriado e gripe" (achada na Coleta) | B42.22 | arquivos do jogo B42.22: Tooltip_Mallow + ItemName Base.CommonMallow | 27 |
| doe-niveis | Doença: Mal-estar, Náusea, Doença, Febre ("Risco crescente de virar comida de rato") | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Sick_* | 27 |
| doe-capim | Capim-limão: "Coma para tratar intoxicação alimentar leve." | B42.22 | arquivos do jogo B42.22: Tooltip_LemonGrass + ItemName Base.LemonGrass | 27 |
| doe-tracos | Resiliente: menor propensão a doenças (e zumbificação mais lenta); Baixa Imunidade: maior propensão (e mais rápida) | B42.22 | arquivos do jogo B42.22: UI.json UI_trait_resilient/pronetoillness desc | 27 |
| doe-limpeza | Corpo sujo aumenta a chance de infecção em ferimentos; Sabão limpa melhor | B42.22 | arquivos do jogo B42.22: SurvivalGuide_clean_self_description | 27 |
