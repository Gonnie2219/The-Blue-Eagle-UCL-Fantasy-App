import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import { useSquadAdmin } from '@/hooks/useAdmin'

export function SquadAdmin() {
  const { users, squadPlayers, selectedUserId, loading, loadSquad, removeFromSquad } = useSquadAdmin()

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="space-y-3">
      {/* User selector */}
      <div className="rounded-lg border bg-card p-3">
        <p className="mb-1.5 text-xs font-semibold">Select User</p>
        <select
          value={selectedUserId ?? ''}
          onChange={(e) => e.target.value && loadSquad(e.target.value)}
          className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Choose a user...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.display_name || u.id.slice(0, 8)}
            </option>
          ))}
        </select>
      </div>

      {/* Squad list */}
      {selectedUserId && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Squad ({squadPlayers.length} players)
          </p>
          {squadPlayers.length === 0 && (
            <p className="rounded-lg border py-4 text-center text-sm text-muted-foreground">
              No players in squad.
            </p>
          )}
          <div className="max-h-80 space-y-1 overflow-y-auto">
            {squadPlayers.map((sp) => (
              <div key={sp.id} className="flex items-center justify-between rounded-md border px-3 py-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[sp.player.position])}>
                    {sp.player.position}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm">{sp.player.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {sp.player.club?.name}
                      {sp.is_captain && ' | C'}
                      {sp.is_vice_captain && ' | VC'}
                      {!sp.is_starter && ' | Bench'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromSquad(sp.user_id, sp.player_id)}
                  className="shrink-0 rounded bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
