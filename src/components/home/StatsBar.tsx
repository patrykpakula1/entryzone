import { stats } from '../../data/stats'

const ITEMS = [
  { value: stats.teamsRegistered, label: 'Zgłoszone drużyny' },
  { value: stats.matchesPlayed, label: 'Rozegrane mecze' },
  { value: `${stats.prizePoolPaid} zł`, label: 'Wypłacona pula nagród' },
]

/**
 * Wąski pasek statystyk pod hero. Liczby z data/stats.ts — aktualizowane
 * ręcznie po turnieju, nie liczone automatycznie z niczego.
 *
 * Celowo niepodpięty w Home.tsx do czasu pierwszego turnieju — na same
 * zera nie ma się czym pochwalić. Gotowy do włączenia jednym importem.
 */
export function StatsBar() {
  return (
    <section className="border-y border-border bg-surface px-6 py-6 sm:py-8">
      <div className="mx-auto grid max-w-2xl grid-cols-3 divide-x divide-border text-center">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1 px-2">
            <span className="font-display text-2xl text-gold sm:text-3xl">
              {item.value}
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.15em] text-text/50 sm:text-xs">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
