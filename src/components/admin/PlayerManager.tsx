import { useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { Search } from 'lucide-react'
import { usePlayerAdmin } from '@/hooks/useAdmin'
import type { PlayerPosition } from '@/types'

export function PlayerManager() {
  const { players, clubs, loading, addClub, addPlayer, toggleAvailability } = usePlayerAdmin()
  const [tab, setTab] = useState<'players' | 'clubs'>('players')
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState<PlayerPosition | 'ALL'>('ALL')

  // Add player form
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerPos, setNewPlayerPos] = useState<PlayerPosition>('FWD')
  const [newPlayerClub, setNewPlayerClub] = useState<number>(0)

  // Add club form
  const [newClubName, setNewClubName] = useState('')
  const [newClubShort, setNewClubShort] = useState('')

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.club?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesPos = posFilter === 'ALL' || p.position === posFilter
    return matchesSearch && matchesPos
  })

  const handleAddPlayer = () => {
    if (!newPlayerName || !newPlayerClub) return
    addPlayer(newPlayerName, newPlayerPos, newPlayerClub)
    setNewPlayerName('')
  }

  const handleAddClub = () => {
    if (!newClubName || !newClubShort) return
    addClub(newClubName, newClubShort)
    setNewClubName('')
    setNewClubShort('')
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('players')}
          className={cn('flex-1 rounded-md py-1.5 text-xs font-medium', tab === 'players' ? 'bg-primary text-primary-foreground' : 'border')}
        >
          Players ({players.length})
        </button>
        <button
          onClick={() => setTab('clubs')}
          className={cn('flex-1 rounded-md py-1.5 text-xs font-medium', tab === 'clubs' ? 'bg-primary text-primary-foreground' : 'border')}
        >
          Clubs ({clubs.length})
        </button>
      </div>

      {tab === 'players' && (
        <div className="space-y-3">
          {/* Add player form */}
          <div className="space-y-1.5 rounded-lg border bg-card p-3">
            <p className="text-xs font-semibold">Add Player</p>
            <input
              placeholder="Player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="grid grid-cols-2 gap-1.5">
              <select value={newPlayerPos} onChange={(e) => setNewPlayerPos(e.target.value as PlayerPosition)} className="rounded border px-2 py-1.5 text-xs">
                <option value="GK">GK</option>
                <option value="DEF">DEF</option>
                <option value="MID">MID</option>
                <option value="FWD">FWD</option>
              </select>
              <select value={newPlayerClub} onChange={(e) => setNewPlayerClub(Number(e.target.value))} className="rounded border px-2 py-1.5 text-xs">
                <option value={0}>Select club</option>
                {clubs.map((c) => <option key={c.id} value={c.id}>{c.short_name}</option>)}
              </select>
            </div>
            <button
              onClick={handleAddPlayer}
              disabled={!newPlayerName || !newPlayerClub}
              className="w-full rounded bg-primary py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
            >
              Add Player
            </button>
          </div>

          {/* Search + filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search..."
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
                className={cn('flex-1 rounded-md px-2 py-1.5 text-xs font-medium', posFilter === pos ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Players list */}
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {filteredPlayers.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md border px-3 py-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[p.position])}>
                    {p.position}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm">{p.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{p.club?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAvailability(p.id, !p.is_available)}
                  className={cn(
                    'shrink-0 rounded px-2 py-0.5 text-[10px] font-medium',
                    p.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  )}
                >
                  {p.is_available ? 'Available' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'clubs' && (
        <div className="space-y-3">
          {/* Add club */}
          <div className="space-y-1.5 rounded-lg border bg-card p-3">
            <p className="text-xs font-semibold">Add Club</p>
            <div className="grid grid-cols-2 gap-1.5">
              <input placeholder="Full name" value={newClubName} onChange={(e) => setNewClubName(e.target.value)} className="rounded border px-2 py-1.5 text-xs" />
              <input placeholder="Short (e.g. BAR)" value={newClubShort} onChange={(e) => setNewClubShort(e.target.value)} className="rounded border px-2 py-1.5 text-xs" />
            </div>
            <button onClick={handleAddClub} disabled={!newClubName || !newClubShort} className="w-full rounded bg-primary py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">
              Add Club
            </button>
          </div>

          {/* Clubs list */}
          <div className="space-y-1">
            {clubs.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.short_name} | Stage: {c.ucl_stage}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {players.filter((p) => p.club_id === c.id).length} players
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
