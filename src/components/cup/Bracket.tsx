import { useMemo, useState } from 'react'
import { buildBracketView, ROUND_LABELS } from '../../data/bracket'
import { useBracket } from '../../hooks/useBracket'
import { useTournamentStats } from '../../hooks/useTournamentStats'
import {
  CONNECTORS,
  HEADER_HEIGHT,
  MATCH_HEIGHT,
  MATCH_WIDTH,
  POSITIONS,
  TOTAL_HEIGHT,
  TOTAL_WIDTH,
} from './bracketLayout'
import { BracketMatch } from './BracketMatch'
import { RosterPanel } from './RosterPanel'

/**
 * Drabinka CUP‑u: 16 drużyn, single elimination, pod opisem formatu w
 * CupOverview. Drużyny, pary i wyniki idą z FACEIT przez /api/bracket; gdy API
 * nie odpowie, rysujemy statyczną drabinkę z data/bracket.ts.
 */
export function Bracket() {
  const { loading, data } = useBracket()
  const stats = useTournamentStats()
  const view = useMemo(() => buildBracketView(data), [data])
  const rounds = view.rounds
  const walkoversPossible = view.phase !== 'registration'
  const [openTeamId, setOpenTeamId] = useState<string | null>(null)
  const [activeRound, setActiveRound] = useState(0)

  return (
    <section className="bg-bg px-6 pb-20 sm:pb-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 sm:gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="h-px w-12 bg-gold" />
          <h2 className="text-3xl text-text sm:text-4xl">Drabinka</h2>
          {/* Wysokość zarezerwowana od razu, żeby dopisek nie przesuwał drabinki. */}
          <p className="min-h-[3rem] max-w-md text-sm text-text/50 sm:min-h-[1.5rem]">
            {view.source === 'api' &&
              view.phase === 'registration' &&
              'Pary zostaną wylosowane przez FACEIT przy starcie turnieju, 14.11 o 14:00.'}
          </p>
        </div>

        {/* Mobile: pełna drabinka nie mieści się na ekranie bez przewijania
            w poziomie, więc poniżej md pokazujemy jedną rundę naraz przez
            zakładki, na pełną szerokość. Od md w górę wraca widok całości. */}
        <div className="w-full md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {ROUND_LABELS.map((label, r) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveRound(r)}
                aria-pressed={activeRound === r}
                className={`font-display rounded-full px-3 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors duration-150 ${
                  activeRound === r
                    ? 'bg-gold text-bg'
                    : 'border border-border text-text/60 hover:text-gold-lite'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-8">
            {rounds[activeRound].map((match, i) => (
              <BracketMatch
                key={match.id}
                match={match}
                round={activeRound}
                position={i}
                teams={view.teams}
                loading={loading}
                walkoversPossible={walkoversPossible}
                onSelectTeam={setOpenTeamId}
                style={{ position: 'relative', width: '100%', height: MATCH_HEIGHT }}
              />
            ))}
          </div>
        </div>

        <div className="hidden w-full overflow-x-auto pb-2 md:block">
          <div
            className="relative mx-auto"
            style={{ width: TOTAL_WIDTH, height: TOTAL_HEIGHT + HEADER_HEIGHT }}
          >
            {ROUND_LABELS.map((label, r) => (
              <span
                key={label}
                style={{
                  left: POSITIONS[r][0].x,
                  width: MATCH_WIDTH,
                }}
                className="font-display absolute top-0 text-center text-xs uppercase tracking-[0.2em] text-copper"
              >
                {label}
              </span>
            ))}

            <svg
              style={{ top: HEADER_HEIGHT, width: TOTAL_WIDTH, height: TOTAL_HEIGHT }}
              className="absolute left-0"
            >
              {CONNECTORS.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="var(--color-text)"
                  strokeOpacity={0.35}
                  strokeWidth={1.5}
                />
              ))}
            </svg>

            {rounds.map((round, r) =>
              round.map((match, i) => (
                <BracketMatch
                  key={match.id}
                  match={match}
                  round={r}
                  position={i}
                  teams={view.teams}
                  loading={loading}
                  walkoversPossible={walkoversPossible}
                  onSelectTeam={setOpenTeamId}
                  style={{
                    position: 'absolute',
                    left: POSITIONS[r][i].x,
                    top: POSITIONS[r][i].y + HEADER_HEIGHT,
                    width: MATCH_WIDTH,
                    height: MATCH_HEIGHT,
                  }}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <RosterPanel
        team={openTeamId ? (view.teams[openTeamId] ?? null) : null}
        stats={stats?.players}
        onClose={() => setOpenTeamId(null)}
      />
    </section>
  )
}
