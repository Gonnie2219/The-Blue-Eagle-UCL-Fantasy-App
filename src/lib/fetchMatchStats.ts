import { supabase } from './supabase'
import { calculatePoints } from './scoring'

const UEFA_MATCH_API = 'https://match.uefa.com/v5/matches'

interface UefaGoal {
  scoringPlayerName?: string
  minute?: string
  team?: { teamCode?: string }
}

interface UefaLineupPlayer {
  player?: {
    internationalName?: string
    fieldPosition?: string
  }
  jerseyNo?: number
  isSubstitute?: boolean
  isCaptain?: boolean
  bookings?: Array<{ card?: string; minute?: string }>
}

interface UefaLineup {
  team?: { teamCode?: string; associationId?: string }
  players?: UefaLineupPlayer[]
}

// Find the UEFA match ID for an R16 match based on clubs
async function findUefaMatchId(homeShort: string, awayShort: string, kickoffDate: string): Promise<number | null> {
  const fromDate = kickoffDate.split('T')[0]
  const toDate = fromDate

  // Search through pages to find the match
  for (let offset = 0; offset < 30; offset += 6) {
    try {
      const res = await fetch(
        `${UEFA_MATCH_API}?competitionId=1&seasonYear=2026&fromDate=${fromDate}&toDate=${toDate}&offset=${offset}&limit=6`
      )
      if (!res.ok) break
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) break

      for (const match of data) {
        const home = match.homeTeam?.internationalName?.toLowerCase() ?? ''
        const away = match.awayTeam?.internationalName?.toLowerCase() ?? ''
        const homeMatch = home.includes(homeShort.toLowerCase())
        const awayMatch = away.includes(awayShort.toLowerCase())
        if (homeMatch || awayMatch) {
          return match.id
        }
      }
    } catch {
      break
    }
  }
  return null
}

// Fetch stats from UEFA and populate player_scores
export async function fetchUefaMatchStats(
  matchId: number, // our DB match ID
  matchdayId: number,
  homeClubId: number,
  awayClubId: number,
  homeShort: string,
  awayShort: string,
  kickoffAt: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Step 1: Find UEFA match ID
    const uefaId = await findUefaMatchId(homeShort, awayShort, kickoffAt)
    if (!uefaId) {
      return { success: false, message: 'Could not find match on UEFA API' }
    }

    // Step 2: Fetch match data (goals) and lineups
    const [matchRes, lineupRes] = await Promise.all([
      fetch(`${UEFA_MATCH_API}/${uefaId}`),
      fetch(`${UEFA_MATCH_API}/${uefaId}/lineups`),
    ])

    if (!matchRes.ok || !lineupRes.ok) {
      return { success: false, message: 'Failed to fetch from UEFA API' }
    }

    const matchData = await matchRes.json()
    const lineupData = await lineupRes.json()

    // Step 3: Parse goals
    const goals: Array<{ playerName: string; minute: number }> = []
    for (const goal of (matchData.goals ?? []) as UefaGoal[]) {
      if (goal.scoringPlayerName && goal.minute) {
        const min = parseInt(goal.minute.split(':')[0])
        goals.push({ playerName: goal.scoringPlayerName, minute: min })
      }
    }

    // Step 4: Parse lineups + cards
    const playerStats = new Map<string, {
      minutes: number
      goals: number
      yellows: number
      redCard: boolean
      clubId: number
    }>()

    const homeScore = matchData.score?.total?.home ?? 0
    const awayScore = matchData.score?.total?.away ?? 0

    for (const lineup of (lineupData.lineups ?? lineupData ?? []) as UefaLineup[]) {
      const isHome = true // We'll determine by team code
      const clubId = homeClubId // Will be refined below

      for (const lp of (lineup.players ?? []) as UefaLineupPlayer[]) {
        const name = lp.player?.internationalName
        if (!name) continue

        const isStarter = !lp.isSubstitute
        let yellows = 0
        let redCard = false

        for (const booking of (lp.bookings ?? [])) {
          if (booking.card === 'Y') yellows++
          if (booking.card === 'R') redCard = true
        }

        // Starters get 90 min, subs get estimated 25 min
        const minutes = isStarter ? 90 : 25

        playerStats.set(name, {
          minutes: isStarter ? minutes : 25,
          goals: 0,
          yellows,
          redCard,
          clubId,
        })
      }
    }

    // Count goals per player
    for (const goal of goals) {
      const entry = playerStats.get(goal.playerName)
      if (entry) {
        entry.goals++
      }
    }

    // Step 5: Match UEFA names to our DB players
    const { data: dbPlayers } = await supabase
      .from('players')
      .select('id, name, position, club_id')
      .in('club_id', [homeClubId, awayClubId])

    if (!dbPlayers) return { success: false, message: 'Failed to fetch players from DB' }

    // Check existing scores
    const { data: existingScores } = await supabase
      .from('player_scores')
      .select('player_id')
      .eq('match_id', matchId)

    const existingIds = new Set((existingScores ?? []).map((e) => e.player_id))

    // Fuzzy match player names
    const scoresToInsert: Array<Record<string, unknown>> = []

    for (const dbPlayer of dbPlayers) {
      if (existingIds.has(dbPlayer.id)) continue

      // Try to find this player in UEFA data
      let uefaStats = playerStats.get(dbPlayer.name)

      // Fuzzy: try last name match
      if (!uefaStats) {
        const lastName = dbPlayer.name.split(' ').pop()?.toLowerCase()
        for (const [uefaName, stats] of playerStats) {
          if (uefaName.toLowerCase().includes(lastName ?? '___')) {
            uefaStats = stats
            break
          }
        }
      }

      const isHomePlayer = dbPlayer.club_id === homeClubId
      const conceded = isHomePlayer ? awayScore : homeScore
      const cleanSheet = conceded === 0

      scoresToInsert.push({
        player_id: dbPlayer.id,
        matchday_id: matchdayId,
        match_id: matchId,
        minutes_played: uefaStats?.minutes ?? 0,
        goals: uefaStats?.goals ?? 0,
        assists: 0,
        clean_sheet: (uefaStats?.minutes ?? 0) >= 60 && cleanSheet,
        yellow_cards: uefaStats?.yellows ?? 0,
        red_card: uefaStats?.redCard ?? false,
        penalties_won: 0,
        penalties_missed: 0,
        penalties_saved: 0,
        own_goals: 0,
        motm: false,
        total_points: 0,
      })
    }

    if (scoresToInsert.length > 0) {
      const { error } = await supabase.from('player_scores').insert(scoresToInsert)
      if (error) return { success: false, message: `DB insert failed: ${error.message}` }
    }

    // Step 6: Calculate points for all inserted scores
    const { data: allScores } = await supabase
      .from('player_scores')
      .select('*, player:players(position)')
      .eq('match_id', matchId)

    for (const score of (allScores ?? [])) {
      if (score.player?.position) {
        const pts = calculatePoints(score, score.player.position)
        if (pts !== score.total_points) {
          await supabase.from('player_scores')
            .update({ total_points: pts })
            .eq('id', score.id)
        }
      }
    }

    return {
      success: true,
      message: `Imported stats for ${scoresToInsert.length} players. Goals: ${goals.length}. Please verify assists and MOTM manually.`,
    }
  } catch (err) {
    return { success: false, message: `Error: ${err}` }
  }
}
