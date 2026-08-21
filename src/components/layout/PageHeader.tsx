import type { ReactNode } from 'react'
import { Navbar } from '../nav/Navbar'

type PageHeaderProps = {
  title: string
  children?: ReactNode
}

/** Szkielet podstrony: statyczny pasek nawigacji + nagłówek od góry. */
export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <>
      <Navbar mode="page" />
      <main className="flex min-h-svh flex-col items-center bg-bg px-6 pb-20 pt-32 sm:pt-40">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="h-px w-12 bg-gold" />
          <h1 className="text-4xl text-text sm:text-5xl">{title}</h1>
          {children}
        </div>
      </main>
    </>
  )
}
