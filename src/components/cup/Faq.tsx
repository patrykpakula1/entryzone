import { faq } from '../../data/faq'
import { FaqItem } from '../faq/FaqItem'

/** Sekcja FAQ pod regulaminem na /cup — nagłówek w stylu Regulaminu, pytania rozwijane pojedynczo. */
export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-bg px-6 pb-16 sm:scroll-mt-32 sm:pb-24"
    >
      <div className="mx-auto max-w-[700px]">
        <div className="flex w-full items-baseline justify-between gap-4 border-b border-border py-5">
          <span className="font-display text-xl uppercase tracking-[0.2em] text-text sm:text-2xl">
            FAQ
          </span>
          <span className="text-sm text-text/40">{faq.length} pytań</span>
        </div>

        <ul className="flex flex-col">
          {faq.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
