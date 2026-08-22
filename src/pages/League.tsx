import { Navbar } from '../components/nav/Navbar'
import { LeagueOverview } from '../components/league/LeagueOverview'
import { LeagueTable } from '../components/league/LeagueTable'

export function League() {
  return (
    <>
      <Navbar mode="page" />
      <LeagueOverview />
      <LeagueTable />
    </>
  )
}
