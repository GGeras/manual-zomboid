import { THREE, PZ, pose, S, Z, light, sparks, puff, U } from './engine.js';
import { run } from './ep3d.js';
import { casaDentro, sobrado, coneLuz, camOn, rota, VEL, clima, tileLuz, WALL_H } from './cenarios.js';
const { clamp, lerp, easeOut, face, T } = U;
// EP17 v3 (revisão do Jose 22/11): mais zumbis em todos os exemplos; tábuas por FORA com ele do lado de fora e por DENTRO com ele dentro;
// metal = MAÇARICO + MÁSCARA DE SOLDA (malhas do jogo Blowtorch.x e M_WelderMask.x + animação Bob_IdleBlowtorch_High); casa de fora FECHADA,
// com 2º andar de verdade (paredes, janelas, piso e telhado); cortina visível; descida da corda sincronizada (desce na velocidade das mãos
// e, ao tocar o chão, sai andando); final com vários zumbis nas janelas e ele recuando com medo.
// Sprites do jogo: tábuas carpentry_01_8–15, chapa constructedobjects_01_25, barras _53, cortina fixtures_windows_curtains_01_25/_29,
// corda de lençol crafted_01_1 + _9. Zumbi entra pela janela com a animação original (espreme, cai, levanta).
const CASA = casaDentro(-60, 80, { janelaLivre: true, janelaN2: 7 }), C = CASA.C;
const JX = C.x(3), JZ = C.z(-.5), KX = C.x(7);    // janela da sala e da cozinha (parede do fundo, N)
const ov = (name, lado = 'N', i = 3, j = 0, off = .05) => { const m = C.parede(lado, name, i, j, { off }); m.visible = false; return m; };
const PLK = [9, 11, 13, 15].map(n => ov('carpentry_01_' + n)), PLKW = [8, 10, 12, 14].map(n => ov('carpentry_01_' + n, 'W', 0, 3)), PLKK = [9, 11, 13, 15].map(n => ov('carpentry_01_' + n, 'N', 7, 0));
const SHEET = ov('constructedobjects_01_25'), BARS = ov('constructedobjects_01_53');
const OVS = [...PLK, ...PLKW, ...PLKK, SHEET, BARS];
const planks = (n, nw = 0, nk = 0, shake = 0, f = 0) => { PLK.forEach((m, i) => { m.visible = i === n - 1; m.position.x = 3 + (shake ? Math.sin(f * 2.3) * .03 * shake : 0); });
  PLKW.forEach((m, i) => { m.visible = i === nw - 1; }); PLKK.forEach((m, i) => { m.visible = i === nk - 1; m.position.x = 7 + (shake ? Math.sin(f * 2.7 + 1) * .03 * shake : 0); }); };
// itens do jogo presos nos ossos: martelo e maçarico na mão (Bip01_Prop1), máscara de solda na cabeça
const HAM = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_hammer', 'hammer'));
const TORCH = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_blowtorch', 'blowtorch'));
const MASK = PZ.attach(S, 'Bip01_Head', PZ.propMesh('weldermask', 'weldermask'));
const clip = (h, name, lf, o = {}) => { pose(h, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false] }, o));
  if (h === S) { S.bat.visible = false; S.hammer.visible = false; HAM.visible = !!o.ham; TORCH.visible = !!o.torch; MASK.visible = !!o.mask; } };
