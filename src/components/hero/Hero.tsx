import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { range } from '../../lib/math'
import { HeroScene } from './HeroScene'
import { buildDebris, paintDebris, type Shard } from './shatter'
import { IMPACT, type Flight } from './shaft'

gsap.registerPlugin(ScrollTrigger)

/** Ile ekranów przewijania zajmuje przypięte intro. */
const PIN_SCREENS = 3

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  const section = useRef<HTMLElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const sigil = useRef<HTMLImageElement>(null)
  const mark = useRef<HTMLHeadingElement>(null)
  const debris = useRef<HTMLDivElement>(null)
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
    let breaking: boolean | null = null
    const paint = () => {
      const progress = range(IMPACT.start, IMPACT.end, flight.value)
      const broken = progress > 0

      if (broken !== breaking) {
        breaking = broken
        // Odłamki pokrywają znak co do piksela, więc podmiana jest niewidoczna.
        if (overlayEl) overlayEl.style.visibility = broken ? 'hidden' : 'visible'
        if (host) host.style.visibility = broken ? 'visible' : 'hidden'
      }

      if (broken) paintDebris(shards, progress)
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
    }
  }, [flight, reducedMotion])

  return (
    <section ref={section} className="relative h-svh w-full overflow-hidden">
      <HeroScene flight={flight} />

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
    </section>
  )
}
