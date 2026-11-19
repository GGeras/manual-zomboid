---
tema: armas-de-fogo
status: validado
atualizado: 2026-11-19
---
# Armas de fogo — fatos validados (B42)

Só entra aqui fato com **build B42.20+ ou arquivo do jogo** e **fonte**. Mudou algo? Edite esta tabela e rode `python ferramentas/validar.py --gerar`.

| id | fato | build | fonte | usado em |
|---|---|---|---|---|
| arma-fogo-barulho | Raio do som do tiro (SoundRadius): pistola M9 100 quadrados, escopeta JS-2000 200; zumbis no raio ouvem | B42 | media/scripts/generated/items/weapon.txt (arquivos do jogo do Jose, 09/11/2026); projectzomboid.wiki aiming-reloading (escopeta ~200) | 11 |
| arma-fogo-municao | Pistola M9 usa 9mm num pente de 15; escopeta JS-2000 usa cartucho, 5 no tubo, sem pente | B42 | media/scripts/generated/items/weapon.txt (arquivos do jogo do Jose, 09/11/2026) + normal.txt (9mmClip MaxAmmo 15) | 11 |
| arma-fogo-pontaria | Cada nível de Pontaria dá +4 de chance de acerto (pistola e escopeta); pânico reduz a precisão; mira na cabeça conta | B42 | media/scripts/generated/items/weapon.txt (arquivos do jogo do Jose, 09/11/2026) (AimingPerkHitChanceModifier 4); projectzomboid.wiki aiming-reloading | 11 |
| arma-fogo-recarga | Pistola recarrega pelo pente (encher o pente antes); escopeta põe cartucho por cartucho; recarregar perto de zumbi é quando agarram | B42 | media/scripts/generated/items/weapon.txt (arquivos do jogo do Jose, 09/11/2026) (WeaponReloadType handgun/shotgun, InsertAmmoStart/Stop); projectzomboid.wiki aiming-reloading | 11 |
| arma-fogo-trava | Pistola e escopeta podem travar (JamGunChance 1 e 2); levar arma corpo a corpo de reserva | B42 | media/scripts/generated/items/weapon.txt (arquivos do jogo do Jose, 09/11/2026); projectzomboid.wiki aiming-reloading | 11 |
