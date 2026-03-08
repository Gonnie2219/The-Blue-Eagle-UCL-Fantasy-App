import { useDraft } from '@/hooks/useDraft'
import { PlayerPool } from './PlayerPool'
import { DraftBoard } from './DraftBoard'
import { cn } from '@/lib/utils'

export function DraftRoom() {
  const {
    session,
    picks,
    availablePlayers,
    participants,
    loading,
    picking,
    pickError,
    isMyTurn,
    currentPickerUserId,
    makePick,
  } = useDraft()

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading draft...</div>
  }

  if (!session) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-lg font-semibold text-primary">No Active Draft</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The snake draft will begin when the admin starts a new session.
            After each matchday, a 48-hour waiver draft opens for free agents.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-2">Draft Rules</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Snake draft order (reverses each round)</li>
            <li>One owner per player</li>
            <li>Squad: 21 players total</li>
            <li>Bench: 1 GK, 3 DEF, 3 MID, 3 FWD</li>
          </ul>
        </div>
      </div>
    )
  }

  if (session.status === 'completed') {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-lg font-semibold text-primary">Draft Complete</p>
          <p className="mt-2 text-sm text-muted-foreground">
            All picks have been made. Head to My Team to set your lineup.
          </p>
        </div>
        <DraftBoard picks={picks} participants={participants}  />
      </div>
    )
  }

  const currentPicker = participants.find((p) => p.id === currentPickerUserId)

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className={cn(
        'rounded-lg p-4 text-center',
        isMyTurn ? 'bg-primary text-primary-foreground' : 'border bg-card'
      )}>
        <p className="text-lg font-bold">
          {isMyTurn ? "It's Your Pick!" : `${currentPicker?.display_name ?? '...'}'s Turn`}
        </p>
        <p className={cn('text-sm', isMyTurn ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
          Round {session.current_round} | Pick #{session.current_pick + 1} |{' '}
          {session.type === 'waiver' ? 'Waiver Draft' : 'Initial Draft'}
        </p>
      </div>

      {/* Pick error */}
      {pickError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-center text-sm text-destructive">
          Pick failed: {pickError}
        </div>
      )}

      {/* Participants */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {session.pick_order.map((uid) => {
          const p = participants.find((pr) => pr.id === uid)
          return (
            <div
              key={uid}
              className={cn(
                'shrink-0 rounded-md px-2 py-1 text-xs font-medium',
                uid === currentPickerUserId
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {p?.display_name ?? '...'}
            </div>
          )
        })}
      </div>

      {/* Player pool (only interactive on your turn) */}
      <div>
        <h3 className="mb-2 font-semibold">Available Players ({availablePlayers.length})</h3>
        <PlayerPool
          players={availablePlayers}
          onPick={makePick}
          canPick={isMyTurn}
          picking={picking}
        />
      </div>

      {/* Draft board */}
      <div>
        <h3 className="mb-2 font-semibold">Draft Board</h3>
        <DraftBoard picks={picks} participants={participants}  />
      </div>
    </div>
  )
}
