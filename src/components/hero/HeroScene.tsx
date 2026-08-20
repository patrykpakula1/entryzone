import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { token } from '../../lib/tokens'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { CameraRig } from './CameraRig'
import { DustField } from './DustField'
import { Impact } from './Impact'
import { LightShaft } from './LightShaft'
import { Tracer } from './Tracer'
import {
  CAMERA,
  DUST_COUNT_DESKTOP,
  DUST_COUNT_MOBILE,
  type Exit,
  type Flight,
} from './shaft'

type Props = {
  /** postęp intra spod ScrollTrigger — czytany w pętli renderu, nie w Reakcie */
  flight: Flight
  /** postęp wyjścia — druga oś, dopięta za lotem */
  exit: Exit
  /** czy hero jest w kadrze — poza nim pętla renderu stoi */
  onScreen: boolean
}

/**
 * Jedna scena, jedna pętla renderu. Liczba cząsteczek ustalana raz przy
 * montowaniu — przebudowa bufora przy każdym resize nie jest tego warta.
 *
 * Bloomu nie ma nigdzie: poświata jest wypalona w shaderach na blendingu
 * addytywnym, więc nie ma post-processingu, który trzeba by gasić na telefonie.
 */
export function HeroScene({ flight, exit, onScreen }: Props) {
  const reducedMotion = usePrefersReducedMotion()

  const isMobile = useMemo(
    () => window.matchMedia('(max-width: 767px)').matches,
    [],
  )

  const count = isMobile ? DUST_COUNT_MOBILE : DUST_COUNT_DESKTOP
  const pixelRatio = Math.min(window.devicePixelRatio, 2)
  const background = token('--color-bg')

  // Poza kadrem nie ma czego rysować — pełna pętla paliłaby baterię przez
  // całą resztę strony. Reduced-motion i tak rysuje tylko na żądanie.
  const frameloop = reducedMotion ? 'demand' : onScreen ? 'always' : 'never'

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
      frameloop={frameloop}
    >
      <color attach="background" args={[background]} />
      <CameraRig flight={flight} exit={exit} frozen={reducedMotion} />
      <LightShaft />
      <DustField
        count={count}
        frozen={reducedMotion}
        pixelRatio={pixelRatio}
      />
      <Tracer flight={flight} frozen={reducedMotion} />
      <Impact flight={flight} frozen={reducedMotion} />
    </Canvas>
  )
}
