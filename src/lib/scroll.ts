import type Lenis from 'lenis'

/**
 * Navbar i App żyją poza komponentem, który tworzy Lenisa (useSmoothScroll),
 * więc potrzebują wspólnego miejsca, skąd mogą wywołać scrollTo bez
 * przeciągania instancji przez propsy przez całe drzewo.
 */
let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

/** Reset scrolla na sam początek — używane przy zmianie trasy. */
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo(0, 0)
  }
}

/**
 * Scroll do elementu z odsunięciem pod stały pasek nawigacji — używane przy
 * wejściu na trasę z hashem (np. /cup#regulamin).
 */
export function scrollToElement(el: HTMLElement) {
  const offset = -(window.innerWidth >= 640 ? 128 : 96)
  if (lenis) {
    // Lenis mierzy wysokość dokumentu raz przy starcie — na nowo wejściu
    // z hashem trzeba ją przeliczyć, inaczej limit potrafi być za krótki
    // i scrollTo w stronę dołu strony ucina się w połowie.
    lenis.resize()
    lenis.scrollTo(el, { offset })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

/** Blokuje scroll pod pełnoekranowym menu mobilnym. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
    return
  }

  document.body.style.overflow = locked ? 'hidden' : ''
}
