import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { Match } from '@/types'

interface LiveMatchProps {
  match: Match
}

export function LiveMatch({ match }: LiveMatchProps) {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <div className={cn(
      'rounded-lg border bg-card px-4 py-3',
      isLive && 'border-primary/50 ring-1 ring-primary/20'
    )}>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>{match.match_day_label ?? ''}</span>
        <span className="flex items-center gap-1">
          {isLive && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />}
          {isLive ? 'LIVE' : isFinished ? 'FT' : format(new Date(match.kickoff_at), 'HH:mm')}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <p className="text-sm font-medium">{match.home_club?.short_name ?? 'HOME'}</p>
        </div>

        <div className="mx-4 flex items-center gap-2">
          <span className={cn(
            'text-2xl font-bold tabular-nums',
            isLive && 'text-primary'
          )}>
            {match.home_score}
          </span>
          <span className="text-muted-foreground">-</span>
          <span className={cn(
            'text-2xl font-bold tabular-nums',
            isLive && 'text-primary'
          )}>
            {match.away_score}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium">{match.away_club?.short_name ?? 'AWAY'}</p>
        </div>
      </div>
    </div>
  )
}
