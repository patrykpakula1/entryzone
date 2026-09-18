import { Link, useParams } from 'react-router-dom'
import { Navbar } from '../components/nav/Navbar'
import { NewsArticle } from '../components/news/NewsArticle'
import { Footer } from '../components/layout/Footer'
import { news, type NewsEntry } from '../data/news'
import { usePageMeta } from '../hooks/usePageMeta'

function NotFound() {
  usePageMeta('EntryZone — nie znaleziono wpisu', 'Ten wpis aktualności nie istnieje.')

  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-8 bg-bg px-6 text-center">
      <h1 className="text-4xl text-text sm:text-5xl">Nie znaleziono wpisu</h1>
      <Link
        to="/aktualnosci"
        className="font-display inline-flex items-center justify-center rounded-full bg-gold px-10 py-4 text-sm uppercase tracking-[0.2em] text-bg transition-colors duration-200 hover:bg-gold-lite sm:text-base"
      >
        Wszystkie aktualności
      </Link>
    </section>
  )
}

function Found({ entry }: { entry: NewsEntry }) {
  usePageMeta(`EntryZone — ${entry.title}`, entry.excerpt)

  return <NewsArticle entry={entry} />
}

export function AktualnosciWpis() {
  const { slug } = useParams<{ slug: string }>()
  const entry = news.find((item) => item.slug === slug)

  return (
    <>
      <Navbar mode="page" />
      {entry ? <Found entry={entry} /> : <NotFound />}
      <Footer />
    </>
  )
}
