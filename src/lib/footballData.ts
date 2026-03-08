import { supabase } from './supabase'

const BASE_URL = 'https://api.football-data.org/v4'
const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY as string | undefined

interface FdMatch {
  id: number
  utcDate: string
  status: string
  matchday: number
  stage: string
  homeTeam: { id: number; name: string; shortName: string; tla: string }
  awayTeam: { id: number; name: string; shortName: string; tla: string }
  score: {
    fullTime: { home: number | null; away: number | null }
  }
}

interface FdResponse {
  matches: FdMatch[]
}

interface FdStanding {
  position: number
  team: { id: number; name: string; shortName: string; crest: string }
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

interface FdStandingsResponse {
  standings: Array<{
    stage: string
    type: string
    table: FdStanding[]
  }>
}

export type UclStanding = FdStanding

async function fdFetch<T>(endpoint: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (API_KEY) headers['X-Auth-Token'] = API_KEY

  const res = await fetch(`${BASE_URL}${endpoint}`, { headers })
  if (!res.ok) {
    throw new Error(`football-data.org ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

// Match football-data.org team name to our clubs table
function findClubMatch(
  fdName: string,
  fdShortName: string,
  fdTla: string,
  clubs: Array<{ id: number; name: string; short_name: string }>
): number | null {
  const lower = fdName.toLowerCase()
  const shortLower = fdShortName.toLowerCase()

  for (const club of clubs) {
    const clubLower = club.name.toLowerCase()
    const clubShort = club.short_name.toLowerCase()

    // Exact match on name or short_name
    if (clubLower === lower || clubLower === shortLower) return club.id

    // TLA match (e.g. "LIV" === "LIV")
    if (clubShort === fdTla.toLowerCase()) return club.id

    // Partial match (e.g. "Liverpool" includes "Liverpool FC")
    if (lower.includes(clubLower) || clubLower.includes(lower)) return club.id
    if (shortLower.includes(clubLower) || clubLower.includes(shortLower)) return club.id
  }

  return null
}

export const UCL_STAGES = [
  { value: 'LAST_16', label: 'Round of 16' },
  { value: 'QUARTER_FINALS', label: 'Quarter-Finals' },
  { value: 'SEMI_FINALS', label: 'Semi-Finals' },
  { value: 'FINAL', label: 'Final' },
] as const

export type UclStage = (typeof UCL_STAGES)[number]['value']

/** Fetch UCL fixtures for a knockout stage and return mapped matches */
export async function fetchUclFixtures(stage: UclStage): Promise<{
  matches: Array<{
    homeClubId: number
    awayClubId: number
    kickoffAt: string
    dayLabel: string
    homeName: string
    awayName: string
  }>
  unmapped: string[]
}> {
  const data = await fdFetch<FdResponse>(
    `/competitions/CL/matches?stage=${stage}`
  )

  const { data: clubs } = await supabase
    .from('clubs')
    .select('id, name, short_name')

  if (!clubs) throw new Error('Failed to fetch clubs from DB')

  const mapped: Array<{
    homeClubId: number
    awayClubId: number
    kickoffAt: string
    dayLabel: string
    homeName: string
    awayName: string
  }> = []
  const unmapped: string[] = []

  for (const m of data.matches) {
    const homeId = findClubMatch(m.homeTeam.name, m.homeTeam.shortName, m.homeTeam.tla, clubs)
    const awayId = findClubMatch(m.awayTeam.name, m.awayTeam.shortName, m.awayTeam.tla, clubs)

    if (!homeId || !awayId) {
      if (!homeId) unmapped.push(m.homeTeam.name)
      if (!awayId) unmapped.push(m.awayTeam.name)
      continue
    }

    const kickoff = new Date(m.utcDate)
    const day = kickoff.getUTCDay()
    const dayLabel = day === 2 ? 'Tuesday' : day === 3 ? 'Wednesday' : 'Tuesday'

    mapped.push({
      homeClubId: homeId,
      awayClubId: awayId,
      kickoffAt: m.utcDate,
      dayLabel,
      homeName: m.homeTeam.shortName,
      awayName: m.awayTeam.shortName,
    })
  }

  return { matches: mapped, unmapped: [...new Set(unmapped)] }
}

/** Fetch UCL league-phase standings */
export async function fetchUclStandings(): Promise<UclStanding[]> {
  const data = await fdFetch<FdStandingsResponse>('/competitions/CL/standings')

  // Find the league-phase / total standings
  const standing = data.standings.find(
    (s) => s.type === 'TOTAL'
  )

  return standing?.table ?? []
}
