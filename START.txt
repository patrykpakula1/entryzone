# Kolejność promptów — hero

1. Scena bazowa: canvas Three.js pełny ekran, tło --bg, cząsteczki kurzu
   w smudze światła, sygnet + napis ENTRYZONE na środku. BEZ animacji.
   Sprawdź: renderuje się, nie zamula.

2. Pocisk: świecąca wydłużona smuga lecąca od kamery w głąb sceny.
   Na razie w pętli, sama z siebie. Sprawdź: czy dobrze wygląda.

3. Scroll: GSAP ScrollTrigger, pin + scrub. Pocisk i kamera sterowane
   pozycją scrolla. Sprawdź: płynność w obie strony.

4. Cel i uderzenie: płyta z chevronem, rozbłysk, pierścień, odłamki, drganie.
   Sprawdź: trafienie wypada w tym samym momencie co scroll.

5. Przejście + optymalizacja: wyjście do następnej sekcji, mobile,
   prefers-reduced-motion.

Potem: pasek nawigacji → sekcja zapisów → CUP z drabinką → LEAGUE → WINNERS.

COMMIT PO KAŻDYM KROKU.
