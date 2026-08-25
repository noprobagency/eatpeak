/**
 * Router minimo basato sull'hash.
 *
 * Volutamente senza react-router: il progetto e' un design system con tre
 * pagine dimostrative, e una dipendenza in piu' e' una dipendenza in piu' da
 * mantenere. Se le pagine diventano un sito vero, si sostituisce qui.
 */

import { useEffect, useState } from 'react'
import Showcase from './pages/Showcase'
import LandingDemo from './pages/LandingDemo'
import ProductDemo from './pages/ProductDemo'
import { Logo } from './brand'
import { cn } from './lib/cn'

const ROUTES = {
  '#/showcase': { label: 'Showcase', component: Showcase },
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

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
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

      <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-page/90 backdrop-blur">
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
