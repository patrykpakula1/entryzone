import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { range } from '../../lib/math'
import { Navbar } from '../nav/Navbar'
import { HeroScene } from './HeroScene'
import { buildDebris, DEBRIS_SPENT, paintDebris, type Shard } from './shatter'
import { EXIT, IMPACT, type Exit, type Flight } from './shaft'

gsap.registerPlugin(ScrollTrigger)

/** Ile ekranów przewijania zajmuje sam lot, czyli fazy 0-3. */
const FLIGHT_SCREENS = 0.75
/** Ile ekranów zajmuje wyjście: rozbłysk, przejście, opadanie. */
const EXIT_SCREENS = 0.25
const PIN_SCREENS = FLIGHT_SCREENS + EXIT_SCREENS
/**
 * Lot ma na osi czasu długość 1, więc wyjście to wprost proporcja ekranów.
 * Skrócenie pinu zmienia oba składniki w tej samej skali, więc wszystkie
 * ułamki faz zostają tam, gdzie były — zmienia się tempo, nie kompozycja.
 */
const EXIT_SPAN = EXIT_SCREENS / FLIGHT_SCREENS

/** Rozbłysk startuje jako punkt światła w miejscu trafienia. */
const VEIL_SEED = 0.14
/**
 * Skala, przy której pełny kolor gradientu wychodzi poza róg kadru. Promień
 * rozbłysku jest podany w vmax, więc rośnie razem z ekranem — ta sama skala
 * zaszywa kadr na monitorze i na telefonie.
 */
