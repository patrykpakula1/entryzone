import { partners, type Partner } from '../../data/partners'

const CONTACT_EMAIL = 'entryzone@wp.pl'

/** Inicjały z nazwy — pierwsze litery pierwszych dwóch słów. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

function PartnerCard({ partner }: { partner: Partner }) {
  const content = (
    <>
      <span className="font-display flex size-16 items-center justify-center rounded-full border border-gold text-xl tracking-[0.1em] text-gold transition-colors duration-200 group-hover:border-gold-lite">
        {initials(partner.name)}
      </span>
      <span className="font-display text-lg uppercase tracking-[0.2em] text-text">
        {partner.name}
      </span>
      {(partner.role || partner.tagline) && (
        <span className="flex flex-col items-center gap-1">
          {partner.role && (
            <span className="font-display text-xs uppercase tracking-[0.2em] text-copper">
              {partner.role}
            </span>
          )}
          {partner.tagline && (
            <span className="text-sm text-text/60">{partner.tagline}</span>
          )}
        </span>
      )}
    </>
  )
  const className = 'group flex flex-col items-center gap-4 text-center'

  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  )
}

function PartnerLogo({ partner }: { partner: Partner & { logo: string } }) {
  const img = (
    <img src={partner.logo} alt={partner.name} className="h-10 w-auto sm:h-12" />
  )

  return partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noreferrer"
      className="opacity-70 transition-opacity duration-200 hover:opacity-100"
    >
      {img}
    </a>
  ) : (
    img
  )
}

/**
 * Sekcja Partnerzy na stronie głównej. Przy pustej tablicy w data/partners.ts
 * pokazuje stan pusty (zaproszenie do kontaktu). Partner z logiem trafia do
 * siatki logotypów, partner bez logo — do karty tekstowej z inicjałami. Pod
 * listą zostaje linijka z kontaktem dla kolejnych partnerów.
 */
export function Partners() {
  return (
    <section className="flex flex-col items-center bg-bg px-6 pt-4 pb-16 sm:pt-6 sm:pb-24">
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
          <>
            <ul className="flex flex-wrap items-start justify-center gap-10">
              {partners.map((partner) => (
                <li key={partner.name}>
                  {partner.logo ? (
                    <PartnerLogo partner={{ ...partner, logo: partner.logo }} />
                  ) : (
                    <PartnerCard partner={partner} />
                  )}
                </li>
              ))}
            </ul>
            <p className="text-sm text-text/60">
              Chcesz zostać partnerem? Napisz:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-gold underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-gold-lite"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </>
        )}
      </div>
    </section>
  )
}
