import type { CSSProperties } from 'react'
import { matchCaption, ROUND_LABELS, type Match, type RosterTeam, type Slot } from '../../data/bracket'

type RowState = 'winner' | 'loser' | 'neutral'

function TeamRow({
  slot,
  teams,
  score,
  state,
  loading,
  isRegistrationRound,
  isWalkover,
  isFinal,
  onSelect,
}: {
  slot: Slot
  teams: Record<string, RosterTeam>
  score?: number
  state: RowState
  loading: boolean
  isRegistrationRound: boolean
  isWalkover: boolean
  isFinal: boolean
  onSelect: (teamId: string) => void
}) {
  const team = slot ? teams[slot] : null

  // Drukowana drabinka: slot to jedna linijka tekstu na cienkiej linii bazowej,
  // bez ramek i tła. Złoto tylko w kropce przed nazwą i przy wyniku zwycięzcy.
  const line = 'flex flex-1 items-end justify-between gap-2 border-b border-border/60 pb-1.5'
  const size = isFinal ? 'text-base' : 'text-sm'

  // Do czasu odpowiedzi API nie wiemy, czy miejsce jest wolne — pokazujemy
  // neutralny pasek zamiast fałszywego "wolne miejsce".
  if (loading) {
    return (
      <div className={`${line} items-center`} aria-hidden="true">
        <span className="h-2 w-24 animate-pulse rounded-full bg-text/10" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className={`${line} text-xs ${isWalkover ? 'text-copper' : 'text-text/25'}`}>
        {isWalkover ? 'walkower' : isRegistrationRound ? 'wolne miejsce' : 'TBD'}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(team.id)}
      className={`${line} ${size} text-left transition-colors duration-150 hover:text-gold-lite ${
        state === 'loser' ? 'text-text/40' : state === 'winner' ? 'text-gold' : 'text-text'
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-1 w-1 shrink-0 rounded-full ${state === 'loser' ? 'bg-text/25' : 'bg-gold'}`}
        />
        <span className="truncate">{team.name}</span>
      </span>
      {score !== undefined && (
        <span
          className={`font-display shrink-0 text-xs tabular-nums ${
            state === 'winner' ? 'text-gold' : 'text-text/40'
          }`}
        >
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
  const isRegistrationRound = round === 0
  const isFinal = round === ROUND_LABELS.length - 1
  const isWalkover =
    walkoversPossible &&
    isRegistrationRound &&
    !result &&
    Boolean(match.teamA) !== Boolean(match.teamB)
  const caption = result ? null : matchCaption(round, position, match.scheduledAt)

  const rowProps = { teams, loading, isRegistrationRound, isWalkover, isFinal, onSelect: onSelectTeam }

  return (
    <div style={style} className="relative">
      {/* Podpis leży nad kartą i nie zajmuje miejsca, więc nie rusza układu. */}
      {isFinal && <span className="absolute -top-[26px] left-0 right-0 h-px bg-gold/50" />}
      {caption && (
        <span
          className={`font-display absolute -top-[18px] left-0 text-[10px] uppercase tracking-[0.15em] ${
            isFinal ? 'text-gold' : 'text-copper'
          }`}
        >
          {caption}
        </span>
      )}
      <div className="flex h-full flex-col">
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
