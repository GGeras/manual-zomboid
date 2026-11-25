// EP 24 — Pânico e Estresse (B42.22) — RASCUNHO v5 (25/11, Bruno):
// • corpo a corpo (fala 2) REFEITO: o zumbi vem ANDANDO de verdade (pés na velocidade do corpo), ele espera com o taco em guarda e bate quando o zumbi
//   entra no alcance; o golpe é fraco: o zumbi só cambaleia para trás (Zombie_HitReact_HeadTop) e volta; 2º golpe, mesma coisa — o zumbi segue de pé;
//   os outros vêm de longe andando, sem parar no lugar;
// • abajur inteiro (placa com alfa sólido, cenarios/tiles); remédio: frasco só durante Bob_IdleTakePills e câmera fechando no tronco;
// • cigarro com a brasa para FORA (malha girada 180°) e fumaça clara e fina (antes eram bolas escuras que pareciam sombra);
// • final: bala visível até a cabeça, câmera lenta no 3º tiro, recarrega com calma (Bob_Reload_Handgun) antes de abaixar a arma.
// RASCUNHO v3 (24/11, Jose): falas mais longas (v7) e cada bloco com a sua ação.
// • pistola do jogo (Handgun.x) presa no osso da mão, com as animações originais de pistola: Bob_IdleAimHandgun, Bob_AttackHandgun (tiro),
//   Bob_WalkBwdAimHandgun (recuando mirando), Bob_Reload_Handgun, Bob_Idle_HeavyBreathing_Hgun;
// • pânico = recua tremendo e ERRA (impacto no chão / na cerca, poeira), a horda continua vindo; o 3º tiro acerta; taco fraco não derruba;
// • estresse = sentado na poltrona de verdade (assento na altura do jogo), curvado e com a mão na cabeça (Bob_Emote_Bent_Double_Sat / Wipe_Sat_Head);
// • Calmantes = frasco do jogo (PillBottle) na mão + Bob_IdleTakePills; leitura = livro do jogo na poltrona; cigarro do jogo aceso na mão (Bob_IdleSmoke);
// • casa de sobrevivente: lixo, mochilas, maço de cigarro, janela com luz baixa; rua com lixo e horda; quartinho escuro para o Claustrofóbico.
import { THREE, PZ, pose, S, Z, light, splat, puff, scene, U } from './engine.js';
import { run } from './ep3d.js';
import { rua, quarto, casaDentro, luzInterior, camOn as camOn0, clima, clarao, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut } = U;
const camOn = (c, x, z, h, sy) => window.DBG ? camOn0(c, S.g.position.x, S.g.position.z, window.DBG, .5, .7) : camOn0(c, x, z, h, sy);

// ---------- lugares ----------
const RUA = rua(300, 0), RC = RUA.C, R = RC.at;
[['trash_01_27', -3, -1.2], ['d_trash_1_9', 2, 2.3], ['trash_01_24', 6, -1.3], ['trash_01_33', -7, 2.4], ['d_trash_1_13', 9, 2.2], ['trash_01_18', 12, -1.4], ['d_trash_1_0', 4, 2.4]].forEach(([n, i, j]) => RC.placa(n, i, j));
const CASA = casaDentro(-60, 80, { completa: true }), KC = CASA.C, K = KC.at;
[['d_trash_1_13', 1.6, 6.4], ['trash_01_33', 8.4, 6.5]].forEach(([n, i, j]) => KC.placa(n, i, j));   // 25/11: lixo só nos cantos — antes caía em cima do personagem e do cigarro
const NOITE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'noite', lua: true });
const TARDE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
const Q = quarto(-120, 60, { cama: ['furniture_bedding_01_27', 'furniture_bedding_01_26'], semCadeira: true }), QC = Q.C, A = QC.at;
QC.obj('furniture_storage_01_48', 3, 0, { w: .5, d: .45 });   // quartinho arrumado: sem lixo nem cadeira solta (25/11)
const QN = luzInterior(QC, { janelas: [['N', 4]], hora: 'noite', lua: true });
// objetos do jogo soltos pela casa (malhas originais): mochilas, maço de cigarro na mesa, frasco de remédio
const solto = (C, m, t, i, j, ry = 0, y = .03, deitar = false) => { const me = PZ.propMesh(m, t), g = new THREE.Group(); g.add(me); if (deitar) me.rotation.x = -Math.PI / 2;
  me.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(me); me.position.y -= bb.min.y; g.position.set(i, y, j); g.rotation.y = ry; me.castShadow = true; C.G.add(g); return g; };
