import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  ShaderMaterial,
  Vector2,
} from 'three'
import { tokenColor } from '../../lib/tokens'
import { range, smoothstep } from '../../lib/math'
import { IMPACT, TARGET, TARGET_QUATERNION, type Flight } from './shaft'

const vertexShader = /* glsl */ `
  uniform float uBreak;

  attribute vec3 aPivot;
  attribute vec3 aFly;
  attribute vec3 aSpin;
  attribute float aEdge;
  attribute float aOuter;
  attribute float aSeed;

  varying vec2 vPlate;
  varying float vEdge;
  varying float vOuter;

  // Rodrigues — obrót odłamka wokół własnego środka.
  vec3 turn(vec3 v, vec3 axis, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
  }

  void main() {
    // Współrzędne w nierozbitej płycie: chevron jest wmalowany w odłamki
    // i leci razem z nimi, zamiast wisieć osobną warstwą.
    vPlate = position.xy;
    vEdge = aEdge;
    vOuter = aOuter;

    // Kopnięcie i wyhamowanie — odłamki nie odjeżdżają liniowo.
    float d = pow(uBreak, 0.85);

    vec3 local = turn(position - aPivot, aSpin, d * (1.6 + aSeed * 3.2));
    vec3 p = aPivot + local + aFly * d * (2.0 + aSeed * 3.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uDark;
  uniform vec3 uSurface;
  uniform vec3 uGold;
  uniform vec3 uGoldLite;
  uniform float uReveal;
  uniform float uBreak;

  varying vec2 vPlate;
  varying float vEdge;
  varying float vOuter;

  // Chevron z sygnetu, przeliczony z logo.svg na jednostki płyty.
  const vec2 APEX = vec2(0.0, 1.28);
  const vec2 ARM_L = vec2(-1.12, -1.28);
  const vec2 ARM_R = vec2(1.12, -1.28);
  const vec2 BAR_L = vec2(-0.64, -1.6);
  const vec2 BAR_R = vec2(0.64, -1.6);

  float segment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  float stroke(float d, float halfWidth) {
    return 1.0 - smoothstep(halfWidth, halfWidth + 0.05, d);
  }

  void main() {
    float arms = min(segment(vPlate, ARM_L, APEX), segment(vPlate, APEX, ARM_R));
    float chevron = max(
      stroke(arms, 0.18),
      stroke(segment(vPlate, BAR_L, BAR_R), 0.12)
    );

    // Obrys wychodzi z mroku przed licem: alfa rośnie szybciej niż jasność
    // powierzchni, więc najpierw widać sam kontur celu.
    float rimReveal = pow(uReveal, 0.55);
    float faceReveal = pow(uReveal, 1.8);

    // Pas przy krawędzi odłamka. Przed rozpadem świeci tylko obwód płyty,
    // linie pęknięć zapalają się dopiero w chwili trafienia.
    float band = 1.0 - smoothstep(0.0, 0.13, vEdge);
    float crack = smoothstep(0.0, 0.1, uBreak);
    float rim = band * mix(vOuter, 1.0, crack);

    vec3 col = mix(uDark, uSurface, faceReveal);
    col += uGold * chevron * 0.75;
    col += mix(uGold, uGoldLite, rim) * rim * 0.9;

    // Świeże pęknięcia są rozgrzane i stygną w locie.
    col += uGoldLite * band * crack * (1.0 - smoothstep(0.0, 0.35, uBreak)) * 0.8;

    // Wyłanianie i gaśnięcie idą alfą, nie kolorem — nieprzezroczysta płyta
    // w kolorze tła i tak wycinałaby dziurę w mijanym kurzu.
    float alpha = rimReveal * (1.0 - smoothstep(0.3, 0.85, uBreak));

    gl_FragColor = vec4(col, alpha);
  }
`

/** Uniformy siedzą w zamemoizowanym materiale — ustawiamy je punktowo. */
function setUniform(material: ShaderMaterial, name: string, value: number) {
  material.uniforms[name].value = value
}

/** Ile klinów na obwodzie. Dwa pierścienie, więc dwa razy tyle odłamków. */
const SEGMENTS = 9

