import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'
import { format } from 'date-fns'

interface MatchStat {
  id: number
  minutes_played: number
  goals: number
  assists: number
  clean_sheet: boolean
  yellow_cards: number
  red_card: boolean
  total_points: number
  match?: {
    kickoff_at: string
    home_score: number
    away_score: number
    home_club?: { short_name: string }
    away_club?: { short_name: string }
  }
}

interface PlayerInfo {
  id: number
  name: string
  position: string
  club?: { name: string; short_name: string }
}

export function PlayerStatsModal() {
  const { selectedPlayerId, close } = usePlayerStats()
  const [player, setPlayer] = useState<PlayerInfo | null>(null)
  const [stats, setStats] = useState<MatchStat[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedPlayerId) {
      setPlayer(null)
      setStats([])
      return
    }

    setLoading(true)

    Promise.all([
      supabase
        .from('players')
        .select('id, name, position, club:clubs(name, short_name)')
        .eq('id', selectedPlayerId)
        .single(),
      supabase
        .from('player_scores')
        .select('id, minutes_played, goals, assists, clean_sheet, yellow_cards, red_card, total_points, match:matches(kickoff_at, home_score, away_score, home_club:clubs!home_club_id(short_name), away_club:clubs!away_club_id(short_name))')
        .eq('player_id', selectedPlayerId)
        .order('id', { ascending: false }),
    ]).then(([playerRes, statsRes]) => {
      setPlayer(playerRes.data as unknown as PlayerInfo)
      setStats((statsRes.data ?? []) as unknown as MatchStat[])
      setLoading(false)
    })
  }, [selectedPlayerId])

  if (!selectedPlayerId) return null

  const totalPoints = stats.reduce((sum, s) => sum + s.total_points, 0)
  const totalGoals = stats.reduce((sum, s) => sum + s.goals, 0)
  const totalAssists = stats.reduce((sum, s) => sum + s.assists, 0)
  const appearances = stats.filter((s) => s.minutes_played > 0).length
  const cleanSheets = stats.filter((s) => s.clean_sheet).length

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/50" onClick={close} />
      <div className="relative z-10 w-full max-w-lg rounded-t-xl sm:rounded-xl border bg-background shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            {player && (
              <>
                <span className={cn('rounded px-1.5 py-0.5 text-xs font-bold', posColors[player.position])}>
                  {player.position}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.club?.name}</p>
                </div>
              </>
            )}
          </div>
          <button onClick={close} className="rounded-md p-1 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Summary */}
        {!loading && stats.length > 0 && (
          <div className="grid grid-cols-5 gap-1 border-b px-4 py-3">
            {[
              { label: 'Pts', value: totalPoints },
              { label: 'Apps', value: appearances },
              { label: 'Goals', value: totalGoals },
              { label: 'Assists', value: totalAssists },
              { label: 'CS', value: cleanSheets },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-primary">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Match history */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
          ) : stats.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No match data yet</p>
          ) : (
            <div className="space-y-1">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_40px_28px_28px_28px_28px_36px] gap-1 text-[10px] font-semibold text-muted-foreground px-2">
                <span>Match</span>
                <span className="text-center">Min</span>
                <span className="text-center">G</span>
                <span className="text-center">A</span>
                <span className="text-center">CS</span>
                <span className="text-center">YC</span>
                <span className="text-center">Pts</span>
              </div>
              {stats.map((s) => {
                const home = s.match?.home_club?.short_name ?? '?'
                const away = s.match?.away_club?.short_name ?? '?'
                const date = s.match?.kickoff_at
                  ? format(new Date(s.match.kickoff_at), 'MMM d')
                  : ''

                return (
                  <div
                    key={s.id}
                    className="grid grid-cols-[1fr_40px_28px_28px_28px_28px_36px] gap-1 items-center rounded-md border px-2 py-1.5 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{home} {s.match?.home_score}-{s.match?.away_score} {away}</p>
                      <p className="text-[10px] text-muted-foreground">{date}</p>
                    </div>
                    <span className="text-center">{s.minutes_played}'</span>
                    <span className="text-center">{s.goals || '-'}</span>
                    <span className="text-center">{s.assists || '-'}</span>
                    <span className="text-center">{s.clean_sheet ? '✓' : '-'}</span>
                    <span className="text-center">
                      {s.red_card ? '🔴' : s.yellow_cards > 0 ? s.yellow_cards : '-'}
                    </span>
                    <span className={cn(
                      'text-center font-bold',
                      s.total_points > 0 ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {s.total_points}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
