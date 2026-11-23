// tiles.js — cenário com os SPRITES ORIGINAIS do jogo (Tiles2x.pack / Tiles2x.floor.pack, extraídos com pipeline/pz/unpack.py;
// assets/tiles/meta.js gerado com pipeline/pz/tiles_meta.py).
// Como funciona: a câmera do engine olha de (1, .82, 1) = 30° de elevação = a mesma projeção 2:1 do Project Zomboid.
// Cada sprite é "pintado" numa forma 3D simples (caixa, parede, chão) com UV = projeção de cada vértice na tela.
// Na tela o sprite aparece igual ao jogo, e a forma 3D dá a profundidade certa (quem está atrás do sofá some atrás dele).
// Uso:  const C = cena(x0, z0);  C.chao(nome|lista, i0, j0, i1, j1);  C.parede('N'|'W', nome, i, j);  C.obj(nome, i, j, {w, d});  C.placa(nome, i, j)
//       (i, j) = ladrilho; o centro do ladrilho fica em (x0 + i, z0 + j). Na cena: C.show(). Tom dos sprites: tileLuz('#fff').
import { THREE, prop } from './engine.js';
import META from './assets/tiles/meta.js';
const K = Math.SQRT2 / 128;                                 // unidades de mundo por pixel do sprite (no plano da câmera)
const D = new THREE.Vector3(1, .82, 1).normalize();         // = DIR do engine.js
const RT = new THREE.Vector3(1, 0, -1).normalize();         // direita da tela
const UP = new THREE.Vector3(0, 1, 0).addScaledVector(D, -D.y).normalize();   // cima da tela
export const WALL_H = 192 * K / UP.y;                       // altura de uma parede do jogo (≈2,45)
const MATS = [], PEND = []; window.__TILES = PEND;
const TEX = {}, MAT = {}; window.__TILE_NAMES = () => Object.keys(TEX);   // lista dos sprites usados (pipeline/pz/tiles_usados.mjs)
export const hasTile = n => !!META[n];
function tex(name) { if (TEX[name]) return TEX[name]; if (!META[name]) throw new Error('tiles: sprite ausente: ' + name);
  const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter;
  PEND.push(new Promise(res => { const im = new Image(); im.onload = () => { t.image = im; t.needsUpdate = true; res(); }; im.onerror = () => { console.warn('tile ausente: ' + name); res(); }; im.src = './assets/tiles/' + name + '.png'; }));
  return TEX[name] = t; }
function mat(name, o = {}) { const k = name + '|' + (o.op || '') + '|' + (o.tint || ''); if (MAT[k]) return MAT[k];
  const m = new THREE.MeshBasicMaterial({ map: tex(name), alphaTest: o.op ? .02 : .45, side: THREE.DoubleSide, transparent: !!o.op, opacity: o.op || 1, depthWrite: !o.op });
  m.userData.tint = new THREE.Color(o.tint || '#ffffff'); m.color.copy(m.userData.tint); MATS.push(m); return MAT[k] = m; }
// tom geral dos sprites (eles já vêm iluminados pelo jogo): dia '#fff'; neve '#e8eef8'; noite '#6a7290'...
export function tileLuz(c = '#ffffff') { const col = new THREE.Color(c); MATS.forEach(m => m.color.copy(col).multiply(m.userData.tint)); }
// UV de cada vértice = onde ele cai no sprite. Âncora = centro do losango do piso (pixel w/2, h-32).
function project(geo, name) { if (!META[name]) throw new Error('tiles: sprite ausente: ' + name); const [, , , , w, h] = META[name]; const p = geo.attributes.position, uv = new Float32Array(p.count * 2), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const px = w / 2 + v.dot(RT) / K, py = h - 32 - v.dot(UP) / K; uv[i * 2] = px / w; uv[i * 2 + 1] = 1 - py / h; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return geo; }
// altura da caixa para caber o desenho inteiro: o topo opaco (y0) tem que cair dentro da silhueta da caixa
function autoH(name, w, d, dx = 0, dz = 0) { if (!META[name]) throw new Error('tiles: sprite ausente: ' + name); const [, y0, , , , h] = META[name]; const back = new THREE.Vector3(dx - w / 2, 0, dz - d / 2).dot(UP);
  return Math.max(.04, ((h - 32 - y0) * K - back) / UP.y + .03); }

