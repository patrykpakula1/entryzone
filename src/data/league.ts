export type LeagueStanding = {
  teamId: string
  played: number
  wins: number
  losses: number
  roundDiff: number
  points: number
}

/**
 * Sezon i format — jedyne miejsce do zmiany, gdy ruszy prawdziwa liga.
 * Nagłówek i lista zasad na /league czytają z tego samego obiektu.
 */
export const league = {
  seasonNumber: 1,
  startMonthLabel: 'październik',
  endMonthLabel: 'grudzień',
  weeksCount: 8,
  playoffSpots: 4,
}

/**
 * Przykładowa tabela — 7 drużyn z data/bracket.ts, runda zasadnicza
 * po 6 kolejkach (każdy z każdym). Do podmiany na realny wynik sezonu.
 */
export const standings: LeagueStanding[] = [
  { teamId: 'sowa-squad', played: 6, wins: 5, losses: 1, roundDiff: 42, points: 15 },
  { teamId: 'iron-wolves', played: 6, wins: 5, losses: 1, roundDiff: 21, points: 14 },
  { teamId: 'czerwona-flaga', played: 6, wins: 4, losses: 2, roundDiff: 18, points: 12 },
  { teamId: 'brzask', played: 6, wins: 4, losses: 2, roundDiff: 9, points: 11 },
  { teamId: 'kuznia', played: 6, wins: 3, losses: 3, roundDiff: -4, points: 9 },
  { teamId: 'nocna-straz', played: 6, wins: 2, losses: 4, roundDiff: -19, points: 7 },
  { teamId: 'veles-gaming', played: 6, wins: 1, losses: 5, roundDiff: -38, points: 4 },
]
