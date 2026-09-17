import { Navbar } from '../components/nav/Navbar'
import { WinnersHallOfFame } from '../components/winners/WinnersHallOfFame'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'

export function Winners() {
  usePageMeta(
    'EntryZone Winners — zwycięzcy i MVP',
    'Zwycięzcy i MVP każdego turnieju i sezonu EntryZone — pełna hala sław CUP-u i ligi CS2.',
  )

  return (
    <>
      <Navbar mode="page" />
      <WinnersHallOfFame />
      <Footer />
    </>
  )
}
