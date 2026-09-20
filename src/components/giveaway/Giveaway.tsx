import giveaway from '../../data/giveaway.json'
import { registration } from '../../data/registration'

type PastWinner = { date: string; prize: string; winner: string }

const pastWinners: PastWinner[] = giveaway.pastWinners

function formatDate(iso: string, withTime: boolean) {
  const d = new Date(iso)
  const date = d.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  if (!withTime) return date
  const time = d.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${date}, ${time}`
}

/** Sekcja podstrony /giveaway. Treść do edycji w src/data/giveaway.json. */
export function Giveaway() {
  const { current, rules } = giveaway

  return (
    <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">Giveaway</h1>
          <p className="text-lg text-text/70 sm:text-xl">
            Co tydzień losujemy nagrodę wśród społeczności EntryZone.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-8 border border-border px-6 py-10 sm:px-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-copper">
              Nagroda
            </span>
            <span className="font-display text-3xl text-gold sm:text-4xl">
              {current.prize}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-copper">
              Losowanie
            </span>
            <span className="font-display text-xl text-text sm:text-2xl">
              {formatDate(current.drawDate, true)}
            </span>
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            <span className="text-xs uppercase tracking-[0.2em] text-copper">
              Jak wziąć udział
            </span>
            <ol className="flex flex-col gap-3 text-left text-text/80">
              {current.howToEnter.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display text-gold">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <a
          href={registration.discordUrl}
          target="_blank"
          rel="noreferrer"
          className="font-display inline-flex items-center justify-center rounded-full bg-gold px-12 py-5 text-base uppercase tracking-[0.2em] text-bg transition-colors duration-200 hover:bg-gold-lite sm:px-16 sm:text-lg"
        >
          Weź udział na Discordzie
        </a>

        <div className="flex w-full flex-col items-center gap-6">
          <h2 className="text-2xl text-text sm:text-3xl">Zasady</h2>
          <ul className="flex flex-col gap-3 text-left text-text/80">
            {rules.map((rule) => (
              <li key={rule} className="flex gap-4">
                <span aria-hidden="true" className="text-gold">
                  —
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col items-center gap-6">
          <h2 className="text-2xl text-text sm:text-3xl">
            Poprzedni zwycięzcy
          </h2>
          {pastWinners.length === 0 ? (
            <p className="text-text/70">
              Pierwsze losowanie jeszcze przed nami — zwycięzcy pojawią się tu
              po nim.
            </p>
          ) : (
            <ul className="flex w-full flex-col">
              {pastWinners.map((w) => (
                <li
                  key={`${w.date}-${w.winner}`}
                  className="flex flex-col gap-2 border-b border-border py-5 text-left last:border-b-0"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-display text-lg text-gold">
                      {w.winner}
                    </span>
                    <span className="text-sm text-text/50">
                      {formatDate(w.date, false)}
                    </span>
                  </div>
                  <span className="text-text/80">{w.prize}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
