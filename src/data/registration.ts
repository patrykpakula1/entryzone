export type RegistrationStatus = 'open' | 'closed' | 'none'

/**
 * Termin zamknięcia zapisów — jedyne miejsce, w którym się go zmienia.
 * Odliczanie w sekcji CTA i etykiety daty/godziny na stronie zapisów czytają
 * z tego samego obiektu, więc nie mogą się rozjechać.
 */
const closeAt = new Date('2026-11-08T20:00:00')

/**
 * Jedno miejsce do przełączania stanu sekcji zapisów — zmień tylko `status`.
 * Reszta pól karmi wszystkie trzy stany naraz, więc nieużywane w danym
 * stanie po prostu nie trafiają na ekran.
 */
export const registration = {
  status: 'open' as RegistrationStatus,

  // Liczba zgłoszonych drużyn NIE jest tu wpisywana ręcznie — czyta ją
  // useTeamsRegistered() z arkusza odpowiedzi formularza (opublikowanego
  // jako CSV pod adresem niżej) i liczy wiersze. Ten URL to jedyne miejsce
  // do zmiany, gdyby arkusz się przeniósł.
  responsesCsvUrl:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSFEi46fK4sHSLuMRZw_IWmsm3BJ-VMusPgvZHtvBOVnUuLzKmlyS3-SlvnR5RfHvbd5P0vl1_5_8rz/pub?output=csv',
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

  formUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSd1pCLSYh6cIRv3Yc3B8-ozbYzaEZkQ5l5RHkm_YVPrOM5Suw/viewform',
  discordUrl: 'https://discord.gg/EGwYTYpjXR',
}
