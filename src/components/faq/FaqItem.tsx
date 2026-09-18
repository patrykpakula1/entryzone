import { useId, useRef, useState } from 'react'

type FaqItemProps = {
  question: string
  answer: string
}

/** Pojedyncze pytanie FAQ — ten sam wzorzec rozwijania co sekcja Regulaminu na /cup. */
export function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <li className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-text sm:text-lg">{question}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id={panelId}
        style={{ height: open ? contentRef.current?.scrollHeight : 0 }}
        className="overflow-hidden transition-[height] duration-300 ease-out"
      >
        <div ref={contentRef}>
          <p className="pb-5 text-text/70">{answer}</p>
        </div>
      </div>
    </li>
  )
}
