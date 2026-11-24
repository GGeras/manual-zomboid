// EP 20 — Sono (B42.22) — FINAL v6 (24/11): tempos da voz final ElevenLabs (cenas 4 e 8 refeitas no ritmo da fala) · RASCUNHO v4 (24/11, Jose): camas por fala (boa de madeira / chão da sala com lixo), criado-mudo e lixo no chão.
// v3 (24/11, revisão do Bruno):
// • 00:19 falava de cadeira e não tinha cadeira → QUARTO com cadeira do jogo: ele chega pela frente e senta recuando (Bob_SatChairIn → Bob_SatChair)
//   ofegante (Bob_Idle_HeavyBreathing no tronco) — recupera o fôlego, o sono continua;
// • nada atravessa nada (regra 4.7): de pé/andando/no chão = PZ.apoiar; na cama o corpo fica EM CIMA do colchão (cama do jogo a 0,62 = altura
//   que as próprias animações de deitar do jogo usam: Bob_Asleep / Bob_GetInBed), cama e cadeira desenhadas por baixo dele (sobrepor);
//   taco = malha do jogo (Baseballbat.x) na mão (Bip01_Prop1) com Bob_IdleBat / Bob_AttackBat01_Hit;
// • luz e ambiente por lugar (regra 4.5): quarto à noite (abajur aceso + luar pela janela), manhã com sol entrando, cozinha de tarde, rua no fim do dia;
// • traços do final com ícone e valor (no cfg).
import { THREE, PZ, pose, S, Z, light, U } from './engine.js';
import { run } from './ep3d.js';
import { quarto, casaDentro, rua, luzInterior, camOn as camOn0, clima, clarao, rota, VEL, COLCHAO, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut } = U;
const camOn = (c, x, z, h, sy) => window.DBG ? camOn0(c, S.g.position.x, S.g.position.z, window.DBG, .5, .7) : camOn0(c, x, z, h, sy);

// v4 (24/11, pedido do Jose): cama BOA de madeira com cabeceira alta (furniture_bedding_01_27/26) no quarto, criado-mudo, papéis e lixo no chão
const Q = quarto(-120, 60, { cama: ['furniture_bedding_01_27', 'furniture_bedding_01_26'] }), QC = Q.C, A = QC.at;
QC.obj('furniture_storage_01_48', 3, 0, { w: .5, d: .45 });                     // criado-mudo ao lado da cabeceira
[['trash_01_27', 1, 3.2], ['trash_01_24', 4.1, 4.3], ['d_trash_1_9', 3.6, 1.6], ['trash_01_33', 5.2, 1.4]].forEach(([n, i, j]) => QC.placa(n, i, j));
const NOITE = luzInterior(QC, { janelas: [['N', 4]], abajur: [1, 0], hora: 'noite', lua: true });
const MANHA = luzInterior(QC, { janelas: [['N', 4]], hora: 'tarde' });
const CASA = casaDentro(-60, 80, { completa: true }), KC = CASA.C, K = KC.at;
const TARDE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
// v4: "chão" = sala abandonada, à noite, lixo espalhado, sem colchão (dorme no piso)
const NOITE2 = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], hora: 'noite', lua: true });
[['d_trash_1_0', 2.2, 5.6], ['trash_01_18', 4.3, 6.2], ['d_trash_1_13', 1.4, 2.6], ['trash_01_27', 3.6, 3.4], ['trash_01_24', 4.6, 4.8]].forEach(([n, i, j]) => KC.placa(n, i, j));
const CHAO = K(3.2, 5.3);

const RUA = rua(300, 0), RC = RUA.C, R = RC.at;

