import { Hero } from '../components/hero/Hero'
import { CupTeaser } from '../components/home/CupTeaser'
import { usePageMeta } from '../hooks/usePageMeta'

export function Home() {
  usePageMeta(
    'EntryZone — turnieje CS2',
    'Otwarty turniej CS2 dla 16 drużyn. 14-15 listopada 2026. Pula nagród 1600 zł, zapisy do 8 listopada.',
  )

  return (
    <>
      <Hero />
      <CupTeaser />
    </>
  )
}
