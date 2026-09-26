/**
 * peak — token tipizzati (2.0).
 *
 * tokens.json e' la sorgente di verita'. Questo file la ri-esporta con i tipi
 * e aggiunge le utility di lettura. tokens.css e' generato dallo stesso JSON.
 * Se cambi un valore, cambialo nel JSON e lancia `npm run tokens:build`.
 */

import raw from './tokens.json'

export const tokens = raw

// ---------------------------------------------------------------------------
// Colori — 3 neutri + 2 colori-gusto + 1 accento
// ---------------------------------------------------------------------------

export const arancia = raw.color.arancia
export const lime = raw.color.lime
export const miele = raw.color.miele
export const neutral = raw.color.neutral
export const errore = raw.color.errore
export const stateColor = raw.color.state

export type AranciaStep = keyof typeof arancia
export type LimeStep = keyof typeof lime
export type MieleStep = keyof typeof miele
export type NeutralStep = keyof typeof neutral
export type ErroreStep = keyof typeof errore

export const palette = {
  arancia,
  lime,
  miele,
  neutral,
  errore,
} as const

export type PaletteName = keyof typeof palette

/** Alias semantici. Nei componenti si usano SOLO questi, mai i colori grezzi. */
export const semantic = raw.semantic
export type SemanticToken = keyof typeof semantic

/** Risolve un alias semantico nel suo hex, es. `resolve('bg-brand')` -> '#E4572E'. */
export function resolveSemantic(name: SemanticToken): string {
  const ref = semantic[name] as string
  const [scale, step] = ref.split('.') as [PaletteName, string]
  return (palette[scale] as Record<string, string>)[step]
}

/** La custom property CSS corrispondente, per usarla inline: `cssVar('bg-brand')`. */
export function cssVar(name: SemanticToken): string {
  return `var(--${name})`
}

// ---------------------------------------------------------------------------
// Tipografia
// ---------------------------------------------------------------------------

export const fontFamily = raw.font
export const typeScale = raw.type
export type TypeToken = keyof typeof typeScale

/** La classe CSS generata per uno step della scala, es. `type-display-xl`. */
export function typeClass(token: TypeToken): string {
  return `type-${token}`
}

// ---------------------------------------------------------------------------
// Spazio, forma, movimento
// ---------------------------------------------------------------------------

export const space = raw.space
export const radius = raw.radius
export const shadow = raw.shadow
export const motion = raw.motion
export const breakpoint = raw.breakpoint
export const layout = raw.layout

export type SpaceToken = keyof typeof space
export type RadiusToken = keyof typeof radius
export type ShadowToken = keyof typeof shadow

// ---------------------------------------------------------------------------
// Logo e packaging
// ---------------------------------------------------------------------------

export const logoTokens = raw.logo
export const packTokens = raw.pack

export default tokens
