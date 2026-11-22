import { THREE, PZ, scene, pose, S, Z, zWalk, light, puff, waves, prop, U } from './engine.js';
import { run } from './ep3d.js';
import { fazenda, camOn, rota, VEL, clima, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut, face, T, R } = U;
const sm = t => { t = clamp(t); return t * t * (3 - 2 * t); };
// EP16 v3 (revisão do Jose 2026-11-21): animais com ESQUELETO e animações ORIGINAIS do jogo (anims_X/Cow, Sheep, Chicken):
// andar, correr, parado, comer e reação ao carinho. Frente = +z (antes a malha estava virada: andava de costas).
// Velocidade de deslocamento = velocidade natural do passo da animação (medida no pé) × escala → o casco não patina.
// Cercado C com o galinheiro do jogo e dois cochos. Ordenha colada na vaca, tosquia troca a malha (com lã → tosquiada), carinho com a reação do animal.
const FZ = fazenda(-10, 75), C = FZ.C;
const W = (i, j) => C.at(i, j);
const PEN = { A: [C.x(-11) - .3, C.x(-3) + .3, C.z(-8) - .3, C.z(-1) + .3], B: [C.x(2) - .3, C.x(10) + .3, C.z(-8) - .3, C.z(-1) + .3], C: [C.x(2) - .3, C.x(8) + .3, C.z(2) - .3, C.z(7) + .3] };
const SCALE = { A_cow: .74, A_sheep: .82, A_sheared: .82, A_hen: 1, A_rooster: 1 };   // tamanho relativo ao personagem como no jogo (vaca na altura do peito)
// velocidade natural do passo de cada animação (unidades do modelo/s, medida no pé de apoio) → sem patinar
const NAT = { cow_walk: .828, cow_run: 3.645, sheep_walk: .423, sheep_run: 2.531, hen_walk: .381, hen_run: 1.37, rooster_walk: .378, rooster_run: 1.366 };
const SP = { A_cow: 'cow', A_sheep: 'sheep', A_sheared: 'sheep', A_hen: 'hen', A_rooster: 'rooster' };
const mk = (key, p, ry, o = {}) => { const s = 1.94 * SCALE[key], g = PZ.animalPZ(key, s); g.position.set(p.x, 0, p.z); g.rotation.y = ry; prop(g);
  return Object.assign({ g, key, sp: SP[key], s, home: new THREE.Vector3(p.x, 0, p.z), ry, pen: null, off: 0 }, o); };
const play = (a, c, fr, loop = true) => PZ.animalClip(a.g, a.sp + '_' + c, fr, loop);
const vel = (a, c) => NAT[a.sp + '_' + c] * a.s;                   // unidades do mundo por segundo
const COW = mk('A_cow', W(-6, -4.5), .9, { off: 0 }), COW2 = mk('A_cow', W(-9, -6.2), -.4, { off: 77 }), SHEEP = mk('A_sheep', W(6, -4.4), 2.2, { off: 31 }), SHEEP2 = mk('A_sheep', W(8.3, -6), .5, { off: 120 });
const SHORN = mk('A_sheared', W(6, -4.4), 2.2);                    // a mesma ovelha depois da tosquia
const ROOST = mk('A_rooster', W(7.7, 5.1), 2.6, { off: 40 });
COW.pen = COW2.pen = 'A'; SHEEP.pen = SHEEP2.pen = 'B'; ROOST.pen = 'C';
// galinhas no espaço livre do cercado C (o galinheiro ocupa i 3..4, j 3..4; cochos em (6,3) e (6,5))
const HENS = [[6.1, 3.9, .2, 'eat'], [6.3, 5.9, -.3, 'eat'], [4.6, 6.3, 2.4, 'walk'], [7.7, 6.4, -1.2, 'idle'], [7.6, 3.7, 1.9, 'walk']].map(([i, j, r, act], n) => { const h = mk('A_hen', W(i, j), r, { off: n * 37, act }); h.pen = 'C'; return h; });
ROOST.act = 'idle';
const ALL = [COW, COW2, SHEEP, SHEEP2, ROOST, ...HENS];
// cerca que balança quando o bicho bate: guarda as peças de cerca dos cercados A e B (cada uma treme sozinha no ponto da batida)
const FENCE = []; C.G.children.forEach(m => { if (/^fencing_01_1[67]$/.test(m.userData.tile || '') && m.position.z < 0) FENCE.push(m); });
// vai-e-volta entre duas cercas: corre, bate (pausa curta) e vira. Devolve {d (0..L), dir (+1/-1), moving, k (0..1 da virada), hitN}
function pingpong(t, L, v, pause) { const run = L / v, per = 2 * (run + pause); let u = ((t % per) + per) % per, leg = 0; if (u >= run + pause) { leg = 1; u -= run + pause; }
  const hitN = Math.floor(t / (run + pause));
  if (u < run) { const d = (u / run) * L; return { d: leg ? L - d : d, dir: leg ? -1 : 1, moving: true, k: 0, hitN, prog: hitN * L + d }; }
  return { d: leg ? 0 : L, dir: leg ? -1 : 1, moving: false, k: (u - run) / pause, hitN, prog: 0 }; }
