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

  // Mecz to jedna karta (tło surface, ramka border); drużyny oddziela cienka
  // linia w środku. Złoto tylko przy zwycięzcy i jako kreska przy zapisanej drużynie.
  const row = 'relative flex flex-1 items-center justify-between gap-2 px-3.5 text-sm'

  // Do czasu odpowiedzi API nie wiemy, czy miejsce jest wolne — pokazujemy
  // neutralny pasek zamiast fałszywego "wolne miejsce".
  if (loading) {
    return (
      <div className={row} aria-hidden="true">
        <span className="h-2 w-24 animate-pulse rounded-full bg-text/10" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className={`${row} ${isWalkover ? 'text-copper' : 'text-text/30'}`}>
        {isWalkover ? 'walkower' : isRegistrationRound ? 'wolne miejsce' : 'TBD'}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(team.id)}
      className={`${row} text-left transition-colors duration-150 hover:text-gold-lite ${
        state === 'loser' ? 'text-text/40' : state === 'winner' ? 'text-gold' : 'text-text'
      }`}
    >
      {score === undefined && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 bg-gold"
        />
      )}
      <span className="truncate">{team.name}</span>
      {score !== undefined && (
        <span
          className={`shrink-0 tabular-nums ${state === 'winner' ? 'text-gold' : 'text-text/40'}`}
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

  const rowProps = { teams, loading, isRegistrationRound, isWalkover, onSelect: onSelectTeam }

  return (
    <div style={style} className="relative">
      {/* Podpis leży nad kartą i nie zajmuje miejsca, więc nie rusza układu. */}
      {caption && (
        <span
          className={`font-display absolute -top-[18px] left-0 text-[10px] uppercase tracking-[0.15em] ${
            isFinal ? 'text-gold' : 'text-copper'
          }`}
        >
          {caption}
        </span>
      )}
      <div className="relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-surface">
        {isFinal && <span className="absolute inset-x-0 top-0 h-0.5 bg-gold" />}
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
        <div className="mx-2.5 h-px bg-border" />
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
