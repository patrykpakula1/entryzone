import { useEffect, useMemo } from 'react'
import { AdditiveBlending, PlaneGeometry, ShaderMaterial } from 'three'
import { tokenColor } from '../../lib/tokens'
import { SHAFT } from './shaft'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uHalfTop;
  uniform float uHalfBottom;

  varying vec2 vUv;

  void main() {
    float t = 1.0 - vUv.y;                       // 0 u góry, 1 u dołu
    float halfWidth = mix(uHalfTop, uHalfBottom, t);

    float dx = abs(vUv.x - 0.5);
    float core = 1.0 - smoothstep(0.0, halfWidth, dx);
    core *= core;                                 // ostrzejszy rdzeń, miękkie brzegi

    // Światło wchodzi z góry i gaśnie schodząc w dół.
    float vfade = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.1, 0.95, t));

    gl_FragColor = vec4(uColor, core * vfade * uIntensity);
  }
`

/** Poświata słupa światła — tło pod kurzem. Delikatna, ciepła, nie „złota sekcja”. */
export function LightShaft() {
  const geometry = useMemo(
    () => new PlaneGeometry(SHAFT.radiusBottom * 2.4, SHAFT.height),
    [],
  )

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: tokenColor('--color-gold') },
          uIntensity: { value: 0.1 },
          uHalfTop: { value: 0.05 },
          uHalfBottom: { value: 0.26 },
        },
      }),
    [],
  )

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return <mesh geometry={geometry} material={material} position={[0, 0, -2]} />
}
