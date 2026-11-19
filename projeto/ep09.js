import { THREE, pose, S, Z, zWalk, light, puff, flashAt, waves, splat, winMat, houses, strike, U } from './engine.js';
import { run } from './ep3d.js';
import { HX, HZ, HA, house, stream, tubWater, potAt, pot, bottle, river, RVX, RVZ, RA, fire, rain, collector, item, inHand, itPlanks, itNails, itBags } from './sets.js';
const { R, clamp, lerp, ss, easeOut, face, T } = U;
const sm01 = t => { t = clamp(t); return t * t * (3 - 2 * t); };

// martelada (uma mão): k = 0..1 dentro de cada batida (sobe devagar, desce rápido)
function hammerArm(k) { const up = k < .6 ? sm01(k / .6) : 1 - Math.pow((k - .6) / .4, 2); S.aR.a.rotation.set(-.6 - up * 1.9, 0, -.15); S.aR.el.rotation.x = -.9 - up * .5; S.grip.rotation.x = .3 + up * .4; S.spine.rotation.x += (1 - up) * .12; }
// bebendo: leva a mão à boca
function drinkArm(k) { S.aR.a.rotation.set(lerp(-.4, -1.25, k), lerp(0, -.5, k), -.1); S.aR.el.rotation.x = lerp(-.6, -2.2, k); S.neck.rotation.x -= k * .35; }

