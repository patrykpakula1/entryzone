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
