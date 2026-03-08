import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'
import { usePlayerPoints } from '@/hooks/usePlayerPoints'
import type { Player, PlayerPosition } from '@/types'

const positions: (PlayerPosition | 'ALL')[] = ['ALL', 'GK', 'DEF', 'MID', 'FWD']

interface PlayerPoolProps {
  players: Player[]
  onPick: (playerId: number) => void
  canPick: boolean
  picking: boolean
}

export function PlayerPool({ players, onPick, canPick, picking }: PlayerPoolProps) {
  const { openPlayerStats } = usePlayerStats()
  const pointsMap = usePlayerPoints()
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState<PlayerPosition | 'ALL'>('ALL')

  const filtered = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.club?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesPos = posFilter === 'ALL' || p.position === posFilter
    return matchesSearch && matchesPos
  })

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-1">
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => setPosFilter(pos)}
            className={cn(
              'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
              posFilter === pos
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
          >
            {pos}
          </button>
        ))}
      </div>

      <div className="max-h-80 space-y-1 overflow-y-auto">
        {filtered.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
          >
            <button onClick={() => openPlayerStats(player.id)} className="flex items-center gap-2 min-w-0 text-left">
              <span className={cn(
                'rounded px-1.5 py-0.5 text-xs font-bold',
                posColors[player.position],
              )}>
                {player.position}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{player.name}</p>
                <p className="truncate text-xs text-muted-foreground">{player.club?.name}</p>
              </div>
            </button>
            <span className="shrink-0 text-xs font-bold text-primary tabular-nums">
              {pointsMap.get(player.id) ?? 0}
            </span>
            {canPick && (
              <button
                onClick={() => onPick(player.id)}
                disabled={picking}
                className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {picking ? '...' : 'Pick'}
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No players found</p>
        )}
      </div>
    </div>
  )
}
