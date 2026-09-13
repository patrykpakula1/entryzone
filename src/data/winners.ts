export type WinnerEntry = {
  id: string
  tournamentName: string
  dateLabel: string
  championTeam: string
  mvpNick: string
  mvpFrags: number
  mvpMaps: number
}

/**
 * Zwycięzcy turniejów i sezonów — jedno miejsce do uzupełnienia po każdej
 * edycji. Dodanie wpisu po turnieju to dopisanie jednego obiektu do tej
 * tablicy, np.:
 *
 * { id: 'cup-1', tournamentName: 'EntryZone Cup #1', dateLabel: 'październik 2026',
 *   championTeam: 'Iron Wolves', mvpNick: 'Sh4rk', mvpFrags: 112, mvpMaps: 5 }
 */
export const winners: WinnerEntry[] = []
