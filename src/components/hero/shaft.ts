import { Object3D, Vector3 } from 'three'
import { clamp01 } from '../../lib/math'

/**
 * Geometria smugi światła. Jedna definicja dla kurzu i dla poświaty,
 * żeby cząsteczki nie wychodziły poza stożek.
 */
export const SHAFT = {
  /** wysokość słupa światła w jednostkach sceny */
  height: 16,
  /** dolna krawędź — cząsteczki zawijają się z góry na dół */
  yMin: -8,
  /** promień u góry (wąsko, przy źródle) */
  radiusTop: 0.5,
  /** promień u dołu (rozlany) */
  radiusBottom: 3.1,
} as const

export const DUST_COUNT_DESKTOP = 2500
export const DUST_COUNT_MOBILE = 500

/**
 * Postęp intra, 0..1. ScrollTrigger wpisuje tu wartość, pętla renderu ją
 * czyta — po drodze nie ma setState, więc przewijanie nie przerysowuje
 * Reacta.
 */
export type Flight = { value: number }

/**
 * Tor pocisku — od punktu tuż przed kamerą w głąb sceny, wewnątrz smugi.
 * Lekki skos w bok i w górę, żeby wydłużony kształt czytał się na ekranie,
 * a nie zwijał w punkt na osi patrzenia.
 */
export const TRACER = {
  start: new Vector3(0.85, -2.4, 6.5),
  end: new Vector3(-0.4, 3.2, -21),
  /** wystrzał */
  launch: 0.08,
  /** grot dotyka płyty — od tego momentu gaśnie napis i rusza uderzenie */
  hit: 0.88,
  /** koniec toru: resztki smugi giną w rozbłysku */
  impact: 0.92,
  /** rozpęd zamiast ruszania z miejsca */
  easing: 0.9,
  /** prefers-reduced-motion — klatka, na której pocisk zastyga */
  frozenProgress: 0.3,
} as const

/** Kierunek lotu — jedna definicja dla smugi, celu i pierścienia. */
export const TRACER_DIRECTION = new Vector3()
  .subVectors(TRACER.end, TRACER.start)
  .normalize()

/** Postęp wzdłuż toru dla danego postępu intra. */
export function tracerProgress(flight: number): number {
  const t = clamp01((flight - TRACER.launch) / (TRACER.impact - TRACER.launch))
  return Math.pow(t, TRACER.easing)
}

/** Punkt, w którym grot jest w chwili trafienia — środek płyty siedzi na nim. */
const hitPoint = new Vector3().lerpVectors(
  TRACER.start,
  TRACER.end,
  tracerProgress(TRACER.hit),
)

/**
 * Cel: kanciasta płyta z chevronem, w poprzek toru, przodem do nadlatującego
 * pocisku. Wyłania się z mroku w trakcie lotu — widać, dokąd lecimy.
 */
export const TARGET = {
  /**
   * Płyta stoi kawałek za punktem trafienia. Poświata grotu jest płatem
   * zwróconym do kamery, czyli niemal równoległym do lica płyty — bez tego
   * odstępu połowa poświaty wpadałaby pod powierzchnię i ucinała się kantem.
   */
  position: hitPoint.clone().addScaledVector(TRACER_DIRECTION, 0.9),
  radius: 3.3,
  /** początek wyłaniania się z ciemności */
  revealStart: 0.24,
  /** pełna widoczność, na długo przed trafieniem */
  revealEnd: 0.82,
  /** prefers-reduced-motion — cel majaczy w mroku statycznej klatki */
  frozenReveal: 0.4,
} as const

/** Obrót płyty i pierścienia: lico prostopadle do toru, przodem do pocisku. */
export const TARGET_QUATERNION = (() => {
  const pivot = new Object3D()
  pivot.position.copy(TARGET.position)
  pivot.lookAt(TRACER.start)
  return pivot.quaternion.clone()
})()

/**
 * Uderzenie. Zaczyna się dokładnie tam, gdzie grot dotyka płyty — rozbłysk,
 * pierścień, odłamki i drganie kamery czytają jeden i ten sam postęp scrolla,
 * więc nic nie może się rozjechać z trafieniem.
 */
export const IMPACT = {
  start: TRACER.hit,
  /** odłamki dolatują, rozbłysk dogasa */
  end: 0.99,
  /** drganie kamery gaśnie dużo wcześniej niż reszta */
  shakeEnd: 0.945,
  /** wychylenie kamery w jednostkach sceny */
  shakeAmplitude: 0.3,
} as const

/**
 * Kamera rusza za pociskiem dopiero, gdy ten zdąży odskoczyć — inaczej lot
 * nie ma czego mijać. Zostaje wewnątrz słupa kurzu i przed poświatą (z = -2),
 * żeby scena nie została za plecami.
 */
export const CAMERA = {
  start: new Vector3(0, 0, 9),
  end: new Vector3(-0.15, 1.7, 1),
  /** postęp, przy którym kamera zaczyna gonić */
  chase: 0.18,
} as const
