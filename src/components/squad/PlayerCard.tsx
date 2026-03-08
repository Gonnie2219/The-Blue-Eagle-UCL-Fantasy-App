import { Crown, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColorsWithBorder as posColors } from '@/lib/constants'
import { usePlayerStats } from '@/contexts/PlayerStatsContext'
import type { SquadPlayer } from '@/types'

interface PlayerCardProps {
  squadPlayer: SquadPlayer
  onToggleStarter?: () => void
  onSetCaptain?: () => void
  onSetViceCaptain?: () => void
  compact?: boolean
}

export function PlayerCard({
  squadPlayer,
  onToggleStarter,
  onSetCaptain,
  onSetViceCaptain,
  compact,
}: PlayerCardProps) {
  const { openPlayerStats } = usePlayerStats()
  const { player, is_captain, is_vice_captain, is_starter } = squadPlayer
  if (!player) return null

  if (compact) {
    return (
      <button
        onClick={() => openPlayerStats(player.id)}
        className={cn(
          'flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs text-left',
          posColors[player.position]
        )}
      >
        {is_captain && <Crown className="h-3 w-3" />}
        {is_vice_captain && <Star className="h-3 w-3" />}
        <span className="truncate font-medium">{player.name}</span>
      </button>
    )
  }

  return (
    <div className={cn(
      'flex items-center justify-between rounded-lg border bg-card px-3 py-2',
      is_captain && 'ring-2 ring-primary',
      is_vice_captain && 'ring-1 ring-primary/50'
    )}>
      <button onClick={() => openPlayerStats(player.id)} className="flex items-center gap-2 min-w-0 text-left">
        <span className={cn('rounded px-1.5 py-0.5 text-xs font-bold', posColors[player.position])}>
          {player.position}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            {is_captain && <Crown className="h-3.5 w-3.5 text-primary" />}
            {is_vice_captain && <Star className="h-3.5 w-3.5 text-primary" />}
            <p className="truncate text-sm font-medium">{player.name}</p>
          </div>
          <p className="truncate text-xs text-muted-foreground">{player.club?.name}</p>
        </div>
      </button>

      <div className="flex shrink-0 gap-1">
        {onSetCaptain && is_starter && !is_captain && (
          <button
            onClick={onSetCaptain}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Set Captain"
          >
            <Crown className="h-3.5 w-3.5" />
          </button>
        )}
        {onSetViceCaptain && is_starter && !is_vice_captain && (
          <button
            onClick={onSetViceCaptain}
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            title="Set Vice Captain"
          >
            <Star className="h-3.5 w-3.5" />
          </button>
        )}
        {onToggleStarter && (
          <button
            onClick={onToggleStarter}
            className={cn(
              'rounded px-2 py-0.5 text-xs font-medium',
              is_starter
                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            )}
          >
            {is_starter ? 'Bench' : 'Start'}
          </button>
        )}
      </div>
    </div>
  )
}
