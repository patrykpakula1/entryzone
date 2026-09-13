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
 * Tabela sezonu — puste dopóki nie rozegramy pierwszej kolejki. Wpisz wiersz
 * na drużynę (teamId to klucz z `teams` w data/bracket.ts) i LeagueTable
 * sama przełączy się z pustego stanu na ranking.
 */
export const standings: LeagueStanding[] = []
