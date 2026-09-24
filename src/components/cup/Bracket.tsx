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

        {/* Karty mają stałą szerokość — na telefonie drabinka przewija się poziomo
            w swoim kontenerze zamiast się ściskać. */}
        <div className="w-full overflow-x-auto pb-2">
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
                  stroke="var(--color-gold)"
                  strokeOpacity={0.35}
                  shapeRendering="crispEdges"
                  strokeWidth={1}
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
