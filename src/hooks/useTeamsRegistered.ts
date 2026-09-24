import { useEffect, useState } from 'react'
import { registration } from '../data/registration'

type Teams = { registered: number | null; max: number }

const FALLBACK_MAX = 16

// Jedno zapytanie na załadowanie strony, niezależnie od liczby komponentów
// używających hooka (CupTeaser i Registration mogą być na ekranie razem).
let request: Promise<Teams> | null = null

function fetchTeams(): Promise<Teams> {
  request ??= fetch('/api/teams')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json() as Promise<{ registered?: unknown; slots?: unknown }>
    })
    .then(({ registered, slots }) => {
      if (typeof registered !== 'number') throw new Error('Bad payload')
      return {
        registered,
        max: typeof slots === 'number' && slots > 0 ? slots : FALLBACK_MAX,
      }
    })
    .catch(() => ({
      // Fallback: ręcznie wpisana wartość z registration.ts.
      registered: registration.teamsRegistered,
      max: FALLBACK_MAX,
    }))
  return request
}

/**
 * Liczba zapisanych drużyn i miejsc, na żywo z FACEIT przez /api/teams.
 * `registered` to null podczas ładowania; gdy fetch się nie uda, dostajemy
 * `registration.teamsRegistered` i 16 miejsc.
 */
export function useTeamsRegistered(): Teams {
  const [teams, setTeams] = useState<Teams>({ registered: null, max: FALLBACK_MAX })

  useEffect(() => {
    let active = true
    fetchTeams().then((next) => {
      if (active) setTeams(next)
    })
    return () => {
      active = false
    }
  }, [])

  return teams
}
