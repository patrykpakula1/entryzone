import { winners, type WinnerEntry } from '../../data/winners'

function WinnerCard({ entry }: { entry: WinnerEntry }) {
  return (
    <li className="flex flex-col gap-3 border-b border-border py-6 text-left last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-display text-lg uppercase tracking-[0.15em] text-text">
          {entry.tournamentName}
        </span>
        <span className="text-sm text-text/50">{entry.dateLabel}</span>
      </div>
      <p className="text-text">
        <span aria-hidden="true">🏆</span> Zwycięzca:{' '}
        <span className="font-display text-gold">{entry.championTeam}</span>
      </p>
      <p className="text-text/80">
        <span aria-hidden="true">⭐</span> MVP:{' '}
        <span className="font-display text-text">{entry.mvpNick}</span> —{' '}
        {entry.mvpFrags} frag. w {entry.mvpMaps} mapach
      </p>
    </li>
  )
}

/** Puste miejsce czekające na wpis po pierwszym turnieju — rama, nie treść. */
function EmptyStateTemplate() {
  return (
    <li
      aria-hidden="true"
      className="flex w-full flex-col items-center gap-8 border border-border px-8 py-12 text-center"
    >
      <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
        <span className="font-display text-lg uppercase tracking-[0.15em] text-text/70">
          EntryZone Cup #1
        </span>
        <span className="text-sm text-text/40">październik 2026</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-copper">
          Zwycięzca
        </span>
        <span className="font-display text-6xl text-gold sm:text-7xl">?</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-copper">MVP</span>
        <span className="font-display text-3xl text-gold sm:text-4xl">?</span>
      </div>
    </li>
  )
}

/** Sekcja HALL OF FAME. Treść: entryzone-tresci.md, „WINNERS”. Pusty stan, dopóki `winners` jest puste. */
export function WinnersHallOfFame() {
  const isEmpty = winners.length === 0

  return (
    <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">Hall of Fame</h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg text-text/70 sm:text-xl">
              Każdy turniej. Każdy sezon. Każdy MVP i zwycięska drużyna.
            </p>
            <p className="font-display text-2xl text-gold sm:text-3xl">
              Zapiszesz się w historii EntryZone?
            </p>
          </div>
        </div>

        {isEmpty && (
          <p className="text-text/70">
            Pierwszy CUP jeszcze się nie odbył. Ta strona zapełni się po jego
            zakończeniu.
          </p>
        )}

        <ul className="flex w-full flex-col">
          {isEmpty
            ? <EmptyStateTemplate />
            : winners.map((entry) => <WinnerCard key={entry.id} entry={entry} />)}
        </ul>
      </div>
    </section>
  )
}
