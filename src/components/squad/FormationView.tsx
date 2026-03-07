import type { SquadPlayer } from '@/types'
import { PlayerCard } from './PlayerCard'

interface FormationViewProps {
  starters: SquadPlayer[]
}

export function FormationView({ starters }: FormationViewProps) {
  const gk = starters.filter((s) => s.player?.position === 'GK')
  const def = starters.filter((s) => s.player?.position === 'DEF')
  const mid = starters.filter((s) => s.player?.position === 'MID')
  const fwd = starters.filter((s) => s.player?.position === 'FWD')

  const formation = `${def.length}-${mid.length}-${fwd.length}`

  return (
    <div className="space-y-2">
      <p className="text-center text-xs font-semibold text-muted-foreground">
        Formation: {formation}
      </p>
      <div className="rounded-lg border bg-gradient-to-b from-green-900/20 to-green-800/10 p-3">
        {/* FWD row */}
        <div className="mb-2 flex justify-center gap-1">
          {fwd.map((s) => <PlayerCard key={s.id} squadPlayer={s} compact />)}
        </div>
        {/* MID row */}
        <div className="mb-2 flex justify-center gap-1">
          {mid.map((s) => <PlayerCard key={s.id} squadPlayer={s} compact />)}
        </div>
        {/* DEF row */}
        <div className="mb-2 flex justify-center gap-1">
          {def.map((s) => <PlayerCard key={s.id} squadPlayer={s} compact />)}
        </div>
        {/* GK row */}
        <div className="flex justify-center gap-1">
          {gk.map((s) => <PlayerCard key={s.id} squadPlayer={s} compact />)}
        </div>
      </div>
    </div>
  )
}
