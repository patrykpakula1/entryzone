/**
 * Drabinka i składy CUP-u z FACEIT Data API — druga (i ostatnia) funkcja
 * serverless w projekcie, ten sam wzorzec co api/teams.ts: klucz żyje
 * wyłącznie w FACEIT_API_KEY na Vercelu, frontend woła tylko /api/bracket.
 *
 * Trzy źródła danych:
 *  - /championships/{id}/subscriptions — zapisane drużyny (max 10 na stronę),
 *  - /championships/{id}/matches       — mecze, dopiero gdy turniej ruszy,
 *  - /players/{id}                     — poziom i ELO w CS2 każdego gracza,
 *  - /teams/{id}                       — zapas dla /players: nick, avatar i poziom
 *    członków drużyny (bez ELO), gdy profil gracza nie chce się pobrać.
 *
 * Zapytania idą przez ./_faceit.ts (retry przy 429 i 5xx). Profile graczy
 * lecimy po kilka naraz i pamiętamy 30 min w pamięci instancji.
 */

import { faceit, isObj, num, str, UpstreamError, type Json } from './_faceit.ts'

const CHAMPIONSHIP_ID = '4c962c5e-7481-4fd2-ae32-007a47e79455'

const CACHE_OK = 'public, s-maxage=300, stale-while-revalidate=600'
// Gdy komuś brakuje danych z FACEIT, niepełnej odpowiedzi nie trzymamy w CDN długo.
const CACHE_PARTIAL = 'public, s-maxage=30'

const SUBSCRIPTIONS_PAGE = 10 // twardy limit FACEIT dla tego endpointu
const MAX_SUBSCRIPTION_PAGES = 4 // 40 drużyn — z dużym zapasem ponad 16 miejsc
const MATCHES_LIMIT = 100 // 15 meczów w drabince 16 drużyn
const PLAYER_CONCURRENCY = 4 // ile /players/{id} lecimy naraz — więcej kończy się 429
const PLAYER_TTL_MS = 30 * 60 * 1000

type Phase = 'registration' | 'live' | 'finished'
type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'

type Player = {
  id: string
  /** null = FACEIT nie oddał profilu ani zapasowych danych; front pokazuje "Gracz". */
  nickname: string | null
  avatar: string | null
  level: number | null
  elo: number | null
}

type Team = {
  id: string
  name: string
  avatar: string | null
  avgElo: number | null
  players: Player[]
}

type BracketMatch = {
  round: number
  position: number
  team1Id: string | null
  team2Id: string | null
  score1: number | null
  score2: number | null
  winnerId: string | null
  status: MatchStatus
  scheduledAt: string | null
}

/** Drużyna przed pobraniem danych graczy: same id (i to, co API poda od razu). */
type RawTeam = {
  id: string
  name: string
  avatar: string | null
  roster: RawPlayer[]
}
type RawPlayer = { id: string; nickname: string | null; avatar: string | null }

function json(body: unknown, status: number, cacheControl: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
    },
  })
}

/**
 * Wpis rostera bywa samym id gracza albo obiektem (player_id, nickname, avatar)
 * — zależnie od endpointu — więc czytamy oba kształty.
 */
function readRoster(list: unknown): RawPlayer[] {
  if (!Array.isArray(list)) return []
  const players: RawPlayer[] = []
  for (const entry of list) {
    if (typeof entry === 'string' && entry) {
      players.push({ id: entry, nickname: null, avatar: null })
    } else if (isObj(entry)) {
      const id = str(entry.player_id) ?? str(entry.user_id) ?? str(entry.id)
      if (id) {
        players.push({
          id,
          nickname: str(entry.nickname) ?? str(entry.game_player_name),
          avatar: str(entry.avatar),
        })
      }
    }
  }
  return players
}

// Statusy zgłoszeń, które nie zajmują miejsca w turnieju.
const INACTIVE_SUBSCRIPTION = /reject|declin|cancel|kick|withdr|disqual|remov/i

