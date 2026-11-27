import type { Dica } from '@/lib/conteudo'
import { cx } from '@/lib/util'

/** Um fato validado: texto exato de info-validada/ + selo "✓ Conferido · build" + a fonte (arquivo do jogo, wiki) ao abrir. */
export function FatoConferido({ f, compacto = false }: { f: Pick<Dica, 'texto' | 'build' | 'fonte'>; compacto?: boolean }) {
  return (
    <div className={cx('rounded-xl border border-white/[.08] border-l-[3px] border-l-vivo bg-[#141416]', compacto ? 'p-3.5' : 'p-4 sm:p-5')}>
      <p className={cx('leading-relaxed text-osso', compacto ? 'text-[.95rem]' : 'text-[1.02rem]')}>{f.texto}</p>
      <details className="group mt-2.5">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-2 [&::-webkit-details-marker]:hidden">
          <span className="chip h-5 border-vivo/40 text-[.6rem] text-vivo">✓ Conferido · {f.build}</span>
          <span className="text-xs font-semibold text-apagado underline-offset-2 group-open:hidden hover:text-osso-2 hover:underline">ver fonte</span>
        </summary>
        <p className="mt-2 break-words font-mono text-[.72rem] leading-relaxed text-apagado">{f.fonte}</p>
      </details>
    </div>
  )
}