const VEIL_COVER = 3.8

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  const section = useRef<HTMLElement>(null)
  const nav = useRef<HTMLElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const sigil = useRef<HTMLImageElement>(null)
  const mark = useRef<HTMLHeadingElement>(null)
  const debris = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLSpanElement>(null)
  const veil = useRef<HTMLDivElement>(null)
  // Jeden obiekt na całe życie komponentu: GSAP go tweenuje, scena czyta.
  const [flight] = useState<Flight>(() => ({ value: 0 }))
  const [exit] = useState<Exit>(() => ({ value: 0 }))

  // Poza kadrem scena nie ma czego rysować — hero to jedyna sekcja z 3D,
  // a reszta strony nie musi płacić za jego pętlę renderu.
  const [onScreen, setOnScreen] = useState(true)

  useEffect(() => {
    const el = section.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      // Zapas, żeby scena wracała do życia, zanim wjedzie w kadr.
      { rootMargin: '20% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    // prefers-reduced-motion: żadnego pinu ani scruba, zostaje statyczna klatka.
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: `+=${PIN_SCREENS * 100}%`,
          pin: true,
          // Jawnie, bo #root jest kolumną flex, a GSAP przy rodzicu flex
          // domyślnie wyłącza pinSpacing — następna sekcja wjeżdżałaby
          // na hero w trakcie animacji.
          pinSpacing: true,
          // Ułamek sekundy dobiegu — scroll w obie strony nie skacze klatkami.
          // Krótszy pin to ten sam gest przewinięty przez dwa razy więcej osi
          // czasu, więc dobieg musi być krótszy, żeby animacja nie wlokła się
          // za palcem.
          scrub: 0.25,
          invalidateOnRefresh: true,
        },
      })

      // Pierwszy tween nadaje osi czasu długość 1, więc pozycje i czasy
      // kolejnych są wprost ułamkami całego lotu.
      tl.to(flight, { value: 1, duration: 1, ease: 'none' }, 0)
      tl.to(hint.current, { opacity: 0, duration: 0.06, ease: 'none' }, 0)

      // Pasek wjeżdża z góry dokładnie w chwili trafienia — ten sam punkt
      // na osi, od którego IMPACT liczy rozbłysk i rozpad znaku.
      tl.fromTo(
        nav.current,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.06, ease: 'power2.out' },
        IMPACT.start,
      )

      // Wyjście dopięte za lotem: rozbłysk zalewa kadr, a pod nim kamera
      // przechodzi na drugą stronę trafienia i opada do kolejnej sekcji.
      tl.to(exit, { value: 1, duration: EXIT_SPAN, ease: 'none' }, 1)

      // Rozbłysk puchnie z punktu trafienia, nie zapala się płasko na całym
      // kadrze — dlatego rośnie skalą, a nie samą przezroczystością. Wystartuje
      // jeszcze w trakcie lotu, żeby przejąć blask uderzenia bez przerwy.
      // Narastanie idzie na power2.out: błysk ma uderzyć od razu i dopiero
      // dobierać resztę, a nie rozpędzać się przez pół fazy.
      const peak = 1 + EXIT_SPAN * EXIT.bloom
      gsap.set(veil.current, { scale: VEIL_SEED, transformOrigin: '50% 44%' })
      tl.to(
        veil.current,
        {
          opacity: 1,
          scale: VEIL_COVER,
          duration: peak - EXIT.riseFrom,
          ease: 'power2.out',
        },
        EXIT.riseFrom,
      )
      tl.to(
        veil.current,
        {
          opacity: 0,
          // Dalej rośnie, gdy gaśnie — światło się rozchodzi, a nie ścieka.
          scale: VEIL_COVER * 1.3,
          duration: EXIT_SPAN * (EXIT.clearEnd - EXIT.clear),
          ease: 'power2.out',
        },
        1 + EXIT_SPAN * EXIT.clear,
      )
    }, section)

    const overlayEl = overlay.current
    const host = debris.current
    let shards: Shard[] = []
    let disposed = false

    // Odłamki są kopiami znaku, więc muszą powstać po tym, jak znak dostanie
    // swoje ostateczne wymiary — i powstać na nowo, gdy te się zmienią.
    const rebuild = () => {
      if (disposed || !host || !sigil.current || !mark.current) return

      const base = host.getBoundingClientRect()
      const seal = sigil.current.getBoundingClientRect()

      shards = buildDebris(
        host,
        [
          { el: sigil.current, shape: 'wedges' },
          { el: mark.current, shape: 'lattice' },
        ],
        {
          x: seal.left + seal.width / 2 - base.left,
          y: seal.top + seal.height / 2 - base.top,
        },
      )
    }

    rebuild()
    ScrollTrigger.addEventListener('refresh', rebuild)
    // Krój dociąga się po pierwszym renderze i zmienia obrys napisu.
    void document.fonts.ready.then(rebuild)

    // Znak nie ma własnego tweena — rozpad idzie wprost z postępu pocisku,
    // tego samego, który czyta scena.
    let whole: boolean | null = null
    let flying: boolean | null = null
    let painted = -1

    const paint = () => {
      const progress = range(IMPACT.start, IMPACT.end, flight.value)

      // Odłamki pokrywają znak co do piksela, więc podmiana jest niewidoczna.
      const intact = progress === 0
      if (intact !== whole) {
        whole = intact
        if (overlayEl) overlayEl.style.visibility = intact ? 'visible' : 'hidden'
      }

      // Gruz gaśnie długo przed końcem intra i już nie wraca — dalej nie ma po
      // co trzymać kilkudziesięciu warstw kompozytora nad canvasem.
      const alive = progress > 0 && progress < DEBRIS_SPENT
      if (alive !== flying) {
        flying = alive
        if (host) host.style.visibility = alive ? 'visible' : 'hidden'
      }

      // Scrub potrafi stać w miejscu przez wiele klatek — wtedy nie ma czego
      // przemalowywać.
      if (alive && progress !== painted) {
        painted = progress
        paintDebris(shards, progress)
      }
    }
    gsap.ticker.add(paint)

    return () => {
      disposed = true
      gsap.ticker.remove(paint)
      ScrollTrigger.removeEventListener('refresh', rebuild)
      ctx.revert()
      host?.replaceChildren()
      host?.style.removeProperty('visibility')
      overlayEl?.style.removeProperty('visibility')
      // Postępy są współdzielone ze sceną i przeżywają efekt — po zdjęciu
      // sterowania muszą wrócić na start, inaczej scena zostaje w pół lotu.
      flight.value = 0
      exit.value = 0
    }
  }, [flight, exit, reducedMotion])

  return (
    <>
      <Navbar ref={nav} mode="hero" />

      <section ref={section} className="relative h-svh w-full overflow-hidden">
        <HeroScene flight={flight} exit={exit} onScreen={onScreen} />

        <div
          ref={overlay}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 sm:gap-10"
        >
          <img
            ref={sigil}
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            width={120}
            height={120}
            className="w-20 sm:w-28"
          />

          {/* text-indent kompensuje światło doklejane przez letter-spacing
              za ostatnią literą — bez tego napis siedzi nieco w lewo */}
          <h1
            ref={mark}
            className="text-[clamp(1.5rem,7.5vw,4rem)] leading-none text-text [text-indent:0.28em] [letter-spacing:0.28em]"
          >
            Entryzone
          </h1>
        </div>

        {/* Warstwa odłamków: kopie znaku pocięte clip-path, budowane w efekcie.
            Perspektywa daje im lot w stronę kamery, nie samo rozsuwanie. */}
        <div
          ref={debris}
          aria-hidden="true"
          className="pointer-events-none invisible absolute inset-0 [perspective:900px]"
        />

        <span
          ref={hint}
          className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[0.625rem] tracking-[0.4em] text-copper uppercase sm:bottom-10 sm:text-xs"
        >
          Scroll
        </span>

        {/* Rozbłysk wyjścia. Pod nim kamera przechodzi na drugą stronę trafienia,
            więc w szczycie musi być szczelny — stąd warstwa w DOM, a nie mesh
            w scenie, którą przesłoniłby własny kurz. Środek gradientu wypada
            tam, gdzie pocisk trafia w sygnet, a miękka krawędź pozwala mu
            napłynąć na kadr zamiast wjechać prostokątem. Promień koła jest
            podany wprost: przy domyślnym farthest-corner zanik wypadałby poza
            krótszym bokiem i zamiast miękkiej krawędzi widać by było kant
            pudełka. */}
        <div
          ref={veil}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 [background:radial-gradient(circle_42vmax_at_50%_44%,var(--color-text)_0%,var(--color-gold-lite)_30%,var(--color-gold)_52%,transparent_78%)]"
        />
      </section>
    </>
  )
}
