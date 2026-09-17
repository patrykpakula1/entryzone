import { Navbar } from '../components/nav/Navbar'
import { DiscordCta } from '../components/discord/DiscordCta'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'

export function Discord() {
  usePageMeta(
    'EntryZone — dołącz na Discord',
    'Terminarz, przydział serwerów, zgłaszanie sporów i szukanie graczy do składu — dołącz do serwera Discord EntryZone.',
  )

  return (
    <>
      <Navbar mode="page" />
      <DiscordCta />
      <Footer />
    </>
  )
}
