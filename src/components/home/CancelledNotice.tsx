import { registration } from '../../data/registration'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Komunikat o odwołanym turnieju — pierwszy element strony głównej, nad hero,
 * w zwykłym przepływie (przewija się razem ze stroną, nie zasłania paska).
 * Pasek nawigacji jest na starcie schowany i wjeżdża dopiero przy uderzeniu
 * w hero, więc do tego czasu komunikat dawno zniknął z kadru. Wyjątek to
 * prefers-reduced-motion: pasek stoi od razu na górze, więc komunikat dostaje
 * górny odstęp równy jego wysokości.
 */
export function CancelledNotice() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <aside
      aria-label="Komunikat o turnieju"
      className={`flex flex-col items-center gap-5 border-b border-gold/40 bg-surface px-6 pb-8 text-center sm:pb-10 ${
        reducedMotion ? 'pt-28 sm:pt-40 xl:pt-28 2xl:pt-40' : 'pt-8 sm:pt-10'
      }`}
    >
      <span className="h-px w-12 bg-gold" />
      <p className="font-display text-xs uppercase tracking-[0.25em] text-copper">
        Komunikat
      </p>
      <div className="flex max-w-[700px] flex-col gap-3">
        <p className="text-xl leading-snug text-text sm:text-2xl">
          EntryZone Cup #1 ({registration.startDate}) został odwołany.
        </p>
        <p className="leading-relaxed text-text/70 sm:text-lg">
          Dziękujemy wszystkim drużynom za zapisy. O kolejnych turniejach
          poinformujemy na Discordzie i w social mediach.
        </p>
      </div>
      <a
        href={registration.discordUrl}
        target="_blank"
        rel="noreferrer"
        className="font-display inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-bg transition-colors duration-200 hover:bg-gold-lite"
      >
        Dołącz na Discorda
      </a>
    </aside>
  )
}
