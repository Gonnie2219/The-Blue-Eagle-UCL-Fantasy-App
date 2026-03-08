import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'
import { useUserSquad } from '@/contexts/UserSquadContext'
import type { Matchday } from '@/types'

interface MatchResult {
  id: number
  home_score: number
  away_score: number
  status: string
  home_club?: { short_name: string }
  away_club?: { short_name: string }
}

interface UserMatchdayScore {
  userId: string
  displayName: string
  points: number
}

interface TopPerformer {
  playerId: number
  playerName: string
  position: string
  clubShort: string
  points: number
}

export default function History() {
  const { openPlayerStats } = usePlayerStats()
  const { openUserSquad } = useUserSquad()
  const [matchdays, setMatchdays] = useState<Matchday[]>([])
  const [selectedMd, setSelectedMd] = useState<number | null>(null)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [userScores, setUserScores] = useState<UserMatchdayScore[]>([])
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('matchdays')
      .select('*')
      .eq('status', 'completed')
      .order('first_kickoff', { ascending: false })
      .then(({ data }) => {
        setMatchdays(data ?? [])
        if (data && data.length > 0) setSelectedMd(data[0].id)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!selectedMd) return

    // Fetch matches for this matchday
    supabase
      .from('matches')
      .select('id, home_score, away_score, status, home_club:clubs!home_club_id(short_name), away_club:clubs!away_club_id(short_name)')
      .eq('matchday_id', selectedMd)
      .then(({ data }) => setMatches((data ?? []) as unknown as MatchResult[]))

    // Fetch top performers (top 5 players by points this matchday)
    supabase
      .from('player_scores')
      .select('total_points, player:players(id, name, position, club:clubs(short_name))')
      .eq('matchday_id', selectedMd)
      .gt('total_points', 0)
      .order('total_points', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setTopPerformers(
          ((data ?? []) as unknown as Array<{
            total_points: number
            player: { id: number; name: string; position: string; club: { short_name: string } }
          }>).map((d) => ({
            playerId: d.player.id,
            playerName: d.player.name,
            position: d.player.position,
            clubShort: d.player.club?.short_name ?? '',
            points: d.total_points,
          }))
        )
      })

    // Calculate per-user points for this matchday
    // Get all squad_players, then sum their player_scores for this matchday (starters only)
    Promise.all([
      supabase.from('profiles').select('id, display_name'),
      supabase
        .from('squad_players')
        .select('user_id, player_id, is_starter, is_captain, is_vice_captain'),
      supabase
        .from('player_scores')
        .select('player_id, total_points')
        .eq('matchday_id', selectedMd),
    ]).then(([profilesRes, squadRes, scoresRes]) => {
      const profiles = profilesRes.data ?? []
      const squads = squadRes.data ?? []
      const scores = scoresRes.data ?? []

      const scoreMap = new Map<number, number>()
      for (const s of scores) {
        scoreMap.set(s.player_id, (scoreMap.get(s.player_id) ?? 0) + s.total_points)
      }

      const userPoints: UserMatchdayScore[] = profiles.map((p) => {
        const userSquad = squads.filter((s) => s.user_id === p.id && s.is_starter)
        const captain = userSquad.find((s) => s.is_captain)
        const captainPts = captain ? (scoreMap.get(captain.player_id) ?? 0) : 0
        const captainDNP = captainPts === 0

        let pts = 0
        for (const sp of userSquad) {
          let playerPts = scoreMap.get(sp.player_id) ?? 0
          if (sp.is_captain && !captainDNP) playerPts *= 2
          if (sp.is_vice_captain && captainDNP) playerPts *= 2
          pts += playerPts
        }
        return { userId: p.id, displayName: p.display_name, points: pts }
      })

      userPoints.sort((a, b) => b.points - a.points)
      setUserScores(userPoints)
    })
  }, [selectedMd])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="py-8 text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matchdays.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">No completed matchdays yet.</p>
        </div>
      ) : (
        <>
          {/* Matchday selector */}
          <div className="flex gap-1 overflow-x-auto">
            {matchdays.map((md) => (
              <button
                key={md.id}
                onClick={() => setSelectedMd(md.id)}
                className={cn(
                  'whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium',
                  selectedMd === md.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border hover:bg-accent'
                )}
              >
                {md.name}
              </button>
            ))}
          </div>

          {/* Match results */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">RESULTS</p>
            {matches.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
                <span className="font-medium">{m.home_club?.short_name}</span>
                <span className="font-bold text-primary">{m.home_score} - {m.away_score}</span>
                <span className="font-medium">{m.away_club?.short_name}</span>
              </div>
            ))}
          </div>

          {/* User rankings for this matchday */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">MANAGER SCORES</p>
            {userScores.map((u, i) => (
              <button
                key={u.userId}
                onClick={() => openUserSquad(u.userId)}
                className="flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-left hover:bg-accent/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                  <span className="text-sm font-medium">{u.displayName}</span>
                </div>
                <span className="text-sm font-bold text-primary">{u.points} pts</span>
              </button>
            ))}
          </div>

          {/* Top performers */}
          {topPerformers.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">TOP PERFORMERS</p>
              {topPerformers.map((p) => (
                <button
                  key={p.playerId}
                  onClick={() => openPlayerStats(p.playerId)}
                  className="flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-left hover:bg-accent/50"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[p.position])}>
                      {p.position}
                    </span>
                    <span className="text-sm">{p.playerName}</span>
                    <span className="text-[10px] text-muted-foreground">{p.clubShort}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">{p.points} pts</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

