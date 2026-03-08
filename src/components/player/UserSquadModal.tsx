import { useEffect, useState } from 'react'
import { Crown, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { useUserSquad } from '@/contexts/UserSquadContext'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'

interface SquadRow {
  id: number
  player_id: number
  is_starter: boolean
  is_captain: boolean
  is_vice_captain: boolean
  player?: {
    id: number
    name: string
    position: string
    club?: { short_name: string }
  }
}

export function UserSquadModal() {
  const { selectedUserId, close } = useUserSquad()
  const { openPlayerStats } = usePlayerStats()
  const [displayName, setDisplayName] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [squad, setSquad] = useState<SquadRow[]>([])
  const [playerPoints, setPlayerPoints] = useState<Map<number, number>>(new Map())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedUserId) {
      setSquad([])
      setPlayerPoints(new Map())
      return
    }

    setLoading(true)

    Promise.all([
      supabase
        .from('profiles')
        .select('display_name, total_points')
        .eq('id', selectedUserId)
        .single(),
      supabase
        .from('squad_players')
        .select('id, player_id, is_starter, is_captain, is_vice_captain, player:players(id, name, position, club:clubs(short_name))')
        .eq('user_id', selectedUserId),
    ]).then(async ([profileRes, squadRes]) => {
      setDisplayName(profileRes.data?.display_name ?? '')
      setTotalPoints(profileRes.data?.total_points ?? 0)

      const squadData = (squadRes.data ?? []) as unknown as SquadRow[]
      setSquad(squadData)

      // Fetch total points per player from player_scores
      const playerIds = squadData.map((s) => s.player_id)
      if (playerIds.length > 0) {
        const { data: scores } = await supabase
          .from('player_scores')
          .select('player_id, total_points')
          .in('player_id', playerIds)

        const pts = new Map<number, number>()
        for (const s of scores ?? []) {
          pts.set(s.player_id, (pts.get(s.player_id) ?? 0) + s.total_points)
        }
        setPlayerPoints(pts)
      }

      setLoading(false)
    })
  }, [selectedUserId])

  if (!selectedUserId) return null

  const starters = squad.filter((s) => s.is_starter)
  const bench = squad.filter((s) => !s.is_starter)

  const renderRow = (sp: SquadRow) => {
    const p = sp.player
    if (!p) return null
    const pts = playerPoints.get(sp.player_id) ?? 0

    return (
      <button
        key={sp.id}
        onClick={() => openPlayerStats(p.id)}
        className="flex w-full items-center justify-between rounded-md border px-3 py-1.5 text-left hover:bg-accent"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[p.position])}>
            {p.position}
          </span>
          {sp.is_captain && <Crown className="h-3 w-3 text-primary" />}
          {sp.is_vice_captain && <Star className="h-3 w-3 text-primary" />}
          <span className="truncate text-sm">{p.name}</span>
          <span className="text-[10px] text-muted-foreground">{p.club?.short_name}</span>
        </div>
        <span className={cn(
          'text-sm font-bold tabular-nums',
          pts > 0 ? 'text-primary' : 'text-muted-foreground'
        )}>
          {pts}
        </span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/50" onClick={close} />
      <div className="relative z-10 w-full max-w-lg rounded-t-xl sm:rounded-xl border bg-background shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="text-sm font-bold">{displayName}</p>
            <p className="text-xs text-muted-foreground">Total: {totalPoints} pts</p>
          </div>
          <button onClick={close} className="rounded-md p-1 hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Squad */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
          ) : squad.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No squad yet</p>
          ) : (
            <>
              <div>
                <p className="mb-1 text-xs font-semibold text-muted-foreground">STARTING XI</p>
                <div className="space-y-1">{starters.map(renderRow)}</div>
              </div>
              {bench.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">BENCH</p>
                  <div className="space-y-1">{bench.map(renderRow)}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
