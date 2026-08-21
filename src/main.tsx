import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// scrollRestoration + reset na (0,0) siedzi w index.html, w blokującym
// skrypcie w <head> — musi wykonać się zanim przeglądarka zdąży przywrócić
// zapamiętaną pozycję, a ten plik (moduł, więc odroczony do sparsowania
// całego dokumentu) byłby na to za późno.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