const SHAKE = [];   // batidas recentes: { x, z, f0 }
// animais. o.stress 0..1: vacas e ovelhas correm de uma cerca à outra e batem; galinhas correm em volta. o.skip / o.only: controle por cena
function animals(f, o = {}) { const st = o.stress || 0, t = T(f); SHAKE.length = 0;
  ALL.forEach((a, i) => { const g = a.g; if (a === o.skip) return; g.visible = true; g.rotation.set(0, a.ry, 0); g.position.copy(a.home);
    if (st > .02 && (a.pen === 'A' || a.pen === 'B')) {
      // corre no eixo leste-oeste do cercado, na linha dele; quanto mais estresse, mais rápido
      const [x0, x1] = PEN[a.pen], L = (x1 - x0) - 2.4, rate = .55 + .45 * st, v = vel(a, 'run') * rate * .62, p = pingpong(t + a.off / 30, L, v, .5);
      const x = x0 + 1.2 + p.d, z = a.home.z; g.position.set(x, 0, z);
      if (p.moving) { g.rotation.y = p.dir > 0 ? Math.PI / 2 : -Math.PI / 2; play(a, 'run', p.prog / vel(a, 'run') * 30); }   // quadro = distância corrida (sem patinar)
      else { // bateu na cerca: recua um pouco e vira devagar para o outro lado
        const back = Math.sin(Math.min(1, p.k * 3) * Math.PI) * .18; g.position.x -= p.dir * back; g.rotation.y = (p.dir > 0 ? Math.PI / 2 : -Math.PI / 2) + sm(p.k) * Math.PI * (i % 2 ? 1 : -1);
        play(a, 'walk', p.k * 30 * .5 + i * 7); if (p.k < .4) SHAKE.push({ x: x + p.dir * .9, z, k: 1 - p.k / .4, st }); } }
    else if (st > .02 && a.pen === 'C') { // galinhas correm em volta sem parar (trajeto suave dentro do cercado), corpo virado para onde vai
      const [x0, x1, z0, z1] = PEN.C, cx = C.x(6.3), cz = C.z(5.2), w1 = .9 + (i % 3) * .17, w2 = 1.3 + (i % 2) * .21, ph = i * 1.7;
      const P = tt => [cx + Math.sin(w1 * tt + ph) * 1.6, cz + Math.sin(w2 * tt + ph * .6) * 1.15]; const [x, z] = P(t), [x2, z2] = P(t + .05);
      g.position.set(clamp(x, x0 + .3, x1 - .3), 0, clamp(z, z0 + .3, z1 - .3)); g.rotation.y = Math.atan2(x2 - x, z2 - z);
      const spd = Math.hypot(x2 - x, z2 - z) / .05; play(a, 'run', t * 30 * spd / (NAT[a.sp + '_run'] * a.s)); }
    else if (a.act === 'walk') { // galinha ciscando: anda devagar num círculo pequeno
      const r = .38, w = vel(a, 'walk') / r * (i % 2 ? 1 : -1), ang = t * w + a.off; g.position.set(a.home.x + Math.sin(ang) * r, 0, a.home.z + Math.cos(ang) * r);
      g.rotation.y = ang + Math.sign(w) * Math.PI / 2; play(a, 'walk', t * 30); }
    else play(a, a.act === 'eat' || (a.pen !== 'C' && i % 2) ? 'eat' : 'idle', f + a.off); });
  FENCE.forEach(m => { m.position.y = 0; m.rotation.z = 0; let s = 0; SHAKE.forEach(h => { const d = Math.hypot(m.position.x - h.x, m.position.z - h.z); if (d < 1.4) s = Math.max(s, h.k * h.st * (1 - d / 1.4)); });
    if (s > 0) m.rotation.z = Math.sin(T(f) * 40) * .07 * s; }); }
