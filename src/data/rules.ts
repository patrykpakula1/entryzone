import { prizes } from './prizes'

/**
 * Regulamin CUP-u — jedno miejsce do zmiany. Sekcja na /cup (zwinięta,
 * Regulamin) i pełna podstrona /regulamin czytają tę samą listę, więc
 * treść nie może się rozjechać między nimi.
 *
 * Treść dokładnie z entryzone-tresci.md, sekcja „REGULAMIN”.
 */
export const rules = [
  'Udział jest bezpłatny. Zapisy wyłącznie przez FACEIT — każdy zawodnik potrzebuje konta FACEIT z podpiętym CS2 i klienta FACEIT Anti-Cheat. Przy zapisie gracz akceptuje regulamin, dołącza do Discorda EntryZone i obserwuje stronę ENTRYZONE na FACEIT.',
  '5 zawodników + opcjonalny rezerwowy, zgłoszony przy zapisie na FACEIT. Kapitan może wymienić gracza z rezerwowym przed meczem. Dodanie nowej osoby do składu wymaga wypisania drużyny i ponownego zapisu przed startem turnieju.',
  'Turniej trwa dwa dni. Sobota 14 listopada, 14:00: runda 1 i ćwierćfinały (BO1). Niedziela 15 listopada: półfinał 1 o 17:00, półfinał 2 o 18:15 (BO1), wielki finał BO3 o 20:00. Półfinały grane są jeden po drugim, bo oba są transmitowane. Wymagana dostępność w obu dniach.',
  'Check-in robi kapitan na FACEIT w sobotę 14 listopada, 12:30–13:00. Brak check-inu to usunięcie drużyny z turnieju.',
  'Konta bez blokad VAC i Overwatch. Blokada to walkower.',
  'Drużyna musi wejść na serwer w czasie odliczanym w pokoju meczowym FACEIT. Kto się spóźni, dostaje walkower.',
  'Spory zgłasza kapitan adminowi turnieju w trakcie meczu — admin może zapauzować mecz.',
  'Odwołanie zgłaszamy na #odwołania w ciągu 30 minut od końca meczu, z dowodem. Decyzja organizatora jest ostateczna.',
  'Cheaty, smurfy, gra na cudzym koncie to dyskwalifikacja i blokada w kolejnych edycjach.',
  'Obraźliwe zachowanie kończy się usunięciem z turnieju.',
  `Pula ${prizes.poolTotal} zł jest gwarantowana niezależnie od liczby zgłoszonych drużyn.`,
  'Przy mniej niż 8 zgłoszonych drużynach organizator może przełożyć turniej.',
  'Udział w turnieju oznacza zgodę na transmisję meczu i publikację wyniku wraz z nickami zawodników.',
  'MVP turnieju = gracz z najwyższym średnim ADR ze wszystkich rozegranych map (minimum 3 mapy). Przy remisie decyduje wyższe K/D. Statystyki pochodzą z FACEIT.',
]
