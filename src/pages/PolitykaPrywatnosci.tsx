import { PageHeader } from '../components/layout/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'

export function PolitykaPrywatnosci() {
  usePageMeta(
    'EntryZone — Polityka prywatności',
    'Polityka prywatności serwisu EntryZone.',
  )

  return (
    <PageHeader title="Polityka prywatności">
      <p className="text-lg text-text/70">Treść wkrótce.</p>
    </PageHeader>
  )
}
