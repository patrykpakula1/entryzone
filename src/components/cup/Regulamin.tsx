import { useId, useRef, useState } from 'react'

/** Treść dokładnie z entryzone-tresci.md, sekcja „REGULAMIN”. */
const RULES = [
  'Drużyna zgłasza 5 zawodników. Rezerwowy jest opcjonalny i musi być zgłoszony przed startem turnieju — po pierwszym meczu składu nie zmieniamy.',
  'Konta muszą być bez blokad VAC i Overwatch. Konto z blokadą to walkower.',
  'Drużyna stawia się na serwerze do 15 minut po wyznaczonej godzinie. Po tym czasie mecz przyznajemy przeciwnikowi.',
  'Wszelkie oszustwa — cheaty, smurfy, granie na cudzym koncie — oznaczają dyskwalifikację całej drużyny i blokadę w kolejnych edycjach.',
  'Spory zgłasza kapitan, na Discordzie, w trakcie meczu. Zgłoszenia po zakończeniu mapy nie są rozpatrywane.',
  'Decyzje sędziego są ostateczne.',
  'Obraźliwe zachowanie wobec przeciwników, sędziów lub widzów kończy się usunięciem z turnieju bez zwrotu wpisowego.',
  'Organizator może zmienić terminarz — zmiany ogłaszamy na Discordzie z wyprzedzeniem.',
  'Udział w turnieju oznacza zgodę na transmisję meczu i publikację wyniku wraz z nickami zawodników.',
]

/** Rozwijana sekcja regulaminu — zwinięta domyślnie, cel linku „Zapoznaj się z regulaminem” na stronie głównej. */
export function Regulamin() {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="regulamin"
      className="scroll-mt-24 bg-bg px-6 pb-16 sm:scroll-mt-32 sm:pb-24"
    >
      <div className="mx-auto max-w-[700px]">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 border-b border-border py-5 text-left"
        >
          <span className="flex items-baseline gap-3">
            <span className="font-display text-xl uppercase tracking-[0.2em] text-text sm:text-2xl">
              Regulamin
            </span>
            <span className="text-sm text-text/40">
              {RULES.length} punktów
            </span>
          </span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          >
            <path
              d="M3 6l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          id={panelId}
          style={{ height: open ? contentRef.current?.scrollHeight : 0 }}
          className="overflow-hidden transition-[height] duration-300 ease-out"
        >
          <div ref={contentRef}>
            <ol className="flex flex-col">
              {RULES.map((rule, i) => (
                <li
                  key={i}
                  className="flex gap-4 border-b border-border py-5 last:border-b-0"
                >
                  <span className="font-display shrink-0 text-copper">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-text">{rule}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
