import { Navbar } from '../components/nav/Navbar'
import { CupOverview } from '../components/cup/CupOverview'
import { Bracket } from '../components/cup/Bracket'
import { Regulamin } from '../components/cup/Regulamin'

export function Cup() {
  return (
    <>
      <Navbar mode="page" />
      <CupOverview />
      <Bracket />
      <Regulamin />
    </>
  )
}
