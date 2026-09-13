export type Team = {
  id: string
  name: string
  players: [string, string, string, string, string]
  substitute?: string
}

export type Slot = string | null

export type MatchResult = {
  scoreA: number
  scoreB: number
  winner: 'A' | 'B'
}

export type Match = {
  id: string
  teamA: Slot
  teamB: Slot
  result?: MatchResult
}

/**
 * Rejestr drużyn — jedno miejsce na skład i nazwę dla całego serwisu (drabinka
 * CUP‑u i tabela ligi czytają stąd po `id`). Puste, dopóki nie wpiszesz
 * prawdziwych zgłoszeń, np.:
 *
 * 'iron-wolves': {
 *   id: 'iron-wolves', name: 'Iron Wolves',
 *   players: ['Sh4rk', 'Nomad', 'Ferox', 'Kailen', 'Drizzt'], substitute: 'Voss',
 * },
 */
export const teams: Record<string, Team> = {}

export const ROUND_LABELS = ['Runda 1', 'Ćwierćfinał', 'Półfinał', 'Finał']

/**
 * Drabinka czeka na zgłoszenia — same wolne miejsca w rundzie 1. Wpisz
 * prawdziwe id drużyny (klucz z `teams` powyżej) w `teamA`/`teamB`, gdy
 * zgłoszenie wpłynie. Rundy 2+ startują bez uczestników — wypełnią się
 * zwycięzcami, gdy turniej ruszy.
 */
export const bracket: Match[][] = [
  [
    { id: 'r1-m1', teamA: null, teamB: null },
    { id: 'r1-m2', teamA: null, teamB: null },
    { id: 'r1-m3', teamA: null, teamB: null },
    { id: 'r1-m4', teamA: null, teamB: null },
    { id: 'r1-m5', teamA: null, teamB: null },
    { id: 'r1-m6', teamA: null, teamB: null },
    { id: 'r1-m7', teamA: null, teamB: null },
    { id: 'r1-m8', teamA: null, teamB: null },
  ],
  [
    { id: 'r2-m1', teamA: null, teamB: null },
    { id: 'r2-m2', teamA: null, teamB: null },
    { id: 'r2-m3', teamA: null, teamB: null },
    { id: 'r2-m4', teamA: null, teamB: null },
  ],
  [
    { id: 'r3-m1', teamA: null, teamB: null },
    { id: 'r3-m2', teamA: null, teamB: null },
  ],
  [{ id: 'r4-m1', teamA: null, teamB: null }],
]
