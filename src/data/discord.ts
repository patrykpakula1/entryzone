/**
 * Widget serwera musi być włączony w Discordzie (Ustawienia serwera →
 * Widżet), inaczej ten endpoint zwraca 404. ID nie jest sekretem — widget
 * jest jawnie publiczny.
 */
export const discordGuildId = '1534234583435051138'
export const discordWidgetUrl = `https://discord.com/api/guilds/${discordGuildId}/widget.json`