solto(KC, 'bag_alice', 'alicepack_green', 1.2, 3.1, .5); solto(KC, 'bag_duffel', 'duffelbaggreen', 3.6, 5.9, 1.1, .03, true); solto(KC, 'bag_school', 'schoolbag_black', 1.5, 5.2, -.6);
solto(KC, 'cigpack', 'cigarettepack', 7.1, 3.95, .4, 1.02);   // em cima da mesa da cozinha (i 7, j 4)
// ---------- itens na mão (malhas do jogo) ----------
const GUN = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_handgun', 'handgun'));
const BAT = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_bat', 'baseballbat'));
const CIG = PZ.attach(S, 'Bip01_Prop2', PZ.propMesh('cigarette', 'cigarette_lit'));   // Bob_IdleSmoke leva a mão ESQUERDA (Prop2) à boca
CIG.rotation.y = Math.PI;   // v5: a malha vinha com a brasa virada para a boca — gira 180° (filtro na boca, brasa para fora)
const PILL = PZ.attach(S, 'Bip01_Prop2', PZ.propMesh('pillbottle', 'pillbottle')); PILL.scale.setScalar(.45);   // embalagem pequena (≈ 5 cm), como o ícone Item_PillsBetablocker — antes era maior que uma lata
const BOOK = new THREE.Group();
{ const me = PZ.propMesh('w_bookhand', 'bookred'); me.material.side = THREE.DoubleSide;
  me.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(.0177, .0107, .0062), new THREE.Quaternion().setFromEuler(new THREE.Euler(...[-11.7984, 87.0744, -81.8605].map(d => d * Math.PI / 180), 'XYZ')), new THREE.Vector3(1, 1, 1)));
  BOOK.add(me); }
PZ.attach(S, 'Bip01_Prop2', BOOK);
S.g.traverse(o => { o.renderOrder = 2; });
// ---------- tiro: clarão na boca do cano + impacto ----------
const FLASH = new THREE.PointLight('#ffcf70', 0, 6, 1.6); scene.add(FLASH);
const FL = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffe9a0', transparent: true, opacity: 0, depthWrite: false })); scene.add(FL);
const _v = new THREE.Vector3();
const flash = (age) => { const k = age >= 0 && age < 4 ? 1 - age / 4 : 0; GUN.updateMatrixWorld(true); _v.set(0, 0, 0).applyMatrix4(GUN.matrixWorld);
  _v.x += .28; FLASH.position.copy(_v); FL.position.copy(_v); FLASH.intensity = 9 * k; FL.material.opacity = k; FL.scale.setScalar(.6 + k); };
// BALA visível: risco claro que sai da boca do cano e voa até o alvo (erra: chão, cerca, passa ao lado); age = quadros desde o disparo
const BALA = new THREE.Mesh(new THREE.BoxGeometry(1, .04, .04), new THREE.MeshBasicMaterial({ color: '#fff3b8', transparent: true, opacity: 0, depthWrite: false })); scene.add(BALA);
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _q = new THREE.Quaternion(), X1 = new THREE.Vector3(1, 0, 0);
const bala = (age, ax, ay, az) => { if (age < 0 || age > 8) { BALA.material.opacity = 0; return; }
  GUN.updateMatrixWorld(true); _a.set(0, 0, 0).applyMatrix4(GUN.matrixWorld); _a.x += .28; _b.set(ax, ay, az);
  const t = clamp((age + 1) / 4), t0 = Math.max(0, t - .55); _c.lerpVectors(_a, _b, t); const head = _c.clone(); _c.lerpVectors(_a, _b, t0); const tail = _c.clone();
  const d = head.clone().sub(tail), L = Math.max(d.length(), .01); BALA.position.copy(tail).add(head).multiplyScalar(.5); BALA.scale.set(L, 1, 1);
  _q.setFromUnitVectors(X1, d.normalize()); BALA.quaternion.copy(_q); BALA.material.opacity = age < 5 ? 1 : clamp((8 - age) / 3); };
