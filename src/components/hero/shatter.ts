import { smoothstep } from '../../lib/math'

/**
 * Rozbicie warstwy DOM na odłamki. Sygnet i wordmark leżą nad canvasem, więc
 * zamiast udawać je cząsteczkami w scenie, tniemy prawdziwe elementy: każdy
 * odłamek to kopia znaku przycięta clip-path do jednego kawałka. Dzięki temu
 * w powietrzu lecą fragmenty pieczęci i liter, a nie abstrakcyjne trójkąty.
 */

/** Wielokąt w układzie elementu: 0..1 w poziomie i w pionie. */
type Poly = [number, number][]

export type Shard = {
  el: HTMLElement
  /** kierunek rozlotu na ekranie, znormalizowany */
  dirX: number
  dirY: number
  /** dystans w px przy pełnym rozpadzie */
  travel: number
  /** ile odłamek nadlatuje w stronę kamery */
  depth: number
  /** obrót w stopniach przy pełnym rozpadzie */
  turn: number
  axisX: number
  axisY: number
}

/** Deterministyczny szum — układ pęknięć ma być ten sam przy każdym wejściu. */
function noise(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

type Random = () => number

/** Punkt na krawędzi kwadratu jednostkowego, pod danym kątem od środka. */
function edgePoint(angle: number): [number, number] {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const reach = 0.5 / Math.max(Math.abs(cos), Math.abs(sin))
  return [0.5 + cos * reach, 0.5 + sin * reach]
}

/**
 * Kliny od środka do krawędzi — dla okrągłego sygnetu. Rogi pudełka trafiają
 * do wielokąta osobno, inaczej klin ścinałby narożnik po cięciwie.
 */
function wedges(count: number, rand: Random): Poly[] {
  const angles: number[] = []
  for (let i = 0; i < count; i++) {
    angles.push((i / count) * Math.PI * 2 + (rand() - 0.5) * 0.5)
  }

  const corners = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]

  return angles.map((from, i) => {
    const raw = angles[(i + 1) % count]
    const to = raw > from ? raw : raw + Math.PI * 2

    const poly: Poly = [[0.5, 0.5], edgePoint(from)]
    for (const corner of corners) {
      // Ten sam róg trzeba sprawdzić na dwóch obrotach, bo ostatni klin
      // przechodzi przez zero.
      for (const angle of [corner, corner + Math.PI * 2]) {
        if (angle > from && angle < to) poly.push(edgePoint(angle))
      }
    }
    poly.push(edgePoint(to))
    return poly
  })
}

/**
 * Poszarpana krata — dla podłużnego napisu. Węzły w środku siatki są
 * rozchwiane, więc kawałki wychodzą nierówne jak potłuczone szkło.
 */
function lattice(cols: number, rows: number, rand: Random): Poly[] {
  const nodes: [number, number][][] = []

  for (let r = 0; r <= rows; r++) {
    const row: [number, number][] = []
    for (let c = 0; c <= cols; c++) {
      const edge = r === 0 || r === rows || c === 0 || c === cols
      const jitter = edge ? 0 : 0.34
      row.push([
        c / cols + (rand() - 0.5) * jitter / cols,
        r / rows + (rand() - 0.5) * jitter / rows,
      ])
    }
    nodes.push(row)
  }

  const polys: Poly[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      polys.push([
        nodes[r][c],
        nodes[r][c + 1],
        nodes[r + 1][c + 1],
        nodes[r + 1][c],
      ])
    }
  }
  return polys
}

