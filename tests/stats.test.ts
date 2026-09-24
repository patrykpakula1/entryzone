/**
 * Test api/stats.ts na prawdziwej odpowiedzi FACEIT GET /matches/{id}/stats
 * (tests/fixtures/match-stats.json — mecz CS2, jedna mapa, 10 graczy).
 * Bez zależności: wbudowany runner Node (`npm test`).
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, it } from 'node:test'

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
type StatsBody = { players: PlayerStats[]; mvpRanking: PlayerStats[] }

const real = JSON.parse(
  readFileSync(new URL('./fixtures/match-stats.json', import.meta.url), 'utf8'),
) as { rounds: unknown[] }

const realFetch = globalThis.fetch

/** Podmienia fetch: lista meczów turnieju + statystyki per match_id (brak wpisu = 404). */
function mockFaceit(
  matches: { match_id: string; status: string; teams?: unknown }[],
  stats: Record<string, unknown>,
) {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const { pathname } = new URL(String(input))
    const respond = (body: unknown, status = 200) =>
      ({ ok: status === 200, status, json: async () => body }) as Response
    if (pathname.endsWith('/matches')) return respond({ items: matches })
    const id = /\/matches\/([^/]+)\/stats$/.exec(pathname)?.[1]
    if (id && id in stats) return respond(stats[id])
    return respond({}, 404)
  }) as typeof fetch
}

async function callStats() {
  const { default: handler } = await import('../api/stats.ts')
  const res = await handler.fetch()
  return { res, body: (await res.json()) as StatsBody }
}

const byNick = (body: StatsBody, nick: string) => {
  const p = body.players.find((x) => x.nickname === nick)
  assert.ok(p, `brak gracza ${nick}`)
  return p
}

