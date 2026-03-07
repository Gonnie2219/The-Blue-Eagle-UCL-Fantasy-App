import { useState } from 'react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { useUserSquad } from '@/hooks/useTrades'
import { useSquad } from '@/hooks/useSquad'
import type { Profile } from '@/types'

interface NewTradeFormProps {
  users: Profile[]
  onPropose: (receiverId: string, myPlayerId: number, theirPlayerId: number) => void
  submitting: boolean
}

export function NewTradeForm({ users, onPropose, submitting }: NewTradeFormProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [myPlayerId, setMyPlayerId] = useState<number | null>(null)
  const [theirPlayerId, setTheirPlayerId] = useState<number | null>(null)

  const { squad: mySquad } = useSquad()
  const { squad: theirSquad, loading: theirLoading } = useUserSquad(selectedUser)

  const handleSubmit = () => {
    if (selectedUser && myPlayerId && theirPlayerId) {
      onPropose(selectedUser, myPlayerId, theirPlayerId)
      setSelectedUser(null)
      setMyPlayerId(null)
      setTheirPlayerId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Step 1: Pick opponent */}
      <div>
        <p className="mb-1.5 text-sm font-semibold">1. Select opponent</p>
        <div className="flex flex-wrap gap-1">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => { setSelectedUser(u.id); setTheirPlayerId(null) }}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                selectedUser === u.id
                  ? 'bg-primary text-primary-foreground'
                  : 'border hover:bg-accent'
              )}
            >
              {u.display_name}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Pick your player to give */}
      <div>
        <p className="mb-1.5 text-sm font-semibold">2. Your player to give</p>
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {mySquad.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setMyPlayerId(sp.player_id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-left text-sm transition-colors',
                myPlayerId === sp.player_id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
              )}
            >
              <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[sp.player?.position ?? ''])}>
                {sp.player?.position}
              </span>
              <span className="truncate">{sp.player?.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{sp.player?.club?.short_name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Pick their player to receive */}
      {selectedUser && (
        <div>
          <p className="mb-1.5 text-sm font-semibold">3. Their player you want</p>
          {theirLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : theirSquad.length === 0 ? (
            <p className="text-sm text-muted-foreground">This user has no players.</p>
          ) : (
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {theirSquad.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setTheirPlayerId(sp.player_id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-left text-sm transition-colors',
                    theirPlayerId === sp.player_id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  )}
                >
                  <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[sp.player?.position ?? ''])}>
                    {sp.player?.position}
                  </span>
                  <span className="truncate">{sp.player?.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{sp.player?.club?.short_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!selectedUser || !myPlayerId || !theirPlayerId || submitting}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {submitting ? 'Proposing...' : 'Propose Trade'}
      </button>
    </div>
  )
}
