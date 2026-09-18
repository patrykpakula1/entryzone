export type Stats = {
  teamsRegistered: number
  matchesPlayed: number
  prizePoolPaid: number
}

/**
 * Statystyki w pasku pod hero na stronie głównej. Aktualizowane ręcznie po
 * każdym turnieju — w odróżnieniu od bieżącego licznika zapisów w sekcji CTA
 * (useTeamsRegistered, czyta z arkusza Google), te liczby nie są pobierane
 * automatycznie z niczego.
 */
export const stats: Stats = {
  teamsRegistered: 0,
  matchesPlayed: 0,
  prizePoolPaid: 0,
}
