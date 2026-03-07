import { Crown, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { posColors } from '@/lib/constants'
import type { SquadPlayer, PlayerScore } from '@/types'

interface LiveScoreboardProps {
  squad: SquadPlayer[]
  scores: PlayerScore[]
}

export function LiveScoreboard({ squad, scores }: LiveScoreboardProps) {
  const starters = squad.filter((s) => s.is_starter)
  const bench = squad.filter((s) => !s.is_starter)
  const scoreMap = new Map(scores.map((s) => [s.player_id, s]))

  const captain = starters.find((s) => s.is_captain)

  // Captain DNP check: if captain has 0 minutes, vice gets x2
  const captainScore = captain ? scoreMap.get(captain.player_id) : null
  const captainDNP = captain ? (captainScore ? captainScore.minutes_played === 0 : true) : false

  const getPoints = (sp: SquadPlayer): number => {
    const ps = scoreMap.get(sp.player_id)
    if (!ps) return 0
    let pts = ps.total_points
    if (sp.is_captain && !captainDNP) pts *= 2
    if (sp.is_vice_captain && captainDNP) pts *= 2
    return pts
  }

  const totalPoints = starters.reduce((sum, s) => sum + getPoints(s), 0)

  return (
    <div className="space-y-3">
      {/* Total */}
      <div className="rounded-lg bg-primary p-4 text-center text-primary-foreground">
        <p className="text-sm opacity-80">Matchday Points</p>
        <p className="text-4xl font-bold tabular-nums">{totalPoints}</p>
      </div>

      {/* Starters */}
      <div>
        <p className="mb-1 text-xs font-semibold text-muted-foreground">STARTING XI</p>
        <div className="space-y-1">
          {starters.map((sp) => (
            <PlayerScoreRow
              key={sp.id}
              squadPlayer={sp}
              points={getPoints(sp)}
              score={scoreMap.get(sp.player_id)}
              captainDNP={captainDNP}
            />
          ))}
        </div>
      </div>

      {/* Bench */}
      <div>
        <p className="mb-1 text-xs font-semibold text-muted-foreground">BENCH</p>
        <div className="space-y-1">
          {bench.map((sp) => (
            <PlayerScoreRow
              key={sp.id}
              squadPlayer={sp}
              points={0}
              score={scoreMap.get(sp.player_id)}
              captainDNP={captainDNP}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PlayerScoreRow({
  squadPlayer,
  points,
  score,
  captainDNP,
}: {
  squadPlayer: SquadPlayer
  points: number
  score?: PlayerScore
  captainDNP: boolean
}) {
  const { player, is_captain, is_vice_captain, is_starter } = squadPlayer
  if (!player) return null

  const hasPlayed = score && score.minutes_played > 0
  const isMultiplied = (is_captain && !captainDNP) || (is_vice_captain && captainDNP)

  return (
    <div className={cn(
      'flex items-center justify-between rounded-md border px-3 py-1.5',
      !is_starter && 'opacity-60'
    )}>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={cn('rounded px-1 py-0.5 text-[10px] font-bold', posColors[player.position])}>
          {player.position}
        </span>
        {is_captain && <Crown className="h-3 w-3 text-primary" />}
        {is_vice_captain && <Star className="h-3 w-3 text-primary" />}
        <span className="truncate text-sm">{player.name}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {score && (
          <div className="flex gap-1 text-[10px] text-muted-foreground">
            {score.goals > 0 && <span>G:{score.goals}</span>}
            {score.assists > 0 && <span>A:{score.assists}</span>}
            {score.clean_sheet && <span>CS</span>}
            {score.motm && <span>MotM</span>}
          </div>
        )}
        <span className={cn(
          'min-w-[2rem] text-right text-sm font-bold tabular-nums',
          hasPlayed ? 'text-foreground' : 'text-muted-foreground',
          isMultiplied && 'text-primary'
        )}>
          {is_starter ? points : '--'}
          {isMultiplied && is_starter && <span className="text-[10px]">x2</span>}
        </span>
      </div>
    </div>
  )
}
