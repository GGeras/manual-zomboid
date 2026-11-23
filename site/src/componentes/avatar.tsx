import type { Perfil } from '@/lib/comunidade/tipos'

// Cor estável por usuário, dentro da paleta da marca.
const CORES = ['#ff3d55', '#8fe04a', '#ffb020', '#6fb7ff', '#c59bff', '#3dd6c6', '#ff8a3d']
const cor = (u: string) => CORES[[...u].reduce((a, c) => a + c.charCodeAt(0), 0) % CORES.length]

export function Avatar({ perfil, tamanho = 28 }: { perfil: Pick<Perfil, 'usuario' | 'avatar' | 'papel'>; tamanho?: number }) {
  const estilo = { width: tamanho, height: tamanho }
  if (perfil.papel === 'admin' && !perfil.avatar)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/jogo/logo-icone-64.webp" alt="" style={estilo} className="shrink-0 rounded-full bg-black" />
  if (perfil.avatar)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={perfil.avatar} alt="" style={estilo} className="shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
  const c = cor(perfil.usuario)
  return (
    <span aria-hidden style={{ ...estilo, background: `${c}22`, color: c, borderColor: `${c}55`, fontSize: tamanho * 0.42 }}
      className="grid shrink-0 place-items-center rounded-full border font-mono font-extrabold uppercase">
      {perfil.usuario.slice(0, 2)}
    </span>
  )
}
