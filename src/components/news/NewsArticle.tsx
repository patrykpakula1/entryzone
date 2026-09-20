import { Link } from 'react-router-dom'
import type { NewsEntry } from '../../data/news'
import { formatDate } from '../../lib/date'

/** Sekcja podstrony /aktualnosci/:slug — treść jednego wpisu. */
export function NewsArticle({ entry }: { entry: NewsEntry }) {
  return (
    <section className="flex flex-col items-center bg-bg px-6 pb-16 pt-32 sm:pb-24 sm:pt-40">
      <article className="mx-auto flex w-full max-w-[700px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="h-px w-12 bg-gold" />
          <span className="text-sm text-text/50">{formatDate(entry.date)}</span>
          <h1 className="text-4xl text-text sm:text-5xl">{entry.title}</h1>
        </div>

        <div className="flex flex-col gap-6 text-lg leading-loose text-text/80 sm:text-xl">
          {entry.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {entry.links && (
          <ul className="flex flex-col items-center gap-3 text-base sm:flex-row sm:gap-8">
            {entry.links.map((link) => {
              const className =
                'text-gold underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-gold-lite'
              return (
                <li key={link.to}>
                  {link.to.startsWith('/') ? (
                    <Link to={link.to} className={className}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.to} target="_blank" rel="noopener noreferrer" className={className}>
                      {link.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <Link
          to="/aktualnosci"
          className="text-sm text-gold underline decoration-border underline-offset-4 transition-colors duration-200 hover:text-gold-lite"
        >
          ← Wszystkie aktualności
        </Link>
      </article>
    </section>
  )
}
