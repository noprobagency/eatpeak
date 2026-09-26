/**
 * #/lab/font — il laboratorio dei font per il wordmark e i titoli.
 *
 * Sette candidati, tutti OFL. Per ciascuno: il fronte busta nei due gusti (il
 * Neutro arriva con la fase pack), il wordmark a 64px come nell'header e a
 * tutta larghezza su arancia come nel footer, l'H1 dell'hero, un H2, il
 * prezzo al giorno e il blocco "3 g". La scorecard in fondo e' da compilare a
 * mano: le note restano nel browser (localStorage), la scelta non la fa il
 * sistema.
 */

import { useEffect, useState } from 'react'
import { BustaPack, Container, Em, Section } from '../../components'
import { Logo } from '../../brand'
import { FONT_CANDIDATES, useFontLab, type FontCandidate } from '../../lib/fontlab'
import { CLAIMS } from '../../lib/copy'
import { cn } from '../../lib/cn'
import { LabShell } from './LabShell'

const CRITERIA = [
  'Leggibilità a 48px',
  'Calore',
  'Distanza da Dosys',
  'Resa del bianco su colore',
  'Sembra infantile?',
  'Nota',
] as const

const SCORE_KEY = 'peak-fontlab-scorecard'

function Candidate({ f, active }: { f: FontCandidate; active: boolean }) {
  const display = { fontFamily: f.stack, fontWeight: f.titleWeight }
  return (
    <section className={cn('scroll-mt-24 border-t border-border-subtle py-12', active && 'bg-bg-flavor-arancia-tint/40')} id={`font-${f.id}`}>
      <Container>
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="type-display-md text-text-primary" style={display}>
            {f.family}
            <span className="ml-3 text-body-sm font-normal text-text-muted" style={{ fontFamily: 'var(--font-text)' }}>
              wordmark {f.wordmarkWeight} · titoli {f.titleWeight} · {f.note}
            </span>
          </h2>
          {active && <span className="rounded-full bg-bg-brand-deep px-3 py-1 text-body-sm font-display font-bold text-neutral-0">attivo nel sito</span>}
        </div>

        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
          {/* i fronti busta */}
          <div className="flex flex-wrap gap-4">
            <BustaPack flavor="arancia" width={190} fontId={f.id} />
            <BustaPack flavor="lime" width={190} fontId={f.id} />
          </div>

          <div className="flex flex-col gap-6">
            {/* header 64px e footer a tutta larghezza */}
            <div className="flex items-center gap-6 rounded-2xl border border-border-subtle bg-bg-page p-5">
              <Logo size={64} variant="ink" fontId={f.id} title="" />
              <span className="text-body-sm text-text-muted">wordmark a 64px, come nell’header</span>
            </div>
            <div className="overflow-hidden rounded-2xl bg-bg-brand-deep p-6">
              <Logo size={1200} variant="white" fontId={f.id} title="" className="h-auto w-full" />
            </div>

            {/* H1 hero, H2, prezzo, 3 g */}
            <div className="grid gap-6 rounded-2xl bg-bg-surface p-6 md:grid-cols-[2fr_1fr]">
              <div className="flex flex-col gap-4">
                <p className="type-eyebrow text-text-brand" style={{ fontFamily: f.stack }}>Creatina + glicina + vitamina D3</p>
                <p className="type-display-xl text-text-primary" style={{ ...display, fontSize: 'clamp(40px, 5vw, 80px)' }}>
                  la creatina, <Em>evoluta</Em>.
                </p>
                <p className="type-display-lg text-text-primary" style={{ ...display, fontSize: 'clamp(28px, 3vw, 44px)' }}>
                  tre ingredienti. <Em>niente</Em> che non serva.
                </p>
                <p className="text-body-lg text-text-secondary">{CLAIMS.product.it} {CLAIMS.noLoading.it}</p>
              </div>
              <div className="flex flex-col gap-4 border-l border-border-subtle pl-6">
                <p className="font-mono text-mono-lg text-text-primary">€0,94</p>
                <p className="text-body-sm text-text-muted" style={{ fontFamily: f.stack, fontWeight: 600 }}>al giorno · Rituale Completo</p>
                <p className="text-text-primary" style={{ ...display, fontSize: 64, lineHeight: 1 }}>3 g</p>
                <p className="text-body-sm text-text-muted" style={{ fontFamily: f.stack, fontWeight: 600 }}>di creatina al giorno</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Scorecard() {
  const [scores, setScores] = useState<Record<string, string>>({})

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SCORE_KEY)
      if (raw) setScores(JSON.parse(raw))
    } catch {
      // niente storage
    }
  }, [])

  function update(key: string, value: string) {
    const next = { ...scores, [key]: value }
    setScores(next)
    try {
      window.localStorage.setItem(SCORE_KEY, JSON.stringify(next))
    } catch {
      // niente storage
    }
  }

  return (
    <Section tone="surface" id="scorecard">
      <Container>
        <h2 className="type-display-md text-text-primary">scorecard</h2>
        <p className="mt-3 max-w-prose text-body-md text-text-secondary">
          Da compilare a mano: voto da 1 a 5, o una parola. Le note restano in questo browser. Il sistema non sceglie.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-default">
                <th className="py-3 pr-4 text-body-sm font-display font-bold text-text-muted">Criterio</th>
                {FONT_CANDIDATES.map((f) => (
                  <th key={f.id} className="py-3 pr-4 text-body-sm font-display font-bold text-text-primary" style={{ fontFamily: f.stack }}>{f.family}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((c) => (
                <tr key={c} className="border-b border-border-subtle">
                  <th scope="row" className="py-2 pr-4 text-body-sm font-normal text-text-secondary">{c}</th>
                  {FONT_CANDIDATES.map((f) => {
                    const key = `${f.id}:${c}`
                    return (
                      <td key={key} className="py-2 pr-4">
                        <input
                          value={scores[key] ?? ''}
                          onChange={(e) => update(key, e.target.value)}
                          aria-label={`${c}, ${f.family}`}
                          placeholder="—"
                          className="w-full rounded-md border border-border-subtle bg-bg-page px-2 py-1 text-body-sm text-text-primary"
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  )
}

export function FontLab() {
  const lab = useFontLab()
  return (
    <LabShell
      title="laboratorio font"
      intro="Sette candidati OFL per il wordmark e i titoli. Il pulsante in alto cambia il font in tutto il sito, header e pack compresi: guarda Home e PDP con ciascuno prima di decidere. Il default resta Nunito finché non scegli."
    >
      <Section tone="page" spacing="flush">
        {FONT_CANDIDATES.map((f) => (
          <Candidate key={f.id} f={f} active={lab.font === f.id} />
        ))}
      </Section>
      <Scorecard />
    </LabShell>
  )
}

export default FontLab
