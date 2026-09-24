import { useEffect, useState } from 'react'
import type { BracketApi } from '../data/bracket'

type State = { loading: boolean; data: BracketApi | null }

// Jedno zapytanie na załadowanie strony (ten sam wzorzec co useTeamsRegistered).
let request: Promise<BracketApi | null> | null = null

function isBracketApi(v: unknown): v is BracketApi {
  if (typeof v !== 'object' || v === null) return false
  const b = v as Partial<BracketApi>
  return (
    (b.phase === 'registration' || b.phase === 'live' || b.phase === 'finished') &&
    Array.isArray(b.teams) &&
    Array.isArray(b.matches)
  )
}

function fetchBracket(): Promise<BracketApi | null> {
  request ??= fetch('/api/bracket')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json() as Promise<unknown>
    })
    .then((data) => {
      if (!isBracketApi(data)) throw new Error('Bad payload')
      return data
    })
    // Bez błędu na ekranie — brak danych oznacza statyczną drabinkę.
    .catch(() => null)
  return request
}

/**
 * Drużyny i mecze CUP-u z FACEIT przez /api/bracket. `loading` to true do
 * odpowiedzi; `data` jest null, gdy API nie odpowiedziało poprawnie.
 */
export function useBracket(): State {
  const [state, setState] = useState<State>({ loading: true, data: null })

  useEffect(() => {
    let active = true
    fetchBracket().then((data) => {
      if (active) setState({ loading: false, data })
    })
    return () => {
      active = false
    }
  }, [])

  return state
}
