import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAdmin } from '@/hooks/useAdmin'
import { DraftManager } from '@/components/admin/DraftManager'
import { MatchdayManager } from '@/components/admin/MatchdayManager'
import { ScoreManager } from '@/components/admin/ScoreManager'
import { PlayerManager } from '@/components/admin/PlayerManager'
import { SquadAdmin } from '@/components/admin/SquadAdmin'

type Tab = 'draft' | 'matchdays' | 'scores' | 'players' | 'squads'

export default function Admin() {
  const { isAdmin, loading } = useAdmin()
  const [tab, setTab] = useState<Tab>('draft')

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <div className="py-8 text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-muted-foreground">You don't have admin access.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact the league admin to get permissions.
          </p>
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'draft', label: 'Draft' },
    { id: 'matchdays', label: 'Matchdays' },
    { id: 'scores', label: 'Scores' },
    { id: 'players', label: 'Players' },
    { id: 'squads', label: 'Squads' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      <div className="flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 rounded-lg py-2 text-xs font-medium transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground'
                : 'border text-muted-foreground hover:bg-accent'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'draft' && <DraftManager />}
      {tab === 'matchdays' && <MatchdayManager />}
      {tab === 'scores' && <ScoreManager />}
      {tab === 'players' && <PlayerManager />}
      {tab === 'squads' && <SquadAdmin />}
    </div>
  )
}
