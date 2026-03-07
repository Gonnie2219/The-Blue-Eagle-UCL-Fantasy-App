import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import type { Match, Player } from '@/types'

interface PredictedLineupProps {
  match: Match
  players: Player[]
}

interface LineupEntry {
  lineup_position: number
  player: Player
}

export function PredictedLineup({ match, players }: PredictedLineupProps) {
  const [lineup, setLineup] = useState<LineupEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('predicted_lineups')
        .select('lineup_position, player:players(*, club:clubs(*))')
        .eq('match_id', match.id)
        .order('lineup_position', { ascending: true })

      setLineup((data as unknown as LineupEntry[]) ?? [])
      setLoading(false)
    }
    load()
  }, [match.id])

  const homePlayers = lineup.filter((e) => e.player?.club_id === match.home_club_id)
  const awayPlayers = lineup.filter((e) => e.player?.club_id === match.away_club_id)

  // Fallback to old behavior if no predicted lineup data
  if (!loading && lineup.length === 0) {
    const homeFallback = players
      .filter((p) => p.club_id === match.home_club_id && p.is_available)
      .sort((a, b) => posOrder(a.position) - posOrder(b.position))
    const awayFallback = players
      .filter((p) => p.club_id === match.away_club_id && p.is_available)
      .sort((a, b) => posOrder(a.position) - posOrder(b.position))

    return (
      <LineupDisplay
        match={match}
        homePlayers={homeFallback.slice(0, 11)}
        awayPlayers={awayFallback.slice(0, 11)}
      />
    )
  }

  if (loading) {
    return <div className="py-4 text-center text-xs text-muted-foreground">Loading lineups...</div>
  }

  return (
    <LineupDisplay
      match={match}
      homePlayers={homePlayers.map((e) => e.player)}
      awayPlayers={awayPlayers.map((e) => e.player)}
    />
  )
}

function LineupDisplay({
  match,
  homePlayers,
  awayPlayers,
}: {
  match: Match
  homePlayers: Player[]
  awayPlayers: Player[]
}) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <p className="text-center text-xs font-semibold text-muted-foreground">
        Predicted Lineups
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold">{match.home_club?.short_name}</p>
          <div className="space-y-0.5">
            {homePlayers.map((p) => (
              <div key={p.id} className="flex items-center gap-1">
                <span className={cn('rounded px-1 text-[9px] font-bold', posColors[p.position])}>
                  {p.position}
                </span>
                <span className="truncate text-xs">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold">{match.away_club?.short_name}</p>
          <div className="space-y-0.5">
            {awayPlayers.map((p) => (
              <div key={p.id} className="flex items-center gap-1">
                <span className={cn('rounded px-1 text-[9px] font-bold', posColors[p.position])}>
                  {p.position}
                </span>
                <span className="truncate text-xs">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function posOrder(pos: string): number {
  return pos === 'GK' ? 0 : pos === 'DEF' ? 1 : pos === 'MID' ? 2 : 3
}
