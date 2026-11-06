import { registration } from '../../data/registration'
import { prizes } from '../../data/prizes'
import { partners } from '../../data/partners'
import { tournamentCancelled } from '../../data/tournament'

const FORMAT = [
  { label: 'Drużyny', text: '16 składów po 5 zawodników (+ opcjonalnie 1 rezerwowy)' },
  { label: 'System', text: 'single elimination — jedna porażka kończy udział' },
  { label: 'Mecze', text: 'BO1 we wszystkich rundach, BO3 w finale' },
  { label: 'Mapy', text: 'aktywna pula Premier, veto systemem ban/ban/pick' },
  { label: 'Serwery', text: 'FACEIT' },
  { label: 'Zapisy', text: 'przez FACEIT, otwarte dla wszystkich, bez limitu rangi' },
  {
    label: 'Terminarz',
    text: 'Sobota 14 listopada, 14:00: runda 1 i ćwierćfinały (BO1). Niedziela 15 listopada: półfinał 1 o 17:00, półfinał 2 o 18:15 (BO1), wielki finał BO3 o 20:00 — wszystko z komentarzem na żywo. Check-in kapitanów: sobota 14 listopada, 12:30–13:00.',
  },
  { label: 'Udział', text: 'bezpłatny' },
  {
    label: 'Nagrody',
    text: `Pula ${prizes.poolTotal} zł — ${prizes.first} zł za I miejsce, ${prizes.second} zł za II miejsce, dla MVP turnieju ${prizes.mvpPrize}`,
  },
]

/** Partnerzy tego turnieju — z data/partners.ts, po `role` zawierającym „Cup #1”. */
const cupPartners = partners.filter((partner) => partner.role?.includes('Cup #1'))

/** Zamiast opisu i formatu (terminy, pula, check-in) — krótka informacja o odwołaniu. */
function CancelledOverview() {
  return (
    <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">Entryzone Cup #1</h1>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-copper">
            Turniej odwołany
          </p>
        </div>

        <div className="flex flex-col gap-6 text-lg leading-loose text-text/70 sm:text-xl">
          <p>
            Pierwszy turniej EntryZone został odwołany. Dziękujemy wszystkim
            drużynom za zapisy.
          </p>
          <p>
            O kolejnych turniejach poinformujemy na Discordzie i w social
            mediach.
          </p>
        </div>

        <a
          href={registration.discordUrl}
          target="_blank"
          rel="noreferrer"
          className="font-display inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-sm uppercase tracking-[0.2em] text-bg transition-colors duration-200 hover:bg-gold-lite sm:text-base"
        >
          Dołącz na Discorda
        </a>
      </div>
    </section>
  )
}

/** Nagłówek + opis + format CUP‑u. Treść: entryzone-tresci.md, sekcja „CUP — opis turnieju”. */
export function CupOverview() {
  if (tournamentCancelled) return <CancelledOverview />

  return (
    <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">Entryzone Cup #1</h1>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-copper">
            Otwarty turniej CS2 — {registration.startDate}
          </p>
        </div>

        <div className="flex flex-col gap-6 text-lg leading-loose text-text/70 sm:text-xl">
          <p>
            Pierwsza edycja otwartego turnieju EntryZone. 16 drużyn, jedna
            drabinka, jeden zwycięzca. Bez kwalifikacji i bez limitu rangi —
            liczy się tylko to, kto wygra swój mecz.
          </p>
          <p>
            Rozgrywka w systemie pucharowym: przegrywasz i kończysz turniej,
            więc każda mapa jest finałem. Wszystkie rundy w formacie BO1,
            wielki finał BO3.
          </p>
        </div>

        <ul className="flex w-full flex-col divide-y divide-border text-left">
          {FORMAT.map((item) => (
            <li key={item.label} className="flex gap-4 py-4 sm:gap-6">
              <span className="font-display w-24 shrink-0 text-sm uppercase tracking-[0.1em] text-copper sm:w-28">
                {item.label}
              </span>
              <span className="text-text">{item.text}</span>
            </li>
          ))}
        </ul>

        {cupPartners.length > 0 && (
          <ul className="flex w-full flex-col gap-2 border-y border-gold/40 py-4 text-sm text-text/70">
            {cupPartners.map((partner) => (
              <li key={partner.name}>
                Partner turnieju:{' '}
                {partner.url ? (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-gold-lite"
                  >
                    {partner.name}
                  </a>
                ) : (
                  <span className="text-text">{partner.name}</span>
                )}
                {partner.tagline && <> · {partner.tagline}</>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
