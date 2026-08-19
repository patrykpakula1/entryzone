import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { range, smoothstep } from '../../lib/math'
import { CAMERA, IMPACT, type Flight } from './shaft'

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

type Props = {
  /** postęp intra spod ScrollTrigger */
  flight: Flight
  /** prefers-reduced-motion — kamera zostaje w klatce startowej */
  frozen: boolean
}

/**
 * Kamera goni pocisk. Nie obraca się — sam przelot w głąb plus kurz mijany
 * po drodze robią robotę, a obrót przy scrubie łatwo zamienia się w kołysanie.
 */
export function CameraRig({ flight, frozen }: Props) {
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    camera.position.copy(CAMERA.start)
  }, [camera])

  useFrame(() => {
    if (frozen) return

    // Rozpęd zamiast ruszania z miejsca — stąd potęga na wygładzonym zakresie.
    const t = Math.pow(smoothstep(CAMERA.chase, 1, flight.value), 1.2)
    camera.position.lerpVectors(CAMERA.start, CAMERA.end, t)
    camera.position.add(impactShake(flight.value, shake))
  })

  return null
}
