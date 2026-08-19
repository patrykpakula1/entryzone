/** Te same krzywe co w shaderach — trzymamy je w jednym miejscu. */

export function clamp01(x: number): number {
  return Math.min(Math.max(x, 0), 1)
}

/** Odwzorowanie [edge0, edge1] na 0..1 z wygładzonymi końcami. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Liniowe odwzorowanie [from, to] na 0..1, bez wygładzania. */
export function range(from: number, to: number, x: number): number {
  return clamp01((x - from) / (to - from))
}
