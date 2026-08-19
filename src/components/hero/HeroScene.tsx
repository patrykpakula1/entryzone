import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { token } from '../../lib/tokens'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { DustField } from './DustField'
import { LightShaft } from './LightShaft'
import { DUST_COUNT_DESKTOP, DUST_COUNT_MOBILE } from './shaft'

/**
 * Jedna scena, jedna pętla renderu. Liczba cząsteczek ustalana raz przy
 * montowaniu — przebudowa bufora przy każdym resize nie jest tego warta.
 */
export function HeroScene() {
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
      camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <color attach="background" args={[background]} />
      <LightShaft />
      <DustField
        count={count}
        frozen={reducedMotion}
        pixelRatio={pixelRatio}
      />
    </Canvas>
  )
}
