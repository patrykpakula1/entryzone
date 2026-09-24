import type { ComponentType } from 'react'
import {
  DiscordIcon,
  FacebookIcon,
  InstagramIcon,
  KickIcon,
  TikTokIcon,
} from '../components/icons/SocialIcons'

export const DISCORD_URL = 'https://discord.gg/EGwYTYpjXR'

export type Social = {
  name: string
  url: string
  icon: ComponentType
}

/**
 * Jedyne źródło prawdy dla linków do social mediów — każdy rząd ikon czyta
 * z tej listy, kolejność tutaj = kolejność na stronie.
 */
export const socials: Social[] = [
  { name: 'Discord', url: DISCORD_URL, icon: DiscordIcon },
  { name: 'TikTok', url: 'https://www.tiktok.com/@entryzone5', icon: TikTokIcon },
  { name: 'Instagram', url: 'https://www.instagram.com/entryzone1/', icon: InstagramIcon },
  { name: 'Facebook', url: 'https://www.facebook.com/share/1Ti2dYyD4W/', icon: FacebookIcon },
  { name: 'Kick', url: 'https://kick.com/entryzone', icon: KickIcon },
]
