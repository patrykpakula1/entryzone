import { Link } from 'react-router-dom'

const LEGAL_LINKS = [
  { label: 'Regulamin', to: '/regulamin' },
  { label: 'Polityka prywatności', to: '/polityka-prywatnosci' },
  { label: 'Polityka cookies', to: '/polityka-cookies' },
]

/** Stopka na wszystkich podstronach — prawa, drobny druk o Valve. */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-[700px] flex-col gap-4">
        <div className="flex flex-col items-center gap-4 text-sm text-text/60 sm:flex-row sm:justify-between">
          <span>© 2026 EntryZone</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors duration-200 hover:text-gold-lite"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-center text-xs text-text/40 sm:text-left">
          EntryZone nie jest powiązane ani sponsorowane przez Valve Corporation.
          Counter-Strike 2 jest znakiem towarowym Valve Corporation.
        </p>
      </div>
    </footer>
  )
}
