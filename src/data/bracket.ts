export type Team = {
  id: string
  name: string
  players: [string, string, string, string, string]
  substitute?: string
}

export type Slot = string | null

export type MatchResult = {
  scoreA: number
  scoreB: number
  winner: 'A' | 'B'
}

export type Match = {
  id: string
  teamA: Slot
  teamB: Slot
  result?: MatchResult
  /** Tylko z API FACEIT — statyczna drabinka ich nie ma. */
  status?: 'scheduled' | 'live' | 'finished' | 'cancelled'
  scheduledAt?: string | null
}

/**
 * Rejestr drużyn — jedno miejsce na skład i nazwę dla całego serwisu (drabinka
 * CUP‑u i tabela ligi czytają stąd po `id`). Puste, dopóki nie wpiszesz
 * prawdziwych zgłoszeń, np.:
 *
 * 'iron-wolves': {
 *   id: 'iron-wolves', name: 'Iron Wolves',
 *   players: ['Sh4rk', 'Nomad', 'Ferox', 'Kailen', 'Drizzt'], substitute: 'Voss',
 * },
 */
export const teams: Record<string, Team> = {}

export const ROUND_LABELS = ['Runda 1', 'Ćwierćfinał', 'Półfinał', 'Finał']

/**
 * Drabinka czeka na zgłoszenia — same wolne miejsca w rundzie 1. Wpisz
 * prawdziwe id drużyny (klucz z `teams` powyżej) w `teamA`/`teamB`, gdy
 * zgłoszenie wpłynie. Rundy 2+ startują bez uczestników — wypełnią się
 * zwycięzcami, gdy turniej ruszy.
 */
export const bracket: Match[][] = [
  [
    { id: 'r1-m1', teamA: null, teamB: null },
    { id: 'r1-m2', teamA: null, teamB: null },
    { id: 'r1-m3', teamA: null, teamB: null },
    { id: 'r1-m4', teamA: null, teamB: null },
    { id: 'r1-m5', teamA: null, teamB: null },
    { id: 'r1-m6', teamA: null, teamB: null },
    { id: 'r1-m7', teamA: null, teamB: null },
    { id: 'r1-m8', teamA: null, teamB: null },
  ],
  [
    { id: 'r2-m1', teamA: null, teamB: null },
    { id: 'r2-m2', teamA: null, teamB: null },
    { id: 'r2-m3', teamA: null, teamB: null },
    { id: 'r2-m4', teamA: null, teamB: null },
  ],
  [
    { id: 'r3-m1', teamA: null, teamB: null },
    { id: 'r3-m2', teamA: null, teamB: null },
  ],
  [{ id: 'r4-m1', teamA: null, teamB: null }],
]

/**
 * Dane z FACEIT (przez /api/bracket) i widok drabinki, który z nich składamy.
 * `BracketView` ma ten sam kształt niezależnie od tego, czy dane przyszły z
 * API, czy to statyczny fallback — komponenty rysują zawsze to samo.
 */
export type RosterPlayer = {
  nickname: string
  avatar: string | null
  level: number | null
  elo: number | null
}

export type RosterTeam = {
  id: string
  name: string
  avatar: string | null
  avgElo: number | null
  players: RosterPlayer[]
}

export type BracketPhase = 'registration' | 'live' | 'finished'

export type BracketApiMatch = {
  round: number
  position: number
  team1Id: string | null
  team2Id: string | null
  score1: number | null
  score2: number | null
  winnerId: string | null
  status: 'scheduled' | 'live' | 'finished' | 'cancelled'
  scheduledAt: string | null
}

export type BracketApi = {
  phase: BracketPhase
  teams: RosterTeam[]
  matches: BracketApiMatch[]
}

export type BracketView = {
  /** 'api' — dane z FACEIT, 'static' — fallback z tego pliku. */
  source: 'api' | 'static'
  phase: BracketPhase
  teams: Record<string, RosterTeam>
  rounds: Match[][]
}

const emptyRounds = (): Match[][] =>
  bracket.map((round) => round.map((m) => ({ ...m, teamA: null, teamB: null })))

function staticView(): BracketView {
  const roster: Record<string, RosterTeam> = {}
  for (const t of Object.values(teams)) {
    roster[t.id] = {
      id: t.id,
      name: t.name,
      avatar: null,
      avgElo: null,
      players: [...t.players, ...(t.substitute ? [t.substitute] : [])].map((nickname) => ({
        nickname,
        avatar: null,
        level: null,
        elo: null,
      })),
    }
  }
  return { source: 'static', phase: 'registration', teams: roster, rounds: bracket }
}

/** Składa widok z odpowiedzi API; `null` (brak odpowiedzi) daje statyczną drabinkę. */
export function buildBracketView(api: BracketApi | null): BracketView {
  if (!api) return staticView()

  const roster = Object.fromEntries(api.teams.map((t) => [t.id, t]))
  const rounds = emptyRounds()

  if (api.phase === 'registration') {
    // Pary losuje FACEIT dopiero przy starcie — do tego czasu drużyny po
    // prostu zajmują kolejne wolne miejsca rundy 1, w kolejności zapisów.
    api.teams.slice(0, rounds[0].length * 2).forEach((team, i) => {
      rounds[0][i >> 1][i % 2 === 0 ? 'teamA' : 'teamB'] = team.id
    })
    return { source: 'api', phase: 'registration', teams: roster, rounds }
  }

  for (const m of api.matches) {
    const slot = rounds[m.round - 1]?.[m.position]
    if (!slot) continue // np. mecz o 3. miejsce — drabinka go nie rysuje
    slot.teamA = m.team1Id
    slot.teamB = m.team2Id
    slot.status = m.status
    slot.scheduledAt = m.scheduledAt
    if (m.winnerId && (m.winnerId === m.team1Id || m.winnerId === m.team2Id)) {
      slot.result = {
        scoreA: m.score1 ?? 0,
        scoreB: m.score2 ?? 0,
        winner: m.winnerId === m.team1Id ? 'A' : 'B',
      }
    }
  }
  return { source: 'api', phase: api.phase, teams: roster, rounds }
}

const TIME_ZONE = 'Europe/Warsaw'

// Godziny, które organizator zapowiedział w regulaminie — używane, dopóki
// FACEIT nie poda własnego `scheduled_at` dla półfinałów i finału.
const STATIC_CAPTIONS: Record<string, string> = {
  '2-0': 'niedz. 17:00',
  '2-1': 'niedz. 18:15',
  '3-0': 'niedz. 20:00 · BO3',
}

/** Podpis nad kartą meczu: dzień i godzina (+ BO3 w finale), albo null. */
export function matchCaption(round: number, position: number, scheduledAt?: string | null) {
  const isFinal = round === bracket.length - 1
  if (scheduledAt) {
    const parts = new Intl.DateTimeFormat('pl-PL', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: TIME_ZONE,
    }).formatToParts(new Date(scheduledAt))
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
    const label = `${get('weekday')} ${get('hour')}:${get('minute')}`
    return isFinal ? `${label} · BO3` : label
  }
  return STATIC_CAPTIONS[`${round}-${position}`] ?? null
}
