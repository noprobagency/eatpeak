/**
 * Rasterizzatore minimo, senza dipendenze.
 *
 * Serve solo a disegnare l'icona di peak: un contenitore (rettangolo
 * arrotondato o cerchio) e una saetta poligonale, con contorno facoltativo.
 * Non e' un motore SVG generico e non prova a esserlo — i path del marchio
 * usano solo M, L e Z con coordinate assolute, e questo basta.
 *
 * L'antialiasing e' per supercampionamento: ogni pixel e' la media di SS x SS
 * campioni. A SS=4 il bordo e' pulito anche a 16px.
 */

import { deflateSync } from 'node:zlib'

const SS = 4 // campioni per lato

// ---------------------------------------------------------------------------
// Geometria
// ---------------------------------------------------------------------------

/** Converte un path "M x y L x y ... Z" in una lista di vertici. */
export function parsePolygon(d) {
  const tokens = d.trim().split(/[\s,]+/)
  const points = []
  let i = 0

  while (i < tokens.length) {
    const cmd = tokens[i]
    if (cmd === 'M' || cmd === 'L') {
      points.push([parseFloat(tokens[i + 1]), parseFloat(tokens[i + 2])])
      i += 3
    } else if (cmd === 'Z' || cmd === 'z') {
      i += 1
    } else {
      throw new Error(`Comando non supportato nel path: "${cmd}". Ammessi solo M, L, Z assoluti.`)
    }
  }

  return points
}

function pointInPolygon(px, py, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    const intersects = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    if (intersects) inside = !inside
  }
  return inside
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const lenSq = dx * dx + dy * dy
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq))
  const cx = ax + t * dx
  const cy = ay + t * dy
  return Math.hypot(px - cx, py - cy)
}

function distanceToPolygonEdge(px, py, poly) {
  let min = Infinity
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const d = distanceToSegment(px, py, poly[j][0], poly[j][1], poly[i][0], poly[i][1])
    if (d < min) min = d
  }
  return min
}

function insideRoundedRect(px, py, x, y, w, h, r) {
  if (px < x || py < y || px > x + w || py > y + h) return false
  const rx = Math.min(r, w / 2)
  const ry = Math.min(r, h / 2)

  const cx = px < x + rx ? x + rx : px > x + w - rx ? x + w - rx : px
  const cy = py < y + ry ? y + ry : py > y + h - ry ? y + h - ry : py

  if (cx === px && cy === py) return true
  return Math.hypot(px - cx, py - cy) <= rx
}

// ---------------------------------------------------------------------------
// Colore
// ---------------------------------------------------------------------------

export function parseHex(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

/** Composizione source-over su premoltiplicato semplice. */
function blend(dst, offset, [r, g, b], alpha) {
  if (alpha <= 0) return
  const da = dst[offset + 3] / 255
  const outA = alpha + da * (1 - alpha)
  if (outA === 0) return

  for (let c = 0; c < 3; c++) {
    const sc = [r, g, b][c]
    const dc = dst[offset + c]
    dst[offset + c] = Math.round((sc * alpha + dc * da * (1 - alpha)) / outA)
  }
  dst[offset + 3] = Math.round(outA * 255)
}

// ---------------------------------------------------------------------------
// Disegno
// ---------------------------------------------------------------------------

/**
 * Disegna l'icona su un buffer RGBA di lato `size`.
 * Le coordinate della spec sono su viewBox 0..100 e vengono scalate qui.
 *
 * @param {object} spec  { background, bolt, outline, outlineWidth, shape, path }
 * @param {number} size  lato in pixel
 * @param {number} radiusUnits raggio del contenitore in unita' di viewBox
 */
export function renderIcon(spec, size, radiusUnits = 26) {
  const px = new Uint8ClampedArray(size * size * 4)
  const scale = size / 100

  const bg = spec.background ? parseHex(spec.background) : null
  const bolt = parseHex(spec.bolt)
  const outline = spec.outline ? parseHex(spec.outline) : null
  const outlineHalf = outline ? (spec.outlineWidth ?? 5) / 2 : 0

  const poly = parsePolygon(spec.path)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let bgHits = 0
      let outlineHits = 0
      let boltHits = 0

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          // punto campione, in unita' di viewBox
          const ux = ((x + (sx + 0.5) / SS) / scale)
          const uy = ((y + (sy + 0.5) / SS) / scale)

          if (bg) {
            const inBg = spec.shape === 'circle'
              ? Math.hypot(ux - 50, uy - 50) <= 48
              : insideRoundedRect(ux, uy, 2, 2, 96, 96, radiusUnits)
            if (inBg) bgHits++
          }

          const inBolt = pointInPolygon(ux, uy, poly)
          if (inBolt) boltHits++

          if (outline && !inBolt && distanceToPolygonEdge(ux, uy, poly) <= outlineHalf) {
            outlineHits++
          }
        }
      }

      const total = SS * SS
      const offset = (y * size + x) * 4

      if (bg && bgHits > 0) blend(px, offset, bg, bgHits / total)
      if (outline && outlineHits > 0) blend(px, offset, outline, outlineHits / total)
      if (boltHits > 0) blend(px, offset, bolt, boltHits / total)
    }
  }

  return px
}

