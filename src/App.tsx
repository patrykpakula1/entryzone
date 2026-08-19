import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Hero } from './components/hero/Hero'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()

  // Przy prefers-reduced-motion zostaje natywny scroll — bez dobiegu.
  useSmoothScroll(!reducedMotion)

  return <Hero />
}
