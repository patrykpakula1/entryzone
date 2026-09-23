import { prizes } from './prizes'

/**
 * Regulamin CUP-u — jedno miejsce do zmiany. Sekcja na /cup (zwinięta,
 * Regulamin) i pełna podstrona /regulamin czytają tę samą listę, więc
 * treść nie może się rozjechać między nimi.
 *
 * Treść dokładnie z entryzone-tresci.md, sekcja „REGULAMIN”.
 */
export const rules = [
  'Udział jest bezpłatny. Zapisy wyłącznie przez FACEIT — każdy zawodnik potrzebuje konta FACEIT z podpiętym CS2 i klienta FACEIT Anti-Cheat.',
  '5 zawodników + opcjonalny rezerwowy, zgłoszony przy zapisie na FACEIT. Zmiana składu wymaga wypisania drużyny i ponownego zapisu przed startem turnieju.',
  'Turniej trwa dwa dni. Sobota: runda 1 i ćwierćfinały. Niedziela: półfinały i finał. Wymagana dostępność w obu terminach.',
  'Konta bez blokad VAC i Overwatch. Blokada to walkower.',
  'Kapitan robi check-in na FACEIT najpóźniej 30 minut przed startem turnieju. Brak check-inu to usunięcie drużyny z turnieju.',
  'Drużyna stawia się do 15 minut po wyznaczonej godzinie. Później mecz przyznajemy przeciwnikowi.',
  'Spory zgłasza kapitan sędziemu na serwerze, w trakcie meczu. Mecz zostaje zapauzowany.',
  'Decyzja sędziego jest wiążąca w meczu. Odwołanie na #odwołania w ciągu 30 minut od końca meczu, z dowodem. Decyzja organizatora jest ostateczna.',
  'Cheaty, smurfy, gra na cudzym koncie to dyskwalifikacja i blokada w kolejnych edycjach.',
  'Obraźliwe zachowanie kończy się usunięciem z turnieju.',
  `Pula ${prizes.poolTotal} zł jest gwarantowana niezależnie od liczby zgłoszonych drużyn.`,
  'Przy mniej niż 8 zgłoszonych drużynach organizator może przełożyć turniej.',
  'Udział w turnieju oznacza zgodę na transmisję meczu i publikację wyniku wraz z nickami zawodników.',
]
