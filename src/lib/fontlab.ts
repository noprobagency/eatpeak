/**
 * peak — il laboratorio dei font (3.0).
 *
 * Sette candidati per il wordmark e i titoli, tutti Google Fonts con licenza
 * OFL. Lo switch `?font=<id>` cambia display e wordmark in tutto il sito via
 * variabile CSS; `?italic=0` spegne la parola in corsivo; `?body=display`
 * mette il testo nello stesso font rotondo. La scelta e' rimandata: il
 * default e' Nunito finche' non si decide (vedi #/lab/font).
 *
 * Il wordmark vettorializzato di ogni candidato sta in src/brand/wordmarks/
 * (`npm run brand:vectorize -- --font-id=<id>`); <Logo> legge quello attivo.
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
}

export const FONT_CANDIDATES: readonly FontCandidate[] = [
  { id: 'gabarito', family: 'Gabarito', wordmarkWeight: 800, titleWeight: 700, note: 'Controllo: l attuale, senza il 900.', stack: "'Gabarito', system-ui, sans-serif" },
  { id: 'nunito', family: 'Nunito', wordmarkWeight: 900, titleWeight: 800, note: 'Rotondo, adulto.', stack: "'Nunito', system-ui, sans-serif" },
  { id: 'mplus', family: 'M PLUS Rounded 1c', wordmarkWeight: 800, titleWeight: 700, note: 'Rotondo geometrico, vicino a Dosys.', stack: "'M PLUS Rounded 1c', system-ui, sans-serif" },
  { id: 'fredoka', family: 'Fredoka', wordmarkWeight: 600, titleWeight: 600, note: 'Molto morbido: rischio infantile, da vedere.', stack: "'Fredoka', system-ui, sans-serif" },
  { id: 'baloo', family: 'Baloo 2', wordmarkWeight: 800, titleWeight: 700, note: 'Caldo, terminali arrotondati.', stack: "'Baloo 2', system-ui, sans-serif" },
  { id: 'rubik', family: 'Rubik', wordmarkWeight: 800, titleWeight: 700, note: 'Angoli smussati, meno tondo.', stack: "'Rubik', system-ui, sans-serif" },
  { id: 'varela', family: 'Varela Round', wordmarkWeight: 400, titleWeight: 400, note: 'Un peso solo. Solo come wordmark, se regge.', stack: "'Varela Round', system-ui, sans-serif" },
]

export const DEFAULT_FONT_ID = 'nunito'

export interface FontLabState {
  font: string
  italic: boolean
  bodyDisplay: boolean
}

const STORAGE_KEY = 'peak-fontlab'

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

let state: FontLabState = { font: DEFAULT_FONT_ID, italic: true, bodyDisplay: false }
const listeners = new Set<() => void>()

export function candidate(id: string = state.font): FontCandidate {
  return FONT_CANDIDATES.find((f) => f.id === id) ?? FONT_CANDIDATES[1]
}

/** Applica lo stato al documento: variabili CSS e attributi data-*. */
function apply() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const f = candidate(state.font)
  root.style.setProperty('--font-display', f.stack)
  root.style.setProperty('--display-weight', String(f.titleWeight))
  root.style.setProperty('--font-text', state.bodyDisplay ? f.stack : "'Inter', system-ui, sans-serif")
  root.dataset.font = f.id
  root.dataset.italic = state.italic ? '1' : '0'
  root.dataset.body = state.bodyDisplay ? 'display' : 'inter'
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
  return `${window.location.pathname}?${params.toString()}${hash}`
}
