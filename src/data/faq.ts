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
    question: 'Ile kosztuje wpisowe i na co idzie?',
    answer: `Wpisowe wynosi ${prizes.entryFee} zł od drużyny, płatne przed turniejem. Cała zebrana kwota trafia do puli nagród — organizator nic z niej nie zatrzymuje. Pula ${prizes.poolTotal} zł jest gwarantowana niezależnie od liczby zgłoszonych drużyn.`,
  },
  {
    question: 'Czy muszę mieć pełny skład pięciu osób?',
    answer:
      'Tak, zgłaszasz 5 zawodników. Możesz dodać jednego rezerwowego, ale musi być zgłoszony przed startem turnieju — po pierwszym meczu składu nie zmieniamy.',
  },
  {
    question: 'Co jeśli nie mam drużyny?',
    answer:
      'Wejdź na nasz Discord — tam ogłaszamy nabór i najłatwiej znaleźć graczy szukających składu przed zapisami.',
  },
  {
    question: 'Na czym gramy?',
    answer:
      'Na aktywnej puli map trybu Premier, z veto w systemie ban/ban/pick. Mecze rozgrywane są na serwerach organizatora albo na FACEIT.',
  },
  {
    question: 'Co jeśli ktoś z drużyny nie może w niedzielę?',
    answer:
      'Dostępność w obu dniach turnieju jest wymagana — dlatego regulamin pozwala zgłosić rezerwowego przed startem. Jeśli w niedzielę zabraknie Wam graczy do pełnego składu, obowiązują normalne zasady stawiennictwa: spóźnienie powyżej 15 minut to walkower dla przeciwnika.',
  },
  {
    question: 'Kiedy dostanę nagrodę?',
    answer:
      'Rozliczenie nagród następuje po zakończeniu turnieju — organizator kontaktuje się z kapitanem zwycięskiej drużyny przez Discord, żeby ustalić przelew.',
  },
  {
    question: 'Czy będzie transmisja?',
    answer:
      'Tak, przynajmniej wielki finał BO3 gramy z komentarzem na żywo. Udział w turnieju oznacza zgodę na transmisję meczu i publikację wyniku wraz z nickami zawodników.',
  },
]
