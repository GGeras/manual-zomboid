# Manual Zomboid — Animação de personagens (v3) e animações do jogo

## Animação v3 (engine.js) — vale para todos os vídeos novos
- `g.rotation.order = 'YXZ'`: o corpo cai na direção em que está virado.
- Ações por poses-chave: antecipação → impacto rápido → parada no golpe → atravessa → recupera (`ACT`, `kf`, `rig`).
- Arma num "punho" (`h.grip`) que gira em relação ao antebraço.
- Morte do zumbi (`zDead`): cabeça estala, joelhos cedem, queda acelerada, quique; 3 estilos.
- Zumbis com jeito próprio de andar, ataque agarrando com os dois braços e boca abrindo.

### API (em `pose(h, {...})`)
- **Sobrevivente:**
  - `guard: 1`;
  - `swing: strike(lf, hit)` + `swoosh(S, fase)`;
  - `shove: shoveAt(lf, hit)`;
  - `stomp: stompAt(lf, hit)`;
  - `sit: 0..1`, `slump: 0..1` (ofegante), `crouch`, `lean`, `hold`.
- **Zumbi:**
  - `dead`: frames desde o golpe; `deadStyle` 0 costas / 1 girando / 2 de bruços;
  - `flinch`, `flinchDist`, `jolt` (caído levando pisão), `attack`: fase.
- **Efeitos:** `hitFx(x, y, z, idade, slot)`, `burst(..., direção)`, `c.shake`, `puff(...)` (fumaça/vapor), `flashAt` (clarão de tiro, intensidade 9–12).
- `hit` = frame (relativo à cena) do impacto. Som e HUD usam o mesmo frame.

### Medidas úteis
- Zumbi a 1,45 do sobrevivente para o taco pegar na cabeça.
- Sentado: `ry` ≈ 2,25 (de lado para a câmera), senão as pernas somem.
- Golpe cansado/lento: fase `(lf - hit + 16) / 38`.
- Objeto na mão: `inHand(h, o, s, rx)` / `inHandL` em `sets.js`, com rotação YXZ.

### Conferir antes de renderizar
Gere quadros seguidos com `render.mjs --still t1,t2,...` e olhe pose por pose (ou a `inspecao/folha.png` do rascunho).

## Animações do jogo (`assets/pz`, 30 fps)
- Uso: `pose(Z[i], { x, z, ry, clip: ['z_walk', quadro, loop] })`.
  - Com `clip`, a pose do engine é ignorada naquele personagem.
- `zWalk()` já usa o andar do jogo (`z_walk` / `z_walk2`). Com `dead`, `attack`, `bite` ou `flinch`, ele volta para a pose do engine.
- Disponíveis:
  - `z_walk`, `z_walk2`, `z_idle`, `z_lunge`, `z_hit`;
  - `z_death` (`loop = false`, `quadro = lf - frameDoGolpe`);
  - `z_shovefall`.
  - `z_shotfall` / `z_shotchest` (do EP11) NÃO estão neste pacote: zumbi baleado usa `dead` do engine.
- O personagem principal usa a animação v3 (golpe, empurrão, pisão, sentar).

## Armas do jogo
- Taco, martelo, pistola, escopeta e faca são malhas originais. `PZ.weapon(nome, textura)`.
- `S.bat`, `S.hammer` e `S.gun` já usam as do jogo. Esconda com `S.bat.visible = false` quando não usar.
- Arma de fogo na mão: presa ao tronco + IK (`reach`, ver `ep11.js`). Nunca "em pé"/T-pose.

## Cenários prontos (`sets.js`)
- Casa em corte: `house({dark})`, `HA(x, z)`.
- Rio: `river`, `RA`.
- Fogo e chuva: `fire(x, z, f)`, `rain(cx, cz, f, k)`.
- Coletor, panela, garrafa e itens soltos: `item(o, x, y, z, ry, s)`.
- Luz: `light('day' | 'dawn' | 'dark')`; à noite use `dawn`.
- Cenários extras longe da cidade (nada de rua/árvore atrás).
