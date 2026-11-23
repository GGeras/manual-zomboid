// Biblioteca de tomadas 3D para RASCUNHO automático (EP20+): cada frase escolhe um tipo de cena.
// Uso no epNN.js: import { shot } from './auto3d.js'; run([shot('casa'), shot('rua', { n: 3 }), ...]);
// É ponto de partida para a prévia: cenas específicas podem trocar a tomada por código próprio depois.
import { THREE, pose, S, Z, zWalk, light, puff, splat, strike, swoosh, prop, box, U } from './engine.js';
import { house, HA, HX, HZ, fire, rain } from './sets.js';
// cama simples (colchão + travesseiro) para as cenas de sono
const BED = prop(new THREE.Group()); { const m = box(1.0, .28, 2.0, '#8a9aa8'); m.position.y = .14; BED.add(m); const f = box(1.06, .12, 2.06, '#5a4630'); f.position.y = .04; BED.add(f); const pl = box(.7, .1, .34, '#e8e4da'); pl.position.set(0, .33, -.78); BED.add(pl); const c = box(1.02, .05, 1.1, '#3e5a6e'); c.position.set(0, .3, .42); BED.add(c); }
const { clamp, lerp, easeOut, face, T } = U;
const CX = 1, CZ = 1.6;                       // rua aberta (mesma arena do EP08)
const FXp = HX + 5.5, FZp = HZ + 4.5;         // quintal da casa (fogueira do EP14)
const L = o => light(o.light || 'day');
const cam = (c, x, z, h0, h1, lf, len, ty = 1.2) => c.cam(x, z, lerp(h0, h1, easeOut(clamp(lf / Math.max(len, 1)))), ty);
const flies = (x, z, lf, n = 6) => { for (let i = 0; i < n; i++) puff(x + Math.sin(i * 2.1 + lf * .3) * .6, .6 + Math.sin(i + lf * .5) * .25, z + Math.cos(i * 1.7 + lf * .27) * .6, (lf + i * 5) % 12, { n: 1, seed: i, life: 12, size: .06, rise: .1, color: '#0a0a0a', op: 1 }); };
const burn = (x, z, lf) => { for (let i = 0; i < 4; i++) puff(x + Math.sin(i * 1.9) * .15, .5 + i * .3, z + Math.cos(i * 2.3) * .15, (lf + i * 4) % 16, { n: 2, seed: i + 3, life: 16, size: .16, rise: 1.1, color: i % 2 ? '#ff7a1a' : '#ffc23a', op: .9 }); };