async function fetchSubscriptions(apiKey: string): Promise<RawTeam[]> {
  const teams: RawTeam[] = []
  const statuses = new Map<string, number>() // status zgłoszenia → ile ich
  let dropped = 0 // odrzucone przez INACTIVE_SUBSCRIPTION lub bez team_id
  let total = 0
  for (let page = 0; page < MAX_SUBSCRIPTION_PAGES; page++) {
    const data = await faceit(
      `/championships/${CHAMPIONSHIP_ID}/subscriptions?offset=${page * SUBSCRIPTIONS_PAGE}&limit=${SUBSCRIPTIONS_PAGE}`,
      apiKey,
    )
    const items = Array.isArray(data.items) ? data.items : []
    for (const item of items) {
      total++
      if (!isObj(item) || !isObj(item.team)) {
        dropped++
        continue
      }
      const status = str(item.status)
      statuses.set(status ?? '(brak)', (statuses.get(status ?? '(brak)') ?? 0) + 1)
      if (status && INACTIVE_SUBSCRIPTION.test(status)) {
        dropped++
        continue
      }
      const id = str(item.team.team_id)
      if (!id) {
        dropped++
        continue
      }
      teams.push({
        id,
        name: str(item.team.name) ?? str(item.team.nickname) ?? 'Drużyna',
        avatar: str(item.team.avatar),
        roster: readRoster(item.roster),
      })
    }
    if (items.length < SUBSCRIPTIONS_PAGE) break
  }
  const byStatus = [...statuses].map(([s, n]) => `${s}×${n}`).join(', ')
  console.warn(
    `[bracket] zgłoszenia: ${total}, drużyn w drabince: ${teams.length}, odrzuconych: ${dropped} (statusy: ${byStatus || 'brak'})`,
  )
  return teams
}

function readMatchStatus(raw: unknown): MatchStatus {
  const status = typeof raw === 'string' ? raw.toUpperCase() : ''
  if (status === 'FINISHED') return 'finished'
  if (status === 'CANCELLED' || status === 'CANCELED' || status === 'ABORTED') return 'cancelled'
  if (['ONGOING', 'LIVE', 'READY', 'VOTING', 'CONFIGURING', 'MANUAL_RESULT'].includes(status))
    return 'live'
  return 'scheduled'
}

type RawMatch = {
  round: number
  group: number | null
  order: number
  faction1: RawFaction | null
  faction2: RawFaction | null
  score1: number | null
  score2: number | null
  winnerFaction: 'faction1' | 'faction2' | null
  status: MatchStatus
  scheduledAt: number | null
}
type RawFaction = { id: string; name: string | null; avatar: string | null; roster: RawPlayer[] }

function readFaction(v: unknown): RawFaction | null {
  if (!isObj(v)) return null
  const id = str(v.faction_id)
  if (!id) return null
  return { id, name: str(v.name), avatar: str(v.avatar), roster: readRoster(v.roster) }
}

async function fetchMatches(apiKey: string): Promise<RawMatch[]> {
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
  const matches: RawMatch[] = []
  items.forEach((item, order) => {
    if (!isObj(item)) return
    const round = num(item.round)
    if (round === null || round < 1) return
    const teams = isObj(item.teams) ? item.teams : {}
    const results = isObj(item.results) ? item.results : {}
    const score = isObj(results.score) ? results.score : {}
    const winner = results.winner
    matches.push({
      round,
      group: num(item.group),
      order,
      faction1: readFaction(teams.faction1),
      faction2: readFaction(teams.faction2),
      score1: num(score.faction1),
      score2: num(score.faction2),
      winnerFaction: winner === 'faction1' || winner === 'faction2' ? winner : null,
      status: readMatchStatus(item.status),
      scheduledAt: num(item.scheduled_at),
    })
  })
  return matches
}

/**
 * Pozycja meczu w rundzie (0-based, od góry drabinki). FACEIT numeruje mecze
 * pola `group`; gdy jest unikalne w rundzie, ufamy mu. Dla rund 2+ pozycję
 * wyznacza dodatkowo to, z których meczów poprzedniej rundy wyszli zwycięzcy
 * — to jedyna twarda informacja o tym, kto z kim gra dalej.
 */
function assignPositions(matches: RawMatch[]): Map<RawMatch, number> {
  const byRound = new Map<number, RawMatch[]>()
  for (const m of matches) byRound.set(m.round, [...(byRound.get(m.round) ?? []), m])

  const positions = new Map<RawMatch, number>()
  const rounds = [...byRound.keys()].sort((a, b) => a - b)

  const baseOrder = (list: RawMatch[]) => {
    const groups = list.map((m) => m.group)
    const usable =
      groups.every((g): g is number => g !== null) && new Set(groups).size === list.length
    return [...list].sort((a, b) =>
      usable
        ? (a.group as number) - (b.group as number)
        : (a.scheduledAt ?? 0) - (b.scheduledAt ?? 0) || a.order - b.order,
    )
  }

  const winnerId = (m: RawMatch) => (m.winnerFaction ? m[m.winnerFaction]?.id : undefined)

  rounds.forEach((round, idx) => {
    const list = byRound.get(round) as RawMatch[]
    const ordered = baseOrder(list)
    ordered.forEach((m, i) => positions.set(m, i))
    if (idx === 0) return

    const prev = byRound.get(rounds[idx - 1]) as RawMatch[]
    const derived = list.map((m) => {
      const ids = [m.faction1?.id, m.faction2?.id]
      const feeders = prev.filter((p) => {
        const w = winnerId(p)
        return w !== undefined && ids.includes(w)
      })
      if (feeders.length === 0) return null
      return Math.floor(Math.min(...feeders.map((f) => positions.get(f) as number)) / 2)
    })
    // Zmieniamy układ tylko wtedy, gdy wyprowadzone pozycje są kompletną,
    // bezkolizyjną permutacją — inaczej zostaje układ z `group`.
    const complete = derived.every((p): p is number => p !== null)
    if (complete && new Set(derived).size === list.length && Math.max(...(derived as number[])) < list.length) {
      list.forEach((m, i) => positions.set(m, derived[i] as number))
    }
  })

  return positions
}

