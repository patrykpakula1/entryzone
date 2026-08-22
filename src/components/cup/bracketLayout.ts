/**
 * Geometria drabinki: pozycje kart i łączące je linie, wyliczone raz jako
 * stałe piksele (ten sam sposób co BracketBackground na stronie głównej).
 * Karty mają stałą szerokość — na mobile drabinka przewija się w poziomie
 * zamiast się ściskać.
 */

export const MATCH_WIDTH = 208
export const MATCH_HEIGHT = 64
export const SLOT_GAP = 32
export const ROUND_GAP = 48
export const HEADER_HEIGHT = 36
export const FIRST_ROUND_MATCHES = 8
export const ROUND_COUNT = 4

export type Point = { x: number; y: number }
export type ConnectorLine = { x1: number; y1: number; x2: number; y2: number }

function computePositions(): Point[][] {
  const rounds: Point[][] = []
  let centers = Array.from(
    { length: FIRST_ROUND_MATCHES },
    (_, i) => i * (MATCH_HEIGHT + SLOT_GAP) + MATCH_HEIGHT / 2,
  )
  let x = 0

  for (let r = 0; r < ROUND_COUNT; r++) {
    rounds.push(centers.map((c) => ({ x, y: c - MATCH_HEIGHT / 2 })))

    if (r < ROUND_COUNT - 1) {
      const next: number[] = []
      for (let i = 0; i < centers.length; i += 2) {
        next.push((centers[i] + centers[i + 1]) / 2)
      }
      centers = next
      x += MATCH_WIDTH + ROUND_GAP
    }
  }

  return rounds
}

function computeConnectors(positions: Point[][]): ConnectorLine[] {
  const lines: ConnectorLine[] = []

  for (let r = 0; r < positions.length - 1; r++) {
    const centers = positions[r].map((p) => p.y + MATCH_HEIGHT / 2)
    const rightX = positions[r][0].x + MATCH_WIDTH
    const midX = rightX + ROUND_GAP / 2
    const nextLeftX = positions[r + 1][0].x

    for (let i = 0; i < centers.length; i += 2) {
      const top = centers[i]
      const bottom = centers[i + 1]
      const mid = (top + bottom) / 2

      lines.push({ x1: rightX, y1: top, x2: midX, y2: top })
      lines.push({ x1: rightX, y1: bottom, x2: midX, y2: bottom })
      lines.push({ x1: midX, y1: top, x2: midX, y2: bottom })
      lines.push({ x1: midX, y1: mid, x2: nextLeftX, y2: mid })
    }
  }

  return lines
}

export const POSITIONS = computePositions()
export const CONNECTORS = computeConnectors(POSITIONS)

export const TOTAL_WIDTH =
  ROUND_COUNT * MATCH_WIDTH + (ROUND_COUNT - 1) * ROUND_GAP
export const TOTAL_HEIGHT =
  FIRST_ROUND_MATCHES * MATCH_HEIGHT + (FIRST_ROUND_MATCHES - 1) * SLOT_GAP
