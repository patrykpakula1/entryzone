import { registration } from './registration'
import { prizes } from './prizes'

export type NewsEntry = {
  slug: string
  title: string
  /** ISO yyyy-mm-dd — data publikacji, używana też do sortowania. */
  date: string
  /** Jedno-dwa zdania — wstęp na liście i w sekcji „Najnowsze” na stronie głównej. */
  excerpt: string
  /** Pełna treść wpisu, jeden string na akapit. */
  body: string[]
}

/**
 * Wpisy aktualności — najnowszy na górze albo w dowolnej kolejności, strony
 * i sekcje same sortują po `date`. Dodanie nowego wpisu to dopisanie
 * obiektu do tej tablicy, bez ruszania kodu. `slug` trafia do adresu
 * /aktualnosci/{slug} — małe litery, myślniki, bez polskich znaków.
 */
export const news: NewsEntry[] = [
  {
    slug: 'ruszaja-zapisy-na-entryzone-cup-1',
    title: 'Ruszają zapisy na EntryZone Cup #1',
    date: '2026-09-18',
    excerpt: `Pierwszy turniej EntryZone startuje ${registration.startDate} — 16 drużyn, bez limitu rangi, pula nagród ${prizes.poolTotal} zł.`,
    body: [
      'Zapisy na EntryZone Cup #1 są już otwarte. To pierwszy turniej naszej organizacji — otwarty puchar CS2 dla 16 drużyn, bez limitu rangi.',
      `Turniej odbędzie się ${registration.startDate} 2026. Format: pojedyncza drabinka eliminacyjna, mecze do jednej mapy, wielki finał do dwóch wygranych map. Pula nagród wynosi ${prizes.poolTotal} zł.`,
      `Zapisy przyjmujemy do ${registration.closeDateLabel}, do godziny ${registration.closeTimeLabel}. Liczba miejsc jest ograniczona — im szybciej zgłosisz skład, tym pewniej zagracie.`,
      'Szczegóły formatu i regulamin znajdziesz na stronie CUP. Zapisz drużynę i dołącz do naszego Discorda, żeby być na bieżąco z terminarzem.',
    ],
  },
]
