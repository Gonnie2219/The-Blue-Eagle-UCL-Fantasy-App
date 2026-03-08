import { useState, useCallback, useEffect } from 'react'
import { Search, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'
import { usePlayerPoints } from '@/hooks/usePlayerPoints'
import type { Player, PlayerPosition } from '@/types'

const positions: (PlayerPosition | 'ALL')[] = ['ALL', 'GK', 'DEF', 'MID', 'FWD']

function useStarredPlayers() {
  const key = 'starred-players'
  const [starred, setStarred] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? new Set(JSON.parse(saved) as number[]) : new Set()
    } catch {
      return new Set()
    }
  })

  const toggle = useCallback((id: number) => {
    setStarred((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(key, JSON.stringify([...next]))
      return next
    })
  }, [])

  return { starred, toggle }
}

interface PlayerPoolProps {
  players: Player[]
  onPick: (playerId: number) => void
  canPick: boolean
  picking: boolean
}

export function PlayerPool({ players, onPick, canPick, picking }: PlayerPoolProps) {
  const { openPlayerStats, setDraftPick } = usePlayerStats()
  const pointsMap = usePlayerPoints()

  // Register draft pick action so the stats modal can show a Pick button
  useEffect(() => {
    setDraftPick({ canPick, picking, onPick })
    return () => setDraftPick(null)
  }, [canPick, picking, onPick, setDraftPick])
  const { starred, toggle: toggleStar } = useStarredPlayers()
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState<PlayerPosition | 'ALL'>('ALL')
  const [showStarred, setShowStarred] = useState(false)

  const filtered = players.filter((p) => {
    if (showStarred && !starred.has(p.id)) return false
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
        <button
          onClick={() => setShowStarred(!showStarred)}
          className={cn(
            'rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
            showStarred
              ? 'bg-yellow-500 text-white'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          )}
        >
          <Star className={cn('h-3.5 w-3.5', showStarred && 'fill-current')} />
        </button>
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
            onClick={() => openPlayerStats(player.id)}
            className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-1 min-w-0">
              <button
                onClick={(e) => { e.stopPropagation(); toggleStar(player.id) }}
                className="shrink-0 p-0.5"
              >
                <Star className={cn(
                  'h-3.5 w-3.5',
                  starred.has(player.id) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/40'
                )} />
              </button>
              <div className="flex items-center gap-2 min-w-0">
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
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-primary tabular-nums">
              {pointsMap.get(player.id) ?? 0}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No players found</p>
        )}
      </div>
    </div>
  )
}
