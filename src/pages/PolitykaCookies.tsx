import { PageHeader } from '../components/layout/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'

export function PolitykaCookies() {
  usePageMeta(
    'EntryZone — Polityka cookies',
    'Polityka cookies serwisu EntryZone.',
  )

  return (
    <PageHeader title="Polityka cookies">
      <p className="text-lg text-text/70">Treść wkrótce.</p>
    </PageHeader>
  )
}
