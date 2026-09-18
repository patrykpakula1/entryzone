/** Data w formacie „18 września 2026” — jedno miejsce formatowania dla treści wpisów. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
