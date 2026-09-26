/**
 * <SiteHeader /> — la barra del sito.
 *
 * Sticky, su carta, con il wordmark inchiostro a sinistra: 96px su desktop,
 * 80 su mobile, come da regola di scala del logo. Il menu del sito al centro,
 * la chiamata all'azione a destra. Le pagine dello studio — design system e
 * prototipi — stanno in un gruppo secondario in mono, perche' questo e' il
 * sito simulato e quelle sono le sue quinte.
 */

import { useEffect, useRef, useState } from 'react'
import { Logo, HEADER_LOGO_WIDTH } from '../brand'
import { Button } from '../components'
import { cn } from '../lib/cn'
import { SITE_NAV, STUDIO_NAV, to, type RoutePath } from '../lib/routes'

export interface SiteHeaderProps {
  current: RoutePath
}

export function SiteHeader({ current }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)
  const header = useRef<HTMLElement>(null)

  /** L'altezza della barra, pubblicata come variabile CSS per chi deve stare sotto. */
  useEffect(() => {
    const el = header.current
    if (!el) return
    const apply = () => document.documentElement.style.setProperty('--header-height', `${el.offsetHeight}px`)
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [current])

  const isCurrent = (href: string) => href === `#${current}` || (current === '/' && href === '#/')

  return (
    <header ref={header} className="sticky top-0 z-30 border-b border-border-subtle bg-bg-page/95 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between gap-6 px-6 py-4 md:px-[28px]">
        <a href={to('/')} className="flex shrink-0 items-center" aria-label="peak — home">
          <Logo size={HEADER_LOGO_WIDTH.mobile} variant="ink" title="" className="md:hidden" />
          <Logo size={HEADER_LOGO_WIDTH.desktop} variant="ink" title="" className="hidden md:block" />
        </a>

        <nav aria-label="Sito" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {SITE_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-4 py-2 text-body-sm font-medium transition-colors duration-fast',
                    isCurrent(item.href) ? 'bg-bg-raised text-text-primary' : 'text-text-secondary hover:bg-bg-raised hover:text-text-primary',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <nav aria-label="Studio" className="hidden lg:block">
            <ul className="flex items-center gap-4">
              {STUDIO_NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className={cn(
                      'type-mono-sm transition-colors duration-fast',
                      isCurrent(item.href) ? 'text-text-brand' : 'text-text-muted hover:text-text-primary',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Button as="a" href={to('/prodotto')} size="sm" className="hidden sm:inline-flex">Compra</Button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
            className="flex h-control-sm w-control-sm items-center justify-center rounded-full border border-border-default text-text-primary md:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              {open ? (
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              ) : (
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!open} className="border-t border-border-subtle bg-bg-page md:hidden">
        <nav aria-label="Sito, mobile" className="mx-auto flex max-w-container flex-col gap-1 px-6 py-4">
          {SITE_NAV.map((item) => (
            <a key={item.href} href={item.href} className="rounded-md px-3 py-3 text-body-md font-medium text-text-primary hover:bg-bg-raised">
              {item.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-1 border-t border-border-subtle pt-3">
            {STUDIO_NAV.map((item) => (
              <a key={item.href} href={item.href} className="rounded-md px-3 py-2 type-mono-sm text-text-muted hover:text-text-primary">
                {item.label}
              </a>
            ))}
          </div>
          <Button as="a" href={to('/prodotto')} className="mt-3">Compra</Button>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
