import { Link } from 'react-router-dom'
import type { NewsEntry } from '../../data/news'
import { formatDate } from '../../lib/date'

/** Jedna pozycja na liście /aktualnosci i w sekcji „Najnowsze” na stronie głównej. */
export function NewsCard({ entry }: { entry: NewsEntry }) {
  return (
    <li className="border-b border-border py-8 text-left last:border-b-0">
      <Link
        to={`/aktualnosci/${entry.slug}`}
        className="group flex flex-col gap-3"
      >
        <span className="text-sm text-text/50">{formatDate(entry.date)}</span>
        <h3 className="font-display text-xl uppercase tracking-[0.15em] text-text transition-colors duration-200 group-hover:text-gold-lite sm:text-2xl">
          {entry.title}
        </h3>
        <p className="text-text/70">{entry.excerpt}</p>
        <span className="text-sm text-gold underline decoration-border underline-offset-4 transition-colors duration-200 group-hover:text-gold-lite">
          Czytaj dalej
        </span>
      </Link>
    </li>
  )
}
