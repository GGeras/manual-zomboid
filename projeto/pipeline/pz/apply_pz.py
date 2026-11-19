#!/usr/bin/env python3
"""Liga os modelos do jogo (pz.js) no engine. Idempotente. Episódios antigos (sem EP.pz) continuam com o boneco antigo."""
import os, re
os.chdir('/home/claude/eps')
def sub(s, old, new, name):
    if new in s: return s
    assert old in s, 'trecho não encontrado: ' + name
    return s.replace(old, new, 1)

# ---------- engine.js ----------
s = open('engine.js').read()
s = sub(s, "renderer.shadowMap.enabled = true;",
 "// modelos originais do jogo (EP.pz = true no cfg do episódio): personagens, veículos e ícones de itens\n"
 "const PZ = (window.EP && window.EP.pz) ? await import('./pz.js') : null;\n"
 "if (PZ) { await PZ.ready; await PZ.loadIcons(window.EP.itens || []); }\n"
 "renderer.shadowMap.enabled = true;", 'pz import')
s = sub(s, "function car(x, z, c, ry = 0) { const g = new THREE.Group();",
 "function car(x, z, c, ry = 0, kind = 'normal') {\n"
 "  if (PZ) { const v = PZ.vehicle(kind, c); v.position.set(x, 0, z); v.rotation.y = ry; cars.push(v); scene.add(v); return v; }\n"
 "  const g = new THREE.Group();", 'car')
s = sub(s, "car(-8.5, 1.2, '#6b7f95'); car(15, -1.2, '#8a3b32', Math.PI); car(30, 1.2, '#7a7a5a');",
 "car(-8.5, 1.2, '#6b7f95'); car(15, -1.2, '#8a3b32', Math.PI, 'pickup'); car(30, 1.2, '#c9c7c0');", 'street cars')
s = sub(s, "const S = human({ shirt: '#d9d4c5', jacket: '#3e5a3a', pants: '#2f4a73', skin: '#d9a77f', hair: '#4a2e1a', shoes: '#3a2414', pack: '#5b4630', bat: true, sleeveLong: true, seed: 1 });\nS.jacketMat = mat('#3e5a3a');",
 "const S = PZ ? PZ.humanPZ(PZ.SOBREVIVENTE, scene) : human({ shirt: '#d9d4c5', jacket: '#3e5a3a', pants: '#2f4a73', skin: '#d9a77f', hair: '#4a2e1a', shoes: '#3a2414', pack: '#5b4630', bat: true, sleeveLong: true, seed: 1 });\n"
 "S.jacketMat = PZ ? new THREE.MeshLambertMaterial() : mat('#3e5a3a');", 'S')
s = sub(s, "for (let i = 0; i < 16; i++) { const c = ZC[i % ZC.length]; Z.push(human(",
 "for (let i = 0; i < 16; i++) { if (PZ) { Z.push(PZ.zumbiPZ(i, scene)); continue; } const c = ZC[i % ZC.length]; Z.push(human(", 'Z')
s = sub(s, "const draw = () => { updDust(); renderer.render(scene, cam); };",
 "const draw = () => { updDust(); if (PZ) PZ.syncAll(); renderer.render(scene, cam); };", 'draw')
s = sub(s, "export { cv, scene, cam, setCam,", "export { PZ };\nexport { cv, scene, cam, setCam,", 'export')
open('engine.js', 'w').write(s)

# ---------- sets.js: objeto na mão usa o tamanho real do braço ----------
s = open('sets.js').read()
s = s.replace("const v = new THREE.Vector3(0, -.36, .05).applyMatrix4(h.aR.el.matrixWorld);", "const v = new THREE.Vector3(0, h.pz ? -h.pz.hand : -.36, .05).applyMatrix4(h.aR.el.matrixWorld);")
s = s.replace("const v = new THREE.Vector3(0, -.36, .05).applyMatrix4(h.aL.el.matrixWorld);", "const v = new THREE.Vector3(0, h.pz ? -h.pz.hand : -.36, .05).applyMatrix4(h.aL.el.matrixWorld);")
open('sets.js', 'w').write(s)

# ---------- ep-core.js: item do jogo no HUD ----------
s = open('ep-core.js').read()
s = sub(s, "  stamp(k, text, at, top = 1430, ok = false) {",
 "  // item do jogo (arte original, assets/items): quadro de inventário com o ícone e o nome. name = 'Item_Hammer'\n"
 "  item(k, name, tag, at, o = {}) { const s = SC[k].sec, id = nid('it'), sz = o.size || 150;\n"
 "    const e = el('div', 'pzitem', `<img src=\"./assets/items/${name}.png\" style=\"width:${sz - 26}px;height:${sz - 26}px\">` + (tag ? `<b>${tag}</b>` : ''), s, `left:${o.left ?? 120}px;top:${o.top ?? 1380}px;width:${sz}px`); e.id = id;\n"
 "    M.enter('#' + id, { at, frames: 8, ease: 'crashIn', from: { scale: 2.2, y: 30 } }); if (o.off != null) M.hide('#' + id, o.off); return id; },\n"
 "  // fila de itens: list = [[name, tag, at], ...]\n"
 "  items(k, list, o = {}) { const sz = o.size || 150, gap = o.gap || 26, w = list.length * sz + (list.length - 1) * gap, x0 = o.left ?? Math.round((960 - w) / 2 + 20);\n"
 "    return list.map(([n, t, at], i) => H.item(k, n, t, at, Object.assign({}, o, { left: x0 + i * (sz + gap), size: sz }))); },\n"
 "  stamp(k, text, at, top = 1430, ok = false) {", 'H.item')
open('ep-core.js', 'w').write(s)

s = open('ep.css').read()
if '.pzitem' not in s:
    s += "\n/* item do jogo (ícone original 32x32 ampliado sem borrar) num quadro de inventário */\n.pzitem{position:absolute;display:flex;flex-direction:column;align-items:center;padding:10px 0 12px;background:rgba(13,11,11,.86);border:3px solid rgba(239,229,207,.55);border-radius:8px;box-shadow:0 10px 26px rgba(0,0,0,.55)}\n.pzitem img{image-rendering:pixelated;display:block}\n.pzitem b{margin-top:6px;font:800 24px/1.05 var(--mono);letter-spacing:1px;color:var(--bone);text-align:center;text-transform:uppercase}\n"
    open('ep.css', 'w').write(s)

# ---------- inspeção: itens contam como elemento importante ----------
s = open('pipeline/inspect.mjs').read()
s = s.replace("const IMPORTANT = '.chip,.panel,.bar,.bartag,.stamp,.big,.pct';", "const IMPORTANT = '.chip,.panel,.bar,.bartag,.stamp,.big,.pct,.pzitem';").replace("const TEXT = '.t1,.t2,.chip,.panel,.bartag,.stamp,.big,.pct,.mtag';", "const TEXT = '.t1,.t2,.chip,.panel,.bartag,.stamp,.big,.pct,.mtag,.pzitem';")
open('pipeline/inspect.mjs', 'w').write(s)
print('ok: engine.js, sets.js, ep-core.js, ep.css, inspect.mjs')
