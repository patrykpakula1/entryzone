import { Hero } from '../components/hero/Hero'
import { CupTeaser } from '../components/home/CupTeaser'
import { usePageMeta } from '../hooks/usePageMeta'

export function Home() {
  usePageMeta(
    'ENTRYZONE — wejdź do gry',
    'Otwarty turniej CS2 dla 16 drużyn, bez limitu rangi. 14-15 listopada 2026, pula nagród 1600 zł. Zapisy do 8 listopada.',
  )

  return (
    <>
      <Hero />
      <CupTeaser />
    </>
  )
}
