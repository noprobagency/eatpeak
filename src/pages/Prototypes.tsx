/**
 * Prototypes — la galleria dei prototipi.
 *
 * Una pagina da scorrere e guardare: nessun filtro, nessuna ricerca, nessuna
 * tab. Le immagini sono statiche e l'ordine e' il discorso — dal piatto al
 * fotografato, dal prodotto solo al prodotto in mano.
 *
 * L'elenco dei file NON e' scritto a mano: sono i nomi reali dei file in
 * public/prototypes/, riportati tali e quali. Servono a capire di quale
 * immagine si sta parlando quando qualcuno commenta, quindi rinominarli
 * romperebbe proprio la cosa per cui esistono — spazi e doppie estensioni
 * compresi.
 */

import { useCallback, useEffect, useState } from 'react'
import { Container, Section } from '../components'
import { cn } from '../lib/cn'

// ---------------------------------------------------------------------------
// L'avviso
// ---------------------------------------------------------------------------

const NOTICE = {
  title: 'NOTA BENE',
  paragraphs: [
    'Questi sono prototipi generati rapidamente, senza rifiniture e senza alcuna cura del dettaglio. Servono a un solo scopo: cominciare a vedere qualcosa di concreto e capire che forma sta prendendo il brand.',
    'Testi, colori, proporzioni, materiali e composizioni sono tutti provvisori e verranno rifatti da zero. Alcuni dettagli sono volutamente sbagliati o incompleti.',
    'Prendeteli per quello che sono: un punto di partenza. È il 2% del lavoro finito.',
  ],
} as const

const PAGE_DATE = '25 agosto 2026'

// ---------------------------------------------------------------------------
// Le sezioni
// ---------------------------------------------------------------------------

type Layout = 'due' | 'singola'

interface GallerySection {
  id: string
  number: string
  label: string
  title: string
  caption: string
  layout: Layout
  files: readonly string[]
}

const SECTIONS: readonly GallerySection[] = [
  {
    id: 'flat',
    number: '01',
    label: 'FLAT DI PACKAGING',
    title: 'le grafiche distese',
    caption:
      'I due formati stesi in piano, senza volume: la busta da 30 stick e il singolo stickpack, entrambi nella versione arancia.',
    layout: 'due',
    files: ['prototipo busta svg.png', 'prototipo svg.png'],
  },
  {
    id: 'render',
    number: '02',
    label: 'RENDER NEUTRI',
    title: 'il pack su fondo pulito',
    caption:
      'Gli stessi due formati resi in tre dimensioni su fondo neutro, per giudicare materiale, proporzioni e leggibilità senza che il contesto aiuti.',
    layout: 'singola',
    files: ['realistico busta .png', 'realistico bustina.png'],
  },
  {
    id: 'ambient-busta',
    number: '03',
    label: 'AMBIENTATE — BUSTA',
    title: 'la busta dove vive',
    caption:
      'La confezione da 30 in situazioni quotidiane: cucine, luce naturale, un bicchiere d’acqua. Nessuna palestra.',
    layout: 'due',
    files: ['ambient 1.png', 'ambient 2.png', 'ambient 3.png', 'ambient 4.png'],
  },
  {
    id: 'ambient-stick',
    number: '04',
    label: 'AMBIENTATE — STICKPACK',
    title: 'il gesto',
    caption:
      'Lo stick che si apre e si versa: è il momento che il brand deve rendere facile, e quindi quello che va mostrato per primo.',
    layout: 'singola',
    files: ['ambient bustina 1.png.png', 'ambient bustina 2.png', 'ambient bustina 3.png'],
  },
  {
    id: 'meta',
    number: '05',
    label: 'CREATIVITÀ META',
    title: 'due quadrati per il feed',
    caption:
      'Formato quadrato con il pack accanto all’elenco dei benefici, per capire quanto regge il marchio a dimensioni da telefono.',
    layout: 'due',
    files: ['meta adv 1.png', 'meta adv 2.png'],
  },
]

