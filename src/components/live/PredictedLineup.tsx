import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import type { Match, Player } from '@/types'

interface PredictedLineupProps {
  match: Match
  players: Player[]
}

export function PredictedLineup({ match, players }: PredictedLineupProps) {
  const homePlayers = players
    .filter((p) => p.club_id === match.home_club_id && p.is_available)
    .sort((a, b) => posOrder(a.position) - posOrder(b.position))
  const awayPlayers = players
    .filter((p) => p.club_id === match.away_club_id && p.is_available)
    .sort((a, b) => posOrder(a.position) - posOrder(b.position))

  return (
    <div className="rounded-lg border bg-card p-3 space-y-3">
      <p className="text-center text-xs font-semibold text-muted-foreground">
        Predicted Lineups
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Home */}
        <div>
          <p className="mb-1 text-xs font-semibold">{match.home_club?.short_name}</p>
          <div className="space-y-0.5">
            {homePlayers.slice(0, 11).map((p) => (
              <div key={p.id} className="flex items-center gap-1">
                <span className={cn('rounded px-1 text-[9px] font-bold', posColors[p.position])}>
                  {p.position}
                </span>
                <span className="truncate text-xs">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Away */}
        <div>
          <p className="mb-1 text-xs font-semibold">{match.away_club?.short_name}</p>
          <div className="space-y-0.5">
            {awayPlayers.slice(0, 11).map((p) => (
              <div key={p.id} className="flex items-center gap-1">
                <span className={cn('rounded px-1 text-[9px] font-bold', posColors[p.position])}>
                  {p.position}
                </span>
                <span className="truncate text-xs">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function posOrder(pos: string): number {
  return pos === 'GK' ? 0 : pos === 'DEF' ? 1 : pos === 'MID' ? 2 : 3
}
