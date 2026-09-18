import { Navbar } from '../components/nav/Navbar'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'
import { registration } from '../data/registration'
import { prizes } from '../data/prizes'
import { rules } from '../data/rules'

export function Regulamin() {
  usePageMeta(
    'EntryZone — Regulamin',
    'Pełny regulamin Entryzone Cup #1 — zasady składów, wpisowego, terminarza, sporów i dyskwalifikacji.',
  )

  return (
    <>
      <Navbar mode="page" />
      <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <span className="h-px w-12 bg-gold" />
            <h1 className="text-4xl text-text sm:text-5xl">Regulamin</h1>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-copper">
              Entryzone Cup #1 — {registration.startDate}
            </p>
          </div>

          <p className="text-lg leading-loose text-text/70 sm:text-xl">
            16 drużyn, system pucharowy (single elimination) — BO1 we
            wszystkich rundach, wielki finał BO3. Wpisowe {prizes.entryFee}{' '}
            zł od drużyny, gwarantowana pula nagród {prizes.poolTotal} zł.
          </p>

          <ol className="flex w-full flex-col">
            {rules.map((rule, i) => (
              <li
                key={i}
                className="flex gap-4 border-b border-border py-5 text-left first:border-t"
              >
                <span className="font-display shrink-0 text-copper">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-text">{rule}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Footer />
    </>
  )
}
