/**
 * #/lab/simbolo — le varianti del simbolo.
 *
 * Tre punti uguali a triangolo ricordano troppo Asana: qui ci sono sei
 * cambi minimi (crescendo, punta miele, griglia, pendio, e le due somme),
 * ognuno a 16, 32, 64 e 256px, su arancia, lime, bianco e carta, nel lockup
 * e nel contenitore favicon. Accanto a ogni variante a 32px c'e' il "test
 * Asana": un triangolo di tre punti uguali disegnato da noi, per giudicare
 * quanto ci si allontana. La default e' V5 dietro il flag SYMBOL_VARIANT: la
 * scelta finale e' del brand.
 */

import { Container, Section } from '../../components'
import { Icon, Lockup, VertexBreath } from '../../brand'
import { SYMBOL_VARIANT, SYMBOL_VARIANTS, type SymbolVariantId } from '../../brand/paths'
import { cn } from '../../lib/cn'
import { LabShell } from './LabShell'

const SIZES = [16, 32, 64, 256] as const

const FIELDS = [
  { id: 'arancia', label: 'arancia', className: 'bg-bg-flavor-arancia', color: 'white' as const, onLight: false },
  { id: 'lime', label: 'lime', className: 'bg-bg-flavor-lime', color: 'white' as const, onLight: false },
  { id: 'bianco', label: 'bianco', className: 'bg-bg-surface border border-border-subtle', color: 'arancia' as const, onLight: true },
  { id: 'carta', label: 'carta', className: 'bg-bg-page border border-border-subtle', color: 'arancia' as const, onLight: true },
] as const

/** Il triangolo di tre punti uguali, disegnato da noi. Non e' il logo di nessuno. */
function AsanaTest({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="50" cy="30" r="14" fill="#3A2A22" opacity="0.5" />
      <circle cx="30" cy="66" r="14" fill="#3A2A22" opacity="0.5" />
      <circle cx="70" cy="66" r="14" fill="#3A2A22" opacity="0.5" />
    </svg>
  )
}

function Variant({ id }: { id: SymbolVariantId }) {
  const v = SYMBOL_VARIANTS[id]
  const active = id === SYMBOL_VARIANT
  return (
    <section className="border-t border-border-subtle py-12" id={`simbolo-${id}`}>
      <Container>
        <div className="mb-6 flex flex-wrap items-baseline gap-3">
          <h2 className="type-display-md text-text-primary">
            <span className="font-mono text-text-brand">{id.toUpperCase()}</span> · {v.label.toLowerCase()}
          </h2>
          {active && <span className="rounded-full bg-bg-brand-deep px-3 py-1 text-body-sm font-display font-bold text-neutral-0">default · SYMBOL_VARIANT</span>}
          {id === 'v0' && <span className="rounded-full bg-cacao-100 px-3 py-1 text-body-sm font-display font-bold text-cacao-900">il riferimento da cui allontanarsi</span>}
        </div>
        <p className="mb-8 max-w-prose text-body-md text-text-secondary">{v.note}</p>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* le misure, e il test Asana */}
          <div className="flex flex-col gap-4 rounded-2xl bg-bg-surface p-6">
            <p className="type-label text-text-brand">A 16, 32, 64 e 256px</p>
            <div className="flex flex-wrap items-end gap-8">
              {SIZES.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <Icon size={s} variant="free" color="arancia" symbol={id} onLight title="" />
                  <span className="font-mono text-mono-sm text-text-muted">{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-4 rounded-xl bg-bg-page p-4">
              <Icon size={32} variant="free" color="arancia" symbol={id} onLight title="" />
              <span className="text-body-sm text-text-muted">contro</span>
              <AsanaTest />
              <span className="text-body-sm text-text-secondary">test Asana: tre punti uguali, a 32px. Quanto si distingue?</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Icon size={64} variant="arancia" symbol={id} title="" />
                <span className="type-label text-text-muted">favicon</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon size={64} variant="lime" symbol={id} title="" />
                <span className="type-label text-text-muted">favicon lime</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon size={16} variant="arancia" symbol={id} title="" />
                <span className="type-label text-text-muted">16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <VertexBreath size={64} variant="free" color="arancia" symbol={id} onLight title="" />
                <span className="type-label text-text-muted">respiro (passa sopra)</span>
              </div>
            </div>
          </div>

          {/* sui quattro fondi, e il lockup */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FIELDS.map((f) => (
                <div key={f.id} className={cn('flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl', f.className)}>
                  <Icon size={56} variant="free" color={f.color} symbol={id} onLight={f.onLight} title="" />
                  <span className={cn('type-label', f.color === 'white' ? 'text-neutral-0/85' : 'text-text-muted')}>{f.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-bg-surface p-6">
              <p className="type-label text-text-brand">Lockup</p>
              <Lockup iconSize={48} symbol={id} />
              <div className="rounded-xl bg-bg-flavor-arancia p-4">
                <Lockup iconSize={40} background="flavor" symbol={id} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function SymbolLab() {
  return (
    <LabShell
      title="laboratorio simbolo"
      intro="Tre punti uguali a triangolo ricordano Asana. Sei cambi minimi, tutti con lo stesso significato: il picco, i tre ingredienti, i tre grammi. La default e' V5 dietro il flag SYMBOL_VARIANT in paths.ts; favicon e asset si rigenerano con npm run assets:generate. La scelta e' tua."
    >
      <Section tone="page" spacing="flush">
        {(Object.keys(SYMBOL_VARIANTS) as SymbolVariantId[]).map((id) => (
          <Variant key={id} id={id} />
        ))}
      </Section>
    </LabShell>
  )
}

export default SymbolLab
