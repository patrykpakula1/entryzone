import { Link } from 'react-router-dom'
import { registration } from '../../data/registration'
import { BracketBackground } from './BracketBackground'
import { Countdown } from './Countdown'

const STEPS = [
  { n: '01', text: 'Zgłoś skład' },
  { n: '02', text: 'Dołącz na Discorda' },
  { n: '03', text: `Graj ${registration.startDate}` },
]

/**
 * Sekcja pod hero: zapowiedź CUP‑u #1. Trzy warstwy jedna na drugiej —
 * scenografia drabinki w tle, odliczanie i CTA na środku, trzy kroki
 * zgłoszenia na dole — mieszczą się na jednym ekranie.
 */
export function CupTeaser() {
  const progress = Math.min(
    100,
    Math.round((registration.teamsRegistered / registration.teamsMax) * 100),
  )

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16 sm:py-20">
      <BracketBackground />

      <div className="relative z-10 flex flex-col items-center gap-10 text-center sm:gap-12">
        <div className="flex flex-col items-center gap-8 sm:gap-10">
          <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-text sm:text-3xl">
            Entryzone Cup #1
          </h2>

          <Countdown target={registration.closeAt} />

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-gold">
                {registration.teamsRegistered}
              </span>
              <span className="text-text/40">/ {registration.teamsMax} drużyn</span>
            </div>
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-border sm:w-48">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link
              to="/zapisy"
              className="font-display inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-sm uppercase tracking-[0.2em] text-bg transition-colors duration-200 hover:bg-gold-lite sm:text-base"
            >
              Zapisz drużynę
            </Link>
            <Link
              to="/cup#regulamin"
              className="text-xs text-text/40 underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-gold-lite"
            >
              Zapoznaj się z regulaminem
            </Link>
          </div>
        </div>

        <div className="flex w-full max-w-2xl flex-col items-center gap-8 sm:gap-4">
          {/* Węzły + łącząca linia — tylko od sm w górę, żeby trzy kolumny
              miały gdzie oddychać. Na mobile zostaje sama pionowa lista. */}
          <div
            aria-hidden="true"
            className="hidden w-full grid-cols-3 items-center sm:relative sm:grid"
          >
            <span className="pointer-events-none absolute inset-x-[16.6%] top-1/2 h-px -translate-y-1/2 bg-gold/50" />
            {STEPS.map((step) => (
              <span
                key={step.n}
                className="relative z-10 mx-auto h-2 w-2 rounded-full bg-gold"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-gold sm:hidden"
                />
                <span className="font-display text-xs tracking-[0.2em] text-copper">
                  {step.n}
                </span>
                <p className="max-w-[12rem] text-sm text-text sm:text-base">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
