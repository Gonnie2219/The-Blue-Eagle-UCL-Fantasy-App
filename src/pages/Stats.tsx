import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'

interface SeasonTopPlayer {
  playerId: number
  name: string
  position: string
  clubShort: string
  totalPoints: number
  goals: number
  assists: number
  appearances: number
}

interface UserSeason {
  displayName: string
  totalPoints: number
}

export default function Stats() {
  const { openPlayerStats } = usePlayerStats()
  const [topPlayers, setTopPlayers] = useState<SeasonTopPlayer[]>([])
  const [topScorers, setTopScorers] = useState<SeasonTopPlayer[]>([])
  const [topAssisters, setTopAssisters] = useState<SeasonTopPlayer[]>([])
  const [userStats, setUserStats] = useState<UserSeason[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase
        .from('player_scores')
        .select('player_id, total_points, goals, assists, minutes_played, player:players(name, position, club:clubs(short_name))')
        .gt('minutes_played', 0),
      supabase
        .from('profiles')
        .select('display_name, total_points')
        .order('total_points', { ascending: false }),
    ]).then(([scoresRes, profilesRes]) => {
      const scores = (scoresRes.data ?? []) as unknown as Array<{
        player_id: number
        total_points: number
        goals: number
        assists: number
        minutes_played: number
        player: { name: string; position: string; club: { short_name: string } }
      }>

      // Aggregate per player
      const playerMap = new Map<number, SeasonTopPlayer>()
      for (const s of scores) {
        const existing = playerMap.get(s.player_id)
        if (existing) {
          existing.totalPoints += s.total_points
          existing.goals += s.goals
          existing.assists += s.assists
          existing.appearances++
        } else {
          playerMap.set(s.player_id, {
            playerId: s.player_id,
            name: s.player.name,
            position: s.player.position,
            clubShort: s.player.club?.short_name ?? '',
            totalPoints: s.total_points,
            goals: s.goals,
            assists: s.assists,
            appearances: 1,
          })
        }
      }

      const allPlayers = [...playerMap.values()]

      setTopPlayers([...allPlayers].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 10))
      setTopScorers([...allPlayers].sort((a, b) => b.goals - a.goals).slice(0, 10).filter((p) => p.goals > 0))
      setTopAssisters([...allPlayers].sort((a, b) => b.assists - a.assists).slice(0, 10).filter((p) => p.assists > 0))

      setUserStats(
        (profilesRes.data ?? []).map((p) => ({
          displayName: p.display_name,
          totalPoints: p.total_points,
        }))
      )

      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="py-8 text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const renderPlayerList = (
    title: string,
    players: SeasonTopPlayer[],
    statFn: (p: SeasonTopPlayer) => string
  ) => (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      {players.length === 0 && (
        <p className="py-2 text-center text-xs text-muted-foreground">No data yet</p>
      )}
      {players.map((p, i) => (
        <button
          key={p.playerId}
          onClick={() => openPlayerStats(p.playerId)}
          className="flex w-full items-center justify-between rounded-md border bg-card px-3 py-1.5 text-left hover:bg-accent/50"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
            <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[p.position])}>
              {p.position}
            </span>
            <span className="truncate text-sm">{p.name}</span>
            <span className="text-[10px] text-muted-foreground">{p.clubShort}</span>
          </div>
          <span className="text-sm font-bold text-primary">{statFn(p)}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Manager standings with points bar */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground">MANAGERS</p>
        {userStats.map((u) => {
          const maxPts = userStats[0]?.totalPoints || 1
          const pct = Math.round((u.totalPoints / maxPts) * 100)
          return (
            <div key={u.displayName} className="rounded-md border bg-card px-3 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{u.displayName}</span>
                <span className="text-sm font-bold text-primary">{u.totalPoints} pts</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {renderPlayerList('TOP POINTS', topPlayers, (p) => `${p.totalPoints} pts`)}
      {renderPlayerList('TOP SCORERS', topScorers, (p) => `${p.goals} goals`)}
      {renderPlayerList('TOP ASSISTS', topAssisters, (p) => `${p.assists} assists`)}
    </div>
  )
}
