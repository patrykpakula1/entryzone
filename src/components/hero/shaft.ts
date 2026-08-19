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
 * Tor pocisku — od punktu tuż przed kamerą w głąb sceny, wewnątrz smugi.
 * Lekki skos w bok i w górę, żeby wydłużony kształt czytał się na ekranie,
 * a nie zwijał w punkt na osi patrzenia.
 */
export const TRACER = {
  start: new Vector3(0.85, -2.4, 6.5),
  end: new Vector3(-0.4, 3.2, -21),
  /** sekundy lotu */
  flight: 1.8,
  /** przerwa między strzałami */
  pause: 1.0,
  /** prefers-reduced-motion — klatka, na której pocisk zastyga */
  frozenProgress: 0.3,
} as const
