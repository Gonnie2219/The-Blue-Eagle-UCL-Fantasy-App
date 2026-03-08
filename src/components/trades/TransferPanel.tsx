import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'
import { useTransfers } from '@/hooks/useTransfers'
import { useSquad } from '@/hooks/useSquad'
import type { PlayerPosition } from '@/types'

export function TransferPanel() {
  const { openPlayerStats } = usePlayerStats()
  const { freeAgents, profile, loading, submitting, makeTransfer } = useTransfers()
  const { squad, reload: reloadSquad } = useSquad()
  const [playerOutId, setPlayerOutId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState<PlayerPosition | 'ALL'>('ALL')

  const filteredAgents = freeAgents.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.club?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesPos = posFilter === 'ALL' || p.position === posFilter
    return matchesSearch && matchesPos
  })

  const handleTransfer = async (playerInId: number) => {
    if (!playerOutId) return
    await makeTransfer(playerInId, playerOutId)
    setPlayerOutId(null)
    reloadSquad()
  }

  const freeTransfers = profile?.free_transfers ?? 0

  return (
    <div className="space-y-4">
      {/* Transfer budget */}
      <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Free Transfers</p>
          <p className="text-xs text-muted-foreground">-3 pts for each extra</p>
        </div>
        <span className={cn(
          'text-2xl font-bold',
          freeTransfers > 0 ? 'text-primary' : 'text-destructive'
        )}>
          {freeTransfers}
        </span>
      </div>

      {/* Step 1: Pick player to drop */}
      <div>
        <p className="mb-1.5 text-sm font-semibold">1. Drop from your squad</p>
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {squad.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setPlayerOutId(sp.player_id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-left text-sm transition-colors',
                playerOutId === sp.player_id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
              )}
            >
              <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[sp.player?.position ?? ''])}>
                {sp.player?.position}
              </span>
              <span
                onClick={(e) => { e.stopPropagation(); if (sp.player) openPlayerStats(sp.player.id) }}
                className="truncate underline decoration-muted-foreground/30"
              >
                {sp.player?.name}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{sp.player?.club?.short_name}</span>
            </button>
          ))}
          {squad.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground">No players in squad</p>
          )}
        </div>
      </div>

      {/* Step 2: Pick free agent to add */}
      {playerOutId && (
        <div>
          <p className="mb-1.5 text-sm font-semibold">2. Pick up free agent</p>

          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search free agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-1">
              {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((pos) => (
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

            <div className="max-h-48 space-y-1 overflow-y-auto">
              {loading ? (
                <p className="py-2 text-center text-sm text-muted-foreground">Loading...</p>
              ) : (
                filteredAgents.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-md border px-3 py-1.5"
                  >
                    <button onClick={() => openPlayerStats(p.id)} className="flex items-center gap-2 min-w-0 text-left">
                      <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[p.position])}>
                        {p.position}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{p.club?.name}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleTransfer(p.id)}
                      disabled={submitting}
                      className="shrink-0 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {submitting ? '...' : freeTransfers > 0 ? 'Free' : '-3 pts'}
                    </button>
                  </div>
                ))
              )}
              {!loading && filteredAgents.length === 0 && (
                <p className="py-2 text-center text-sm text-muted-foreground">No free agents found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
