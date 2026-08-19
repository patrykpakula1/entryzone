import { Color } from 'three'

/**
 * Tokeny żyją wyłącznie w @theme w src/index.css. Three.js nie czyta CSS,
 * więc zamiast wklejać hexy do kodu sceny odczytujemy je stamtąd w runtime.
 */
const cache = new Map<string, string>()

export function token(name: string): string {
  const hit = cache.get(name)
  if (hit !== undefined) return hit

  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()

  if (!value) {
    throw new Error(`Brak tokenu ${name} w @theme (src/index.css)`)
  }

  cache.set(name, value)
  return value
}

export function tokenColor(name: string): Color {
  return new Color(token(name))
}
