/**
 * <BustaBack /> — il retro della busta, con i 30 cerchi da segnare a penna.
 *
 * Il fronte accumula (retino), il retro conta (griglia). Trenta cerchi a
 * mano, uno per stick: un punto a penna al giorno. Sotto, lo spazio per la
 * foto della garanzia: al giorno 75 si fotografano i retri delle tre buste
 * con i punti segnati. E' cosi' che la garanzia si prova, non con un kit.
 *
 * QUANDO USARLO: prototipi, laboratorio pack, galleria del PDP (miniatura).
 * QUANDO NO: come etichetta di legge. I contenuti obbligatori del retro
 * (tabella, ingredienti, responsabile, lotto e scadenza) restano
 * [dal laboratorio] e stanno in <PackBack /> come elenco.
 */

import { handDotPath, useWordmark, VERTEX } from '../brand'
import { cn } from '../lib/cn'
import { EFSA_CLAIMS } from '../lib/compliance'
import { PRODUCT, flavorById, serialLabel, type FlavorId } from '../lib/copy'
import { packTokens } from '../tokens/tokens'

export interface BustaBackProps {
  flavor: FlavorId
  variant?: 'gusto' | 'neutro'
  /** Giorni gia' segnati, per il mockup: da 0 a 30. */
  marked?: number
  ratio?: number
  width?: number
  lot?: string
  serial?: number
  standalone?: boolean
  title?: string
  className?: string
  fontId?: string
}

const W = 400

