import { useEffect, useState } from 'react'
import type { RosterTeam } from '../../data/bracket'

const FULL_ROSTER = 5

/** Avatar z FACEIT o stałym rozmiarze; bez obrazka (albo gdy się nie wczyta) — inicjał. */
function Avatar({ src, name, className }: { src: string | null; name: string; className: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <span
      className={`font-display flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg text-xs text-text/50 ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </span>
  )
}

/**
 * Ikona poziomu FACEIT 1–10: własna pieczęć z numerem (nie grafika FACEIT).
 * Złoto tylko dla poziomu 10, reszta w ciepłej bieli.
 */
function LevelBadge({ level }: { level: number | null }) {
  const top = level === 10
  return (
    <span
      role="img"
      aria-label={level ? `Poziom FACEIT ${level}` : 'Brak poziomu FACEIT'}
      className={`font-display flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
        top ? 'border-gold text-gold' : level ? 'border-text/40 text-text' : 'border-border text-text/30'
      }`}
    >
      {level ?? '—'}
    </span>
  )
}

/** Panel składu drużyny — otwierany klikiem w kartę meczu, zamykany Escape lub klikiem obok. */
export function RosterPanel({
  team,
  onClose,
}: {
  team: RosterTeam | null
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
        className="max-h-[calc(100dvh-3rem)] w-full max-w-sm overflow-y-auto rounded-sm border border-border bg-surface p-6 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar src={team.avatar} name={team.name} className="h-12 w-12 text-base" />
            <div className="min-w-0">
              <h3 className="font-display break-words text-xl uppercase tracking-[0.15em] text-text sm:text-2xl">
                {team.name}
              </h3>
              {team.avgElo !== null && (
                <p className="mt-1 text-sm text-text/50">
                  Średnie ELO <span className="text-text">{team.avgElo}</span>
                </p>
              )}
            </div>
          </div>
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
          {team.players.map((player, i) => (
            <li key={`${player.nickname}-${i}`} className="flex items-center gap-3 py-3">
              <Avatar src={player.avatar} name={player.nickname} className="h-8 w-8" />
              <span className="min-w-0 flex-1 truncate text-text">{player.nickname}</span>
              <LevelBadge level={player.level} />
              <span className="font-display w-12 shrink-0 text-right text-xs text-text/60">
                {player.elo ?? '—'}
              </span>
            </li>
          ))}
        </ul>

        {team.players.length < FULL_ROSTER && (
          <p className="mt-4 text-sm italic text-text/40">skład niepełny</p>
        )}
      </div>
    </div>
  )
}
