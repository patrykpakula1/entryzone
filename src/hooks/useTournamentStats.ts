import { useEffect, useState } from 'react'

export type PlayerStats = {
  playerId: string
  nickname: string
  teamName: string | null
  maps: number
  kills: number
  deaths: number
  kd: number
  adr: number
  hs: number
}

export type TournamentStats = {
  players: PlayerStats[]
  mvpRanking: PlayerStats[]
}

// Jedno zapytanie na załadowanie strony — korzystają z niego i ranking MVP,
// i panel składu (ten sam wzorzec co useBracket).
let request: Promise<TournamentStats | null> | null = null

function isStats(v: unknown): v is TournamentStats {
  if (typeof v !== 'object' || v === null) return false
  const s = v as Partial<TournamentStats>
  return Array.isArray(s.players) && Array.isArray(s.mvpRanking)
}

function fetchStats(): Promise<TournamentStats | null> {
  request ??= fetch('/api/stats')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json() as Promise<unknown>
    })
    .then((data) => {
      if (!isStats(data)) throw new Error('Bad payload')
      return data
    })
    // Bez błędu na ekranie — brak statystyk to po prostu brak sekcji MVP.
    .catch(() => null)
  return request
}

/** Statystyki turnieju z FACEIT przez /api/stats; null do odpowiedzi i gdy API zawiedzie. */
export function useTournamentStats(): TournamentStats | null {
  const [stats, setStats] = useState<TournamentStats | null>(null)

  useEffect(() => {
    let active = true
    fetchStats().then((next) => {
      if (active) setStats(next)
    })
    return () => {
      active = false
    }
  }, [])

  return stats
}
