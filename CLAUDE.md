# EntryZone — strona organizacji esportowej

## Kontekst
Strona organizacji esportowej EntryZone (CS2). Organizujemy turnieje (CUP) i ligę.
Cel podwójny: realna strona dla organizacji + portfolio do sprzedawania stron klientom.
Deadline v1: 12 września.

## Stack
- Vite + React + TypeScript
- Three.js — TYLKO hero na stronie głównej
- GSAP + ScrollTrigger — animacje sterowane scrollem
- Lenis — smooth scroll
- Tailwind — style
- Dane (drużyny, zawodnicy, drabinka, zwycięzcy) w plikach JSON. ZERO backendu w v1.
  Jedyny wyjątek: dwie funkcje serverless Vercel z FACEIT Data API —
  `api/teams.ts` (licznik zapisanych drużyn) i `api/bracket.ts` (drabinka i składy).
  Klucz w zmiennej `FACEIT_API_KEY` na Vercelu — nigdy w repo ani we froncie.
  Żadnych innych endpointów.

## Kolory (używaj wyłącznie tych tokenów)
Jedyne źródło prawdy: blok `@theme` w `src/index.css`. Nie duplikuj tych
wartości w innych plikach — zmiana idzie tam i tylko tam.

--gold:      #E3B25A   /* znak, akcenty */
--gold-lite: #EFC983   /* hover, podświetlenia */
--copper:    #BC8624   /* detale drugoplanowe */
--bg:        #14120E   /* tło główne, ciepła czerń */
--surface:   #211D16   /* karty, sekcje */
--border:    #3A3225   /* ramki, linie */
--text:      #E8E2D4   /* ciepła biel */

W `@theme` żyją jako `--color-gold`, `--color-bg` itd., więc Tailwind generuje
z nich klasy: `bg-gold`, `text-text`, `border-border`. W czystym CSS sięgaj po
`var(--color-gold)`. Nigdy nie wpisuj hexów na sztywno.

Złota używamy MAŁO. Dominuje ciemne tło i ciepła biel. Złoto = znak, jedna linia
akcentu, stan aktywny. Nigdy całe sekcje w złocie.

## Typografia
- Nagłówki i wordmark: Lora (Google Fonts), WERSALIKI, letter-spacing 0.15-0.25em
- Treść: ten sam Lora w wersji regular albo czysty sans (Inter) dla długich tekstów
- Duże kontrasty rozmiarów. Dużo powietrza, mało treści na ekran.

## Logo
- /public/logo.svg — sygnet (okrągła pieczęć, złoty chevron)
- Używać jako favicon i w pasku nawigacji
- W pasku: sygnet + napis ENTRYZONE obok

## Zakres v1 (NIE dokładaj nic poza tym)
1. Strona główna — hero 3D + sekcja zapisów + skróty do podstron
2. CUP — opis turnieju, drabinka, klik w drużynę → skład
3. LEAGUE — opis, zasady, ranking jako sekcja (NIE osobna podstrona)
4. WINNERS — zwycięzcy i MVP każdego turnieju/sezonu
5. DISCORD — zaproszenie
6. Pasek nawigacji + wersja mobilna
7. Zapisy — bezpłatny udział, wyłącznie przez FACEIT (link do turnieju) + licznik miejsc + termin

Poza zakresem v1 (nie proponuj, nie buduj): statystyki zawodników z API,
overlay do streamów, sklep z merchem, logowanie, panel admina, backend, baza danych.
Wyjątek: dozwolone są dane z FACEIT Data API przez funkcje serverless w `api/`
(licznik zapisanych drużyn, drabinka, składy z poziomem i ELO). Pełne statystyki
meczowe (K/D, ADR, MVP) to osobny etap — EntryZone Hub, po turnieju.

## Hero — animacja (osobna, w 5 krokach)
Faza 0: ciemność, cząsteczki kurzu w smudze światła, sygnet + ENTRYZONE, "scroll"
Faza 1: złoty błysk, napis rozsypuje się, z dołu wystrzeliwuje pocisk (świecąca smuga)
Faza 2: kamera leci za pociskiem, kurz jak gwiazdy, po bokach mijamy napisy CUP / LEAGUE / WINNERS
Faza 3: cel — płyta z chevronem, uderzenie, rozbłysk, pierścień, odłamki, drganie
Faza 4: rozbłysk wypełnia kadr, kamera opada w dół do kolejnej sekcji
Pasek nawigacji wjeżdża z góry dopiero w momencie uderzenia.

Wymagania techniczne hero:
- ScrollTrigger z pin (~3 wysokości ekranu) i scrub — animacja STEROWANA scrollem, nie autoplay
- Jedna scena Three.js, jedna pętla render, dispose() przy odmontowaniu
- Pocisk to wydłużony kształt z poświatą, NIE model 3D
- Cząsteczki instancjonowane: desktop 2-3 tys., mobile 500
- Mobile: pixelRatio max 2, bloom wyłączony
- prefers-reduced-motion: statyczna klatka zamiast animacji
- Klik w logo NIE odtwarza intra ponownie — scroll do pierwszej sekcji treści

## Zasady pracy
- Pracujemy SEKCJA PO SEKCJI. Nigdy cała strona jednym poleceniem.
- Po każdej działającej sekcji: commit ORAZ push na GitHuba, bez pytania o zgodę.
  Bez pusha zmiany nie trafiają na produkcję.
- Mobile first — sprawdzaj responsywność po każdej sekcji.
- Zapytaj zanim dodasz nową bibliotekę.
- Zero modeli, tekstur i assetów z CS2 — to własność Valve. Własne kształty.
- Zero fioletowych gradientów, generycznych kart i domyślnego Intera w nagłówkach.
- Jak coś jest niejasne — pytaj, nie zgaduj.

## Referencje
(wklej tu linki do stron, które Ci się podobają)
