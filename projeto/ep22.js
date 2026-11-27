// EP 22 — Fadiga Muscular (B42.22) — v8 (25/11, revisão do Jose): em parado/andar/correr/pisão o tronco e os braços são a GUARDA de duas
//   mãos do próprio jogo (quadro 0 do Bob_Attack2H_Heavy01_Hit) por cima das pernas de cada animação — nada de braço montado à mão (cruzava o
//   corpo e torcia). A mão da boca no comprimido para na frente dos lábios. · RASCUNHO v7 (25/11): machado pelo cabo; pia de bancada e rack de TV do jogo;
//   frasco em pé na mão e comprimido sem o corpo deslizar (tomar.js); sombra sob os pés dentro de casa; criado-mudo inteiro, abajur sólido, lixo fora
//   do caminho; poste da frente saiu do trajeto. · RASCUNHO v5 (25/11, Bruno): machado de volta no Bip01_Prop1 SEM rotação (as duas mãos no cabo nas
//   animações 2H do jogo — no Prop2 girado ficava numa mão só e "voando"), frasco de remédio em escala de embalagem (.45, como no EP24) com câmera
//   perto na hora de tomar, caminhada fora da placa PARE (atravessava). · RASCUNHO v3 (24/11, Jose):
// • arma = MACHADO do jogo (malha FireAxe.x, ícone Item_Axe é o mesmo machado vermelho) em TODAS as cenas — o ícone e a habilidade (Machados) batem com a mão;
// • animações originais de arma pesada de duas mãos: Bob_Idle2H_Heavy, Bob_Attack2H_Heavy01_Hit, Bob_Run2H_Heavy/Bob_Sprint2H_Heavy, Bob_Walk2H_Heavy,
//   Bob_AttackFloorStamp_2Hheavy (pisão), Bob_Idle_HeavyBreathing_2Hheavy, Bob_EmotePainRightArm2H/Torso2H;
// • zumbi: morte do golpe com Zombie_HitDeath_HeadLeft tocada a 70% (mais quadros, queda mais fluida); pisão em zumbi DEITADO (Zombie_Idle_FloorOnBack)
//   no lugar exato do pé, com reação da cabeça (Zombie_HeadReact_OnBack01) no impacto;
// • corrida: horda vindo de longe pela rua (fim de tarde), justificando correr; rua com lixo e papéis do jogo;
// • ninguém atravessa o chão (regra 4.7): de pé/andando = PZ.apoiar(S, 0).
import { THREE, PZ, pose, S, Z, light, splat, U } from './engine.js';
import { prop } from './engine.js';
import { run } from './ep3d.js';
import { empunhadura, machadoNaMao, gira, tronco } from './empunhar.js';
import { tomarRemedio, quadroPills } from './tomar.js';
import { rua, quarto, casaDentro, luzInterior, camOn, clima, clarao, tileLuz } from './cenarios.js';
const { clamp, lerp, easeOut } = U;

