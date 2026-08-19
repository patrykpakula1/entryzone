import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { smoothstep } from '../../lib/math'
import { CAMERA, type Flight } from './shaft'

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
  })

  return null
}
