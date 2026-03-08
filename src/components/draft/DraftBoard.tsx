import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import type { DraftPick, Profile } from '@/types'

interface DraftBoardProps {
  picks: DraftPick[]
  participants: Profile[]
}

export function DraftBoard({ picks, participants }: DraftBoardProps) {
  const profileMap = new Map(participants.map((p) => [p.id, p.display_name]))

  // Group picks by round
  const rounds = new Map<number, DraftPick[]>()
  for (const pick of picks) {
    const existing = rounds.get(pick.round) ?? []
    existing.push(pick)
    rounds.set(pick.round, existing)
  }

  if (picks.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">No picks yet. The first pick hasn't been made.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {Array.from(rounds.entries()).map(([round, roundPicks]) => (
        <div key={round}>
          <p className="mb-1 text-xs font-semibold text-muted-foreground">Round {round}</p>
          <div className="space-y-1">
            {roundPicks.map((pick) => (
              <div
                key={pick.id}
                className={cn(
                  'flex items-center justify-between rounded-md border px-3 py-1.5 text-sm',
                  round % 2 === 0 ? 'flex-row-reverse' : ''
                )}
              >
                <span className="font-medium">
                  {profileMap.get(pick.user_id) ?? 'Unknown'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={cn(
                    'rounded px-1 py-0.5 text-[10px] font-bold',
                    pick.player?.position && posColors[pick.player.position],
                  )}>
                    {pick.player?.position}
                  </span>
                  <span>{pick.player?.name}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
