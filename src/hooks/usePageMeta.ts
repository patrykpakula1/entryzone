import { useEffect } from 'react'

/**
 * SPA bez SSR — index.html niesie tylko meta strony głównej. Każda
 * podstrona nadpisuje title i description przy montowaniu, żeby karty w
 * wynikach wyszukiwania i podglądy linków różniły się między trasami.
 */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title

    const meta = document.querySelector('meta[name="description"]')
    meta?.setAttribute('content', description)
  }, [title, description])
}
