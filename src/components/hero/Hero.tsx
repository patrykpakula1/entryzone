import { HeroScene } from './HeroScene'

export function Hero() {
  return (
    <section className="relative h-svh w-full overflow-hidden">
      <HeroScene />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 sm:gap-10">
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

      <span className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-[0.625rem] tracking-[0.4em] text-copper uppercase sm:bottom-10 sm:text-xs">
        Scroll
      </span>
    </section>
  )
}