const BAT = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_bat', 'baseballbat'));
S.g.traverse(o => { o.renderOrder = 2; });
// v6: luz de preenchimento fraca que acompanha o personagem à noite (inspeção: brilho 42–44, mín 45) — só tira do escuro, sem estourar
const FILL = new THREE.PointLight('#c9d3ff', 0, 3.2, 1.8); FILL.position.set(.7, 1.5, .9); S.g.add(FILL);
const SY = .64;
// cama: cabeceira em (2,0), pé em (2,1); deitado com a pelve no meio (Bob_Asleep: cabeça a −0,58, pés a +0,98 da pelve)
const LEITO = A(2, .35), BEIRA = A(2.95, .7);
// cadeira (frente S): pelve no meio do assento; na frente = onde os pés ficam ao sentar (+0,55)
const SEAT = A(5, 3.05), FRONT = A(5, 3.62), SIT = 31;
const PORTA = A(.6, 4);
// ---- personagem: animação do jogo + contato (regra 4.7) ----
// v5 (24/11, Jose: "flutuando na cama"): as animações de cama do jogo (Bob_GetInBed → Bob_AwakeToAsleep → Bob_Asleep) já trazem a altura da
// cama do jogo (pelve deitada a 0,77 com a raiz no chão) — o corpo fica com a raiz no chão (y = 0), sem "apoiar" no topo da caixa do desenho
// (a caixa mede o ponto mais alto do sprite e deixava o corpo 0,2 acima do colchão). A sombra redonda some na cama.
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: .8, clip: [name, lf, o.loop !== false, o.up, o.mix] }, o)); S.bat.visible = false; S.hammer.visible = false;
  BAT.visible = !!o.bat; S.olhar = 0; (S.userData ??= {}).assento = o.assento; S.shadow.visible = !o.cama;
  if (o.cama) { S.g.position.y = 0; S.userData.apoio = CAMA_JOGO; } else PZ.apoiar(S, o.base ?? 0); };
const deitado = (lf, o = {}) => { Q.cama.sobrepor(true); clip('s_asleep', lf, { x: LEITO.x, z: LEITO.z, ry: 0, cama: true, ...o }); };
// deitar em sequência, como no jogo: senta na beira e põe as pernas na cama (Bob_GetInBed, 46 q.) → deita (Bob_AwakeToAsleep, 37 q.) → dorme
// (o fim de cada animação é o começo da próxima: GetInBed é feita para o corpo virado 90° a mais que as outras duas)
const GETIN = 46, TOSLEEP = 37;
// altura do colchão nas animações do jogo (Bob_Asleep: costas a ~0,54 com a raiz no chão). A caixa do desenho vai até o ponto mais alto do sprite (0,76).
const CAMA_JOGO = .54;
const deitar = (lf) => { Q.cama.sobrepor(true);
  if (lf < GETIN) { const k = easeOut(clamp(lf / 40)); clip('s_getinbed', lf, { x: lerp(BEIRA.x, LEITO.x, k), z: lerp(BEIRA.z, LEITO.z, k), ry: Math.PI / 2, loop: false, cama: true }); }
  else if (lf < GETIN + TOSLEEP) clip('s_tosleep', lf - GETIN, { x: LEITO.x, z: LEITO.z, ry: 0, loop: false, cama: true });
  else deitado(lf - GETIN - TOSLEEP); };
const sentar = (lf, sitIn = true) => { Q.cadeira.sobrepor(true);
  if (sitIn && lf < SIT) { const k = easeOut(clamp(lf / (SIT - 4))); clip('s_satchairin', lf, { x: lerp(FRONT.x, SEAT.x, k), z: lerp(FRONT.z, SEAT.z, k), ry: 0, loop: false }); return; }
  const l = sitIn ? lf - SIT : lf; clip('s_satchair', l, { x: SEAT.x, z: SEAT.z, ry: 0, up: ['s_breath', l], assento: Q.cadeira.userData.hs }); };
const andar = (pts, lf, nome = 's_walk', vel = VEL.s_walk) => { const q = rota(pts, lf / 30, vel); clip(q.fim ? 's_idle' : nome, lf, { x: q.x, z: q.z, ry: q.ry }); return q; };
// ---- ambientes ----
const VIN = document.createElement('div'); VIN.style.cssText = 'position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at 50% 58%, rgba(0,0,0,0) 30%, rgba(4,4,10,.92) 92%)';
document.getElementById('gl').insertAdjacentElement('afterend', VIN);
const cansaco = k => { VIN.style.opacity = clamp(k); };   // "você enxerga menos": a borda da tela fecha
const noite = f => { FILL.intensity = .9; light('dark'); clima('', 0); QC.show(); Q.cama.sobrepor(false); Q.cadeira.sobrepor(false); NOITE.mostrar(true); MANHA.mostrar(false); NOITE.set(f); cansaco(0); clarao(0); };
const manha = f => { FILL.intensity = 0; light('dawn'); clima('sol', .35); QC.show(); Q.cama.sobrepor(false); Q.cadeira.sobrepor(false); NOITE.mostrar(false); MANHA.mostrar(true); MANHA.set(f); cansaco(0); clarao(0); };
const zClip = (z, name, lf, o = {}) => { pose(z, Object.assign({ clip: [name, lf, o.loop !== false] }, o)); PZ.apoiar(z, 0); };

