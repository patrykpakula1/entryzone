import { Navbar } from '../components/nav/Navbar'
import { CupOverview } from '../components/cup/CupOverview'
import { Bracket } from '../components/cup/Bracket'
import { MvpRanking } from '../components/cup/MvpRanking'
import { Regulamin } from '../components/cup/Regulamin'
import { Faq } from '../components/cup/Faq'
import { Footer } from '../components/layout/Footer'
import { tournamentCancelled } from '../data/tournament'
import { usePageMeta } from '../hooks/usePageMeta'

export function Cup() {
  usePageMeta(
    tournamentCancelled
      ? 'EntryZone Cup #1 — odwołany'
      : 'EntryZone Cup #1 — drabinka i regulamin',
    tournamentCancelled
      ? 'EntryZone Cup #1 został odwołany. O kolejnych turniejach poinformujemy na Discordzie i w social mediach.'
      : 'Otwarty puchar CS2 dla 16 drużyn, 14-15 listopada 2026. Single elimination, BO1, wielki finał BO3. Sprawdź drabinkę i regulamin.',
  )

  return (
    <>
      <Navbar mode="page" />
      <CupOverview />
      {!tournamentCancelled && (
        <>
          <Bracket />
          <MvpRanking />
        </>
      )}
      <Regulamin />
      {!tournamentCancelled && <Faq />}
      <Footer />
    </>
  )
}
