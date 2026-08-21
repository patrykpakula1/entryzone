export function About() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-bg px-6 pb-16 pt-32 sm:pb-20 sm:pt-40">

      <div className="mx-auto flex max-w-[700px] flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <span className="h-px w-12 bg-gold" />
          <h2 className="text-4xl text-text sm:text-5xl">O nas</h2>
        </div>

        <div className="flex flex-col gap-6 text-lg leading-loose text-text/70 sm:text-xl">
          <p>
            EntryZone to nowa organizacja turniejowa CS2 łącząca ze sobą
            fanów e‑sportu. Powstała z prostego powodu: większość rozgrywek
            jest albo zamknięta dla znanych składów, albo prowadzona tak, że
            nikt nie wie, kto z kim gra i o której.
          </p>
          <p>
            Robimy to inaczej. Jasna drabinka, ustalone terminy, sędzia
            dostępny w trakcie meczu i wyniki publikowane od razu po
            zakończeniu rundy. Bez zaproszeń, bez znajomości, z jasnymi
            zasadami i nagrodami.
          </p>
          <p>
            Startujemy z pierwszym CUP‑em. Dołącz i pokaż kto jest nowym
            królem EntryZone!
          </p>
        </div>
      </div>
    </section>
  )
}