describe('api/stats — prawdziwa odpowiedź FACEIT', () => {
  beforeEach(() => {
    process.env.FACEIT_API_KEY = 'test'
  })
  afterEach(() => {
    globalThis.fetch = realFetch
  })

  it('czyta Kills, Deaths, ADR i Headshots % z jednej mapy', async () => {
    mockFaceit([{ match_id: 'm1', status: 'FINISHED' }], { m1: real })
    const { res, body } = await callStats()

    assert.equal(res.status, 200)
    assert.equal(res.headers.get('cache-control'), 'public, s-maxage=300, stale-while-revalidate=600')
    assert.equal(body.players.length, 10)

    const fatality = byNick(body, 'FATALITYTAP')
    assert.equal(fatality.playerId, '62083062-66ba-4d94-a82b-6081889f4954')
    assert.equal(fatality.maps, 1)
    assert.equal(fatality.kills, 20)
    assert.equal(fatality.deaths, 17)
    assert.equal(fatality.kd, 1.18) // 20 / 17, z sum — zgodne z "K/D Ratio" FACEIT
    assert.equal(fatality.adr, 101.8)
    assert.equal(fatality.hs, 45)

    const foreks = byNick(body, 'foreks42')
    assert.equal(foreks.kd, 1.67)
    assert.equal(foreks.adr, 105.7)
    assert.equal(foreks.hs, 65)

    const zeroHs = byNick(body, 'DerArian')
    assert.equal(zeroHs.hs, 0) // "Headshots %": "0" to prawdziwe zero, nie brak danych
    assert.equal(zeroHs.adr, 68.3)
  })

  it('bierze nazwę drużyny z team_stats.Team, a z meczu turnieju, gdy ją zna', async () => {
    mockFaceit([{ match_id: 'm1', status: 'FINISHED' }], { m1: real })
    const fromStats = (await callStats()).body
    assert.equal(byNick(fromStats, 'FATALITYTAP').teamName, 'team_G3peto-NoPro')
    assert.equal(byNick(fromStats, 'foreks42').teamName, 'team_foreks42')

    mockFaceit(
      [
        {
          match_id: 'm1',
          status: 'FINISHED',
          teams: {
            faction1: { faction_id: 'd176f27c-90ae-4236-beb0-8623fb81e3bb', name: 'G3peto Squad' },
            faction2: { faction_id: '0d2da4e2-be69-4edc-afbe-4d0a2649d011', name: 'Foreks Squad' },
          },
        },
      ],
      { m1: real },
    )
    const fromMatch = (await callStats()).body
    assert.equal(byNick(fromMatch, 'FATALITYTAP').teamName, 'G3peto Squad')
    assert.equal(byNick(fromMatch, 'foreks42').teamName, 'Foreks Squad')
  })

  it('jedna mapa to jeszcze nie ranking MVP (min. 3 mapy)', async () => {
    mockFaceit([{ match_id: 'm1', status: 'FINISHED' }], { m1: real })
    const { body } = await callStats()
    assert.equal(body.players.length, 10)
    assert.deepEqual(body.mvpRanking, [])
  })

  it('BO3: każda mapa liczy się osobno, ADR to średnia z map, K/D z sum', async () => {
    const threeMaps = { rounds: [real.rounds[0], real.rounds[0], real.rounds[0]] }
    mockFaceit([{ match_id: 'm1', status: 'FINISHED' }], { m1: threeMaps })
    const { body } = await callStats()

    const fatality = byNick(body, 'FATALITYTAP')
    assert.equal(fatality.maps, 3)
    assert.equal(fatality.kills, 60)
    assert.equal(fatality.deaths, 51)
    assert.equal(fatality.adr, 101.8)
    assert.equal(body.mvpRanking.length, 10)
    // Najwyższy średni ADR na czele: IDEALITYMEOW 126.9, potem GL1TCHU 116.2.
    assert.deepEqual(
      body.mvpRanking.slice(0, 3).map((p) => p.nickname),
      ['IDEALITYMEOW', 'GL1TCHU', 'foreks42'],
    )
  })

  it('pomija mecze bez statystyk (walkower) i niezakończone', async () => {
    mockFaceit(
      [
        { match_id: 'played', status: 'FINISHED' },
        { match_id: 'walkover', status: 'FINISHED' }, // brak statystyk → 404
        { match_id: 'upcoming', status: 'SCHEDULED' },
      ],
      { played: real, upcoming: real },
    )
    const { body } = await callStats()
    assert.equal(byNick(body, 'FATALITYTAP').maps, 1)
  })

  it('remis w ADR rozstrzyga wyższe K/D', async () => {
    const tied = structuredClone(real) as typeof real & {
      rounds: { teams: { players: { nickname: string; player_stats: Record<string, string> }[] }[] }[]
    }
    const players = tied.rounds[0].teams.flatMap((t) => t.players)
    const set = (nick: string, kills: string, adr: string) => {
      const p = players.find((x) => x.nickname === nick)
      assert.ok(p)
      p.player_stats.Kills = kills
      p.player_stats.ADR = adr
    }
    set('foreks42', '20', '100.0') // K/D 20/12 = 1.67
    set('lukaradu', '30', '100.0') // K/D 30/13 = 2.31
    tied.rounds = [tied.rounds[0], tied.rounds[0], tied.rounds[0]]
    mockFaceit([{ match_id: 'm1', status: 'FINISHED' }], { m1: tied })
    const { body } = await callStats()
    const order = body.mvpRanking.map((p) => p.nickname)
    assert.ok(order.indexOf('lukaradu') < order.indexOf('foreks42'))
  })

  it('zmiana nazw pól po stronie FACEIT to głośne 502, nie pusty ranking', async () => {
    const renamed = JSON.parse(JSON.stringify(real).replaceAll('"ADR"', '"Avg Dmg"'))
    mockFaceit([{ match_id: 'm1', status: 'FINISHED' }], { m1: renamed })
    const { res } = await callStats()
    assert.equal(res.status, 502)
    assert.equal(res.headers.get('cache-control'), 'no-store')
  })

  it('bez zakończonych meczów zwraca pusty ranking', async () => {
    mockFaceit([{ match_id: 'm1', status: 'SCHEDULED' }], {})
    const { res, body } = await callStats()
    assert.equal(res.status, 200)
    assert.deepEqual(body, { players: [], mvpRanking: [] })
  })
})