export function BustaBack({
  flavor, variant = 'gusto', marked = 0, ratio = 2 / 3, width = 320,
  lot = PRODUCT.launchLot, serial = 137, standalone = false, title, className, fontId,
}: BustaBackProps) {
  const f = flavorById(flavor)
  const wordmark = useWordmark(fontId)
  const neutro = variant === 'neutro'
  const H = Math.round(W / ratio)
  const height = Math.round(width / ratio)
  const safe = Math.round(Math.min(W, H) * packTokens.safe)
  const seal = Math.round(H * packTokens.sealBand)
  const text = neutro ? '#3A2A22' : '#FFFFFF'
  const accent = neutro ? '#C24926' : '#FFFFFF'
  const mono = standalone ? undefined : 'var(--font-mono)'
  const display = standalone ? undefined : 'var(--font-display)'
  const body = standalone ? undefined : 'var(--font-text)'
  const label = title ?? `Busta peak ${f.number} ${f.name}, retro con i 30 cerchi da segnare`

  // La griglia: 10 x 3, nel terzo centrale.
  const gridTop = H * 0.43
  const cell = (W - safe * 2) / 10
  const wordmarkW = 96
  const wordmarkScale = wordmarkW / wordmark.viewBox.width

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} height={height} className={cn('shrink-0', className)} role="img" aria-label={label} data-flavor={neutro ? 'neutro' : f.id} data-side="back">
      <title>{label}</title>
      {standalone && (
        <style>{`text{font-family:Inter,system-ui,sans-serif}.mono{font-family:'DM Mono',ui-monospace,monospace}.display{font-family:Nunito,Gabarito,system-ui,sans-serif}`}</style>
      )}
      <rect x="0" y="0" width={W} height={H} rx="22" fill={neutro ? '#FFFFFF' : f.hex} stroke={neutro ? '#E8E5E0' : undefined} />
      <path d={`M0 22 a22 22 0 0 1 22 -22 h${W - 44} a22 22 0 0 1 22 22 v${seal - 22} h-${W} z`} fill={neutro ? '#FAF7F2' : '#FFFFFF'} opacity={neutro ? 1 : 0.14} />

      {/* Il wordmark piccolo e il vertice: la firma del retro. */}
      <g transform={`translate(${safe} ${seal + 18}) scale(${wordmarkScale})`}>
        <path d={wordmark.path} fill={accent} />
      </g>
      <g transform={`translate(${W - safe - 26} ${seal + 12}) scale(0.28)`}>
        {VERTEX.free.points.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={VERTEX.free.r} fill={accent} />
        ))}
      </g>

      {/* Gli ingredienti, in tre righe. */}
      <text x={safe} y={seal + 82} fill={text} fontFamily={display} className={standalone ? 'display' : undefined} fontWeight="800" fontSize="19">
        Tre ingredienti. Niente che non serva.
      </text>
      {[
        [`Creatina monoidrato · ${PRODUCT.dose} g¹`, ''],
        ['Vitamina D3 vegana', ''],
        ['Glicina · formula CreaVida™', ''],
      ].map(([line], i) => (
        <text key={line} x={safe} y={seal + 108 + i * 20} fill={text} fontFamily={body} fontSize="11.5" opacity="0.92">
          {line}
        </text>
      ))}

      {/* Il tuo mese: 30 cerchi a mano. */}
      <text x={safe} y={gridTop - 16} fill={text} fontFamily={mono} className={standalone ? 'mono' : undefined} fontSize="9.5" letterSpacing="1.4">
        IL TUO MESE · SEGNA UN PUNTO AL GIORNO
      </text>
      {Array.from({ length: 30 }, (_, i) => {
        const col = i % 10
        const row = Math.floor(i / 10)
        const cx = safe + col * cell + cell / 2
        const cy = gridTop + row * (cell + 6) + cell / 2
        const r = cell * 0.36
        const done = i < marked
        return (
          <g key={i} transform={`translate(${cx - r} ${cy - r}) scale(${(r * 2) / 100})`}>
            <path d={handDotPath(`day-${f.id}-${i + 1}`, 42, 0.6)} fill={done ? accent : 'none'} stroke={accent} strokeWidth="7" strokeLinejoin="round" opacity={done ? 1 : 0.9} />
            {!done && (
              <text x="50" y="58" textAnchor="middle" fill={accent} fontFamily={mono} className={standalone ? 'mono' : undefined} fontSize="26" opacity="0.9">
                {i + 1}
              </text>
            )}
          </g>
        )
      })}

      {/* Lo spazio foto per la garanzia. */}
      <rect x={safe} y={H * 0.66} width={W - safe * 2} height={H * 0.13} rx="10" fill="none" stroke={accent} strokeDasharray="5 5" strokeWidth="1.2" opacity="0.8" />
      <text x={W / 2} y={H * 0.66 + H * 0.13 / 2 - 4} textAnchor="middle" fill={text} fontFamily={display} className={standalone ? 'display' : undefined} fontWeight="700" fontSize="11">
        Garanzia Rituale Completo
      </text>
      <text x={W / 2} y={H * 0.66 + H * 0.13 / 2 + 12} textAnchor="middle" fill={text} fontFamily={body} fontSize="9.5" opacity="0.9">
        al giorno 75 fotografa i retri delle 3 buste con i punti segnati
      </text>

      {/* La nota del claim e il piede. */}
      <text x={safe} y={H * 0.82} fill={text} fontFamily={body} fontSize="7.6" opacity="0.85">
        {`¹ ${EFSA_CLAIMS['physical-performance'].it}`.slice(0, 92)}
      </text>
      <text x={safe} y={H * 0.82 + 11} fill={text} fontFamily={body} fontSize="7.6" opacity="0.85">
        {`${EFSA_CLAIMS['physical-performance'].it}`.slice(92)} L’effetto si ottiene con 3 g al giorno.
      </text>
      <rect x={W - safe - 44} y={H - safe - 44} width="44" height="44" rx="6" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.9" />
      <text x={W - safe - 22} y={H - safe - 18} textAnchor="middle" fill={text} fontFamily={mono} className={standalone ? 'mono' : undefined} fontSize="8" letterSpacing="1">
        QR
      </text>
      <text x={safe} y={H - safe - 18} fill={text} fontFamily={mono} className={standalone ? 'mono' : undefined} fontSize="9.5" letterSpacing="1.4">
        COA DEL LOTTO {lot}
      </text>
      <text x={safe} y={H - safe} fill={text} fontFamily={mono} className={standalone ? 'mono' : undefined} fontSize="9.5" letterSpacing="1.4">
        LOTTO {lot} · {serialLabel(serial)}
      </text>
    </svg>
  )
}

export default BustaBack
