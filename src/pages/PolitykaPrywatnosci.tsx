import { Navbar } from '../components/nav/Navbar'
import { Footer } from '../components/layout/Footer'
import { usePageMeta } from '../hooks/usePageMeta'

const SECTIONS = [
  {
    label: 'Administrator',
    text: 'Organizator EntryZone. Kontakt w sprawach danych osobowych: entryzone@wp.pl.',
  },
  {
    label: 'Zbierane dane',
    text: 'Formularz zgłoszeniowy (Google Forms) zbiera: nazwę drużyny, nicki zawodników, linki do profili Steam oraz kontakt Discord.',
  },
  {
    label: 'Cel przetwarzania',
    text: 'Organizacja turnieju, kontakt z uczestnikami oraz rozliczenie nagród.',
  },
  {
    label: 'Podstawa prawna',
    text: 'Zgoda uczestnika (art. 6 ust. 1 lit. a RODO) oraz wykonanie umowy — udział w turnieju (art. 6 ust. 1 lit. b RODO).',
  },
  {
    label: 'Okres przechowywania',
    text: 'Do zakończenia turnieju i rozliczenia nagród.',
  },
  {
    label: 'Podmiot przetwarzający',
    text: 'Formularz zgłoszeniowy działa na Google Forms — w tym zakresie Google LLC przetwarza dane jako podmiot przetwarzający.',
  },
  {
    label: 'Publikacja wyników',
    text: 'Nicki zawodników biorących udział w turnieju są publikowane w wynikach, drabince i na liście zwycięzców.',
  },
  {
    label: 'Twoje prawa',
    text: 'Dostęp do danych, ich sprostowanie, usunięcie, ograniczenie przetwarzania, sprzeciw wobec przetwarzania oraz prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).',
  },
]

export function PolitykaPrywatnosci() {
  usePageMeta(
    'EntryZone — Polityka prywatności',
    'Polityka prywatności serwisu EntryZone: jakie dane zbieramy przy zapisach na turniej i jak je przetwarzamy.',
  )

  return (
    <>
      <Navbar mode="page" />
      <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <span className="h-px w-12 bg-gold" />
            <h1 className="text-4xl text-text sm:text-5xl">Polityka prywatności</h1>
          </div>

          <p className="text-lg leading-loose text-text/70 sm:text-xl">
            Ta polityka opisuje, jakie dane zbieramy podczas zapisów na
            turniej i jak je przetwarzamy.
          </p>

          <ul className="flex w-full flex-col divide-y divide-border text-left">
            {SECTIONS.map((item) => (
              <li key={item.label} className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-6">
                <span className="font-display w-full shrink-0 text-sm uppercase tracking-[0.1em] text-copper sm:w-40">
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
