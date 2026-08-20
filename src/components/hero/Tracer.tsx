import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  DoubleSide,
  type Group,
  Matrix4,
  type Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three'
import { tokenColor } from '../../lib/tokens'
import { range, smoothstep } from '../../lib/math'
import {
  type Flight,
  HIT_PROGRESS,
  TRACER,
  TRACER_DIRECTION,
  tracerProgress,
} from './shaft'

const streakVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const streakFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  uniform float uIntensity;
  uniform float uFade;
  uniform float uWidthHead;
  uniform float uWidthTail;
  uniform float uTaper;

  varying vec2 vUv;

  void main() {
    // 1 przy grocie, 0 na końcu ogona
    float head = vUv.y;

    // Smuga zwęża się ku ogonowi. Szerokość liczona w poprzek płata, nie
    // wycięta w siatce — brzegi mają gasnąć, a nie pokazywać kant.
    float halfWidth = mix(uWidthTail, uWidthHead, head);
    float across = 1.0 - smoothstep(0.0, halfWidth, abs(vUv.x - 0.5));
    across *= across;

    float along = pow(head, uTaper);

    vec3 c = mix(uColor, uHotColor, smoothstep(0.7, 1.0, head) * across);
    gl_FragColor = vec4(c, across * along * uIntensity * uFade);
  }
`

const glowFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHotColor;
  uniform float uIntensity;
  uniform float uFade;

  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = 1.0 - smoothstep(0.0, 1.0, d);
    a *= a;

    vec3 c = mix(uColor, uHotColor, smoothstep(0.45, 1.0, a));
    gl_FragColor = vec4(c, a * uIntensity * uFade);
  }
`

/**
 * Płat smugi: leży wzdłuż lokalnego Z, grot w origin, ogon ciągnie się w +Z.
 * Ustawiany bokiem do kamery, więc nigdy nie pokazuje własnej krawędzi.
 */
function streakGeometry(width: number, length: number) {
  const g = new PlaneGeometry(width, length)
  g.rotateX(-Math.PI / 2)
  g.translate(0, 0, length / 2)
  return g
}

/** Uniformy siedzą w zamemoizowanych materiałach — ustawiamy je punktowo. */
function setFade(material: ShaderMaterial, value: number) {
  material.uniforms.uFade.value = value
}

const point = new Vector3()
const toCamera = new Vector3()
const axisX = new Vector3()
const axisY = new Vector3()
const axisZ = new Vector3()
const basis = new Matrix4()

type Props = {
  /** postęp intra spod ScrollTrigger */
  flight: Flight
  /** prefers-reduced-motion — pocisk zastyga w jednej klatce lotu */
  frozen: boolean
}

/**
 * Świecąca smuga lecąca od kamery w głąb sceny, wprost w sygnet.
 * Pozycją steruje wyłącznie scroll — pocisk stoi, dopóki stoi strona.
 */
export function Tracer({ flight, frozen }: Props) {
  const invalidate = useThree((s) => s.invalidate)
  const camera = useThree((s) => s.camera)

  const group = useRef<Group>(null)
  const glow = useRef<Mesh>(null)

  const core = useMemo(() => streakGeometry(0.5, 2.6), [])
  const halo = useMemo(() => streakGeometry(1.6, 3.6), [])
  const glowPlane = useMemo(() => new PlaneGeometry(0.7, 0.7), [])

  const coreMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: streakVertexShader,
        fragmentShader: streakFragmentShader,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: tokenColor('--color-gold-lite') },
          uHotColor: { value: tokenColor('--color-text') },
          uIntensity: { value: 0.9 },
          uFade: { value: 0 },
          uWidthHead: { value: 0.11 },
          uWidthTail: { value: 0.02 },
          uTaper: { value: 1.9 },
        },
      }),
    [],
  )

  const haloMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: streakVertexShader,
        fragmentShader: streakFragmentShader,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: tokenColor('--color-gold') },
          uHotColor: { value: tokenColor('--color-gold-lite') },
          uIntensity: { value: 0.3 },
          uFade: { value: 0 },
          uWidthHead: { value: 0.34 },
          uWidthTail: { value: 0.07 },
          uTaper: { value: 1.4 },
        },
      }),
    [],
  )

  const glowMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: streakVertexShader,
        fragmentShader: glowFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: tokenColor('--color-gold-lite') },
          uHotColor: { value: tokenColor('--color-text') },
          uIntensity: { value: 0.75 },
          uFade: { value: 0 },
        },
      }),
    [],
  )

  useEffect(() => {
    return () => {
      core.dispose()
      halo.dispose()
      glowPlane.dispose()
      coreMaterial.dispose()
      haloMaterial.dispose()
      glowMaterial.dispose()
    }
  }, [core, halo, glowPlane, coreMaterial, haloMaterial, glowMaterial])

  // Przy frameloop="demand" (reduced-motion) nic nie odpali renderu samo z siebie.
  useEffect(() => {
    invalidate()
  }, [invalidate])

  useFrame(() => {
    if (!group.current || !glow.current) return

    let progress: number = TRACER.frozenProgress
    let fade = 1

    if (!frozen) {
      const t = range(TRACER.launch, TRACER.impact, flight.value)

      // Po trafieniu grot zostaje na sygnecie — dalej nie ma dokąd lecieć.
      progress = Math.min(tracerProgress(flight.value), HIT_PROGRESS)
      // Pełnia blasku przypada na moment dotknięcia sygnetu; zaraz po nim
      // smuga gaśnie, bo pałeczkę przejmuje rozbłysk.
      fade = smoothstep(0, 0.08, t) * (1 - smoothstep(0.95, 0.995, t))
    }

    const visible = fade > 0.001
    group.current.visible = visible
    glow.current.visible = visible

    setFade(coreMaterial, fade)
    setFade(haloMaterial, fade)
    setFade(glowMaterial, fade)

    if (!visible) return

    point.lerpVectors(TRACER.start, TRACER.end, progress)
    group.current.position.copy(point)

    // Baza płata: +Z wzdłuż ogona, +Y (normalna) możliwie wprost do kamery.
    axisZ.copy(TRACER_DIRECTION).negate()
    toCamera.subVectors(camera.position, point).normalize()
    axisX.crossVectors(toCamera, axisZ)
    // Patrzenie dokładnie wzdłuż toru — dowolna prostopadła jest tak samo dobra.
    if (axisX.lengthSq() < 1e-6) axisX.set(1, 0, 0)
    axisX.normalize()
    axisY.crossVectors(axisZ, axisX).normalize()
    basis.makeBasis(axisX, axisY, axisZ)
    group.current.quaternion.setFromRotationMatrix(basis)

    // Perspektywa skraca smugę tym mocniej, im dalej pocisk odleci — ogon
    // rośnie w przeciwną stronę, żeby na ekranie ciągle był kreską, nie kropką.
    const stretch = 1 + progress * 4.2
    const thickness = 1 + progress * 1.6
    group.current.scale.set(thickness, 1, stretch)

    glow.current.position.copy(point)
    glow.current.quaternion.copy(camera.quaternion)
    const head = 1 + progress * 1.5
    glow.current.scale.set(head, head, 1)
  })

  return (
    <>
      <group ref={group}>
        <mesh geometry={halo} material={haloMaterial} />
        <mesh geometry={core} material={coreMaterial} />
      </group>
      <mesh ref={glow} geometry={glowPlane} material={glowMaterial} />
    </>
  )
}
