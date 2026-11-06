import { Navbar } from '../components/nav/Navbar'
import { NewsList } from '../components/news/NewsList'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'

export function Aktualnosci() {
  usePageMeta(
    'EntryZone — aktualności',
    'Ogłoszenia i nowości EntryZone — turnieje, giveawaye i zmiany.',
  )

  return (
    <>
      <Navbar mode="page" />
      <NewsList />
      <Footer />
    </>
  )
}
