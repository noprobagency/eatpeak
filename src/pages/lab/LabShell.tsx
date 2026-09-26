/**
 * L'impalcatura delle pagine di laboratorio: titolo, nota, e la barra dei
 * parametri (`?font=`, `?italic=`, `?body=`) che vale in tutto il sito.
 */

import type { ReactNode } from 'react'
import { Container, Section } from '../../components'
import { FONT_CANDIDATES, fontLabHref, setFontLab, useFontLab } from '../../lib/fontlab'
import { LAB_NAV } from '../../lib/routes'
import { cn } from '../../lib/cn'

export function LabShell({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  const lab = useFontLab()
  return (
    <>
      <Section tone="page" spacing="tight">
        <Container>
          <div className="flex flex-col gap-4">
            <nav aria-label="Laboratori" className="flex flex-wrap gap-2">
              {LAB_NAV.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'rounded-full border px-4 py-2 text-body-sm font-display font-bold transition-colors',
                    window.location.hash.startsWith(l.href) ? 'border-border-brand bg-bg-brand-soft text-text-brand' : 'border-border-default text-text-secondary hover:border-border-brand',
                  )}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <h1 className="type-display-lg text-text-primary">{title}</h1>
            <p className="max-w-prose text-body-lg text-text-secondary">{intro}</p>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-bg-brand-soft p-4">
              <span className="type-eyebrow text-text-brand">Font in tutto il sito</span>
              {FONT_CANDIDATES.map((f) => (
                <a
                  key={f.id}
                  href={fontLabHref({ font: f.id })}
                  onClick={(e) => { e.preventDefault(); setFontLab({ font: f.id }); window.history.replaceState(null, '', fontLabHref({ font: f.id })) }}
                  className={cn(
                    'rounded-full px-3 py-1 text-body-sm font-display font-bold transition-colors',
                    lab.font === f.id ? 'bg-bg-brand text-text-on-brand' : 'bg-bg-surface text-text-secondary hover:text-text-primary',
                  )}
                  style={{ fontFamily: f.stack }}
                >
                  {f.family}
                </a>
              ))}
              <label className="ml-auto flex items-center gap-2 text-body-sm text-text-secondary">
                <input type="checkbox" checked={lab.italic} onChange={(e) => { setFontLab({ italic: e.target.checked }); window.history.replaceState(null, '', fontLabHref({ italic: e.target.checked })) }} />
                parola in corsivo
              </label>
              <label className="flex items-center gap-2 text-body-sm text-text-secondary">
                <input type="checkbox" checked={lab.bodyDisplay} onChange={(e) => { setFontLab({ bodyDisplay: e.target.checked }); window.history.replaceState(null, '', fontLabHref({ bodyDisplay: e.target.checked })) }} />
                testo nello stesso font
              </label>
            </div>
          </div>
        </Container>
      </Section>
      {children}
    </>
  )
}

export default LabShell
