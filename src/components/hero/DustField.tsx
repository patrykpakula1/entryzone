import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
} from 'three'
import { tokenColor } from '../../lib/tokens'
import { SHAFT } from './shaft'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uYMin;
  uniform float uHeight;
  uniform float uRadiusTop;
  uniform float uRadiusBottom;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec2 aDisk;
  attribute float aSeed;
  attribute float aSize;

  varying float vAlpha;
  varying float vCore;

  void main() {
    // Dryf w górę z zawinięciem — bez tego trzeba by resetować bufor na CPU.
    float h = mod(position.y + uTime * uSpeed - uYMin, uHeight) + uYMin;

    // 0 przy górnej krawędzi smugi, 1 przy dolnej
    float t = (uYMin + uHeight - h) / uHeight;
    float radius = mix(uRadiusTop, uRadiusBottom, t);

    float sway = sin(uTime * 0.11 + aSeed * 6.2831) * 0.09;
    vec3 p = vec3(aDisk.x * radius + sway, h, aDisk.y * radius);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Kamera wlatuje w słup kurzu, więc mijane z bliska drobiny rozdęłyby się
    // w plamy na pół ekranu — stąd sufit na rozmiar punktu.
    gl_PointSize = min(aSize * uSize * uPixelRatio * (8.0 / -mv.z), 48.0 * uPixelRatio);

    // Bliżej osi smugi = jaśniej.
    vCore = 1.0 - length(aDisk);

    // Wygaszenie na obu końcach ukrywa moment zawinięcia.
    float fade = smoothstep(0.0, 0.2, t) * (1.0 - smoothstep(0.7, 1.0, t));
    vAlpha = fade * mix(0.1, 1.0, vCore);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uCoreColor;

  varying float vAlpha;
  varying float vCore;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;

    vec3 c = mix(uColor, uCoreColor, vCore * 0.55);
    gl_FragColor = vec4(c, a * vAlpha * 0.55);
  }
`

type Props = {
  count: number
  /** prefers-reduced-motion — statyczna klatka zamiast dryfu */
  frozen: boolean
  pixelRatio: number
}

export function DustField({ count, frozen, pixelRatio }: Props) {
  const invalidate = useThree((s) => s.invalidate)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const disk = new Float32Array(count * 2)
    const seed = new Float32Array(count)
    const size = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // sqrt() rozkłada punkty równomiernie po powierzchni koła,
      // bez tego zbijają się w środku
      const r = Math.sqrt(Math.random())
      const a = Math.random() * Math.PI * 2

      disk[i * 2] = Math.cos(a) * r
      disk[i * 2 + 1] = Math.sin(a) * r

      positions[i * 3] = 0
      positions[i * 3 + 1] = SHAFT.yMin + Math.random() * SHAFT.height
      positions[i * 3 + 2] = 0

      seed[i] = Math.random()
      size[i] = 0.5 + Math.random() * 1.8
    }

    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(positions, 3))
    g.setAttribute('aDisk', new BufferAttribute(disk, 2))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    g.setAttribute('aSize', new BufferAttribute(size, 1))
    return g
  }, [count])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: frozen ? 12 : 0 },
          uSpeed: { value: 0.16 },
          uYMin: { value: SHAFT.yMin },
          uHeight: { value: SHAFT.height },
          uRadiusTop: { value: SHAFT.radiusTop },
          uRadiusBottom: { value: SHAFT.radiusBottom },
          uSize: { value: 3.0 },
          uPixelRatio: { value: pixelRatio },
          uColor: { value: tokenColor('--color-text') },
          uCoreColor: { value: tokenColor('--color-gold-lite') },
        },
      }),
    // uTime/uPixelRatio aktualizujemy niżej, materiał ma powstać raz
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    material.uniforms.uPixelRatio.value = pixelRatio
  }, [material, pixelRatio])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  // Przy frameloop="demand" (reduced-motion) nikt nie odpali renderu po tym,
  // jak geometria trafi do sceny — statyczna klatka musi być wymuszona.
  useEffect(() => {
    invalidate()
  }, [invalidate, geometry, material])

  useFrame((_, delta) => {
    if (frozen) return
    // clamp — po powrocie z nieaktywnej karty delta potrafi być ogromna
    material.uniforms.uTime.value += Math.min(delta, 0.05)
  })

  return <points geometry={geometry} material={material} />
}
