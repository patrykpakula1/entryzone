import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { scrollToElement, scrollToTop } from './lib/scroll'
import { SocialSidebar } from './components/layout/SocialSidebar'
import { Home } from './pages/Home'
import { Zapisy } from './pages/Zapisy'
import { ONas } from './pages/ONas'
import { Cup } from './pages/Cup'
import { League } from './pages/League'
import { Winners } from './pages/Winners'
import { Discord } from './pages/Discord'
import { Regulamin } from './pages/Regulamin'
import { PolitykaPrywatnosci } from './pages/PolitykaPrywatnosci'
import { PolitykaCookies } from './pages/PolitykaCookies'

/**
 * Router nie resetuje scrolla między trasami — bez tego nowa strona
 * otwiera się z scrollY odziedziczonym po poprzedniej. Stoi przed
 * <Routes> w drzewie, więc jej layout effect odpala się wcześniej niż
 * te w środku (np. pin Hero) — reset zdąży, zanim cokolwiek zmierzy
 * geometrię względem scrolla.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) return
    scrollToTop()
  }, [pathname, hash])

  // Hash osobno: element docelowy istnieje dopiero po zamontowaniu strony,
  // więc czeka na kolejny tick zamiast liczyć na layout effect wyżej.
  useEffect(() => {
    if (!hash) return
    const id = window.setTimeout(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) scrollToElement(el)
    }, 0)
    return () => window.clearTimeout(id)
  }, [pathname, hash])

  return null
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()

  // Przy prefers-reduced-motion zostaje natywny scroll — bez dobiegu.
  useSmoothScroll(!reducedMotion)

  return (
    <>
      <ScrollToTop />
      <SocialSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/zapisy" element={<Zapisy />} />
        <Route path="/o-nas" element={<ONas />} />
        <Route path="/cup" element={<Cup />} />
        <Route path="/league" element={<League />} />
        <Route path="/winners" element={<Winners />} />
        <Route path="/discord" element={<Discord />} />
        <Route path="/regulamin" element={<Regulamin />} />
        <Route path="/polityka-prywatnosci" element={<PolitykaPrywatnosci />} />
        <Route path="/polityka-cookies" element={<PolitykaCookies />} />
      </Routes>
    </>
  )
}
