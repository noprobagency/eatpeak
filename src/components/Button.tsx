/**
 * <Button /> — l'azione.
 *
 * QUANDO USARLO: per fare qualcosa (aggiungi al carrello, invia, apri).
 * QUANDO NO: per andare da qualche parte. Quello e' un link — usa `as="a"`,
 * che rende un <a> vero e resta navigabile da tastiera e col tasto destro.
 *
 * Il raggio e' sempre `full`: nel sistema di peak i pulsanti sono pillole,
 * senza eccezioni. Non esiste una prop per cambiarlo, di proposito.
 *
 * 3.0: il primario e' arancia 600 con testo bianco (4,91:1). Sui campi colore
 * si usa `inverse`, la pillola bianca con testo arancia 700. Niente nero.
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import '../brand/dots.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'inverse'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  /** Mostra lo spinner e blocca i click, ma tiene il pulsante nel tab order. */
  loading?: boolean
  fullWidth?: boolean
  /** Rende un <a> invece di un <button>. Richiede `href`. */
  as?: 'button' | 'a'
  href?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  /** Il pallino davanti al testo, che si riempie al passaggio (H4). */
  dot?: boolean
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-bg-brand-deep text-text-on-brand border border-transparent ' +
    'hover:bg-arancia-700 active:bg-arancia-800',
  secondary:
    'bg-transparent text-text-primary border border-border-strong ' +
    'hover:border-arancia-600 hover:text-text-brand active:bg-bg-brand-soft',
  ghost:
    'bg-transparent text-text-primary border border-transparent ' +
    'hover:bg-bg-raised active:bg-neutral-200',
  link:
    'bg-transparent text-text-brand border border-transparent underline underline-offset-4 ' +
    'px-0 hover:text-arancia-700 active:text-arancia-800',
  /** La pillola bianca: sui campi colore. Testo arancia 700 (6,69:1). */
  inverse:
    'bg-neutral-0 text-arancia-700 border border-transparent ' +
    'hover:bg-arancia-50 active:bg-arancia-100',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-control-sm px-4 text-body-sm gap-2',
  md: 'h-control-md px-6 text-body-md gap-2',
  lg: 'h-control-lg px-8 text-body-lg gap-3',
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children, variant = 'primary', size = 'md', loading = false, fullWidth = false,
    as = 'button', href, iconLeft, iconRight, dot = false, disabled, className, ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading

  const classes = cn(
    'inline-flex items-center justify-center font-display font-bold',
    'rounded-full transition-colors duration-base ease-standard',
    'disabled:cursor-not-allowed disabled:opacity-45',
    variant !== 'link' && SIZES[size],
    variant === 'link' && 'gap-2',
    VARIANTS[variant],
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {loading ? <Spinner /> : dot ? <span className="peak-cta-dot" aria-hidden="true" /> : iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </>
  )

  if (as === 'a') {
    return (
      <a
        href={isDisabled ? undefined : href}
        className={cn(classes, isDisabled && 'pointer-events-none opacity-45')}
        aria-disabled={isDisabled || undefined}
        role={isDisabled ? 'link' : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <button ref={ref} type="button" className={classes} disabled={isDisabled} aria-busy={loading || undefined} {...rest}>
      {content}
    </button>
  )
})

export default Button