// zumbi que vem de +x ao encontro do personagem a v m/s e PARA a dmin (nunca atravessa): anda enquanto vem; ao chegar, avança com os braços (lunge)
const chega = (zi, f, lf, x, z, d0, v, dmin, lat) => { const d = Math.max(dmin, d0 - v * lf / 30);
  if (d > dmin + .001) zClip(Z[zi], zi % 2 ? 'z_walk3' : 'z_walk', f * (v / V_ZW) + zi * 7, { x: x + d, z: z + lat, ry: -Math.PI / 2 });
  else zClip(Z[zi], 'z_lunge', f + zi * 5, { x: x + d, z: z + lat, ry: -Math.PI / 2 });
  return d; };
const impacto = (x, y, z, age, cor = '#b9ad94') => { if (age >= 0) puff(x, y, z, age, { n: 6, seed: Math.round(x * 13), life: 16, size: .12, rise: .5, color: cor, op: .8 }); };
// ---------- animações ----------
const SY = .7, SYI = .6, V_BWD = .55, V_ZW = .85;
const hide = () => { GUN.visible = BAT.visible = CIG.visible = PILL.visible = BOOK.visible = false; };
const clip = (name, lf, o = {}) => { pose(S, Object.assign({ ry: Math.PI / 2, clip: [name, lf, o.loop !== false, o.up] }, o)); S.bat.visible = false; S.hammer.visible = false;
  hide(); GUN.visible = !!o.gun; BAT.visible = !!o.bat; CIG.visible = !!o.cig; PILL.visible = !!o.pill; BOOK.visible = !!o.book;
  S.olhar = o.olhar || 0; PZ.apoiar(S, 0); S.userData.assento = o.assento; S.shadow.visible = !o.assento; };
const zClip = (z, name, lf, o = {}) => { pose(z, Object.assign({ clip: [name, lf, o.loop !== false] }, o)); PZ.apoiar(z, 0); };
// tremor da mão (pânico): a pistola balança sobre a pose do jogo
const tremor = (f, k) => { GUN.rotation.set(Math.sin(f * 1.9) * .06 * k, Math.sin(f * 2.7 + 1) * .08 * k, Math.sin(f * 3.3) * .05 * k); };
const rua0 = f => { light('dawn'); clima('', 0); RC.show(); clarao(0); tileLuz('#ffe6cc'); FLASH.intensity = 0; FL.material.opacity = 0; };
const casaN = f => { light('dark'); clima('', 0); KC.show(); NOITE.set(f); clarao(0); tileLuz('#a99f90'); FLASH.intensity = 0; FL.material.opacity = 0; CASA.poltrona.sobrepor(false); };
const casaT = f => { light('dawn'); clima('', 0); KC.show(); TARDE.set(f); clarao(0); tileLuz('#fff2e0'); FLASH.intensity = 0; FL.material.opacity = 0; CASA.poltrona.sobrepor(false); };
// horda vindo de frente (+x → −x). Velocidade escolhida para chegar a "dmin" do personagem no fim da tomada (len) — nunca atravessa;
// os pés acompanham (ritmo da animação = velocidade / 0,85 m/s do Zombie_Walk)
const horda = (f, lf, x0, z, n, d0 = 4, len = 300, dmin = 1.6) => { const v = clamp((d0 - dmin) / Math.max(len / 30, 1), .15, V_ZW), rt = v / V_ZW;
  for (let i = 0; i < n; i++) { const fila = Math.floor(i / 3), lado = (i % 3) - 1;
    zClip(Z[i], i % 2 ? 'z_walk3' : 'z_walk', f * rt + i * 7, { x: x0 + d0 + fila * 1.3 + (i % 2) * .4 - lf / 30 * v, z: z + lado * .75 + (fila % 2) * .3, ry: -Math.PI / 2 }); } };
// sequência de tiro: lista de quadros de disparo; devolve a idade do último disparo
const tiros = (lf, lista) => { let age = -1; lista.forEach(t => { if (lf >= t) age = lf - t; }); return age; };
// poltrona (parede W, frente E) — sentar de verdade, nádega no assento
const SEAT = K(.22, 2), CH_RY = Math.PI / 2;
const sentado = (lf, up, o = {}) => { CASA.poltrona.sobrepor(true); clip('s_satchair', lf, Object.assign({ x: SEAT.x, z: SEAT.z, ry: CH_RY, up, assento: CASA.poltrona.userData.hs }, o)); };

