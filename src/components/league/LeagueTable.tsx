import { teams } from '../../data/bracket'
import { league, standings } from '../../data/league'

function formatDiff(diff: number) {
  return diff > 0 ? `+${diff}` : `${diff}`
}

/** Ranking ligi — dane z data/league.ts, pierwsze trzy miejsca wyróżnione. */
export function LeagueTable() {
  const ranked = [...standings].sort(
    (a, b) => b.points - a.points || b.roundDiff - a.roundDiff,
  )

  return (
    <section className="bg-bg px-6 pb-16 sm:pb-24">
      <div className="mx-auto max-w-[700px]">
        <div className="flex flex-col items-center gap-4 pb-10 text-center">
          <span className="h-px w-12 bg-gold" />
          <h2 className="text-2xl text-text sm:text-3xl">
            Tabela — sezon {league.seasonNumber}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="font-display border-b border-border text-xs uppercase tracking-[0.15em] text-copper">
                <th
                  scope="col"
                  className="sticky left-0 z-10 w-10 bg-bg py-3 pr-3 font-normal"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="sticky left-10 z-10 bg-bg py-3 pr-3 font-normal"
                >
                  Drużyna
                </th>
                <th scope="col" className="py-3 pr-3 text-right font-normal">
                  M
                </th>
                <th scope="col" className="py-3 pr-3 text-right font-normal">
                  W
                </th>
                <th scope="col" className="py-3 pr-3 text-right font-normal">
                  P
                </th>
                <th scope="col" className="py-3 pr-3 text-right font-normal">
                  Runda +/−
                </th>
                <th scope="col" className="py-3 pl-3 text-right font-normal">
                  Pkt
                </th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((row, i) => {
                const place = i + 1
                const isTop3 = place <= 3
                const team = teams[row.teamId]

                return (
                  <tr
                    key={row.teamId}
                    className={`border-b border-border last:border-b-0 ${
                      isTop3 ? 'bg-surface' : ''
                    }`}
                  >
                    <td
                      className={`sticky left-0 z-10 w-10 py-3 pr-3 font-display ${
                        isTop3 ? 'bg-surface text-gold' : 'bg-bg text-text/50'
                      }`}
                    >
                      {place}
                    </td>
                    <td
                      className={`sticky left-10 z-10 py-3 pr-3 ${
                        isTop3 ? 'bg-surface text-text' : 'bg-bg text-text/80'
                      }`}
                    >
                      {team.name}
                    </td>
                    <td className="py-3 pr-3 text-right text-text/70">{row.played}</td>
                    <td className="py-3 pr-3 text-right text-text/70">{row.wins}</td>
                    <td className="py-3 pr-3 text-right text-text/70">{row.losses}</td>
                    <td className="py-3 pr-3 text-right text-text/70">
                      {formatDiff(row.roundDiff)}
                    </td>
                    <td
                      className={`font-display py-3 pl-3 text-right ${
                        isTop3 ? 'text-gold' : 'text-text'
                      }`}
                    >
                      {row.points}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
