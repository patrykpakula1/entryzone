import { news } from '../../data/news'
import { NewsCard } from './NewsCard'

/** Sekcja podstrony /aktualnosci — pełna lista wpisów, najnowsze na górze. */
export function NewsList() {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">Aktualności</h1>
        </div>

        {sorted.length === 0 ? (
          <p className="text-center text-text/70">
            Nic tu jeszcze nie ma — pierwsze ogłoszenia pojawią się wkrótce.
          </p>
        ) : (
          <ul className="flex w-full flex-col">
            {sorted.map((entry) => (
              <NewsCard key={entry.slug} entry={entry} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
