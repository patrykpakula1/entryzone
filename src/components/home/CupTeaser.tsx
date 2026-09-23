import { Link } from 'react-router-dom'
import { registration } from '../../data/registration'
import { useTeamsRegistered } from '../../hooks/useTeamsRegistered'
import { BracketBackground } from './BracketBackground'
import { Countdown } from './Countdown'

const STEPS = [
  { n: '01', text: 'Zapisz skład na FACEIT' },
  { n: '02', text: 'Dołącz na Discorda' },
  { n: '03', text: `Graj ${registration.startDate}` },
]

/**
 * Sekcja pod hero: zapowiedź CUP‑u #1. Trzy warstwy jedna na drugiej —
 * scenografia drabinki w tle, odliczanie i CTA na środku, trzy kroki
 * zgłoszenia na dole. Wysokość dopasowana do treści (bez min-h-svh) —
 * dzięki temu sekcja Partnerzy zaczyna się zaraz po krokach zgłoszenia,
 * bez pustego marginesu z wyśrodkowania w pełnym ekranie.
 */
export function CupTeaser() {
  const teamsRegistered = useTeamsRegistered()
  const progress =
    teamsRegistered === null
      ? 0
      : Math.min(100, Math.round((teamsRegistered / registration.teamsMax) * 100))

  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-bg px-6 pt-20 pb-6 sm:pt-24 sm:pb-8">
      <BracketBackground />

      <div className="relative z-10 flex flex-col items-center gap-10 text-center sm:gap-12">
        <div className="flex flex-col items-center gap-8 sm:gap-10">
          <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-text sm:text-3xl">
            Entryzone Cup #1
          </h2>

          <p className="font-display text-xl uppercase tracking-[0.2em] text-gold sm:text-2xl">
            {registration.startDate} 2026
          </p>

          <div className="flex flex-col items-center gap-2">
            <Countdown target={registration.closeAt} />
            <p className="text-xs uppercase tracking-[0.15em] text-text/40">
              Do zamknięcia zapisów ({registration.closeDateLabel}, {registration.closeTimeLabel})
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-gold">
                {teamsRegistered === null ? (
                  <span className="animate-pulse">—</span>
                ) : (
                  teamsRegistered
                )}
              </span>
              <span className="text-text/40">/ {registration.teamsMax} drużyn</span>
            </div>
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-border sm:w-48">
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-500"
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
              className="-my-3 inline-block py-3 text-xs text-text/40 underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-gold-lite"
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
