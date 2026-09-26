/**
 * Prototypes — i prototipi.
 *
 * In cima la direzione 2.0, resa dai componenti e non da PNG: busta e stick
 * dei due gusti, con le guide di sicurezza. Poi la shot list per i prototipi
 * finali (Higgsfield), un segnaposto per scatto con il brief. In fondo,
 * l'archivio della 1.0: la galleria dell'agosto 2026, con logo e gusti
 * superati, tenuta per la storia sotto un banner grigio.
 */

import { useCallback, useEffect, useState } from 'react'
import { Badge, BustaPack, Container, LabTag, MediaPlaceholder, PackBack, Section, SectionHeader, StickPack } from '../components'
import { FLAVORS } from '../lib/copy'
import { SHOTS, missingShots } from '../lib/media'
import { cn } from '../lib/cn'

// ---------------------------------------------------------------------------
// L'archivio v1
// ---------------------------------------------------------------------------

const V1_NOTICE =
  'Archivio v1 (agosto 2026) — logo e gusti superati. Prototipi generati rapidamente per vedere che forma stava prendendo il brand: logo con contorno, saetta, tre gusti con mela e ciliegia, palette terracotta e bosco. Niente di questo è nel sistema 2.0.'

type Cols = 'due' | 'tre' | 'quattro'

interface GallerySection {
  id: string
  number: string
  label: string
  title: string
  caption: string
  cols: Cols
  ratio: string
  files: readonly string[]
}

/** I nomi dei file sono quelli reali in public/prototypes/v1/, tali e quali. */
const V1_SECTIONS: readonly GallerySection[] = [
  {
    id: 'v1-flat',
    number: '01',
    label: 'FLAT DI PACKAGING',
    title: 'le grafiche distese',
    caption: 'Tre buste e tre stick della 1.0: arancia, mela, ciliegia. Il logo con contorno e la saetta.',
    cols: 'tre',
    ratio: 'aspect-[3/4]',
    files: [
      'prototipo busta svg.png',
      'peak-busta-v1-mela.png',
      'peak-busta-v1-ciliegia.png',
      'prototipo svg.png',
      'peak-stick-v1-mela.png',
      'peak-stick-v1-ciliegia.png',
    ],
  },
  {
    id: 'v1-render',
    number: '02',
    label: 'RENDER NEUTRI',
    title: 'i tre gusti su fondo pulito',
    caption: 'Gli stessi pezzi resi in tre dimensioni su fondo neutro.',
    cols: 'tre',
    ratio: 'aspect-[4/5]',
    files: [
      'realistico busta .png',
      'Packaging peak_Gemini 3 (Nano Banana Pro)_2026-08-25_16-40-52.png',
      'Packaging peak_Gemini 3 (Nano Banana Pro)_2026-08-25_16-40-48.png',
      'realistico bustina.png',
      'Packaging peak_Gemini 3 (Nano Banana Pro)_2026-08-25_16-40-57.png',
      'Packaging peak_Gemini 3 (Nano Banana Pro)_2026-08-25_16-46-22.png',
    ],
  },
  {
    id: 'v1-ambient-busta',
    number: '03',
    label: 'AMBIENTATE — BUSTA',
    title: 'la busta dove vive',
    caption: 'Cucine, luce naturale, un bicchiere d’acqua. L’ambientazione resta valida: cambia il pack.',
    cols: 'quattro',
    ratio: 'aspect-[4/5]',
    files: ['ambient 1.png', 'ambient 2.png', 'ambient 3.png', 'ambient 4.png'],
  },
  {
    id: 'v1-ambient-stick',
    number: '04',
    label: 'AMBIENTATE — STICK',
    title: 'il gesto',
    caption: 'Lo stick che si apre e si versa. È il momento che il brand deve rendere facile.',
    cols: 'tre',
    ratio: 'aspect-[4/5]',
    files: ['ambient bustina 1.png.png', 'ambient bustina 2.png', 'ambient bustina 3.png'],
  },
  {
    id: 'v1-meta',
    number: '05',
    label: 'CREATIVITÀ META',
    title: 'due quadrati per il feed',
    caption: 'Formato quadrato con il pack e un elenco di prove.',
    cols: 'due',
    ratio: 'aspect-square',
    files: ['meta adv 1.png', 'meta adv 2.png'],
  },
]

const COLS: Record<Cols, string> = {
  due: 'grid-cols-2',
  tre: 'grid-cols-2 md:grid-cols-3',
  quattro: 'grid-cols-2 md:grid-cols-4',
}

function srcFor(file: string): string {
  return `/prototypes/v1/${encodeURIComponent(file)}`
}

/**
 * Locale a questa pagina e non esportato in src/components: serve a guardare
 * una fotografia a schermo pieno, non e' un pezzo del design system.
 */
function Lightbox({ file, onClose }: { file: string; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={file}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-1000/90 p-4 md:p-12"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute right-4 top-4 flex h-control-sm w-control-sm items-center justify-center rounded-full bg-neutral-0/10 text-neutral-0 transition-colors duration-fast hover:bg-neutral-0/20"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      <figure className="m-0 flex max-h-full flex-col items-center gap-4">
        <img src={srcFor(file)} alt={file} className="max-h-[80vh] w-auto max-w-full rounded-md object-contain" />
        <figcaption className="type-mono-sm text-neutral-0/60">archivio v1 · {file}</figcaption>
      </figure>
    </div>
  )
}