// v5: corpo a corpo (fala 2). O zumbi (Z[1]) vem andando a 0,85 m/s (= ritmo do Zombie_Walk, pés sem patinar). Quando chega a ~1,2 m o personagem
// bate (Bob_AttackBat01_Hit; impacto no quadro 12): o zumbi recebe (Zombie_HitReact_HeadTop), recua ~0,35 m e volta a andar. Dois golpes; ele não cai.
// Devolve a idade do último impacto (tremida da câmera).
const corpoACorpo = (l, f, x, z, len) => { const VZ = V_ZW, D0 = 3.1, IMP = 12, ALC = 1.2;
  // simula a distância quadro a quadro (determinístico): anda até o alcance, apanha, recua, volta
  let d = D0, ataque = [], reage = -1, golpes = 0, ultimo = -99;
  for (let t = 0; t <= l; t++) {
    if (reage >= 0) { const a = t - reage; if (a < 14) d += .35 / 14; if (a >= 40) reage = -1; }
    else { d = Math.max(ALC - .05, d - VZ / 30); }
    if (reage < 0 && golpes < 2 && d <= ALC + .35 && t - ultimo > 39 && !ataque.some(h => t < h + 31)) { ataque.push(t); }
    const hb = ataque.find(h => t === h + IMP); if (hb !== undefined) { reage = t; golpes++; ultimo = t; }
  }
  const h = ataque.filter(h => l >= h && l < h + 31).pop();
  clip(h !== undefined ? 's_attackbat' : 's_idlebat', h !== undefined ? l - h : l, { x, z, bat: true });
  const a = reage >= 0 ? l - reage : -1;
  if (a >= 0 && a < 40) zClip(Z[1], 'z_hit', a * 1.2, { x: x + d, z, ry: -Math.PI / 2, loop: false });
  else if (d > ALC - .04) zClip(Z[1], 'z_walk', (f + 3) * (VZ / V_ZW), { x: x + d, z, ry: -Math.PI / 2 });
  else zClip(Z[1], 'z_lunge', f, { x: x + d, z, ry: -Math.PI / 2 });   // chegou nele depois de 2 golpes fracos: avança com os braços (nunca anda parado)
  Z[1].g.visible = true;
  const imp = ataque.map(h => h + IMP).filter(t => l >= t).pop(); return imp === undefined ? -1 : l - imp; };

