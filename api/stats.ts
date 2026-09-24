/**
 * Statystyki meczowe i ranking MVP z FACEIT Data API — trzecia funkcja
 * serverless w projekcie, ten sam wzorzec co api/bracket.ts: klucz żyje
 * wyłącznie w FACEIT_API_KEY na Vercelu, frontend woła tylko /api/stats.
 *
 * Źródła:
 *  - /championships/{id}/matches — zakończone mecze (i nazwy drużyn),
 *  - /matches/{id}/stats         — statystyki graczy, osobno dla każdej mapy
 *    (`rounds[]`: w BO3 są trzy wpisy, każda mapa liczy się osobno).
 */

const CHAMPIONSHIP_ID = '4c962c5e-7481-4fd2-ae32-007a47e79455'
const API = 'https://open.faceit.com/data/v4'

const CACHE_OK = 'public, s-maxage=300, stale-while-revalidate=600'

const MATCHES_LIMIT = 100 // 15 meczów w drabince 16 drużyn
const MVP_MIN_MAPS = 3
const MVP_TOP = 10

type PlayerStats = {
  playerId: string
  nickname: string
  teamName: string | null
  maps: number
  kills: number
  deaths: number
  kd: number
  adr: number
  hs: number
}

type Json = Record<string, unknown>

function json(body: unknown, status: number, cacheControl: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
    },
  })
}

class UpstreamError extends Error {
  status: number | null
  constructor(message: string, status: number | null = null) {
    super(message)
    this.status = status
  }
}

const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null
const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null)
// FACEIT oddaje statystyki jako stringi ("13", "84.5"), więc liczby czytamy z obu form.
const num = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v)
    ? v
    : typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))
      ? Number(v)
      : null

async function faceit(path: string, apiKey: string): Promise<Json> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) throw new UpstreamError(`${res.status} ${path}`, res.status)
  const data: unknown = await res.json()
  if (!isObj(data)) throw new UpstreamError(`bad payload ${path}`)
  return data
}

type FinishedMatch = { id: string; teamNames: Map<string, string> }

async function fetchFinishedMatches(apiKey: string): Promise<FinishedMatch[]> {
  let data: Json
  try {
    data = await faceit(
      `/championships/${CHAMPIONSHIP_ID}/matches?type=all&offset=0&limit=${MATCHES_LIMIT}`,
      apiKey,
    )
  } catch (err) {
    // Przed startem turnieju FACEIT może odpowiadać 404 zamiast pustej listy.
    if (err instanceof UpstreamError && err.status === 404) return []
    throw err
  }
  const items = Array.isArray(data.items) ? data.items : []
  const finished: FinishedMatch[] = []
  for (const item of items) {
    if (!isObj(item) || item.status !== 'FINISHED') continue
    const id = str(item.match_id)
    if (!id) continue
    const teamNames = new Map<string, string>()
    if (isObj(item.teams)) {
      for (const faction of Object.values(item.teams)) {
        if (!isObj(faction)) continue
        const factionId = str(faction.faction_id)
        const name = str(faction.name)
        if (factionId && name) teamNames.set(factionId, name)
      }
    }
    finished.push({ id, teamNames })
  }
  return finished
}

/**
 * Statystyki bywają zapisane pod nazwami z różną wielkością liter i spacjami
 * ("K/D Ratio", "Headshots %"), więc klucze porównujemy po normalizacji.
 */
function statReader(stats: Json) {
  const byKey = new Map<string, unknown>()
  for (const [key, value] of Object.entries(stats)) {
    byKey.set(key.toLowerCase().replace(/\s+/g, ''), value)
  }
  return (...names: string[]) => {
    for (const name of names) {
      const value = num(byKey.get(name.toLowerCase().replace(/\s+/g, '')))
      if (value !== null) return value
    }
    return null
  }
}

type Acc = {
  playerId: string
  nickname: string
  teamName: string | null
  maps: number
  kills: number
  deaths: number
  adrSum: number
  hsWeighted: number // suma (HS% × kille) — waży HS% liczbą zabójstw na mapie
  hsPlain: number // suma HS% z map — zapas, gdy gracz nie ma żadnych killi
  hsMaps: number
}

