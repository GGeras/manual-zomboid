// npm run config — mostra o que já está configurado no site e o que falta (sem ler nenhum segredo).
// Público: confere config.publico.json. Segredo/painel: só lista onde mora (o site não tem como ver).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = JSON.parse(fs.readFileSync(path.join(SITE, 'config.publico.json'), 'utf8'))
const { integracoes } = JSON.parse(fs.readFileSync(path.join(SITE, 'integracoes.json'), 'utf8'))
const valor = (k) => k.split('.').reduce((o, p) => (o == null ? o : o[p]), pub)

// Formato das chaves públicas: pega erro de colar a coisa errada (ex.: segredo no lugar do público).
const FORMATO = {
  'youtube.canalId': /^UC[\w-]{22}$/,
  'discord.servidorId': /^\d{17,20}$/,
  'discord.convite': /^https:\/\/discord\.(gg|com\/invite)\/[\w-]+$/,
  'comunidade.supabaseUrl': /^https:\/\/[a-z0-9]{20}\.supabase\.co$/,
  'comunidade.supabaseChavePublica': /^(sb_publishable_[\w-]+|eyJ[\w-]+\.[\w-]+\.[\w-]+)$/,
  'comunidade.turnstileSiteKey': /^0x[\w-]+$/,
  'site.url': /^https:\/\/[^/]+$/,
}
const SEGREDO = /^(sb_secret_|xoxb-|xoxp-|re_[A-Za-z0-9]{8,}|0x4AAAAAAA[\w-]*secret)/

let erros = 0
for (const i of integracoes) {
  const pubs = i.chaves.filter((c) => c.tipo === 'publico')
  const faltam = pubs.filter((c) => valor(c.nome) == null)
  const status = pubs.length === 0 ? 'painel' : faltam.length === 0 ? 'OK' : faltam.length === pubs.length ? 'falta' : 'parcial'
  console.log(`${status.padEnd(7)} ${i.etapa.padEnd(3)} ${i.nome}  (configuracao.md §${i.secao})`)
  for (const c of i.chaves) {
    const v = c.tipo === 'publico' ? valor(c.nome) : undefined
    if (c.tipo === 'publico' && v != null) {
      if (typeof v === 'string' && SEGREDO.test(v)) { console.log(`   ERRO ${c.nome}: parece um SEGREDO. Tire daqui agora e gere outro.`); erros++ }
      else if (FORMATO[c.nome] && !FORMATO[c.nome].test(String(v))) { console.log(`   ERRO ${c.nome}: formato inesperado "${v}"`); erros++ }
    }
    const marca = c.tipo === 'publico' ? (v == null ? '[ ]' : '[x]') : '[🔒]'
    console.log(`   ${marca} ${c.nome}${c.onde ? ` → ${c.onde}` : ''}${c.ok ? ` (${c.ok})` : ''}`)
  }
}
process.exit(erros ? 1 : 0)
