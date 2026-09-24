import { useTournamentStats, type PlayerStats } from '../../hooks/useTournamentStats'

const MIN_MAPS = 3

// Ten sam układ kolumn w nagłówku i wierszach (od md); poniżej md wiersz to karta.
const ROW_COLS =
  'grid-cols-[2rem_1fr] gap-x-4 md:grid-cols-[3rem_1.2fr_1fr_5rem_5rem_5rem] md:items-center md:gap-x-6'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex flex-col md:block md:text-right">
      <span className="text-[10px] uppercase tracking-[0.15em] text-text/40 md:hidden">{label}</span>
      <span className="font-display tabular-nums text-text">{value}</span>
    </span>
  )
}

function Row({ player, place }: { player: PlayerStats; place: number }) {
  const leader = place === 1
  return (
    <li
      className={`grid ${ROW_COLS} rounded-sm border bg-surface px-4 py-4 md:px-5 ${
        leader ? 'border-gold' : 'border-border'
      }`}
    >
      <span
        className={`font-display tabular-nums text-lg md:text-base ${
          leader ? 'text-gold' : 'text-copper'
        }`}
      >
        {place}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-text">{player.nickname}</span>
        {/* Na telefonie drużyna schodzi pod nick; od md ma własną kolumnę. */}
        <span className="block truncate text-sm text-text/50 md:hidden">
          {player.teamName ?? '—'}
        </span>
        {leader && (
          <span className="mt-1 block text-xs italic text-gold">
            prowadzi w wyścigu o GTA 6
          </span>
        )}
      </span>

      <span className="hidden truncate text-text/60 md:block">{player.teamName ?? '—'}</span>

      <span className="col-start-2 mt-3 flex gap-8 md:contents">
        <Stat label="ADR" value={player.adr.toFixed(1)} />
        <Stat label="K/D" value={player.kd.toFixed(2)} />
        <Stat label="Mapy" value={String(player.maps)} />
      </span>
    </li>
  )
}

/**
 * Ranking MVP pod drabinką na /cup. Do pierwszego zakończonego meczu z
 * statystykami sekcji nie ma w ogóle (ani pustej tabeli, ani nagłówka).
 */
export function MvpRanking() {
  const stats = useTournamentStats()
  if (!stats || stats.players.length === 0) return null

  const { mvpRanking } = stats

  return (
    <section id="mvp" className="scroll-mt-24 bg-bg px-6 pb-20 sm:scroll-mt-32 sm:pb-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 sm:gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="h-px w-12 bg-gold" />
          <h2 className="text-3xl text-text sm:text-4xl">Ranking MVP</h2>
        </div>

        {mvpRanking.length > 0 ? (
          <div className="w-full">
            <div
              className={`hidden md:grid ${ROW_COLS} px-5 pb-3 text-[10px] uppercase tracking-[0.2em] text-text/40`}
              aria-hidden="true"
            >
              <span>#</span>
              <span>Gracz</span>
              <span>Drużyna</span>
              <span className="text-right">ADR</span>
              <span className="text-right">K/D</span>
              <span className="text-right">Mapy</span>
            </div>
            <ol className="flex flex-col gap-3">
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
          W rankingu są gracze z co najmniej {MIN_MAPS} rozegranymi mapami, wg średniego ADR; przy
          remisie decyduje wyższe K/D. Statystyki pochodzą z FACEIT.
        </p>
      </div>
    </section>
  )
}
