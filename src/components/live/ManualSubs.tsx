import { useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import type { SquadPlayer, Match, ManualSub } from '@/types'

const MAX_MANUAL_SUBS = 2

interface ManualSubsProps {
  squad: SquadPlayer[]
  matches: Match[]
  manualSubs: ManualSub[]
  onSub: (playerOutId: number, playerInId: number) => void
}

export function ManualSubs({ squad, matches, manualSubs, onSub }: ManualSubsProps) {
  const [playerOutId, setPlayerOutId] = useState<number | null>(null)
  const subsRemaining = MAX_MANUAL_SUBS - manualSubs.length

  // Tuesday starters whose match is finished
  const tuesdayMatches = matches.filter((m) => m.match_day_label === 'Tuesday')
  const tuesdayClubIds = new Set(
    tuesdayMatches.flatMap((m) => [m.home_club_id, m.away_club_id])
  )
  const tuesdayStarters = squad.filter(
    (s) => s.is_starter && s.player && tuesdayClubIds.has(s.player.club_id)
  )

  // Wednesday bench players whose match hasn't started
  const wednesdayMatches = matches.filter(
    (m) => m.match_day_label === 'Wednesday' && m.status === 'scheduled'
  )
  const wednesdayClubIds = new Set(
    wednesdayMatches.flatMap((m) => [m.home_club_id, m.away_club_id])
  )
  const wednesdayBench = squad.filter(
    (s) => !s.is_starter && s.player && wednesdayClubIds.has(s.player.club_id)
  )

  // Already subbed player IDs
  const alreadySubbedOut = new Set(manualSubs.map((s) => s.player_out_id))
  const alreadySubbedIn = new Set(manualSubs.map((s) => s.player_in_id))

  const eligibleOut = tuesdayStarters.filter((s) => !alreadySubbedOut.has(s.player_id))
  const eligibleIn = wednesdayBench.filter((s) => !alreadySubbedIn.has(s.player_id))

  if (subsRemaining <= 0 && manualSubs.length > 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold">Manual Subs (0 remaining)</p>
        {manualSubs.map((sub) => (
          <div key={sub.id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <ArrowDown className="h-3.5 w-3.5 text-destructive" />
            <span>{sub.player_out?.name}</span>
            <ArrowUp className="h-3.5 w-3.5 text-green-600" />
            <span>{sub.player_in?.name}</span>
          </div>
        ))}
      </div>
    )
  }

  if (tuesdayStarters.length === 0 || wednesdayBench.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Manual subs available between Tuesday and Wednesday matches.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Manual Subs</p>
        <span className="text-xs text-muted-foreground">{subsRemaining} remaining</span>
      </div>

      {/* Already made subs */}
      {manualSubs.map((sub) => (
        <div key={sub.id} className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
          <ArrowDown className="h-3.5 w-3.5 text-destructive" />
          <span>{sub.player_out?.name}</span>
          <ArrowUp className="h-3.5 w-3.5 text-green-600" />
          <span>{sub.player_in?.name}</span>
        </div>
      ))}

      {subsRemaining > 0 && (
        <>
          {/* Step 1: Pick Tuesday starter to sub out */}
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Sub out (Tuesday player)</p>
            <div className="space-y-1">
              {eligibleOut.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setPlayerOutId(sp.player_id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
                    playerOutId === sp.player_id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  )}
                >
                  <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[sp.player?.position ?? ''])}>
                    {sp.player?.position}
                  </span>
                  <span className="truncate">{sp.player?.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Pick Wednesday bench player to sub in */}
          {playerOutId && (
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Sub in (Wednesday bench)</p>
              <div className="space-y-1">
                {eligibleIn.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      onSub(playerOutId, sp.player_id)
                      setPlayerOutId(null)
                    }}
                    className="flex w-full items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[sp.player?.position ?? ''])}>
                      {sp.player?.position}
                    </span>
                    <span className="truncate">{sp.player?.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
