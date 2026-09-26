/**
 * peak — il piano dei media (2.0).
 *
 * L'elenco degli scatti e dei render che il sito usa, con il brief di
 * ciascuno. E' la shot list per il prossimo passo, i prototipi finali con
 * Higgsfield: finche' un file non c'e', `src` e' null e <MediaPlaceholder />
 * mostra un campo colore con la descrizione. Quando il file arriva, si mette
 * in public/media/ e si scrive il percorso qui: la pagina si aggiorna da sola.
 *
 * I brief descrivono luce, ambiente e gesto. Mai una palestra. Le foto stanno
 * su carta o dentro un campo colore-gusto pieno: e' la regola della direzione
 * "Clinical Joy".
 */

import type { FlavorId } from './copy'

export type ShotRatio = '1:1' | '4:5' | '3:4' | '2:3' | '16:9' | '3:2'

export interface Shot {
  id: string
  /** Titolo breve, in mono nel segnaposto. */
  title: string
  /** Il brief per chi genera o fotografa. */
  brief: string
  ratio: ShotRatio
  /** Il gusto che domina la scena, se c'e'. Decide il colore del segnaposto. */
  flavor?: FlavorId
  /** Il fondo: campo colore pieno, carta, o inchiostro. */
  tone: 'flavor' | 'paper' | 'deep'
  /** Dove lo usa il sito. */
  use: string
  /** Il file, quando c'e'. Percorso da public/, es. "/media/busta-arancia-hero.png". */
  src: string | null
  alt: string
}

