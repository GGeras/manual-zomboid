// NÚCLEO DE EPISÓDIO — monta cenas, títulos e HUD a partir de window.EP (config do episódio).
(function () {
const EP = window.EP, FPS = 30, OFF = EP.OFF ?? 0.3, L = 3;
window.__INTRO = EP.OFF ? Math.round(EP.OFF * 30) - 3 : 0;
const F = EP.T.map(t => Math.round((t + OFF) * FPS)), C = i => F[i] - L;
const VO_END = Math.round((EP.END + OFF) * FPS), DUR = (VO_END + (EP.cauda ?? 24)) / FPS;   // cauda (25/11): quadros depois da última fala (padrão 24)
window.__F = F; window.__VO_END = VO_END; window.__DUR = DUR;
const main = document.getElementById('main');
const el = (tag, cls, html, parent, style) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (style) e.style.cssText = style; (parent || main).appendChild(e); return e; };
let uid = 0; const nid = p => (p || 'x') + (uid++);
// ---- ícones (SVG brancos) ----
const ICON = {
  wind: '<path d="M10 30 H58 Q72 30 72 18 Q72 8 62 8 M10 46 H76 Q86 46 86 58 Q86 70 74 70 M10 62 H50" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>',
  panic: '<circle cx="45" cy="45" r="34" fill="none" stroke="#fff" stroke-width="8"/><circle cx="33" cy="38" r="5" fill="#fff"/><circle cx="57" cy="38" r="5" fill="#fff"/><ellipse cx="45" cy="60" rx="9" ry="11" fill="#fff"/>',
  drop: '<path d="M45 8 Q75 48 75 62 A30 30 0 0 1 15 62 Q15 48 45 8 Z" fill="#fff"/>',
  kg: '<circle cx="45" cy="20" r="10" fill="none" stroke="#fff" stroke-width="7"/><path d="M18 34 H72 L84 84 H6 Z" fill="#fff"/>',
  band: '<rect x="8" y="30" width="74" height="30" rx="10" fill="#fff" transform="rotate(-30 45 45)"/><rect x="34" y="34" width="22" height="22" rx="4" fill="rgba(0,0,0,.35)" transform="rotate(-30 45 45)"/>',
  thirst: '<path d="M30 14 H60 L56 80 H34 Z" fill="none" stroke="#fff" stroke-width="7"/><path d="M33 52 H57 L56 78 H34 Z" fill="#fff"/>',
  faucet: '<path d="M14 30 H50 Q66 30 66 46 V54" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="28" y="12" width="14" height="18" fill="#fff"/><path d="M66 64 Q72 74 66 80 Q60 74 66 64Z" fill="#fff"/>',
  house: '<path d="M10 46 L45 14 L80 46 V82 H10 Z" fill="#fff"/><rect x="38" y="56" width="14" height="26" fill="rgba(0,0,0,.4)"/>',
  hammer: '<rect x="40" y="30" width="10" height="54" rx="4" fill="#fff"/><rect x="20" y="12" width="50" height="22" rx="5" fill="#fff"/>',
  can: '<rect x="22" y="14" width="46" height="66" rx="8" fill="#fff"/><rect x="22" y="36" width="46" height="20" fill="rgba(0,0,0,.35)"/>',
  zzz: '<text x="14" y="78" font-family="Inter" font-weight="900" font-size="54" fill="#fff">Z</text><text x="50" y="44" font-family="Inter" font-weight="900" font-size="34" fill="#fff">z</text>',
  tired: '<path d="M18 40 Q30 50 42 40 M48 40 Q60 50 72 40" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M30 66 H60" stroke="#fff" stroke-width="7" stroke-linecap="round"/>',
  sound: '<path d="M10 34 H26 L46 16 V74 L26 56 H10 Z" fill="#fff"/><path d="M56 30 Q66 45 56 60 M66 20 Q82 45 66 70" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>',
  gun: '<path d="M8 28 H82 V44 H44 L38 74 H22 L28 44 H8 Z" fill="#fff"/>',
  siren: '<path d="M22 70 V46 A23 23 0 0 1 68 46 V70 Z" fill="#fff"/><rect x="14" y="70" width="62" height="12" rx="3" fill="#fff"/><path d="M45 6 V16 M14 18 L21 25 M76 18 L69 25" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
  car: '<path d="M10 56 L18 34 Q20 28 28 28 H62 Q70 28 72 34 L80 56 V70 H10 Z" fill="#fff"/><circle cx="26" cy="72" r="8" fill="rgba(0,0,0,.5)"/><circle cx="64" cy="72" r="8" fill="rgba(0,0,0,.5)"/>',
  gen: '<rect x="10" y="26" width="70" height="46" rx="6" fill="#fff"/><path d="M48 32 L36 50 H46 L40 66 L56 46 H46 Z" fill="rgba(0,0,0,.45)"/>',
  heli: '<rect x="8" y="16" width="74" height="6" rx="3" fill="#fff"/><rect x="42" y="22" width="6" height="10" fill="#fff"/><ellipse cx="42" cy="48" rx="26" ry="16" fill="#fff"/><rect x="62" y="44" width="24" height="7" fill="#fff"/><path d="M24 68 H60" stroke="#fff" stroke-width="6"/>',
  sneak: '<circle cx="45" cy="22" r="10" fill="#fff"/><path d="M30 80 L40 54 L30 40 L52 34 L62 50 L72 58" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  scratch: '<path d="M20 70 L50 16 M34 76 L64 22 M48 80 L76 30" stroke="#fff" stroke-width="8" stroke-linecap="round"/>',
  cut: '<path d="M14 74 L76 18" stroke="#fff" stroke-width="12" stroke-linecap="round"/><circle cx="40" cy="62" r="6" fill="#fff"/><circle cx="56" cy="70" r="5" fill="#fff"/>',
  bite: '<path d="M14 30 Q45 6 76 30 L68 40 L60 30 L52 42 L45 30 L38 42 L30 30 L22 40 Z M14 60 Q45 84 76 60 L68 50 L60 60 L52 48 L45 60 L38 48 L30 60 L22 50 Z" fill="#fff"/>',
  shield: '<path d="M45 8 L78 20 V44 Q78 70 45 84 Q12 70 12 44 V20 Z" fill="#fff"/>',
  bio: '<circle cx="45" cy="45" r="10" fill="#fff"/><circle cx="45" cy="22" r="14" fill="none" stroke="#fff" stroke-width="7"/><circle cx="25" cy="58" r="14" fill="none" stroke="#fff" stroke-width="7"/><circle cx="65" cy="58" r="14" fill="none" stroke="#fff" stroke-width="7"/>',
  sick: '<circle cx="45" cy="45" r="34" fill="none" stroke="#fff" stroke-width="8"/><path d="M28 36 L38 42 M62 36 L52 42" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M30 64 Q37 56 45 64 Q53 72 60 64" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>',
  food: '<path d="M18 40 Q18 20 45 20 Q72 20 72 40 Z" fill="#fff"/><rect x="14" y="44" width="62" height="10" rx="4" fill="#fff"/><path d="M18 58 H72 Q72 74 45 74 Q18 74 18 58 Z" fill="#fff"/>',
  snow: '<path d="M45 8 V82 M13 26 L77 64 M13 64 L77 26" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M36 14 L45 22 L54 14 M36 76 L45 68 L54 76" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>',
  fridge: '<rect x="22" y="6" width="46" height="78" rx="6" fill="#fff"/><path d="M22 32 H68" stroke="rgba(0,0,0,.45)" stroke-width="5"/><rect x="58" y="14" width="5" height="12" fill="rgba(0,0,0,.45)"/><rect x="58" y="40" width="5" height="18" fill="rgba(0,0,0,.45)"/>',
  bolt: '<path d="M52 6 L18 52 H42 L34 84 L72 34 H48 Z" fill="#fff"/>',
  fire: '<path d="M45 6 Q70 34 66 58 A22 22 0 0 1 24 58 Q20 40 36 26 Q36 42 46 44 Q40 26 45 6 Z" fill="#fff"/>'
};
const k_end = k => k;
// moodle real do jogo: H.moodle(k, 'pz:Mood_Panicked', ...) ou 'pz:Status_Hunger' (arquivos em assets/moodles)
const pzMoodle = (n, ok) => `<i class="pzbg" style="background:${ok ? '#4f9a2c' : '#b3142c'}"></i><img src="./assets/moodles/${n}.png"><img src="./assets/moodles/_Moodles_BGoutline.png">`;
const svgIcon = (k, s = 86) => `<svg width="${s}" height="${s}" viewBox="0 0 90 90">${ICON[k]}</svg>`;
// ---- cenas ----
const SC = EP.scenes.map((s, k) => {
  const sec = el('section', 'scene' + (s.red ? ' redbg onred' : ''), null, main); sec.id = 'sc' + k;
  if (s.lab) el('div', 'lab', s.lab, sec);
  return Object.assign({ sec, k, f0: C(s.at) }, s);
});
SC.forEach((s, k) => { s.f1 = k + 1 < SC.length ? SC[k + 1].f0 : 1e9; });
window.__CUTS = SC.map(s => s.f0);
window.__RED = SC.map(s => !!s.red);
const sceneOf = i => { let r = SC[0]; SC.forEach(s => { if (EP.scenes[s.k].at <= i) r = s; }); return r; };
// ---- título por frase ----
const titles = EP.titles.map(t => { const s = sceneOf(t.i); const a = el('div', 't t1', t.a, s.sec), b = el('div', 't t2' + (t.col === 'green' ? ' g' : ''), t.b || '', s.sec);
  a.id = nid('ta'); b.id = nid('tb'); if (t.col === 'bone') b.style.color = 'var(--bone)'; if (t.col === 'yellow') b.style.color = '#ffb020'; if (t.size) b.style.fontSize = t.size + 'px'; if (t.aSize) a.style.fontSize = t.aSize + 'px'; return Object.assign({}, t, { a, b, s }); });
const M = Motion.film({ fps: FPS, duration: DUR, width: 1080, height: 1920, clock: 'smooth' });
window.__M = M;
SC.forEach((s, k) => { if (k > 0) M.cut(s.f0, { hide: ['#sc' + (k - 1)], show: ['#sc' + k] }); });
// flash curto em cada corte (impacto de montagem)
const fl = el('div', null, null, main, 'position:absolute;inset:0;background:#fff;pointer-events:none;mix-blend-mode:overlay'); fl.id = 'cutflash';
M.kf('#cutflash', 'opacity', [[0, 0]].concat(...SC.slice(1).map(s => [[s.f0 - 1, 0], [s.f0, s.red ? .0 : .55], [s.f0 + 5, 0, 'softLand']])));
// vinheta de cor (perigo / infecção) controlada pelo episódio
const vg = el('div', null, null, main, 'position:absolute;inset:0;pointer-events:none;opacity:0'); vg.id = 'vig';
if (window.EP && window.EP.versao) el('div', 'ver', window.EP.versao, main);   // class versao: selo discreto da build do jogo
if (EP.OFF) { const sc = el('div', null, null, main, 'position:absolute;inset:0;pointer-events:none;background:radial-gradient(110% 80% at 50% 50%,rgba(255,30,50,.0) 20%,rgba(200,0,20,.85) 100%)'); sc.id = 'scarefx';
  M.kf('#scarefx', 'opacity', [[0, 0], [8, 0], [9, 1], [24, .25, 'softLand'], [window.__INTRO, 0]]); const ifl = el('div', null, null, main, 'position:absolute;inset:0;background:#fff;pointer-events:none;mix-blend-mode:overlay;opacity:0'); ifl.id = 'introflash'; M.kf('#introflash', 'opacity', [[0, 0], [window.__INTRO - 1, 0], [window.__INTRO, .6], [window.__INTRO + 5, 0, 'softLand']]); }
SC.forEach((s, k) => { if (s.red) { M.hide('#shade', s.f0); if (k + 1 < SC.length) M.show('#shade', s.f1); } });
const T1 = (a, b, at, o = {}) => { M.words('#' + a.id, { at, mech: 'pop', gaps: 3, dist: .6, frames: 9, ease: 'snapSettle', fixedSlots: false });
  if (b.textContent) M.words('#' + b.id, { at: at + (o.d || 6), mech: 'pop', gaps: 3, dist: 1.8, frames: 10, ease: 'crashIn', fixedSlots: false }); };
titles.forEach((t, n) => { const at = (n === 0 || titles[n - 1].s !== t.s) ? Math.max(t.s.f0, C(t.i)) + (t.delay || 0) : C(t.i);
  const nxt = titles.slice(n + 1).find(u => u.s === t.s); const end = nxt ? C(nxt.i) : null;
  if (n > 0 && titles[n - 1].s === t.s) { M.show('#' + t.a.id, at); M.show('#' + t.b.id, at); }
  T1(t.a, t.b, at, t);
  if (end != null) { M.hide('#' + t.a.id, end); M.hide('#' + t.b.id, end); } });
// ---- helpers de HUD ----
const H = {
  F, C, M, el, svgIcon, sc: k => SC[k].sec,
  moodle(k, icon, tag, at, ok = false, off = null, top = 640) { const k0 = k, s = SC[k].sec, id = nid('m'), tid = nid('mt');
    const pz = icon.startsWith('pz:'), m = el('div', 'moodle ' + (pz ? 'pz' : ok ? 'mood-ok' : 'mood-bad'), pz ? pzMoodle(icon.slice(3), ok) : svgIcon(icon), s, `top:${top}px`); m.id = id;
    const t = el('div', 'mtag', tag, s, `top:${top + 152}px;color:${ok ? 'var(--green)' : 'var(--red2)'}`); t.id = tid;
    M.enter('#' + id, { at, frames: 9, ease: 'crashIn', from: { scale: 2.4, rotation: -12 } }); M.enter('#' + tid, { at: at + 4, frames: 8, from: { y: 20 } });
    M.kf('#' + id, 'rotation', [[at + 12, 0], [at + 15, -6], [at + 18, 6], [at + 21, 0]]);
    { const k = [[at + 22, 1]]; const endF = off != null ? off : SC[k_end(k0)].f1; for (let f = at + 22; f < Math.min(endF, at + 400); f += 18) k.push([f + 9, 1.07, 'softInOut'], [f + 18, 1, 'softInOut']); M.kf('#' + id, 'scale', k); }
    if (off != null) { M.hide('#' + id, off); M.hide('#' + tid, off); } return id; },
  bar(k, label, keys, opt = {}) { const s = SC[k].sec, id = nid('bar'), pid = nid('pct');
    el('div', 'bartag', label, s, 'left:170px;top:1600px;color:var(--bone)');
    const p = el('div', 'bartag', '', s, 'left:690px;top:1600px;width:220px;text-align:right;color:var(--bone)'); p.id = pid;
    const b = el('div', 'bar', `<i id="${id}" style="background:${opt.color || 'var(--bone)'}"></i>`, s, 'top:1644px');
    M.kf('#' + id, 'scaleX', keys); if (opt.colorKeys) M.kf('#' + id, 'backgroundColor', opt.colorKeys);
    if (opt.count) M.count('#' + pid, opt.count); else p.textContent = opt.text || ''; return id; },
  // item do jogo (arte original, assets/items): quadro de inventário com o ícone e o nome. name = 'Item_Hammer'
  item(k, name, tag, at, o = {}) { const s = SC[k].sec, id = nid('it'), sz = o.size || 150;
    const e = el('div', 'pzitem', `<img src="./assets/items/${name}.png" style="width:${sz - 26}px;height:${sz - 26}px">` + (tag ? `<b>${tag}</b>` : ''), s, `left:${o.left ?? 120}px;top:${o.top ?? 1380}px;width:${sz}px`); e.id = id;
    M.enter('#' + id, { at, frames: 8, ease: 'crashIn', from: { scale: 2.2, y: 30 } }); if (o.off != null) M.hide('#' + id, o.off); return id; },
  // fila de itens: list = [[name, tag, at], ...]
  items(k, list, o = {}) { const sz = o.size || 150, gap = o.gap || 26, w = list.length * sz + (list.length - 1) * gap, x0 = o.left ?? Math.round((960 - w) / 2 + 20);
    return list.map(([n, t, at], i) => H.item(k, n, t, at, Object.assign({}, o, { left: x0 + i * (sz + gap), size: sz }))); },
  stamp(k, text, at, top = 1430, ok = false) { const id = nid('st'); const e = el('div', 'stamp', text, SC[k].sec, `top:${top}px` + (ok ? ';border-color:var(--green);color:var(--green)' : '')); e.id = id;
    M.enter('#' + id, { at, frames: 8, ease: 'crashIn', from: { scale: 3, rotation: -20 } }); return id; },
  check(k, at, left = 445, top = 1440) { const id = nid('ck'); el('div', null, '<svg width="190" height="190" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#8fe04a"/><path d="M55 104 L88 136 L148 70" stroke="#0d0b0b" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>', SC[k].sec, `position:absolute;left:${left}px;top:${top}px`).id = id;
    M.enter('#' + id, { at, frames: 9, ease: 'crashIn', from: { scale: 2.6 } }); return id; },
  cross(k, at, left = 445, top = 1440) { const id = nid('cx'); el('div', null, '<svg width="190" height="190" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="#e0263f"/><path d="M62 62 L138 138 M138 62 L62 138" stroke="#fff" stroke-width="20" stroke-linecap="round"/></svg>', SC[k].sec, `position:absolute;left:${left}px;top:${top}px`).id = id;
    M.enter('#' + id, { at, frames: 9, ease: 'crashIn', from: { scale: 2.6 } }); return id; },
  panel(k, title, rows, at, opt = {}) { const id = nid('pn'); const s = SC[k].sec;
    const p = el('div', 'panel inv', `<div class="ptitle">${title}</div>` + rows.map((r, i) => `<div id="${id}r${i}" class="row" style="${r[2] || ''}"><span>${r[0]}</span><span>${r[1] || ''}</span></div>`).join(''), s, opt.style || ''); p.id = id;
    M.enter('#' + id, { at, frames: 10, ease: 'snapSettle', from: { x: -300 } });
    rows.forEach((r, i) => M.enter(`#${id}r${i}`, { at: at + 6 + i * (opt.gap || 6), frames: 7, from: { x: -60 }, ease: 'softLand' })); return id; },
  chip(k, html, at, style) { const id = nid('cp'); el('div', 'chip', html, SC[k].sec, style).id = id; M.enter('#' + id, { at, frames: 9, ease: 'snapSettle', from: { y: 30, scale: 1.2 } }); return id; },
  pct(k, to, at, color = 'var(--red2)', frames = 26) { const id = nid('pc'); el('div', 'pct', '0%', SC[k].sec, `color:${color}`).id = id;
    M.enter('#' + id, { at, frames: 9, ease: 'snapSettle', from: { scale: 1.6 } }); M.count('#' + id, { at, from: 0, to, frames, round: true, format: v => v + '%' }); return id; },
  big(k, html, at, style, from = { scale: 3.5, blur: 14 }) { const id = nid('bg'); el('div', 'big', html, SC[k].sec, style).id = id; M.enter('#' + id, { at, frames: 10, ease: 'crashIn', from }); return id; },
  words(k, html, at, style, mech = 'rise') { const id = nid('w'); el('div', 't', html, SC[k].sec, style).id = id; M.words('#' + id, { at, mech, gaps: 3, dist: 60, frames: 8 }); return id; },
  died(k, text, at) { const id = nid('dd'); el('div', null, text, SC[k].sec, 'position:absolute;left:0;width:1080px;top:1660px;text-align:center;font:600 54px/1 Georgia,serif;font-style:italic;color:var(--bone);text-shadow:0 3px 14px #000').id = id; M.words('#' + id, { at, mech: 'focus', gaps: 4, frames: 10 }); return id; },
  follow(k, at) { const s = SC[k].sec; const b1 = el('div', 'btn', 'SEGUIR', s, 'top:1560px'), b2 = el('div', 'btn', 'SEGUINDO ✓', s, 'top:1560px;background:#2a2222;border:4px solid var(--bone)'), cu = el('div', null, '<svg width="80" height="110" viewBox="0 0 40 55"><path d="M2 2 L2 44 L13 34 L21 52 L28 49 L20 31 L36 31 Z" fill="#fff" stroke="#000" stroke-width="2.5"/></svg>', s, 'position:absolute;left:0;top:0');
    b1.id = nid('b'); b2.id = nid('b'); cu.id = nid('cu'); M.enter('#' + b1.id, { at, frames: 10, ease: 'snapSettle', from: { scale: 1.6, y: 40 } });
    M.cursor('#' + cu.id, { keys: [[at, 1100, 1900, 3, -20], [at + 16, 560, 1630, 1, 0]], ease: 'glide' }); M.press('#' + cu.id, '#' + b1.id, { at: at + 20, frames: 3, release: true });
    M.show('#' + b2.id, at + 25); M.hide('#' + b1.id, at + 25); M.kf('#' + b2.id, 'scale', [[at + 25, 1.12], [at + 34, 1, 'softLand']]); return { b2: b2.id, cu: cu.id }; },
  vig(color, keys) { M.kf('#vig', 'opacity', keys); document.getElementById('vig').style.background = `radial-gradient(120% 80% at 50% 55%, rgba(0,0,0,0) 35%, ${color} 100%)`; },
  VO_END
};
if (EP.extras) EP.extras(H);
window.__worldReady = new Promise(r => window.__resolveWorld = r);
window.__ready = Promise.all([Motion.loaded(), window.__worldReady]);
})();
