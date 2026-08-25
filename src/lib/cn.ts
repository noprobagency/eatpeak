/** Concatena classi ignorando falsy. Volutamente minimo: niente dipendenze. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
