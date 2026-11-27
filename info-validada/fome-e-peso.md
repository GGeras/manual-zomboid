---
tema: fome-e-peso
status: validado
atualizado: 2026-11-23
---
# Fome e peso do corpo — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| fome-niveis | Fome: Fome Leve, Fome, Fome Intensa, Morrendo de Fome ("A fome está tirando suas forças"). Moodle novo da B42 quando come bem: Saciado, Bem Alimentado, Empanturrado, Cheio até Estourar | B42.22 | arquivos do jogo B42.22: media/lua/shared/Translate/PTBR/Moodles.json Moodles_Hungry_* e Moodles_FoodEaten_* | 29 |
| peso-dieta | O próprio jogo avisa: "Lembre-se de ter uma dieta balanceada ou você pode ganhar ou perder peso!" | B42.22 | arquivos do jogo B42.22: SurvivalGuide_eating_drinking_description | 29 |
| peso-calorias | Peso depende de calorias, não do moodle de fome: caldo, frutas e legumes matam a fome sem engordar; manteiga, banha, óleo, chocolate, sorvete, queijo e carne gorda engordam | B42.20.3 | projectzomboid.wiki/guides/nutrition-weight (42.20.3) | 29 |
| peso-tracos | Abaixo do Peso / Muito Abaixo do Peso / Emaciação: pouca força, pouca resistência, mais lesões. Acima do Peso / Muito Acima do Peso: corrida mais lenta, resistência baixa, mais lesões | B42.22 | arquivos do jogo B42.22: UI.json UI_trait_underweight/veryunderweight/emaciated/overweight/obese desc | 29 |
| peso-sistema | Modo Apocalipse: "Sistema de Nutrição" ligado — o valor nutricional afeta a condição física; desligado, ninguém ganha nem perde peso | B42.22 | arquivos do jogo B42.22: Sandbox/Apocalypse.lua Nutrition = true + Sandbox_Nutrition_tooltip | 29 |
| peso-cozida | Refeição cozida é mais nutritiva, sacia por mais tempo e reduz o risco de intoxicação alimentar | B42.22 | arquivos do jogo B42.22: SurvivalGuide_entrie8moreinfo | 29, 30 |
| peso-inverno | No inverno você gasta mais calorias; bem alimentado resiste mais ao frio | B42.22 | projectzomboid.wiki/guides/nutrition-weight (42.20.3) + arquivos do jogo B42.22: SurvivalGuide_entrie11moreinfo | 29 |
| peso-agua-auto | Água limpa no inventário principal é bebida automaticamente para controlar a sede (padrão) | B42.22 | arquivos do jogo B42.22: SurvivalGuide_eating_drinking_description | 29 |