/** I nomi contengono spazi e doppie estensioni: vanno codificati per l'URL. */
function srcFor(file: string): string {
  return `/prototypes/${encodeURIComponent(file)}`
}

// ---------------------------------------------------------------------------
// Ingrandimento
// ---------------------------------------------------------------------------

/**
 * Volutamente locale a questa pagina e non esportato in src/components.
 * Serve a guardare una fotografia a schermo pieno, non e' un pezzo del design
 * system: non ha varianti, non ha stati, e nello Showcase non ci starebbe.
 * Se un domani servisse altrove, quello e' il momento di promuoverlo — non
 * prima.
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
        className={cn(
          'absolute right-4 top-4 flex h-control-sm w-control-sm items-center justify-center rounded-full',
          'bg-neutral-0/10 text-neutral-0 transition-colors duration-fast hover:bg-neutral-0/20',
        )}
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      <figure className="m-0 flex max-h-full flex-col items-center gap-4">
        <img
          src={srcFor(file)}
          alt={file}
          className="max-h-[80vh] w-auto max-w-full rounded-md object-contain"
        />
        <figcaption className="type-mono-sm text-neutral-0/60">{file}</figcaption>
      </figure>
    </div>
  )
}

// ---------------------------------------------------------------------------
// La griglia
// ---------------------------------------------------------------------------

function Shot({ file, onOpen }: { file: string; onOpen: (file: string) => void }) {
  return (
    <figure className="m-0 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => onOpen(file)}
        className={cn(
          'group block overflow-hidden rounded-lg bg-bg-raised shadow-sm',
          'transition-shadow duration-base ease-standard hover:shadow-md',
        )}
        aria-label={`Ingrandisci ${file}`}
      >
        <img
          src={srcFor(file)}
          alt=""
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </button>

      <figcaption className="type-mono-sm text-text-muted">{file}</figcaption>
    </figure>
  )
}

// ---------------------------------------------------------------------------
// La pagina
// ---------------------------------------------------------------------------

export function Prototypes() {
  const [zoomed, setZoomed] = useState<string | null>(null)
  const close = useCallback(() => setZoomed(null), [])

  return (
    <>
      {/*
        L'avviso prima di ogni altra cosa, titolo della pagina compreso. Chi
        apre questo link deve sapere cosa sta per vedere prima di vederlo,
        altrimenti giudica un prototipo come se fosse un lavoro finito.
      */}
      <aside
        aria-labelledby="nota-bene"
        className="border-y border-l-8 border-border-danger bg-bg-danger"
      >
        <Container width="media">
          <div className="flex flex-col gap-4 py-8">
            <h2 id="nota-bene" className="type-mono-md text-text-danger">
              {NOTICE.title}
            </h2>
            {NOTICE.paragraphs.map((p) => (
              <p key={p} className="max-w-prose text-body-md text-text-danger">
                {p}
              </p>
            ))}
          </div>
        </Container>
      </aside>

      <Section tone="page" spacing="tight">
        <Container width="media">
          <header className="flex flex-col gap-3">
            <h1 className="type-display-lg text-text-primary">prototipi</h1>
            <p className="type-mono-md text-text-muted">v1 · {PAGE_DATE}</p>
          </header>
        </Container>
      </Section>

      <Section tone="page" spacing="flush">
        <Container width="media">
          <div className="flex flex-col gap-20 pb-24 md:gap-24">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <header className="flex flex-col gap-3">
                  <p className="type-mono-md text-text-muted">
                    {section.number} — {section.label}
                  </p>
                  <h2 className="type-display-md text-text-primary">{section.title}</h2>
                  <p className="max-w-prose text-body-md text-text-secondary">{section.caption}</p>
                </header>

                <div
                  className={cn(
                    'mt-8 grid gap-6',
                    section.layout === 'due' ? 'md:grid-cols-2' : 'grid-cols-1',
                  )}
                >
                  {section.files.map((file) => (
                    <Shot key={file} file={file} onOpen={setZoomed} />
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
