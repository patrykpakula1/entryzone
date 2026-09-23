import { registration } from '../data/registration'

/**
 * Liczba zapisanych drużyn. Zapisy idą wyłącznie przez FACEIT, więc nie da
 * się jej pobrać automatycznie — czyta wprost `registration.teamsRegistered`,
 * wpisywane ręcznie. Zostaje jako hook (zamiast zwykłego pola), żeby
 * komponenty, które go już wywołują, nie musiały się zmieniać.
 */
export function useTeamsRegistered() {
  return Math.min(registration.teamsRegistered, registration.teamsMax)
}
