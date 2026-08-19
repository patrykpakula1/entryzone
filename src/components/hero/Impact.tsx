import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  type Mesh,
  PlaneGeometry,
  ShaderMaterial,
} from 'three'
import { tokenColor } from '../../lib/tokens'
import { range, smoothstep } from '../../lib/math'
import { IMPACT, TARGET, TARGET_QUATERNION, type Flight } from './shaft'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const flashFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uEdgeColor;
  uniform float uAlpha;

  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float core = 1.0 - smoothstep(0.0, 0.5, d);
    float halo = 1.0 - smoothstep(0.0, 1.0, d);
    halo *= halo;

    // Rdzeń dobity kwadratem: środek przepala się do bieli, brzeg zostaje ciepły.
    vec3 c = mix(uEdgeColor, uColor, pow(core, 0.5));
    gl_FragColor = vec4(c, (core * core * 3.0 + halo * 0.45) * uAlpha);
  }
`

const ringFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  uniform float uRadius;
  uniform float uWidth;
  uniform float uAlpha;

  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float band = 1.0 - smoothstep(0.0, uWidth, abs(d - uRadius));
    band *= band;

    // Do środka pierścienia ciągnie się resztka poświaty, jak fala uderzeniowa.
    float wake = (1.0 - smoothstep(0.0, uRadius, d)) * 0.1;

    vec3 c = mix(uColor, uHotColor, band);
    gl_FragColor = vec4(c, (band + wake) * uAlpha);
  }
`

/** Uniformy siedzą w zamemoizowanych materiałach — ustawiamy je punktowo. */
function setUniform(material: ShaderMaterial, name: string, value: number) {
  material.uniforms[name].value = value
}

/** Ile promieni płyty obejmuje pierścień, zanim zgaśnie za kadrem. */
const RING_REACH = 4

type Props = {
  /** postęp intra spod ScrollTrigger */
  flight: Flight
  /** prefers-reduced-motion — uderzenia nie ma wcale */
  frozen: boolean
}

/**
 * Rozbłysk i pierścień uderzeniowy. Oba wiszą na tym samym postępie scrolla
 * co rozpad płyty — trafienie nie ma własnej osi czasu, którą dałoby się
 * rozjechać z resztą.
 */
export function Impact({ flight, frozen }: Props) {
  const invalidate = useThree((s) => s.invalidate)
  const camera = useThree((s) => s.camera)

  const flash = useRef<Mesh>(null)
  const ring = useRef<Mesh>(null)

  const flashPlane = useMemo(() => new PlaneGeometry(1, 1), [])
  const ringPlane = useMemo(() => {
    const size = TARGET.radius * RING_REACH * 2
    return new PlaneGeometry(size, size)
  }, [])

  const flashMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader: flashFragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: tokenColor('--color-text') },
          uEdgeColor: { value: tokenColor('--color-gold-lite') },
          uAlpha: { value: 0 },
        },
      }),
    [],
  )

  const ringMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader: ringFragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: tokenColor('--color-gold') },
          uHotColor: { value: tokenColor('--color-text') },
          uRadius: { value: 0 },
          uWidth: { value: 0.2 },
          uAlpha: { value: 0 },
        },
      }),
    [],
  )

  useEffect(() => {
    return () => {
      flashPlane.dispose()
      ringPlane.dispose()
      flashMaterial.dispose()
      ringMaterial.dispose()
    }
  }, [flashPlane, ringPlane, flashMaterial, ringMaterial])

  useEffect(() => {
    invalidate()
  }, [invalidate])

  useFrame(() => {
    if (!flash.current || !ring.current) return

    const t = frozen ? 0 : range(IMPACT.start, IMPACT.end, flight.value)

    // Rozbłysk: zapala się natychmiast, potem puchnie i blednie.
    const flashAlpha = smoothstep(0, 0.02, t) * (1 - smoothstep(0.12, 0.6, t))
    const flashVisible = flashAlpha > 0.001
    flash.current.visible = flashVisible

    if (flashVisible) {
      setUniform(flashMaterial, 'uAlpha', flashAlpha)
      const size = 3 + Math.pow(t, 0.45) * 17
      flash.current.scale.set(size, size, 1)
      flash.current.quaternion.copy(camera.quaternion)
    }

    // Pierścień: szybki odskok i wyhamowanie, im dalej tym cieńszy.
    const ringAlpha =
      smoothstep(0, 0.015, t) * (1 - smoothstep(0.1, 0.55, t)) * 0.75
    const ringVisible = ringAlpha > 0.001
    ring.current.visible = ringVisible

    if (ringVisible) {
      const spread = Math.pow(t, 0.45)
      setUniform(ringMaterial, 'uRadius', spread)
      setUniform(ringMaterial, 'uWidth', 0.16 - spread * 0.13)
      setUniform(ringMaterial, 'uAlpha', ringAlpha)
    }
  })

  return (
    <>
      <mesh
        ref={ring}
        geometry={ringPlane}
        material={ringMaterial}
        position={TARGET.position}
        quaternion={TARGET_QUATERNION}
        visible={false}
      />
      <mesh
        ref={flash}
        geometry={flashPlane}
        material={flashMaterial}
        position={TARGET.position}
        visible={false}
      />
    </>
  )
}