export const SHOTS: readonly Shot[] = [
  {
    id: 'hero-busta-arancia',
    title: 'Busta Nº01 — hero',
    brief: 'La busta arancia da 30 stick in piedi, tre quarti, su campo arancia pieno. Luce morbida da sinistra, nessuna ombra dura. Il wordmark bianco leggibile per intero.',
    ratio: '4:5',
    flavor: 'arancia',
    tone: 'flavor',
    use: 'Home — hero',
    src: null,
    alt: 'La busta peak Nº01 Arancia Rossa su fondo arancia',
  },
  {
    id: 'hero-busta-lime',
    title: 'Busta Nº02 — hero',
    brief: 'La busta lime da 30 stick, stessa inquadratura della arancia, su campo lime pieno. Le due immagini devono stare una accanto all altra come famiglia.',
    ratio: '4:5',
    flavor: 'lime',
    tone: 'flavor',
    use: 'Home — hero, Duo',
    src: null,
    alt: 'La busta peak Nº02 su fondo lime',
  },
  {
    id: 'gesto-stick',
    title: 'Il gesto',
    brief: 'Una mano apre uno stick arancia sopra un bicchiere d acqua, cucina di casa, luce naturale del mattino, superficie chiara. Il gesto e il soggetto: niente volti, niente palestra.',
    ratio: '3:2',
    flavor: 'arancia',
    tone: 'paper',
    use: 'Home — come funziona · PDP — galleria',
    src: null,
    alt: 'Uno stick peak aperto sopra un bicchiere d acqua',
  },
  {
    id: 'pdp-busta-fronte',
    title: 'PDP — busta fronte',
    brief: 'La busta in piedi, frontale, su carta #FAF7F2, ombra minima. Il fronte deve essere leggibile riga per riga: e la foto di catalogo.',
    ratio: '4:5',
    tone: 'paper',
    use: 'PDP — galleria 1',
    src: null,
    alt: 'La busta peak, fronte',
  },
  {
    id: 'pdp-busta-retro',
    title: 'PDP — busta retro',
    brief: 'Il retro della busta con la tabella nutrizionale. Stessa luce del fronte. Si fa solo dopo la fustella e i valori del laboratorio.',
    ratio: '4:5',
    tone: 'paper',
    use: 'PDP — galleria 2',
    src: null,
    alt: 'La busta peak, retro con la tabella nutrizionale',
  },
  {
    id: 'pdp-stick-mano',
    title: 'PDP — stick in mano',
    brief: 'Uno stick tenuto tra due dita, di lato, per far capire la misura. Fondo carta.',
    ratio: '4:5',
    tone: 'paper',
    use: 'PDP — galleria 3',
    src: null,
    alt: 'Uno stick peak tenuto in mano',
  },
  {
    id: 'pdp-bicchiere',
    title: 'PDP — nel bicchiere',
    brief: 'Un bicchiere d acqua con la bevanda gia sciolta, arancia rossa, su campo arancia. Trasparente, senza grumi visibili sul fondo.',
    ratio: '4:5',
    flavor: 'arancia',
    tone: 'flavor',
    use: 'PDP — galleria 4',
    src: null,
    alt: 'La bevanda peak Arancia Rossa nel bicchiere',
  },
  {
    id: 'duo',
    title: 'Il Duo',
    brief: 'Le due buste una accanto all altra, arancia e lime, su carta. E l unica composizione con due colori-gusto insieme.',
    ratio: '16:9',
    tone: 'paper',
    use: 'Home — prezzi · PDP — Abitudine',
    src: null,
    alt: 'Le due buste peak, Arancia Rossa e Lime & Menta',
  },
  {
    id: 'ambiente-scrivania',
    title: 'Sulla scrivania',
    brief: 'La busta e uno stick sulla scrivania di chi lavora, accanto a un portatile chiuso e a un bicchiere. Luce da finestra, ore nove.',
    ratio: '3:2',
    tone: 'paper',
    use: 'Home — il rituale',
    src: null,
    alt: 'La busta peak su una scrivania',
  },
  {
    id: 'dottoressa',
    title: 'La co-fondatrice',
    brief: 'Ritratto della co-fondatrice, farmacista, mezzo busto, su campo lime pieno. Sguardo in macchina, camicia chiara, nessun camice: e un esperta del brand, non un medico che raccomanda.',
    ratio: '4:5',
    flavor: 'lime',
    tone: 'flavor',
    use: 'Home e Formula — la dottoressa',
    src: null,
    alt: 'La co-fondatrice ed esperta del brand peak',
  },
  {
    id: 'formula-ingredienti',
    title: 'I tre ingredienti',
    brief: 'Tre piccoli mucchi di polvere bianca su carta, in fila, con lo stesso spazio del vertice: creatina, glicina, vitamina D3. Macro, luce piatta.',
    ratio: '16:9',
    tone: 'paper',
    use: 'Formula — apertura',
    src: null,
    alt: 'I tre ingredienti della formula CreaVida',
  },
  {
    id: 'meta-quadrato-arancia',
    title: 'Meta — quadrato arancia',
    brief: 'La busta arancia su campo arancia, quadrata, con spazio in basso per il pattern a pallini e un solo claim. Deve reggere a dimensioni da telefono.',
    ratio: '1:1',
    flavor: 'arancia',
    tone: 'flavor',
    use: 'Creativita social',
    src: null,
    alt: 'Creativita peak per il feed, gusto Arancia Rossa',
  },
  {
    id: 'meta-quadrato-lime',
    title: 'Meta — quadrato lime',
    brief: 'La stessa composizione del quadrato arancia, in lime. Le due insieme sono il carosello.',
    ratio: '1:1',
    flavor: 'lime',
    tone: 'flavor',
    use: 'Creativita social',
    src: null,
    alt: 'Creativita peak per il feed, gusto Lime & Menta',
  },
]

export function shotById(id: string): Shot {
  const found = SHOTS.find((s) => s.id === id)
  if (!found) throw new Error(`Scatto sconosciuto: ${id}`)
  return found
}

/** Quanti scatti mancano ancora: e' il contatore della pagina prototipi. */
export function missingShots(): number {
  return SHOTS.filter((s) => s.src === null).length
}

export function ratioValue(ratio: ShotRatio): string {
  return ratio.replace(':', ' / ')
}
