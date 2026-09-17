import { PageHeader } from '../components/layout/PageHeader'
import { usePageMeta } from '../hooks/usePageMeta'

export function Regulamin() {
  usePageMeta(
    'EntryZone — Regulamin',
    'Regulamin serwisu EntryZone.',
  )

  return (
    <PageHeader title="Regulamin">
      <p className="text-lg text-text/70">Treść wkrótce.</p>
    </PageHeader>
  )
}
