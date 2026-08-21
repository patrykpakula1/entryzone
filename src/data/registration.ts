export type RegistrationStatus = 'open' | 'closed' | 'none'

/**
 * Termin zamknięcia zapisów — jedyne miejsce, w którym się go zmienia.
 * Odliczanie w sekcji CTA i etykiety daty/godziny na stronie zapisów czytają
 * z tego samego obiektu, więc nie mogą się rozjechać.
 */
const closeAt = new Date('2026-09-14T20:00:00')

/**
 * Jedno miejsce do przełączania stanu sekcji zapisów — zmień tylko `status`.
 * Reszta pól karmi wszystkie trzy stany naraz, więc nieużywane w danym
 * stanie po prostu nie trafiają na ekran.
 */
export const registration = {
  status: 'open' as RegistrationStatus,

  teamsRegistered: 7,
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

  startDate: '20 września',
  startTime: '18:00',

  formUrl: '#',
  discordUrl: '#',
}
