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

  // Każdy slot to osobne pudełko: puste ma ramkę copper, z drużyną — złotą
  // z delikatną poświatą. Finał dostaje złotą ramkę także przy pustych slotach.
  const box = 'flex flex-1 items-center rounded-sm border bg-surface px-3 text-sm'
  const glow = isFinal ? 'shadow-[0_0_14px_0] shadow-gold/20' : 'shadow-[0_0_12px_0] shadow-gold/15'
  const emptyBorder = isFinal ? 'border-gold/60' : 'border-copper/40'

  // Do czasu odpowiedzi API nie wiemy, czy miejsce jest wolne — pokazujemy
  // neutralny pasek zamiast fałszywego "wolne miejsce".
  if (loading) {
    return (
      <div className={`${box} ${emptyBorder}`} aria-hidden="true">
        <span className="h-2 w-24 animate-pulse rounded-full bg-text/10" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className={`${box} ${emptyBorder} ${isWalkover ? 'text-copper' : 'text-text/40'}`}>
        {isWalkover ? 'walkower' : isRegistrationRound ? 'wolne miejsce' : 'TBD'}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(team.id)}
      className={`${box} justify-between gap-2 text-left transition-colors duration-150 ${
        state === 'loser'
          ? 'border-copper/40 text-text/50 hover:border-gold/60 hover:text-gold-lite'
          : `border-gold/60 ${glow} hover:border-gold hover:text-gold-lite ${
              state === 'winner' ? 'text-gold' : 'text-text'
            }`
      }`}
    >
      <span className="truncate">{team.name}</span>
      {score !== undefined && (
        <span
          className={`font-display shrink-0 text-xs ${state === 'winner' ? 'text-gold' : 'text-text/50'}`}
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
      {caption && (
        <span className="font-display absolute -top-[18px] left-0 text-[10px] uppercase tracking-[0.15em] text-copper">
          {caption}
        </span>
      )}
      <div className="flex h-full flex-col gap-1">
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
