import { registration } from '../../data/registration'
import { discordMemberCount } from '../../data/discord'

/** Sekcja podstrony /discord. Treść: entryzone-tresci.md, sekcja „DISCORD — podstrona”. */
export function DiscordCta() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">Tu się dzieje reszta</h1>
        </div>

        <div className="flex flex-col gap-6 text-lg leading-loose text-text/70 sm:text-xl">
          <p>
            Discord to nasz serwer dowodzenia. Terminarz, przydział serwerów,
            zgłaszanie sporów, szukanie graczy do składu i ogłoszenia o
            zapisach — wszystko idzie w pierwszej kolejności tam, a na stronę
            trafia później.
          </p>
          <p>
            Jeśli chcesz grać, jest to konieczne. Jeśli chcesz tylko oglądać,
            też warto — transmisje zapowiadamy tam z wyprzedzeniem.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <a
            href={registration.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="font-display inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-sm uppercase tracking-[0.2em] text-bg transition-colors duration-200 hover:bg-gold-lite sm:text-base"
          >
            Dołącz do serwera
          </a>
          <p className="text-sm text-text/50">
            <span className="font-display text-gold">{discordMemberCount}</span>{' '}
            osób już jest.
          </p>
        </div>
      </div>
    </section>
  )
}
