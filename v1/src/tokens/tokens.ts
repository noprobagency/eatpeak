/**
 * peak — token tipizzati.
 *
 * tokens.json e' la sorgente di verita'. Questo file la ri-esporta con i tipi
 * e aggiunge le utility di lettura. tokens.css e' generato dallo stesso JSON.
 * Se cambi un valore, cambialo nel JSON e lancia `npm run tokens:build`.
 */

import raw from './tokens.json'

export const tokens = raw

// ---------------------------------------------------------------------------
// Colori
// ---------------------------------------------------------------------------

export const terracotta = raw.color.terracotta
export const miele = raw.color.miele
export const bosco = raw.color.bosco
export const rosso = raw.color.rosso
export const neutral = raw.color.neutral
export const stateColor = raw.color.state

export type TerracottaStep = keyof typeof terracotta
export type MieleStep = keyof typeof miele
export type BoscoStep = keyof typeof bosco
export type RossoStep = keyof typeof rosso
export type NeutralStep = keyof typeof neutral

export const palette = {
  terracotta,
  miele,
  bosco,
  rosso,
  neutral,
} as const

export type PaletteName = keyof typeof palette

/** Alias semantici. Nei componenti si usano SOLO questi, mai i colori grezzi. */
export const semantic = raw.semantic
export type SemanticToken = keyof typeof semantic

/** Risolve un alias semantico nel suo hex, es. `resolve('bg-brand')` -> '#E9724C'. */
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
// Logo
// ---------------------------------------------------------------------------

export const logoTokens = raw.logo
export type LogoStrokeSize = keyof typeof raw.logo.strokeRatio

export default tokens
