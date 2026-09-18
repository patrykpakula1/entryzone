import { partners } from '../../data/partners'

const CONTACT_EMAIL = 'entryzone@wp.pl'

/**
 * Sekcja Partnerzy na stronie głównej. Przy pustej tablicy w data/partners.ts
 * pokazuje stan pusty (zaproszenie do kontaktu); gdy pojawi się pierwszy
 * rekord z logiem, sekcja sama przełącza się na siatkę logotypów — bez
 * dodatkowych zmian w tym komponencie.
 */
export function Partners() {
  return (
    <section className="flex flex-col items-center bg-bg px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-text sm:text-3xl">
            Partnerzy
          </h2>
        </div>

        {partners.length === 0 ? (
          <div className="flex flex-col items-center gap-6">
            <p className="text-lg leading-loose text-text/70 sm:text-xl">
              Szukamy partnerów — sprzętowych, hostingowych i sklepów ze
              skinami.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-display inline-flex items-center justify-center rounded-full border border-gold px-6 py-2 text-sm uppercase tracking-[0.2em] text-gold transition-colors duration-200 hover:bg-gold/10"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        ) : (
          <ul className="flex flex-wrap items-center justify-center gap-10">
            {partners.map((partner) => (
              <li key={partner.name}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noreferrer"
                  className="opacity-70 transition-opacity duration-200 hover:opacity-100"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 w-auto sm:h-12"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
