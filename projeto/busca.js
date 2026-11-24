// MODO DE BUSCA do jogo (Investigar Área → Ativar Modo de Busca / tecla End), replicado a partir de
// media/lua/client/Foraging/ISSearchManager.lua (updateOverlay): fora do raio de visão o jogo DESFOCA (blur 0,5), TIRA COR (desaturação 0,5)
// e ESCURECE (darkness = maior entre pânico, cansaço e escuro; nunca menos de 0,1), com 2 quadrados de transição (gradientWidth 2).
// O raio é em QUADRADOS do chão e acompanha o personagem: no chão isométrico ele vira uma elipse 2:1 na tela.
// Em cima da cabeça aparece o olho do jogo (ui/foraging/eyeconOn.png); o que ele acha aparece com o marcador do jogo (pinIcon*.png).
import { THREE, cam } from './engine.js';
const main = document.getElementById('main'), gl = document.getElementById('gl');
const L = document.createElement('div'); L.id = 'busca3d'; L.style.cssText = 'position:absolute;inset:0;pointer-events:none';   // sem z-index: os textos (seções depois no DOM) ficam por cima e não borram
gl.insertAdjacentElement('afterend', L);
const FX = document.createElement('div'); FX.style.cssText = 'position:absolute;inset:0;opacity:0;will-change:backdrop-filter,mask-image';
L.appendChild(FX);
const EYE = document.createElement('img'); EYE.src = './assets/ui/foraging/eyeconOn.png';
EYE.style.cssText = 'position:absolute;width:112px;height:62px;margin:-31px 0 0 -56px;opacity:0;image-rendering:pixelated;filter:drop-shadow(0 4px 6px rgba(0,0,0,.6))';
L.appendChild(EYE);
const PINS = [];
const v = new THREE.Vector3();
// mundo → pixel da tela (1080×1920)
export function tela(x, y, z) { cam.updateMatrixWorld(); v.set(x, y, z).project(cam); return [(v.x + 1) * 540, (1 - v.y) * 960]; }
// raio em quadrados → semi-eixos da elipse na tela
function eixos(x, z, R) { const [cx, cy] = tela(x, 0, z), [ax] = tela(x + R / Math.SQRT2, 0, z - R / Math.SQRT2), [, by] = tela(x + R / Math.SQRT2, 0, z + R / Math.SQRT2);
  return [cx, cy, Math.abs(ax - cx), Math.abs(by - cy)]; }
// o.on (0..1, entra/sai suave), o.R raio em quadrados, o.dark (0,1 dia … 0,6 noite/chuva), h = personagem (cabeça para o olho)
export function busca(h, o = {}) {
  const on = o.on ?? 0; FX.style.opacity = on; EYE.style.opacity = on;
  if (on <= 0) { PINS.forEach(q => { q.el.style.opacity = 0; }); return; }
  const p = h.g.position, R = o.R ?? 6, G = 2, [cx, cy, rx, ry] = eixos(p.x, p.z, R + G), dark = o.dark ?? .1, k = (R / (R + G)) * 100;
  const m = `radial-gradient(${rx}px ${ry}px at ${cx}px ${cy}px, transparent 0%, transparent ${k}%, #000 100%)`;
  FX.style.webkitMaskImage = m; FX.style.maskImage = m;
  FX.style.backdropFilter = FX.style.webkitBackdropFilter = `blur(${(o.blur ?? .5) * 12}px) saturate(${1 - (o.desat ?? .5)}) brightness(${1 - Math.min(.85, dark * 1.3)})`;
  FX.style.background = `rgba(0,0,0,${Math.min(.5, dark * .5)})`;
  const [ex, ey] = tela(p.x, (o.cabeca ?? 1.85) + .35, p.z); EYE.style.left = ex + 'px'; EYE.style.top = ey + 'px';
  // marcadores: função PURA do quadro (o render é feito em pedaços fora de ordem): aparecem quando o item está dentro do raio, a partir de q.desde
  PINS.forEach(q => { if (q.ativo === false) return; const d = Math.hypot(q.x - p.x, q.z - p.z), t = (o.f ?? 0) >= q.desde ? Math.max(0, Math.min(1, (R - d) / .8)) : 0; const [px, py] = tela(q.x, 0, q.z);
    q.el.style.opacity = t * on; q.el.style.left = px + 'px'; q.el.style.top = py + 'px'; q.el.style.transform = `translate(-50%,-100%) scale(${.6 + .4 * t})`; });
}
// item do chão com marcador do jogo: cat = Berries | Stones | ForestGoods | Mushrooms | Insects | Fruits | MedicinalPlants ; icon = ícone do item (assets/items)
export function pin(x, z, cat, icon, desde = 0) { const el = document.createElement('div');
  el.style.cssText = 'position:absolute;width:86px;height:132px;opacity:0;transform-origin:50% 100%';
  el.innerHTML = `<img src="./assets/ui/foraging/pinIcon${cat}.png" style="position:absolute;left:0;top:0;width:86px;height:86px;image-rendering:pixelated;filter:drop-shadow(0 4px 5px rgba(0,0,0,.7))">`
    + (icon ? `<img src="./assets/items/${icon}.png" style="position:absolute;left:21px;top:92px;width:44px;height:44px;image-rendering:pixelated">` : '');
  L.appendChild(el); const q = { x, z, el, desde }; PINS.push(q); return q; }
// zera o que já foi achado (cada cena começa do zero)
export function buscaOff() { PINS.forEach(q => { q.el.style.opacity = 0; }); FX.style.opacity = 0; EYE.style.opacity = 0; }
// desliga e liga só os marcadores de uma lista (cada cena mostra os seus)
export function pinsAtivos(lista) { PINS.forEach(q => { q.ativo = lista.includes(q); if (!q.ativo) q.el.style.opacity = 0; }); }
