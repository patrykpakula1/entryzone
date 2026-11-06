export type TournamentStatus = 'active' | 'cancelled'

/**
 * Jedno miejsce do przełączania stanu turnieju na całej stronie. `cancelled`
 * pokazuje komunikat o odwołaniu na stronie głównej, chowa CTA zapisów,
 * odliczanie, licznik drużyn, drabinkę, ranking MVP i FAQ turnieju, podmienia
 * terminy w regulaminie i O nas na neutralne treści oraz wyłącza zapytania do
 * FACEIT (hooki useTeamsRegistered, useBracket, useTournamentStats). Komponenty
 * i endpointy w api/ zostają — przy kolejnym cupie wystarczy wrócić do
 * `active` i zaktualizować dane w registration.ts.
 *
 * index.html (meta i Open Graph) jest statyczny i nie czyta tej flagi — jego
 * treść jest neutralna, więc pasuje do obu stanów.
 */
export const TOURNAMENT_STATUS: TournamentStatus = 'cancelled'

export const tournamentCancelled = TOURNAMENT_STATUS === 'cancelled'
