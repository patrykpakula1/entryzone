import { prizes } from './prizes'

/**
 * Pytania i odpowiedzi w sekcji FAQ na /cup — treść oparta na regulaminie
 * (data/rules.ts) i informacjach o formacie turnieju (CupOverview), żeby nie
 * rozjeżdżała się z tym, co widać na /cup i /regulamin.
 */
export const faq = [
  {
    question: 'Kto może wziąć udział?',
    answer:
      'Turniej jest otwarty dla wszystkich — bez kwalifikacji i bez limitu rangi. Liczy się tylko to, kto wygra swój mecz. Zgłoszenia przyjmujemy do wypełnienia drabinki (16 drużyn) albo do terminu zamknięcia zapisów.',
  },
  {
    question: 'Ile kosztuje udział?',
    answer: `Nic — udział jest darmowy. Pula ${prizes.poolTotal} zł jest gwarantowana niezależnie od liczby zgłoszonych drużyn.`,
  },
  {
    question: 'Jak się zapisać?',
    answer:
      'Kapitan zapisuje drużynę z pełnym składem na stronie turnieju na FACEIT. Każdy zawodnik musi mieć konto FACEIT z podpiętym CS2 i klienta FACEIT Anti-Cheat. Link do zapisów znajdziesz w zakładce Zapisy i na Discordzie. Check-in kapitana na FACEIT odbywa się w sobotę 12:30–13:00 — brak check-inu to usunięcie drużyny z turnieju.',
  },
  {
    question: 'Czy muszę mieć pełny skład pięciu osób?',
    answer:
      'Tak, zgłaszasz 5 zawodników. Możesz dodać jednego rezerwowego, ale musi być zgłoszony przy zapisie na FACEIT. Zmiana składu wymaga wypisania drużyny i ponownego zapisu przed startem turnieju.',
  },
  {
    question: 'Co jeśli nie mam drużyny?',
    answer:
      'Wejdź na nasz Discord — tam ogłaszamy nabór i najłatwiej znaleźć graczy szukających składu przed zapisami.',
  },
  {
    question: 'Na czym gramy?',
    answer:
      'Na aktywnej puli map trybu Premier, z veto w systemie ban/ban/pick. Mecze rozgrywane są na serwerach FACEIT.',
  },
  {
    question: 'Co jeśli ktoś z drużyny nie może w niedzielę?',
    answer:
      'Dostępność w obu dniach turnieju jest wymagana. W niedzielę grają półfinał 1 (17:00), półfinał 2 (18:15) i wielki finał BO3 (20:00) — dlatego regulamin pozwala zgłosić rezerwowego, którym kapitan może przed meczem wymienić gracza z podstawowego składu. Pamiętajcie też: drużyna musi wejść na serwer w czasie odliczanym w pokoju meczowym FACEIT. Kto się spóźni, dostaje walkower.',
  },
  {
    question: 'Kiedy dostanę nagrodę?',
    answer:
      'Rozliczenie nagród następuje po zakończeniu turnieju — organizator kontaktuje się z kapitanem zwycięskiej drużyny przez Discord, żeby ustalić przelew.',
  },
  {
    question: 'Czy będzie transmisja?',
    answer:
      'Tak, w niedzielę oba półfinały (jeden po drugim) i wielki finał BO3 gramy z komentarzem na żywo. Udział w turnieju oznacza zgodę na transmisję meczu i publikację wyniku wraz z nickami zawodników.',
  },
]
