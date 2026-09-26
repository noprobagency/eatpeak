/**
 * <SiteHeader /> — la barra del sito, sul modello dell'header di Farmacia Nazzi.
 *
 * Due strisce fisse, staccate dai bordi: sopra gli annunci con le prove del
 * prodotto che scorrono; sotto la barra di vetro con il menu a sinistra, il
 * marchio al centro e ricerca, account e carrello a destra. Il marchio sono i
 * quattro punti a montagna (3.1): al passaggio salgono in diagonale e poi
 * compare il wordmark (<SymbolRise />). Su mobile il menu diventa un pannello.
 *
 * Le misure e l'effetto vetro sono in site-header.css; i testi vengono da
 * src/lib/copy.ts e le rotte da src/lib/routes.ts.
 */

import { useEffect, useState, type FormEvent } from 'react'
import { SymbolRise } from '../brand'
import { cn } from '../lib/cn'
import { PRODUCT } from '../lib/copy'
import { SITE_NAV, STUDIO_NAV, to, type RoutePath } from '../lib/routes'
import './site-header.css'

export interface SiteHeaderProps {
  current: RoutePath
}

/** Le prove nella barra degli annunci: fatti verificabili, con un'icona ciascuno. */
const ANNOUNCEMENTS = [
  {
    text: `Spedizione gratuita da ${PRODUCT.freeShippingFromUnits} buste`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M1 5h13v11H1zM14 9h4l4 4v3h-8zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      </svg>
    ),
  },
  {
    text: `${PRODUCT.dose} g di creatina in uno stick`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M7 3h10l-1 18H8L7 3z" />
        <path d="M8.5 11h7" />
      </svg>
    ),
  },
  {
    text: 'Senza fase di carico',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </svg>
    ),
  },
  {
    text: 'Made in Italy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M5 21V3m0 1h13l-3 4.5 3 4.5H5" />
      </svg>
    ),
  },
  {
    text: `${PRODUCT.formulaLine} · vegan`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
        <path d="M5 19l7-7" />
      </svg>
    ),
  },
]

function MarqueeGroup() {
  return (
    <div className="peak-header__marquee-group" aria-hidden="true">
      {ANNOUNCEMENTS.map((a) => (
        <span key={a.text} className="peak-header__marquee-item">
          {a.icon}
          {a.text}
        </span>
      ))}
    </div>
  )
}

export function SiteHeader({ current }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setOpen(false)
  }, [current])

  useEffect(() => {
    document.body.classList.toggle('peak-menu-open', open)
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('peak-menu-open')
    }
  }, [open])

  const isCurrent = (href: string) => href === `#${current}`

  function onSearch(e: FormEvent) {
    e.preventDefault()
    // Un prodotto solo: qualunque ricerca porta li'.
    setOpen(false)
    window.location.hash = to('/prodotto')
  }

  return (
    <header className={cn('peak-header', open && 'peak-header--open')}>
      <div className="peak-header__announcement" role="region" aria-label="Le prove del prodotto">
        <ul className="sr-only">
          {ANNOUNCEMENTS.map((a) => (
            <li key={a.text}>{a.text}</li>
          ))}
        </ul>
        <div className="peak-header__marquee">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>

      <div className="peak-header__bar">
        <div className="peak-header__nav peak-header__nav--left">
          <nav className="peak-header__nav peak-header__nav--desktop" aria-label="Principale">
            {SITE_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-text={item.label}
                aria-current={isCurrent(item.href) ? 'page' : undefined}
                className="peak-header__link"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="peak-header__icon-btn peak-header__toggle"
            aria-expanded={open}
            aria-controls="peak-header-panel"
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="peak-header__toggle-line" />
            <span className="peak-header__toggle-line" />
          </button>
        </div>

        <a className="peak-header__logo" href={to('/')} aria-label="peak, torna alla home">
          <SymbolRise className="peak-header__mark" />
        </a>

        <div className="peak-header__nav peak-header__nav--right">
          <button
            type="button"
            className="peak-header__icon-btn"
            aria-label="Cerca"
            aria-expanded={open}
            aria-controls="peak-header-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
              <circle cx="10.5" cy="10.5" r="7" />
              <path d="m15.8 15.8 5.2 5.2" />
            </svg>
          </button>
          <a className="peak-header__icon-btn" href={to('/prodotto')} aria-label="Account" title="Account: non attivo nel sito dimostrativo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="8" r="3.6" />
              <path d="M4.5 20c.8-3.4 3.9-5.2 7.5-5.2s6.7 1.8 7.5 5.2" />
            </svg>
          </a>
          <a href={to('/prodotto')} className="peak-header__icon-btn peak-header__cart" aria-label="Carrello">
            <span className="peak-header__cart-label" aria-hidden="true">Carrello</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8L6 8z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
          </a>
        </div>

        <div className="peak-header__panel" id="peak-header-panel" hidden={!open}>
          <form className="peak-header__search" role="search" onSubmit={onSearch}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca: creatina, gusti, formati…"
              aria-label="Cerca nel sito"
            />
            <button type="submit">Cerca</button>
          </form>

          <ul className="peak-header__panel-list" role="list">
            {SITE_NAV.map((item) => (
              <li key={item.href}>
                <a className="peak-header__panel-link" href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <ul className="peak-header__panel-secondary" role="list">
            <li><a href={to('/prodotto')}>Il mio account</a></li>
            {STUDIO_NAV.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
