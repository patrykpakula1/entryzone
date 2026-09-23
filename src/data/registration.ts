export type RegistrationStatus = 'open' | 'closed' | 'none'

/**
 * Termin zamknięcia zapisów — jedyne miejsce, w którym się go zmienia.
 * Odliczanie w sekcji CTA i etykiety daty/godziny na stronie zapisów czytają
 * z tego samego obiektu, więc nie mogą się rozjechać.
 */
const closeAt = new Date('2026-11-14T13:30:00')

/**
 * Jedno miejsce do przełączania stanu sekcji zapisów — zmień tylko `status`.
 * Reszta pól karmi wszystkie trzy stany naraz, więc nieużywane w danym
 * stanie po prostu nie trafiają na ekran.
 */
export const registration = {
  status: 'open' as RegistrationStatus,

  // Zapisy idą wyłącznie przez FACEIT (FACEIT nie pozwala zbierać ich poza
  // platformą), więc liczby zgłoszonych drużyn nie da się pobrać
  // automatycznie — wpisujemy ją tu ręcznie, patrząc na stronę turnieju.
  teamsRegistered: 0,
  teamsMax: 16,

  closeAt,
  closeDateLabel: closeAt.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
  }),
  closeTimeLabel: closeAt.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  }),

  // Turniej trwa dwa dni — pełny harmonogram (soboty i niedzieli) jest w
  // formacie CUP-u (CupOverview). Te dwa pola karmią krótkie wzmianki daty
  // gdzie indziej (np. "Graj {startDate}") i startTime to godzina pierwszego
  // meczu w sobotę.
  startDate: '14–15 listopada',
  startTime: '14:00',

  faceitUrl:
    'https://www.faceit.com/pl/championship/4c962c5e-7481-4fd2-ae32-007a47e79455/FIRST%2520ENTRYZONE%2520CUP',
  discordUrl: 'https://discord.gg/EGwYTYpjXR',
}
