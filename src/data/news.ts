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
  /** Opcjonalne linki na końcu wpisu. `to` zaczynające się od „/” to trasa wewnętrzna, reszta — adres zewnętrzny. */
  links?: { label: string; to: string }[]
}

/**
 * Wpisy aktualności — najnowszy na górze albo w dowolnej kolejności, strony
 * i sekcje same sortują po `date`. Dodanie nowego wpisu to dopisanie
 * obiektu do tej tablicy, bez ruszania kodu. `slug` trafia do adresu
 * /aktualnosci/{slug} — małe litery, myślniki, bez polskich znaków.
 */
export const news: NewsEntry[] = [
  {
    slug: 'startujemy-z-cotygodniowym-giveawayem',
    title: 'Startujemy z cotygodniowym giveawayem',
    date: '2026-09-20',
    excerpt: 'Co tydzień losujemy skina do CS2 wśród członków naszego serwera Discord.',
    body: [
      'EntryZone rusza z cotygodniowym losowaniem skinów dla społeczności. Bez wpisowego i bez żadnych zadań — wystarczy być na naszym serwerze Discord i kliknąć reakcję pod wpisem z losowaniem.',
      'Pierwszą nagrodą jest AK-47 | Redline (Field-Tested). Losowanie odbędzie się 30 września o 20:00, a zwycięzcę ogłosimy na Discordzie.',
      'Skina przekazujemy przez wymianę na Steamie. Jeśli chcesz mieć pewność, że wszystko pójdzie sprawnie, dodaj się wcześniej do znajomych z kontem organizatora — dzięki temu wymiana nie zatrzyma się na formalnościach.',
      'Szczegóły i zasady znajdziesz na stronie giveaway, a na serwer Discord wejdziesz z linku poniżej.',
    ],
    links: [
      { label: 'Giveaway — zasady i nagroda', to: '/giveaway' },
      { label: 'Dołącz do Discorda', to: registration.discordUrl },
    ],
  },
  {
    slug: 'ruszaja-zapisy-na-entryzone-cup-1',
    title: 'Ruszają zapisy na EntryZone Cup #1',
    date: '2026-09-18',
    excerpt: `Pierwszy turniej EntryZone startuje ${registration.startDate} — 16 drużyn, bez limitu rangi, pula nagród ${prizes.poolTotal} zł.`,
    body: [
      'Zapisy na EntryZone Cup #1 są już otwarte — wyłącznie przez FACEIT. To pierwszy turniej naszej organizacji: otwarty, bezpłatny puchar CS2 dla 16 drużyn, bez limitu rangi.',
      `Turniej odbędzie się ${registration.startDate} 2026. Format: pojedyncza drabinka eliminacyjna, mecze do jednej mapy, wielki finał do dwóch wygranych map. Pula nagród wynosi ${prizes.poolTotal} zł.`,
      `Zapisy przyjmujemy do ${registration.closeDateLabel}, do godziny ${registration.closeTimeLabel}. Liczba miejsc jest ograniczona — im szybciej zgłosisz skład, tym pewniej zagracie.`,
      'Szczegóły formatu i regulamin znajdziesz na stronie CUP. Zapisz drużynę i dołącz do naszego Discorda, żeby być na bieżąco z terminarzem.',
    ],
  },
]
