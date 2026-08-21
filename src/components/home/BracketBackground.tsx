type Line = { x1: number; y1: number; x2: number; y2: number }

const TEAMS_PER_SIDE = 8
const SLOT_GAP = 26
const ROUND_GAP = 64

/**
 * Jedna połówka drabinki: 8 drużyn schodzących się parami do jednego punktu
 * po prawej. Druga połówka to ta sama geometria, odbita w SVG przez `scale`.
 */
function buildHalf(): { lines: Line[]; width: number; height: number } {
  const lines: Line[] = []
  let positions = Array.from(
    { length: TEAMS_PER_SIDE },
    (_, i) => i * SLOT_GAP + SLOT_GAP / 2,
  )
  let x = 0

  while (positions.length > 1) {
    const next: number[] = []
    for (let i = 0; i < positions.length; i += 2) {
      const top = positions[i]
      const bottom = positions[i + 1]
      const mid = (top + bottom) / 2

      lines.push({ x1: x, y1: top, x2: x + ROUND_GAP, y2: top })
      lines.push({ x1: x, y1: bottom, x2: x + ROUND_GAP, y2: bottom })
      lines.push({ x1: x + ROUND_GAP, y1: top, x2: x + ROUND_GAP, y2: bottom })
      lines.push({
        x1: x + ROUND_GAP,
        y1: mid,
        x2: x + ROUND_GAP * 1.5,
        y2: mid,
      })

      next.push(mid)
    }
    positions = next
    x += ROUND_GAP * 1.5
  }

  return { lines, width: x, height: TEAMS_PER_SIDE * SLOT_GAP }
}

const { lines: HALF_LINES, width: HALF_WIDTH, height: HALF_HEIGHT } = buildHalf()

const VIEW_WIDTH = 1200
const VIEW_HEIGHT = 460
const CENTER_GAP = 60
const OFFSET_Y = (VIEW_HEIGHT - HALF_HEIGHT) / 2
const LEFT_X = VIEW_WIDTH / 2 - CENTER_GAP / 2 - HALF_WIDTH
const RIGHT_X = VIEW_WIDTH / 2 + CENTER_GAP / 2 + HALF_WIDTH

const fade = {
  maskImage:
    'radial-gradient(ellipse 70% 65% at 50% 50%, black 35%, transparent 85%)',
  WebkitMaskImage:
    'radial-gradient(ellipse 70% 65% at 50% 50%, black 35%, transparent 85%)',
}

/**
 * Zarys drabinki na 16 drużyn — same cienkie linie i puste sloty, bez treści
 * do czytania. Czysta scenografia pod sekcją CTA: niskie krycie i zanikanie
 * ku krawędziom kadru, żeby nie biło się z treścią na wierzchu.
 */
export function BracketBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={fade}
    >
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <g
          transform={`translate(${LEFT_X} ${OFFSET_Y})`}
          stroke="var(--color-border)"
          strokeWidth={1}
          opacity={0.15}
        >
          {HALF_LINES.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>
        <g
          transform={`translate(${RIGHT_X} ${OFFSET_Y}) scale(-1 1)`}
          stroke="var(--color-border)"
          strokeWidth={1}
          opacity={0.15}
        >
          {HALF_LINES.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>
      </svg>
    </div>
  )
}
