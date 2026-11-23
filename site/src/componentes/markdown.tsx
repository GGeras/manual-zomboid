import { markdown } from '@/lib/markdown'
import { cx } from '@/lib/util'
import { LiteYoutube } from './lite-youtube'

export function Markdown({ texto, className }: { texto: string; className?: string }) {
  return (
    <div className={cx('prosa prosa-post', className)}>
      {markdown(texto).map((b, i) =>
        b.tipo === 'youtube' ? <LiteYoutube key={i} id={b.valor} titulo="Vídeo do YouTube" className="max-w-md" />
          : b.tipo === 'steam' ? (
            <a key={i} href={b.valor} rel="nofollow ugc noopener" target="_blank" className="!no-underline flex items-center gap-3 rounded-xl border border-borda bg-[#1b2838]/60 p-3 hover:border-[#66c0f4]/50">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#171a21] font-mono text-xs font-extrabold text-[#66c0f4]">STEAM</span>
              <span className="min-w-0"><span className="block truncate text-sm font-semibold text-osso">{b.valor.includes('workshop') || b.valor.includes('filedetails') ? 'Item do Workshop' : 'Página na Steam'}</span><span className="block truncate text-xs text-apagado">{b.valor.replace(/^https?:\/\//, '')}</span></span>
            </a>)
            : <div key={i} dangerouslySetInnerHTML={{ __html: b.valor }} />,
      )}
    </div>
  )
}
