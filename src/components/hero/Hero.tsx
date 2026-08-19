import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { range } from '../../lib/math'
import { HeroScene } from './HeroScene'
import { type Flight, TRACER } from './shaft'

gsap.registerPlugin(ScrollTrigger)

/** Ile ekranów przewijania zajmuje przypięte intro. */
const PIN_SCREENS = 3

/**
 * Sygnet i wordmark świecą przez cały lot i gasną dopiero, gdy grot dotyka
 * sygnetu. Liczone z tych samych stałych co tor pocisku — własny tween na osi
 * czasu odjechałby od trafienia przy każdej korekcie toru.
 */
function wordmarkOpacity(flight: number): number {
  // Pierwiastek: zanik startuje ostro i dobija miękko, jak reakcja na cios.
  return 1 - Math.pow(range(TRACER.hit, TRACER.impact, flight), 0.6)
}

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  const section = useRef<HTMLElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLSpanElement>(null)
  // Jeden obiekt na całe życie komponentu: GSAP go tweenuje, scena czyta.
  const [flight] = useState<Flight>(() => ({ value: 0 }))

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
          // Ułamek sekundy dobiegu — scroll w obie strony nie skacze klatkami.
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      // Pierwszy tween nadaje osi czasu długość 1, więc pozycje i czasy
      // kolejnych są wprost ułamkami całego przewijania.
      tl.to(flight, { value: 1, duration: 1, ease: 'none' }, 0)
      tl.to(hint.current, { opacity: 0, duration: 0.06, ease: 'none' }, 0)
    }, section)

    // Napis nie ma własnego tweena — jego przezroczystość idzie wprost
    // z postępu pocisku, tego samego, który czyta scena.
    const wordmark = overlay.current
    const setOpacity = gsap.quickSetter(wordmark, 'opacity')
    const paint = () => setOpacity(wordmarkOpacity(flight.value))
    gsap.ticker.add(paint)

    return () => {
      gsap.ticker.remove(paint)
      ctx.revert()
      wordmark?.style.removeProperty('opacity')
    }
  }, [flight, reducedMotion])

  return (
    <section
      ref={section}
      className="relative h-svh w-full overflow-hidden"
    >
      <HeroScene flight={flight} />

      <div
        ref={overlay}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 sm:gap-10"
      >
        <img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="w-20 sm:w-28"
        />

        {/* text-indent kompensuje światło doklejane przez letter-spacing
            za ostatnią literą — bez tego napis siedzi nieco w lewo */}
        <h1 className="text-[clamp(1.5rem,7.5vw,4rem)] leading-none text-text [text-indent:0.28em] [letter-spacing:0.28em]">
          Entryzone
        </h1>
      </div>

      <span
        ref={hint}
        className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[0.625rem] tracking-[0.4em] text-copper uppercase sm:bottom-10 sm:text-xs"
      >
        Scroll
      </span>
    </section>
  )
}
