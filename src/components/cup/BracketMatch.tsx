import type { CSSProperties } from 'react'
import { matchCaption, type Match, type RosterTeam, type Slot } from '../../data/bracket'

type RowState = 'winner' | 'loser' | 'neutral'

function TeamRow({
  slot,
  teams,
  score,
  state,
  loading,
  isRegistrationRound,
  isWalkover,
  onSelect,
}: {
  slot: Slot
  teams: Record<string, RosterTeam>
  score?: number
  state: RowState
  loading: boolean
  isRegistrationRound: boolean
  isWalkover: boolean
  onSelect: (teamId: string) => void
}) {
  const team = slot ? teams[slot] : null

  // Do czasu odpowiedzi API nie wiemy, czy miejsce jest wolne — pokazujemy
  // neutralny pasek zamiast fałszywego "wolne miejsce".
  if (loading) {
    return (
      <div className="flex flex-1 items-center px-3" aria-hidden="true">
        <span className="h-2 w-24 animate-pulse rounded-full bg-text/10" />
      </div>
    )
  }

  if (!team) {
    return (
      <div
        className={`flex flex-1 items-center px-3 text-sm italic ${
          isWalkover ? 'text-copper' : 'text-text/60'
        }`}
      >
        {isWalkover ? 'walkower' : isRegistrationRound ? 'wolne miejsce' : 'TBD'}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(team.id)}
      className={`flex flex-1 items-center justify-between gap-2 border px-3 text-left text-sm transition-colors duration-150 ${
        state === 'winner'
          ? 'border-gold text-text'
          : state === 'loser'
            ? 'border-transparent text-text/35'
            : 'border-transparent text-text/80 hover:text-gold-lite'
      }`}
    >
      <span className="truncate">{team.name}</span>
      {score !== undefined && (
        <span className="font-display shrink-0 text-xs text-text/50">
          {score}
        </span>
      )}
    </button>
  )
}

export function BracketMatch({
  match,
  round,
  position,
  teams,
  loading,
  walkoversPossible,
  style,
  onSelectTeam,
}: {
  match: Match
  round: number
  position: number
  teams: Record<string, RosterTeam>
  loading: boolean
  /** W fazie zapisów puste miejsce to "wolne miejsce", nie walkower. */
  walkoversPossible: boolean
  style: CSSProperties
  onSelectTeam: (teamId: string) => void
}) {
  const { result } = match
  const isEmpty = !match.teamA && !match.teamB
  const isRegistrationRound = round === 0
  const isWalkover =
    walkoversPossible &&
    isRegistrationRound &&
    !result &&
    Boolean(match.teamA) !== Boolean(match.teamB)
  const caption = result ? null : matchCaption(round, position, match.scheduledAt)

  const rowProps = { teams, loading, isRegistrationRound, isWalkover, onSelect: onSelectTeam }

  return (
    <div style={style} className="relative">
      {/* Podpis leży nad kartą i nie zajmuje miejsca, więc nie rusza układu. */}
      {caption && (
        <span className="font-display absolute -top-[18px] left-0 text-[10px] uppercase tracking-[0.15em] text-copper">
          {caption}
        </span>
      )}
      <div
        className={`flex h-full flex-col divide-y divide-text/20 overflow-hidden rounded-sm border bg-surface ${
          isEmpty ? 'border-text/20' : 'border-text/30'
        }`}
      >
        <TeamRow
          slot={match.teamA}
          score={result?.scoreA}
          state={
            isWalkover && match.teamA
              ? 'winner'
              : !result
                ? 'neutral'
                : result.winner === 'A'
                  ? 'winner'
                  : 'loser'
          }
          {...rowProps}
        />
        <TeamRow
          slot={match.teamB}
          score={result?.scoreB}
          state={
            isWalkover && match.teamB
              ? 'winner'
              : !result
                ? 'neutral'
                : result.winner === 'B'
                  ? 'winner'
                  : 'loser'
          }
          {...rowProps}
        />
      </div>
    </div>
  )
}