const ROPE = prop(new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 12 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: '#c8a96a' })));
function rope(a, b, sag = .25) { ROPE.visible = true; const p = ROPE.geometry.attributes.position; for (let i = 0; i < 12; i++) { const t = i / 11; p.setXYZ(i, lerp(a.x, b.x, t), lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * sag, lerp(a.z, b.z, t)); } p.needsUpdate = true; }
const boneW = (o, n) => { o.updateMatrixWorld(true); return o.userData.anim.bones[n].getWorldPosition(new THREE.Vector3()); };
const handL = () => { S.g.updateMatrixWorld(true); return S.pz.bones.Bip01_L_Hand.getWorldPosition(new THREE.Vector3()); };
const handR = () => { S.g.updateMatrixWorld(true); return S.pz.bones.Bip01_R_Hand.getWorldPosition(new THREE.Vector3()); };
const hearts = (x, y, z, lf) => { for (let i = 0; i < 3; i++) puff(x, y, z, (lf + i * 14) % 42, { n: 1, seed: i, life: 42, size: .1, rise: .5, color: '#ff8fb0', op: .7 }); };
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false] }, o)); S.bat.visible = false; S.hammer.visible = false; };
const base = (kind = 'day') => { light(kind); tileLuz(kind === 'dawn' ? '#ffe6cc' : '#ffffff'); clima('', 0); C.show(); };
// itens do jogo na cena: balde de leite embaixo da vaca, tesoura de tosquia na mão
const BUCKET = prop(PZ.icon3d('Item_Bucket_Milk', .42)), SHEARS = prop(PZ.icon3d('Item_SheepShears', .34));
// lado do animal: ponto a d unidades para a direita (+1) / esquerda (-1) do corpo, a z unidades para a frente
const side = (a, d, fz = 0) => ({ x: a.home.x + Math.sin(a.ry + Math.PI / 2) * d + Math.sin(a.ry) * fz, z: a.home.z + Math.cos(a.ry + Math.PI / 2) * d + Math.cos(a.ry) * fz });
const TRILHA = W(-.5, 1.2);
run([
  // 0 — animais da B42: a fazenda inteira, um cercado para cada espécie (todos animados: comem, olham em volta, galinhas ciscam)
  (lf, f, len, c) => { base('dawn'); SHORN.g.visible = false; BUCKET.visible = SHEARS.visible = false; animals(f); clip('s_idle', lf, { x: TRILHA.x, z: TRILHA.z, ry: Math.PI * 1.05 }); camOn(c, C.x(-.5), C.z(-2.6), lerp(17, 15, easeOut(lf / len)), .56); },
  // 1 — leva a vaca na corda pela trilha até o portão do cercado A: a vaca ANDA de frente atrás dele (passo do jogo, sem patinar)
  (lf, f, len, c) => { base(); SHORN.g.visible = false; BUCKET.visible = SHEARS.visible = false; animals(f, { skip: COW }); const path = [[C.x(-14), C.z(.5)], [C.x(-2.2), C.z(.5)]];
    const v = VEL.s_walk * .82, L = Math.hypot(path[1][0] - path[0][0], path[1][1] - path[0][1]), GAP = 2.1, dS = Math.min(GAP + lf / 30 * v, L);
    const p = rota(path, dS / v, v); p.fim = dS >= L; clip(p.fim ? 's_idle' : 's_walk', lf * .82, { x: p.x, z: p.z, ry: p.ry });
    const dc = dS - GAP, q = rota(path, dc / v, v), cw = COW.g; cw.visible = true; cw.position.set(q.x, 0, q.z); cw.rotation.set(0, q.ry, 0);
    if (p.fim) PZ.animalClip(cw, 'cow_idle', lf); else PZ.animalClip(cw, 'cow_walk', dc / vel(COW, 'walk') * 30);   // quadro da animação = distância andada
    rope(handL(), boneW(cw, 'Bip01_Head').add(new THREE.Vector3(0, -.12, 0)), p.fim ? .3 : .14); camOn(c, p.x - .8, p.z, 9, .8); },
  // 2 — comida, água e calma: olhando a vaca calma no cercado dela
  (lf, f, len, c) => { base(); ROPE.visible = false; animals(f); const p = W(-2.2, -3.6); clip('s_idle', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, COW.home.x, COW.home.z) }); camOn(c, p.x - 1.2, p.z, 9.2, .82); },
  // 3 — cochos: um com ração, outro com água (dentro do cercado A)
  (lf, f, len, c) => { base(); animals(f); const p = W(-5.2, -6.2); clip('s_idle', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, C.x(-6), C.z(-7)) }); camOn(c, p.x, p.z, 7.4, .8); },
  // 4 — zumbis do lado de fora não atacam, mas estressam; o GRITO (s_shout + "Hey!" do jogo) faz os bichos correrem e baterem na cerca
  (lf, f, len, c) => { base('dawn'); const shout = lf > len * .62 && lf < len * .78, st = sm((lf - len * .40) / (len * .2)) * .7 + (lf > len * .62 ? .3 : 0);
    animals(f, { stress: st }); [[-13.5, -6], [-13.5, -3.6], [-13.8, -1.6]].forEach(([i, j], n) => zWalk(Z[[1, 4, 7][n]], n, f, C.x(i), C.z(j) + Math.sin(T(f) * .4 + n) * .4, Math.PI / 2 + .3, .5));
    const p = W(-1.4, 1.4); if (lf > len * .58) clip(shout ? 's_shout' : 's_idle', shout ? lf - len * .62 : lf, { x: p.x, z: p.z, ry: face(p.x, p.z, COW.home.x, COW.home.z), loop: !shout }); else pose(S, { vis: false });
    waves(COW.home.x, COW.home.z, (lf - len * .22) % 40, { color: '#efe5cf', maxR: 4 }); camOn(c, C.x(-6.5), C.z(-2.6), 14, .62); },
  // 5 — galinheiro: galinhas e galo no cercado C, com o galinheiro e os dois cochos
  (lf, f, len, c) => { base(); animals(f); const p = W(9.6, 6.2); clip('s_idle', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, C.x(5.5), C.z(4.5)) }); camOn(c, C.x(5.6), C.z(5.2), 12.5, .72); },
  // 6 — leite (ordenha agachado colado na barriga da vaca, balde embaixo) e lã (tosquia com a tesoura; a lã sai e a ovelha fica tosquiada)
  (lf, f, len, c) => { base(); const wool = lf > len * .64; animals(f, { skip: wool ? SHEEP : null }); const a = wool ? SHEEP : COW;
    if (!wool) { const p = side(COW, .78, -.18); clip('s_milk', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, COW.home.x + Math.sin(COW.ry) * -.18, COW.home.z + Math.cos(COW.ry) * -.18) });
      PZ.animalClip(COW.g, 'cow_idle', lf + 40); const b = side(COW, .36, -.2); BUCKET.visible = true; BUCKET.position.set(b.x, .2, b.z); SHEARS.visible = false; SHORN.g.visible = false; camOn(c, COW.home.x, COW.home.z, 6.2, .74); }
    else { const k = (lf - len * .64) / (len * .36), shorn = k > .72; const p = side(SHEEP, .66, .05); clip('s_shear', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, SHEEP.home.x, SHEEP.home.z) });
      BUCKET.visible = false; SHEEP.g.visible = !shorn; SHORN.g.visible = shorn; const sg = shorn ? SHORN : SHEEP; sg.g.position.copy(SHEEP.home); sg.g.rotation.set(0, SHEEP.ry, 0); PZ.animalClip(sg.g, 'sheep_idle', lf);
      SHEARS.visible = true; SHEARS.position.copy(handR()).add(new THREE.Vector3(0, .04, 0));
      for (let i = 0; i < 4; i++) puff(SHEEP.home.x + (i - 1.5) * .12, .55, SHEEP.home.z, (lf * 1.3 + i * 11) % 36, { n: 1, seed: i + 3, life: 36, size: .13, rise: -.35, color: '#efe6d2', op: .9 });
      camOn(c, SHEEP.home.x, SHEEP.home.z, 5.8, .74); } },
  // 7 — acariciar a ovelha: animação original do personagem (s_petsheep) + a reação original da ovelha (Sheep_IdlePetting)
  (lf, f, len, c) => { base(); SHORN.g.visible = false; BUCKET.visible = SHEARS.visible = false; animals(f, { skip: SHEEP }); const s = SHEEP.home, p = side(SHEEP, .62, .32);
    SHEEP.g.visible = true; SHEEP.g.position.copy(s); SHEEP.g.rotation.set(0, SHEEP.ry, 0); PZ.animalClip(SHEEP.g, 'sheep_pet', lf);
    clip('s_petsheep', lf, { x: p.x, z: p.z, ry: face(p.x, p.z, s.x + Math.sin(SHEEP.ry) * .3, s.z + Math.cos(SHEEP.ry) * .3) }); camOn(c, s.x, s.z, 5.2, .74); },
  // 8 — fazenda bem cuidada
  (lf, f, len, c) => { base('dawn'); SHORN.g.visible = false; BUCKET.visible = SHEARS.visible = false; animals(f); clip('s_idle', lf, { x: TRILHA.x, z: TRILHA.z, ry: Math.PI * 1.05 }); camOn(c, C.x(-.5), C.z(-2.6), lerp(16, 14.5, easeOut(lf / len)), .56); }
]);