// ---------------------------------------------------------------------------
// PNG
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

/** Codifica un buffer RGBA in PNG a 8 bit con canale alfa. */
export function encodePng(rgba, size) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // truecolour with alpha
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  // Ogni riga preceduta dal byte di filtro 0 (nessun filtro).
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    const from = y * size * 4
    const to = y * (size * 4 + 1)
    raw[to] = 0
    Buffer.from(rgba.buffer, rgba.byteOffset + from, size * 4).copy(raw, to + 1)
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------------------------------------------------------------------------
// ICO
// ---------------------------------------------------------------------------

/**
 * Costruisce un .ico multi-risoluzione con immagini BMP a 32 bit.
 * Il BMP dentro un ICO ha l'altezza raddoppiata nell'header (immagine + maschera)
 * e le righe salvate dal basso verso l'alto: e' il formato, non un errore.
 */
export function encodeIco(images) {
  const dir = Buffer.alloc(6)
  dir.writeUInt16LE(0, 0) // riservato
  dir.writeUInt16LE(1, 2) // tipo 1 = icona
  dir.writeUInt16LE(images.length, 4)

  const entries = []
  const bodies = []
  let offset = 6 + images.length * 16

  for (const { rgba, size } of images) {
    const rowBytes = size * 4
    const maskRow = Math.ceil(size / 32) * 4 // 1bpp, righe allineate a 4 byte

    const header = Buffer.alloc(40)
    header.writeUInt32LE(40, 0)
    header.writeInt32LE(size, 4)
    header.writeInt32LE(size * 2, 8) // immagine + maschera
    header.writeUInt16LE(1, 12)
    header.writeUInt16LE(32, 14)
    header.writeUInt32LE(0, 16) // BI_RGB
    header.writeUInt32LE(size * rowBytes + size * maskRow, 20)

    const pixels = Buffer.alloc(size * rowBytes)
    for (let y = 0; y < size; y++) {
      const src = (size - 1 - y) * rowBytes // dal basso verso l'alto
      for (let x = 0; x < size; x++) {
        const s = src + x * 4
        const d = y * rowBytes + x * 4
        pixels[d] = rgba[s + 2] // B
        pixels[d + 1] = rgba[s + 1] // G
        pixels[d + 2] = rgba[s] // R
        pixels[d + 3] = rgba[s + 3] // A
      }
    }

    // Maschera AND: tutta a zero, l'alfa a 32 bit fa gia' il lavoro.
    const mask = Buffer.alloc(size * maskRow)

    const body = Buffer.concat([header, pixels, mask])

    const entry = Buffer.alloc(16)
    entry[0] = size >= 256 ? 0 : size
    entry[1] = size >= 256 ? 0 : size
    entry[2] = 0 // colori in palette
    entry[3] = 0
    entry.writeUInt16LE(1, 4) // piani
    entry.writeUInt16LE(32, 6) // bit per pixel
    entry.writeUInt32LE(body.length, 8)
    entry.writeUInt32LE(offset, 12)

    entries.push(entry)
    bodies.push(body)
    offset += body.length
  }

  return Buffer.concat([dir, ...entries, ...bodies])
}
