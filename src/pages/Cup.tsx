import { Navbar } from '../components/nav/Navbar'
import { CupOverview } from '../components/cup/CupOverview'
import { Regulamin } from '../components/cup/Regulamin'

export function Cup() {
  return (
    <>
      <Navbar mode="page" />
      <CupOverview />
      <Regulamin />
    </>
  )
}
