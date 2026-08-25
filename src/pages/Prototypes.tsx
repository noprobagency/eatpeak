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
  text:
    'Prototipi generati rapidamente, senza rifiniture. Servono solo a vedere che forma sta prendendo il brand. Testi, colori, proporzioni e materiali sono provvisori e verranno rifatti da zero, e alcuni dettagli sono volutamente sbagliati. È il 2% del lavoro finito.',
} as const

const PAGE_DATE = '25 agosto 2026'

// ---------------------------------------------------------------------------
// Le sezioni
// ---------------------------------------------------------------------------

/** Quante colonne, da mobile in su. Due sempre: cosi' resta incolonnato. */
type Cols = 'due' | 'tre' | 'quattro'

interface GallerySection {
  id: string
  number: string
  label: string
  title: string
  caption: string
  cols: Cols
  /**
   * Proporzione del riquadro. Tutte le immagini della sezione la condividono e
   * ci stanno dentro con `object-contain`: e' cosi' che il flat dello stick,
   * che e' 1:5, finisce alla stessa altezza di quello della busta invece di
   * allungare la riga.
   */
  ratio: string
  files: readonly string[]
}

const SECTIONS: readonly GallerySection[] = [
  {
    id: 'flat',
    number: '01',
    label: 'FLAT DI PACKAGING',
    title: 'le grafiche distese',
    caption:
      'Le grafiche stese in piano, senza volume: prima le tre buste da 30 stick, poi i tre stickpack. Arancia, mela, ciliegia.',
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
    id: 'render',
    number: '02',
    label: 'RENDER NEUTRI',
    title: 'i tre gusti su fondo pulito',
    caption:
      'Gli stessi sei pezzi resi in tre dimensioni su fondo neutro, affiancati per gusto: è qui che si vede se i tre colori reggono come famiglia.',
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
    id: 'ambient-busta',
    number: '03',
    label: 'AMBIENTATE — BUSTA',
    title: 'la busta dove vive',
    caption:
      'La confezione da 30 in situazioni quotidiane: cucine, luce naturale, un bicchiere d’acqua. Nessuna palestra.',
    cols: 'quattro',
    ratio: 'aspect-[4/5]',
    files: ['ambient 1.png', 'ambient 2.png', 'ambient 3.png', 'ambient 4.png'],
  },
  {
    id: 'ambient-stick',
    number: '04',
    label: 'AMBIENTATE — STICKPACK',
    title: 'il gesto',
    caption:
      'Lo stick che si apre e si versa: è il momento che il brand deve rendere facile, e quindi quello che va mostrato per primo.',
    cols: 'tre',
    ratio: 'aspect-[4/5]',
    files: ['ambient bustina 1.png.png', 'ambient bustina 2.png', 'ambient bustina 3.png'],
  },
  {
    id: 'meta',
    number: '05',
    label: 'CREATIVITÀ META',
    title: 'due quadrati per il feed',
    caption:
      'Formato quadrato con il pack accanto all’elenco dei benefici, per capire quanto regge il marchio a dimensioni da telefono.',
    cols: 'due',
    ratio: 'aspect-square',
    files: ['meta adv 1.png', 'meta adv 2.png'],
  },
]

/** Due colonne sempre, di piu' quando c'e' spazio. */
const COLS: Record<Cols, string> = {
  due: 'grid-cols-2',
  tre: 'grid-cols-2 md:grid-cols-3',
  quattro: 'grid-cols-2 md:grid-cols-4',
}

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

function Shot({ file, ratio, onOpen }: { file: string; ratio: string; onOpen: (file: string) => void }) {
  return (
    <figure className="m-0 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onOpen(file)}
        className={cn(
          'block w-full overflow-hidden rounded-lg bg-bg-raised shadow-sm',
          'transition-shadow duration-base ease-standard hover:shadow-md',
          ratio,
        )}
        aria-label={`Ingrandisci ${file}`}
      >
        {/*
          `contain` e non `cover`: qui non si può ritagliare niente. Un flat
          tagliato perde metà della grafica, ed è proprio la grafica la cosa
          da guardare.
        */}
        <img
          src={srcFor(file)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
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
        className="border-y border-l-8 border-border-danger bg-bg-danger px-6 py-5 md:px-[28px]"
      >
        <h2 id="nota-bene" className="type-mono-md text-text-danger">
          {NOTICE.title}
        </h2>
        {/* Niente max-width: qui la larghezza piena e' il punto, si deve vedere. */}
        <p className="mt-2 text-body-sm text-text-danger">{NOTICE.text}</p>
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
          <div className="flex flex-col gap-16 pb-24 md:gap-20">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <header className="flex flex-col gap-3">
                  <p className="type-mono-md text-text-muted">
                    {section.number} — {section.label}
                  </p>
                  <h2 className="type-display-md text-text-primary">{section.title}</h2>
                  <p className="max-w-prose text-body-md text-text-secondary">{section.caption}</p>
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
