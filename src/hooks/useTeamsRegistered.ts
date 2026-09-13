import { useEffect, useState } from 'react'
import { registration } from '../data/registration'

/**
 * Liczy wiersze w opublikowanym CSV, ignorując pola w cudzysłowie — Google
 * Forms cytuje odpowiedzi wielolinijkowe, więc naiwny podział po `\n`
 * policzyłby jedną odpowiedź jako kilka wierszy.
 */
function countCsvDataRows(csv: string): number {
  const text = csv.replace(/^﻿/, '')
  let rows = 0
  let inQuotes = false
  let rowHasContent = false

  for (const char of text) {
    if (char === '"') {
      inQuotes = !inQuotes
      rowHasContent = true
    } else if (char === '\n' && !inQuotes) {
      if (rowHasContent) rows++
      rowHasContent = false
    } else if (char !== '\r') {
      rowHasContent = true
    }
  }
  if (rowHasContent) rows++

  return Math.max(0, rows - 1) // minus wiersz nagłówka
}

/**
 * Liczba zapisanych drużyn z arkusza odpowiedzi formularza. `null` dopóki
 * pierwsze pobranie się nie powiedzie — UI pokazuje wtedy dyskretny stan
 * ładowania zamiast liczby. Nieudane pobranie zostaje w tym samym stanie
 * (cicho, bez osobnego stanu błędu w komponentach).
 */
export function useTeamsRegistered() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(registration.responsesCsvUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((csv) => {
        if (cancelled) return
        setCount(Math.min(countCsvDataRows(csv), registration.teamsMax))
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
