import { registration } from '../../data/registration'

const buttonBase =
  'font-display inline-flex items-center justify-center rounded-full px-10 py-4 text-sm uppercase tracking-[0.2em] transition-colors duration-200 sm:text-base'

const statLabel = 'text-xs uppercase tracking-[0.25em] text-text/50'
const statCard = 'rounded-2xl border border-border bg-surface px-6 py-5 text-left'

export function Registration() {
  const { status } = registration
  const progress = Math.min(
    100,
    Math.round((registration.teamsRegistered / registration.teamsMax) * 100),
  )

  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        {status === 'open' && (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-copper">
                Entryzone Cup #1
              </p>
              <h2 className="mt-2 text-4xl text-text sm:text-5xl">
                Zapisy otwarte
              </h2>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2">
              <div className={statCard}>
                <p className={statLabel}>Zamykamy zapisy</p>
                <p className="mt-2 font-display text-2xl text-gold sm:text-3xl">
                  {registration.closeDateLabel} · {registration.closeTimeLabel}
                </p>
                <p className="mt-1 text-xs text-text/40">
                  albo wcześniej, jeśli wypełnimy drabinkę
                </p>
              </div>

              <div className={statCard}>
                <p className={statLabel}>Zapisanych drużyn</p>
                <p className="mt-2 font-display text-3xl text-gold sm:text-4xl">
                  {registration.teamsRegistered}
                  <span className="text-text/40">
                    {' '}
                    / {registration.teamsMax}
                  </span>
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <a
                href={registration.formUrl}
                target="_blank"
                rel="noreferrer"
                className={`${buttonBase} bg-gold text-bg hover:bg-gold-lite`}
              >
                Zgłoś drużynę
              </a>
              <p className="max-w-sm text-sm text-text/50">
                Potrzebujesz nicków całego składu i linków do profili Steam.
                Zajmie Ci to 3 minuty.
              </p>
            </div>
          </>
        )}

        {status === 'closed' && (
          <>
            <h2 className="text-4xl text-text sm:text-5xl">
              Zapisy zamknięte
            </h2>

            <div className={`${statCard} w-full sm:max-w-sm sm:text-center`}>
              <p className={statLabel}>Start turnieju</p>
              <p className="mt-2 font-display text-2xl text-gold sm:text-3xl">
                {registration.startDate} · {registration.startTime}
              </p>
              <p className="mt-1 text-xs text-text/40">komplet drużyn</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span
                aria-disabled="true"
                className={`${buttonBase} cursor-not-allowed border border-border text-text/40`}
              >
                Zapisy zamknięte
              </span>
              <p className="max-w-sm text-sm text-text/50">
                Wejdź na{' '}
                <a
                  href={registration.discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-lite underline-offset-4 hover:underline"
                >
                  Discorda
                </a>{' '}
                — tam ogłaszamy terminarz i kolejne edycje.
              </p>
            </div>
          </>
        )}

        {status === 'none' && (
          <>
            <h2 className="text-4xl text-text sm:text-5xl">
              Następny cup wkrótce
            </h2>
            <p className="max-w-sm text-text/60">
              Terminy ogłaszamy najpierw na Discordzie. Wejdź, żeby nie
              przegapić zapisów.
            </p>
            <a
              href={registration.discordUrl}
              target="_blank"
              rel="noreferrer"
              className={`${buttonBase} bg-gold text-bg hover:bg-gold-lite`}
            >
              Dołącz na Discorda
            </a>
          </>
        )}
      </div>
    </section>
  )
}
