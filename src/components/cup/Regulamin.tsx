import { useId, useRef, useState } from 'react'
import { prizes } from '../../data/prizes'

/** Treść dokładnie z entryzone-tresci.md, sekcja „REGULAMIN”. */
const RULES = [
  'Skład to 5 zawodników + opcjonalny rezerwowy, zgłoszony przed startem. Po pierwszym meczu składu nie zmieniamy.',
  `Wpisowe ${prizes.entryFee} zł od drużyny, płatne przed turniejem. Cała pula trafia do zwycięzców.`,
  'Turniej trwa dwa dni. Sobota: runda 1 i ćwierćfinały. Niedziela: półfinały i finał. Wymagana dostępność w obu terminach.',
  'Konta bez blokad VAC i Overwatch. Blokada to walkower.',
  'Drużyna stawia się do 15 minut po wyznaczonej godzinie. Później mecz przyznajemy przeciwnikowi.',
  'Nieobecność opłaconej drużyny to walkower. Wpisowe zostaje w puli.',
  'Spory zgłasza kapitan sędziemu na serwerze, w trakcie meczu. Mecz zostaje zapauzowany.',
  'Decyzja sędziego jest wiążąca w meczu. Odwołanie na #odwołania w ciągu 30 minut od końca meczu, z dowodem. Decyzja organizatora jest ostateczna.',
  'Cheaty, smurfy, gra na cudzym koncie to dyskwalifikacja i blokada w kolejnych edycjach.',
  'Obraźliwe zachowanie kończy się usunięciem z turnieju bez zwrotu wpisowego.',
  `Pula ${prizes.poolTotal} zł jest gwarantowana niezależnie od liczby zgłoszonych drużyn.`,
  'Przy mniej niż 8 zgłoszonych drużynach organizator może przełożyć turniej.',
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