run([
  // 0 — dormir mal te mata devagar: de pé ao lado da cama, bocejando (Bob_EmoteYawn), à noite
  (lf, f, len, c) => { noite(f); clip('s_yawn', lf + 6, { x: BEIRA.x + .2, z: BEIRA.z + .6, ry: .6 }); camOn(c, BEIRA.x, BEIRA.z + .3, 7.2, SY); },
  // 1 — o moodle de sono: de Sonolência a Cansaço Absurdo — espreguiça, depois ofegante; a borda da tela vai fechando
  (lf, f, len, c) => { noite(f); const p = { x: BEIRA.x + .2, z: BEIRA.z + .6 };
    if (lf < 86) clip('s_stretch', lf, { x: p.x, z: p.z, ry: .6, loop: false }); else clip('s_breath', lf, { x: p.x, z: p.z, ry: .6 });
    cansaco(.15 + .55 * clamp(lf / len)); camOn(c, p.x - .2, p.z - .3, lerp(7.2, 6.4, easeOut(lf / len)), SY); },
  // 2 — cansado: enxerga menos e perde força — o taco acerta e o zumbi só balança e continua vindo (fim do dia, na rua)
  (lf, f, len, c) => { FILL.intensity = 0; light('dawn'); clima('', 0); RC.show(); clarao(0); NOITE.off(); tileLuz('#ffffff'); cansaco(.55); const me = R(0, 1.2), H1 = 40, H2 = 140;
    const atk = (lf >= H1 && lf < H1 + 31) ? lf - H1 : (lf >= H2 && lf < H2 + 31) ? lf - H2 : -1;
    if (atk >= 0) clip('s_attackbat', atk, { x: me.x, z: me.z, ry: Math.PI / 2, loop: false, bat: true }); else clip('s_idlebat', lf, { x: me.x, z: me.z, ry: Math.PI / 2, bat: true });
    const zx = me.x + 1.05, z0 = Z[0]; const hit = (lf >= H1 + 6 && lf < H1 + 59) ? lf - H1 - 6 : (lf >= H2 + 6 && lf < H2 + 59) ? lf - H2 - 6 : -1;
    if (hit >= 0) zClip(z0, 'z_hitleft', hit, { x: zx + (hit < 20 ? hit * .012 : .24 - (hit - 20) * .007), z: me.z, ry: -Math.PI / 2, loop: false });
    else if (lf < H1) zClip(z0, 'z_walk', lf, { x: zx + (H1 - lf) * .018, z: me.z, ry: -Math.PI / 2 }); else zClip(z0, 'z_idle', lf, { x: zx, z: me.z, ry: -Math.PI / 2 });
    c.shake(lf - H1 - 7, .06); c.shake(lf - H2 - 7, .06); camOn(c, me.x + .55, me.z, 6.6, SY); },
  // 3 — sentar na CADEIRA só recupera o fôlego: chega pela frente, senta recuando e fica ofegante
  (lf, f, len, c) => { noite(f); const a = 30;
    if (lf < a) andar([[FRONT.x - .8, FRONT.z + .9], [FRONT.x, FRONT.z]], lf); else sentar(lf - a);
    camOn(c, SEAT.x - .2, SEAT.z + .3, 6.4, SY); },
  // 4 — v4: cada pedaço da fala com o lugar certo: CAMA BOA (madeira, travesseiro) → CHÃO da sala com lixo → acorda no chão com dor no pescoço
  //     (banco de carro: o teto do carro do jogo esconde quem está dentro; fica só no chip "CHÃO / CARRO")
  (lf, f, len, c) => { const k1 = len * .38, k3 = len * .72;   // v6 (voz final): troca no "Chão e banco de carro" e no "dor no pescoço"
    if (lf < k1) { noite(f); deitado(lf); camOn(c, LEITO.x + .3, LEITO.z + .5, 5.8, SY); }
    else if (lf < k3) { FILL.intensity = .9; light('dark'); clima('', 0); KC.show(); NOITE.off(); NOITE2.mostrar(true); NOITE2.set(f); cansaco(.25); clip('s_asleep', lf, { x: CHAO.x, z: CHAO.z, ry: Math.PI / 2 }); camOn(c, CHAO.x + 1.0, CHAO.z + 1.1, 5.6, SY); }
    else { FILL.intensity = .9; light('dark'); clima('', 0); KC.show(); NOITE.off(); NOITE2.mostrar(true); NOITE2.set(f); cansaco(0); clip('s_sitground', lf, { x: CHAO.x, z: CHAO.z, ry: Math.PI / 2, up: ['s_painhead', lf - k3 + 10] }); camOn(c, CHAO.x + 1.0, CHAO.z + 1.1, 5.6, SY); }
    clarao(Math.max(1 - Math.abs(lf - k1) / 6, 1 - Math.abs(lf - k3) / 5, 0) * .9, '#000'); },
  // 5 — às vezes o jogo nem deixa dormir: zumbi batendo na janela (lado de fora), pânico
  (lf, f, len, c) => { noite(f); deitado(lf + 40); const w = A(4, -.8); zClip(Z[0], 'z_doorbang', lf, { x: w.x, z: w.z, ry: 0 }); zClip(Z[1], 'z_doorbang', lf + 13, { x: w.x - .55, z: w.z - .35, ry: 0 });
    c.shake((lf % 34) - 2, .025); camOn(c, LEITO.x + .9, LEITO.z, 6.8, SY); },
  // 6 — comprimidos soníferos (Bob_IdleTakePills) ao lado da cama; nada de álcool junto
  (lf, f, len, c) => { noite(f); clip('s_pills', lf + 10, { x: BEIRA.x + .15, z: BEIRA.z + .55, ry: .5 }); camOn(c, BEIRA.x, BEIRA.z + .3, 6.2, .60); },   // v6: pés fora da área da descrição do app
  // 7 — pílula de cafeína: um empurrão de energia, mas o sono continua (cozinha, de tarde)
  (lf, f, len, c) => { FILL.intensity = 0; light('dawn'); clima('', 0); KC.show(); NOITE2.mostrar(false); TARDE.set(f); cansaco(0); clarao(0); const p = K(7.4, 1.7);
    if (lf < 100) clip('s_pills', lf + 5, { x: p.x, z: p.z, ry: .9 }); else clip('s_yawn', lf - 100, { x: p.x, z: p.z, ry: .9 });
    camOn(c, p.x - .1, p.z, 6.6, SY); },
  // 8 — v6 (voz final, 6,5 s): "Exemplo: noite chegando, você já está com Sonolência" = boceja na porta (Bob_EmoteYawn) → "Tranca a casa" = vira
  //     para a porta (som da porta) → corte seco (clarão) para a beira da cama, já entrando nela (GetInBed → AwakeToAsleep → Asleep, sem pulo:
  //     o corte esconde o caminho até a cama, que não cabe na fala) → amanhece e acorda inteiro.
  (lf, f, len, c) => { const P0 = { x: PORTA.x + .5, z: PORTA.z }, tY = 86, tT = 96, tc = Math.round(len * .60), t4 = Math.round(len * .85), ENTRA = 36;
    if (lf < t4) noite(f); else manha(f);
    if (lf < tY) { clip('s_yawn', lf, { x: P0.x, z: P0.z, ry: .6, loop: false }); camOn(c, P0.x + .4, P0.z - .2, 6.6, SY); }
    else if (lf < tc) { const k = easeOut(clamp((lf - tY) / (tT - tY))); clip('s_idle', lf, { x: P0.x, z: P0.z, ry: lerp(.6, -Math.PI / 2, k) }); camOn(c, P0.x + .4, P0.z - .2, 6.6, SY); }   // vira para a porta e tranca
    else if (lf < t4) { deitar(lf - tc + ENTRA); camOn(c, LEITO.x + .5, LEITO.z + .4, lerp(6.4, 5.9, clamp((lf - tc) / (t4 - tc))), SY); }
    else { clip('s_stretch', lf - t4, { x: BEIRA.x + .2, z: BEIRA.z + .6, ry: .6, loop: false }); camOn(c, BEIRA.x, BEIRA.z + .3, 6.4, SY); }
    clarao(Math.max(1 - Math.abs(lf - tc) / 5, 1 - Math.abs(lf - t4) / 7, 0), '#000'); },
  // 9 — traços da criação (no cfg, com ícone e valor); manhã, ele bem disposto
  (lf, f, len, c) => { manha(f); if (lf < 86) clip('s_stretch', lf, { x: BEIRA.x + .2, z: BEIRA.z + .6, ry: .6, loop: false }); else clip('s_idle', lf, { x: BEIRA.x + .2, z: BEIRA.z + .6, ry: .6 });
    camOn(c, BEIRA.x, BEIRA.z + .3, 7.0, SY); },
]);
