import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Link, useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { lockScroll } from '../../lib/scroll'

type Featured = 'solid' | 'outline'

type NavItem = { label: string; to: string; featured?: Featured }

const ITEMS: NavItem[] = [
  { label: 'Zapisy', to: '/zapisy', featured: 'solid' },
  { label: 'O nas', to: '/o-nas' },
  { label: 'Cup', to: '/cup' },
  { label: 'League', to: '/league' },
  { label: 'Winners', to: '/winners' },
  { label: 'Discord', to: '/discord', featured: 'outline' },
]

const linkBase =
  'font-display text-sm uppercase tracking-[0.2em] transition-colors duration-200'

type NavbarProps = {
  /**
   * 'hero' — pasek startuje schowany i wjeżdża wg timeline'u Hero (patrz
   * Hero.tsx, sterowane scrollem). 'page' — zwykły statyczny pasek na
   * podstronach, widoczny od razu, bez animacji wjazdu.
   */
  mode?: 'hero' | 'page'
}

/**
 * Na stronie głównej pasek renderuje Hero (ref trafia do jego timeline'u).
 * Na podstronach każda z nich renderuje go sama, w trybie 'page'.
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { mode = 'page' },
  ref,
) {
  const reducedMotion = usePrefersReducedMotion()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const localRef = useRef<HTMLElement | null>(null)

  const setRefs = (node: HTMLElement | null) => {
    localRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  // Bez scrolla sterowanego GSAP-em nie ma czego wyczekiwać — pasek stoi
  // na miejscu od startu. Z animacją zaczyna schowany, a wjazd dopina Hero.
  useLayoutEffect(() => {
    if (mode !== 'hero' || reducedMotion || !localRef.current) return
    gsap.set(localRef.current, { yPercent: -100 })
  }, [mode, reducedMotion])

  useEffect(() => {
    lockScroll(open)
    return () => lockScroll(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isActive = (item: NavItem) => location.pathname === item.to

  const renderLink = (
    item: NavItem,
    className: string,
    style?: React.CSSProperties,
  ) => (
    <Link
      key={item.label}
      to={item.to}
      onClick={() => setOpen(false)}
      style={style}
      className={className}
    >
      {item.label}
    </Link>
  )

  return (
    <nav
      ref={setRefs}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md"
    >
      <div className="relative z-10 flex w-full items-center justify-between px-10 py-3">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          aria-label="EntryZone — strona główna"
        >
          <img
            src="/logo-lockup.svg"
            alt="EntryZone"
            className="h-14 w-auto sm:h-24"
          />
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-10 sm:flex">
          {ITEMS.map((item) => (
            <li key={item.label}>
              {renderLink(
                item,
                item.featured === 'solid'
                  ? `${linkBase} rounded-full bg-gold px-5 py-2 text-bg hover:bg-gold-lite`
                  : item.featured === 'outline'
                    ? `${linkBase} rounded-full border border-gold px-5 py-2 text-gold hover:bg-gold/10`
                    : `${linkBase} border-b-2 pb-1.5 ${
                        isActive(item)
                          ? 'border-gold text-text'
                          : 'border-transparent text-text hover:text-gold-lite'
                      }`,
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={open}
          className="relative flex h-11 w-11 flex-col items-center justify-center gap-[6px] sm:hidden"
        >
          <span
            className={`block h-px w-7 bg-text transition-transform duration-300 ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-7 bg-text transition-opacity duration-300 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-px w-7 bg-text transition-transform duration-300 ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile fullscreen menu. Pasek nad nim (z-10) zostaje widoczny, więc
          logo i przycisk zamknięcia działają, gdy menu jest otwarte. */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center gap-10 bg-bg pt-24 transition-opacity duration-300 sm:hidden ${
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        {ITEMS.map((item, i) =>
          renderLink(
            item,
            `font-display text-2xl uppercase tracking-[0.2em] duration-300 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            } ${
              item.featured === 'solid'
                ? 'rounded-full bg-gold px-6 py-2 text-bg'
                : item.featured === 'outline'
                  ? 'rounded-full border border-gold px-6 py-2 text-gold'
                  : isActive(item)
                    ? 'text-gold'
                    : 'text-text'
            }`,
            {
              transitionDelay: open ? `${i * 60}ms` : '0ms',
              transitionProperty: 'opacity, transform',
            },
          ),
        )}
      </div>
    </nav>
  )
})