type PlayerInfo = {
  nickname: string | null
  avatar: string | null
  level: number | null
  elo: number | null
}

/** Profil gracza z /players — jedyne źródło ELO. Rzuca UpstreamError po wyczerpaniu retry. */
async function fetchPlayer(id: string, apiKey: string): Promise<PlayerInfo> {
  const data = await faceit(`/players/${encodeURIComponent(id)}`, apiKey)
  const games = isObj(data.games) ? data.games : {}
  const cs2 = isObj(games.cs2) ? games.cs2 : {}
  return {
    nickname: str(data.nickname),
    avatar: str(data.avatar),
    level: num(cs2.skill_level),
    elo: num(cs2.faceit_elo),
  }
}

/**
 * Zapas na porażkę /players: /teams/{id} podaje w `members` nick, avatar
 * i skill_level (poziom) każdego członka — bez ELO. Błąd to pusta mapa.
 */
async function fetchTeamMembers(
  teamId: string,
  apiKey: string,
  onFailure: (err: unknown) => void,
): Promise<Map<string, PlayerInfo>> {
  const members = new Map<string, PlayerInfo>()
  try {
    const data = await faceit(`/teams/${encodeURIComponent(teamId)}`, apiKey)
    for (const m of Array.isArray(data.members) ? data.members : []) {
      if (!isObj(m)) continue
      const id = str(m.user_id) ?? str(m.player_id)
      if (id) {
        members.set(id, {
          nickname: str(m.nickname),
          avatar: str(m.avatar),
          level: num(m.skill_level),
          elo: null,
        })
      }
    }
  } catch (err) {
    onFailure(err)
  }
  return members
}

// Pamięć instancji: ciepła funkcja nie pyta FACEIT o tych samych graczy co
// 5 min. Trafiają tu tylko pełne profile z /players, nigdy dane zapasowe.
const playerCache = new Map<string, { info: PlayerInfo; expires: number }>()

/** Przetwarza items po `limit` naraz. */
async function forEachLimit<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let next = 0
  const worker = async () => {
    while (next < items.length) await fn(items[next++])
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
}

const failureCode = (err: unknown) =>
  err instanceof UpstreamError && err.status !== null ? String(err.status) : 'sieć'

/** "429×3, 500×1" — do logu, bez niczego, co mogłoby zdradzić klucz. */
const countCodes = (codes: string[]) => {
  const counts = new Map<string, number>()
  for (const c of codes) counts.set(c, (counts.get(c) ?? 0) + 1)
  return [...counts].map(([c, n]) => `${c}×${n}`).join(', ')
}

async function fetchPlayers(teams: RawTeam[], apiKey: string): Promise<Map<string, PlayerInfo>> {
  const teamOf = new Map<string, string>() // id gracza → id jego drużyny
  for (const t of teams) for (const p of t.roster) if (!teamOf.has(p.id)) teamOf.set(p.id, t.id)

  const infos = new Map<string, PlayerInfo>()
  const todo: string[] = []
  const now = Date.now()
  for (const id of teamOf.keys()) {
    const cached = playerCache.get(id)
    if (cached && cached.expires > now) infos.set(id, cached.info)
    else todo.push(id)
  }

  const failed: string[] = []
  const codes: string[] = []
  await forEachLimit(todo, PLAYER_CONCURRENCY, async (id) => {
    try {
      const info = await fetchPlayer(id, apiKey)
      infos.set(id, info)
      playerCache.set(id, { info, expires: Date.now() + PLAYER_TTL_MS })
    } catch (err) {
      failed.push(id)
      codes.push(failureCode(err))
    }
  })
  if (failed.length === 0) return infos

  // Zapas: jeden /teams/{id} na drużynę, do której należy nieudany gracz.
  const teamCodes: string[] = []
  const teamIds = [...new Set(failed.map((id) => teamOf.get(id) as string))]
  const members = new Map<string, Map<string, PlayerInfo>>()
  await forEachLimit(teamIds, PLAYER_CONCURRENCY, async (teamId) => {
    members.set(
      teamId,
      await fetchTeamMembers(teamId, apiKey, (err) => teamCodes.push(failureCode(err))),
    )
  })
  let rescued = 0
  for (const id of failed) {
    const member = members.get(teamOf.get(id) as string)?.get(id)
    if (member) {
      infos.set(id, member)
      rescued++
    }
  }

  console.warn(
    `[bracket] profile graczy: ${failed.length}/${todo.length} nie powiodło się mimo retry (HTTP: ${countCodes(codes)}); ` +
      `z /teams uratowano ${rescued}` +
      (teamCodes.length ? `; /teams też zawiodło (HTTP: ${countCodes(teamCodes)})` : ''),
  )
  return infos
}

