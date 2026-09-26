/**
 * Il sito, con il router minimo sull'hash.
 *
 * Volutamente senza react-router: cinque pagine e un `hashchange`. Le rotte
 * stanno in src/lib/routes.ts; un'ancora dopo il secondo cancelletto
 * (`#/#domande`) scorre alla sezione una volta montata la pagina.
 */

import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Product from './pages/Product'
import Formula from './pages/Formula'
import DesignSystem from './pages/DesignSystem'
import Prototypes from './pages/Prototypes'
import FontLab from './pages/lab/FontLab'
import SymbolLab from './pages/lab/SymbolLab'
import BoxLab from './pages/lab/BoxLab'
import PackLab from './pages/lab/PackLab'
import { SiteHeader } from './site/SiteHeader'
import { SiteFooter } from './site/SiteFooter'
import { parseHash, routeSpec, type RoutePath } from './lib/routes'

const PAGES: Record<RoutePath, () => JSX.Element> = {
  '/': Home,
  '/prodotto': Product,
  '/formula': Formula,
  '/design-system': DesignSystem,
  '/prototipi': Prototypes,
  '/lab/font': FontLab,
  '/lab/simbolo': SymbolLab,
  '/lab/box': BoxLab,
  '/lab/pack': PackLab,
}

export function App() {
  const [location, setLocation] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setLocation(parseHash(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Titolo della scheda e posizione di scorrimento seguono la rotta.
  useEffect(() => {
    document.title = routeSpec(location.path).title
    if (location.anchor) {
      const id = location.anchor
      // La pagina e' appena montata: si aspetta un frame perche' esista.
      const frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' })
      })
      return () => cancelAnimationFrame(frame)
    }
    // Un cambio di pagina salta in cima: lo scorrimento morbido e' per le ancore, non per le rotte.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location])

  const Page = PAGES[location.path]

  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-bg-brand-deep focus:px-5 focus:py-3 focus:text-text-inverse"
      >
        Salta al contenuto
      </a>

      <SiteHeader current={location.path} />

      <main id="contenuto">
        <Page />
      </main>

      <SiteFooter />
    </>
  )
}

export default App