/** Deterministyczny szum — układ pęknięć ma być ten sam przy każdym wejściu. */
function noise(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

type Shard = {
  /** obwód odłamka w przestrzeni płyty */
  points: Vector2[]
  /** czy krawędź points[i] do points[i+1] leży na obwodzie całej płyty */
  outer: boolean[]
}

/**
 * Płyta pocięta na odłamki: dziewięciokąt o poszarpanym promieniu, rozbity
 * pierścieniem wewnętrznym na kliny i trapezy. Odłamki są dokładnym podziałem
 * płyty, więc przed uderzeniem składają się w jedną, szczelną powierzchnię.
 */
function fracture(radius: number): Shard[] {
  const rand = noise(0x5eed4)
  const outer: Vector2[] = []
  const inner: Vector2[] = []

  for (let i = 0; i < SEGMENTS; i++) {
    const angle = (i / SEGMENTS) * Math.PI * 2 + (rand() - 0.5) * 0.24
    const ro = radius * (0.84 + rand() * 0.16)
    const ri = radius * (0.3 + rand() * 0.26)
    outer.push(new Vector2(Math.cos(angle) * ro, Math.sin(angle) * ro))
    inner.push(new Vector2(Math.cos(angle) * ri, Math.sin(angle) * ri))
  }

  const shards: Shard[] = []
  const center = new Vector2(0, 0)

  for (let i = 0; i < SEGMENTS; i++) {
    const j = (i + 1) % SEGMENTS
    shards.push({
      points: [center, inner[i], inner[j]],
      outer: [false, false, false],
    })
    shards.push({
      points: [inner[i], outer[i], outer[j], inner[j]],
      outer: [false, true, false, false],
    })
  }

  return shards
}

/**
 * Każdy odłamek to wachlarz trójkątów z jego środka. Dzięki temu aEdge
 * interpoluje się jako odległość od własnej krawędzi — obrys i linie pęknięć
 * wychodzą z shadera, bez osobnej siatki linii.
 */
function plateGeometry(): BufferGeometry {
  const shards = fracture(TARGET.radius)
  const rand = noise(0xb14de)

  const position: number[] = []
  const pivot: number[] = []
  const fly: number[] = []
  const spin: number[] = []
  const edge: number[] = []
  const outer: number[] = []
  const seed: number[] = []

  const span = new Vector2()

  for (const shard of shards) {
    const c = new Vector2()
    for (const p of shard.points) c.add(p)
    c.divideScalar(shard.points.length)

    // Na zewnątrz w płaszczyźnie płyty, z domieszką ruchu w stronę kamery
    // (lokalne +Z patrzy tam, skąd nadleciał pocisk).
    const away = c.clone().normalize()
    const dir = [
      away.x * (0.7 + rand() * 0.6),
      away.y * (0.7 + rand() * 0.6),
      0.25 + rand() * 0.5,
    ]

    const axis = [rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1]
    const len = Math.hypot(axis[0], axis[1], axis[2]) || 1
    const s = rand()

    for (let i = 0; i < shard.points.length; i++) {
      const a = shard.points[i]
      const b = shard.points[(i + 1) % shard.points.length]

      // Wysokość trójkąta: odległość środka odłamka od tej krawędzi. Po
      // interpolacji daje w każdym punkcie odległość od krawędzi w jednostkach
      // sceny, więc obrys ma wszędzie tę samą grubość.
      span.subVectors(b, a)
      const height =
        Math.abs(span.x * (c.y - a.y) - span.y * (c.x - a.x)) /
        (span.length() || 1)
      const flag = shard.outer[i] ? 1 : 0

      position.push(c.x, c.y, 0, a.x, a.y, 0, b.x, b.y, 0)
      edge.push(height, 0, 0)

      for (let v = 0; v < 3; v++) {
        pivot.push(c.x, c.y, 0)
        fly.push(dir[0], dir[1], dir[2])
        spin.push(axis[0] / len, axis[1] / len, axis[2] / len)
        outer.push(flag)
        seed.push(s)
      }
    }
  }

  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(position), 3))
  g.setAttribute('aPivot', new BufferAttribute(new Float32Array(pivot), 3))
  g.setAttribute('aFly', new BufferAttribute(new Float32Array(fly), 3))
  g.setAttribute('aSpin', new BufferAttribute(new Float32Array(spin), 3))
  g.setAttribute('aEdge', new BufferAttribute(new Float32Array(edge), 1))
  g.setAttribute('aOuter', new BufferAttribute(new Float32Array(outer), 1))
  g.setAttribute('aSeed', new BufferAttribute(new Float32Array(seed), 1))
  return g
}

type Props = {
  /** postęp intra spod ScrollTrigger */
  flight: Flight
  /** prefers-reduced-motion — cel majaczy w mroku, nic nie pęka */
  frozen: boolean
}

/**
 * Cel na końcu toru. Jedna siatka, jeden materiał — rozpad liczy vertex
 * shader z dwóch uniformów, więc scroll nie przelicza osiemnastu obiektów.
 */
export function Target({ flight, frozen }: Props) {
  const invalidate = useThree((s) => s.invalidate)

  const geometry = useMemo(() => plateGeometry(), [])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: DoubleSide,
        // Cel stoi dalej niż cokolwiek innego w scenie, więc o kolejność dba
        // samo sortowanie — zapis głębokości tylko wycinałby dziury w kurzu.
        transparent: true,
        depthWrite: false,
        uniforms: {
          uDark: { value: tokenColor('--color-bg') },
          uSurface: { value: tokenColor('--color-surface') },
          uGold: { value: tokenColor('--color-gold') },
          uGoldLite: { value: tokenColor('--color-gold-lite') },
          uReveal: { value: 0 },
          uBreak: { value: 0 },
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

  // Przy frameloop="demand" (reduced-motion) nikt nie odpali renderu sam z siebie.
  useEffect(() => {
    setUniform(material, 'uReveal', frozen ? TARGET.frozenReveal : 0)
    invalidate()
  }, [invalidate, material, frozen])

  useFrame(() => {
    if (frozen) return

    setUniform(
      material,
      'uReveal',
      smoothstep(TARGET.revealStart, TARGET.revealEnd, flight.value),
    )
    setUniform(material, 'uBreak', range(IMPACT.start, IMPACT.end, flight.value))
  })

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={TARGET.position}
      quaternion={TARGET_QUATERNION}
    />
  )
}
