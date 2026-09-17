import { Navbar } from '../components/nav/Navbar'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'

const SECTIONS = [
  {
    label: 'Niezbędne',
    text: 'Pliki wymagane do poprawnego działania serwisu, np. zapamiętanie ustawień technicznych. Bez nich strona nie działałaby prawidłowo.',
  },
  {
    label: 'Analityczne',
    text: 'Nie są używane.',
  },
  {
    label: 'Marketingowe',
    text: 'Nie są używane.',
  },
]

export function PolitykaCookies() {
  usePageMeta(
    'EntryZone — Polityka cookies',
    'Polityka cookies serwisu EntryZone: korzystamy wyłącznie z plików niezbędnych do działania strony.',
  )

  return (
    <>
      <Navbar mode="page" />
      <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <span className="h-px w-12 bg-gold" />
            <h1 className="text-4xl text-text sm:text-5xl">Polityka cookies</h1>
          </div>

          <p className="text-lg leading-loose text-text/70 sm:text-xl">
            EntryZone nie używa ciasteczek analitycznych ani marketingowych —
            nie śledzimy Cię i nie wysyłamy danych do systemów reklamowych.
            Korzystamy wyłącznie z plików niezbędnych technicznie do działania
            serwisu.
          </p>

          <ul className="flex w-full flex-col divide-y divide-border text-left">
            {SECTIONS.map((item) => (
              <li key={item.label} className="flex gap-4 py-4 sm:gap-6">
                <span className="font-display w-28 shrink-0 text-sm uppercase tracking-[0.1em] text-copper sm:w-32">
                  {item.label}
                </span>
                <span className="text-text">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </>
  )
}
