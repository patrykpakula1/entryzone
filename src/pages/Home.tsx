import { Hero } from '../components/hero/Hero'
import { CancelledNotice } from '../components/home/CancelledNotice'
import { CupTeaser } from '../components/home/CupTeaser'
import { News } from '../components/home/News'
import { Partners } from '../components/home/Partners'
import { Footer } from '../components/layout/Footer'
import { tournamentCancelled } from '../data/tournament'
import { usePageMeta } from '../hooks/usePageMeta'

export function Home() {
  usePageMeta(
    'ENTRYZONE — wejdź do gry',
    tournamentCancelled
      ? 'EntryZone — organizacja esportowa CS2. Giveawaye skinów, liga i kolejne turnieje. EntryZone Cup #1 został odwołany — o następnych informujemy na Discordzie.'
      : 'Otwarty turniej CS2 dla 16 drużyn, bez limitu rangi. 14-15 listopada 2026, pula nagród 1600 zł. Udział bezpłatny, zapisy przez FACEIT do 14 listopada.',
  )

  return (
    <>
      {tournamentCancelled && <CancelledNotice />}
      <Hero />
      {!tournamentCancelled && <CupTeaser />}
      <News />
      <Partners />
      <Footer />
    </>
  )
}
