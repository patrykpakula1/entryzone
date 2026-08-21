import { useEffect, useState } from 'react'

export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

const DAY = 86_400_000
const HOUR = 3_600_000
const MINUTE = 60_000

function diffToParts(ms: number): CountdownParts {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }

  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / HOUR),
    minutes: Math.floor((ms % HOUR) / MINUTE),
    seconds: Math.floor((ms % MINUTE) / 1000),
    done: false,
  }
}

/**
 * Tyka co sekundę do podanej daty. `target` musi być stabilną referencją
 * (stałą modułową, nie tworzoną w renderze) — inaczej efekt resetowałby
 * interval przy każdym tyknięciu.
 */
export function useCountdown(target: Date): CountdownParts {
  const [parts, setParts] = useState(() => diffToParts(target.getTime() - Date.now()))

  useEffect(() => {
    const tick = () => setParts(diffToParts(target.getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return parts
}
