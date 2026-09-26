/**
 * peak — il laboratorio dei font (3.0, deciso nella 3.1).
 *
 * La 3.1 chiude la scelta: tutto il testo del sito e' in Denim (Displaay,
 * versione basic), titoli e testo corrente. Denim e' in licenza TRIAL: i file
 * stanno solo in locale (public/fonts/denim/, fuori da git) e in produzione lo
 * stack scende su Nunito per i titoli e Inter per il testo. Vedi
 * assets/fonts/README.md.
 *
 * Gli altri sette candidati, tutti Google Fonts con licenza OFL, restano
 * raggiungibili con `?font=<id>`; `?italic=0` spegne la parola in corsivo;
 * `?body=display` mette il testo nello stesso font dei titoli.
 *
 * Il wordmark non segue piu' il font: dalla 3.1 e' quello della v1 (vedi
 * src/brand/paths.ts). #/lab/font mostra ancora il tracciato di ogni candidato.
 */

import { useSyncExternalStore } from 'react'

export interface FontCandidate {
  id: string
  family: string
  /** Peso del wordmark vettorializzato. */
  wordmarkWeight: number
  /** Peso dei titoli display. */
  titleWeight: number
  note: string
  /** Lo stack CSS completo. */
  stack: string
  /** Lo stack del testo corrente, se il candidato lo copre. Default: Inter. */
  textStack?: string
}

export const FONT_CANDIDATES: readonly FontCandidate[] = [
  // Denim non ha l'800: il 700 e' Bold, il 900 e' Heavy (vietato nei titoli).
  { id: 'denim', family: 'Denim', wordmarkWeight: 700, titleWeight: 700, note: 'La scelta della 3.1, per tutto il testo. Trial: solo in locale.', stack: "'Denim', 'Nunito', system-ui, sans-serif", textStack: "'Denim', 'Inter', system-ui, sans-serif" },
  { id: 'gabarito', family: 'Gabarito', wordmarkWeight: 800, titleWeight: 700, note: 'Controllo: l attuale, senza il 900.', stack: "'Gabarito', system-ui, sans-serif" },
  { id: 'nunito', family: 'Nunito', wordmarkWeight: 900, titleWeight: 800, note: 'Rotondo, adulto.', stack: "'Nunito', system-ui, sans-serif" },
  { id: 'mplus', family: 'M PLUS Rounded 1c', wordmarkWeight: 800, titleWeight: 700, note: 'Rotondo geometrico, vicino a Dosys.', stack: "'M PLUS Rounded 1c', system-ui, sans-serif" },
  { id: 'fredoka', family: 'Fredoka', wordmarkWeight: 600, titleWeight: 600, note: 'Molto morbido: rischio infantile, da vedere.', stack: "'Fredoka', system-ui, sans-serif" },
  { id: 'baloo', family: 'Baloo 2', wordmarkWeight: 800, titleWeight: 700, note: 'Caldo, terminali arrotondati.', stack: "'Baloo 2', system-ui, sans-serif" },
  { id: 'rubik', family: 'Rubik', wordmarkWeight: 800, titleWeight: 700, note: 'Angoli smussati, meno tondo.', stack: "'Rubik', system-ui, sans-serif" },
  { id: 'varela', family: 'Varela Round', wordmarkWeight: 400, titleWeight: 400, note: 'Un peso solo. Solo come wordmark, se regge.', stack: "'Varela Round', system-ui, sans-serif" },
]

export const DEFAULT_FONT_ID = 'denim'

export interface FontLabState {
  font: string
  italic: boolean
  bodyDisplay: boolean
  /** `?ref=1`: mostra l'etichetta del reference in ogni sezione. */
  refs: boolean
}

/** Cambiata nella 3.1: lo stato salvato prima puntava a Nunito. */
const STORAGE_KEY = 'peak-fontlab-3.1'

function readParams(): Partial<FontLabState> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: Partial<FontLabState> = {}
  const font = params.get('font')
  if (font && FONT_CANDIDATES.some((f) => f.id === font)) out.font = font
  const italic = params.get('italic')
  if (italic !== null) out.italic = italic !== '0'
  const body = params.get('body')
  if (body !== null) out.bodyDisplay = body === 'display'
  const refs = params.get('ref')
  if (refs !== null) out.refs = refs === '1'
  return out
}

function readStored(): Partial<FontLabState> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<FontLabState>) : {}
  } catch {
    return {}
  }
}

let state: FontLabState = { font: DEFAULT_FONT_ID, italic: true, bodyDisplay: false, refs: false }
const listeners = new Set<() => void>()

export function candidate(id: string = state.font): FontCandidate {
  return FONT_CANDIDATES.find((f) => f.id === id) ?? FONT_CANDIDATES[0]
}

/** Applica lo stato al documento: variabili CSS e attributi data-*. */
function apply() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const f = candidate(state.font)
  root.style.setProperty('--font-display', f.stack)
  root.style.setProperty('--display-weight', String(f.titleWeight))
  root.style.setProperty('--font-text', state.bodyDisplay ? f.stack : (f.textStack ?? "'Inter', system-ui, sans-serif"))
  root.dataset.font = f.id
  root.dataset.italic = state.italic ? '1' : '0'
  root.dataset.body = state.bodyDisplay ? 'display' : f.textStack ? f.id : 'inter'
  root.dataset.refs = state.refs ? '1' : '0'
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // niente storage: va bene lo stesso
  }
}

export function setFontLab(patch: Partial<FontLabState>) {
  state = { ...state, ...patch }
  apply()
  listeners.forEach((l) => l())
}

/** Legge URL e storage, applica, e resta in ascolto dei cambi di hash. */
export function initFontLab() {
  if (typeof window === 'undefined') return
  state = { ...state, ...readStored(), ...readParams() }
  apply()
  const onChange = () => {
    const next = readParams()
    if (Object.keys(next).length > 0) setFontLab(next)
  }
  window.addEventListener('hashchange', onChange)
  window.addEventListener('popstate', onChange)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

/** Lo stato del laboratorio, reattivo. */
export function useFontLab(): FontLabState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** L'href corrente con i parametri del laboratorio cambiati. */
export function fontLabHref(patch: Partial<FontLabState>, hash: string = window.location.hash): string {
  const next = { ...state, ...patch }
  const params = new URLSearchParams()
  params.set('font', next.font)
  if (!next.italic) params.set('italic', '0')
  if (next.bodyDisplay) params.set('body', 'display')
  if (next.refs) params.set('ref', '1')
  return `${window.location.pathname}?${params.toString()}${hash}`
}
