// Copia a lista curada de assets.json (projeto/assets -> public/jogo) e gera os dados do repo que o site usa.
// Roda sozinho antes do dev e do build. Imagens grandes viram WebP no tamanho certo; ícones e moodles ficam PNG (pixel art).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import matter from 'gray-matter'

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAIZ = path.resolve(SITE, '..')
const SAIDA = path.join(SITE, 'public/jogo')
const lista = JSON.parse(fs.readFileSync(path.join(SITE, 'assets.json'), 'utf8'))

const ehLfsPonteiro = (p) => fs.statSync(p).size < 200 && fs.readFileSync(p, 'utf8').startsWith('version https://git-lfs')
const faltando = []
function origem(rel) {
  const p = path.join(RAIZ, rel)
  if (!fs.existsSync(p) || ehLfsPonteiro(p)) { faltando.push(rel); return null }
  return p
}
fs.mkdirSync(path.join(SAIDA, 'itens'), { recursive: true })
fs.mkdirSync(path.join(SAIDA, 'moodles'), { recursive: true })

const tarefas = []
for (const [nome, { de, larguras }] of Object.entries(lista.logos)) {
  const p = origem(de); if (!p) continue
  for (const w of larguras) tarefas.push(sharp(p).resize({ width: w }).webp({ quality: 86 }).toFile(path.join(SAIDA, `${nome}-${w}.webp`)))
  tarefas.push(sharp(p).resize({ width: larguras.at(-1) }).png({ compressionLevel: 9 }).toFile(path.join(SAIDA, `${nome}.png`)))
}
for (const m of lista.moodles) { const p = origem(`projeto/assets/moodles/${m}.png`); if (p) fs.copyFileSync(p, path.join(SAIDA, 'moodles', `${m}.png`)) }
for (const i of lista.itens) { const p = origem(`projeto/assets/items/${i}.png`); if (p) fs.copyFileSync(p, path.join(SAIDA, 'itens', `${i}.png`)) }
for (const [nome, { de, larguras }] of Object.entries(lista.cenas)) {
  const p = origem(de); if (!p) continue
  for (const w of larguras) tarefas.push(sharp(p).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(SAIDA, `${nome}-${w}.webp`)))
}
await Promise.all(tarefas)

// ---- dados do repo (o repo é o dono): episódios e fatos validados ----
const GERADO = path.join(SITE, 'src/gerado'); fs.mkdirSync(GERADO, { recursive: true })
const episodios = fs.readdirSync(path.join(RAIZ, 'roteiros')).filter((f) => /^ep\d+.*\.md$/.test(f)).sort().map((f) => {
  const t = fs.readFileSync(path.join(RAIZ, 'roteiros', f), 'utf8')
  const fm = Object.fromEntries([...(t.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '').matchAll(/^(\w+):\s*(.*)$/gm)].map((m) => [m[1], m[2].trim()]))
  // título publicado no YouTube (bloco "TITULO" das instruções de publicação), sem o "| Project Zomboid"
  const titulo = t.match(/^T[IÍ]TULO:?\s*\n(.+)$/m)?.[1].replace(/\s*\|\s*Project Zomboid\s*$/i, '').trim() ?? null
  return { nn: fm.ep, slug: f.replace(/\.md$/, ''), tema: fm.tema, status: fm.status, titulo, youtube: /^[\w-]{11}$/.test(fm.youtube ?? '') ? fm.youtube : null }
})
fs.writeFileSync(path.join(GERADO, 'episodios.json'), JSON.stringify(episodios, null, 1) + '\n')
const fatos = JSON.parse(fs.readFileSync(path.join(RAIZ, 'projeto/pipeline/fatos.json'), 'utf8')).fatos
fs.writeFileSync(path.join(GERADO, 'fatos.json'), JSON.stringify(Object.fromEntries(Object.entries(fatos).map(([k, v]) => [k, { texto: v.texto, build: v.build, fonte: v.fonte }])), null, 1) + '\n')

// guias: lidos aqui (o Worker não tem sistema de arquivos) e embutidos no bundle como JSON
const PASTA_GUIAS = path.join(SITE, 'content/guias')
const guias = fs.readdirSync(PASTA_GUIAS).filter((f) => f.endsWith('.mdx')).map((f) => {
  const { data, content } = matter(fs.readFileSync(path.join(PASTA_GUIAS, f), 'utf8'))
  return { slug: f.replace(/\.mdx$/, ''), ...data, data: new Date(data.data).toISOString(), build: String(data.build), episodio: data.episodio ? String(data.episodio) : null, corpo: content }
})
fs.writeFileSync(path.join(GERADO, 'guias.json'), JSON.stringify(guias, null, 1) + '\n')

const n = lista.moodles.length + lista.itens.length + Object.keys(lista.logos).length + Object.keys(lista.cenas).length
console.log(`assets: ${n - faltando.length}/${n} copiados; ${episodios.length} episódios; ${Object.keys(fatos).length} fatos validados`)
if (faltando.length) {
  console.log(`::warning::assets sem arquivo (rode git lfs pull): ${faltando.join(', ')}`)
  if (process.env.CI) process.exit(1)
}

// ---- imagem de compartilhamento (1200x630) e favicon ----
const PUB = path.join(SITE, 'public')
const logoH = origem('projeto/assets/logo/logo-horizontal-3x1.png')
const icone = origem('projeto/assets/logo/logo-icone-1x1.png')
const cena = origem('site/arte/cena-fogueira.jpg')
if (icone) await sharp(icone).resize(64).png().toFile(path.join(PUB, 'favicon.png'))
if (logoH && cena) {
  const cenaNoite = await sharp(cena).resize(480, 630, { fit: 'cover', position: 'bottom' }).modulate({ brightness: 0.55, saturation: 0.75 }).linear([0.85, 0.95, 1.15], [0, 4, 14]).toBuffer()
  const logo = await sharp(logoH).resize(620).toBuffer()
  const fundo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="g" cx="78%" cy="10%" r="90%"><stop offset="0" stop-color="#1a2533"/><stop offset=".55" stop-color="#0d1117"/><stop offset="1" stop-color="#08090b"/></radialGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`)
  const frente = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs>
    <linearGradient id="f" x1="0" x2="1"><stop offset="0" stop-color="#0b0e13" stop-opacity="1"/><stop offset="1" stop-color="#0b0e13" stop-opacity="0"/></linearGradient>
    <radialGradient id="fogo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffaa46" stop-opacity=".75"/><stop offset=".4" stop-color="#ff6e28" stop-opacity=".28"/><stop offset="1" stop-color="#ff6e28" stop-opacity="0"/></radialGradient></defs>
    <rect x="720" y="0" width="200" height="630" fill="url(#f)"/>
    <circle cx="1075" cy="545" r="150" fill="url(#fogo)" style="mix-blend-mode:screen"/>
    <text x="70" y="455" font-family="Arial Black, Arial" font-weight="900" font-size="30" fill="#efe5cf">DICAS DE PROJECT ZOMBOID</text>
    <text x="70" y="495" font-family="Arial Black, Arial" font-weight="900" font-size="30" fill="#efe5cf">EM 60 SEGUNDOS</text>
    <text x="70" y="545" font-family="Courier New, monospace" font-weight="700" font-size="22" fill="#ff3d55">GUIAS · COMUNIDADE · BUILD 42</text></svg>`)
  await sharp(fundo).composite([{ input: cenaNoite, left: 720, top: 0 }, { input: frente, left: 0, top: 0 }, { input: logo, left: 50, top: 140 }]).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(PUB, 'og.jpg'))
}
