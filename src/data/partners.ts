export type Partner = {
  name: string
  logo: string
  url: string
}

/**
 * Partnerzy pokazywani w sekcji Partnerzy na stronie głównej. Pusta tablica
 * = stan pusty (patrz components/home/Partners.tsx). Dodanie partnera to
 * jeden rekord z logiem w /public.
 */
export const partners: Partner[] = []
