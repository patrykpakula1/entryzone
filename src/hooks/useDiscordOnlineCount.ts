import { useEffect, useState } from 'react'
import { discordWidgetUrl } from '../data/discord'

type WidgetResponse = { presence_count: number }

/**
 * Liczba osób online na serwerze, z publicznego widget.json Discorda
 * (wymaga włączonego widgetu w ustawieniach serwera). `null` dopóki pierwsze
 * pobranie się nie powiedzie — UI pokazuje wtedy dyskretny stan ładowania
 * zamiast liczby. Nieudane pobranie zostaje w tym samym stanie (cicho, bez
 * osobnego stanu błędu w komponentach).
 */
export function useDiscordOnlineCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(discordWidgetUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<WidgetResponse>
      })
      .then((data) => {
        if (cancelled) return
        setCount(data.presence_count)
      })
      .catch(() => {
        // Cicho: count zostaje null, komponenty pokazują stan ładowania.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return count
}
