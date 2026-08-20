import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { range, smoothstep } from '../../lib/math'
import { CAMERA, EXIT, IMPACT, type Exit, type Flight } from './shaft'

const shake = new Vector3()

/**
 * Drganie po trafieniu. Liczone z postępu scrolla, nie z zegara — przy
 * oscylacji na czasie kamera trzęsłaby się w stojącej scenie, gdyby ktoś
 * zatrzymał przewijanie w środku uderzenia.
 */
function impactShake(flight: number, out: Vector3): Vector3 {
  const t = range(IMPACT.start, IMPACT.shakeEnd, flight)
  if (t <= 0 || t >= 1) return out.set(0, 0, 0)

  // Kopnięcie w jednej klatce, potem zanik.
  const a = smoothstep(0, 0.05, t) * Math.pow(1 - t, 2.2) * IMPACT.shakeAmplitude

  // Trzy różne częstotliwości: kamera drga, a nie kołysze się w jednej osi.
  return out.set(
    Math.sin(flight * 520) * a,
    Math.sin(flight * 611 + 1.7) * a * 0.8,
    Math.sin(flight * 437 + 0.9) * a * 0.5,
  )
}

/**
 * Tor wyjścia. Do EXIT.swap kadr rzuca się w stronę trafienia, potem — już pod
 * szczelnym rozbłyskiem — kamera jest po drugiej stronie i opada wzdłuż smugi.
 * Przeskok między torami jest niewidoczny, bo wypada w środku rozbłysku.
 */
function exitPosition(exit: number, out: Vector3): Vector3 {
  if (exit < EXIT.swap) {
    // Rozpęd zamiast równego dojazdu — im bliżej trafienia, tym szybciej.
    const t = Math.pow(range(0, EXIT.swap, exit), 1.7)
    return out.lerpVectors(CAMERA.end, EXIT.lunge, t)
  }

  // Wynurzenie z pełną prędkością i miękkie osiadanie — kamera oddaje ruch
  // scrollowi strony, zamiast zatrzymać się w miejscu przed końcem pinu.
  const t = Math.pow(range(EXIT.swap, 1, exit), 0.8)
  return out.lerpVectors(EXIT.top, EXIT.bottom, t)
}

type Props = {
  /** postęp intra spod ScrollTrigger */
  flight: Flight
  /** postęp wyjścia — rusza dopiero, gdy lot dobiegnie końca */
  exit: Exit
  /** prefers-reduced-motion — kamera zostaje w klatce startowej */
  frozen: boolean
}

/**
 * Kamera goni pocisk. Nie obraca się — sam przelot w głąb plus kurz mijany
 * po drodze robią robotę, a obrót przy scrubie łatwo zamienia się w kołysanie.
 */
export function CameraRig({ flight, exit, frozen }: Props) {
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    camera.position.copy(CAMERA.start)
  }, [camera])

  useFrame(() => {
    if (frozen) return

    // Wyjście przejmuje kamerę w całości: zaczyna dokładnie tam, gdzie lot
    // ją zostawił, więc przejęcie nie ma szwu.
    if (exit.value > 0) {
      exitPosition(exit.value, camera.position)
      return
    }

    // Rozpęd zamiast ruszania z miejsca — stąd potęga na wygładzonym zakresie.
    const t = Math.pow(smoothstep(CAMERA.chase, 1, flight.value), 1.2)
    camera.position.lerpVectors(CAMERA.start, CAMERA.end, t)
    camera.position.add(impactShake(flight.value, shake))
  })

  return null
}
