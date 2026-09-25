/**
 * Test api/bracket.ts na zamockowanym FACEIT: rate limit (429) na /players/{id}
 * ma kończyć się kompletem nicków, a gdy profil zawodzi na stałe — danymi
 * zapasowymi z /teams/{id} albo krótkim cache. Bez zależności: runner Node.
 *
 * Cache profili w module jest współdzielony między testami, więc każdy test
 * używa własnych id graczy.
 */
import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

type Player = { id: string; nickname: string | null; level: number | null; elo: number | null }
type BracketBody = { teams: { id: string; name: string; players: Player[] }[] }

const realFetch = globalThis.fetch
const realWarn = console.warn

const ids = (prefix: string, n = 5) => Array.from({ length: n }, (_, i) => `${prefix}-p${i + 1}`)

/** Zgłoszenia: drużyna → id graczy (jak w prawdziwym /subscriptions: roster to same id). */
const subscriptions = (teams: Record<string, string[]>) => ({
  items: Object.entries(teams).map(([teamId, roster]) => ({
    status: 'ACCEPTED',
    team: { team_id: teamId, name: `Team ${teamId}`, avatar: null },
    roster,
  })),
})

type Mock = {
  teams: Record<string, string[]>
  /** Ile pierwszych odpowiedzi na /players/{id} ma być 429 (albo inny kod), per gracz. */
  playerFailures?: (id: string) => { status: number; times: number } | undefined
  /** Odpowiedź /teams/{id}; brak = 404. */
  teamMembers?: Record<string, unknown[]>
}

function mockFaceit(config: Mock) {
  const calls = new Map<string, number>()
  const stats = { maxInFlight: 0, teamCalls: 0, playerCalls: 0 }
  let inFlight = 0

  globalThis.fetch = (async (input: string | URL | Request) => {
    const { pathname } = new URL(String(input))
    const respond = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
      ({
        ok: status === 200,
        status,
        headers: new Headers(headers),
        json: async () => body,
      }) as Response

    if (pathname.endsWith('/subscriptions')) return respond(subscriptions(config.teams))
    if (pathname.endsWith('/matches')) return respond({ items: [] })

    const teamId = /\/teams\/([^/]+)$/.exec(pathname)?.[1]
    if (teamId) {
      stats.teamCalls++
      const members = config.teamMembers?.[teamId]
      return members ? respond({ team_id: teamId, members }) : respond({}, 404)
    }

    const playerId = /\/players\/([^/]+)$/.exec(pathname)?.[1]
    if (!playerId) return respond({}, 404)

    stats.playerCalls++
    inFlight++
    stats.maxInFlight = Math.max(stats.maxInFlight, inFlight)
    await new Promise((resolve) => setTimeout(resolve, 5)) // żeby zapytania faktycznie się nakładały
    inFlight--

    const seen = (calls.get(playerId) ?? 0) + 1
    calls.set(playerId, seen)
    const failure = config.playerFailures?.(playerId)
    if (failure && seen <= failure.times) return respond({}, failure.status)
    return respond({
      nickname: `nick-${playerId}`,
      avatar: `https://avatar/${playerId}.jpg`,
      games: { cs2: { skill_level: 7, faceit_elo: 1700 } },
    })
  }) as typeof fetch

  return stats
}

async function callBracket() {
  const { default: handler } = await import('../api/bracket.ts')
  const res = await handler.fetch()
  return { res, body: (await res.json()) as BracketBody }
}

const allPlayers = (body: BracketBody) => body.teams.flatMap((t) => t.players)

describe('api/bracket — profile graczy', () => {
  let warnings: string[]
  beforeEach(() => {
    process.env.FACEIT_API_KEY = 'secret-test-key'
    warnings = []
    console.warn = (...args: unknown[]) => void warnings.push(args.join(' '))
  })
  afterEach(() => {
    globalThis.fetch = realFetch
    console.warn = realWarn
  })

  it('429 na części profili: po retry każdy gracz ma nick, poziom i ELO', async () => {
    const teams = { 'ta': ids('a'), 'tb': ids('b'), 'tc': ids('c'), 'td': ids('d') }
    // Co drugi gracz dostaje najpierw 429, a co piąty jeszcze 500 — potem 200.
    const stats = mockFaceit({
      teams,
      playerFailures: (id) => {
        const n = Number(id.slice(-1))
        if (n % 2 === 0) return { status: 429, times: 2 }
        if (n === 5) return { status: 500, times: 1 }
        return undefined
      },
    })
    const { res, body } = await callBracket()

    assert.equal(res.status, 200)
    const players = allPlayers(body)
    assert.equal(players.length, 20)
    for (const p of players) {
      assert.equal(p.nickname, `nick-${p.id}`)
      assert.equal(p.level, 7)
      assert.equal(p.elo, 1700)
    }
    assert.equal(res.headers.get('cache-control'), 'public, s-maxage=300, stale-while-revalidate=600')
    assert.equal(stats.teamCalls, 0, 'zapas z /teams tylko gdy /players zawodzi mimo retry')
    assert.ok(stats.maxInFlight <= 4, `naraz lecą max 4 zapytania, było ${stats.maxInFlight}`)
    assert.equal(warnings.length, 1, 'jedyny warn to podsumowanie zgłoszeń')
    assert.match(warnings[0], /zgłoszenia: 4, drużyn w drabince: 4, odrzuconych: 0 \(statusy: ACCEPTED×4\)/)
  })

  it('profil zawodzi na stałe: nick z /teams, a bez niego null i krótki cache', async () => {
    const roster = ids('z')
    const stats = mockFaceit({
      teams: { tz: roster },
      playerFailures: (id) =>
        id === 'z-p1' || id === 'z-p2' ? { status: 429, times: 99 } : undefined,
      teamMembers: {
        tz: [{ user_id: 'z-p1', nickname: 'Zapas', avatar: 'https://avatar/zapas.jpg', skill_level: 4 }],
      },
    })
    const { res, body } = await callBracket()

    const [rescued, lost, ...rest] = allPlayers(body)
    assert.deepEqual(rescued, {
      id: 'z-p1',
      nickname: 'Zapas',
      avatar: 'https://avatar/zapas.jpg',
      level: 4,
      elo: null, // ELO tylko z /players
    })
    assert.equal(lost.nickname, null) // /teams go nie zna — front pokaże "Gracz"
    assert.ok(rest.every((p) => p.nickname === `nick-${p.id}` && p.elo === 1700))

    assert.equal(stats.teamCalls, 1, 'jeden /teams/{id} na drużynę, nie na gracza')
    assert.equal(res.headers.get('cache-control'), 'public, s-maxage=30')

    const log = warnings.join('\n')
    assert.match(log, /2\/5 nie powiodło się mimo retry \(HTTP: 429×2\)/)
    assert.match(log, /uratowano 1/)
    assert.match(log, /1 graczy bez nicku/)
    assert.ok(!log.includes('secret-test-key'), 'klucz API nie trafia do logów')
  })
})
