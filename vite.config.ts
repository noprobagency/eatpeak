import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

/**
 * I font in licenza trial (3.1), solo dove ci sono.
 *
 * Denim (Displaay) e' il font di tutto il testo, ma e' in versione TRIAL e la
 * licenza vieta di tenerlo su server accessibili al pubblico: i file stanno in
 * public/fonts/denim/, fuori da git. Questo plugin guarda la cartella e, se
 * trova i file, scrive i @font-face nell'index.html; se non li trova (Vercel,
 * un clone pulito) non scrive niente e il sito resta sui ripieghi dello stack,
 * senza richieste a vuoto. Con la licenza comprata cambiano solo i file.
 */
function trialFonts(): Plugin {
  const dir = fileURLToPath(new URL('./public/fonts/denim', import.meta.url))
  const WEIGHTS: Record<string, number> = { Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, Heavy: 900 }
  const NAME = /^Denim(?:-TRIAL)?-(Light|Regular|Medium|SemiBold|Bold|Heavy)(Italic)?\.woff2$/

  function faces(): string {
    if (!existsSync(dir)) return ''
    return readdirSync(dir)
      .map((file) => ({ file, m: file.match(NAME) }))
      .filter((f): f is { file: string; m: RegExpMatchArray } => f.m !== null)
      .map(({ file, m }) =>
        `@font-face{font-family:'Denim';src:url('/fonts/denim/${file}') format('woff2');` +
        `font-weight:${WEIGHTS[m[1]]};font-style:${m[2] ? 'italic' : 'normal'};font-display:swap}`,
      )
      .join('\n')
  }

  return {
    name: 'peak-trial-fonts',
    transformIndexHtml() {
      const css = faces()
      return css ? [{ tag: 'style', attrs: { 'data-font': 'denim-trial' }, children: css, injectTo: 'head' }] : []
    },
  }
}

export default defineConfig({
  plugins: [react(), trialFonts()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