const hideZ = () => Z.forEach(z => pose(z, { vis: false }));
const inside = (kind = 'dawn') => { pose(S, { vis: false }); hideZ(); light(kind); tileLuz(kind === 'dark' ? '#7a84a0' : kind === 'dawn' ? '#f0d8c0' : '#ffffff'); clima('', 0); C.show(); OVS.forEach(m => { m.visible = false; }); };
// zumbis do lado de fora: batendo na janela da sala (fila de trás espera), na da cozinha e na janela lateral (W)
// fila de trás: um pouco mais ao norte e a oeste, para continuar aparecendo pelo vão da janela (a câmera olha na diagonal) sem a cabeça passar por cima da parede
const bang = (z, lf, x, row = 0, ph = 0, dx = 0) => clip(z, 'z_doorbang', lf + ph, { x: x + dx - row * .34, z: JZ - .55 - row * .36, ry: 0 });
const bangW = (z, lf, dz = 0, ph = 0) => clip(z, 'z_doorbang', lf + ph, { x: C.x(-.5) - .55, z: C.z(3) + dz, ry: Math.PI / 2 });
const climb = (z, t, x = JX) => clip(z, 'z_climbwin', t, { x, z: JZ - .3 + Math.min(1, t / 70) * 1.5, ry: 0, loop: false });
const crowd = (lf, o = {}) => { if (o.n !== false) bang(Z[1], lf, JX, 1, 17, .1); bang(Z[2], lf, KX, 0, 9); if (o.k2 !== false) bang(Z[5], lf, KX, 1, 30, .1); if (o.w) { bangW(Z[3], lf, 0, 5); bangW(Z[4], lf, -.75, 22); } };
const WIN = C.at(3.15, .08);   // na frente da janela da sala, de frente para ela
const hammerAt = (lf) => clip(S, 's_hammer', lf, { x: WIN.x, z: WIN.z, ry: Math.PI, ham: true });
const camIn = (c, h, sy = .76) => camOn(c, JX + .6, JZ + 1.6, h, sy);
const camWide = (c, h, sy = .74) => camOn(c, (JX + KX) / 2 + .3, JZ + 1.9, h, sy);   // as duas janelas do fundo (sala e cozinha) no quadro
// sobrado visto de fora — casa fechada, 2 andares
const LUZ = new THREE.MeshBasicMaterial({ color: '#1d2a33' });
const SOB = sobrado(20, 40, { luz: LUZ }), SC = SOB.C;
const CONE = coneLuz(SC, -2, 0, { len: 5.4, wide: 5 });
// cortina: aberta (luz sai) e fechada (fica clara por trás, mas a luz não sai). Material próprio: não escurece com a noite
const own = (m, col) => { m.material = m.material.clone(); m.material.color.set(col); return m; };
const SCUR = own(SC.parede('N', 'fixtures_windows_curtains_01_25', -2, 0, { off: -.04 }), '#f6dfb4'), SCUR_O = own(SC.parede('N', 'fixtures_windows_curtains_01_29', -2, 0, { off: -.04 }), '#ffe7bd');
const ROPE = [SC.parede('N', 'crafted_01_1', 0, 0, { off: .04, y: WALL_H }), SC.parede('N', 'crafted_01_9', 0, 0, { off: .04 })];
const SPLK = [SC.parede('N', 'carpentry_01_15', -2, 0, { off: .04 }), SC.parede('N', 'carpentry_01_15', 2, 0, { off: .04 })];
const OPLK = [9, 11, 13, 15].map(n => SC.parede('N', 'carpentry_01_' + n, 2, 0, { off: .04 }));   // tábuas por FORA, janela do térreo i = 2
const outside = (kind) => { pose(S, { vis: false }); hideZ(); light(kind); clima('', 0); SC.show(); [SCUR, SCUR_O, CONE, ...ROPE, ...SPLK, ...OPLK].forEach(m => { m.visible = false; }); LUZ.color.set('#1d2a33'); };
const walkZ = (z, lf, pts, sp = 1.6, ph = 0) => { const p = rota(pts, lf / 30, VEL.z_walk * sp); clip(z, p.fim ? 'z_doorbang' : 'z_walk', lf + ph, { x: p.x, z: p.z, ry: p.fim ? (pts.ry ?? p.ry) : p.ry }); return p; };
const W2 = (i, j) => { const p = SC.at(i, j); return [p.x, p.z]; };
run([
  // 0 — janela = porta da horda: um entra se espremendo pela janela, outros batendo atrás e nas outras janelas
  (lf, f, len, c) => { inside('dawn'); climb(Z[0], 20 + lf * 1.25); climb(Z[2], lf * 1.4, KX); bang(Z[1], lf, JX, 1, 17, .1); bang(Z[5], lf, KX, 1, 30, .1); camWide(c, lerp(10.4, 9.4, easeOut(lf / len)), .7); c.shake(lf - 40, .08); },
  // 1 — barricada = vida extra: a horda bate; cada batida derruba uma tábua; zerou, o primeiro entra
  (lf, f, len, c) => { inside('dawn'); const h = [.30, .46, .62].filter(k => lf > len * k).length; planks(3 - h, 3, 2, 1, f);
    if (lf < len * .72) bang(Z[0], lf, JX); else climb(Z[0], (lf - len * .72) * 1.9); if (lf < len * .84) bang(Z[1], lf, JX, 1, 17, .1); else climb(Z[1], (lf - len * .84) * 1.9); bang(Z[2], lf, KX, 0, 9); bang(Z[5], lf, KX, 1, 30, .1); [.30, .46, .62].forEach(k => c.shake(lf - len * k, .1));
    if (h < 3 && lf % 30 < 4) puff(JX, 1.3, JZ + .1, lf % 30, { n: 2, seed: lf, life: 12, size: .06, rise: .1, color: '#c9a77a', op: .6 }); camWide(c, 9.8, .72); },
  // 2 — martelo, tábua e pregos: pregando por dentro enquanto os zumbis chegam lá fora
  (lf, f, len, c) => { inside('day'); planks(lf < len * .3 ? 0 : lf < len * .6 ? 1 : 2, 2); hammerAt(lf);
    walkZ(Z[1], lf, [[JX - 4, JZ - 3.5], [JX - .55, JZ - 1.17]], 1.4); walkZ(Z[2], lf, [[KX - 3.5, JZ - 4.5], [KX, JZ - .55]], 1.2, 11); camWide(c, 9.2, .78); },
  // 3 — até 4 de cada lado: POR FORA ele fica do lado de fora da casa; POR DENTRO, dentro (as tábuas sobem 1 → 4)
  (lf, f, len, c) => { const k = lf / len;
    if (k < .48) { outside('day'); tileLuz('#ffffff'); OPLK.forEach((m, i) => { m.visible = i === clamp(Math.floor((k - .06) / .09) + 1, 0, 4) - 1; }); SPLK[0].visible = true;
      const p = SC.at(2.15, .1); clip(S, 's_hammer', lf, { x: p.x, z: p.z, ry: Math.PI, ham: true });
      walkZ(Z[1], lf, [W2(8.5, 7), W2(4.6, 3.9)], 1.3, 4); walkZ(Z[2], lf, [W2(10, 5), W2(6.4, 2.8)], 1.2, 13); camOn(c, p.x - .6, p.z + .4, 7.4, .78); }
    else { inside('day'); planks(clamp(Math.floor((k - .45) / .09) + 1, 0, 4), 2); hammerAt(lf); crowd(lf, { n: false }); camIn(c, 7, .78); } },
  // 4 — chapa de metal: MAÇARICO na mão + MÁSCARA DE SOLDA no rosto (animação original de solda), faíscas e a chapa presa
  (lf, f, len, c) => { inside('day'); const on = lf > len * .3; SHEET.visible = on; planks(0, 2);
    clip(S, 's_blowtorch', lf, { x: WIN.x, z: WIN.z + .05, ry: Math.PI, torch: true, mask: true });
    if (lf > len * .12 && lf < len * .92) { sparks(JX + .05 + Math.sin(f * .21) * .25, 1.25 + Math.sin(f * .3) * .3, JZ + .12, lf % 12, 8, Math.floor(lf / 12)); puff(JX, 1.3, JZ + .2, lf % 20, { n: 1, seed: Math.floor(lf / 20), life: 20, size: .08, rise: .3, color: '#cfd6e0', op: .35 }); }
    crowd(lf, { n: false }); camWide(c, 8.8, .78); },
  // 5 — barras de metal: também com maçarico e máscara; depois ele recua e os zumbis aparecem entre as barras
  (lf, f, len, c) => { inside('day'); const weld = lf < len * .36; BARS.visible = lf > len * .14; planks(0, 2);
    if (weld) { clip(S, 's_blowtorch', lf, { x: WIN.x, z: WIN.z + .05, ry: Math.PI, torch: true, mask: true }); if (lf > len * .06) sparks(JX + .05, 1.3 + Math.sin(f * .3) * .25, JZ + .12, lf % 12, 7, Math.floor(lf / 12)); }
    else clip(S, 's_idle', lf, { x: C.x(4.4), z: C.z(2.7), ry: face(C.x(4.4), C.z(2.7), JX, JZ) });
    bang(Z[0], lf, JX); crowd(lf); camWide(c, 9, .76); },
  // 6 — noite, de fora (casa inteira, fechada): luz acesa sai em CONE pela janela → vários zumbis vêm; cortina fechada → luz não sai, passam reto
  (lf, f, len, c) => { outside('dark'); tileLuz('#55607e'); const lit = lf < len * .54; SCUR.visible = !lit; SCUR_O.visible = lit; CONE.visible = lit; LUZ.color.set(lit ? '#ffcf7a' : '#7a5a30'); CONE.material.opacity = .85;
    const tgt = [W2(-2.2, 1.4), W2(-1.6, 2.0), W2(-2.9, 2.1), W2(-2.3, 2.7)];
    [[W2(-10, 5), 0], [W2(-9, 8), 1], [W2(5, 8), 2], [W2(-12, 2), 3]].forEach(([a, n], k) => {
      if (lit) { const pts = [a, tgt[k]]; pts.ry = Math.PI; walkZ(Z[n], lf, pts, 2.1, k * 9); }
      else { const t = lf - len * .54, b = tgt[k], e = W2(12 + k, 4.4 + k * .6); walkZ(Z[n], t, [b, [b[0] + 1.2, b[1] + 2], e], 2.2, k * 9); } });
    camOn(c, SC.x(-1.6), SC.z(1.9), 10.6, .64); },
  // 7 — saída de emergência: janela do ANDAR DE CIMA, sem barricada, corda de lençol. Desce na velocidade das mãos e, no chão, sai andando
  (lf, f, len, c) => { outside('dawn'); tileLuz('#f2dcc4'); ROPE.forEach(m => { m.visible = true; }); SPLK.forEach(m => { m.visible = true; });
    const V = .62, RATE = 31 / (.5 / V * 30), y0 = WALL_H + .75, t0 = len * .06, y = y0 - Math.max(0, lf - t0) / 30 * V, X = SC.x(0), ZW = SC.z(-.5) + .34;
    if (y > 0) { clip(S, 's_climbrope', -Math.max(0, lf - t0) * RATE, { x: X, z: ZW, ry: Math.PI }); S.g.position.y = y; }
    else { const tg = lf - t0 - y0 / V * 30; const p = rota([[X, ZW], [X + .6, ZW + .45], [SC.x(3.4), SC.z(.8)]], tg / 30, VEL.s_walk); clip(S, 's_walk', tg, { x: p.x, z: p.z, ry: p.ry }); }
    // zumbis forçando a porta da frente e a janela do térreo (por isso ele sai por cima)
    [[-1.1, .25, 0], [-.6, .7, 1], [-2.1, .3, 2]].forEach(([i, j, n]) => { const p = SC.at(i, j); clip(Z[n], 'z_doorbang', lf + n * 9, { x: p.x, z: p.z, ry: Math.PI }); });
    camOn(c, SC.x(.8), SC.z(.4), 10.8, .87); },
  // 8 — base sem saída é caixão: zumbis em todas as janelas quebrando as tábuas; ele recua de costas até o canto e treme de medo
  (lf, f, len, c) => { inside('dark'); const k = lf / len; planks(Math.max(0, 4 - Math.floor(k * 12)), Math.max(0, 4 - Math.floor(k * 6)), Math.max(0, 4 - Math.floor(k * 9)), 1, f);
    // as tábuas caem depressa e eles começam a entrar pelas duas janelas (o 1º pela sala, o 2º pela cozinha), outros esperando atrás
    if (k < .34) bang(Z[0], lf, JX); else climb(Z[0], (lf - len * .34) * 2.4); if (k < .46) bang(Z[2], lf, KX, 0, 9); else climb(Z[2], (lf - len * .46) * 2.4, KX);
    bang(Z[1], lf, JX, 1, 17, .1); bang(Z[5], lf, KX, 1, 30, .1); bang(Z[6], lf, JX, 2, 40, .05); bangW(Z[3], lf, 0, 5); bangW(Z[4], lf, -.4, 22);
    const a = C.at(3.5, 2.7), b = C.at(4.3, 3.8), back = rota([[a.x, a.z], [b.x, b.z]], lf / 30, .55), look = face(back.x, back.z, JX, JZ);
    if (!back.fim) clip(S, 's_walkslow', -lf, { x: back.x, z: back.z, ry: look }); else clip(S, 's_shiver', lf, { x: b.x, z: b.z, ry: look });
    [.2, .45, .7].forEach(q => c.shake(lf - len * q, .12)); camOn(c, C.x(3.6), C.z(1.6), lerp(10.4, 9.6, k), .72); }
]);
