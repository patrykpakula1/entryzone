import { Link } from 'react-router-dom'
import { registration } from '../../data/registration'
import { useTeamsRegistered } from '../../hooks/useTeamsRegistered'
import { BracketBackground } from './BracketBackground'
import { Countdown } from './Countdown'

/**
 * Sekcja pod hero: zapowiedź CUP‑u #1. Scenografia drabinki w tle,
 * odliczanie i CTA na środku — mieszczą się na jednym ekranie.
 */
export function CupTeaser() {
  const teamsRegistered = useTeamsRegistered()
  const progress =
    teamsRegistered === null
      ? 0
      : Math.min(100, Math.round((teamsRegistered / registration.teamsMax) * 100))

  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-bg px-6 py-10 sm:py-14">
      <BracketBackground />

      <div className="relative z-10 flex flex-col items-center gap-7 text-center sm:gap-8">
        <div className="flex flex-col items-center gap-5 sm:gap-7">
          <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-text sm:text-3xl">
            Entryzone Cup #1
          </h2>

          <p className="font-display text-3xl uppercase tracking-[0.2em] text-gold sm:text-4xl">
            {registration.startDate} 2026
          </p>

          <div className="flex flex-col items-center gap-2">
            <Countdown target={registration.closeAt} />
            <p className="text-xs uppercase tracking-[0.15em] text-text/40">
              Do zamknięcia zapisów ({registration.closeDateLabel}, {registration.closeTimeLabel})
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
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

          <div className="flex flex-col items-center gap-2">
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
      </div>
    </section>
  )
}
