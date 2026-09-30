import { Navbar } from '../components/nav/Navbar'
import { Giveaway } from '../components/giveaway/Giveaway'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'

export function GiveawayPage() {
  usePageMeta(
    'EntryZone — giveaway',
    'Giveaway skinów do CS2 co 10 dni dla społeczności EntryZone: nagroda, termin, zasady i poprzedni zwycięzcy.',
  )

  return (
    <>
      <Navbar mode="page" />
      <Giveaway />
      <Footer />
    </>
  )
}
