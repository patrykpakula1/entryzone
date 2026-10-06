export type Partner = {
  name: string
  /** Ścieżka do logo w /public. Bez logo sekcja pokazuje kartę tekstową z inicjałami. */
  logo?: string
  url?: string
  /** Krótka etykieta pod nazwą, np. „Partner EntryZone Cup #1”. */
  role?: string
  /** Czym zajmuje się partner, np. „Handel skinami CS2”. */
  tagline?: string
}

/**
 * Partnerzy pokazywani w sekcji Partnerzy na stronie głównej. Pusta tablica
 * = stan pusty (patrz components/home/Partners.tsx). Dodanie partnera to
 * jeden rekord; z logiem w /public pokaże się w siatce logotypów, bez logo
 * jako karta tekstowa. `role` zawierające „Cup #1” pokazuje też pasek
 * partnera na stronie CUP.
 */
export const partners: Partner[] = [
  {
    name: 'Jakub Kacprzak',
    role: 'Partner EntryZone Cup #1',
    tagline: 'Handel skinami CS2',
    url: 'https://www.facebook.com/jakub.kacprzak.90/',
    // TODO: dopisać logo, gdy będzie gotowe (logo: '/partners/...').
  },
]
