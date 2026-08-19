import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { token } from '../../lib/tokens'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { CameraRig } from './CameraRig'
import { DustField } from './DustField'
import { Impact } from './Impact'
import { LightShaft } from './LightShaft'
import { Target } from './Target'
import { Tracer } from './Tracer'
import {
  CAMERA,
  DUST_COUNT_DESKTOP,
  DUST_COUNT_MOBILE,
  type Flight,
} from './shaft'

type Props = {
  /** postęp intra spod ScrollTrigger — czytany w pętli renderu, nie w Reakcie */
  flight: Flight
}

/**
 * Jedna scena, jedna pętla renderu. Liczba cząsteczek ustalana raz przy
 * montowaniu — przebudowa bufora przy każdym resize nie jest tego warta.
 */
export function HeroScene({ flight }: Props) {
  const reducedMotion = usePrefersReducedMotion()

  const isMobile = useMemo(
    () => window.matchMedia('(max-width: 767px)').matches,
    [],
  )

  const count = isMobile ? DUST_COUNT_MOBILE : DUST_COUNT_DESKTOP
  const pixelRatio = Math.min(window.devicePixelRatio, 2)
  const background = token('--color-bg')

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      camera={{
        position: [CAMERA.start.x, CAMERA.start.y, CAMERA.start.z],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <color attach="background" args={[background]} />
      <CameraRig flight={flight} frozen={reducedMotion} />
      <LightShaft />
      <DustField
        count={count}
        frozen={reducedMotion}
        pixelRatio={pixelRatio}
      />
      <Target flight={flight} frozen={reducedMotion} />
      <Tracer flight={flight} frozen={reducedMotion} />
      <Impact flight={flight} frozen={reducedMotion} />
    </Canvas>
  )
}
