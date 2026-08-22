import type { CSSProperties } from 'react'
import { teams, type Match, type Slot } from '../../data/bracket'

type RowState = 'winner' | 'loser' | 'neutral'

function TeamRow({
  slot,
  score,
  state,
  isRegistrationRound,
  isWalkover,
  onSelect,
}: {
  slot: Slot
  score?: number
  state: RowState
  isRegistrationRound: boolean
  isWalkover: boolean
  onSelect: (teamId: string) => void
}) {
  const team = slot ? teams[slot] : null

  if (!team) {
    return (
      <div
        className={`flex flex-1 items-center px-3 text-sm italic ${
          isWalkover ? 'text-copper' : 'text-text/20'
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
  style,
  onSelectTeam,
}: {
  match: Match
  round: number
  style: CSSProperties
  onSelectTeam: (teamId: string) => void
}) {
  const { result } = match
  const isEmpty = !match.teamA && !match.teamB
  const isRegistrationRound = round === 0
  const isWalkover =
    isRegistrationRound && !result && Boolean(match.teamA) !== Boolean(match.teamB)

  return (
    <div
      style={style}
      className={`flex flex-col divide-y divide-border overflow-hidden rounded-sm border bg-surface ${
        isEmpty ? 'border-border/30' : 'border-border'
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
        isRegistrationRound={isRegistrationRound}
        isWalkover={isWalkover}
        onSelect={onSelectTeam}
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
        isRegistrationRound={isRegistrationRound}
        isWalkover={isWalkover}
        onSelect={onSelectTeam}
      />
    </div>
  )
}
