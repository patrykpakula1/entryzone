import { Navbar } from '../components/nav/Navbar'
import { LeagueOverview } from '../components/league/LeagueOverview'
import { LeagueTable } from '../components/league/LeagueTable'
import { usePageMeta } from '../hooks/usePageMeta'

export function League() {
  usePageMeta(
    'EntryZone League — sezon i ranking',
    'Cotygodniowa liga CS2 dla stałych składów. Zasady punktacji, playoff i aktualny ranking sezonu EntryZone League.',
  )

  return (
    <>
      <Navbar mode="page" />
      <LeagueOverview />
      <LeagueTable />
    </>
  )
}
