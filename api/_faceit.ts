/**
 * Wspólne zapytania do FACEIT Data API dla funkcji w api/. Podkreślnik w nazwie
 * sprawia, że Vercel nie wystawia tego pliku jako trasy.
 *
 * FACEIT przy większym ruchu odpowiada 429 (rate limit) albo 5xx, więc każde
 * zapytanie ponawiamy do RETRIES razy z rosnącą przerwą (500 ms → 1 s → 2 s),
 * a gdy FACEIT poda nagłówek Retry-After, czekamy tyle, ile prosi.
 */

export const API = 'https://open.faceit.com/data/v4'

const RETRIES = 3
const BACKOFF_MS = [500, 1000, 2000]
// Retry-After bywa dużo dłuższy niż budżet czasu funkcji — nie czekamy ponad to.
const MAX_RETRY_AFTER_MS = 5000

export type Json = Record<string, unknown>

export class UpstreamError extends Error {
  status: number | null
  constructor(message: string, status: number | null = null) {
    super(message)
    this.status = status
  }
}

export const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null
export const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null)
// FACEIT oddaje część liczb jako stringi ("13", "84.5"), więc czytamy obie formy.
export const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v)
    ? v
    : typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))
      ? Number(v)
      : null

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Retry-After to liczba sekund albo data HTTP; zwraca milisekundy albo null. */
function retryAfterMs(res: Response): number | null {
  const raw = res.headers.get('retry-after')
  if (!raw) return null
  const seconds = Number(raw)
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000
  const date = Date.parse(raw)
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : null
}

const retryable = (status: number) => status === 429 || status >= 500

/**
 * GET na FACEIT z retry. Rzuca UpstreamError (ze statusem HTTP ostatniej
 * odpowiedzi) dopiero po wyczerpaniu prób; 404 i inne 4xx wracają od razu.
 */
export async function faceit(path: string, apiKey: string): Promise<Json> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (res.ok) {
      const data: unknown = await res.json()
      if (!isObj(data)) throw new UpstreamError(`bad payload ${path}`)
      return data
    }
    if (!retryable(res.status) || attempt >= RETRIES) {
      throw new UpstreamError(`${res.status} ${path}`, res.status)
    }
    // Nigdy szybciej niż nasz backoff, ale jeśli FACEIT prosi o dłużej — czekamy.
    const wait = Math.max(retryAfterMs(res) ?? 0, BACKOFF_MS[attempt])
    await sleep(Math.min(wait, MAX_RETRY_AFTER_MS))
  }
}