/** Zwraca statystyki zakończonego meczu albo null, gdy ich nie ma (walkower). */
async function fetchMatchStats(match: FinishedMatch, apiKey: string): Promise<Json[] | null> {
  try {
    const data = await faceit(`/matches/${encodeURIComponent(match.id)}/stats`, apiKey)
    return Array.isArray(data.rounds) ? data.rounds.filter(isObj) : null
  } catch (err) {
    if (err instanceof UpstreamError && err.status === 404) return null
    throw err
  }
}

async function build(apiKey: string) {
  const matches = await fetchFinishedMatches(apiKey)
  const stats = await Promise.all(matches.map((m) => fetchMatchStats(m, apiKey)))

  const acc = new Map<string, Acc>()
  let seen = 0 // wpisy graczy w odpowiedziach
  let counted = 0 // z czego z czytelnym kills/deaths/ADR

  matches.forEach((match, i) => {
    for (const round of stats[i] ?? []) {
      const teams = Array.isArray(round.teams) ? round.teams : []
      for (const team of teams) {
        if (!isObj(team)) continue
        const teamId = str(team.team_id)
        const teamStats = isObj(team.team_stats) ? team.team_stats : {}
        const teamName =
          (teamId && match.teamNames.get(teamId)) ?? str(teamStats.Team) ?? str(teamStats.team)
        const players = Array.isArray(team.players) ? team.players : []
        for (const player of players) {
          if (!isObj(player)) continue
          const playerId = str(player.player_id)
          if (!playerId) continue
          seen++
          const read = statReader(isObj(player.player_stats) ? player.player_stats : {})
          const kills = read('Kills')
          const deaths = read('Deaths')
          const adr = read('ADR', 'Average Damage per Round')
          // Mapa bez kompletu liczb (np. gracz wypadł) nie wchodzi do średnich.
          if (kills === null || deaths === null || adr === null) continue
          counted++

          const entry = acc.get(playerId) ?? {
            playerId,
            nickname: str(player.nickname) ?? '—',
            teamName: null,
            maps: 0,
            kills: 0,
            deaths: 0,
            adrSum: 0,
            hsWeighted: 0,
            hsPlain: 0,
            hsMaps: 0,
          }
          entry.nickname = str(player.nickname) ?? entry.nickname
          entry.teamName = teamName ?? entry.teamName
          entry.maps += 1
          entry.kills += kills
          entry.deaths += deaths
          entry.adrSum += adr
          const hs = read('Headshots %', 'Headshots%', 'HS %')
          if (hs !== null) {
            entry.hsWeighted += hs * kills
            entry.hsPlain += hs
            entry.hsMaps += 1
          }
          acc.set(playerId, entry)
        }
      }
    }
  })

  // Statystyki są, ale żadnej nie umiemy przeczytać — to zmiana nazw pól po
  // stronie FACEIT. Lepszy głośny błąd niż wiecznie pusty ranking w cache.
  if (seen > 0 && counted === 0) {
    throw new UpstreamError('unrecognized stats fields')
  }

  const round = (v: number, digits: number) => {
    const f = 10 ** digits
    return Math.round(v * f) / f
  }

  const players: PlayerStats[] = [...acc.values()].map((a) => ({
    playerId: a.playerId,
    nickname: a.nickname,
    teamName: a.teamName,
    maps: a.maps,
    kills: a.kills,
    deaths: a.deaths,
    kd: round(a.kills / Math.max(a.deaths, 1), 2),
    adr: round(a.adrSum / a.maps, 1),
    hs:
      a.hsMaps === 0
        ? 0
        : round(a.kills > 0 ? a.hsWeighted / a.kills : a.hsPlain / a.hsMaps, 1),
  }))

  // Sortujemy po wartościach, które widzi czytelnik: remis w ADR rozstrzyga K/D.
  players.sort((a, b) => b.adr - a.adr || b.kd - a.kd)

  const mvpRanking = players.filter((p) => p.maps >= MVP_MIN_MAPS).slice(0, MVP_TOP)
  return { players, mvpRanking }
}

export default {
  async fetch() {
    const apiKey = process.env.FACEIT_API_KEY
    if (!apiKey) {
      return json({ error: 'FACEIT_API_KEY is not configured' }, 500, 'no-store')
    }

    try {
      return json(await build(apiKey), 200, CACHE_OK)
    } catch (err) {
      if (err instanceof UpstreamError) {
        return json({ error: 'FACEIT API error' }, 502, 'no-store')
      }
      return json({ error: 'FACEIT API unreachable' }, 502, 'no-store')
    }
  },
}
