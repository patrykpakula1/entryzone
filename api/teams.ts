/**
 * Licznik zapisanych drużyn z FACEIT — jedyna funkcja serverless w projekcie.
 * Klucz API żyje wyłącznie w zmiennej środowiskowej FACEIT_API_KEY na Vercelu;
 * frontend woła tylko /api/teams i nigdy go nie widzi.
 */

import { faceit, UpstreamError } from './_faceit.js'

const CHAMPIONSHIP_ID = '4c962c5e-7481-4fd2-ae32-007a47e79455'

// Odświeżanie co 5 min na krawędzi CDN — FACEIT dostaje jedno zapytanie na
// okno, niezależnie od liczby odwiedzających.
const CACHE_OK = 'public, s-maxage=300, stale-while-revalidate=600'

function json(body: unknown, status: number, cacheControl: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
    },
  })
}

export default {
  async fetch() {
    const apiKey = process.env.FACEIT_API_KEY
    if (!apiKey) {
      return json({ error: 'FACEIT_API_KEY is not configured' }, 500, 'no-store')
    }

    try {
      const data = await faceit(`/championships/${CHAMPIONSHIP_ID}`, apiKey)
      const { current_subscriptions: registered, slots } = data
      if (typeof registered !== 'number' || typeof slots !== 'number') {
        return json({ error: 'Unexpected FACEIT response shape' }, 502, 'no-store')
      }

      return json({ registered, slots }, 200, CACHE_OK)
    } catch (err) {
      if (err instanceof UpstreamError && err.status !== null) {
        return json({ error: 'FACEIT API error', status: err.status }, 502, 'no-store')
      }
      return json({ error: 'FACEIT API unreachable' }, 502, 'no-store')
    }
  },
}
