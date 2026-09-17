import { Navbar } from '../components/nav/Navbar'
import { CupOverview } from '../components/cup/CupOverview'
import { Bracket } from '../components/cup/Bracket'
import { Regulamin } from '../components/cup/Regulamin'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'

export function Cup() {
  usePageMeta(
    'EntryZone Cup #1 — drabinka i regulamin',
    'Otwarty puchar CS2 dla 16 drużyn, 14-15 listopada 2026. Single elimination, BO1, wielki finał BO3. Sprawdź drabinkę i regulamin.',
  )

  return (
    <>
      <Navbar mode="page" />
      <CupOverview />
      <Bracket />
      <Regulamin />
      <Footer />
    </>
  )
}