function clipPath(poly: Poly): string {
  const points = poly
    .map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`)
    .join(', ')
  return `polygon(${points})`
}

/**
 * Jeden odłamek: kopia źródłowego elementu w pudełku dokładnie tej samej
 * wielkości i w tym samym miejscu, przycięta do jednego kawałka.
 */
function buildShard(
  source: HTMLElement,
  box: DOMRect,
  base: DOMRect,
  poly: Poly,
): HTMLElement {
  const el = document.createElement('div')
  el.style.position = 'absolute'
  el.style.left = `${box.left - base.left}px`
  el.style.top = `${box.top - base.top}px`
  el.style.width = `${box.width}px`
  el.style.height = `${box.height}px`
  el.style.clipPath = clipPath(poly)
  el.style.willChange = 'transform, opacity'

  const clone = source.cloneNode(true) as HTMLElement
  clone.removeAttribute('id')
  clone.style.position = 'absolute'
  clone.style.margin = '0'
  clone.style.left = '0'
  clone.style.top = '0'
  clone.style.width = `${box.width}px`
  clone.style.height = `${box.height}px`

  el.appendChild(clone)
  return el
}

type Source = {
  el: HTMLElement
  /** okrągła pieczęć rozpada się w kliny, napis w kratę */
  shape: 'wedges' | 'lattice'
}

/**
 * Buduje warstwę odłamków w `host`. Wszystkie kawałki lecą od `origin`, czyli
 * od miejsca trafienia — sygnet rozrywa od środka, napis odrzuca w dół i na
 * boki. Zwraca odłamki gotowe do malowania w pętli scrolla.
 */
export function buildDebris(
  host: HTMLElement,
  sources: Source[],
  origin: { x: number; y: number },
): Shard[] {
  const rand = noise(0x5eed4)
  const base = host.getBoundingClientRect()
  const reach = Math.min(base.width, base.height)

  host.replaceChildren()
  // Zbieżność perspektywy w punkcie uderzenia: odłamki nadlatujące na kamerę
  // rozchodzą się od miejsca trafienia, a nie od środka ekranu.
  host.style.perspectiveOrigin = `${origin.x}px ${origin.y}px`

  const shards: Shard[] = []

  for (const source of sources) {
    const box = source.el.getBoundingClientRect()
    if (box.width === 0 || box.height === 0) continue

    const polys =
      source.shape === 'wedges' ? wedges(9, rand) : lattice(8, 2, rand)

    for (const poly of polys) {
      const el = buildShard(source.el, box, base, poly)
      host.appendChild(el)

      let cx = 0
      let cy = 0
      for (const [x, y] of poly) {
        cx += x
        cy += y
      }
      cx = box.left - base.left + (cx / poly.length) * box.width
      cy = box.top - base.top + (cy / poly.length) * box.height

      let dirX = cx - origin.x
      let dirY = cy - origin.y
      const length = Math.hypot(dirX, dirY)
      if (length < 1) {
        // Kawałek dokładnie na osi uderzenia — kierunek z losu, byle nie zero.
        const angle = rand() * Math.PI * 2
        dirX = Math.cos(angle)
        dirY = Math.sin(angle)
      } else {
        dirX /= length
        dirY /= length
      }

      shards.push({
        el,
        dirX,
        dirY,
        travel: reach * (0.18 + rand() * 0.42),
        depth: 150 + rand() * 400,
        turn: (rand() * 2 - 1) * 260,
        axisX: rand() * 2 - 1,
        axisY: rand() * 2 - 1,
      })
    }
  }

  return shards
}

/**
 * Postęp, przy którym odłamki są już całkiem przezroczyste. Warstwa trzyma
 * kilkadziesiąt kompozytowanych elementów z will-change, więc od tego miejsca
 * opłaca się ją schować, zamiast malować niewidoczne kawałki do końca intra.
 */
export const DEBRIS_SPENT = 0.65

/**
 * Rozpad sterowany postępem scrolla: kopnięcie i wyhamowanie, potem zanik.
 * Bez własnej osi czasu — cofnięcie strony składa znak z powrotem.
 */
export function paintDebris(shards: Shard[], progress: number) {
  const distance = Math.pow(progress, 0.75)
  // Gruz gaśnie szybciej, niż dolatuje — inaczej czyta się jak rozjeżdżające
  // się litery, a nie jak rozbity znak.
  const fade = 1 - smoothstep(0.12, DEBRIS_SPENT, progress)

  for (const shard of shards) {
    const x = shard.dirX * shard.travel * distance
    const y = shard.dirY * shard.travel * distance
    const z = shard.depth * distance
    const angle = shard.turn * distance

    shard.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotate3d(${shard.axisX.toFixed(3)}, ${shard.axisY.toFixed(3)}, 1, ${angle.toFixed(1)}deg)`
    shard.el.style.opacity = fade.toFixed(3)
  }
}
