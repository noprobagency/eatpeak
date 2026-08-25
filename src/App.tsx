/**
 * Router minimo basato sull'hash.
 *
 * Volutamente senza react-router: il progetto e' un design system con tre
 * pagine dimostrative, e una dipendenza in piu' e' una dipendenza in piu' da
 * mantenere. Se le pagine diventano un sito vero, si sostituisce qui.
 */

import { useEffect, useRef, useState } from 'react'
import Showcase from './pages/Showcase'
import Prototypes from './pages/Prototypes'
import LandingDemo from './pages/LandingDemo'
import ProductDemo from './pages/ProductDemo'
import { Logo } from './brand'
import { cn } from './lib/cn'

const ROUTES = {
  '#/showcase': { label: 'Showcase', component: Showcase },
  '#/prototipi': { label: 'Prototipi', component: Prototypes },
  '#/landing': { label: 'Landing', component: LandingDemo },
  '#/product': { label: 'Prodotto', component: ProductDemo },
} as const

type Route = keyof typeof ROUTES

const DEFAULT_ROUTE: Route = '#/showcase'

function currentRoute(): Route {
  const hash = window.location.hash as Route
  return hash in ROUTES ? hash : DEFAULT_ROUTE
}

export function App() {
  const [route, setRoute] = useState<Route>(currentRoute)
  const [scrolled, setScrolled] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(currentRoute())
      // Si riparte dall'alto. Senza questo si cambia pagina restando alla
      // stessa altezza di quella precedente: la barra e' gia' comparsa e
      // copre le prime righe della pagina nuova.
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  /**
   * La barra compare appena si scorre, non subito.
   * In cima la pagina si apre col marchio grande, e un header con lo stesso
   * marchio in piccolo gliela toglierebbe di mano.
   *
   * La soglia e' una sentinella alta l'1% della finestra (minimo 8px) messa in
   * cima al documento: quando esce dallo schermo, la barra entra. Un
   * IntersectionObserver invece di un listener di scroll perche' non impegna
   * il thread principale a ogni frame, e perche' non dipende da eventi che in
   * alcuni contesti non arrivano.
   */
  useEffect(() => {
    const target = sentinel.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const Page = ROUTES[route].component

  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-bg-inverse focus:px-5 focus:py-3 focus:text-text-inverse"
      >
        Salta al contenuto
      </a>

      {/* La sentinella: finche' si vede, siamo in cima e la barra resta fuori. */}
      <div
        ref={sentinel}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[max(8px,1vh)]"
      />

      {/*
        `fixed` e non `sticky`: da sticky occuperebbe spazio in cima anche da
        nascosta, e la pagina si aprirebbe con un vuoto.
        `focus-within` la richiama per chi naviga da tastiera: nascosta non
        vuol dire irraggiungibile.
      */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-30 border-b border-border-subtle bg-bg-page/90 backdrop-blur',
          'transition-transform duration-base ease-standard focus-within:translate-y-0',
          scrolled ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="mx-auto flex max-w-container items-center justify-between gap-6 px-6 py-4 md:px-[28px]">
          <a href={DEFAULT_ROUTE} className="flex items-center" aria-label="peak — vai allo showcase">
            <Logo size={92} title="" />
          </a>

          <nav aria-label="Pagine dimostrative">
            <ul className="flex gap-1">
              {(Object.keys(ROUTES) as Route[]).map((key) => (
                <li key={key}>
                  <a
                    href={key}
                    aria-current={route === key ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-4 py-2 font-mono text-mono-md uppercase transition-colors duration-fast',
                      route === key
                        ? 'bg-bg-brand text-text-on-brand'
                        : 'text-text-secondary hover:bg-bg-raised hover:text-text-primary',
                    )}
                  >
                    {ROUTES[key].label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="contenuto">
        <Page />
      </main>
    </>
  )
}

export default App
