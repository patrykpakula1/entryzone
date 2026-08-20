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
 * Koniec toru jest tak dobrany, żeby w chwili TRACER.hit grot wypadał
 * dokładnie na sygnecie: w poziomie na osi kamery, w pionie na 44% wysokości
 * kadru. Obie te wartości nie zależą od proporcji ekranu, więc pocisk trafia
 * w znak tak samo na monitorze i na telefonie.
 */
export const TRACER = {
  start: new Vector3(0.85, -2.4, 6.5),
  end: new Vector3(-0.184, 2.872, -21),
  /** wystrzał */
  launch: 0.08,
  /** grot dotyka sygnetu — od tego momentu leci uderzenie */
  hit: 0.88,
  /** koniec toru: dobieg smugi, gdyby nic jej nie zatrzymało */
  impact: 0.92,
  /** rozpęd zamiast ruszania z miejsca */
  easing: 0.9,
  /** prefers-reduced-motion — klatka, na której pocisk zastyga */
  frozenProgress: 0.3,
} as const

/** Kierunek lotu — jedna definicja dla smugi i pierścienia uderzeniowego. */
export const TRACER_DIRECTION = new Vector3()
  .subVectors(TRACER.end, TRACER.start)
  .normalize()

/** Postęp wzdłuż toru dla danego postępu intra. */
export function tracerProgress(flight: number): number {
  const t = clamp01((flight - TRACER.launch) / (TRACER.impact - TRACER.launch))
  return Math.pow(t, TRACER.easing)
}

/** Postęp toru w chwili trafienia — dalej pocisk już nie leci. */
export const HIT_PROGRESS = tracerProgress(TRACER.hit)

/** Punkt trafienia w scenie. Rzutuje się na środek sygnetu. */
export const HIT_POINT = new Vector3().lerpVectors(
  TRACER.start,
  TRACER.end,
  HIT_PROGRESS,
)

/** Obrót pierścienia: rozchodzi się w poprzek toru, czyli na boki kadru. */
export const HIT_QUATERNION = (() => {
  const pivot = new Object3D()
  pivot.position.copy(HIT_POINT)
  pivot.lookAt(TRACER.start)
  return pivot.quaternion.clone()
})()

/**
 * Uderzenie. Zaczyna się dokładnie tam, gdzie grot dotyka sygnetu — rozbłysk,
 * pierścień, rozpad znaku i drganie kamery czytają ten sam postęp scrolla,
 * więc nic nie może się rozjechać z trafieniem.
 */
export const IMPACT = {
  start: TRACER.hit,
  /** odłamki dolatują, rozbłysk dogasa */
  end: 0.99,
  /** zasięg pierścienia w jednostkach sceny — wychodzi poza kadr */
  ringReach: 13,
  /** drganie kamery: krótkie kopnięcie, nie kołysanie */
  shakeEnd: 0.925,
  shakeAmplitude: 0.16,
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

/**
 * Wyjście z intra, 0..1. Osobna oś dopięta za lotem: dzięki temu przejście
 * dokłada się do osi czasu, nie ruszając ani jednej wartości z faz 0-3.
 */
export type Exit = { value: number }

/**
 * Przejście do kolejnej sekcji. Rozbłysk zalewa kadr, a pod nim kamera
 * przechodzi na drugą stronę trafienia i opada wzdłuż smugi w ciemność —
 * tam, gdzie zaczyna się treść strony.
 *
 * Kolejność bloom < swap < clear jest wiążąca: przeskok kamery musi wypaść
 * pod szczelnym rozbłyskiem, inaczej widać cięcie.
 */
export const EXIT = {
  /**
   * Kiedy rozbłysk wyjścia zaczyna narastać — jeszcze w skali lotu, przed
   * jego końcem. Podejmuje blask uderzenia, zanim ten zgaśnie, więc światło
   * przybiera jednym ruchem zamiast błysnąć drugi raz.
   */
  riseFrom: 0.93,
  /** rozbłysk urósł na tyle, że zaszywa kadr */
  bloom: 0.34,
  /** kamera przeskakuje z toru rozpędu na tor opadania */
  swap: 0.4,
  /** rozbłysk zaczyna gasnąć — od tej chwili widać już opadanie */
  clear: 0.46,
  /** rozbłysk zgaszony, zostaje sama scena */
  clearEnd: 0.8,
  /**
   * Dokąd kadr rzuca się w stronę trafienia, nim zaleje go światło. Krótko
   * i wzdłuż toru pocisku: kamera ma zostać w słupie kurzu, żeby rozpęd miał
   * co mijać. Dalszy lot i tak byłby pod szczelnym rozbłyskiem, więc nic by
   * nie wniósł.
   */
  lunge: new Vector3().copy(CAMERA.end).addScaledVector(TRACER_DIRECTION, 1.4),
  /**
   * Wynurzenie: wysoko w smudze, w najjaśniejszym jej miejscu. Kamera stoi
   * dalej od słupa niż w locie — z bliska w kadrze mieści się ledwie skrawek
   * światła i opadanie czyta się jak płaska plama, zwłaszcza na telefonie,
   * gdzie kurzu jest pięć razy mniej.
   */
  top: new Vector3(0, 7.5, 5),
  /** koniec opadania: pod smugą, w ciemności — dalej przejmuje strona */
  bottom: new Vector3(0, -7.5, 5),
} as const