function buildTeam(raw: RawTeam, infos: Map<string, PlayerInfo>): Team {
  const players: Player[] = raw.roster.map((p) => {
    const info = infos.get(p.id)
    return {
      id: p.id,
      nickname: info?.nickname ?? p.nickname ?? null,
      avatar: info?.avatar ?? p.avatar,
      level: info?.level ?? null,
      elo: info?.elo ?? null,
    }
  })
  const elos = players.map((p) => p.elo).filter((e): e is number => e !== null)
  return {
    id: raw.id,
    name: raw.name,
    avatar: raw.avatar,
    avgElo: elos.length ? Math.round(elos.reduce((a, b) => a + b, 0) / elos.length) : null,
    players,
  }
}

async function build(apiKey: string) {
  const [subscribed, rawMatches] = await Promise.all([
    fetchSubscriptions(apiKey),
    fetchMatches(apiKey),
  ])

  // Drużyna z meczu, której nie ma w zgłoszeniach (np. dopisana ręcznie przez
  // organizatora), też ma być klikalna — bierzemy ją z frakcji meczu.
  const rawTeams = new Map(subscribed.map((t) => [t.id, t]))
  for (const m of rawMatches) {
    for (const f of [m.faction1, m.faction2]) {
      if (f && !rawTeams.has(f.id)) {
        rawTeams.set(f.id, {
          id: f.id,
          name: f.name ?? 'Drużyna',
          avatar: f.avatar,
          roster: f.roster,
        })
      }
    }
  }
  // Skład z meczu jest aktualniejszy niż ten ze zgłoszenia (kapitan mógł
  // wymienić gracza), o ile mecz w ogóle go podaje.
  for (const m of rawMatches) {
    for (const f of [m.faction1, m.faction2]) {
      const team = f && rawTeams.get(f.id)
      if (f && team && f.roster.length > 0) team.roster = f.roster
    }
  }

  const infos = await fetchPlayers([...rawTeams.values()], apiKey)
  const teams = [...rawTeams.values()].map((t) => buildTeam(t, infos))
  const missingNicknames = teams.reduce(
    (n, t) => n + t.players.filter((p) => p.nickname === null).length,
    0,
  )
  if (missingNicknames > 0) {
    console.warn(`[bracket] ${missingNicknames} graczy bez nicku mimo retry i zapasu z /teams`)
  }

  const positions = assignPositions(rawMatches)
  const matches: BracketMatch[] = rawMatches.map((m) => {
    const winner = m.winnerFaction ? m[m.winnerFaction] : null
    return {
      round: m.round,
      position: positions.get(m) as number,
      team1Id: m.faction1?.id ?? null,
      team2Id: m.faction2?.id ?? null,
      score1: m.score1,
      score2: m.score2,
      winnerId: winner?.id ?? null,
      status: m.status,
      scheduledAt: m.scheduledAt ? new Date(m.scheduledAt * 1000).toISOString() : null,
    }
  })
  matches.sort((a, b) => a.round - b.round || a.position - b.position)

  // Zanim turniej ruszy, FACEIT nie ma żadnych meczów z drużynami.
  const started = matches.some((m) => m.team1Id || m.team2Id)
  const decided = matches.filter((m) => m.status !== 'cancelled')
  const phase: Phase = !started
    ? 'registration'
    : decided.length > 0 && decided.every((m) => m.status === 'finished')
      ? 'finished'
      : 'live'

  return { body: { phase, teams, matches: started ? matches : [] }, complete: missingNicknames === 0 }
}

export default {
  async fetch() {
    const apiKey = process.env.FACEIT_API_KEY
    if (!apiKey) {
      return json({ error: 'FACEIT_API_KEY is not configured' }, 500, 'no-store')
    }

    try {
      // Komplet nicków → pełny cache; inaczej krótki, żeby dziura nie wisiała 15 min.
      const { body, complete } = await build(apiKey)
      return json(body, 200, complete ? CACHE_OK : CACHE_PARTIAL)
    } catch (err) {
      if (err instanceof UpstreamError) {
        return json({ error: 'FACEIT API error' }, 502, 'no-store')
      }
      return json({ error: 'FACEIT API unreachable' }, 502, 'no-store')
    }
  },
}