run([
  // 0 — "sua mão treme, o tiro sai torto": recua mirando, horda vindo; 3 tiros ERRADOS com a bala visível: no chão, na cerca, por cima do ombro do zumbi — ele continua vindo
  (lf, f, len, c) => { rua0(f); const x0 = R(2, 1.2).x, z = R(0, 1.2).z, x = x0 - lf / 30 * V_BWD, T = [40, 110, 175], age = tiros(lf, T);
    const atirando = age >= 0 && age < 18; clip(atirando ? 's_shoothg' : 's_bwdaimhg', atirando ? age : lf, { x, z, gun: true }); tremor(f, 1);
    if (atirando) flash(age); else flash(-1);
    horda(f, lf, x0 - len / 30 * V_BWD, z, 6, 4.2 + len / 30 * V_BWD, len, 1.8);
    const alvo = [[x0 + 2.5, .05, z + 1.0], [x0 + 3.4, .75, z - 1.5], [x0 + 3.2, 1.2, z + .35]];   // chão à direita · cerca · por cima do ombro
    let k = -1; T.forEach((t, i) => { if (lf >= t) k = i; });
    if (k >= 0) { bala(age, ...alvo[k]); T.forEach((t, i) => impacto(...alvo[i], lf - t - 4, i === 1 ? '#e8e2d2' : '#b9ad94')); } else bala(-1);
    c.shake(age, .08); camOn(c, x + 1.3, z, 7.0, SY); },
  // 1 — pânico: 4 níveis — de pé mirando e tremendo cada vez mais, zumbis cada vez mais perto, respiração pesada
  (lf, f, len, c) => { rua0(f); const x = R(1, 1.2).x, z = R(0, 1.2).z, k = clamp(lf / len);
    clip(k < .55 ? 's_aimhg' : 's_breathhg', lf, { x, z, gun: true }); tremor(f, .6 + k * 1.6); flash(-1);
    horda(f, lf, x, z, 6, 4.6, len, 1.5); c.shake(Math.floor(lf) % 24 === 0 && k > .5 ? 0 : -1, .03 * k);
    camOn(c, lerp(x + 1.5, x + .7, easeOut(k)), z, lerp(7.6, 5.6, easeOut(k)), SY); },
  // 2 — mira e corpo a corpo: 2 erros (bala visível) e o 3º acerta (zumbi cai); depois o taco: o zumbi chega, o golpe é fraco, ele só balança e continua
  //     Zumbis vêm a 0,5 m/s e PARAM a 1,15–2,9 m (nunca atravessam o personagem nem o corpo caído)
  (lf, f, len, c) => { rua0(f); const x = R(0, 1.2).x, z = R(0, 1.2).z, k2 = Math.round(len * .58), V = .5;
    const lado = [[1, 6.0, -.6, 1.15], [2, 7.6, .85, 2.0], [3, 8.6, -.85, 2.3], [4, 9.8, .3, 2.9]];
    if (lf < k2) { const T = [30, 85, 140], age = tiros(lf, T), atirando = age >= 0 && age < 18;
      clip(atirando ? 's_shoothg' : 's_aimhg', atirando ? age : lf, { x, z, gun: true }); tremor(f, atirando && lf < 140 ? 1.4 : .5); if (atirando) flash(age); else flash(-1);
      const d0 = 5.0, zx = x + d0 - V * Math.min(lf, 140) / 30;
      if (lf < 140) zClip(Z[0], 'z_walk', f * (V / V_ZW), { x: zx, z, ry: -Math.PI / 2 });
      else { zClip(Z[0], 'z_deathleft', Math.min((lf - 140) * .7, 45), { x: zx, z, ry: -Math.PI / 2, loop: false }); splat(zx + .9, z + .2, .35 * clamp((lf - 175) / 20)); }
      lado.forEach(([i, dd, lat, dm]) => chega(i, f, lf, x, z, dd, V, dm, lat));
      const alvo = [[x + 3.6, .05, z + .9], [x + 4.4, .05, z - .9]]; let k = -1; T.forEach((t, i) => { if (lf >= t && i < 2) k = i; });
      if (k >= 0 && age < 9) bala(age, ...alvo[k]); else bala(-1); alvo.forEach((a, i) => impacto(...a, lf - T[i] - 4));
      c.shake(age, .06); camOn(c, x + 1.3, z, 6.6, SY); }
    else { // v5: corpo a corpo com lógica — outro trecho da rua (o corte em preto esconde a troca), taco em guarda, o zumbi vem andando de verdade
      const l = lf - k2, xm = R(-1.5, 1.2).x, zm = z; flash(-1); bala(-1);   // longe da placa PARE (i -4)
      const sw = corpoACorpo(l, f, xm, zm, len - k2);
      [[2, 6.2, .8], [3, 7.6, -.75]].forEach(([i, d0, lat]) => zClip(Z[i], i % 2 ? 'z_walk3' : 'z_walk', f * (.45 / V_ZW) + i * 7, { x: xm + d0 - .45 * l / 30, z: zm + lat, ry: -Math.PI / 2 }));
      [0, 4, 5].forEach(i => { Z[i].g.visible = false; });
      c.shake(sw, .05); camOn(c, xm + .75, zm, lerp(6.2, 5.4, easeOut(clamp(l / 60))), SY); }
    clarao(Math.max(1 - Math.abs(lf - k2) / 5, 0) * .8, '#000'); },
  // 3 — estresse: casa de sobrevivente à noite, na poltrona, curvado e depois com a mão na cabeça
  (lf, f, len, c) => { casaN(f); const k = lf < len * .5; sentado(lf, k ? ['s_satbent', lf] : ['s_satwipehead', (lf - len * .5) % 86]);
    camOn(c, SEAT.x + .6, SEAT.z + .2, lerp(6.4, 5.0, easeOut(clamp(lf / len))), SYI); },
  // 4 — Calmantes: na cozinha, pega o frasco e toma o remédio; depois respira aliviado
  (lf, f, len, c) => { casaT(f); const p = K(7.4, 1.6);
    // v5: Bob_IdleTakePills inteiro, frasco só durante a ação (abre, leva à boca, guarda); câmera fecha no tronco e depois abre (alívio)
    const P0 = 16, P1 = P0 + 101;
    if (lf < P0) clip('s_breath', lf, { x: p.x, z: p.z, ry: .7 });
    else if (lf < P1) clip('s_pills', lf - P0, { x: p.x, z: p.z, ry: .7, pill: lf - P0 > 4 && lf - P0 < 96, loop: false });
    else clip('s_idle', lf - P1, { x: p.x, z: p.z, ry: .7 });
    const zk = easeOut(clamp((lf - P0 + 6) / 14)) * (1 - easeOut(clamp((lf - P1) / 18)));
    camOn(c, p.x - .2, p.z + .1, lerp(6.0, 4.5, zk), lerp(SYI, .56, zk)); },
  // 5 — leitura: livro do jogo, sentado na poltrona com o abajur aceso
  (lf, f, len, c) => { casaT(f); sentado(lf, ['s_read', lf * .8], { book: true }); camOn(c, SEAT.x + .55, SEAT.z + .15, 5.2, SYI); },
  // 6 — Fumante: de frente para a janela (com caixilho e cortina), cigarro aceso na MÃO CERTA (a que a animação leva à boca), fumaça sai do cigarro e da boca ao soltar a tragada
  (lf, f, len, c) => { casaT(f); const p = K(3.1, 1.0); clip('s_smoke', lf, { x: p.x, z: p.z, ry: .5, cig: true });
    CIG.updateMatrixWorld(true); _v.set(0, 0, 0).applyMatrix4(CIG.matrixWorld);
    // v5: fumaça fina e clara (antes: bolas grandes e escuras que pareciam sombra flutuando) — fiapo da brasa + baforada curta na frente da boca
    _v.set(-.045, 0, 0).applyMatrix4(CIG.matrixWorld);
    for (let i = 0; i < 3; i++) puff(_v.x, _v.y + .03, _v.z, (lf + i * 9) % 28, { n: 1, seed: i + 5, life: 28, size: .035, spread: .06, rise: .45, color: '#f4f4f4', op: .3 });
    const m = lf % 91; if (m > 52 && m < 80) { S.pz.bones.Bip01_Head.getWorldPosition(_v); const fx = Math.sin(S.g.rotation.y) * .14, fz = Math.cos(S.g.rotation.y) * .14;
      puff(_v.x + fx, _v.y - .08, _v.z + fz, m - 52, { n: 4, seed: 17 + Math.floor(lf / 91), life: 26, size: .06, spread: .12, rise: .3, color: '#f4f4f4', op: .28 }); }
    camOn(c, p.x + .15, p.z + .45, 4.5, SYI); },
  // 7 — traços: Corajoso fica firme mirando; Covarde recua (cartões com pontos no cfg)
  (lf, f, len, c) => { rua0(f); const k = len * .5, z = R(0, 1.2).z;
    if (lf < k) { const x = R(0, 1.2).x; clip('s_aimhg', lf, { x, z, gun: true }); tremor(f, .1); horda(f, lf, x, z, 3, 3.6, len * .5, 2.2); camOn(c, x + 1.2, z, 6.8, SY); }
    else { const l = lf - k, x = R(0, 1.2).x - l / 30 * V_BWD * 1.4; clip('s_bwdaimhg', l * 1.4, { x, z, gun: true }); tremor(f, 1.6); horda(f, l, R(0, 1.2).x - len * .5 / 30 * V_BWD * 1.4, z, 3, 3.0 + len * .5 / 30 * V_BWD * 1.4, len * .5, 1.6); camOn(c, x + 1.2, z, 6.8, SY); }
    flash(-1); clarao(Math.max(1 - Math.abs(lf - k) / 5, 0) * .8, '#000'); },
  // 8 — Agorafóbico: rua aberta com horda ao longe; Claustrofóbico: quartinho escuro, fechado
  (lf, f, len, c) => { const k = len * .5; flash(-1);
    if (lf < k) { rua0(f); const x = R(0, 1.2).x, z = R(0, 1.2).z; clip('s_breathhg', lf, { x, z, gun: true, olhar: Math.sin(lf * .05) * .5 }); tremor(f, 1);
      horda(f, lf, x, z, 9, 5, len * .5, 3.2); camOn(c, x + 2.2, z, lerp(9.4, 8.2, clamp(lf / k)), SY); }
    else { const l = lf - k; light('dawn'); clima('', 0); QC.show(); QN.set(f); clarao(0); tileLuz('#e2d8c8'); const p = A(3.3, 2.3);
      clip('s_painhead1', l, { x: p.x, z: p.z, ry: .6 }); camOn(c, p.x - .1, p.z, lerp(5.6, 5.0, clamp(l / k)), .60); }
    clarao(Math.max(1 - Math.abs(lf - k) / 5, 0) * .8, '#000'); },
  // 9 — FINAL: "calma na mão, mira firme, tiro na cabeça" — mão firme (sem tremor), três zumbis em fila: cada tiro certeiro na cabeça (clarão, sangue, queda para trás),
  //     a câmera aperta a cada tiro e no fim abre mostrando os três caídos; ele abaixa a arma e solta o ar. Zumbis vêm a 0,5 m/s e nunca chegam perto.
  // v5: + bala visível até a cabeça em cada tiro; CÂMERA LENTA no 3º tiro (tempo a 35% por ~1,5 s, câmera fecha); depois recarrega com calma
  //     (Bob_Reload_Handgun) e abaixa a arma — "calma na mão".
  (lf0, f, len, c) => { rua0(f); const x = R(0, 1.2).x, z = R(0, 1.2).z, V = .5, TS = [Math.round(len * .14), Math.round(len * .33), Math.round(len * .50)];
    const SA = TS[2] - 8, SD = 46, SK = .35, lf = lf0 < SA ? lf0 : lf0 < SA + SD ? SA + (lf0 - SA) * SK : SA + SD * SK + (lf0 - SA - SD);   // tempo da ação (câmera lenta)
    const lento = lf0 >= SA && lf0 < SA + SD ? Math.sin(Math.PI * (lf0 - SA) / SD) : 0;
    const age = tiros(lf, TS), atirando = age >= 0 && age < 18, RL = TS[2] + 20;
    if (atirando) clip('s_shoothg', age, { x, z, gun: true });
    else if (lf >= RL && lf < RL + 58) clip('s_reloadhg', (lf - RL) * 1.3, { x, z, gun: true, loop: false });
    else clip(lf >= RL + 58 ? 's_idlehg' : 's_aimhg', lf, { x, z, gun: true });
    tremor(f, 0); if (atirando) flash(age); else flash(-1);
    const ZS = [[0, 3.1, 0, 'z_deathleft'], [1, 4.6, -.65, 'z_death'], [2, 6.0, .6, 'z_deathleft']];
    let bk = -1; TS.forEach((t, n) => { if (lf >= t) bk = n; });
    if (bk >= 0 && age < 9) { const [, d0, lat] = ZS[bk], zx = x + d0 - V * TS[bk] / 30; bala(age, zx - .05, 1.62, z + lat); } else bala(-1);   // bala até a cabeça do zumbi (≈1,6 m)
    ZS.forEach(([i, d0, lat, dk], n) => { const T = TS[n], dT = d0 - V * T / 30, zx = x + dT;
      if (lf < T) chega(i, f, lf, x, z, d0, V, 1.6, lat);
      else { const a = lf - T; zClip(Z[i], dk, Math.min(a * .6, 44), { x: zx, z: z + lat, ry: -Math.PI / 2, loop: false });
        puff(zx - .05, 1.62, z + lat, a, { n: 8, seed: 31 + n, life: 18, size: .07, spread: .25, rise: -.25, color: '#8c0d18', op: .85 }); splat(zx + .9, z + lat + .15, .4 * clamp((a - 10) / 18)); } });   // v5: sangue na altura da cabeça (antes 2,8 m: nuvem solta no ar)
    const punch = Math.max(0, ...TS.map(t => lf >= t ? .55 * clamp(1 - (lf - t) / 9) : 0)), fim = clamp((lf - TS[2] - 18) / (len - TS[2] - 18));
    c.shake(age, .1 * (1 - .6 * lento)); clarao(atirando && age < 3 ? .28 * (1 - age / 3) : 0, '#fff2c0');
    camOn(c, x + 2.0 + .3 * easeOut(fim) - .3 * lento, z + .25, lerp(8.4, 7.6, easeOut(clamp(lf / TS[0]))) - punch - 1.0 * lento + 1.0 * easeOut(fim), SY); },   // v5: personagem sempre no quadro
]);
