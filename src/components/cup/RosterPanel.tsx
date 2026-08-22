import { useEffect } from 'react'
import type { Team } from '../../data/bracket'

/** Panel składu drużyny — otwierany klikiem w kartę meczu, zamykany Escape lub klikiem obok. */
export function RosterPanel({
  team,
  onClose,
}: {
  team: Team | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!team) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [team, onClose])

  if (!team) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={team.name}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-sm border border-border bg-surface p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl uppercase tracking-[0.15em] text-text sm:text-2xl">
            {team.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="shrink-0 text-text/40 transition-colors duration-150 hover:text-gold-lite"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <ul className="mt-6 flex flex-col divide-y divide-border">
          {team.players.map((nick, i) => (
            <li key={nick} className="flex items-center gap-4 py-3">
              <span className="font-display text-xs text-copper">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-text">{nick}</span>
            </li>
          ))}
          {team.substitute && (
            <li className="flex items-center gap-4 py-3">
              <span className="font-display shrink-0 text-xs uppercase tracking-[0.15em] text-text/40">
                Rezerwa
              </span>
              <span className="text-text/70">{team.substitute}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