// REGRA 4.4 (22/11): direção dos sprites. Cada móvel/cortina tem 4 desenhos no jogo (um por direção); usar o errado deixa o fogão de lado,
// a cortina atravessada na janela etc. orient.js diz a direção de cada sprite; aqui cada cena confere e window.__ORIENT() devolve os avisos
// (a inspeção mostra no relatório). Móvel "encosta" precisa ter parede ATRÁS dele; nenhum móvel fica de frente para a parede.
import ORIENT from './assets/tiles/orient.js';
const CENAS = [], OPP = { N: 'S', S: 'N', E: 'W', W: 'E' };
window.__ORIENT = () => CENAS.flatMap(c => c.validar());
export function cena(x0, z0) {
  const G = prop(new THREE.Group()); G.position.set(x0, 0, z0);
  const put = (m, i, j, y = 0, name = '') => { m.position.set(i, y, j); m.userData.tile = name; G.add(m); return m; };
  const WALL = new Set(), OBJS = [], AV = [], key = (l, i, j) => l + Math.round(i) + ',' + Math.round(j);
  // existe parede na borda b (N, S, E, W) do ladrilho (i, j)? (S de j = N de j+1; E de i = W de i+1)
  const temParede = (b, i, j) => b === 'N' ? WALL.has(key('N', i, j)) : b === 'S' ? WALL.has(key('N', i, j + 1)) : b === 'W' ? WALL.has(key('W', i, j)) : WALL.has(key('W', i + 1, j));
  const C = {
    validar() { const out = [...AV]; OBJS.forEach(([name, i, j]) => { const o = ORIENT[name]; if (!o || !o.frente) return; const atras = OPP[o.frente];
        if (temParede(o.frente, i, j)) out.push(`${name} em (${i},${j}) está DE FRENTE PARA A PAREDE (frente ${o.frente})`);
        else if (o.encosta && !temParede(atras, i, j)) { const lados = ['N', 'S', 'E', 'W'].filter(b => temParede(b, i, j));
          out.push(lados.length ? `${name} em (${i},${j}) VIRADO ERRADO: parede em ${lados.join('/')}, mas as costas estão para ${atras} (use o desenho com frente ${OPP[lados[0]]})`
            : `${name} em (${i},${j}) SOLTO NO MEIO DO CÔMODO (tem que encostar na parede)`); } });
      return out.map(m => `cena (${x0},${z0}): ${m}`); },
    G, x: i => x0 + i, z: j => z0 + j, at: (i, j) => ({ x: x0 + i, z: z0 + j }),
    show() { G.visible = true; return C; },
    // piso: retângulo de ladrilhos (i0..i1, j0..j1); nomes = um sprite ou lista sorteada por ladrilho
    chao(names, i0, j0, i1, j1, o = {}) { names = [].concat(names); const by = {};
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) { const n = names[Math.abs((i * 7349 + j * 1931 + (o.seed || 0) * 17) % names.length)]; (by[n] = by[n] || []).push([i, j]); }
      for (const n in by) { const g = new THREE.PlaneGeometry(1.01, 1.01).rotateX(-Math.PI / 2); g.setAttribute('uv', project(new THREE.PlaneGeometry(.955, .955).rotateX(-Math.PI / 2), n).attributes.uv);
        const m = new THREE.InstancedMesh(g, mat(n, o), by[n].length);   // UV um pouco para dentro: sem fresta entre ladrilhos
        const M = new THREE.Matrix4(); by[n].forEach(([i, j], k) => m.setMatrixAt(k, M.makeTranslation(i, o.y ?? .012, j))); m.renderOrder = -1; G.add(m); }
      return C; },
    // parede (ou qualquer coisa colada numa parede: janela, cortina, tábuas) na borda N (atrás, ao longo de x) ou W (atrás, ao longo de z)
    // o.y = andar (WALL_H = 2º andar): o sprite é projetado como no chão do andar e depois a peça sobe (antes o 2º andar ficava invisível)
    parede(lado, name, i, j, o = {}) { const off = o.off || 0, H = o.h || WALL_H + .2;
      if (!/^(fixtures_windows_curtains|carpentry|constructedobjects|crafted|fencing|walls_decoration|walls_interior_detailing|fixtures_doors)/.test(name) && !(o.y > 0) && Math.abs(off) < .2) WALL.add(key(lado, i, j));   // parede de verdade (não cortina/tábua/cerca)
      const ob = ORIENT[name] && ORIENT[name].borda; if (ob && ob !== lado) AV.push(`${name} colado na parede ${lado}, mas o desenho é da borda ${ob} (fica de lado/atravessado)`);
      // o desenho da parede N do jogo começa 4 px antes do ladrilho (lado oeste) e termina 2 px antes do fim: a peça cobre essa sobra,
      // senão fica uma fresta entre as paredes (aparecia um risco laranja do piso de trás). A parede W sobra 2 px para o norte.
      const g = new THREE.PlaneGeometry(lado === 'N' ? 1.07 : 1.035, H); g.translate(lado === 'N' ? -.035 : .0175, H / 2, 0);
      if (lado === 'N') g.translate(0, 0, -.5 + off); else { g.rotateY(Math.PI / 2); g.translate(-.5 + off, 0, 0); }
      project(g, name); g.translate(0, o.y || 0, 0); return put(new THREE.Mesh(g, mat(name, o)), i, j, 0, name); },
    // objeto: caixa com o sprite projetado; w/d = base (1 = ladrilho inteiro), dx/dz = deslocamento da base dentro do ladrilho
    obj(name, i, j, o = {}) { const w = o.w || .9, d = o.d || .9, dx = o.dx || 0, dz = o.dz || 0, h = o.h || autoH(name, w, d, dx, dz);
      const g = new THREE.BoxGeometry(w, h, d); g.translate(dx, h / 2, dz); project(g, name);
      const m = put(new THREE.Mesh(g, mat(name, o)), i, j, 0, name); m.userData.h = h; OBJS.push([name, i, j]); return m; },
    // cadeira/sofá onde o personagem SENTA: assento baixo (caixa até a altura do assento) + encosto fino atrás.
    // Assim quem está sentado fica na frente do encosto e em cima do assento (sem o encosto "passar na frente" do corpo).
    // encosto: 'N' (encosto ao norte; cadeira virada para o sul, ry 0) ou 'W' (encosto a oeste; virada para o leste, ry π/2)
    assento(name, i, j, o = {}) { const g = new THREE.Group(), side = o.encosto || 'N', hs = o.hs || .5, H = autoH(name, .9, .9);
      const seat = new THREE.BoxGeometry(.9, hs, .9); seat.translate(0, hs / 2, 0); project(seat, name);
      const back = side === 'N' ? new THREE.BoxGeometry(.9, H, .14) : new THREE.BoxGeometry(.14, H, .9); back.translate(side === 'W' ? -.38 : 0, H / 2, side === 'N' ? -.38 : 0); project(back, name);
      const m = mat(name, o); g.add(new THREE.Mesh(seat, m), new THREE.Mesh(back, m)); g.children.forEach(c => { c.userData.tile = name; }); return put(g, i, j, 0, name); },
    // sprite em pé, de frente para a câmera (árvores, postes, plantas finas), com a âncora no ponto (i, j) do chão
    placa(name, i, j, o = {}) { const [, , , , w, h] = META[name]; const g = new THREE.PlaneGeometry(w * K, h * K);
      const m = new THREE.Mesh(g, mat(name, o)); m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(RT, UP, D));
      const c = new THREE.Vector3(i, 0, j).addScaledVector(UP, (h / 2 - 32) * K).addScaledVector(D, o.fz ?? .5);   // fz: puxa para a frente (não afundar no chão)
      m.position.copy(c); G.add(m); return m; },
  };
  CENAS.push(C); return C;
}