const SHOTS = {
  // dentro de casa. o: dark, sit, slump, hold, crouch, lean, light
  casa: o => (lf, f, len, c) => { house({ dark: !!o.dark }); light(o.dark ? 'dark' : (o.light || 'day')); const k = HA(o.x ?? -2, o.z ?? 0);
    pose(S, { x: k.x, z: k.z, ry: .8, ph: 0, amp: 0, sit: o.sit || 0, slump: o.slump || 0, hold: o.hold || 0, crouch: o.crouch || 0, lean: o.lean || 0 }); S.bat.visible = !!o.bat;
    cam(c, k.x + .5, k.z - .3, o.h0 || 5, o.h1 || 4.3, lf, len, o.sit ? .8 : 1); },
  // quintal com fogueira. o: crouch, hold, sit
  quintal: o => (lf, f, len, c) => { house({}); light(o.light || 'dawn'); fire(FXp, FZp, f, { k: o.fk ?? 1 });
    pose(S, { x: FXp - 1.0, z: FZp + .9, ry: face(FXp - 1.0, FZp + .9, FXp, FZp), ph: 0, amp: 0, crouch: o.crouch ?? .6, hold: o.hold || 0, sit: o.sit || 0, slump: o.slump || 0 }); S.bat.visible = false;
    cam(c, FXp - .6, FZp + .5, 5.4, 4.6, lf, len, .8); },
  // rua com zumbis chegando. o: n, light, crouch, aim, slump, sneeze
  rua: o => (lf, f, len, c) => { L(o); const n = o.n ?? 2;
    pose(S, { x: CX, z: CZ, ry: n ? face(CX, CZ, CX + .4, CZ - 3) : Math.PI / 2, ph: 0, amp: 0, crouch: o.crouch || 0, aim: o.aim || 0, slump: o.slump || 0, lean: o.sneeze && lf > 10 && lf < 22 ? .5 : 0 }); S.bat.visible = !!o.bat; S.gun.visible = !!o.aim;
    for (let i = 0; i < n; i++) { const d = 3.0 + i * .8 - clamp(lf / 180) * 1.0, zx = CX + .4 + (i - (n - 1) / 2) * .9, zz = CZ - d; zWalk(Z[i], i, f, zx, zz, face(zx, zz, CX, CZ), .9); }
    cam(c, CX + (n ? .1 : .3), CZ - (n ? 1.4 : .2), o.h0 || 6.6, o.h1 || 5.8, lf, len, 1.1); },
  // golpe com taco: zumbi cai
  golpe: o => (lf, f, len, c) => { L(o); const H = 18; const t = strike(lf, H);
    pose(S, { x: CX, z: CZ, ry: Math.PI / 2, ph: 0, amp: 0, guard: 1, swing: t, slump: o.slump || 0 }); if (t >= 0) swoosh(S, t);
    if (lf < H) zWalk(Z[0], 0, f, CX + 1.45 + (H - lf) * .02, CZ, -Math.PI / 2, .9);
    else { pose(Z[0], { x: CX + 1.45, z: CZ, ry: -Math.PI / 2, dead: lf - H, deadStyle: 1 }); splat(CX + 2.9, CZ + .3, .4 * clamp((lf - H - 12) / 10)); }
    c.shake(lf - H); cam(c, CX + .7, CZ - .2, 4.8, 4.2, lf, len, 1.1); },
  // pisão em zumbi caído
  pisao: o => (lf, f, len, c) => { L(o); const H = 14; const t = lf >= H - 10 && lf <= H + 8 ? (lf - H + 10) / 18 : -1;
    pose(Z[0], { x: CX + .55, z: CZ, ry: -Math.PI / 2, dead: 60, deadStyle: 0, jolt: lf - H });
    pose(S, { x: CX + .5, z: CZ - .62, ry: 0, ph: 0, amp: 0, stomp: t, look: 0 }); c.shake(lf - H, .1); cam(c, CX + .6, CZ - .2, 3.8, 3.4, lf, len, .6); },
  // correndo pela rua. o: light, slump, pack
  correr: o => (lf, f, len, c) => { L(o); const x = CX - 6 + lf * .09;
    pose(S, { x, z: CZ, ry: Math.PI / 2, ph: T(lf) * (o.walk ? 6 : 12), amp: o.walk ? .55 : 1, lean: o.walk ? 0 : .2, slump: o.slump || 0, pack: o.pack || 1 }); S.bat.visible = false;
    if (o.z) for (let i = 0; i < o.z; i++) zWalk(Z[i], i, f, x - 2.4 - i * .9, CZ + (i % 2 ? .7 : -.5), Math.PI / 2, 1.3);
    c.cam(x - (o.z ? 1.2 : -.3), CZ - .2, o.z ? 6.4 : 5.6, 1.1); },
  // parado na chuva. o: slump, crouch
  chuva: o => (lf, f, len, c) => { light('dark'); rain(CX, CZ, f, 1);
    pose(S, { x: CX, z: CZ, ry: .6, ph: 0, amp: 0, slump: o.slump ?? .3, crouch: o.crouch || 0 }); S.bat.visible = false; cam(c, CX + .4, CZ - .2, 5.4, 4.6, lf, len, 1); },
  // horda andando (sem personagem). o: n, light
  horda: o => (lf, f, len, c) => { L(o); S.g.visible = false; const n = o.n ?? 8;
    for (let i = 0; i < n; i++) zWalk(Z[i], i, f, CX + 4 + (i % 4) * 1.1 - lf * .02, CZ - 2 + Math.floor(i / 4) * 1.4 + (i % 2) * .4, -Math.PI / 2, .8 + (i % 3) * .1);
    cam(c, CX + 4, CZ - 1, o.h0 || 7.5, o.h1 || 6.4, lf, len, 1.1); },
  // pilha de corpos com moscas. o: s (personagem perto), slump
  pilha: o => (lf, f, len, c) => { light(o.light || 'dawn'); const px = CX + 2.2;
    for (let i = 0; i < (o.n ?? 5); i++) pose(Z[i], { x: px + (i % 3) * .5 - .5, z: CZ + Math.floor(i / 3) * .6 - .3, ry: i * 1.3, dead: 60, deadStyle: i % 3 });
    flies(px, CZ, lf, 8);
    if (o.s) pose(S, { x: px - 1.4, z: CZ + .2, ry: Math.PI / 2, ph: 0, amp: 0, slump: o.slump || 0, hold: o.hold || 0 }); else S.g.visible = false; S.bat.visible = false;
    cam(c, px - .7, CZ - .1, 6.0, 5.3, lf, len, .8); },
  // fogo perto da casa. o: s (personagem), hold
  fogo: o => (lf, f, len, c) => { house({ dark: true }); light('dark'); const k = HA(1.6, 1.0); fire(k.x, k.z, f, { k: 1.4 + clamp(lf / 90) * .9 });
    for (let i = 0; i < 3; i++) puff(k.x + i * .5 - .5, 1.2, k.z - .4, (lf + i * 9) % 30, { n: 2, seed: i, life: 30, size: .3, rise: 1.4, color: '#2a2420', op: .55 });
    if (o.z) { const zx = k.x - 2.6 + clamp(lf / 120) * 1.2; zWalk(Z[0], 0, f, zx, k.z + .9, Math.PI / 2, .8); burn(zx, k.z + .9, lf); }
    if (o.s) pose(S, { x: k.x - 1.3, z: k.z + .5, ry: face(k.x - 1.3, k.z + .5, k.x, k.z), ph: 0, amp: 0, hold: o.hold || 0 }); else S.g.visible = false; S.bat.visible = false;
    cam(c, k.x - .4, k.z + .1, 5.6, 5.0, lf, len, .9); },
  // coleta: andando agachado no mato do quintal. o: crouch, light
  mato: o => (lf, f, len, c) => { house({}); light(o.light || 'day'); const x = FXp - 1.6 + lf * .012;
    pose(S, { x, z: FZp + .9, ry: Math.PI / 2, ph: T(lf) * 4, amp: o.still ? 0 : .35, crouch: o.crouch ?? .5, hold: o.hold || 0 }); S.bat.visible = false;
    c.cam(x + .4, FZp + .8, 5.0, .8); },
  // deitado/sentado na cama (noite). o: slump, hold, dark
  cama: o => (lf, f, len, c) => { house({ dark: o.dark !== 0 }); light(o.dark === 0 ? 'day' : 'dark'); const k = HA(-2, .2); BED.visible = true; BED.position.set(k.x + .7, 0, k.z); BED.rotation.y = 0;
    pose(S, { x: k.x + .7, z: k.z + .1, ry: Math.PI / 2, ph: 0, amp: 0, sit: 1, slump: o.slump || 0, hold: o.hold || 0 }); S.g.position.y = .26; S.bat.visible = false;
    cam(c, k.x + .7, k.z, 4.8, 4.2, lf, len, .9); },
};
export function shot(kind, o = {}) { const s = SHOTS[kind]; if (!s) throw new Error('tomada desconhecida: ' + kind); return s(o); }
