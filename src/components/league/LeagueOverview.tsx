import { league } from '../../data/league'

const RULES = [
  { label: 'Sezon', text: `${league.weeksCount} kolejek, jeden mecz tygodniowo` },
  { label: 'Format meczu', text: 'BO1, playoff BO3' },
  {
    label: 'Punktacja',
    text: 'wygrana 3 pkt, wygrana po dogrywce 2 pkt, przegrana po dogrywce 1 pkt, przegrana 0 pkt',
  },
  { label: 'Playoff', text: `${league.playoffSpots} najlepsze drużyny po fazie zasadniczej` },
  {
    label: 'Terminy',
    text: 'kolejka rozgrywana w wyznaczonym tygodniu, godzinę ustalają kapitanowie',
  },
  { label: 'Nieobecność', text: 'brak stawienia się to walkower i −1 pkt' },
]

/** Nagłówek + opis + zasady ligi. Treść: entryzone-tresci.md, sekcja „LEAGUE — opis ligi”. */
export function LeagueOverview() {
  return (
    <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">Entryzone League</h1>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-copper">
            Sezon {league.seasonNumber} — {league.startMonthLabel}–{league.endMonthLabel}
          </p>
        </div>

        <div className="flex flex-col gap-6 text-lg leading-loose text-text/70 sm:text-xl">
          <p>
            Liga to coś innego niż CUP. Tam jedna porażka kończy turniej —
            tutaj masz cały sezon, żeby udowodnić, że jesteś najlepszy. Gramy
            w systemie kolejkowym: co tydzień jeden mecz, punkty do tabeli,
            na koniec sezonu playoff dla czołówki.
          </p>
          <p>
            To format dla drużyn, które chcą grać regularnie, a nie raz na
            miesiąc.
          </p>
        </div>

        <ul className="flex w-full flex-col divide-y divide-border text-left">
          {RULES.map((item) => (
            <li key={item.label} className="flex gap-4 py-4 sm:gap-6">
              <span className="font-display w-28 shrink-0 text-sm uppercase tracking-[0.1em] text-copper sm:w-32">
                {item.label}
              </span>
              <span className="text-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
