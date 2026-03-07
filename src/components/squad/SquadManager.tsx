import { useSquad, validateFormation } from '@/hooks/useSquad'
import { FormationView } from './FormationView'
import { PlayerCard } from './PlayerCard'

export function SquadManager() {
  const {
    squad,
    starters,
    bench,
    profile,
    loading,
    toggleStarter,
    setCaptain,
    setViceCaptain,
  } = useSquad()

  if (loading) {
    return <div className="py-8 text-center text-muted-foreground">Loading squad...</div>
  }

  if (squad.length === 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Points" value={profile?.total_points ?? 0} />
          <StatCard label="League Rank" value="--" />
          <StatCard label="Free Transfers" value={profile?.free_transfers ?? 3} />
          <StatCard label="Matchday Pts" value="--" />
        </div>
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">
            Your 21-player squad will appear here after the draft.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">11 Starters | 10 Bench</p>
        </div>
      </div>
    )
  }

  const formationError = validateFormation(starters)

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Points" value={profile?.total_points ?? 0} />
        <StatCard label="League Rank" value="--" />
        <StatCard label="Free Transfers" value={profile?.free_transfers ?? 3} />
        <StatCard label="Squad Size" value={`${squad.length}/21`} />
      </div>

      {/* Formation error */}
      {formationError && starters.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {formationError}
        </div>
      )}

      {/* Formation pitch view */}
      {starters.length > 0 && <FormationView starters={starters} />}

      {/* Starting XI list */}
      <div>
        <h3 className="mb-2 font-semibold">Starting XI ({starters.length}/11)</h3>
        <div className="space-y-1">
          {starters.map((sp) => (
            <PlayerCard
              key={sp.id}
              squadPlayer={sp}
              onToggleStarter={() => toggleStarter(sp.id, false)}
              onSetCaptain={() => setCaptain(sp.id)}
              onSetViceCaptain={() => setViceCaptain(sp.id)}
            />
          ))}
        </div>
      </div>

      {/* Bench list */}
      <div>
        <h3 className="mb-2 font-semibold">Bench ({bench.length}/10)</h3>
        <div className="space-y-1">
          {bench.map((sp) => (
            <PlayerCard
              key={sp.id}
              squadPlayer={sp}
              onToggleStarter={() => toggleStarter(sp.id, true)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
