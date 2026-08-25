/**
 * peak — Tailwind esteso con i token del design system.
 *
 * I valori arrivano da src/tokens/tokens.json, cosi' Tailwind, le CSS custom
 * properties e l'oggetto TypeScript restano allineati per costruzione.
 * Le utility semantiche (bg-page, text-brand, ...) puntano alle var CSS, non
 * agli hex: cambiare tema significa cambiare le var, non ricompilare le classi.
 */
import { readFileSync } from 'node:fs'

const t = JSON.parse(readFileSync(new URL('./src/tokens/tokens.json', import.meta.url), 'utf8'))

const semanticColors = Object.fromEntries(
  Object.keys(t.semantic).map((name) => [name, `var(--${name})`]),
)

const controlSizes = Object.fromEntries(
  Object.entries(t.control).map(([name, value]) => [`control-${name}`, value]),
)

const fontSize = Object.fromEntries(
  Object.entries(t.type).map(([name, s]) => [
    name,
    [s.size, { lineHeight: s.lineHeight, letterSpacing: s.tracking, fontWeight: s.weight }],
  ]),
)

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // La scala di default viene sostituita, non estesa: i grigi freddi di
    // Tailwind spezzerebbero la temperatura calda del brand.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      terracotta: t.color.terracotta,
      miele: t.color.miele,
      bosco: t.color.bosco,
      neutral: t.color.neutral,
      success: t.color.state.success,
      warning: t.color.state.warning,
      error: t.color.state.error,
      info: t.color.state.info,
      ...semanticColors,
    },
    // La scala di spaziatura SOSTITUISCE quella di Tailwind: un valore fuori
    // dai 4px di base non esiste e non genera CSS. E' voluto — impedisce di
    // scrivere `p-7` senza accorgersene — ma vale anche per width e height, che
    // in Tailwind leggono la stessa scala. Le altezze dei controlli hanno
    // quindi i loro token, sotto: 36, 44 e 56px non sono spazi.
    spacing: t.space,
    borderRadius: t.radius,
    boxShadow: { ...t.shadow, none: 'none' },
    screens: t.breakpoint,
    fontFamily: {
      display: t.font.display.split(',').map((s) => s.trim()),
      text: t.font.text.split(',').map((s) => s.trim()),
      mono: t.font.mono.split(',').map((s) => s.trim()),
    },
    fontSize,
    extend: {
      // Le altezze dei controlli, aggiunte a width/height/minHeight senza
      // toccare la scala di spaziatura. 44px e' anche il minimo per un
      // bersaglio touch.
      height: controlSizes,
      minHeight: controlSizes,
      width: controlSizes,
      transitionDuration: {
        fast: t.motion.duration.fast,
        base: t.motion.duration.base,
        slow: t.motion.duration.slow,
      },
      transitionTimingFunction: {
        standard: t.motion.easing.standard,
      },
      maxWidth: {
        container: t.layout.containerMax,
        prose: '68ch',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: `marquee ${t.motion.duration.marquee} linear infinite`,
        'fade-in': `fade-in ${t.motion.duration.base} ${t.motion.easing.standard}`,
        'slide-up': `slide-up ${t.motion.duration.base} ${t.motion.easing.standard}`,
      },
    },
  },
  plugins: [],
}
