import { Link } from 'react-router-dom'
import { registration } from '../../data/registration'
import { social } from '../../data/social'

const LEGAL_LINKS = [
  { label: 'Regulamin', to: '/regulamin' },
  { label: 'Polityka prywatności', to: '/polityka-prywatnosci' },
  { label: 'Polityka cookies', to: '/polityka-cookies' },
]

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.98.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028ZM8.02 15.278c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16.6 5.82a4.278 4.278 0 0 1-1.06-2.82h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.15 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
    </svg>
  )
}

/** Stopka na wszystkich podstronach — sygnet, social, linki prawne. */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="font-display text-lg uppercase tracking-[0.2em] text-text">
                EntryZone
              </span>
              <span className="text-sm text-text/60">Turnieje CS2</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={registration.discordUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="text-text/60 transition-colors duration-200 hover:text-gold-lite"
            >
              <DiscordIcon />
            </a>
            <a
              href={social.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="text-text/60 transition-colors duration-200 hover:text-gold-lite"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6">
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
      </div>
    </footer>
  )
}
