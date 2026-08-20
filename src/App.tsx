import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Hero } from './components/hero/Hero'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()

  // Przy prefers-reduced-motion zostaje natywny scroll — bez dobiegu.
  useSmoothScroll(!reducedMotion)

  return (
    <>
      <Hero />

      {/* TYMCZASOWE — miejsce na pierwszą sekcję treści. Stoi tu po to, żeby
          było widać, dokąd wychodzi hero: intro kończy się w ciemności o tym
          samym kolorze, więc granicy między animacją a stroną nie ma. */}
      <section className="flex min-h-svh items-center justify-center bg-bg px-6">
        <p className="text-center text-[0.625rem] tracking-[0.4em] text-border uppercase sm:text-xs">
          Tu wchodzi treść
        </p>
      </section>
    </>
  )
}
