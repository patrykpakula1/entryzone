import { registration } from '../../data/registration'
import { social } from '../../data/social'
import { DiscordIcon, TikTokIcon } from '../icons/SocialIcons'

const ITEMS = [
  { label: 'Discord', url: registration.discordUrl, Icon: DiscordIcon },
  { label: 'TikTok', url: social.tiktokUrl, Icon: TikTokIcon },
]

/**
 * Pionowy pasek social mediów przyklejony do lewej krawędzi, widoczny na
 * wszystkich podstronach (montowany raz w App, poza <Routes>). Ukryty na
 * mobile — na wąskim ekranie zabierałby miejsce, które i tak jest na wagę
 * złota; hover-reveal nie ma sensu na dotyku.
 */
export function SocialSidebar() {
  return (
    <div className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
      {ITEMS.map(({ label, url, Icon }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="group flex items-center overflow-hidden rounded-r-full border border-border/60 bg-surface/60 backdrop-blur-md transition-colors duration-200 hover:bg-surface/80"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center text-text/70 transition-colors duration-200 group-hover:text-gold-lite">
            <Icon />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-xs uppercase tracking-[0.2em] text-text/80 transition-all duration-300 group-hover:max-w-[120px] group-hover:pr-5">
            {label}
          </span>
        </a>
      ))}
    </div>
  )
}
