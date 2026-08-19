import { Vector3 } from 'three'

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
  /** grot dotyka sygnetu — od tego momentu gaśnie napis */
  hit: 0.88,
  /** koniec toru; reszta przewijania zostaje na uderzenie (krok 4) */
  impact: 0.92,
  /** prefers-reduced-motion — klatka, na której pocisk zastyga */
  frozenProgress: 0.3,
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