run([
  // 0 — enchendo a garrafa na pia; a água engasga e para
  (lf, f, len, c) => { house({ flow: lf < 24 ? 1 : lf < 42 ? (Math.sin(lf * 1.9) > .1 ? .7 : 0) * (1 - (lf - 24) / 18) : 0 }); light('day');
    c.cam(HX - 1.75, HZ - 2.1, 5.0, 1.0);
    pose(S, Object.assign(HA(-2.25, -1.95), { ry: face(-2.25, -1.95, -1.6, -2.5), ph: 0, amp: 0, look: lf > 46 ? Math.sin(T(lf) * 3) * .4 : 0 })); S.bat.visible = false;
    drinkArm(lf > 46 ? .25 : 0); S.aR.a.rotation.x = lf > 46 ? -.9 : -1.15; S.aR.el.rotation.x = lf > 46 ? -1.1 : -.5;
    bottle.visible = true; bottle.position.set(HX - 1.6, .97, HZ - 2.55); if (lf > 46) inHand(S, bottle, 1); },
  null,
  // 2 — com sede: garrafa vazia na mão
  (lf, f, len, c) => { house({ flow: 0 }); light('day'); c.cam(HX - 1.0, HZ - 1.6, lerp(6.4, 5.6, easeOut(lf / len)), 1.0);
    pose(S, Object.assign(HA(-1.0, -1.3), { ry: face(0, 0, 1, 1), ph: 0, amp: 0, slump: .35 })); S.bat.visible = false;
    drinkArm(.35); inHand(S, bottle, 1); },
  // 3 — a cidade: luz e água caem um dia qualquer entre 0 e 30; janelas apagam
  (lf, f, len, c) => { const off = c.F[4] - c.C(3) + 4; light(lf < off ? 'dawn' : 'dark');
    winMat.emissiveIntensity = lf < off ? .9 : .04; houses.forEach(h => h.wins.forEach(w => { if (w.material !== winMat) w.material.emissiveIntensity = lf < off ? .9 : .04; }));
    c.cam(lerp(.5, 2, lf / len), -4.6, lerp(9.5, 8.5, lf / len));
    pose(S, { x: 1.5, z: -3.6, ry: Math.PI + Math.sin(T(lf) * 1.3) * .6, ph: 0, amp: 0, look: lf > off ? Math.sin(T(lf) * 4) * .5 : 0 }); S.bat.visible = false; },
  // 4 — banheiro: enche a panela no resto da banheira
  (lf, f, len, c) => { const k6 = c.C(6) - c.C(5); house({ flow: 0, tub: lerp(.32, .22, clamp(lf / len)) }); light('day');
    c.cam(HX + 2.6, HZ - 1.9, lerp(6.0, 5.2, easeOut(lf / len)), .8);
    const dip = lf < k6 ? Math.sin(clamp((lf - 10) / 40) * Math.PI) : 0;
    pose(S, Object.assign(HA(3.75, -2.1), { ry: -Math.PI / 2, ph: 0, amp: 0, crouch: .55 + dip * .25, lean: dip * .25 })); S.bat.visible = false;
    S.aR.a.rotation.set(-1.0 - dip * .4, 0, -.15); S.aR.el.rotation.x = -.6; S.aL.a.rotation.set(-1.0 - dip * .4, 0, .15); S.aL.el.rotation.x = -.6;
    if (lf < k6) potAt(HX + 3.25, lerp(.65, .34, dip), HZ - 2.15, clamp((lf - 18) / 30), 0);
    else { potAt(HX + 3.3, .72, HZ - 2.1, 1, 0); } },
  // 5 — rio: bebe direto, fica doente
  (lf, f, len, c) => { const k8 = c.C(8) - c.C(7); river(f, { dirty: lf > 26 }); light('day'); c.cam(RVX - .3, RVZ - .9, lerp(6.6, 5.8, easeOut(lf / len)), .6);
    if (lf < k8) { const d = Math.sin(clamp((lf - 6) / 44) * Math.PI);
      pose(S, Object.assign(RA(0, -.62), { ry: Math.PI, ph: 0, amp: 0, crouch: 1, lean: .45 + d * .4 })); S.bat.visible = false;
      S.aR.a.rotation.set(-.55 - d * .5, 0, -.1); S.aR.el.rotation.x = -.2 - d * 1.6; S.aL.a.rotation.set(-.55 - d * .5, 0, .1); S.aL.el.rotation.x = -.2 - d * 1.6;
      waves(RVX, RVZ - 1.25, lf - 12, { period: 12, life: 30, maxR: 1.2, color: '#b8e2f2', until: 40 });
    } else { const l = lf - k8; pose(S, Object.assign(RA(.2, .4), { ry: face(0, 0, 1, 1), ph: T(l) * 2, amp: .05, slump: lerp(.2, .8, ss(0, 30, l)) })); S.bat.visible = false;
      if (l > 26) { const g = Math.sin(clamp((l - 26) / 18) * Math.PI); S.spine.rotation.x += g * .35; S.neck.rotation.x += g * .3; } } },
  // 6 — ferver: panela na fogueira, vapor; contaminada -> limpa
  (lf, f, len, c) => { const clean = c.F[10] + 72 - c.C(9), fx = RVX + 2.2, fz = RVZ + 2.0; river(f, { dirty: true }); light('day'); fire(fx, fz, f);
    c.cam(fx - .45, fz + .15, lerp(5.2, 4.6, easeOut(lf / len)), .6);
    potAt(fx, .5, fz, .85, lf < clean ? 1 : 0);
    const boil = clamp((lf - 20) / 40); if (boil > 0) for (let n = 0; n < 3; n++) puff(fx, .7, fz, (lf + n * 9) % 26, { n: 2 + Math.round(boil * 2), seed: n * 5, life: 26, size: .12, rise: 1.0, color: '#ffffff', op: .5 * boil });
    pose(S, { x: fx - .85, z: fz + .55, ry: face(fx - .85, fz + .55, fx, fz), ph: 0, amp: 0, crouch: 1, lean: .1, look: 0 }); S.bat.visible = false;
    S.aR.a.rotation.set(-1.05, 0, -.1); S.aR.el.rotation.x = -.8; },
  // 7 — construindo o coletor: marteladas, materiais aparecem um por vez
  (lf, f, len, c) => { const cx = 9.0, cz = -5.2, F12 = c.F[12] - c.C(11); light('day'); c.cam(cx + .4, cz - .2, lerp(6.0, 5.4, easeOut(lf / len)), .8);
    collector(cx, cz, clamp((lf - 8) / (len - 20)), 0);
    pose(S, { x: cx + .78, z: cz - .7, ry: face(cx + .78, cz - .7, cx, cz), ph: 0, amp: 0, crouch: .6 }); S.bat.visible = false; S.hammer.visible = true;
    const per = 14, k = lf > 8 ? ((lf - 8) % per) / per : 0; hammerArm(k);
    [[itPlanks, F12 + 2, -.9, .6], [itNails, F12 + 22, -.3, 1.0], [itBags, F12 + 38, .4, 1.2]].forEach(([o, a, dx, dz]) => { if (lf >= a) item(o, cx + dx, 0, cz + dz, .3, lerp(1.6, 1, easeOut(clamp((lf - a) / 7)))); });
    if (lf > 8 && (lf - 8) % per === Math.round(per * .99)) flashAt(cx + .42, .7, cz - .38, '#fff2c8', 1.6, 3); },
  // 8 — chuva enche o coletor (contaminada); ferva
  (lf, f, len, c) => { const cx = 9.0, cz = -5.2, k14 = c.C(14) - c.C(13); light('dark'); rain(cx, cz, f, 1); c.cam(cx + .4, cz - .2, lerp(6.4, 5.6, lf / len), .9);
    collector(cx, cz, 1, clamp(.15 + lf / len * .7));
    for (let n = 0; n < 4; n++) waves(cx + (R(n) - .5) * .4, cz + (R(n + 2) - .5) * .4, (lf + n * 7) % 20, { period: 999, life: 20, maxR: .25, color: '#cfe3f2', y: .92 });
    const out = lf >= k14; pose(S, { x: cx + .85, z: cz - .8, ry: face(cx + .85, cz - .8, cx, cz), ph: 0, amp: 0, hold: out ? .8 : 0, slump: .1 }); S.bat.visible = false;
    if (out) potAt(cx + .5, .95, cz - .5, .9, 1); },
  // 9 — CTA: bebe da garrafa na cozinha
  (lf, f, len, c) => { house({ flow: 0 }); light('day'); c.cam(HX - .8, HZ - 1.2, lerp(6.2, 5.4, easeOut(lf / len)), 1.0);
    const d = ss(6, 18, lf) * (1 - ss(len - 26, len - 12, lf));
    const tilt = ss(12, 24, lf) * (1 - ss(len - 34, len - 22, lf));
    pose(S, Object.assign(HA(-.8, -1.0), { ry: face(0, 0, 1, 1), ph: 0, amp: 0 })); S.bat.visible = false; drinkArm(d); S.neck.rotation.x -= tilt * .25; inHand(S, bottle, 1, -.25 * d - tilt * 1.55); }
]);
