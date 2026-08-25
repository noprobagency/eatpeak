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
 * Il testo su fondo terracotta e' neutral-0, mai miele: miele-300 su
 * terracotta-400 sta sotto 1.6:1 ed e' illeggibile.
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
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
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-bg-brand text-text-on-brand border border-transparent ' +
    'hover:bg-terracotta-500 active:bg-terracotta-600',
  secondary:
    'bg-transparent text-text-brand border border-border-brand ' +
    'hover:bg-bg-brand-soft active:bg-terracotta-100',
  ghost:
    'bg-transparent text-text-primary border border-transparent ' +
    'hover:bg-bg-raised active:bg-neutral-200',
  link:
    'bg-transparent text-text-brand border border-transparent underline underline-offset-4 ' +
    'px-0 hover:text-terracotta-700 active:text-terracotta-800',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-control-sm px-4 text-body-sm gap-2',
  md: 'h-control-md px-6 text-body-md gap-2',
  lg: 'h-control-lg px-8 text-body-lg gap-3',
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    as = 'button',
    href,
    iconLeft,
    iconRight,
    disabled,
    className,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading

  const classes = cn(
    'inline-flex items-center justify-center font-text font-medium',
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
      {loading ? <Spinner /> : iconLeft}
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
    <button
      ref={ref}
      type="button"
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  )
})

export default Button
