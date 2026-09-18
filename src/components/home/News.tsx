import { Link } from 'react-router-dom'
import { news } from '../../data/news'
import { NewsCard } from '../news/NewsCard'

/** Sekcja „Najnowsze” na stronie głównej — trzy ostatnie wpisy, nad Partnerami. */
export function News() {
  if (news.length === 0) return null

  const latest = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <section className="flex flex-col items-center bg-bg px-6 pt-4 pb-16 sm:pt-6 sm:pb-24">
      <div className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="h-px w-12 bg-gold" />
          <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-text sm:text-3xl">
            Najnowsze
          </h2>
        </div>

        <ul className="flex w-full flex-col">
          {latest.map((entry) => (
            <NewsCard key={entry.slug} entry={entry} />
          ))}
        </ul>

        <Link
          to="/aktualnosci"
          className="font-display inline-flex items-center justify-center rounded-full border border-gold px-6 py-2 text-sm uppercase tracking-[0.2em] text-gold transition-colors duration-200 hover:bg-gold/10"
        >
          Wszystkie aktualności
        </Link>
      </div>
    </section>
  )
}