function Shot({ file, ratio, onOpen }: { file: string; ratio: string; onOpen: (file: string) => void }) {
  return (
    <figure className="m-0 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onOpen(file)}
        className={cn('block w-full overflow-hidden rounded-lg bg-bg-raised grayscale transition-all duration-base ease-standard hover:grayscale-0', ratio)}
        aria-label={`Ingrandisci ${file}`}
      >
        <img src={srcFor(file)} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </button>
      <figcaption className="type-mono-sm break-words text-text-muted">{file}</figcaption>
    </figure>
  )
}

// ---------------------------------------------------------------------------
// La pagina
// ---------------------------------------------------------------------------

export function Prototypes() {
  const [zoomed, setZoomed] = useState<string | null>(null)
  const [guides, setGuides] = useState(false)
  const close = useCallback(() => setZoomed(null), [])
  const missing = missingShots()

  return (
    <>
      <Section tone="page" spacing="tight">
        <Container width="media">
          <header className="flex flex-col gap-3">
            <h1 className="type-display-lg text-text-primary">prototipi</h1>
            <p className="type-mono-md text-text-muted">v2 · direzione · {SHOTS.length} scatti previsti, {missing} da produrre con higgsfield</p>
          </header>
        </Container>
      </Section>

      {/* --- v2: la direzione, resa dai componenti ------------------------ */}
      <Section tone="page" spacing="flush" id="v2">
        <Container width="media">
          <div className="flex flex-col gap-6 pb-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeader
                eyebrow="v2 — direzione"
                title="busta e stick, dai componenti"
                body="Non sono PNG: sono <BustaPack /> e <StickPack /> che leggono i gusti da FLAVORS. Cambiando il nome del gusto 02 in una riga, cambia qui e ovunque. Le proporzioni sono un segnaposto della fustella."
              />
              <label className="flex items-center gap-3 text-body-sm text-text-secondary">
                <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} className="h-4 w-4" />
                mostra le guide (margini di sicurezza e saldatura)
              </label>
            </div>

            <div className="flex flex-wrap items-start gap-3">
              <LabTag size="md" what="fustella">provvisorio: in attesa della fustella del laboratorio</LabTag>
              <Badge tone="neutral">busta 2:3 · stick 1:5 · margini 8%</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
              {FLAVORS.map((f) => (
                <figure key={`busta-${f.id}`} className="m-0 flex flex-col items-center gap-3 rounded-xl bg-bg-raised p-6">
                  <BustaPack flavor={f.id} width={300} showGuides={guides} className="max-w-full" />
                  <figcaption className="type-mono-sm text-text-muted">busta 30 stick · {f.number} {f.name} · fronte</figcaption>
                </figure>
              ))}
              {FLAVORS.map((f) => (
                <figure key={`stick-${f.id}`} className="m-0 flex flex-col items-center gap-3 rounded-xl bg-bg-raised p-6">
                  <StickPack flavor={f.id} height={450} />
                  <figcaption className="type-mono-sm text-text-muted">stick · {f.number}</figcaption>
                </figure>
              ))}
            </div>

            <PackBack />
          </div>
        </Container>
      </Section>

      {/* --- la shot list per Higgsfield ---------------------------------- */}
      <Section tone="surface" id="shot-list">
        <Container width="media">
          <SectionHeader
            eyebrow="shot list · prossimo passo"
            title="i prototipi finali, uno per uno"
            body="Ogni riquadro è uno scatto che il sito già usa. Il brief dice luce, ambiente e gesto; il colore dice il fondo. Quando il file arriva, si scrive il percorso in src/lib/media.ts e il segnaposto diventa la foto."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SHOTS.map((shot) => (
              <div key={shot.id} className="flex flex-col gap-3">
                <MediaPlaceholder shot={shot} />
                <dl className="m-0 grid grid-cols-[72px_1fr] gap-x-3 gap-y-1 type-mono-sm text-text-muted">
                  <dt>id</dt><dd className="m-0 text-text-primary">{shot.id}</dd>
                  <dt>uso</dt><dd className="m-0">{shot.use}</dd>
                  <dt>fondo</dt><dd className="m-0">{shot.tone}{shot.flavor ? ` · ${shot.flavor}` : ''}</dd>
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --- l'archivio v1 ------------------------------------------------ */}
      <Section tone="page" spacing="tight" id="archivio-v1">
        <Container width="media">
          <aside
            aria-labelledby="archivio-v1-nota"
            className="rounded-lg border border-border-strong bg-bg-raised px-6 py-5"
          >
            <h2 id="archivio-v1-nota" className="type-mono-md text-text-secondary">
              archivio v1 (agosto 2026) — logo e gusti superati
            </h2>
            <p className="mt-2 text-body-sm text-text-secondary">{V1_NOTICE}</p>
            <p className="mt-2 type-mono-sm text-text-muted">
              il progetto 1.0 intero è in <code>v1/</code> del repo e gira da solo.
            </p>
          </aside>
        </Container>
      </Section>

      <Section tone="page" spacing="flush">
        <Container width="media">
          <div className="flex flex-col gap-16 pb-24 md:gap-20">
            {V1_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <header className="flex flex-col gap-3">
                  <p className="type-mono-md text-text-muted">
                    v1 · {section.number} — {section.label}
                  </p>
                  <h2 className="type-display-sm text-text-secondary">{section.title}</h2>
                  <p className="max-w-prose text-body-sm text-text-muted">{section.caption}</p>
                </header>

                <div className={cn('mt-6 grid gap-4 md:gap-6', COLS[section.cols])}>
                  {section.files.map((file) => (
                    <Shot key={file} file={file} ratio={section.ratio} onOpen={setZoomed} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {zoomed && <Lightbox file={zoomed} onClose={close} />}
    </>
  )
}

export default Prototypes
