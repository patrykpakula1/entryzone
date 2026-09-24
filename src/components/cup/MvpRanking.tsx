import { useTournamentStats, type PlayerStats } from '../../hooks/useTournamentStats'

const MIN_MAPS = 3

// Ten sam układ kolumn w nagłówku i wierszach (od md); poniżej md wiersz to karta.
const ROW_COLS =
  'grid-cols-[2rem_1fr] gap-x-4 md:grid-cols-[3rem_1.2fr_1fr_5rem_5rem_5rem] md:items-center md:gap-x-6'

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span className="flex flex-col md:block md:text-right">
      <span className="text-[10px] uppercase tracking-[0.15em] text-text/40 md:hidden">{label}</span>
      <span className={`font-display tabular-nums ${accent ? 'text-gold' : 'text-text'}`}>
        {value}
      </span>
    </span>
  )
}

function Row({ player, place }: { player: PlayerStats; place: number }) {
  const leader = place === 1
  return (
    <li
      className={`grid ${ROW_COLS} px-1 py-4 md:px-5 ${
        leader ? 'border-y border-gold/50 md:-mt-px' : 'border-b border-border/60'
      }`}
    >
      <span className="font-display tabular-nums text-lg text-copper md:text-base">{place}</span>

      <span className="min-w-0">
        <span className={`block truncate ${leader ? 'text-gold' : 'text-text'}`}>
          {player.nickname}
        </span>
        {/* Na telefonie drużyna schodzi pod nick; od md ma własną kolumnę. */}
        <span className="block truncate text-sm text-text/50 md:hidden">
          {player.teamName ?? '—'}
        </span>
        {leader && (
          <span className="mt-1 block text-xs text-text/50">
            prowadzi w wyścigu o GTA 6
          </span>
        )}
      </span>

      <span className="hidden truncate text-text/60 md:block">{player.teamName ?? '—'}</span>

      <span className="col-start-2 mt-3 flex gap-8 md:contents">
        <Stat label="ADR" value={player.adr.toFixed(1)} accent={leader} />
        <Stat label="K/D" value={player.kd.toFixed(2)} />
        <Stat label="Mapy" value={String(player.maps)} />
      </span>
    </li>
  )
}

/** Wyszarzony wiersz-zapowiedź: ten sam układ i wysokość co prawdziwy, same kreski. */
function PlaceholderRow() {
  return (
    <li
      aria-hidden="true"
      className={`grid ${ROW_COLS} border-b border-border/60 px-1 py-4 text-text/25 md:px-5`}
    >
      <span className="font-display text-lg md:text-base">—</span>
      <span className="min-w-0">
        <span className="block">—</span>
        <span className="block text-sm md:hidden">—</span>
      </span>
      <span className="hidden md:block">—</span>
      <span className="col-start-2 mt-3 flex gap-8 md:contents">
        {['ADR', 'K/D', 'Mapy'].map((label) => (
          <span key={label} className="flex flex-col md:block md:text-right">
            <span className="text-[10px] uppercase tracking-[0.15em] md:hidden">{label}</span>
            <span className="font-display">—</span>
          </span>
        ))}
      </span>
    </li>
  )
}

function TableHead() {
  return (
    <div
      className={`hidden md:grid ${ROW_COLS} border-b border-border/60 px-5 pb-3 text-[10px] uppercase tracking-[0.2em] text-copper`}
      aria-hidden="true"
    >
      <span>#</span>
      <span>Gracz</span>
      <span>Drużyna</span>
      <span className="text-right">ADR</span>
      <span className="text-right">K/D</span>
      <span className="text-right">Mapy</span>
    </div>
  )
}

/**
 * Ranking MVP pod drabinką na /cup. Do pierwszego zakończonego meczu ze
 * statystykami (a także w czasie ładowania i gdy API zawiedzie) sekcja jest
 * zapowiedzią: opis zasad i wyszarzona makieta tabeli o tej samej wysokości,
 * więc layout nie skacze. Potem działa jak prawdziwy ranking.
 */
export function MvpRanking() {
  const stats = useTournamentStats()
  const hasStats = stats !== null && stats.players.length > 0
  const mvpRanking = stats?.mvpRanking ?? []

  return (
    <section id="mvp" className="scroll-mt-24 bg-bg px-6 pb-20 sm:scroll-mt-32 sm:pb-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 sm:gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="h-px w-12 bg-gold" />
          <h2 className="text-3xl text-text sm:text-4xl">Ranking MVP</h2>
        </div>

        {!hasStats ? (
          <>
            <p className="max-w-md text-center text-text/60">
              Wyścig o GTA 6 startuje 14 listopada. Ranking liczy się na żywo ze statystyk
              FACEIT — średni ADR ze wszystkich map, minimum {MIN_MAPS} mapy, przy remisie decyduje
              K/D.
            </p>
            <div className="w-full">
              <TableHead />
              <ol className="flex flex-col">
                {[0, 1, 2].map((i) => (
                  <PlaceholderRow key={i} />
                ))}
              </ol>
            </div>
          </>
        ) : (
          <>
            {mvpRanking.length > 0 ? (
              <div className="w-full">
                <TableHead />
                <ol className="flex flex-col">
                  {mvpRanking.map((player, i) => (
                    <Row key={player.playerId} player={player} place={i + 1} />
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-center text-text/50">
                Ranking pojawi się, gdy pierwsi gracze rozegrają {MIN_MAPS} mapy.
              </p>
            )}

            <p className="max-w-md text-center text-sm text-text/40">
              W rankingu są gracze z co najmniej {MIN_MAPS} rozegranymi mapami, wg średniego ADR;
              przy remisie decyduje wyższe K/D. Statystyki pochodzą z FACEIT.
            </p>
          </>
        )}
      </div>
    </section>
  )
}