const RUA = rua(300, 0, 'verao', { postes: [[-9, 2], [7, -1]] }), RC = RUA.C, R = RC.at;
[['trash_01_27', -3, -1.2], ['d_trash_1_9', 2, 2.3], ['trash_01_24', 6, -1.3], ['trash_01_33', -7, 2.4], ['d_trash_1_13', 9, 2.2], ['trash_01_18', 12, -1.4]].forEach(([n, i, j]) => RC.placa(n, i, j));
const Q = quarto(-120, 60, { cama: ['furniture_bedding_01_27', 'furniture_bedding_01_26'], abajurAceso: true, semCadeira: true }), QC = Q.C, A = QC.at;
QC.obj('furniture_storage_01_48', 3, 0, { w: .96, d: .96 });   // v7: criado-mudo inteiro (a caixa pequena cortava o desenho)
[['trash_01_27', .9, 4.4], ['d_trash_1_9', 5.2, 3.6]].forEach(([n, i, j]) => QC.placa(n, i, j));
const MANHA = luzInterior(QC, { janelas: [['N', 4]], hora: 'tarde' });
const CASA = casaDentro(-60, 80, { completa: true, pia: 'fixtures_sinks_01_9', rackTV: true }), KC = CASA.C, K = KC.at;
const TARDE = luzInterior(KC, { janelas: [['N', 3], ['W', 3]], abajur: [0, 1], hora: 'tarde' });
// v5: machado no osso da arma (Bip01_Prop1), sem rotação extra — é como o taco/martelo dos outros EPs; nas animações 2H do jogo
//     (Bob_Attack2H_Heavy01_Hit, Idle2H_Heavy) a mão esquerda vai sozinha para o cabo. O Prop2 girado (v4) deixava o machado numa mão e solto.
const AXE = PZ.attach(S, 'Bip01_Prop1', PZ.propMesh('w_axe', 'fireaxe'));
const PILL = PZ.attach(S, 'Bip01_Prop2', PZ.propMesh('pillbottle', 'pillbottle')); PILL.visible = false; PILL.scale.setScalar(.55);   // embalagem pequena (v7: um pouco maior para ler em pé na mão)
S.g.traverse(o => { o.renderOrder = 2; });
// v8 (25/11): pegada do machado = a do jogo. GUARDA = tronco, braços e machado do 1º quadro do golpe (as duas mãos no cabo, cabeça perto do ombro)
const PEGA = empunhadura(S, AXE);   // só para a mão fechar em volta do frasco (tomar.js)
const GUARDA = ['s_attack2h', 0, false], COM_GUARDA = ['s_idle2h', 's_breath2h', 's_walk2h', 's_run2h', 's_sprint2h', 's_stomp2h'];
const MACHADO = machadoNaMao(S, AXE);
// por cima da guarda: o machado preso na mão como no quadro do jogo; respiração (e peso nas costas) inclina só o tronco, braços e machado juntos
const ajusta = (preso, a) => { S.posClip = preso || a ? () => { if (a) { const T = tronco(S); gira(S.pz.bones.Bip01_Spine1, new THREE.Quaternion().setFromAxisAngle(T.right, a)); } preso?.(); } : null; };
const TOMAR = tomarRemedio(S, PILL, PEGA);
// v7: sombra macia sob os pés dentro de casa (o piso dos sprites não recebe sombra e o boneco parecia solto do chão)
const SOMBRA = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 63);
  gr.addColorStop(0, 'rgba(20,12,4,.55)'); gr.addColorStop(.55, 'rgba(20,12,4,.3)'); gr.addColorStop(1, 'rgba(20,12,4,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(.8, .8).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })); m.renderOrder = 1; return prop(m); })();
const sombra = () => { S.g.updateMatrixWorld(true); const B = S.pz.bones, a = new THREE.Vector3().setFromMatrixPosition(B.Bip01_L_Foot.matrixWorld), b = new THREE.Vector3().setFromMatrixPosition(B.Bip01_R_Foot.matrixWorld);
  SOMBRA.position.set((a.x + b.x) / 2, .034, (a.z + b.z) / 2); SOMBRA.visible = true; };
const SYP = .43, SY = .62, VRUN = 3.1, VWALK = 1.25;

const clip = (name, lf, o = {}) => {
  const axe = o.axe !== false, up = o.up ?? (axe && COM_GUARDA.includes(name) ? GUARDA : undefined);
  pose(S, Object.assign({ ry: Math.PI / 2 }, o, { clip: [name, lf, o.loop !== false, up, o.mix] })); S.bat.visible = false; S.hammer.visible = false;
  AXE.visible = axe; PILL.visible = !!o.pill; S.olhar = 0; (S.userData ??= {}).assento = o.assento;
  const folego = o.folego ?? (name === 's_breath2h' ? .06 : 0);
  MACHADO.solta(); ajusta(axe && up && up[0] === 's_attack2h' ? MACHADO.prender(up[0], up[1]) : null, axe && (folego || o.curva) ? (o.curva ?? 0) + folego * (.5 - .5 * Math.cos(lf / 30 * 5)) : 0);
  if (o.tomar !== undefined) TOMAR(o.tomar); PZ.apoiar(S, o.base ?? 0); };
// v8: na dor do braço o machado fica NO CHÃO ao lado dele (a animação do jogo com a arma na mão fazia o machado atravessar o braço cruzado)
const CHAO = (() => { const g = new THREE.Group(), m = PZ.propMesh('w_axe', 'fireaxe'); m.rotation.z = Math.PI / 2; g.add(m); return prop(g); })();
const largado = (x, z, ry) => { AXE.updateWorldMatrix(true, false); CHAO.scale.setScalar(Math.abs(AXE.getWorldScale(new THREE.Vector3()).y)); CHAO.position.set(x, .045, z); CHAO.rotation.y = ry; CHAO.visible = true; };
const zClip = (z, name, lf, o = {}) => { pose(z, Object.assign({ clip: [name, lf, o.loop !== false] }, o)); PZ.apoiar(z, 0); };
const rua0 = (f, k = 0) => { light('dawn'); clima('', 0); RC.show(); clarao(0); tileLuz('#fffaf0'); };   // v6: um pouco mais claro (inspeção 93, mín 95)
// golpe completo: zumbi chega andando, machado acerta no quadro H+18, zumbi cai em câmera lenta (70%) e fica no chão
const golpe = (lf, me, H, o = {}) => { const HIT = H + 18;
  // antes e depois do golpe fica na própria guarda do golpe (quadro 0 / fim): não há salto de pose
  const l = lf < H ? 0 : Math.min(lf - H, 75), parado = lf < H || lf >= H + 76;
  clip('s_attack2h', l, { x: me.x, z: me.z, loop: false, folego: parado && o.cansado ? .06 * clamp((lf < H ? H - lf : lf - H - 76) / 8) : 0 });
  const zx = me.x + 1.15, z0 = Z[0];
  if (lf < HIT) zClip(z0, 'z_walk', lf, { x: zx + (HIT - lf) * .016, z: me.z, ry: -Math.PI / 2 });
  else { const t = (lf - HIT) * .7; zClip(z0, 'z_deathleft', Math.min(t, 45), { x: zx, z: me.z, ry: -Math.PI / 2, loop: false }); if (lf > HIT + 40) splat(zx + .9, me.z + .2, .35 * clamp((lf - HIT - 40) / 20)); }
  return HIT; };
// pisão no zumbi deitado de costas: cabeça do zumbi exatamente sob o pé direito (pé avança ~0,55 m no Bob_AttackFloorStamp)
const pisao = (lf, me, H, o = {}) => { const S0 = H, S1 = H + 46, hx = me.x + .42, hz = me.z + .06;   // cabeça do zumbi sob o pé direito (pé avança ~0,55 m no Bob_AttackFloorStamp)
  const I0 = S0 + 13, I1 = S1 + 13, dupla = !!o.dupla;
  if (lf >= S0 && lf < S0 + 38) clip('s_stomp2h', lf - S0, { x: me.x, z: me.z, loop: false });
  else if (dupla && lf >= S1 && lf < S1 + 38) clip('s_stomp2h', (lf - S1) * 1.1, { x: me.x, z: me.z, loop: false });
  else clip(lf > S0 + 38 ? 's_breath2h' : 's_idle2h', lf, { x: me.x, z: me.z });
  const age = lf >= I1 && dupla ? lf - I1 : lf - I0;
  if ((lf >= I0 && lf < I0 + 11) || (dupla && lf >= I1 && lf < I1 + 12)) zClip(Z[0], 'z_headreact_back', age, { x: hx + .62, z: hz, ry: Math.PI / 2, loop: false }); else zClip(Z[0], 'z_floorback', lf * .5, { x: hx + .62, z: hz, ry: Math.PI / 2 });
  if (lf >= I0) splat(hx + .05, hz, .3 * clamp((lf - I0) / 8) + (dupla ? .22 * clamp((lf - I1) / 8) : 0));
  return dupla && lf >= I1 ? I1 : I0; };
// horda vindo de longe pela rua (andando e alguns correndo)
const horda = (f, lf, x0, z0, n = 12, perto = 0) => { for (let i = 0; i < n; i++) { const fila = Math.floor(i / 4), lado = (i % 4) - 1.5, sprint = i < 3;
  const x = x0 - (perto + 3 + fila * 1.6 + (i % 2) * .5) + (sprint ? lf * .035 : lf * .012), z = z0 + lado * .55 + (fila % 2) * .2;
  zClip(Z[i + 1], sprint ? 'z_sprint' : (i % 2 ? 'z_walk3' : 'z_walk4'), f * (sprint ? 1 : .9) + i * 7, { x, z, ry: Math.PI / 2 }); } };

run([
  // 0 — "na 42, seu braço cansa de bater": golpe de machado, zumbi cai devagar; depois ofegante com o machado
  (lf, f, len, c) => { rua0(f); const me = R(-2, 1.2), HIT = golpe(lf, me, 26);
    c.shake(lf - HIT, .07); camOn(c, me.x + .6, me.z, 6.2, SY); },
  // 1 — "Distensão Muscular... no painel de saúde" (painel no cfg): larga o machado e segura o braço dolorido
  (lf, f, len, c) => { rua0(f); const me = R(-2, 1.2); zClip(Z[0], 'z_deathleft', 45, { x: me.x + 1.15, z: me.z, ry: -Math.PI / 2, loop: false });
    clip('s_painarm', lf, { x: me.x, z: me.z, axe: false }); largado(me.x + .42, me.z - .62, .5);
    camOn(c, me.x + .4, me.z, 7.7, SYP); },
  // 2 — bater (braço) · CORRER (pernas: horda vindo de longe) · peso (costas: andando devagar, curvado)
  (lf, f, len, c) => { rua0(f); const k1 = len * .3, k2 = len * .64;
    if (lf < k1) { const me = R(-2, 1.2); const HIT = golpe(lf, me, 6, { cansado: true }); c.shake(lf - HIT, .06); camOn(c, me.x + .6, me.z, 6.2, SY); }
    else if (lf < k2) { const l = lf - k1, x = R(0, 1.2).x + l / 30 * VRUN, z = R(0, 1.2).z;   // começa depois do carro estacionado (i -13…-9)
      clip(l < 12 ? 's_run2h' : 's_sprint2h', l * 1.05, { x, z }); horda(f, l, x, z, 12, 2.5);
      camOn(c, x - 1.4, z, 8.0, .60); }   // v5: pés fora da descrição do app
    else { const l = lf - k2, x = R(-3, 1.3).x + l / 30 * VWALK * .7, z = R(0, 1.3).z;   // v5: começa depois da placa PARE (i -4) — antes passava por trás dela
      clip('s_walk2h', l * .75, { x, z, up: ['s_attack2h', 46, false], curva: .06, folego: .09 }); camOn(c, x + .3, z, 6.0, SY); }
    clarao(Math.max(1 - Math.abs(lf - k1) / 5, 1 - Math.abs(lf - k2) / 5, 0) * .8, '#000'); },
  // 3 — arma pesada cansa mais (golpe pesado) · pisão em zumbi caído cansa menos (pisão no lugar certo)
  (lf, f, len, c) => { rua0(f); const k = len * .45, me = R(3, 1.2);
    if (lf < k) { const HIT = golpe(lf, me, 4, { cansado: true }); c.shake(lf - HIT, .08); camOn(c, me.x + .6, me.z, 6.0, SY); }
    else { const l = lf - k, IMP = pisao(l, me, 8, { dupla: true }); c.shake(l - IMP, .11); camOn(c, me.x + .7, me.z + .1, 4.9 - .35 * clamp((l - 8) / 40) - (l > 54 ? .3 : 0), SY); }
    clarao(Math.max(1 - Math.abs(lf - k) / 5, 0) * .8, '#000'); },
  // 4 — força e nível em Machados diminuem a distensão: golpe limpo, firme, zumbi cai
  (lf, f, len, c) => { rua0(f); const me = R(7, 1.2), HIT = golpe(lf, me, 14); c.shake(lf - HIT, .07); camOn(c, me.x + .6, me.z, 6.4, SY); },
  // 5 — analgésico tira a dor, a distensão continua (cozinha, tarde): pega o frasco, toma o comprimido, segura o braço
  (lf, f, len, c) => { light('dawn'); clima('', 0); KC.show(); TARDE.set(f); clarao(0); const p = K(7.4, 1.7);
    // v5: Bob_IdleTakePills inteiro (101 quadros) com o frasco só durante a ação; câmera fecha no tronco enquanto toma, depois abre para o painel
    const P0 = 0, P1 = Math.round(len * .76), l = 4 + lf * 97 / P1;   // voz real: a ação inteira cabe na frase, antes do painel
    if (lf < P1) { clip('s_breath', lf, { x: p.x, z: p.z, ry: .9, axe: false, up: ['s_pills', quadroPills(l), false], pill: l > 7 && l < 93, tomar: l }); }
    else clip('s_painarm', lf - P1, { x: p.x, z: p.z, ry: .9, axe: false });
    sombra();
    const zk = easeOut(clamp((lf - P0 + 2) / 14)) * (1 - easeOut(clamp((lf - P1) / 16)));
    // v7: o take mostra a cozinha (pia, bancada, TV no rack) abaixo do título; no painel de saúde volta para o enquadramento alto
    const painel = easeOut(clamp((lf - P1 + 14) / 18));
    camOn(c, p.x - .1, p.z, lerp(lerp(7.2, 5.4, zk), 7.5, painel), lerp(lerp(.64, .66, zk), SYP, painel)); },
  // 6 — exercício demais: "no dia seguinte, dores terríveis" — de manhã no quarto, levanta da cama com dor
  (lf, f, len, c) => { light('dawn'); clima('sol', .35); QC.show(); MANHA.mostrar(true); MANHA.set(f); clarao(0); const p = A(3.1, 1.15);
    if (lf < 70) clip('s_stretch', lf, { x: p.x, z: p.z, ry: .6, loop: false, axe: false }); else clip('s_painarm', lf - 70, { x: p.x, z: p.z, ry: .6, axe: false, up: ['s_painleg', lf - 70] });
    sombra(); camOn(c, p.x - .35, p.z - .45, 6.6, SY); },
  // 7 — golpe · pisão · caminhada · descanso: quatro cortes rápidos
  (lf, f, len, c) => { const q = len / 4, i = Math.min(3, Math.floor(lf / q)), l = lf - i * q;
    if (i === 0) { rua0(f); const me = R(-2, 1.2), HIT = golpe(l, me, 0, {}); c.shake(l - HIT, .06); camOn(c, me.x + .6, me.z, 6.2, SY); }
    else if (i === 1) { rua0(f); const me = R(3, 1.2); pisao(l, me, 0); camOn(c, me.x + .7, me.z + .1, 5.0, SY); }
    else if (i === 2) { rua0(f); const x = R(-3, 1.3).x + l / 30 * VWALK, z = R(0, 1.3).z; clip('s_walk2h', l, { x, z }); camOn(c, x + .3, z, 6.2, SY); }
    else { light('dawn'); clima('sol', .35); QC.show(); MANHA.mostrar(true); MANHA.set(f); const p = A(3.1, 1.15); clip('s_breath', l, { x: p.x, z: p.z, ry: .6, axe: false }); sombra(); camOn(c, p.x - .35, p.z - .45, 6.6, SY); }
    clarao(Math.max(...[1, 2, 3].map(k => 1 - Math.abs(lf - k * q) / 4), 0) * .7, '#000'); },
]);
